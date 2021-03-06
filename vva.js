import ToolTip from './tooltips'
var tooltip = new ToolTip()
var vva = {},
  defaultCfg = {
    msgTip: '请输入正确值'
  }
/**
 * 定义观察者对象，用于观察待侦测的dom和提示冒泡tipWD之间的关联
 * @param {HTML DOM} dom
 * @param {HTML DOM} tipWD
 */
var Ob = (function () {
  var _linkList = {};
  return {
    /**
     * name必须唯一性!
     * @param {HTML DOM} dom
     * @param {HTML DOM} tooltip
     */
    link(dom, toolTip) {
      if (typeof _linkList[dom.name] === 'undefined') {
        _linkList[dom.name] = toolTip
      }
    },
    unlink(dom) {
      if (_linkList[dom.name]) {
        delete _linkList[dom.name]
      }
    },
    getToolTip(dom) {
      if (_linkList[dom.name]) {
        return _linkList[dom.name]
      } else {
        return null
      }
    }
  }
})()
/**
 * 判断是否符合指令
 * @param {object} option 规则方法，已定义trim、null
 * @param {HTML DOM} dom dom元素
 * @param {Vue Instance} vm Vue实例
 * @return {Array<string>} 返回未通过校验的type数组
 */
var check = function (option, dom, vm) {
  var name = dom.name,
    res = []
  if (option.trim) {
    _val = _val.trim()
  }
  if (option.null && _val === '') {
    return res
  }
  if (vm._customRule[name]) {
    for (var type in vm._customRule[name]) {
      if (Object.prototype.toString.call(vm._customRule[name][type]).toLowerCase() === '[object regexp]') {
        if (!vm._customRule[name][type].test(dom.value)) {
          res.push(type)
        }
      }
    }
  }
  return res
}

function hasClassName(dom, cls) {
  return new RegExp(`(\\s|^)${cls}(\\s|$)`).test(dom.className)
}

function addClassName(dom, cls) {
  if (!hasClassName(dom, cls)) {
    if (dom.className === '') {
      dom.className = cls
    } else {
      dom.className += ' ' + cls
    }
  }
}

function removeClassName(dom, cls) {
  if (hasClassName(dom, cls)) {
    dom.className = dom.className.replace(new RegExp(`(\\s|^)${cls}(\\s|$)`), '')
  }
}
/**
 * 返回对应name和type的提示信息
 * @param {string} name DOM name
 * @param {string} type 未通过校验的类型
 * @param {Vue instance} vm Vue实例
 * @return {string}
 */
function getTipMsg(name, type, vm) {
  if (vm._msgTip[name]) {
    if (typeof vm._msgTip[name] === 'string') {
      return vm._msgTip[name]
    } else if (typeof vm._msgTip === 'object') {
      return vm._msgTip[name][type] || defaultCfg.msgTip
    }
  }
  return defaultCfg.msgTip
}
/**
 * 处理表单验证的结果，不通过的增添错误类标识
 * @param {Array<string>} res 校验返回的出错type数组
 * @param {HTML DOM} dom 校验的dom对象
 */
function verifyCheck(res, dom) {
  if (res.length) {
    addClassName(dom, 'vva-check-err')
  } else {
    removeClassName(dom, 'vva-check-err')
  }
}
/**
 * 显示单个错误信息气泡
 * @param {vue instance} dom 验证错误表单元素
 */
function showErrMsg(vm) {
  clearToolTip()
  var dom = getNeedShowDom()
  if (dom) {
    if (!Ob.getToolTip(dom)) {
      var res = check(vm._option[dom.name], dom, vm),
        msg = getTipMsg(dom.name, res[0], vm),
        tipWD = tooltip.createTooltip({
          title: msg || defaultCfg.msgTip
        })
      tooltip.showTooltip(dom, tipWD)
      Ob.link(dom, tipWD)
    }
  }
}
/**
 * 得到需要展示的dom元素
 */
function getNeedShowDom() {
  return document.querySelector('.vva-check-err')
}
/**
 *清空冒泡
 */
function clearToolTip() {
  var domList = document.querySelectorAll('.vva-check-err')
  for (var i = 0, n = domList.length; i < n; i++) {
    if (Ob.getToolTip(domList[i])) {
      var tipWD = Ob.getToolTip(domList[i]) // 不能将this换dom
      tooltip.destroyToolTip(tipWD)
      Ob.unlink(domList[i])
    }
  }
}

vva.install = function (Vue) {
  /**
   * v-vva:necessary
   * @param arg:必填项
   * @param value:必填项
   */
  Vue.directive('vva', {
    bind(el, bingding, vnode) {
      // el.style.backgroundColor = 'red'
      var _usrRule = bingding.value, // 这地方需要判断_usrRule的种类，如果是对象，根据属性名增加规则，根据属性名提示相应提示字；如果是Reg，直接增加规则，但需要添加自定义属性名，提示字默认为“输入不正确”
          vm = vnode.context,
          name = bingding.arg === 'EXTEND' ? el.getAttribute('name') : bingding.arg
      if (Object.prototype.toString.call(_usrRule).toLowerCase() === '[object regexp]') {
        _usrRule = {
          __cusR: bingding.value
        } // 如果是用户只写了一个规则，对这个规则进行对象封装，属性名为__cusR
      }
      addClassName(el, `va${vm._uid}`)
      el.name = name
      vm._customRule = vm._customRule || {}
      vm._option = vm._option || {}
      vm._customRule[name] = _usrRule
      var _usrCfg = bingding.modifiers
      vm._option[name] = _usrCfg
    }
  })
  Vue.directive('vva-msg', {
    bind(el, bingding, vnode) {
      var _usrMsg = bingding.value
      var vm = vnode.context
      vm._msgTip = vm._msgTip || {}
      vm._msgTip[el.name] = _usrMsg
    }
  })
  Vue.directive('vva-check', {
    bind(el, bingding, vnode) {
      var vm = vnode.context
      el.addEventListener('click', function () {
        var toVaDomList = document.getElementsByClassName(`va${vm._uid}`)
        for (var i = 0; i < toVaDomList.length; i++) {
          var dom = toVaDomList[i]
          dom.addEventListener('focus', function (e) {
            var tipWD = Ob.getToolTip(this) // 不能将this换dom
            tooltip.destroyToolTip(tipWD)
            Ob.unlink(this)
            e.stopPropagation()
          })
          dom.addEventListener('blur', function (e) {
            var res = check(vm._option[this.name], this, vm)
            verifyCheck(res, this)
            if (!res.length) {
              var tipWD = Ob.getToolTip(this)
              tooltip.destroyToolTip(tipWD)
              Ob.unlink(this)
            }
            showErrMsg(vm)
            e.stopPropagation()
          })
          var val = dom.value,
              res = check(vm._option[dom.name], dom, vm)
          verifyCheck(res, dom)
        }
        var firstErrDom = getNeedShowDom()
        if (firstErrDom) {
          showErrMsg(vm)
        } else { //通过校验，进行方法测试
          vm.vva_submit && vm.vva_submit()
        }
      })
    }
  })
}
export default vva
