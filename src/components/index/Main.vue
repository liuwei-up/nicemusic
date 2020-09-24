<template>
<!-- 页面主体组件 -->
	<div class="main">
		<aside>
			<el-menu background-color="#dfdfdf" default-active="/discovery" :router="true" active-text-color="#F56C6C">
				<el-menu-item index="/discovery" v-waves>
					<i class="iconfont icon-yinle1"></i>
					<template v-slot:title>
						<span class="text">发现音乐</span>
					</template>
				</el-menu-item>
				<el-menu-item index="/playlists" v-waves>
					<i class="iconfont icon-gedan"></i>
					<template v-slot:title>
						<span class="text">推荐歌单</span>
					</template>
				</el-menu-item>
				<el-menu-item index="/songs" v-waves>
					<i class="iconfont icon-yinle"></i>
					<template v-slot:title>
						<span class="text">最新音乐</span>
					</template>
				</el-menu-item>
				<el-menu-item index="/mvs" v-waves>
					<i class="iconfont icon-MV"></i>
					<template v-slot:title>
						<span class="text">最新MV</span>
					</template>
				</el-menu-item>
			</el-menu>
		</aside>
		<div class="container">
			<div class="content">
				<!-- 给路由占位符添加过渡效果 -->
				<transition name="el-fade-in-linear">
					<router-view></router-view>
				</transition>
			</div>
		</div>
		<div class="player">
			<audio controls ref="audioRef" :src="musicUrl" autoplay :loop="false"></audio>
		</div>
	</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
	data () {
		return {
		}
	},
	methods: {
		...mapMutations(['saveAudioRef'])
	},
	computed: {
		...mapState(['musicUrl'])
	},
	mounted () {
		// 存储音频播放器的引用
		this.saveAudioRef(this.$refs.audioRef)
	}
}
</script>
<style lang="stylus" scoped>
.main
	display: flex
	height: 100%

	aside
		flex: 2
		background-color: #dfdfdf

	.el-menu-item span.text
		font-size: 16px

	.el-menu-item i.iconfont
		font-size: 20px
		margin: 0 15px 0 10px

	.container
		display: flex
		flex: 12
		width: 100%
		justify-content: center
		padding: 20px 9% 0
		box-sizing: border-box
		/* 元素内的内容会被修剪，但是浏览器会显示滚动条以便查看其余的内容 */
		overflow: scroll

		/* 隐藏滚动条 */
		&::-webkit-scrollbar
			display: none

		.content
			width: 100%

	.player
		background: #f1f3f4
		height: 50px
		position: fixed
		bottom: 0
		left: 0
		width: 100%

		audio
			width: 100%
			border-radius: none
			outline: none
</style>
