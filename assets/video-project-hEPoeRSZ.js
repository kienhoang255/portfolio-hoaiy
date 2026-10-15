import{a as g,p as u,w as ve,y as ge,z as ye}from"./chunk-EPOLDU6W-RNrl2JcA.js";import{d as G,s as R}from"./video.module-Cy-OHQa8.js";import{b as we,a as ze}from"./btn-back-2-DNC77qh5.js";import{C as Re}from"./contactCard-CWGDOUlQ.js";import{p as se}from"./playClickSound-B2ataRUi.js";const be="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",Pe=`
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
`,je=`
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,Ce=`
    varying vec3 vNormal;
    varying vec2 vUv;

    ${Pe}

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
`,Y=30,$=24,Ne=1.4,W=.62,Me=-.58,De=2.2,Z=.985,Se=15,ie=3,Te=190;function _e(S){const x=Y+1,m=$+1,z=S*Ne,o=W-Me,a=[];for(let t=0;t<m;t++)for(let e=0;e<x;e++){const r=-z/2+e/Y*z,c=W-t/$*o,n=Math.sin(e*.7+t*.35)*.035,l=(Math.random()-.5)*.025,p=n+l;a.push({x:r,y:c,z:p,px:r,py:c,pz:p,pinned:!1,pinX:r,pinY:c,pinZ:p})}const s=(t,e)=>e*x+t,i=[Math.round(Y*0),Math.round(Y*.275),Math.round(Y*.5),Math.round(Y*.725),Math.round(Y*1)],C=i.map(t=>s(t,0));for(let t=0;t<C.length;t++){const e=a[C[t]];e.pinned=!0,e.pinX=S*1.22*(i[t]/Y-.5),e.pinY=W,e.pinZ=e.z,e.x=e.px=e.pinX,e.y=e.py=e.pinY,e.z=e.pz=e.pinZ}const T=[],v=(t,e,r)=>{const c=a[t],n=a[e],l=Math.hypot(c.x-n.x,c.y-n.y,c.z-n.z);T.push({i1:t,i2:e,restLength:l,stiffness:r})};for(let t=0;t<m;t++)for(let e=0;e<x;e++){const r=s(e,t);e<x-1&&v(r,s(e+1,t),.98),t<m-1&&v(r,s(e,t+1),.98),e<x-1&&t<m-1&&(v(r,s(e+1,t+1),.65),v(s(e+1,t),s(e,t+1),.65)),e<x-2&&v(r,s(e+2,t),.25),t<m-2&&v(r,s(e,t+2),.25)}const N=[];for(let t=0;t<m-1;t++)for(let e=0;e<x-1;e++){const r=s(e,t),c=s(e+1,t),n=s(e,t+1),l=s(e+1,t+1);N.push(r,n,c,c,n,l)}const y=new Float32Array(x*m*2);for(let t=0;t<m;t++)for(let e=0;e<x;e++)y[s(e,t)*2]=e/Y,y[s(e,t)*2+1]=1-t/$;return{particles:a,constraints:T,indices:N,uvs:y,cols:x,rows:m,clothWidth:z,permanentPins:C}}function ce(S,x,m){const z=m*m;for(const o of S){if(o.pinned){o.x=o.pinX,o.y=o.pinY,o.z=o.pinZ;continue}const a=(o.x-o.px)*Z,s=(o.y-o.py)*Z,i=(o.z-o.pz)*Z;o.px=o.x,o.py=o.y,o.pz=o.z,o.x+=a,o.y+=s-De*z,o.z+=i}for(let o=0;o<Se;o++){for(const a of x){const s=S[a.i1],i=S[a.i2],C=i.x-s.x,T=i.y-s.y,v=i.z-s.z,N=Math.hypot(C,T,v)||1e-5,y=(N-a.restLength)/N*.5*a.stiffness,t=C*y,e=T*y,r=v*y;!s.pinned&&!i.pinned?(s.x+=t,s.y+=e,s.z+=r,i.x-=t,i.y-=e,i.z-=r):s.pinned&&!i.pinned?(i.x-=t*2,i.y-=e*2,i.z-=r*2):!s.pinned&&i.pinned&&(s.x+=t*2,s.y+=e*2,s.z+=r*2)}for(const a of S)a.pinned&&(a.x=a.pinX,a.y=a.pinY,a.z=a.pinZ)}}const Ee=g.forwardRef(function({aspect:x,className:m},z){const o=g.useRef(null),a=g.useRef(x);a.current=x;const s=g.useRef(null),i=g.useRef(null),C=g.useRef({x:0,y:0}),T=g.useRef({x:0,y:0}),v=g.useRef({x:0,y:0}),N=g.useRef([]),y=g.useRef(!1),t=g.useRef(null);return g.useImperativeHandle(z,()=>({grab:(e,r)=>{const c=s.current,n=o.current;if(!c||!n)return;const l=n.getBoundingClientRect();if(!l.width||!l.height)return;const p=l.left+.04*l.width,H=l.top+.04*l.height,L=.92*l.width,_=.92*l.height,P=p+L/2,f=H+_/2,j=a.current/l.width,I=(e-P)*j,h=(f-r)*j;let w=-1,B=1/0;if(c.particles.forEach((F,X)=>{if(c.permanentPins.includes(X))return;const U=(F.x-I)**2+(F.y-h)**2;U<B&&(B=U,w=X)}),w>=0){i.current=w,C.current={x:c.particles[w].x,y:c.particles[w].y},T.current={x:e,y:r},v.current={x:0,y:0},y.current=!1,t.current=null;for(const F of c.permanentPins){const X=c.particles[F];N.current[F]={x:X.pinX,y:X.pinY,z:X.pinZ}}}},setTarget:(e,r,c)=>{const n=s.current,l=o.current;if(!n||!l)return;const p=l.getBoundingClientRect();if(!p.width||!p.height)return;const H=Math.hypot(r??0,c??0),L=a.current/p.width,_=(r??0)*L,P=(c??0)*L;if(r!==void 0&&c!==void 0){if(i.current!==null){const f=n.particles[i.current];f.pinned=!0,f.px=f.x,f.py=f.y,f.pz=f.z,f.pinX=C.current.x+_,f.pinY=C.current.y+P,f.pinZ=.18,v.current={x:_,y:P}}if(i.current!==null&&H>=Te&&!y.current){y.current=!0;for(const f of n.permanentPins){const j=n.particles[f];N.current[f]={x:j.pinX,y:j.pinY,z:j.pinZ},j.pinned=!1}}return}if(i.current!==null){const f=n.particles[i.current];if(y.current){const{x:j,y:I}=v.current;f.pinned=!1,t.current=Math.hypot(j,I)>1e-6?{x:j,y:I}:{x:0,y:-.02}}else{f.pinned=!1,f.px=f.x,f.py=f.y,f.pz=f.z;for(const j of n.permanentPins){const I=N.current[j];if(I){const h=n.particles[j];h.pinX=I.x,h.pinY=I.y,h.pinZ=I.z,h.pinned=!0}}}}i.current=null},isPeeled:()=>y.current}),[]),g.useEffect(()=>{let e=!1,r,c,n=0;return(async()=>{const l=o.current;if(!l)return;let p;try{p=await import(be)}catch{return}if(e||!o.current)return;const H=new p.Scene,L=new p.OrthographicCamera(-x/2,x/2,.5,-.5,.1,10);L.position.z=2,r=new p.WebGLRenderer({alpha:!0,antialias:!0}),r.setPixelRatio(Math.min(window.devicePixelRatio,2)),l.appendChild(r.domElement);const _=_e(x);s.current=_;const{particles:P,constraints:f,cols:j,rows:I}=_,h=new Float32Array(P.length*3),w=new Float32Array(P.length*3),B=new p.BufferGeometry;B.setAttribute("position",new p.BufferAttribute(h,3)),B.setAttribute("normal",new p.BufferAttribute(w,3)),B.setAttribute("uv",new p.BufferAttribute(_.uvs,2)),B.setIndex(_.indices);const F=new p.ShaderMaterial({vertexShader:je,fragmentShader:Ce,side:p.DoubleSide,transparent:!0,depthWrite:!1}),X=new p.Mesh(B,F);H.add(X);function U(){for(let d=0;d<P.length;d++){const b=P[d];h[d*3]=b.x,h[d*3+1]=b.y,h[d*3+2]=b.z}w.fill(0);const M=_.indices;for(let d=0;d<M.length;d+=3){const b=M[d],D=M[d+1],A=M[d+2],E=h[b*3],k=h[b*3+1],O=h[b*3+2],ae=h[D*3],le=h[D*3+1],fe=h[D*3+2],de=h[A*3],pe=h[A*3+1],ue=h[A*3+2],J=ae-E,ee=le-k,te=fe-O,ne=de-E,re=pe-k,oe=ue-O,xe=ee*oe-te*re,he=te*ne-J*oe,me=J*re-ee*ne;for(const V of[b,D,A])w[V*3]+=xe,w[V*3+1]+=he,w[V*3+2]+=me}for(let d=0;d<P.length;d++){const b=w[d*3],D=w[d*3+1],A=w[d*3+2],E=Math.hypot(b,D,A);E>1e-5?(w[d*3]=b/E,w[d*3+1]=D/E,w[d*3+2]=A/E):w[d*3+2]=1}B.attributes.position.needsUpdate=!0,B.attributes.normal.needsUpdate=!0}function q(){const M=o.current;if(!M||!r)return;const{clientWidth:d,clientHeight:b}=M;!d||!b||r.setSize(d,b)}c=new ResizeObserver(q),c.observe(l),q();for(let M=0;M<80;M++)ce(P,f,1/60);let K=performance.now();function Q(M){n=requestAnimationFrame(Q);const d=Math.min((M-K)/1e3,1/30);if(K=M,t.current){const{x:D,y:A}=t.current,E=Math.hypot(D,A)||1,k=Math.min(Math.max(E/.2,1),3);for(const O of _.permanentPins)P[O].pinned=!1;for(const O of P)O.px=O.x-D/E*.05*k,O.py=O.y-A/E*.05*k-.02;t.current=null}const b=d/ie;for(let D=0;D<ie;D++)ce(P,f,b);U(),r.render(H,L)}n=requestAnimationFrame(Q)})(),()=>{e=!0,cancelAnimationFrame(n),c?.disconnect(),r&&(r.dispose(),r.domElement.remove())}},[x]),u.jsx("div",{ref:o,className:m})}),Ie="/portfolio-hoaiy/assets/video-bg-D6c5NC7V.jpg",Be="/portfolio-hoaiy/assets/video-frame-CBQwmCZQ.png",Ae="/portfolio-hoaiy/assets/video-frame-2-3JzB9NCK.png";function Le(S){return S!=="routing"&&S in G}const ke=ve(function(){const x=ge(),{pid:m}=ye(),z=G.routing.find(n=>n.id===m),o=m&&Le(m)?G[m]:void 0,[a,s]=g.useState(!1),[i,C]=g.useState(!1),T=g.useRef(null),v=g.useRef(null),N=g.useRef({x:0,y:0}),y=g.useRef({x:0,y:0});if(!z)return u.jsx("div",{children:"Project not found"});function t(){se(),x("/video")}function e(n){a||(C(!0),N.current={x:n.clientX,y:n.clientY},n.currentTarget.setPointerCapture(n.pointerId),v.current?.grab(n.clientX,n.clientY))}function r(n){if(!i)return;const l=n.clientX-N.current.x,p=n.clientY-N.current.y;y.current={x:l,y:p};const H=(T.current?.offsetWidth??300)*.3,L=Math.min(Math.hypot(l,p)/H,1.3);v.current?.setTarget(L,l,-p)}function c(n){if(!i)return;C(!1),n.currentTarget.releasePointerCapture(n.pointerId);const l=(T.current?.offsetWidth??300)*.3;Math.hypot(y.current.x,y.current.y)>l?(se(),s(!0),v.current?.setTarget(1)):v.current?.setTarget(0),y.current={x:0,y:0}}return u.jsx("div",{className:R["container-project"],style:{backgroundImage:`url(${Ie})`},children:u.jsxs("div",{className:R.content_wrapper,children:[u.jsxs("div",{className:`${R["header-project"]} fadeIn`,children:[u.jsxs("div",{className:`${R["btn-back"]} pointer`,onClick:()=>t(),children:[u.jsx("img",{src:we,alt:"button back",className:"pointer"}),u.jsx("img",{src:ze,alt:"",className:R["btn-back-hover"]})]}),u.jsxs("div",{className:R.about,children:[u.jsxs("strong",{children:["• Video title: ",u.jsx("div",{children:z.title})]}),u.jsx("br",{}),u.jsxs("div",{className:R.industry,children:["• Objective: ",u.jsx("span",{children:z.desc})]}),u.jsxs("div",{children:["• Project overview: ",u.jsx("span",{children:o?.project_overview??""})]})]})]}),u.jsxs("div",{className:`${R.content} fadeIn`,children:[u.jsxs("div",{ref:T,className:`${R.wrap} ${z.frame==="video-frame-2"?R.wide:""} ${a?R.unwrapped:""} ${i?R.dragging:""} ${a?"":"pointer"}`,onPointerDown:e,onPointerMove:r,onPointerUp:c,onPointerCancel:c,children:[z.placeholderVideo&&u.jsx("img",{className:R.poster,src:`/portfolio-hoaiy/assets/images/${z.placeholderVideo}`,alt:z.title,draggable:!1}),u.jsx("img",{className:R.frame,src:z.frame==="video-frame-2"?Ae:Be,alt:"",draggable:!1}),u.jsx(Ee,{ref:v,aspect:z.frame==="video-frame-2"?1e3/569:1,className:R.wrapTexture}),u.jsx("div",{className:R.playButton})]}),u.jsxs("div",{className:R.unwrapHint,children:[u.jsx("span",{children:"«"})," Press & drag to peel off the wrap!"]})]}),u.jsx("div",{className:"contact_card_wrapper",children:u.jsx(Re,{dark:!0,invertButton:!0})})]})})});export{ke as default};
