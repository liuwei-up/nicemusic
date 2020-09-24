import Vue from 'vue'
import {
	Button,
    Input,
    Menu,
    MenuItem,
    Carousel,
    CarouselItem,
    Message,
    Pagination,
    Table,
    TableColumn,
	Image,
	Tabs,
	TabPane,
	Notification,
	Tooltip,
	Dialog
} from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Image)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tooltip)
Vue.use(Dialog)

Vue.prototype.$message = (type, message) => {
    Message({
		type,
		message,
		showClose: true
    })
}

Vue.prototype.$notify = Notification
