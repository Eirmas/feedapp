import{d as N,D as w,A as $,b as D,c as a,a as t,n as x,C as y,o as e,F as c,B as g,e as S}from"./vue.esm-bundler-92d4549c.js";const L={class:"app-swatch-meta min-w-0"},q={class:"truncate"},E={class:"truncate"},k=N({__name:"Swatch",props:{color:{},large:{type:Boolean,default:!1}},setup(v){const p=v,i=w(null),n=w(""),h=r=>r.split("-").filter(s=>!!s).slice(1).map(s=>s[0].toUpperCase()+s.slice(1).toLowerCase()).join(" "),_=r=>{const u=r.match(/\d+/g);if(!u)return"#000000";const[s,o,l]=u.map(Number);return`#${(1<<24|s<<16|o<<8|l).toString(16).slice(1)}`};$(()=>{!n.value&&i.value&&(n.value=_(getComputedStyle(i.value).backgroundColor).toUpperCase())});const f=D(()=>({"app-swatch":!0,"app-swatch-large":p.large}));return(r,u)=>(e(),a("div",{class:x(f.value)},[t("div",{ref_key:"ink",ref:i,class:x([`${r.color}`,"app-swatch-ink",n.value==="#FFFFFF"?"ring-1 ring-neutral-light":""])},null,2),t("div",L,[t("div",q,y(h(r.color)),1),t("div",E,y(n.value??"#??????"),1)])],2))}});k.__docgenInfo={exportName:"default",displayName:"Swatch",description:"",tags:{},props:[{name:"color",required:!0,type:{name:"string"}},{name:"large",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/feedapp/feedapp/app/.storybook/stories/palette/Swatch.vue"]};const I={class:"grid grid-cols-3"},M={class:"ml-24"},T=t("hr",{class:"text-primary-lighter my-2 mt-4"},null,-1),U={class:"grid grid-cols-3"},V=t("hr",{class:"text-primary-lighter my-2 mt-4"},null,-1),j={class:"grid grid-cols-3"},P=N({__name:"Palette",setup(v){const p=["bg-primary","bg-secondary"],i=["bg-primary-lighter","bg-primary-light","bg-primary","bg-primary-dark"],n=["bg-secondary-lighter","bg-secondary-light","bg-secondary","bg-secondary-dark"],h=["bg-neutral-white","bg-neutral-background","bg-neutral-light","bg-neutral-medium","bg-neutral-dark"],_=["bg-semantic-success-light","bg-semantic-info-light","bg-semantic-warning-light","bg-semantic-error-light"],f=["bg-semantic-success-dark","bg-semantic-info-dark","bg-semantic-warning-dark","bg-semantic-error-dark"],r=["bg-semantic-focus","bg-semantic-link"];return(u,s)=>(e(),a(c,null,[t("div",I,[(e(),a(c,null,g(["Primary","Secondary","Semantic"],(o,l)=>t("div",{key:l,class:"flex flex-col"},[t("h3",M,y(o),1)])),64))]),T,t("div",U,[(e(!0),a(c,null,g([i,n,h],(o,l)=>(e(),a("div",{key:l,class:"flex flex-col"},[(e(!0),a(c,null,g(o,(d,b)=>(e(),S(k,{key:b,color:d,large:p.includes(d)},null,8,["color","large"]))),128))]))),128))]),V,t("div",j,[(e(!0),a(c,null,g([_,f,r],(o,l)=>(e(),a("div",{key:l,class:"flex flex-col"},[(e(!0),a(c,null,g(o,(d,b)=>(e(),S(k,{key:b,color:d,large:p.includes(d)},null,8,["color","large"]))),128))]))),128))])],64))}});P.__docgenInfo={exportName:"default",displayName:"Palette",description:"",tags:{},sourceFiles:["/home/runner/work/feedapp/feedapp/app/.storybook/stories/palette/Palette.vue"]};const A={title:"Style/Palette",component:P,tags:["autodocs"]},m={};var F,C,B;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:"{}",...(B=(C=m.parameters)==null?void 0:C.docs)==null?void 0:B.source}}};const H=["Default"];export{m as Default,H as __namedExportsOrder,A as default};
//# sourceMappingURL=Palette.stories-63df8a75.js.map
