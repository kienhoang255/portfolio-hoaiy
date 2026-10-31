import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PlasticWrapHandle {
    /** Call on pointer down: grabs the nearest cloth point to the given client (viewport) coordinates. */
    grab: (clientX: number, clientY: number) => void;
    /**
     * Call on pointer move with the live screen-space pull delta (dx, dy in CSS px) to drag the grabbed point.
     * Call on pointer up with just a progress value and no dx/dy: 0 releases the grab (cloth springs back
     * to its resting drape), 1 confirms the peel (the whole cover unpins and falls/flies away).
     */
    setTarget: (progress: number, dx?: number, dy?: number) => void;
    /** True once the peel threshold (~190 CSS px) has been crossed and the cloth is flying off. */
    isPeeled: () => boolean;
}

interface PlasticWrapProps {
    /** width / height of the frame the cloth drapes over */
    aspect: number;
    className?: string;
    onSetUnwrapped: (value: boolean) => void
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
const CLOTH_WIDTH_SCALE = 1.06; // extra fabric width beyond the frame so it buckles into folds
const CLOTH_TOP_Y = 0.5;
const CLOTH_BOTTOM_Y = -0.5;
const GRAVITY = 2.2;
const DAMPING = 0.985;
const SOLVER_ITERATIONS = 15;
const SUBSTEPS = 3;

// Auto-burst threshold: ~5 cm on screen at 1x density == 190 CSS px.
// Measured from the actual pointer-down position (grab start), independent
// of container size so behaviour is consistent across screens.
export const PEEL_THRESHOLD_VW = 25;

// --- Fling tuning -----------------------------------------------------------
// Vận tốc ném được đo từ TỐC ĐỘ TAY thật lúc thả (đơn vị thế giới / giây),
// không còn phụ thuộc vào quãng đường kéo.
const MAX_FLING_SPEED = 0.8;   // trần tốc độ (frame cao ~1.2 đơn vị => ~0.7 chiều cao/giây)
const FLING_GAIN = 0.5;        // hệ số giảm thêm cho cảm giác "văng nhẹ" (thử 0.2 - 1.0)
const FLING_STALE_MS = 80;     // tay đứng yên lâu hơn mức này trước khi thả => không ném, chỉ rơi
// Màn hình có Y hướng xuống, thế giới three.js có Y hướng lên.
// Component cha hiện tại đã truyền dy theo hướng "lên" sẵn rồi nên để false.
// Nếu sau này truyền dy theo hệ tọa độ màn hình (Y xuống) thì đặt true.
const FLIP_DRAG_Y = false;

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

    // pin the border points so it drapes/folds like real cloth
    const idx = (c: number, r: number) => r * cols + c;

    const permanentPins: number[] = [];

    for (let r = 0; r <= GRID_ROWS; r++) {
        for (let c = 0; c <= GRID_COLS; c++) {
            // Chỉ ghim các điểm nằm trên viền
            if (
                r === 0 ||
                r === GRID_ROWS ||
                c === 0 ||
                c === GRID_COLS
            ) {
                permanentPins.push(idx(c, r));
            }
        }
    }
    const permanentPinSet = new Set(permanentPins);

    for (const i of permanentPins) {
        const p = particles[i];
        const c = i % cols;
        const r = Math.floor(i / cols);

        p.pinned = true;
        p.pinX = aspect * (c / GRID_COLS - 0.5);
        p.pinY = CLOTH_TOP_Y -
            (r / GRID_ROWS) * height;
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

    return { particles, constraints, indices, uvs, cols, rows, clothWidth, permanentPins, permanentPinSet };
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

const PlasticWrap = forwardRef<PlasticWrapHandle, PlasticWrapProps>(function PlasticWrap({ aspect, className, onSetUnwrapped }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    // Placeholder in the layout: defines where the frame is; the canvas itself is fullscreen.
    const anchorRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const aspectRef = useRef(aspect);
    aspectRef.current = aspect;

    const clothRef = useRef<ReturnType<typeof buildCloth> | null>(null);
    const grabIndexRef = useRef<number | null>(null);
    const grabRestRef = useRef({ x: 0, y: 0 });

    const grabStartRef = useRef({ x: 0, y: 0 });
    const lastPullRef = useRef({ x: 0, y: 0 });
    const initialPinPositions = useRef<Array<{ x: number; y: number; z: number }>>([]);
    const peeledRef = useRef(false);
    // Vận tốc ném (đơn vị thế giới / giây), được tính từ tốc độ tay lúc thả.
    const flingRef = useRef<{ x: number; y: number } | null>(null);
    // Theo dõi chuyển động của tay: thời điểm, vị trí kéo gần nhất và vận tốc đã làm mượt.
    const moveTrackRef = useRef({ t: 0, x: 0, y: 0, vx: 0, vy: 0 });

    useImperativeHandle(ref, () => ({
        grab: (clientX: number, clientY: number) => {
            // Màng bọc đã bị lột ra rồi thì bỏ qua mọi lần nhấn sau đó,
            // nếu không lúc thả chuột nó sẽ khôi phục các điểm ghim và co lại như ban đầu.
            if (peeledRef.current) return;
            const cloth = clothRef.current;
            const container = anchorRef.current;
            if (!cloth || !container) return;
            const rect = container.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const imageLeft = rect.left + 0.04 * rect.width;
            const imageTop = rect.top + 0.04 * rect.height;
            const imageWidth = 0.92 * rect.width;
            const imageHeight = 0.92 * rect.height;
            // Keep the original mesh scale, only anchor the sampling box to the
            // picture: container centre == image centre, so worldX/Y stay
            // algebraically identical while surviving CSS resize/position drift.
            const imageCX = imageLeft + imageWidth / 2;
            const imageCY = imageTop + imageHeight / 2;
            const unitsPerPixel = aspectRef.current / rect.width;
            const localX = (clientX - imageCX) * unitsPerPixel;
            const localY = (imageCY - clientY) * unitsPerPixel;

            let bestIdx = -1;
            let bestDist = Infinity;
            cloth.particles.forEach((p, i) => {
                if (cloth.permanentPinSet.has(i)) return;
                const d = (p.x - localX) ** 2 + (p.y - localY) ** 2;
                if (d < bestDist) { bestDist = d; bestIdx = i; }
            });
            if (bestIdx >= 0) {
                grabIndexRef.current = bestIdx;
                grabRestRef.current = { x: cloth.particles[bestIdx].x, y: cloth.particles[bestIdx].y };
                grabStartRef.current = { x: clientX, y: clientY };
                lastPullRef.current = { x: 0, y: 0 };
                moveTrackRef.current = { t: 0, x: 0, y: 0, vx: 0, vy: 0 };
                // New drag -> back to attached; snapshot permanent anchors so a
                // sub-threshold release can restore the resting drape exactly.
                peeledRef.current = false;
                flingRef.current = null;
                for (const i of cloth.permanentPins) {
                    const pp = cloth.particles[i];
                    initialPinPositions.current[i] = { x: pp.pinX, y: pp.pinY, z: pp.pinZ };
                }
            }
        },
        setTarget: (progress: number, dx?: number, dy?: number) => {
            const cloth = clothRef.current;
            const container = anchorRef.current;
            if (!cloth || !container) return;
            const rect = container.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const dragDistance = Math.hypot(dx ?? 0, dy ?? 0);
            const worldPerPixel = aspectRef.current / rect.width;
            const localDX = (dx ?? 0) * worldPerPixel;
            // Màn hình Y hướng xuống, thế giới Y hướng lên
            const localDY = (FLIP_DRAG_Y ? -1 : 1) * (dy ?? 0) * worldPerPixel;

            void progress; // kept for API compat; peel state is tracked via drag distance
            if (dx !== undefined && dy !== undefined) {
                // Keep steering the grabbed vertex for the whole drag, even
                // after the permanent anchors have burst.  Detach-only-burst:
                // unpin the sheet from the picture but keep the held point
                // glued to the pointer until pointerup.
                if (grabIndexRef.current !== null) {
                    const p = cloth.particles[grabIndexRef.current];
                    p.pinned = true;
                    p.px = p.x; p.py = p.y; p.pz = p.z; // kill snap velocity while held
                    p.pinX = grabRestRef.current.x + localDX;
                    p.pinY = grabRestRef.current.y + localDY;
                    p.pinZ = 0.18;
                    lastPullRef.current = { x: localDX, y: localDY };

                    // Đo vận tốc tay (thế giới / giây), làm mượt bằng trung bình trượt
                    const now = performance.now();
                    const m = moveTrackRef.current;
                    if (m.t) {
                        const dtSec = Math.max((now - m.t) / 1000, 0.001);
                        m.vx = m.vx * 0.6 + ((localDX - m.x) / dtSec) * 0.4;
                        m.vy = m.vy * 0.6 + ((localDY - m.y) / dtSec) * 0.4;
                    }
                    m.t = now; m.x = localDX; m.y = localDY;
                }

                // Auto-burst: once the drag exceeds the threshold, release the
                // picture anchors only.  Do NOT drop the grabbed vertex and do
                // NOT queue the fling here — the user is still holding the
                // sheet, so it must keep following the pointer.
                const peelThresholdPx = (PEEL_THRESHOLD_VW / 100) * window.innerWidth;
                if (grabIndexRef.current !== null && dragDistance >= peelThresholdPx && !peeledRef.current) {
                    peeledRef.current = true;
                    for (const i of cloth.permanentPins) {
                        const pp = cloth.particles[i];
                        initialPinPositions.current[i] = { x: pp.pinX, y: pp.pinY, z: pp.pinZ };
                        pp.pinned = false;
                        console.log("bung");
                        onSetUnwrapped(true)
                    }
                }
                return;
            }

            if (grabIndexRef.current !== null) {
                const p = cloth.particles[grabIndexRef.current];
                if (peeledRef.current) {
                    // Released AFTER burst: drop the held point now. Fling velocity
                    // comes from the real hand speed; if the hand had stopped before
                    // release, there is no fling and the cloth just falls under gravity.
                    p.pinned = false;
                    const m = moveTrackRef.current;
                    const stale = !m.t || performance.now() - m.t > FLING_STALE_MS;
                    flingRef.current = stale ? { x: 0, y: 0 } : { x: m.vx, y: m.vy };
                } else {
                    p.pinned = false;
                    // Zero the pinned-frame velocity so the cloth relaxes back
                    // to the resting drape instead of snapping.
                    p.px = p.x; p.py = p.y; p.pz = p.z;
                    for (const i of cloth.permanentPins) {
                        const snap = initialPinPositions.current[i];
                        if (snap) {
                            const pp = cloth.particles[i];
                            pp.pinX = snap.x;
                            pp.pinY = snap.y;
                            pp.pinZ = snap.z;
                            pp.pinned = true;
                        }
                    }
                }
            }
            grabIndexRef.current = null;
        },
        isPeeled: () => peeledRef.current,
    }), []);

    useEffect(() => {
        if (!mounted) return;
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
            renderer.domElement.style.display = 'block';
            container.appendChild(renderer.domElement);

            const cloth = buildCloth(aspect);
            clothRef.current = cloth;
            const { particles, constraints } = cloth;

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

                // Fit the camera so the placeholder rect maps to the frame (aspect x 1 world units).
                const a = anchorRef.current?.getBoundingClientRect();
                if (a && a.width) {
                    const upp = aspectRef.current / a.width;
                    const cx = a.left + a.width / 2;
                    const cy = a.top + a.height / 2;
                    camera.left = -cx * upp;
                    camera.right = (window.innerWidth - cx) * upp;
                    camera.top = cy * upp;
                    camera.bottom = (cy - window.innerHeight) * upp;
                    camera.updateProjectionMatrix();
                }

                const subDt = dt / SUBSTEPS;

                if (flingRef.current) {
                    let { x: vx, y: vy } = flingRef.current;

                    // Giới hạn tốc độ tối đa rồi giảm bớt cho cảm giác "văng nhẹ"
                    const speed = Math.hypot(vx, vy);
                    if (speed > MAX_FLING_SPEED) {
                        vx *= MAX_FLING_SPEED / speed;
                        vy *= MAX_FLING_SPEED / speed;
                    }
                    vx *= FLING_GAIN;
                    vy *= FLING_GAIN;

                    for (const i of cloth.permanentPins) particles[i].pinned = false;
                    for (const p of particles) {
                        if (p.pinned) continue;
                        // Verlet: vận tốc = x - px (mỗi substep), nên px = x - v * subDt
                        p.px = p.x - vx * subDt;
                        p.py = p.y - vy * subDt;
                    }
                    flingRef.current = null;
                }

                for (let i = 0; i < SUBSTEPS; i++) stepCloth(particles, constraints, subDt);

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
    }, [aspect, mounted]);

    return (
        <>
            <div ref={anchorRef} className={className} />
            {mounted && createPortal(
                <div
                    ref={containerRef}
                    style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 50 }}
                />,
                document.body
            )}
        </>
    );
});

export default PlasticWrap;