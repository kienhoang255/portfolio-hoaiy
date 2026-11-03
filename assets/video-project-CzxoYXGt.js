import{a as m,p as o,w as Ce,x as Ne,y as Se}from"./chunk-EPOLDU6W-CgeV-fgw.js";import{d as te,s as v}from"./video.module-DT-HtAr8.js";import{b as le,a as De}from"./btn-back-2-DNC77qh5.js";import{o as _e,C as Ee}from"./contactCard-DppuX9N6.js";import{a as Ie}from"./index-CzGk7Trj.js";import{p as fe}from"./playClickSound-B2ataRUi.js";import{a as Te,A as Me,b as Ae}from"./useImagesReady-CsDItzmx.js";const Le="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",Be=`
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
`,Fe=`
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,Oe=`
    varying vec3 vNormal;
    varying vec2 vUv;

    ${Be}

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
`,W=30,G=24,He=1.06,Q=.5,Ye=-.5,$e=2.2,J=.985,ke=15,pe=3,Xe=25,ee=.8,ue=.5,Ue=80;function Ve(L){const x=W+1,b=G+1,u=L*He,i=Q-Ye,s=[];for(let t=0;t<b;t++)for(let e=0;e<x;e++){const f=-u/2+e/W*u,y=Q-t/G*i,N=Math.sin(e*.7+t*.35)*.035,B=(Math.random()-.5)*.025,d=N+B;s.push({x:f,y,z:d,px:f,py:y,pz:d,pinned:!1,pinX:f,pinY:y,pinZ:d})}const n=(t,e)=>e*x+t,a=[];for(let t=0;t<=G;t++)for(let e=0;e<=W;e++)(t===0||t===G||e===0||e===W)&&a.push(n(e,t));const $=new Set(a);for(const t of a){const e=s[t],f=t%x,y=Math.floor(t/x);e.pinned=!0,e.pinX=L*(f/W-.5),e.pinY=Q-y/G*i,e.pinZ=e.z,e.x=e.px=e.pinX,e.y=e.py=e.pinY,e.z=e.pz=e.pinZ}const T=[],z=(t,e,f)=>{const y=s[t],N=s[e],B=Math.hypot(y.x-N.x,y.y-N.y,y.z-N.z);T.push({i1:t,i2:e,restLength:B,stiffness:f})};for(let t=0;t<b;t++)for(let e=0;e<x;e++){const f=n(e,t);e<x-1&&z(f,n(e+1,t),.98),t<b-1&&z(f,n(e,t+1),.98),e<x-1&&t<b-1&&(z(f,n(e+1,t+1),.65),z(n(e+1,t),n(e,t+1),.65)),e<x-2&&z(f,n(e+2,t),.25),t<b-2&&z(f,n(e,t+2),.25)}const P=[];for(let t=0;t<b-1;t++)for(let e=0;e<x-1;e++){const f=n(e,t),y=n(e+1,t),N=n(e,t+1),B=n(e+1,t+1);P.push(f,N,y,y,N,B)}const I=new Float32Array(x*b*2);for(let t=0;t<b;t++)for(let e=0;e<x;e++)I[n(e,t)*2]=e/W,I[n(e,t)*2+1]=1-t/G;return{particles:s,constraints:T,indices:P,uvs:I,cols:x,rows:b,clothWidth:u,permanentPins:a,permanentPinSet:$}}function de(L,x,b){const u=b*b;for(const i of L){if(i.pinned){i.x=i.pinX,i.y=i.pinY,i.z=i.pinZ;continue}const s=(i.x-i.px)*J,n=(i.y-i.py)*J,a=(i.z-i.pz)*J;i.px=i.x,i.py=i.y,i.pz=i.z,i.x+=s,i.y+=n-$e*u,i.z+=a}for(let i=0;i<ke;i++){for(const s of x){const n=L[s.i1],a=L[s.i2],$=a.x-n.x,T=a.y-n.y,z=a.z-n.z,P=Math.hypot($,T,z)||1e-5,I=(P-s.restLength)/P*.5*s.stiffness,t=$*I,e=T*I,f=z*I;!n.pinned&&!a.pinned?(n.x+=t,n.y+=e,n.z+=f,a.x-=t,a.y-=e,a.z-=f):n.pinned&&!a.pinned?(a.x-=t*2,a.y-=e*2,a.z-=f*2):!n.pinned&&a.pinned&&(n.x+=t*2,n.y+=e*2,n.z+=f*2)}for(const s of L)s.pinned&&(s.x=s.pinX,s.y=s.pinY,s.z=s.pinZ)}}const We=m.forwardRef(function({aspect:x,className:b,onSetUnwrapped:u},i){const s=m.useRef(null),n=m.useRef(null),[a,$]=m.useState(!1);m.useEffect(()=>$(!0),[]);const T=m.useRef(x);T.current=x;const z=m.useRef(null),P=m.useRef(null),I=m.useRef({x:0,y:0}),t=m.useRef({x:0,y:0}),e=m.useRef({x:0,y:0}),f=m.useRef([]),y=m.useRef(!1),N=m.useRef(null),B=m.useRef({t:0,x:0,y:0,vx:0,vy:0});return m.useImperativeHandle(i,()=>({grab:(d,g)=>{if(y.current)return;const R=z.current,S=n.current;if(!R||!S)return;const j=S.getBoundingClientRect();if(!j.width||!j.height)return;const C=j.left+.04*j.width,V=j.top+.04*j.height,F=.92*j.width,M=.92*j.height,D=C+F/2,_=V+M/2,r=T.current/j.width,c=(d-D)*r,p=(_-g)*r;let H=-1,q=1/0;if(R.particles.forEach((U,k)=>{if(R.permanentPinSet.has(k))return;const Z=(U.x-c)**2+(U.y-p)**2;Z<q&&(q=Z,H=k)}),H>=0){P.current=H,I.current={x:R.particles[H].x,y:R.particles[H].y},t.current={x:d,y:g},e.current={x:0,y:0},B.current={t:0,x:0,y:0,vx:0,vy:0},y.current=!1,N.current=null;for(const U of R.permanentPins){const k=R.particles[U];f.current[U]={x:k.pinX,y:k.pinY,z:k.pinZ}}}},setTarget:(d,g,R)=>{const S=z.current,j=n.current;if(!S||!j)return;const C=j.getBoundingClientRect();if(!C.width||!C.height)return;const V=Math.hypot(g??0,R??0),F=T.current/C.width,M=(g??0)*F,D=1*(R??0)*F;if(g!==void 0&&R!==void 0){if(P.current!==null){const r=S.particles[P.current];r.pinned=!0,r.px=r.x,r.py=r.y,r.pz=r.z,r.pinX=I.current.x+M,r.pinY=I.current.y+D,r.pinZ=.18,e.current={x:M,y:D};const c=performance.now(),p=B.current;if(p.t){const H=Math.max((c-p.t)/1e3,.001);p.vx=p.vx*.6+(M-p.x)/H*.4,p.vy=p.vy*.6+(D-p.y)/H*.4}p.t=c,p.x=M,p.y=D}const _=Xe/100*window.innerWidth;if(P.current!==null&&V>=_&&!y.current){y.current=!0;for(const r of S.permanentPins){const c=S.particles[r];f.current[r]={x:c.pinX,y:c.pinY,z:c.pinZ},c.pinned=!1,console.log("bung"),u(!0)}}return}if(P.current!==null){const _=S.particles[P.current];if(y.current){_.pinned=!1;const r=B.current,c=!r.t||performance.now()-r.t>Ue;N.current=c?{x:0,y:0}:{x:r.vx,y:r.vy}}else{_.pinned=!1,_.px=_.x,_.py=_.y,_.pz=_.z;for(const r of S.permanentPins){const c=f.current[r];if(c){const p=S.particles[r];p.pinX=c.x,p.pinY=c.y,p.pinZ=c.z,p.pinned=!0}}}}P.current=null},isPeeled:()=>y.current}),[]),m.useEffect(()=>{if(!a)return;let d=!1,g,R,S=0;return(async()=>{const j=s.current;if(!j)return;let C;try{C=await import(Le)}catch{return}if(d||!s.current)return;const V=new C.Scene,F=new C.OrthographicCamera(-x/2,x/2,.5,-.5,.1,10);F.position.z=2,g=new C.WebGLRenderer({alpha:!0,antialias:!0}),g.setPixelRatio(Math.min(window.devicePixelRatio,2)),g.domElement.style.display="block",j.appendChild(g.domElement);const M=Ve(x);z.current=M;const{particles:D,constraints:_}=M,r=new Float32Array(D.length*3),c=new Float32Array(D.length*3),p=new C.BufferGeometry;p.setAttribute("position",new C.BufferAttribute(r,3)),p.setAttribute("normal",new C.BufferAttribute(c,3)),p.setAttribute("uv",new C.BufferAttribute(M.uvs,2)),p.setIndex(M.indices);const H=new C.ShaderMaterial({vertexShader:Fe,fragmentShader:Oe,side:C.DoubleSide,transparent:!0,depthWrite:!1}),q=new C.Mesh(p,H);V.add(q);function U(){for(let l=0;l<D.length;l++){const h=D[l];r[l*3]=h.x,r[l*3+1]=h.y,r[l*3+2]=h.z}c.fill(0);const A=M.indices;for(let l=0;l<A.length;l+=3){const h=A[l],O=A[l+1],w=A[l+2],E=r[h*3],X=r[h*3+1],Y=r[h*3+2],ve=r[O*3],ye=r[O*3+1],ge=r[O*3+2],we=r[w*3],be=r[w*3+1],ze=r[w*3+2],re=ve-E,oe=ye-X,se=ge-Y,ie=we-E,ce=be-X,ae=ze-Y,Re=oe*ae-se*ce,je=se*ie-re*ae,Pe=re*ce-oe*ie;for(const K of[h,O,w])c[K*3]+=Re,c[K*3+1]+=je,c[K*3+2]+=Pe}for(let l=0;l<D.length;l++){const h=c[l*3],O=c[l*3+1],w=c[l*3+2],E=Math.hypot(h,O,w);E>1e-5?(c[l*3]=h/E,c[l*3+1]=O/E,c[l*3+2]=w/E):c[l*3+2]=1}p.attributes.position.needsUpdate=!0,p.attributes.normal.needsUpdate=!0}function k(){const A=s.current;if(!A||!g)return;const{clientWidth:l,clientHeight:h}=A;!l||!h||g.setSize(l,h)}R=new ResizeObserver(k),R.observe(j),k();for(let A=0;A<80;A++)de(D,_,1/60);let Z=performance.now();function ne(A){S=requestAnimationFrame(ne);const l=Math.min((A-Z)/1e3,1/30);Z=A;const h=n.current?.getBoundingClientRect();if(h&&h.width){const w=T.current/h.width,E=h.left+h.width/2,X=h.top+h.height/2;F.left=-E*w,F.right=(window.innerWidth-E)*w,F.top=X*w,F.bottom=(X-window.innerHeight)*w,F.updateProjectionMatrix()}const O=l/pe;if(N.current){let{x:w,y:E}=N.current;const X=Math.hypot(w,E);X>ee&&(w*=ee/X,E*=ee/X),w*=ue,E*=ue;for(const Y of M.permanentPins)D[Y].pinned=!1;for(const Y of D)Y.pinned||(Y.px=Y.x-w*O,Y.py=Y.y-E*O);N.current=null}for(let w=0;w<pe;w++)de(D,_,O);U(),g.render(V,F)}S=requestAnimationFrame(ne)})(),()=>{d=!0,cancelAnimationFrame(S),R?.disconnect(),g&&(g.dispose(),g.domElement.remove())}},[x,a]),o.jsxs(o.Fragment,{children:[o.jsx("div",{ref:n,className:b}),a&&Ie.createPortal(o.jsx("div",{ref:s,style:{position:"fixed",inset:0,width:"100vw",height:"100vh",pointerEvents:"none",zIndex:50}}),document.body)]})}),xe="/portfolio-hoaiy/assets/video-bg-D6c5NC7V.jpg",me="/portfolio-hoaiy/assets/video-frame-CBQwmCZQ.png",he="/portfolio-hoaiy/assets/video-frame-2-3JzB9NCK.png";function Ge(L){return L!=="routing"&&L in te}const nt=Ce(function(){const x=Ne(),{pid:b}=Se(),u=te.routing.find(d=>d.id===b),i=b&&Ge(b)?te[b]:void 0,[s,n]=m.useState(!1),[a,$]=m.useState(!1),T=m.useRef(null),z=m.useRef(null),P=m.useRef({x:0,y:0}),I=m.useRef({x:0,y:0}),{progress:t,ready:e}=Te([le,xe,me,he]);if(!u)return o.jsx("div",{children:"Project not found"});function f(){x("/video"),fe()}function y(d){s||($(!0),P.current={x:d.clientX,y:d.clientY},d.currentTarget.setPointerCapture(d.pointerId),z.current?.grab(d.clientX,d.clientY))}function N(d){if(!a)return;const g=d.clientX-P.current.x,R=d.clientY-P.current.y;I.current={x:g,y:R};const S=(T.current?.offsetWidth??300)*.3,j=Math.min(Math.hypot(g,R)/S,1.3);z.current?.setTarget(j,g,-R)}function B(d){a&&($(!1),d.currentTarget.releasePointerCapture(d.pointerId),s?(fe(),n(!0),z.current?.setTarget(1)):z.current?.setTarget(0),I.current={x:0,y:0})}return o.jsxs("div",{className:v["container-project"],style:{backgroundImage:`url(${xe})`},children:[o.jsx(Me,{children:!e&&o.jsx(Ae,{theme:"dark",progress:t})}),o.jsx("img",{className:v.overlay,src:_e,alt:""}),o.jsxs("div",{className:v.content_wrapper,children:[o.jsxs("div",{className:`${v["header-project"]} fadeIn`,children:[o.jsxs("div",{className:`${v["btn-back"]} pointer`,onClick:()=>f(),children:[o.jsx("img",{src:le,alt:"button back",className:"pointer"}),o.jsx("img",{src:De,alt:"",className:v["btn-back-hover"]})]}),o.jsxs("div",{className:v.about,children:["• Video title: ",o.jsx("strong",{children:o.jsx("div",{children:u.title})}),o.jsx("br",{}),o.jsxs("div",{className:v.industry,children:["• Objective: ",o.jsx("span",{children:u.desc})]}),o.jsxs("div",{children:["• Project overview: ",o.jsx("span",{children:i?.project_overview??""})]})]})]}),o.jsxs("div",{className:`${v.content} ${u.frame==="video-frame-2"?v.wide:""} fadeIn`,children:[o.jsxs("div",{ref:T,className:`${v.wrap} ${u.frame==="video-frame-2"?v.wide:""} ${s?v.unwrapped:""} ${a?v.dragging:""} ${s?"":"pointer"}`,onPointerDown:y,onPointerMove:N,onPointerUp:B,onPointerCancel:B,children:[u.facebook&&(s?o.jsx("iframe",{className:v.poster,src:`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u.facebook)}&show_text=false&autoplay=true&mute=true`,title:u.title,allow:"autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen",allowFullScreen:!0,scrolling:"no",frameBorder:"0"}):o.jsx("img",{className:v.poster,src:`/portfolio-hoaiy/assets/images/${u.placeholderVideo}`,alt:u.title,draggable:!1})),u.youtube&&(s?o.jsx("iframe",{className:v.poster,src:`https://www.youtube.com/embed/${u.youtube}?autoplay=1&mute=0&playsinline=1&rel=0`,title:u.title,allow:"autoplay; encrypted-media; picture-in-picture; fullscreen",allowFullScreen:!0}):o.jsx("img",{className:v.poster,src:`/portfolio-hoaiy/assets/images/${u.placeholderVideo}`,alt:u.title,draggable:!1})),o.jsx("img",{className:v.frame,src:u.frame==="video-frame-2"?he:me,alt:"",draggable:!1}),o.jsx(We,{ref:z,aspect:u.frame==="video-frame-2"?1e3/569:1,className:v.wrapTexture,onSetUnwrapped:n}),!s&&o.jsx("div",{className:v.playButton})]}),o.jsxs("div",{className:v.unwrapHint,children:[o.jsx("span",{children:"«"})," Unwrap to watch!"]})]})]}),o.jsx("div",{className:"contact_card_wrapper fadeIn",children:o.jsx(Ee,{dark:!0,invertButton:!0})})]})});export{nt as default};
