"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[245],{9545:(e,t,r)=>{r.d(t,{Z:()=>a});const a=r.p+"assets/images/project-structure-b4a95fdd27c535033ca1c2a4acdf1235.png"},876:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>h});var a=r(2784);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,a,i=function(e,t){if(null==e)return{};var r,a,i={},n=Object.keys(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)r=n[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var c=a.createContext({}),p=function(e){var t=a.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},l=function(e){var t=p(e.components);return a.createElement(c.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},v=a.forwardRef((function(e,t){var r=e.components,i=e.mdxType,n=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=p(r),v=i,h=u["".concat(c,".").concat(v)]||u[v]||d[v]||n;return r?a.createElement(h,o(o({ref:t},l),{},{components:r})):a.createElement(h,o({ref:t},l))}));function h(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var n=r.length,o=new Array(n);o[0]=v;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[u]="string"==typeof e?e:i,o[1]=s;for(var p=2;p<n;p++)o[p]=r[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}v.displayName="MDXCreateElement"},9801:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>d,frontMatter:()=>n,metadata:()=>s,toc:()=>p});var a=r(7896),i=(r(2784),r(876));const n={sidebar_position:1,sidebar_label:"Overview"},o="Project Structure",s={unversionedId:"project-structure/index",id:"project-structure/index",title:"Project Structure",description:"The project was created using the Nx monorepo tool. The project is organized into apps, services, and libraries. Nx is a tool that helps you develop full-stack applications using a monorepo. Nx helps you develop applications using a component-driven approach. Nx also helps you develop applications using a microservices architecture.",source:"@site/docs/project-structure/index.md",sourceDirName:"project-structure",slug:"/project-structure/",permalink:"/project-structure/",draft:!1,editUrl:"https://github.com/marleypowell/goalie/tree/main/apps/website/docs/project-structure/index.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,sidebar_label:"Overview"},sidebar:"docsSidebar",previous:{title:"Project Structure",permalink:"/category/project-structure"},next:{title:"Apps",permalink:"/category/apps"}},c={},p=[{value:"Apps",id:"apps",level:2},{value:"Frontend",id:"frontend",level:3},{value:"Website",id:"website",level:3},{value:"Services",id:"services",level:2},{value:"API Gateway",id:"api-gateway",level:3},{value:"Goals Service",id:"goals-service",level:3},{value:"OAuth Agent Service",id:"oauth-agent-service",level:3},{value:"Users Service",id:"users-service",level:3},{value:"Curity Identity Server (3rd Party)",id:"curity-identity-server-3rd-party",level:3},{value:"Libraries",id:"libraries",level:2},{value:"Common",id:"common",level:3},{value:"API Gateway API Client",id:"api-gateway-api-client",level:3},{value:"OAuth Agent API Client",id:"oauth-agent-api-client",level:3},{value:"Shared Goals",id:"shared-goals",level:3},{value:"UI",id:"ui",level:3}],l={toc:p},u="wrapper";function d(e){let{components:t,...n}=e;return(0,i.kt)(u,(0,a.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"project-structure"},"Project Structure"),(0,i.kt)("p",null,"The project was created using the ",(0,i.kt)("a",{parentName:"p",href:"https://nx.dev/"},"Nx")," monorepo tool. The project is organized into apps, services, and libraries. Nx is a tool that helps you develop full-stack applications using a monorepo. Nx helps you develop applications using a component-driven approach. Nx also helps you develop applications using a microservices architecture."),(0,i.kt)("p",null,"The frontend apps are built using ",(0,i.kt)("a",{parentName:"p",href:"https://angular.io/"},"Angular"),". The backend microservices are built using ",(0,i.kt)("a",{parentName:"p",href:"https://nestjs.com/"},"NestJS"),". The project is organized as follows:"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Project Structure",src:r(9545).Z,width:"4252",height:"787"})),(0,i.kt)("h2",{id:"apps"},"Apps"),(0,i.kt)("h3",{id:"frontend"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/apps/frontend"},"Frontend")),(0,i.kt)("h3",{id:"website"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/apps/website"},"Website")),(0,i.kt)("h2",{id:"services"},"Services"),(0,i.kt)("h3",{id:"api-gateway"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/services/api-gateway"},"API Gateway")),(0,i.kt)("h3",{id:"goals-service"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/services/goals-service"},"Goals Service")),(0,i.kt)("h3",{id:"oauth-agent-service"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/services/oauth-agent-service"},"OAuth Agent Service")),(0,i.kt)("h3",{id:"users-service"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/services/users-service"},"Users Service")),(0,i.kt)("h3",{id:"curity-identity-server-3rd-party"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/services/curity-identity-server"},"Curity Identity Server (3rd Party)")),(0,i.kt)("h2",{id:"libraries"},"Libraries"),(0,i.kt)("h3",{id:"common"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/libraries/common"},"Common")),(0,i.kt)("h3",{id:"api-gateway-api-client"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/libraries/api-gateway-api-client"},"API Gateway API Client")),(0,i.kt)("h3",{id:"oauth-agent-api-client"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/libraries/oauth-agent-api-client"},"OAuth Agent API Client")),(0,i.kt)("h3",{id:"shared-goals"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/libraries/shared-goals"},"Shared Goals")),(0,i.kt)("h3",{id:"ui"},(0,i.kt)("a",{parentName:"h3",href:"../project-structure/libraries/ui"},"UI")))}d.isMDXComponent=!0}}]);