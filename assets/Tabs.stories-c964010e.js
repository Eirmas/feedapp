import{a as h}from"./chunk-AY7I2SME-5eb1ab46.js";import{d as g,E as r,b as u,c as k,r as z,o as v,G as d,e as I,w as M,n as C,u as c}from"./vue.esm-bundler-92d4549c.js";import{_ as O}from"./Button-8e5a9555.js";import{a as x}from"./index-3dcc0372.js";const q={class:"ring-1 ring-inset rounded-full inline-flex p-1 ring-neutral-light bg-neutral-white gap-x-1 md:gap-x-2",role:"tablist"},p=g({__name:"Tabs",props:{modelValue:{},disabled:{type:Boolean,default:!1},size:{default:"medium"}},emits:["update:modelValue"],setup(a,{emit:s}){const e=a;return r("onClick",n=>s("update:modelValue",n)),r("size",e.size),r("disabled",u(()=>e.disabled)),r("modelValue",u(()=>e.modelValue)),(n,l)=>(v(),k("div",q,[z(n.$slots,"default")]))}});p.__docgenInfo={exportName:"default",displayName:"Tabs",description:"",tags:{},props:[{name:"modelValue",required:!0,type:{name:"T"}},{name:"disabled",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"size",required:!1,type:{name:"ITabSizes"},defaultValue:{func:!1,value:"'medium'"}}],events:[{name:"update:modelValue",type:{names:["T"]}}],slots:[{name:"default"}],sourceFiles:["/home/runner/work/feedapp/feedapp/app/src/components/molecules/tabs/Tabs.vue"]};var y=(a=>(a.SMALL="small",a.MEDIUM="medium",a))(y||{});const _=g({__name:"Tab",props:{value:{},disabled:{type:Boolean},icon:{},prependIcon:{type:Boolean}},setup(a){const s=a,e=d("onClick"),m=d("size",y.MEDIUM),n=d("disabled"),l=d("modelValue"),i=u(()=>(l==null?void 0:l.value)==s.value),V=()=>e==null?void 0:e(s.value);return(o,w)=>(v(),I(O,{tabindex:i.value?-1:0,class:C({"font-semibold":!0,"!bg-primary-lighter !text-primary":i.value}),"aria-selected":i.value,disabled:c(n)??o.disabled,icon:o.icon,prependIcon:o.prependIcon,size:c(m),role:"tab",theme:"tertiary",onClick:V},{default:M(()=>[z(o.$slots,"default")]),_:3},8,["tabindex","class","aria-selected","disabled","icon","prependIcon","size"]))}});_.__docgenInfo={exportName:"default",displayName:"Tab",description:"",tags:{},props:[{name:"value",required:!0,type:{name:"T"}},{name:"disabled",required:!1,type:{name:"boolean"}},{name:"icon",required:!1,type:{name:"FunctionalComponent"}},{name:"prependIcon",required:!1,type:{name:"boolean"}}],slots:[{name:"default"}],sourceFiles:["/home/runner/work/feedapp/feedapp/app/src/components/molecules/tabs/Tab.vue"]};const A={title:"Molecules/Tabs",component:p,tags:["autodocs"],argTypes:{size:{control:{type:"select"},options:["small","medium"]}}},B=(a,{updateArgs:s})=>({components:{Tabs:p,Tab:_},setup(){return{args:a}},template:x`
    <Tabs v-bind="args" @update:modelValue="updateModel">
      <Tab value="1" :size="args.size">Option 1</Tab>
      <Tab value="2" :size="args.size">Option 2</Tab>
      <Tab value="3" :size="args.size">Option 3</Tab>
      <Tab value="4" :size="args.size" disabled>Option 4</Tab>
    </Tabs>
  `,methods:{updateModel(e){h("update:modelValue")(e),s({modelValue:e})}}}),t=B.bind({});t.args={modelValue:1,size:"medium"};var b,f,T;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`(args, {
  updateArgs
}) => ({
  components: {
    Tabs,
    Tab
  },
  setup() {
    return {
      args
    };
  },
  template: html\`
    <Tabs v-bind="args" @update:modelValue="updateModel">
      <Tab value="1" :size="args.size">Option 1</Tab>
      <Tab value="2" :size="args.size">Option 2</Tab>
      <Tab value="3" :size="args.size">Option 3</Tab>
      <Tab value="4" :size="args.size" disabled>Option 4</Tab>
    </Tabs>
  \`,
  methods: {
    updateModel(modelValue: number) {
      action('update:modelValue')(modelValue);
      updateArgs({
        modelValue
      });
    }
  }
})`,...(T=(f=t.parameters)==null?void 0:f.docs)==null?void 0:T.source}}};const F=["Default"];export{t as Default,F as __namedExportsOrder,A as default};
//# sourceMappingURL=Tabs.stories-c964010e.js.map
