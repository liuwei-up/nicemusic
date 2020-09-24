import Vue from 'vue'
import VueRouter from 'vue-router'

const Index = () => import(/* webpackChunkName: "index-discovery" */ '../components/index/Index.vue')
const Discovery = () => import(/* webpackChunkName: "index-discovery" */ '../views/Discovery.vue')
const PlayLists = () => import(/* playlists-mvs */ '../views/PlayLists.vue')
const Mvs = () => import(/* playlists-mvs */ '../views/Mvs.vue')
const Songs = () => import(/* songs */ '../views/Songs.vue')
const Result = () => import(/* result-PlayList-mv */ '../views/Result.vue')
const PlayList = () => import(/* result-PlayList-mv */ '../views/PlayList.vue')
const Mv = () => import(/* result-PlayList-mv */ '../views/Mv.vue')

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		redirect: '/discovery',
		component: Index,
		children: [
			{
				path: '/discovery',
				component: Discovery
			},
			{
				path: '/playlists',
				component: PlayLists
			},
			{
				path: '/songs',
				component: Songs
			},
			{
				path: '/mvs',
				component: Mvs
			},
			{
				path: '/result/:search',
				component: Result,
				name: 'searchResult',
				props: true // 开启路由传参
			},
			{
				path: '/playlist/:id',
				component: PlayList,
				name: 'playlistDetail',
				props: true // 开启路由传参
			},
			{
				path: '/mv/:id',
				component: Mv,
				name: 'MvDetail',
				props: true // 开启路由传参
			}
		]
	}
]

const router = new VueRouter({
	routes,
	scrollBehavior (to, from, savedPosition) {
		// return 期望滚动到哪个的位置
		return { x: 0, y: 0 }
	}
})

export default router
