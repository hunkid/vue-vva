# vue-vva
vue表单验证插件vva
使用方法：
在main.js中引用vva.js，如
import vva from './vva'
Vue.use(vva)

##e.g：
使用方法：  
在html中填写：  
<input type="text" id="example" v-vva:egname="{length: /^.{5}$/, valid: /^\w+$/}" v-vva-msg="{length: '长度必须为五个字符', valid: '必须位有效字符'}">  
<input type="button" v-vva-check value="开始校验">  
并填写methods方法示例：  
methods: {  
  vvaSubmit: function() {  
    //用户自定义  
  }  
}  
其中v-vva指令{egname}为必填项，校验规则可单个或多个，单个时可以为正则表达式，多个时则必须为对象，每个属性值均必须为正则表达式；  
v-vva-msg为校验未通过后的提示符，属性名与v-vva对应。  
通过校验后，将调用vvaSubmit方法  
