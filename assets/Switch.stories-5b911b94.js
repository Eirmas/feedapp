import{d as f,D as b,q as u,b as w,c as V,a as i,C as g,n as v,o as _}from"./vue.esm-bundler-92d4549c.js";import{a as y}from"./chunk-AY7I2SME-5eb1ab46.js";import{a as S}from"./index-3dcc0372.js";const M=["aria-checked","disabled"],k={class:"sr-only"},D=i("span",{"aria-hidden":"true",class:"app-switch-handle"},null,-1),n=f({__name:"Switch",props:{modelValue:{type:Boolean},label:{default:"Use switch"},disabled:{type:Boolean},size:{default:"small"}},emits:["update:modelValue"],setup(e,{emit:o}){const a=e,t=b(a.modelValue??!1);u(()=>a.modelValue,s=>t.value=s),u(t,s=>o("update:modelValue",s));const m=()=>{a.disabled||(t.value=!t.value,o("update:modelValue",!t.value))},h=w(()=>({"app-switch":!0,["app-switch-disabled"]:a.disabled,[`app-switch-${a.size}`]:!0}));return(s,z)=>(_(),V("button",{"aria-checked":t.value,disabled:s.disabled,class:v(h.value),role:"switch",type:"button",onClick:m},[i("span",k,g(s.label),1),D],10,M))}});n.__docgenInfo={exportName:"default",displayName:"Switch",description:"",tags:{},props:[{name:"modelValue",required:!1,type:{name:"boolean"}},{name:"label",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'Use switch'"}},{name:"disabled",required:!1,type:{name:"boolean"}},{name:"size",required:!1,type:{name:"ISwitchSizes"},defaultValue:{func:!1,value:"'small'"}}],events:[{name:"update:modelValue",type:{names:["boolean"]}}],sourceFiles:["/home/runner/work/feedapp/feedapp/app/src/components/atoms/switch/Switch.vue"]};var d=(e=>(e.SMALL="small",e.MEDIUM="medium",e.LARGE="large",e))(d||{});const C={title:"Atoms/Switch",component:n,tags:["autodocs"],argTypes:{size:{control:{type:"select"},options:Object.values(d)}}},q=(e,{updateArgs:o})=>({components:{Switch:n},setup(){return{args:e}},template:S` <Switch v-bind="args" @update:modelValue="updateModel"></Switch> `,methods:{updateModel(a){y("update:modelValue")(a),o({modelValue:a})}}}),l=q.bind({});l.args={modelValue:!1,size:d.MEDIUM};var r,p,c;l.parameters={...l.parameters,docs:{...(r=l.parameters)==null?void 0:r.docs,source:{originalSource:`(args, {
  updateArgs
}) => ({
  components: {
    Switch
  },
  setup() {
    return {
      args
    };
  },
  template: html\` <Switch v-bind="args" @update:modelValue="updateModel"></Switch> \`,
  methods: {
    updateModel(modelValue: number) {
      action('update:modelValue')(modelValue);
      updateArgs({
        modelValue
      });
    }
  }
})`,...(c=(p=l.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};const I=["Default"];export{l as Default,I as __namedExportsOrder,C as default};
//# sourceMappingURL=Switch.stories-5b911b94.js.map
