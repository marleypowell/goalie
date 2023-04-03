"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[427],{237:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/images/entity-relationship-diagram-d9e2a8c10fd6a1e92faf3e16919a37e6.png"},876:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>g});var n=r(2784);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,a=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(r),m=i,g=u["".concat(s,".").concat(m)]||u[m]||d[m]||a;return r?n.createElement(g,o(o({ref:t},p),{},{components:r})):n.createElement(g,o({ref:t},p))}));function g(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:i,o[1]=l;for(var c=2;c<a;c++)o[c]=r[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},9002:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var n=r(7896),i=(r(2784),r(876));const a={},o="Entity Relationship",l={unversionedId:"architecture/entity-relationship",id:"architecture/entity-relationship",title:"Entity Relationship",description:"Entities",source:"@site/docs/architecture/entity-relationship.md",sourceDirName:"architecture",slug:"/architecture/entity-relationship",permalink:"/architecture/entity-relationship",draft:!1,editUrl:"https://github.com/marleypowell/goalie/tree/main/apps/website/docs/architecture/entity-relationship.md",tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"Deployment Architecture",permalink:"/architecture/deployment-architecture"},next:{title:"Microservice Architecture",permalink:"/architecture/microservice-architecture"}},s={},c=[{value:"Entities",id:"entities",level:2},{value:"User",id:"user",level:3},{value:"Goal",id:"goal",level:3},{value:"Entity Relationship Diagram",id:"entity-relationship-diagram",level:2}],p={toc:c},u="wrapper";function d(e){let{components:t,...a}=e;return(0,i.kt)(u,(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"entity-relationship"},"Entity Relationship"),(0,i.kt)("h2",{id:"entities"},"Entities"),(0,i.kt)("h3",{id:"user"},"User"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"interface User {\n  id: string;\n  active: boolean;\n  addresses?: Address[];\n  displayName?: string;\n  emails?: StringMultiValuedValue;\n  externalId?: string;\n  locale?: string;\n  meta?: Meta;\n  name?: Name;\n  nickName?: string;\n  preferredLanguage?: string;\n  profileUrl?: string;\n  roles?: StringMultiValuedValue;\n  timeZone?: string;\n  title?: string;\n  userName: string;\n  userType?: string;\n  website?: string;\n}\n")),(0,i.kt)("h3",{id:"goal"},"Goal"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"interface Goal {\n  goalId: string;\n  userId: string;\n  name: string;\n  target: number;\n  progress: number;\n  createdAt: string;\n  updatedAt?: string;\n  goalCompleted: boolean;\n  completedAt?: string;\n  goalDeleted: boolean;\n  deletedAt?: string;\n}\n")),(0,i.kt)("h2",{id:"entity-relationship-diagram"},"Entity Relationship Diagram"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Entity Relationship Diagram",src:r(237).Z,width:"1116",height:"793"})))}d.isMDXComponent=!0}}]);