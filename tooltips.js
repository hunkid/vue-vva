import './tipStyle.css'
var ToolTip = function () {}
/**
 * 提示层样式制造函数
 */
ToolTip.prototype.createTooltip = function ({
  padding = '8px',
  backgroundColor = '#e62163',
  color = '#fff',
  fontSize = '13px',
  fontFamily = 'Corbel, Lucida Grande, Lucida Sans Unicode, Lucida Sans, DejaVu Sans, Bitstream Vera Sans, Liberation Sans, Verdana, Verdana Ref, sans-serif;',
  title
}) {
  var tipWrap = document.createElement('div')
  var tipTxt = document.createElement('span')
  tipTxt.innerHTML = title
  tipWrap.style.padding = padding
  tipWrap.style.display = 'block'
  tipWrap.style.backgroundColor = backgroundColor
  tipWrap.style.fontSize = fontSize
  tipWrap.style.color = color
  tipWrap.style.fontFamily = fontFamily
  tipWrap.className = 'wtip-wrap'
  tipWrap.appendChild(tipTxt)
  return tipWrap
}
/**
 * @param {HTML DOM} 需要显示的DOM元素
 * @param {HTML DOM} 冒泡框
 */
ToolTip.prototype.showTooltip = function (dom, tipW) {
  if (dom && tipW) {
    document.body.appendChild(tipW)
    var domOffLeft = dom.offsetLeft
    var domOffTop = dom.offsetTop
    var domWidth = dom.offsetWidth
    var posLeft = domOffLeft + domWidth / 2 - tipW.offsetWidth / 2
    var posTop = domOffTop - tipW.offsetHeight - 7
    // console.log(domOffLeft, domOffTop, domWidth, tipW.offsetWidth, tipW.offsetHeight, posLeft, posTop)
    tipW.style.left = posLeft + 'px'
    tipW.style.top = posTop + 'px'
  }
}
/**
 * 删除对应的冒泡框
 * @param {HTML DOM} tipW
 */
ToolTip.prototype.destroyToolTip = function (tipW) {
  if (tipW) {
    tipW.parentNode.removeChild(tipW)
    tipW = null
  }
}
/**
 * 显示冒泡
 */
ToolTip.prototype.hideToolTip = function (tipW) {
  if (tipW) {
    tipW.style.display = 'none'
  }
}
/**
 * 隐藏冒泡
 */
ToolTip.prototype.showToolTip = function (tipW) {
  if (tipW) {
    tipW.style.display = 'block'
  }
}

export default ToolTip
