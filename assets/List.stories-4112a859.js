import{a as oe}from"./chunk-AY7I2SME-5eb1ab46.js";import{d as _,c as v,o as d,G as y,b as c,a as B,r as h,n as $,h as O,C as j,D as K,q as R,e as g,w as q,T as ue,H as de,f as N,F as E,g as T,y as G,u as pe,m as C,I as re,J as ce,B as me,K as D,E as w}from"./vue.esm-bundler-92d4549c.js";import{_ as fe}from"./Card-e24097d7.js";import{a as ve}from"./index-3dcc0372.js";import{r as Ie}from"./UserGroupIcon-aa6ed994.js";const he={class:"app-list-divider","aria-orientation":"horizontal",role:"separator"},F=_({__name:"ListDivider",setup(l){return(n,t)=>(d(),v("hr",he))}});F.__docgenInfo={exportName:"default",displayName:"ListDivider",description:"",tags:{},sourceFiles:["/home/runner/work/feedapp/feedapp/app/src/components/molecules/list/components/list-divider/ListDivider.vue"]};const ye={class:"app-list-subheader-title"},P=_({__name:"ListSubheader",props:{title:{}},setup(l){const n=y("dense"),t=c(()=>({"app-list-subheader":!0,"app-list-subheader--dense":n==null?void 0:n.value}));return(u,i)=>(d(),v("div",{class:$(t.value)},[B("div",ye,[h(u.$slots,"default",{},()=>[O(j(u.title),1)])])],2))}});P.__docgenInfo={exportName:"default",displayName:"ListSubheader",description:"",tags:{},slots:[{name:"default"}],sourceFiles:["/home/runner/work/feedapp/feedapp/app/src/components/molecules/list/components/list-subheader/ListSubheader.vue"]};const le=_({__name:"CollapseTransition",props:{name:{default:"collapse"},dimension:{default:"height"},duration:{default:100},easing:{default:"ease-in-out"}},setup(l){const n=l,t=K(null);R(()=>n.dimension,()=>f());const u=c(()=>{const e=[];return Object.keys(t.value??{}).forEach(o=>{e.push(`${ie(o)} ${n.duration}ms ${n.easing}`)}),e.join(", ")}),i=(e,o)=>{m(e),Q(e),W(e),Y(e),s(e),U(e),setTimeout(o,n.duration)},r=e=>{Z(e),I(e),X(e),f()},p=(e,o)=>{m(e),U(e),W(e),Y(e),s(e),Q(e),setTimeout(o,n.duration)},L=e=>{Z(e),I(e),X(e),f()},m=e=>{if(t.value)return;const o=e.style.visibility,b=e.style.display;e.style.visibility="hidden",e.style.display="",t.value=a(e),e.style.visibility=o,e.style.display=b},f=()=>{t.value=null},a=e=>n.dimension==="height"?{height:e.offsetHeight+"px",paddingTop:e.style.paddingTop||S(e,"padding-top"),paddingBottom:e.style.paddingBottom||S(e,"padding-bottom")}:n.dimension==="width"?{width:e.offsetWidth+"px",paddingLeft:e.style.paddingLeft||S(e,"padding-left"),paddingRight:e.style.paddingRight||S(e,"padding-right")}:{},s=e=>{e.style.transition=u.value},I=e=>{e.style.transition=""},W=e=>{e.style.overflow="hidden"},Z=e=>{e.style.overflow=""},Q=e=>{Object.keys(t.value??{}).forEach(o=>{e.style[o]="0"})},U=e=>{const o=t.value;o&&Object.keys(o).forEach(b=>{const k=b,A=o[k];A&&(e.style[k]=A)})},X=e=>{Object.keys(t.value??{}).forEach(o=>{e.style[o]=""})},Y=e=>{getComputedStyle(e)[n.dimension]},S=(e,o)=>getComputedStyle(e,null).getPropertyValue(o),ie=e=>{let o=e;const b=o.match(/([A-Z])/g);if(!b)return o;for(let k=0,A=b.length;k<A;k++)o=o.replace(new RegExp(b[k]),"-"+b[k].toLowerCase());return o.slice(0,1)==="-"&&(o=o.slice(1)),o};return(e,o)=>(d(),g(ue,{name:e.name,onEnter:i,onAfterEnter:r,onLeave:p,onAfterLeave:L},{default:q(()=>[h(e.$slots,"default")]),_:3},8,["name"]))}});le.__docgenInfo={exportName:"default",displayName:"CollapseTransition",description:"",tags:{},props:[{name:"name",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'collapse'"}},{name:"dimension",required:!1,type:{name:"union",elements:[{name:'"height"'},{name:'"width"'}]},defaultValue:{func:!1,value:"'height'"}},{name:"duration",required:!1,type:{name:"number"},defaultValue:{func:!1,value:"100"}},{name:"easing",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'ease-in-out'"}}],slots:[{name:"default"}],sourceFiles:["/home/runner/work/feedapp/feedapp/app/src/components/molecules/list/components/list-group/CollapseTransition.vue"]};/*!
  * vue-router v4.2.2
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */var x;(function(l){l.pop="pop",l.push="push"})(x||(x={}));var ee;(function(l){l.back="back",l.forward="forward",l.unknown=""})(ee||(ee={}));var te;(function(l){l[l.aborted=4]="aborted",l[l.cancelled=8]="cancelled",l[l.duplicated=16]="duplicated"})(te||(te={}));const Le=Symbol("");function ge(){return y(Le)}const be={key:0,class:"app-list-item-prepend"},ke={class:"app-list-item-content"},_e={class:"app-list-item-content-title"},we={key:1,class:"app-list-item-append"},M=_({__name:"ListItem",props:{title:{},prependIcon:{},appendIcon:{},prependAvatar:{},appendAvatar:{},value:{},subtitle:{},click:{},dense:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},lines:{default:1},to:{},replace:{type:Boolean,default:!1},href:{},targetBlank:{type:Boolean},selected:{type:Boolean,default:void 0}},emits:["click"],setup(l,{emit:n}){const t=l,u=s=>{var I;n("click",s),!(t.disabled||t.href)&&(t.click&&((I=t.click)==null||I.call(t,s)),t.to&&ge()[t.replace?"replace":"push"](t.to),L())},i=y("selected"),r=y("update:selected"),p=c(()=>{var s;return t.selected??((s=i==null?void 0:i.value)==null?void 0:s.includes(t.value))}),L=()=>{t.value&&(r==null||r(t.value))},m=y("disabled"),f=y("dense"),a=c(()=>({"app-list-item":!0,"app-list-item--selected":p.value,"app-list-item--dense":(f==null?void 0:f.value)??t.dense,"app-list-item--disabled":(m==null?void 0:m.value)??t.disabled,"app-list-item--value":!!t.value||!!t.click||!!t.href||!!t.to}));return(s,I)=>(d(),g(N(s.href?"a":"li"),{class:$(a.value),href:s.href,target:s.targetBlank?"_blank":void 0,tabindex:s.href||s.value||s.click?0:-1,"aria-selected":p.value,onClick:u,onKeyup:de(u,["enter"])},{default:q(()=>[s.prependAvatar||s.prependIcon||s.$slots.prepend?(d(),v("div",be,[h(s.$slots,"prepend",{},()=>[s.prependAvatar?(d(),v(E,{key:0},[],64)):(d(),g(N(s.prependIcon),{key:1}))])])):T("",!0),B("div",ke,[h(s.$slots,"default",{},()=>[B("div",_e,[h(s.$slots,"title",{title:s.title},()=>[O(j(s.title),1)])]),s.subtitle?(d(),v("div",{key:0,class:$(["app-list-item-content-subtitle",`line-clamp-${t.lines}`])},[h(s.$slots,"default",{subtitle:s.subtitle},()=>[O(j(s.subtitle),1)])],2)):T("",!0)])]),s.appendAvatar||s.appendIcon||s.$slots.append?(d(),v("div",we,[h(s.$slots,"append",{},()=>[s.appendAvatar?(d(),v(E,{key:0},[],64)):(d(),g(N(s.appendIcon),{key:1}))])])):T("",!0)]),_:3},40,["class","href","target","tabindex","aria-selected","onKeyup"]))}});M.__docgenInfo={exportName:"default",displayName:"ListItem",description:"",tags:{},props:[{name:"dense",defaultValue:{func:!1,value:"false"}},{name:"disabled",defaultValue:{func:!1,value:"false"}},{name:"lines",defaultValue:{func:!1,value:"1"}},{name:"replace",defaultValue:{func:!1,value:"false"}},{name:"selected",defaultValue:{func:!1,value:"undefined"}}],events:[{name:"click",type:{names:["union"],elements:[{name:"MouseEvent"},{name:"KeyboardEvent"}]}}],slots:[{name:"prepend"},{name:"default",scoped:!0,bindings:[{name:"subtitle",title:"binding"}]},{name:"title",scoped:!0,bindings:[{name:"title",title:"binding"}]},{name:"append"}],sourceFiles:["/home/runner/work/feedapp/feedapp/app/src/components/molecules/list/components/list-item/ListItem.vue"]};function $e(l,n){return d(),v("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[B("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M19.5 8.25l-7.5 7.5-7.5-7.5"})])}const Ge={class:"app-list-group-items",role:"group"},z=_({__name:"ListGroup",props:{value:{},title:{},prependIcon:{},appendAvatar:{},dense:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},items:{default:()=>[]},open:{type:Boolean,default:void 0}},setup(l){const n=l,t=y("opened"),u=y("update:opened"),i=c(()=>{var a;return n.open??((a=t==null?void 0:t.value)==null?void 0:a.includes(n.value))}),r=y("disabled"),p=y("dense"),L=()=>{u==null||u(n.value)},m=c(()=>({"app-list-group":!0,"app-list-group--dense":(p==null?void 0:p.value)??n.dense,"app-list-group--disabled":(r==null?void 0:r.value)??n.disabled})),f=c(()=>({"rotate-180":i.value,"transition-transform duration-100":!0}));return(a,s)=>(d(),v("div",{class:$(m.value)},[h(a.$slots,"activator",{open:i.value},()=>[G(M,C(n,{click:L,value:void 0}),{append:q(()=>[G(pe($e),{class:$(f.value)},null,8,["class"])]),_:1},16)]),G(le,null,{default:q(()=>[re(B("div",Ge,[h(a.$slots,"default",{},()=>[G(H,{items:a.items},null,8,["items"])])],512),[[ce,i.value]])]),_:3})],2))}});z.__docgenInfo={exportName:"default",displayName:"ListGroup",description:"",tags:{},props:[{name:"dense",defaultValue:{func:!1,value:"false"}},{name:"disabled",defaultValue:{func:!1,value:"false"}},{name:"open",defaultValue:{func:!1,value:"undefined"}},{name:"items",defaultValue:{func:!1,value:"() => []"}}],slots:[{name:"activator",scoped:!0,bindings:[{name:"open",title:"binding"}]},{name:"default"}],sourceFiles:["/home/runner/work/feedapp/feedapp/app/src/components/molecules/list/components/list-group/ListGroup.vue"]};const H=_({__name:"ListTemplateBuilder",props:{items:{}},setup(l){const n=i=>"type"in i&&i.type==="divider",t=i=>"type"in i&&i.type==="subheader",u=i=>"items"in i;return(i,r)=>(d(!0),v(E,null,me(i.items,(p,L)=>(d(),v(E,{key:L},[n(p)?(d(),g(F,D(C({key:0},p)),null,16)):t(p)?(d(),g(P,D(C({key:1},p)),null,16)):u(p)?(d(),g(z,D(C({key:2},p)),null,16)):(d(),g(M,D(C({key:3},p)),null,16))],64))),128))}});H.__docgenInfo={exportName:"default",displayName:"ListTemplateBuilder",description:"",tags:{},props:[{name:"items",required:!0,type:{name:"IListItems"}}],sourceFiles:["/home/runner/work/feedapp/feedapp/app/src/components/molecules/list/template/ListTemplateBuilder.vue"]};const J=_({__name:"List",props:{dense:{type:Boolean},disabled:{type:Boolean},tag:{default:"ul"},items:{default:()=>[]},selected:{default:()=>[]},opened:{default:()=>[]},multiple:{type:Boolean,default:!1},nav:{type:Boolean,default:!1}},emits:["update:selected","update:opened","click:open","click:select"],setup(l,{emit:n}){const t=l,u=K(t.opened),i=K(t.selected),r=a=>{const s=i.value.includes(a);t.multiple?m(s?i.value.filter(I=>I!==a):[...i.value,a]):m(s?[]:[a]),n("click:select",{value:a,selected:!s})},p=a=>{const s=u.value.includes(a);L(s?u.value.filter(I=>I!==a):[...u.value,a]),n("click:open",{value:a,open:!s})};w("disabled",c(()=>t.disabled)),w("dense",c(()=>t.dense)),w("selected",c(()=>i.value)),w("opened",c(()=>u.value)),w("update:selected",r),w("update:opened",p);const L=a=>{u.value=a,n("update:opened",a)},m=a=>{i.value=a,n("update:selected",a)};R(()=>t.selected,a=>{i.value=a}),R(()=>t.opened,a=>{u.value=a});const f=c(()=>({"app-list":!0,"app-list--dense":t.dense,"app-list--disabled":t.disabled,"app-list--nav":t.nav}));return(a,s)=>(d(),g(N(t.tag),{class:$(f.value)},{default:q(()=>[h(a.$slots,"default",{},()=>[G(H,{items:a.items},null,8,["items"])])]),_:3},8,["class"]))}});J.__docgenInfo={exportName:"default",displayName:"List",description:"",tags:{},props:[{name:"dense",required:!1,type:{name:"boolean"}},{name:"disabled",required:!1,type:{name:"boolean"}},{name:"tag",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'ul'"}},{name:"items",required:!1,type:{name:"IListItems"},defaultValue:{func:!1,value:"() => []"}},{name:"selected",required:!1,type:{name:"Array",elements:[{name:"unknown"}]},defaultValue:{func:!1,value:"() => []"}},{name:"opened",required:!1,type:{name:"Array",elements:[{name:"unknown"}]},defaultValue:{func:!1,value:"() => []"}},{name:"multiple",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"nav",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],events:[{name:"update:selected",type:{names:["Array"],elements:[{name:"unknown"}]}},{name:"update:opened",type:{names:["Array"],elements:[{name:"unknown"}]}},{name:"click:open",type:{names:["{ value: unknown; open: boolean }"]}},{name:"click:select",type:{names:["{ value: unknown; selected: boolean }"]}}],slots:[{name:"default"}],sourceFiles:["/home/runner/work/feedapp/feedapp/app/src/components/molecules/list/List.vue"]};const De={title:"Molecules/List",component:J,tags:["autodocs"]},Ce=l=>({components:{List:J,ListItem:M,ListGroup:z,ListDivider:F,ListSubheader:P,Card:fe},setup(){return{args:l,Icon:Ie}},template:ve`<Card dense>
    <List
      v-bind="args"
      @update:selected="updateModel($event, 'update:selected')"
      @update:opened="updateModel($event, 'update:opened')"
      @click:open="updateModel($event, 'click:open')"
      @click:select="updateModel($event, 'click:select')"
    >
      <ListSubheader title="Group 1" />
      <ListItem title="Item 1" :prependIcon="Icon" value="1" />
      <ListItem title="Item 2" :prependIcon="Icon" />
      <ListItem title="Item 3" active :prependIcon="Icon" :appendIcon="Icon" />
      <ListDivider />
      <ListItem value="4" title="Item 4" :appendIcon="Icon" description="Lorem ipsum " />
      <ListItem value="5" title="Item 5" />
      <ListItem value="6" title="Item 6 - href" href="#" />
      <ListItem
        value="7"
        title="Item 7"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nis nisi vitae nisl."
      />
      <ListDivider />
      <ListGroup value="Group 1" :prependIcon="Icon" title="Group">
        <ListItem value="8" title="Item 8" :appendIcon="Icon" description="Lorem ipsum " />
        <ListItem value="9" title="Item 9 - Active" active />
        <ListItem value="10" title="Item 10 - href" href="#" />
        <ListGroup value="Group 2" :prependIcon="Icon" title="Group">
          <ListItem value="11" title="Item 11" :appendIcon="Icon" description="Lorem ipsum " />
          <ListItem value="12" title="Item 12" />
          <ListItem value="13" title="Item 13 - href" href="#" />
        </ListGroup>
      </ListGroup>
      <ListSubheader title="Group 1" />
    </List>
  </Card>`,methods:{updateModel(n,t){oe(t)(n)}}}),V=Ce.bind({});V.args={nav:!0};var se,ae,ne;V.parameters={...V.parameters,docs:{...(se=V.parameters)==null?void 0:se.docs,source:{originalSource:`args => ({
  components: {
    List,
    ListItem,
    ListGroup,
    ListDivider,
    ListSubheader,
    Card
  },
  setup() {
    return {
      args,
      Icon
    };
  },
  template: html\`<Card dense>
    <List
      v-bind="args"
      @update:selected="updateModel($event, 'update:selected')"
      @update:opened="updateModel($event, 'update:opened')"
      @click:open="updateModel($event, 'click:open')"
      @click:select="updateModel($event, 'click:select')"
    >
      <ListSubheader title="Group 1" />
      <ListItem title="Item 1" :prependIcon="Icon" value="1" />
      <ListItem title="Item 2" :prependIcon="Icon" />
      <ListItem title="Item 3" active :prependIcon="Icon" :appendIcon="Icon" />
      <ListDivider />
      <ListItem value="4" title="Item 4" :appendIcon="Icon" description="Lorem ipsum " />
      <ListItem value="5" title="Item 5" />
      <ListItem value="6" title="Item 6 - href" href="#" />
      <ListItem
        value="7"
        title="Item 7"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nis nisi vitae nisl."
      />
      <ListDivider />
      <ListGroup value="Group 1" :prependIcon="Icon" title="Group">
        <ListItem value="8" title="Item 8" :appendIcon="Icon" description="Lorem ipsum " />
        <ListItem value="9" title="Item 9 - Active" active />
        <ListItem value="10" title="Item 10 - href" href="#" />
        <ListGroup value="Group 2" :prependIcon="Icon" title="Group">
          <ListItem value="11" title="Item 11" :appendIcon="Icon" description="Lorem ipsum " />
          <ListItem value="12" title="Item 12" />
          <ListItem value="13" title="Item 13 - href" href="#" />
        </ListGroup>
      </ListGroup>
      <ListSubheader title="Group 1" />
    </List>
  </Card>\`,
  methods: {
    updateModel(modelValue: number, event: string) {
      action(event)(modelValue);
    }
  }
})`,...(ne=(ae=V.parameters)==null?void 0:ae.docs)==null?void 0:ne.source}}};const Ne=["Default"];export{V as Default,Ne as __namedExportsOrder,De as default};
//# sourceMappingURL=List.stories-4112a859.js.map
