
const baseSize = 37.5 // 注意此值要与 postcss.config.js 文件中的 rootValue保持一致
function setRem () {
    let scaleValue= document.documentElement.clientWidth <= 750  ?  375 :  document.documentElement.clientWidth;
    const scale = document.documentElement.clientWidth / scaleValue
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}
setRem()
window.onresize = function () {
    console.log("我执行了")
    setRem()
}