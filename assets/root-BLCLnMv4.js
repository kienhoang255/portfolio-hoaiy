import{w as a,q as i,p as t,M as l,L as c,S as d,t as p,O as h,i as m}from"./chunk-EPOLDU6W-CgeV-fgw.js";const g=()=>[{rel:"preconnect",href:"https://fonts.googleapis.com"},{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"},{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"}];function f({children:s}){return t.jsxs("html",{lang:"en",children:[t.jsxs("head",{children:[t.jsx("script",{dangerouslySetInnerHTML:{__html:`(function(l) {
            if (l.search[1] === '/') {
              var decoded = l.search.slice(1).split('&').map(function(s) {
                return s.replace(/~and~/g, '&')
              }).join('?');
              window.history.replaceState(null, null,
                l.pathname.slice(0, -1) + decoded + l.hash
              );
            }
          }(window.location))`}}),t.jsx("script",{dangerouslySetInnerHTML:{__html:`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-M743NXKN');`}}),t.jsx("style",{children:"@import url('https://fonts.googleapis.com/css2?family=New+Tegomin&display=swap');"}),t.jsx("meta",{charSet:"utf-8"}),t.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),t.jsx(l,{}),t.jsx(c,{}),t.jsx("link",{rel:"icon",href:"/favicon.ico"})]}),t.jsxs("body",{children:[t.jsx("noscript",{children:t.jsx("iframe",{src:"https://www.googletagmanager.com/ns.html?id=GTM-M743NXKN",height:"0",width:"0",style:{display:"none",visibility:"hidden"}})}),s,t.jsx(d,{}),t.jsx(p,{})]})]})}const w=a(function(){return t.jsx(h,{})}),j=i(function({error:e}){let o="Oops!",n="An unexpected error occurred.",r;return m(e)&&(o=e.status===404?"404":"Error",n=e.status===404?"The requested page could not be found.":e.statusText||n),t.jsxs("main",{className:"pt-16 p-4 container mx-auto",children:[t.jsx("h1",{children:o}),t.jsx("p",{children:n}),r]})});export{j as ErrorBoundary,f as Layout,w as default,g as links};
