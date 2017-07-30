var time = require('./time')
import './css/style.css'
import './css/style.styl'

var ele = document.createElement('div')
$(ele).html(time.now() + '<br>' + time.random())
document.querySelector('#root').appendChild(ele)