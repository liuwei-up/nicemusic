import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式
import './assets/styles/global.stylus'
// 引入字体图标
import './assets/font/iconfont.css'
// 导入axios相关配置
import './plugins/axios.js'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

// 全局时间过滤器
Vue.filter('timeFormat', (times) => {
    let minutes = parseInt(times / 1000 / 60) + ''
    minutes = minutes.padStart(2, '0')
    let seconds = parseInt(times / 1000 % 60) + ''
    seconds = seconds.padStart(2, '0')
    return `${minutes} : ${seconds}`
})

Vue.filter('playCountFilter', (val) => {
	if (val >= 100000) {
		return `${parseInt(val / 10000)}万`
	} else {
		return val
	}
})

// 注册全局日期过滤器
Vue.filter('dateFormat', function (originVal) {
	const dt = new Date(originVal)
	const year = dt.getFullYear()
	const month = (dt.getMonth() + 1 + '').padStart(2, '0')
	const date = (dt.getDate() + '').padStart(2, '0')
	const hour = (dt.getHours() + '').padStart(2, '0')
	const minute = (dt.getMinutes() + '').padStart(2, '0')
	const seconds = (dt.getSeconds() + '').padStart(2, '0')

	return `${year}-${month}-${date} ${hour}:${minute}:${seconds}`
})
