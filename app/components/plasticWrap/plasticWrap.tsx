import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface PlasticWrapHandle {
    /** Call on pointer down: grabs the nearest cloth point to the given client (viewport) coordinates. */
    grab: (clientX: number, clientY: number) => void;
    /**
     * Call on pointer move with the live screen-space pull delta (dx, dy in CSS px) to drag the grabbed point.
     * Call on pointer up with just a progress value and no dx/dy: 0 releases the grab (cloth springs back
     * to its resting drape), 1 confirms the peel (the whole cover unpins and falls/flies away).
     */
    setTarget: (progress: number, dx?: number, dy?: number) => void;
}

interface PlasticWrapProps {
    /** width / height of the frame the cloth drapes over */
    aspect: number;
    className?: string;
}

// Loaded at runtime instead of bundled, per project requirement.
const THREE_CDN_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// Ashima Arts / Stefan Gustavson 2D simplex noise (MIT) - used for subtle fabric grain.
const GLSL_NOISE = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
`;

// Real per-vertex normals from the simulated mesh (no procedural bend hack) - lit as opaque white fabric,
// with soft "wrap" lighting so shadowed folds don't go pure black, plus a little grain for texture.
const CLOTH_VERTEX_SHADER = `
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const CLOTH_FRAGMENT_SHADER = `
    varying vec3 vNormal;
    varying vec2 vUv;

    ${GLSL_NOISE}

    void main() {
        vec3 n = normalize(vNormal);

        if (!gl_FrontFacing) {
            n = -n;
        }

        // Fixed directional light
        vec3 lightDir = normalize(vec3(-0.45, 0.65, 0.75));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);

        float NdotL = max(dot(n, lightDir), 0.0);
        float NdotV = max(dot(n, viewDir), 0.0);

        // Soft diffuse lighting
        float diffuse = 0.35 + 0.65 * NdotL;

        // Broad plastic reflection
        vec3 halfDir = normalize(lightDir + viewDir);

        float specBroad = pow(
            max(dot(n, halfDir), 0.0),
            12.0
        ) * 0.30;

        // Sharp glossy highlight
        float specSharp = pow(
            max(dot(n, halfDir), 0.0),
            100.0
        ) * 1.20;

        // Fresnel: stronger reflections near grazing angles
        float fresnel = 0.04 + 0.96 * pow(
            1.0 - NdotV,
            5.0
        );

        float reflection = specBroad + specSharp
                         + fresnel * 0.18;

        // Very subtle surface grain
        float grain = snoise(vUv * 120.0) * 0.003;

        vec3 baseColor = vec3(0.97, 0.975, 0.98);

        vec3 color = baseColor * diffuse
                   + vec3(1.0) * reflection
                   + grain;

        color = clamp(color, 0.0, 1.0);

        // More visible plastic surface
        gl_FragColor = vec4(color, 0.25);
    }
`;

interface Particle {
    x: number; y: number; z: number;
    px: number; py: number; pz: number;
    pinned: boolean;
    pinX: number; pinY: number; pinZ: number;
}

interface Constraint { i1: number; i2: number; restLength: number; stiffness: number; }

const GRID_COLS = 30;
const GRID_ROWS = 24;
const CLOTH_WIDTH_SCALE = 1.4; // extra fabric width beyond the frame so it buckles into folds
const CLOTH_TOP_Y = 0.62; // pinned above the visible frame top (hidden behind the bezel)
const CLOTH_BOTTOM_Y = -0.58; // hangs slightly past the bottom edge for full coverage
const GRAVITY = 2.2;
const DAMPING = 0.985;
const SOLVER_ITERATIONS = 15;
const SUBSTEPS = 3;

function buildCloth(aspect: number) {
    const cols = GRID_COLS + 1;
    const rows = GRID_ROWS + 1;
    const clothWidth = aspect * CLOTH_WIDTH_SCALE;
    const height = CLOTH_TOP_Y - CLOTH_BOTTOM_Y;

    const particles: Particle[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = -clothWidth / 2 + (c / GRID_COLS) * clothWidth;
            const y = CLOTH_TOP_Y - (r / GRID_ROWS) * height;
            const fold = Math.sin(c * 0.7 + r * 0.35) * 0.035;
            const noise = (Math.random() - 0.5) * 0.025;
            const z = fold + noise;
            particles.push({ x, y, z, px: x, py: y, pz: z, pinned: false, pinX: x, pinY: y, pinZ: z });
        }
    }

    // pin two points near the top corners (not the full edge) so it drapes/folds like real cloth
    const idx = (c: number, r: number) => r * cols + c;
    const pinCols = [
        Math.round(GRID_COLS * 0.00),
        Math.round(GRID_COLS * 0.275),
        Math.round(GRID_COLS * 0.5),
        Math.round(GRID_COLS * 0.725),
        Math.round(GRID_COLS * 1.00),
    ];

    const permanentPins = pinCols.map(c => idx(c, 0));

    for (let k = 0; k < permanentPins.length; k++) {
        const p = particles[permanentPins[k]];

        p.pinned = true;
        p.pinX = aspect * 1.22 * (
            pinCols[k] / GRID_COLS - 0.5
        );
        p.pinY = CLOTH_TOP_Y;
        p.pinZ = p.z;

        p.x = p.px = p.pinX;
        p.y = p.py = p.pinY;
        p.z = p.pz = p.pinZ;
    }

    const constraints: Constraint[] = [];
    const addConstraint = (i1: number, i2: number, stiffness: number) => {
        const p1 = particles[i1];
        const p2 = particles[i2];
        const restLength = Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
        constraints.push({ i1, i2, restLength, stiffness });
    };
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const i0 = idx(c, r);
            if (c < cols - 1)
                addConstraint(i0, idx(c + 1, r), 0.98);

            if (r < rows - 1)
                addConstraint(i0, idx(c, r + 1), 0.98);

            if (c < cols - 1 && r < rows - 1) {
                addConstraint(i0, idx(c + 1, r + 1), 0.65);
                addConstraint(idx(c + 1, r), idx(c, r + 1), 0.65);
            }

            if (c < cols - 2)
                addConstraint(i0, idx(c + 2, r), 0.25);

            if (r < rows - 2)
                addConstraint(i0, idx(c, r + 2), 0.25);
        }
    }

    const indices: number[] = [];
    for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
            const i0 = idx(c, r), i1 = idx(c + 1, r), i2 = idx(c, r + 1), i3 = idx(c + 1, r + 1);
            indices.push(i0, i2, i1, i1, i2, i3);
        }
    }

    const uvs = new Float32Array(cols * rows * 2);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            uvs[idx(c, r) * 2] = c / GRID_COLS;
            uvs[idx(c, r) * 2 + 1] = 1 - r / GRID_ROWS;
        }
    }

    return { particles, constraints, indices, uvs, cols, rows, clothWidth, permanentPins };
}

function stepCloth(particles: Particle[], constraints: Constraint[], dt: number) {
    const dt2 = dt * dt;
    for (const p of particles) {
        if (p.pinned) {
            p.x = p.pinX; p.y = p.pinY; p.z = p.pinZ;
            continue;
        }
        const vx = (p.x - p.px) * DAMPING;
        const vy = (p.y - p.py) * DAMPING;
        const vz = (p.z - p.pz) * DAMPING;
        p.px = p.x; p.py = p.y; p.pz = p.z;
        p.x += vx;
        p.y += vy - GRAVITY * dt2;
        p.z += vz;
    }

    for (let iter = 0; iter < SOLVER_ITERATIONS; iter++) {
        for (const c of constraints) {
            const p1 = particles[c.i1];
            const p2 = particles[c.i2];
            const dx = p2.x - p1.x, dy = p2.y - p1.y, dz = p2.z - p1.z;
            const dist = Math.hypot(dx, dy, dz) || 0.00001;
            const diff = ((dist - c.restLength) / dist) * 0.5 * c.stiffness;
            const ox = dx * diff, oy = dy * diff, oz = dz * diff;
            if (!p1.pinned && !p2.pinned) {
                p1.x += ox; p1.y += oy; p1.z += oz;
                p2.x -= ox; p2.y -= oy; p2.z -= oz;
            } else if (p1.pinned && !p2.pinned) {
                p2.x -= ox * 2; p2.y -= oy * 2; p2.z -= oz * 2;
            } else if (!p1.pinned && p2.pinned) {
                p1.x += ox * 2; p1.y += oy * 2; p1.z += oz * 2;
            }
        }
        for (const p of particles) {
            if (p.pinned) { p.x = p.pinX; p.y = p.pinY; p.z = p.pinZ; }
        }
    }
}

const PlasticWrap = forwardRef<PlasticWrapHandle, PlasticWrapProps>(function PlasticWrap({ aspect, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const aspectRef = useRef(aspect);
    aspectRef.current = aspect;

    const clothRef = useRef<ReturnType<typeof buildCloth> | null>(null);
    const grabIndexRef = useRef<number | null>(null);
    const grabRestRef = useRef({ x: 0, y: 0 });
    const flingRef = useRef<{ x: number; y: number } | null>(null);

    useImperativeHandle(ref, () => ({
        grab: (clientX: number, clientY: number) => {
            const cloth = clothRef.current;
            const container = containerRef.current;
            if (!cloth || !container) return;
            const rect = container.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const localX = ((clientX - rect.left) / rect.width - 0.5) * aspectRef.current;
            const localY = 0.5 - (clientY - rect.top) / rect.height;

            let bestIdx = -1;
            let bestDist = Infinity;
            cloth.particles.forEach((p, i) => {
                if (cloth.permanentPins.includes(i)) return;
                const d = (p.x - localX) ** 2 + (p.y - localY) ** 2;
                if (d < bestDist) { bestDist = d; bestIdx = i; }
            });
            if (bestIdx >= 0) {
                grabIndexRef.current = bestIdx;
                grabRestRef.current = { x: cloth.particles[bestIdx].x, y: cloth.particles[bestIdx].y };
            }
        },
        setTarget: (progress: number, dx?: number, dy?: number) => {
            const cloth = clothRef.current;
            const container = containerRef.current;
            if (dx !== undefined && dy !== undefined) {
                if (cloth && container && grabIndexRef.current !== null) {
                    const rect = container.getBoundingClientRect();
                    const localDX = rect.width ? (dx / rect.width) * aspectRef.current : 0;
                    const localDY = rect.height ? dy / rect.height : 0;
                    const p = cloth.particles[grabIndexRef.current];
                    p.pinned = true;
                    p.pinX = grabRestRef.current.x + localDX;
                    p.pinY = grabRestRef.current.y + localDY;
                    p.pinZ = 0.18;
                }
                return;
            }
            // release (no dx/dy supplied): let go of the grabbed point
            if (cloth && grabIndexRef.current !== null) {
                const p = cloth.particles[grabIndexRef.current];
                const fling = progress >= 1 ? { x: p.pinX - grabRestRef.current.x, y: p.pinY - grabRestRef.current.y } : null;
                p.pinned = false;
                if (fling) flingRef.current = fling;
            }
            grabIndexRef.current = null;
        },
    }), []);

    useEffect(() => {
        let disposed = false;
        let renderer: any;
        let resizeObserver: ResizeObserver | undefined;
        let rafId = 0;

        (async () => {
            const container = containerRef.current;
            if (!container) return;

            let THREE: any;
            try {
                THREE = await import(/* @vite-ignore */ THREE_CDN_URL);
            } catch {
                return; // CDN unreachable - skip the cloth rather than crash the page
            }
            if (disposed || !containerRef.current) return;

            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-aspect / 2, aspect / 2, 0.5, -0.5, 0.1, 10);
            camera.position.z = 2;

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            const cloth = buildCloth(aspect);
            clothRef.current = cloth;
            const { particles, constraints, cols, rows } = cloth;

            const positions = new Float32Array(particles.length * 3);
            const normals = new Float32Array(particles.length * 3);

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
            geometry.setAttribute('uv', new THREE.BufferAttribute(cloth.uvs, 2));
            geometry.setIndex(cloth.indices);

            const material = new THREE.ShaderMaterial({
                vertexShader: CLOTH_VERTEX_SHADER,
                fragmentShader: CLOTH_FRAGMENT_SHADER,
                side: THREE.DoubleSide,
                transparent: true,
                depthWrite: false,
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            function syncBuffers() {
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    positions[i * 3] = p.x;
                    positions[i * 3 + 1] = p.y;
                    positions[i * 3 + 2] = p.z;
                }
                normals.fill(0);
                const idx = cloth.indices;
                for (let i = 0; i < idx.length; i += 3) {
                    const ia = idx[i], ib = idx[i + 1], ic = idx[i + 2];
                    const ax = positions[ia * 3], ay = positions[ia * 3 + 1], az = positions[ia * 3 + 2];
                    const bx = positions[ib * 3], by = positions[ib * 3 + 1], bz = positions[ib * 3 + 2];
                    const cx = positions[ic * 3], cy = positions[ic * 3 + 1], cz = positions[ic * 3 + 2];
                    const v1x = bx - ax, v1y = by - ay, v1z = bz - az;
                    const v2x = cx - ax, v2y = cy - ay, v2z = cz - az;
                    const nx = v1y * v2z - v1z * v2y;
                    const ny = v1z * v2x - v1x * v2z;
                    const nz = v1x * v2y - v1y * v2x;
                    for (const ii of [ia, ib, ic]) {
                        normals[ii * 3] += nx; normals[ii * 3 + 1] += ny; normals[ii * 3 + 2] += nz;
                    }
                }
                for (let i = 0; i < particles.length; i++) {
                    const nx = normals[i * 3], ny = normals[i * 3 + 1], nz = normals[i * 3 + 2];
                    const len = Math.hypot(nx, ny, nz);
                    if (len > 1e-5) {
                        normals[i * 3] = nx / len; normals[i * 3 + 1] = ny / len; normals[i * 3 + 2] = nz / len;
                    } else {
                        normals[i * 3 + 2] = 1;
                    }
                }
                geometry.attributes.position.needsUpdate = true;
                geometry.attributes.normal.needsUpdate = true;
            }

            function resize() {
                const el = containerRef.current;
                if (!el || !renderer) return;
                const { clientWidth, clientHeight } = el;
                if (!clientWidth || !clientHeight) return;
                renderer.setSize(clientWidth, clientHeight);
            }
            resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(container);
            resize();

            // settle the cloth into its resting drape before the first paint
            for (let i = 0; i < 80; i++) stepCloth(particles, constraints, 1 / 60);

            let lastTime = performance.now();
            function tick(now: number) {
                rafId = requestAnimationFrame(tick);
                const dt = Math.min((now - lastTime) / 1000, 1 / 30);
                lastTime = now;

                if (flingRef.current) {
                    const { x, y } = flingRef.current;
                    const mag = Math.hypot(x, y) || 1;
                    for (const i of cloth.permanentPins) particles[i].pinned = false;
                    for (const p of particles) {
                        p.px = p.x - (x / mag) * 0.05;
                        p.py = p.y - (y / mag) * 0.05 - 0.02;
                    }
                    flingRef.current = null;
                }

                const subDt = dt / SUBSTEPS;
                for (let i = 0; i < SUBSTEPS; i++) stepCloth(particles, constraints, subDt);

                void cols; void rows;
                syncBuffers();
                renderer.render(scene, camera);
            }
            rafId = requestAnimationFrame(tick);
        })();

        return () => {
            disposed = true;
            cancelAnimationFrame(rafId);
            resizeObserver?.disconnect();
            if (renderer) {
                renderer.dispose();
                renderer.domElement.remove();
            }
        };
    }, [aspect]);

    return <div ref={containerRef} className={className} />;
});

export default PlasticWrap;

