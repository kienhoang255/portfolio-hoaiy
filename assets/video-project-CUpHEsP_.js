import{a as u,p as c,w as Re,x as be,y as Pe}from"./chunk-EPOLDU6W-CgeV-fgw.js";import{d as te,s as z}from"./video.module-DNXU4Hdx.js";import{b as je,a as Ce}from"./btn-back-2-DNC77qh5.js";import{C as Se}from"./contactCard-BbgOp02Q.js";import{a as Ne}from"./index-CzGk7Trj.js";import{p as le}from"./playClickSound-B2ataRUi.js";const De="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",Ee=`
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
`,Te=`
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,_e=`
    varying vec3 vNormal;
    varying vec2 vUv;

    ${Ee}

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
`,G=30,V=24,Me=1.06,Q=.5,Ie=-.5,Le=2.2,J=.985,Ae=15,fe=3,Be=25,ee=.8,de=.5,Fe=80;function Oe(B){const x=G+1,g=V+1,R=B*Me,o=Q-Ie,i=[];for(let t=0;t<g;t++)for(let e=0;e<x;e++){const f=-R/2+e/G*R,h=Q-t/V*o,P=Math.sin(e*.7+t*.35)*.035,p=(Math.random()-.5)*.025,M=P+p;i.push({x:f,y:h,z:M,px:f,py:h,pz:M,pinned:!1,pinX:f,pinY:h,pinZ:M})}const n=(t,e)=>e*x+t,a=[];for(let t=0;t<=V;t++)for(let e=0;e<=G;e++)(t===0||t===V||e===0||e===G)&&a.push(n(e,t));const X=new Set(a);for(const t of a){const e=i[t],f=t%x,h=Math.floor(t/x);e.pinned=!0,e.pinX=B*(f/G-.5),e.pinY=Q-h/V*o,e.pinZ=e.z,e.x=e.px=e.pinX,e.y=e.py=e.pinY,e.z=e.pz=e.pinZ}const I=[],w=(t,e,f)=>{const h=i[t],P=i[e],p=Math.hypot(h.x-P.x,h.y-P.y,h.z-P.z);I.push({i1:t,i2:e,restLength:p,stiffness:f})};for(let t=0;t<g;t++)for(let e=0;e<x;e++){const f=n(e,t);e<x-1&&w(f,n(e+1,t),.98),t<g-1&&w(f,n(e,t+1),.98),e<x-1&&t<g-1&&(w(f,n(e+1,t+1),.65),w(n(e+1,t),n(e,t+1),.65)),e<x-2&&w(f,n(e+2,t),.25),t<g-2&&w(f,n(e,t+2),.25)}const b=[];for(let t=0;t<g-1;t++)for(let e=0;e<x-1;e++){const f=n(e,t),h=n(e+1,t),P=n(e,t+1),p=n(e+1,t+1);b.push(f,P,h,h,P,p)}const _=new Float32Array(x*g*2);for(let t=0;t<g;t++)for(let e=0;e<x;e++)_[n(e,t)*2]=e/G,_[n(e,t)*2+1]=1-t/V;return{particles:i,constraints:I,indices:b,uvs:_,cols:x,rows:g,clothWidth:R,permanentPins:a,permanentPinSet:X}}function pe(B,x,g){const R=g*g;for(const o of B){if(o.pinned){o.x=o.pinX,o.y=o.pinY,o.z=o.pinZ;continue}const i=(o.x-o.px)*J,n=(o.y-o.py)*J,a=(o.z-o.pz)*J;o.px=o.x,o.py=o.y,o.pz=o.z,o.x+=i,o.y+=n-Le*R,o.z+=a}for(let o=0;o<Ae;o++){for(const i of x){const n=B[i.i1],a=B[i.i2],X=a.x-n.x,I=a.y-n.y,w=a.z-n.z,b=Math.hypot(X,I,w)||1e-5,_=(b-i.restLength)/b*.5*i.stiffness,t=X*_,e=I*_,f=w*_;!n.pinned&&!a.pinned?(n.x+=t,n.y+=e,n.z+=f,a.x-=t,a.y-=e,a.z-=f):n.pinned&&!a.pinned?(a.x-=t*2,a.y-=e*2,a.z-=f*2):!n.pinned&&a.pinned&&(n.x+=t*2,n.y+=e*2,n.z+=f*2)}for(const i of B)i.pinned&&(i.x=i.pinX,i.y=i.pinY,i.z=i.pinZ)}}const He=u.forwardRef(function({aspect:x,className:g,onSetUnwrapped:R},o){const i=u.useRef(null),n=u.useRef(null),[a,X]=u.useState(!1);u.useEffect(()=>X(!0),[]);const I=u.useRef(x);I.current=x;const w=u.useRef(null),b=u.useRef(null),_=u.useRef({x:0,y:0}),t=u.useRef({x:0,y:0}),e=u.useRef({x:0,y:0}),f=u.useRef([]),h=u.useRef(!1),P=u.useRef(null),p=u.useRef({t:0,x:0,y:0,vx:0,vy:0});return u.useImperativeHandle(o,()=>({grab:(M,m)=>{if(h.current)return;const j=w.current,S=n.current;if(!j||!S)return;const N=S.getBoundingClientRect();if(!N.width||!N.height)return;const C=N.left+.04*N.width,W=N.top+.04*N.height,F=.92*N.width,L=.92*N.height,D=C+F/2,E=W+L/2,r=I.current/N.width,s=(M-D)*r,d=(E-m)*r;let H=-1,q=1/0;if(j.particles.forEach((U,$)=>{if(j.permanentPinSet.has($))return;const Z=(U.x-s)**2+(U.y-d)**2;Z<q&&(q=Z,H=$)}),H>=0){b.current=H,_.current={x:j.particles[H].x,y:j.particles[H].y},t.current={x:M,y:m},e.current={x:0,y:0},p.current={t:0,x:0,y:0,vx:0,vy:0},h.current=!1,P.current=null;for(const U of j.permanentPins){const $=j.particles[U];f.current[U]={x:$.pinX,y:$.pinY,z:$.pinZ}}}},setTarget:(M,m,j)=>{const S=w.current,N=n.current;if(!S||!N)return;const C=N.getBoundingClientRect();if(!C.width||!C.height)return;const W=Math.hypot(m??0,j??0),F=I.current/C.width,L=(m??0)*F,D=1*(j??0)*F;if(m!==void 0&&j!==void 0){if(b.current!==null){const r=S.particles[b.current];r.pinned=!0,r.px=r.x,r.py=r.y,r.pz=r.z,r.pinX=_.current.x+L,r.pinY=_.current.y+D,r.pinZ=.18,e.current={x:L,y:D};const s=performance.now(),d=p.current;if(d.t){const H=Math.max((s-d.t)/1e3,.001);d.vx=d.vx*.6+(L-d.x)/H*.4,d.vy=d.vy*.6+(D-d.y)/H*.4}d.t=s,d.x=L,d.y=D}const E=Be/100*window.innerWidth;if(b.current!==null&&W>=E&&!h.current){h.current=!0;for(const r of S.permanentPins){const s=S.particles[r];f.current[r]={x:s.pinX,y:s.pinY,z:s.pinZ},s.pinned=!1,console.log("bung"),R(!0)}}return}if(b.current!==null){const E=S.particles[b.current];if(h.current){E.pinned=!1;const r=p.current,s=!r.t||performance.now()-r.t>Fe;P.current=s?{x:0,y:0}:{x:r.vx,y:r.vy}}else{E.pinned=!1,E.px=E.x,E.py=E.y,E.pz=E.z;for(const r of S.permanentPins){const s=f.current[r];if(s){const d=S.particles[r];d.pinX=s.x,d.pinY=s.y,d.pinZ=s.z,d.pinned=!0}}}}b.current=null},isPeeled:()=>h.current}),[]),u.useEffect(()=>{if(!a)return;let M=!1,m,j,S=0;return(async()=>{const N=i.current;if(!N)return;let C;try{C=await import(De)}catch{return}if(M||!i.current)return;const W=new C.Scene,F=new C.OrthographicCamera(-x/2,x/2,.5,-.5,.1,10);F.position.z=2,m=new C.WebGLRenderer({alpha:!0,antialias:!0}),m.setPixelRatio(Math.min(window.devicePixelRatio,2)),m.domElement.style.display="block",N.appendChild(m.domElement);const L=Oe(x);w.current=L;const{particles:D,constraints:E}=L,r=new Float32Array(D.length*3),s=new Float32Array(D.length*3),d=new C.BufferGeometry;d.setAttribute("position",new C.BufferAttribute(r,3)),d.setAttribute("normal",new C.BufferAttribute(s,3)),d.setAttribute("uv",new C.BufferAttribute(L.uvs,2)),d.setIndex(L.indices);const H=new C.ShaderMaterial({vertexShader:Te,fragmentShader:_e,side:C.DoubleSide,transparent:!0,depthWrite:!1}),q=new C.Mesh(d,H);W.add(q);function U(){for(let l=0;l<D.length;l++){const v=D[l];r[l*3]=v.x,r[l*3+1]=v.y,r[l*3+2]=v.z}s.fill(0);const A=L.indices;for(let l=0;l<A.length;l+=3){const v=A[l],O=A[l+1],y=A[l+2],T=r[v*3],k=r[v*3+1],Y=r[v*3+2],ue=r[O*3],xe=r[O*3+1],ve=r[O*3+2],he=r[y*3],me=r[y*3+1],ye=r[y*3+2],re=ue-T,oe=xe-k,ie=ve-Y,se=he-T,ce=me-k,ae=ye-Y,ge=oe*ae-ie*ce,we=ie*se-re*ae,ze=re*ce-oe*se;for(const K of[v,O,y])s[K*3]+=ge,s[K*3+1]+=we,s[K*3+2]+=ze}for(let l=0;l<D.length;l++){const v=s[l*3],O=s[l*3+1],y=s[l*3+2],T=Math.hypot(v,O,y);T>1e-5?(s[l*3]=v/T,s[l*3+1]=O/T,s[l*3+2]=y/T):s[l*3+2]=1}d.attributes.position.needsUpdate=!0,d.attributes.normal.needsUpdate=!0}function $(){const A=i.current;if(!A||!m)return;const{clientWidth:l,clientHeight:v}=A;!l||!v||m.setSize(l,v)}j=new ResizeObserver($),j.observe(N),$();for(let A=0;A<80;A++)pe(D,E,1/60);let Z=performance.now();function ne(A){S=requestAnimationFrame(ne);const l=Math.min((A-Z)/1e3,1/30);Z=A;const v=n.current?.getBoundingClientRect();if(v&&v.width){const y=I.current/v.width,T=v.left+v.width/2,k=v.top+v.height/2;F.left=-T*y,F.right=(window.innerWidth-T)*y,F.top=k*y,F.bottom=(k-window.innerHeight)*y,F.updateProjectionMatrix()}const O=l/fe;if(P.current){let{x:y,y:T}=P.current;const k=Math.hypot(y,T);k>ee&&(y*=ee/k,T*=ee/k),y*=de,T*=de;for(const Y of L.permanentPins)D[Y].pinned=!1;for(const Y of D)Y.pinned||(Y.px=Y.x-y*O,Y.py=Y.y-T*O);P.current=null}for(let y=0;y<fe;y++)pe(D,E,O);U(),m.render(W,F)}S=requestAnimationFrame(ne)})(),()=>{M=!0,cancelAnimationFrame(S),j?.disconnect(),m&&(m.dispose(),m.domElement.remove())}},[x,a]),c.jsxs(c.Fragment,{children:[c.jsx("div",{ref:n,className:g}),a&&Ne.createPortal(c.jsx("div",{ref:i,style:{position:"fixed",inset:0,width:"100vw",height:"100vh",pointerEvents:"none",zIndex:50}}),document.body)]})}),Ye="/portfolio-hoaiy/assets/video-bg-D6c5NC7V.jpg",Xe="/portfolio-hoaiy/assets/video-frame-CBQwmCZQ.png",$e="/portfolio-hoaiy/assets/video-frame-2-3JzB9NCK.png";function ke(B){return B!=="routing"&&B in te}const Ke=Re(function(){const x=be(),{pid:g}=Pe(),R=te.routing.find(p=>p.id===g),o=g&&ke(g)?te[g]:void 0,[i,n]=u.useState(!1),[a,X]=u.useState(!1),I=u.useRef(null),w=u.useRef(null),b=u.useRef({x:0,y:0}),_=u.useRef({x:0,y:0}),t=u.useRef(null);if(!R)return c.jsx("div",{children:"Project not found"});function e(){le(),x("/video")}function f(p){i||(X(!0),b.current={x:p.clientX,y:p.clientY},p.currentTarget.setPointerCapture(p.pointerId),w.current?.grab(p.clientX,p.clientY))}function h(p){if(!a)return;const M=p.clientX-b.current.x,m=p.clientY-b.current.y;_.current={x:M,y:m};const j=(I.current?.offsetWidth??300)*.3,S=Math.min(Math.hypot(M,m)/j,1.3);w.current?.setTarget(S,M,-m)}function P(p){a&&(X(!1),p.currentTarget.releasePointerCapture(p.pointerId),i?(le(),n(!0),w.current?.setTarget(1),t.current?.play()):w.current?.setTarget(0),_.current={x:0,y:0})}return c.jsx("div",{className:z["container-project"],style:{backgroundImage:`url(${Ye})`},children:c.jsxs("div",{className:z.content_wrapper,children:[c.jsxs("div",{className:`${z["header-project"]} fadeIn`,children:[c.jsxs("div",{className:`${z["btn-back"]} pointer`,onClick:()=>e(),children:[c.jsx("img",{src:je,alt:"button back",className:"pointer"}),c.jsx("img",{src:Ce,alt:"",className:z["btn-back-hover"]})]}),c.jsxs("div",{className:z.about,children:[c.jsxs("strong",{children:["• Video title: ",c.jsx("div",{children:R.title})]}),c.jsx("br",{}),c.jsxs("div",{className:z.industry,children:["• Objective: ",c.jsx("span",{children:R.desc})]}),c.jsxs("div",{children:["• Project overview: ",c.jsx("span",{children:o?.project_overview??""})]})]})]}),c.jsxs("div",{className:`${z.content} ${R.frame==="video-frame-2"?z.wide:""} fadeIn`,children:[c.jsxs("div",{ref:I,className:`${z.wrap} ${R.frame==="video-frame-2"?z.wide:""} ${i?z.unwrapped:""} ${a?z.dragging:""} ${i?"":"pointer"}`,onPointerDown:f,onPointerMove:h,onPointerUp:P,onPointerCancel:P,children:[R.videoLink&&c.jsx("video",{ref:t,className:z.poster,src:`/portfolio-hoaiy/assets/videos/${R.videoLink}`,poster:`/portfolio-hoaiy/assets/images/${R.placeholderVideo}`,controls:i,playsInline:!0,preload:"metadata"}),c.jsx("img",{className:z.frame,src:R.frame==="video-frame-2"?$e:Xe,alt:"",draggable:!1}),c.jsx(He,{ref:w,aspect:R.frame==="video-frame-2"?1e3/569:1,className:z.wrapTexture,onSetUnwrapped:n}),!i&&c.jsx("div",{className:z.playButton})]}),c.jsxs("div",{className:z.unwrapHint,children:[c.jsx("span",{children:"«"})," Unwrap to watch!"]})]}),c.jsx("div",{className:z.contact_card_wrapper,children:c.jsx(Se,{dark:!0,invertButton:!0})})]})})});export{Ke as default};
