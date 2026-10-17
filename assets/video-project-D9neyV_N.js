import{a as u,p as c,w as Re,y as be,z as Pe}from"./chunk-EPOLDU6W-RNrl2JcA.js";import{d as te,s as z}from"./video.module-BdrgZeQO.js";import{b as je,a as Ce}from"./btn-back-2-DNC77qh5.js";import{C as Se}from"./contactCard-CWGDOUlQ.js";import{a as Ne}from"./index-DL1VoxV2.js";import{p as le}from"./playClickSound-B2ataRUi.js";const De="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",_e=`
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
`,Ee=`
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,Te=`
    varying vec3 vNormal;
    varying vec2 vUv;

    ${_e}

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
`,V=30,W=24,Me=1.06,Q=.5,Ie=-.5,Le=2.2,J=.985,Ae=15,fe=3,Be=350,ee=.8,de=.5,Fe=80;function Oe(B){const x=V+1,g=W+1,R=B*Me,o=Q-Ie,s=[];for(let t=0;t<g;t++)for(let e=0;e<x;e++){const d=-R/2+e/V*R,m=Q-t/W*o,P=Math.sin(e*.7+t*.35)*.035,p=(Math.random()-.5)*.025,M=P+p;s.push({x:d,y:m,z:M,px:d,py:m,pz:M,pinned:!1,pinX:d,pinY:m,pinZ:M})}const n=(t,e)=>e*x+t,a=[];for(let t=0;t<=W;t++)for(let e=0;e<=V;e++)(t===0||t===W||e===0||e===V)&&a.push(n(e,t));const X=new Set(a);for(const t of a){const e=s[t],d=t%x,m=Math.floor(t/x);e.pinned=!0,e.pinX=B*(d/V-.5),e.pinY=Q-m/W*o,e.pinZ=e.z,e.x=e.px=e.pinX,e.y=e.py=e.pinY,e.z=e.pz=e.pinZ}const I=[],w=(t,e,d)=>{const m=s[t],P=s[e],p=Math.hypot(m.x-P.x,m.y-P.y,m.z-P.z);I.push({i1:t,i2:e,restLength:p,stiffness:d})};for(let t=0;t<g;t++)for(let e=0;e<x;e++){const d=n(e,t);e<x-1&&w(d,n(e+1,t),.98),t<g-1&&w(d,n(e,t+1),.98),e<x-1&&t<g-1&&(w(d,n(e+1,t+1),.65),w(n(e+1,t),n(e,t+1),.65)),e<x-2&&w(d,n(e+2,t),.25),t<g-2&&w(d,n(e,t+2),.25)}const b=[];for(let t=0;t<g-1;t++)for(let e=0;e<x-1;e++){const d=n(e,t),m=n(e+1,t),P=n(e,t+1),p=n(e+1,t+1);b.push(d,P,m,m,P,p)}const T=new Float32Array(x*g*2);for(let t=0;t<g;t++)for(let e=0;e<x;e++)T[n(e,t)*2]=e/V,T[n(e,t)*2+1]=1-t/W;return{particles:s,constraints:I,indices:b,uvs:T,cols:x,rows:g,clothWidth:R,permanentPins:a,permanentPinSet:X}}function pe(B,x,g){const R=g*g;for(const o of B){if(o.pinned){o.x=o.pinX,o.y=o.pinY,o.z=o.pinZ;continue}const s=(o.x-o.px)*J,n=(o.y-o.py)*J,a=(o.z-o.pz)*J;o.px=o.x,o.py=o.y,o.pz=o.z,o.x+=s,o.y+=n-Le*R,o.z+=a}for(let o=0;o<Ae;o++){for(const s of x){const n=B[s.i1],a=B[s.i2],X=a.x-n.x,I=a.y-n.y,w=a.z-n.z,b=Math.hypot(X,I,w)||1e-5,T=(b-s.restLength)/b*.5*s.stiffness,t=X*T,e=I*T,d=w*T;!n.pinned&&!a.pinned?(n.x+=t,n.y+=e,n.z+=d,a.x-=t,a.y-=e,a.z-=d):n.pinned&&!a.pinned?(a.x-=t*2,a.y-=e*2,a.z-=d*2):!n.pinned&&a.pinned&&(n.x+=t*2,n.y+=e*2,n.z+=d*2)}for(const s of B)s.pinned&&(s.x=s.pinX,s.y=s.pinY,s.z=s.pinZ)}}const He=u.forwardRef(function({aspect:x,className:g,onSetUnwrapped:R},o){const s=u.useRef(null),n=u.useRef(null),[a,X]=u.useState(!1);u.useEffect(()=>X(!0),[]);const I=u.useRef(x);I.current=x;const w=u.useRef(null),b=u.useRef(null),T=u.useRef({x:0,y:0}),t=u.useRef({x:0,y:0}),e=u.useRef({x:0,y:0}),d=u.useRef([]),m=u.useRef(!1),P=u.useRef(null),p=u.useRef({t:0,x:0,y:0,vx:0,vy:0});return u.useImperativeHandle(o,()=>({grab:(M,h)=>{if(m.current)return;const j=w.current,N=n.current;if(!j||!N)return;const D=N.getBoundingClientRect();if(!D.width||!D.height)return;const C=D.left+.04*D.width,G=D.top+.04*D.height,F=.92*D.width,L=.92*D.height,_=C+F/2,l=G+L/2,i=I.current/D.width,r=(M-_)*i,S=(l-h)*i;let k=-1,q=1/0;if(j.particles.forEach((U,Y)=>{if(j.permanentPinSet.has(Y))return;const Z=(U.x-r)**2+(U.y-S)**2;Z<q&&(q=Z,k=Y)}),k>=0){b.current=k,T.current={x:j.particles[k].x,y:j.particles[k].y},t.current={x:M,y:h},e.current={x:0,y:0},p.current={t:0,x:0,y:0,vx:0,vy:0},m.current=!1,P.current=null;for(const U of j.permanentPins){const Y=j.particles[U];d.current[U]={x:Y.pinX,y:Y.pinY,z:Y.pinZ}}}},setTarget:(M,h,j)=>{const N=w.current,D=n.current;if(!N||!D)return;const C=D.getBoundingClientRect();if(!C.width||!C.height)return;const G=Math.hypot(h??0,j??0),F=I.current/C.width,L=(h??0)*F,_=1*(j??0)*F;if(h!==void 0&&j!==void 0){if(b.current!==null){const l=N.particles[b.current];l.pinned=!0,l.px=l.x,l.py=l.y,l.pz=l.z,l.pinX=T.current.x+L,l.pinY=T.current.y+_,l.pinZ=.18,e.current={x:L,y:_};const i=performance.now(),r=p.current;if(r.t){const S=Math.max((i-r.t)/1e3,.001);r.vx=r.vx*.6+(L-r.x)/S*.4,r.vy=r.vy*.6+(_-r.y)/S*.4}r.t=i,r.x=L,r.y=_}if(b.current!==null&&G>=Be&&!m.current){m.current=!0;for(const l of N.permanentPins){const i=N.particles[l];d.current[l]={x:i.pinX,y:i.pinY,z:i.pinZ},i.pinned=!1,console.log("bung"),R(!0)}}return}if(b.current!==null){const l=N.particles[b.current];if(m.current){l.pinned=!1;const i=p.current,r=!i.t||performance.now()-i.t>Fe;P.current=r?{x:0,y:0}:{x:i.vx,y:i.vy}}else{l.pinned=!1,l.px=l.x,l.py=l.y,l.pz=l.z;for(const i of N.permanentPins){const r=d.current[i];if(r){const S=N.particles[i];S.pinX=r.x,S.pinY=r.y,S.pinZ=r.z,S.pinned=!0}}}}b.current=null},isPeeled:()=>m.current}),[]),u.useEffect(()=>{if(!a)return;let M=!1,h,j,N=0;return(async()=>{const D=s.current;if(!D)return;let C;try{C=await import(De)}catch{return}if(M||!s.current)return;const G=new C.Scene,F=new C.OrthographicCamera(-x/2,x/2,.5,-.5,.1,10);F.position.z=2,h=new C.WebGLRenderer({alpha:!0,antialias:!0}),h.setPixelRatio(Math.min(window.devicePixelRatio,2)),h.domElement.style.display="block",D.appendChild(h.domElement);const L=Oe(x);w.current=L;const{particles:_,constraints:l}=L,i=new Float32Array(_.length*3),r=new Float32Array(_.length*3),S=new C.BufferGeometry;S.setAttribute("position",new C.BufferAttribute(i,3)),S.setAttribute("normal",new C.BufferAttribute(r,3)),S.setAttribute("uv",new C.BufferAttribute(L.uvs,2)),S.setIndex(L.indices);const k=new C.ShaderMaterial({vertexShader:Ee,fragmentShader:Te,side:C.DoubleSide,transparent:!0,depthWrite:!1}),q=new C.Mesh(S,k);G.add(q);function U(){for(let f=0;f<_.length;f++){const v=_[f];i[f*3]=v.x,i[f*3+1]=v.y,i[f*3+2]=v.z}r.fill(0);const A=L.indices;for(let f=0;f<A.length;f+=3){const v=A[f],O=A[f+1],y=A[f+2],E=i[v*3],$=i[v*3+1],H=i[v*3+2],ue=i[O*3],xe=i[O*3+1],ve=i[O*3+2],me=i[y*3],he=i[y*3+1],ye=i[y*3+2],re=ue-E,oe=xe-$,ie=ve-H,se=me-E,ce=he-$,ae=ye-H,ge=oe*ae-ie*ce,we=ie*se-re*ae,ze=re*ce-oe*se;for(const K of[v,O,y])r[K*3]+=ge,r[K*3+1]+=we,r[K*3+2]+=ze}for(let f=0;f<_.length;f++){const v=r[f*3],O=r[f*3+1],y=r[f*3+2],E=Math.hypot(v,O,y);E>1e-5?(r[f*3]=v/E,r[f*3+1]=O/E,r[f*3+2]=y/E):r[f*3+2]=1}S.attributes.position.needsUpdate=!0,S.attributes.normal.needsUpdate=!0}function Y(){const A=s.current;if(!A||!h)return;const{clientWidth:f,clientHeight:v}=A;!f||!v||h.setSize(f,v)}j=new ResizeObserver(Y),j.observe(D),Y();for(let A=0;A<80;A++)pe(_,l,1/60);let Z=performance.now();function ne(A){N=requestAnimationFrame(ne);const f=Math.min((A-Z)/1e3,1/30);Z=A;const v=n.current?.getBoundingClientRect();if(v&&v.width){const y=I.current/v.width,E=v.left+v.width/2,$=v.top+v.height/2;F.left=-E*y,F.right=(window.innerWidth-E)*y,F.top=$*y,F.bottom=($-window.innerHeight)*y,F.updateProjectionMatrix()}const O=f/fe;if(P.current){let{x:y,y:E}=P.current;const $=Math.hypot(y,E);$>ee&&(y*=ee/$,E*=ee/$),y*=de,E*=de;for(const H of L.permanentPins)_[H].pinned=!1;for(const H of _)H.pinned||(H.px=H.x-y*O,H.py=H.y-E*O);P.current=null}for(let y=0;y<fe;y++)pe(_,l,O);U(),h.render(G,F)}N=requestAnimationFrame(ne)})(),()=>{M=!0,cancelAnimationFrame(N),j?.disconnect(),h&&(h.dispose(),h.domElement.remove())}},[x,a]),c.jsxs(c.Fragment,{children:[c.jsx("div",{ref:n,className:g}),a&&Ne.createPortal(c.jsx("div",{ref:s,style:{position:"fixed",inset:0,width:"100vw",height:"100vh",pointerEvents:"none",zIndex:50}}),document.body)]})}),Xe="/portfolio-hoaiy/assets/video-bg-D6c5NC7V.jpg",Ye="/portfolio-hoaiy/assets/video-frame-CBQwmCZQ.png",$e="/portfolio-hoaiy/assets/video-frame-2-3JzB9NCK.png";function ke(B){return B!=="routing"&&B in te}const Ke=Re(function(){const x=be(),{pid:g}=Pe(),R=te.routing.find(p=>p.id===g),o=g&&ke(g)?te[g]:void 0,[s,n]=u.useState(!1),[a,X]=u.useState(!1),I=u.useRef(null),w=u.useRef(null),b=u.useRef({x:0,y:0}),T=u.useRef({x:0,y:0}),t=u.useRef(null);if(!R)return c.jsx("div",{children:"Project not found"});function e(){le(),x("/video")}function d(p){s||(X(!0),b.current={x:p.clientX,y:p.clientY},p.currentTarget.setPointerCapture(p.pointerId),w.current?.grab(p.clientX,p.clientY))}function m(p){if(!a)return;const M=p.clientX-b.current.x,h=p.clientY-b.current.y;T.current={x:M,y:h};const j=(I.current?.offsetWidth??300)*.3,N=Math.min(Math.hypot(M,h)/j,1.3);w.current?.setTarget(N,M,-h)}function P(p){a&&(X(!1),p.currentTarget.releasePointerCapture(p.pointerId),s?(le(),n(!0),w.current?.setTarget(1),t.current?.play()):w.current?.setTarget(0),T.current={x:0,y:0})}return c.jsx("div",{className:z["container-project"],style:{backgroundImage:`url(${Xe})`},children:c.jsxs("div",{className:z.content_wrapper,children:[c.jsxs("div",{className:`${z["header-project"]} fadeIn`,children:[c.jsxs("div",{className:`${z["btn-back"]} pointer`,onClick:()=>e(),children:[c.jsx("img",{src:je,alt:"button back",className:"pointer"}),c.jsx("img",{src:Ce,alt:"",className:z["btn-back-hover"]})]}),c.jsxs("div",{className:z.about,children:[c.jsxs("strong",{children:["• Video title: ",c.jsx("div",{children:R.title})]}),c.jsx("br",{}),c.jsxs("div",{className:z.industry,children:["• Objective: ",c.jsx("span",{children:R.desc})]}),c.jsxs("div",{children:["• Project overview: ",c.jsx("span",{children:o?.project_overview??""})]})]})]}),c.jsxs("div",{className:`${z.content} ${R.frame==="video-frame-2"?z.wide:""} fadeIn`,children:[c.jsxs("div",{ref:I,className:`${z.wrap} ${R.frame==="video-frame-2"?z.wide:""} ${s?z.unwrapped:""} ${a?z.dragging:""} ${s?"":"pointer"}`,onPointerDown:d,onPointerMove:m,onPointerUp:P,onPointerCancel:P,children:[R.videoLink&&c.jsx("video",{ref:t,className:z.poster,src:`/portfolio-hoaiy/assets/videos/${R.videoLink}`,poster:`/portfolio-hoaiy/assets/images/${R.placeholderVideo}`,controls:!0,playsInline:!0,preload:"metadata"}),c.jsx("img",{className:z.frame,src:R.frame==="video-frame-2"?$e:Ye,alt:"",draggable:!1}),c.jsx(He,{ref:w,aspect:R.frame==="video-frame-2"?1e3/569:1,className:z.wrapTexture,onSetUnwrapped:n}),!s&&c.jsx("div",{className:z.playButton})]}),c.jsxs("div",{className:z.unwrapHint,children:[c.jsx("span",{children:"«"})," Unwrap to watch!"]})]}),c.jsx("div",{className:z.contact_card_wrapper,children:c.jsx(Se,{dark:!0,invertButton:!0})})]})})});export{Ke as default};
