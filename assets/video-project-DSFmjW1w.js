import{a as z,p as l,w as ue,y as pe,z as xe}from"./chunk-EPOLDU6W-RNrl2JcA.js";import{d as H,s as y}from"./video.module-Cy-OHQa8.js";import{b as ve,a as me}from"./btn-back-2-DNC77qh5.js";import{C as he}from"./contactCard-CWGDOUlQ.js";import{p as q}from"./playClickSound-B2ataRUi.js";const ge="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",ye=`
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
`,we=`
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vNormal = normalMatrix * normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,ze=`
    varying vec3 vNormal;
    varying vec2 vUv;

    ${ye}

    void main() {
        vec3 n = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 lightDir = normalize(vec3(0.35, 0.6, 0.75));

        float diffuse = max(dot(n, lightDir), 0.0);
        float wrapAmt = 0.3;
        float lighting = clamp((diffuse + wrapAmt) / (1.0 + wrapAmt), 0.0, 1.0);

        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(n, halfDir), 0.0), 14.0) * 0.1;

        float grain = snoise(vUv * 90.0) * 0.015;
        vec3 color = vec3(0.97, 0.965, 0.95) * (0.42 + lighting * 0.62) + spec + grain;

        gl_FragColor = vec4(color, 1.0);
    }
`,B=18,O=13,be=1.22,K=.62,Re=-.58,je=2.6,L=.985,Ce=8,Q=2;function Ne(D){const p=B+1,m=O+1,h=D*be,r=K-Re,i=[];for(let e=0;e<m;e++)for(let t=0;t<p;t++){const n=-h/2+t/B*h,x=K-e/O*r,s=(Math.random()-.5)*.02;i.push({x:n,y:x,z:s,px:n,py:x,pz:s,pinned:!1,pinX:n,pinY:x,pinZ:s})}const o=(e,t)=>t*p+e,b=[Math.round(p*.14),Math.round(p*.86)].map(e=>o(e,0));for(const e of b)i[e].pinned=!0;const R=[],v=(e,t,n)=>{const x=i[e],s=i[t],u=Math.hypot(x.x-s.x,x.y-s.y,x.z-s.z);R.push({i1:e,i2:t,restLength:u,stiffness:n})};for(let e=0;e<m;e++)for(let t=0;t<p;t++){const n=o(t,e);t<p-1&&v(n,o(t+1,e),.9),e<m-1&&v(n,o(t,e+1),.9),t<p-1&&e<m-1&&(v(n,o(t+1,e+1),.5),v(o(t+1,e),o(t,e+1),.5)),t<p-2&&v(n,o(t+2,e),.15),e<m-2&&v(n,o(t,e+2),.15)}const f=[];for(let e=0;e<m-1;e++)for(let t=0;t<p-1;t++){const n=o(t,e),x=o(t+1,e),s=o(t,e+1),u=o(t+1,e+1);f.push(n,s,x,x,s,u)}const d=new Float32Array(p*m*2);for(let e=0;e<m;e++)for(let t=0;t<p;t++)d[o(t,e)*2]=t/B,d[o(t,e)*2+1]=1-e/O;return{particles:i,constraints:R,indices:f,uvs:d,cols:p,rows:m,clothWidth:h,permanentPins:b}}function J(D,p,m){const h=m*m;for(const r of D){if(r.pinned){r.x=r.pinX,r.y=r.pinY,r.z=r.pinZ;continue}const i=(r.x-r.px)*L,o=(r.y-r.py)*L,a=(r.z-r.pz)*L;r.px=r.x,r.py=r.y,r.pz=r.z,r.x+=i,r.y+=o-je*h,r.z+=a}for(let r=0;r<Ce;r++){for(const i of p){const o=D[i.i1],a=D[i.i2],b=a.x-o.x,R=a.y-o.y,v=a.z-o.z,f=Math.hypot(b,R,v)||1e-5,d=(f-i.restLength)/f*.5*i.stiffness,e=b*d,t=R*d,n=v*d;!o.pinned&&!a.pinned?(o.x+=e,o.y+=t,o.z+=n,a.x-=e,a.y-=t,a.z-=n):o.pinned&&!a.pinned?(a.x-=e*2,a.y-=t*2,a.z-=n*2):!o.pinned&&a.pinned&&(o.x+=e*2,o.y+=t*2,o.z+=n*2)}for(const i of D)i.pinned&&(i.x=i.pinX,i.y=i.pinY,i.z=i.pinZ)}}const Pe=z.forwardRef(function({aspect:p,className:m},h){const r=z.useRef(null),i=z.useRef(p);i.current=p;const o=z.useRef(null),a=z.useRef(null),b=z.useRef({x:0,y:0}),R=z.useRef(null);return z.useImperativeHandle(h,()=>({grab:(v,f)=>{const d=o.current,e=r.current;if(!d||!e)return;const t=e.getBoundingClientRect();if(!t.width||!t.height)return;const n=((v-t.left)/t.width-.5)*i.current,x=.5-(f-t.top)/t.height;let s=-1,u=1/0;d.particles.forEach((g,M)=>{if(d.permanentPins.includes(M))return;const I=(g.x-n)**2+(g.y-x)**2;I<u&&(u=I,s=M)}),s>=0&&(a.current=s,b.current={x:d.particles[s].x,y:d.particles[s].y})},setTarget:(v,f,d)=>{const e=o.current,t=r.current;if(f!==void 0&&d!==void 0){if(e&&t&&a.current!==null){const n=t.getBoundingClientRect(),x=n.width?f/n.width*i.current:0,s=n.height?d/n.height:0,u=e.particles[a.current];u.pinned=!0,u.pinX=b.current.x+x,u.pinY=b.current.y+s,u.pinZ=.18}return}if(e&&a.current!==null){const n=e.particles[a.current],x=v>=1?{x:n.pinX-b.current.x,y:n.pinY-b.current.y}:null;n.pinned=!1,x&&(R.current=x)}a.current=null}}),[]),z.useEffect(()=>{let v=!1,f,d,e=0;return(async()=>{const t=r.current;if(!t)return;let n;try{n=await import(ge)}catch{return}if(v||!r.current)return;const x=new n.Scene,s=new n.OrthographicCamera(-p/2,p/2,.5,-.5,.1,10);s.position.z=2,f=new n.WebGLRenderer({alpha:!0,antialias:!0}),f.setPixelRatio(Math.min(window.devicePixelRatio,2)),t.appendChild(f.domElement);const u=Ne(p);o.current=u;const{particles:g,constraints:M,cols:I,rows:Me}=u,j=new Float32Array(g.length*3),P=new Float32Array(g.length*3),S=new n.BufferGeometry;S.setAttribute("position",new n.BufferAttribute(j,3)),S.setAttribute("normal",new n.BufferAttribute(P,3)),S.setAttribute("uv",new n.BufferAttribute(u.uvs,2)),S.setIndex(u.indices);const ee=new n.ShaderMaterial({vertexShader:we,fragmentShader:ze,side:n.DoubleSide}),te=new n.Mesh(S,ee);x.add(te);function ne(){for(let c=0;c<g.length;c++){const w=g[c];j[c*3]=w.x,j[c*3+1]=w.y,j[c*3+2]=w.z}P.fill(0);const C=u.indices;for(let c=0;c<C.length;c+=3){const w=C[c],N=C[c+1],T=C[c+2],_=j[w*3],A=j[w*3+1],$=j[w*3+2],re=j[N*3],oe=j[N*3+1],se=j[N*3+2],ie=j[T*3],ce=j[T*3+1],ae=j[T*3+2],X=re-_,k=oe-A,V=se-$,W=ie-_,G=ce-A,Z=ae-$,le=k*Z-V*G,de=V*W-X*Z,fe=X*G-k*W;for(const E of[w,N,T])P[E*3]+=le,P[E*3+1]+=de,P[E*3+2]+=fe}for(let c=0;c<g.length;c++){const w=P[c*3],N=P[c*3+1],T=P[c*3+2],_=Math.hypot(w,N,T);_>1e-5?(P[c*3]=w/_,P[c*3+1]=N/_,P[c*3+2]=T/_):P[c*3+2]=1}S.attributes.position.needsUpdate=!0,S.attributes.normal.needsUpdate=!0}function Y(){const C=r.current;if(!C||!f)return;const{clientWidth:c,clientHeight:w}=C;!c||!w||f.setSize(c,w)}d=new ResizeObserver(Y),d.observe(t),Y();for(let C=0;C<80;C++)J(g,M,1/60);let F=performance.now();function U(C){e=requestAnimationFrame(U);const c=Math.min((C-F)/1e3,1/30);if(F=C,R.current){const{x:N,y:T}=R.current,_=Math.hypot(N,T)||1;for(const A of u.permanentPins)g[A].pinned=!1;for(const A of g)A.px=A.x-N/_*.05,A.py=A.y-T/_*.05-.02;R.current=null}const w=c/Q;for(let N=0;N<Q;N++)J(g,M,w);ne(),f.render(x,s)}e=requestAnimationFrame(U)})(),()=>{v=!0,cancelAnimationFrame(e),d?.disconnect(),f&&(f.dispose(),f.domElement.remove())}},[p]),l.jsx("div",{ref:r,className:m})}),De="/portfolio-hoaiy/assets/video-bg-D6c5NC7V.jpg",Te="/portfolio-hoaiy/assets/video-frame-CBQwmCZQ.png",_e="/portfolio-hoaiy/assets/video-frame-2-3JzB9NCK.png";function Ae(D){return D!=="routing"&&D in H}const Le=ue(function(){const p=pe(),{pid:m}=xe(),h=H.routing.find(s=>s.id===m),r=m&&Ae(m)?H[m]:void 0,[i,o]=z.useState(!1),[a,b]=z.useState(!1),R=z.useRef(null),v=z.useRef(null),f=z.useRef({x:0,y:0}),d=z.useRef({x:0,y:0});if(!h)return l.jsx("div",{children:"Project not found"});function e(){q(),p("/video")}function t(s){i||(b(!0),f.current={x:s.clientX,y:s.clientY},s.currentTarget.setPointerCapture(s.pointerId),v.current?.grab(s.clientX,s.clientY))}function n(s){if(!a)return;const u=s.clientX-f.current.x,g=s.clientY-f.current.y;d.current={x:u,y:g};const M=(R.current?.offsetWidth??300)*.3,I=Math.min(Math.hypot(u,g)/M,1.3);v.current?.setTarget(I,u,-g)}function x(s){if(!a)return;b(!1),s.currentTarget.releasePointerCapture(s.pointerId);const u=(R.current?.offsetWidth??300)*.3;Math.hypot(d.current.x,d.current.y)>u?(q(),o(!0),v.current?.setTarget(1)):v.current?.setTarget(0),d.current={x:0,y:0}}return l.jsx("div",{className:y["container-project"],style:{backgroundImage:`url(${De})`},children:l.jsxs("div",{className:y.content_wrapper,children:[l.jsxs("div",{className:`${y["header-project"]} fadeIn`,children:[l.jsxs("div",{className:`${y["btn-back"]} pointer`,onClick:()=>e(),children:[l.jsx("img",{src:ve,alt:"button back",className:"pointer"}),l.jsx("img",{src:me,alt:"",className:y["btn-back-hover"]})]}),l.jsxs("div",{className:y.about,children:[l.jsxs("strong",{children:["• Video title: ",l.jsx("div",{children:h.title})]}),l.jsx("br",{}),l.jsxs("div",{className:y.industry,children:["• Objective: ",l.jsx("span",{children:h.desc})]}),l.jsxs("div",{children:["• Project overview: ",l.jsx("span",{children:r?.project_overview??""})]})]})]}),l.jsxs("div",{className:`${y.content} fadeIn`,children:[l.jsxs("div",{ref:R,className:`${y.wrap} ${h.frame==="video-frame-2"?y.wide:""} ${i?y.unwrapped:""} ${a?y.dragging:""} ${i?"":"pointer"}`,onPointerDown:t,onPointerMove:n,onPointerUp:x,onPointerCancel:x,children:[h.placeholderVideo&&l.jsx("img",{className:y.poster,src:`/portfolio-hoaiy/assets/images/${h.placeholderVideo}`,alt:h.title,draggable:!1}),l.jsx("img",{className:y.frame,src:h.frame==="video-frame-2"?_e:Te,alt:"",draggable:!1}),l.jsx(Pe,{ref:v,aspect:h.frame==="video-frame-2"?1e3/569:1,className:y.wrapTexture}),l.jsx("div",{className:y.playButton})]}),l.jsxs("div",{className:y.unwrapHint,children:[l.jsx("span",{children:"«"})," Press & drag to peel off the wrap!"]})]}),l.jsx("div",{className:"contact_card_wrapper",children:l.jsx(he,{dark:!0,invertButton:!0})})]})})});export{Le as default};
