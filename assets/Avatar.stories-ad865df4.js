import{d as m,b as i,c as l,y as u,n as d,o as v}from"./vue.esm-bundler-92d4549c.js";import{_ as f}from"./Image-f3cc826c.js";const n=m({__name:"Avatar",props:{src:{},state:{},size:{default:"medium"},name:{}},setup(p){const e=p,c=i(()=>({"app-avatar":!0,"app-avatar-stateful":!!e.state,[`app-avatar-${e.size}`]:!0,[`app-avatar-${e.state}`]:!!e.state}));return(t,g)=>(v(),l("div",{class:d(c.value)},[u(f,{src:t.src,alt:t.name&&`Avatar for ${t.name}`,cover:""},null,8,["src","alt"])],2))}});n.__docgenInfo={exportName:"default",displayName:"Avatar",description:"",tags:{},props:[{name:"src",required:!0,type:{name:"string"}},{name:"state",required:!1,type:{name:"IAvatarStates"}},{name:"size",required:!1,type:{name:"IAvatarSizes"},defaultValue:{func:!1,value:"'medium'"}},{name:"name",required:!1,type:{name:"string"}}],sourceFiles:["/home/runner/work/feedapp/feedapp/app/src/components/atoms/avatar/Avatar.vue"]};const y={title:"Atoms/Avatar",component:n,tags:["autodocs"],argTypes:{size:{control:{type:"select"},options:["small","medium","large"]},state:{control:{type:"select"},options:[void 0,"offline","online","idle"]}}},a={args:{src:"https://avatars.githubusercontent.com/u/38263092?v=4",name:"Eirik Måseidvåg"}};var s,r,o;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    src: 'https://avatars.githubusercontent.com/u/38263092?v=4',
    name: 'Eirik Måseidvåg'
  }
}`,...(o=(r=a.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};const h=["Default"];export{a as Default,h as __namedExportsOrder,y as default};
//# sourceMappingURL=Avatar.stories-ad865df4.js.map
