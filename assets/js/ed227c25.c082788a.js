"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[78],{876:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>f});var s=r(2784);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,s)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,s,n=function(e,t){if(null==e)return{};var r,s,n={},i=Object.keys(e);for(s=0;s<i.length;s++)r=i[s],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(s=0;s<i.length;s++)r=i[s],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var c=s.createContext({}),p=function(e){var t=s.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},u=function(e){var t=p(e.components);return s.createElement(c.Provider,{value:t},e.children)},l="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return s.createElement(s.Fragment,{},t)}},v=s.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,c=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),l=p(r),v=n,f=l["".concat(c,".").concat(v)]||l[v]||m[v]||i;return r?s.createElement(f,a(a({ref:t},u),{},{components:r})):s.createElement(f,a({ref:t},u))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,a=new Array(i);a[0]=v;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[l]="string"==typeof e?e:n,a[1]=o;for(var p=2;p<i;p++)a[p]=r[p];return s.createElement.apply(null,a)}return s.createElement.apply(null,r)}v.displayName="MDXCreateElement"},5921:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>m,frontMatter:()=>i,metadata:()=>o,toc:()=>p});var s=r(7896),n=(r(2784),r(876));const i={sidebar_position:4},a="Users Service",o={unversionedId:"project-structure/services/users-service",id:"project-structure/services/users-service",title:"Users Service",description:"https://github.com/marleypowell/goalie/tree/main/apps/service/users-service",source:"@site/docs/project-structure/services/users-service.md",sourceDirName:"project-structure/services",slug:"/project-structure/services/users-service",permalink:"/project-structure/services/users-service",draft:!1,editUrl:"https://github.com/marleypowell/goalie/tree/main/apps/website/docs/project-structure/services/users-service.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"docsSidebar",previous:{title:"OAuth Agent Service",permalink:"/project-structure/services/oauth-agent-service"},next:{title:"Curity Identity Server (3rd Party)",permalink:"/project-structure/services/curity-identity-server"}},c={},p=[],u={toc:p},l="wrapper";function m(e){let{components:t,...r}=e;return(0,n.kt)(l,(0,s.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"users-service"},"Users Service"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://github.com/marleypowell/goalie/tree/main/apps/service/users-service"},"https://github.com/marleypowell/goalie/tree/main/apps/service/users-service")),(0,n.kt)("p",null,"The Users Service is a ",(0,n.kt)("a",{parentName:"p",href:"https://nestjs.com/"},"NestJS")," application that is responsible for forwarding requests to the ",(0,n.kt)("a",{parentName:"p",href:"../../project-structure/services/curity-identity-server"},"Curity Identity Server"),". The Users Service uses ",(0,n.kt)("a",{parentName:"p",href:"https://nats.io/"},"NATS")," to communicate with the ",(0,n.kt)("a",{parentName:"p",href:"../../project-structure/services/api-gateway"},"API Gateway"),"."),(0,n.kt)("p",null,"The ",(0,n.kt)("a",{parentName:"p",href:"../../project-structure/services/curity-identity-server"},"Curity Identity Server")," has users GraphQL endpoint that is used to manage users. The Users Service provides endpoints to get a single user, to get a list of users, to create a user, to update a user, and to delete a user."),(0,n.kt)("p",null,"The Users Service is built using the following technologies:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://nestjs.com/"},"NestJS")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://nats.io/"},"NATS")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://opentelemetry.io/"},"Open Telemetry")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://graphql.org/"},"GraphQL"))))}m.isMDXComponent=!0}}]);