<template>
<!-- 发现音乐页面 -->
	<div class="discovery-container">
		<el-carousel :interval="4000" type="card" height="230px">
			<!-- 循环获取到的接口数据 -->
			<el-carousel-item v-for="(item, index) in banners" :key="index">
				<el-image :src="item.imageUrl" :alt="item.typeTitle">
					<template v-slot:load>
						<i class="el-icon-loading"></i>
						<strong>图片正在加载中</strong>
					</template>
					<template v-slot:error>
						<i class="el-icon-picture-outline"></i>
						<strong>加载失败</strong>
					</template>
				</el-image>
			</el-carousel-item>
		</el-carousel>

		<!-- 推荐歌单 -->
		<div class="recommend">
			<h3 class="title">
				推荐歌单
			</h3>
			<div class="items">
				<div class="item" :key="index" v-for="(item, index) in list" @click="toPlayList(item.id)">
					<div class="img-wrap">
						<div class="desc-wrap">
							<span class="desc">{{ item.copywriter }}</span>
						</div>
						<el-image :src="item.picUrl" fit="cover">
							<template v-slot:load>
								<i class="el-icon-loading"></i>
								<strong>图片正在加载中</strong>
							</template>
							<template v-slot:error>
								<i class="el-icon-picture-outline"></i>
								<strong>加载失败</strong>
							</template>
						</el-image>
						<i class="iconfont icon-icon_Play"></i>
					</div>
					<p class="name">{{ item.name }}</p>
				</div>
			</div>
		</div>

		<!-- 最新音乐 -->
		<div class="news">
			<h3 class="title">
				最新音乐
			</h3>
			<div class="items">
				<div class="item" v-for="(item) in songs" :key="item.id" v-waves>
					<div class="img-wrap">
						<!-- 歌曲封面 -->
						<el-image fit="cover" lazy :src="item.picUrl" :alt="item.name">
							<template v-slot:load>
								<i class="el-icon-loading"></i>
								<strong>图片正在加载中</strong>
							</template>
							<template v-slot:error>
								<i class="el-icon-picture-outline"></i>
								<strong>加载失败</strong>
							</template>
						</el-image>
						<span @click="playMusic(item.song.id)" class="iconfont icon-icon_Play"></span>
					</div>
					<div class="song-wrap">
						<!-- 歌名 -->
						<div class="song-name">{{ item.name }}</div>
						<!-- 歌手名 -->
						<div class="singer">{{ item.song.artists[0].name }}</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 推荐MV -->
		<div class="mvs">
			<h3 class="title">推荐MV</h3>
			<div class="items">
				<div class="item" v-for="item in mvs" :key="item.id">
					<div class="img-wrap" @click="toMv(item.id)">
						<el-image lazy :src="item.picUrl" :alt="item.name">
							<template v-slot:load>
								<i class="el-icon-loading"></i>
								<strong>图片正在加载中</strong>
							</template>
							<template v-slot:error>
								<i class="el-icon-picture-outline"></i>
								<strong>加载失败</strong>
							</template>
						</el-image>
						<span class="iconfont icon-icon_Play"></span>
						<div class="num-wrap">
							<div class="el-icon-caret-right num-icon"></div>
							<!-- 播放次数 -->
							<div class="num">{{ item.playCount }}</div>
						</div>
					</div>
					<div class="info-wrap">
						<!-- mv名 -->
						<div class="name">{{ item.name }}</div>
						<!-- 歌手名 -->
						<div class="singer">{{ item.artistName }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
	data () {
		return {
		}
	},
	methods: {
		...mapActions(['getMucicUrlByIdAsync']),
		...mapActions('discovery', ['getBannersAsync', 'getRecommendAsync', 'getNewSongsAsync', 'getRecommendMvsAsync']),
		playMusic (id) {
			const params = {
				V: this,
				id
			}
			// 播放音乐
			this.getMucicUrlByIdAsync(params)
		},
		toPlayList (id) { // 前往歌单详情页
			this.$router.push({
				name: 'playlistDetail',
				params: {
					id
				}
			})
		},
		toMv (id) {
			// 前往mv播放页面
			this.$router.push({
				name: 'MvDetail',
				params: {
					id
				}
			})
		}
	},
	computed: {
		...mapState('discovery', ['banners', 'list', 'songs', 'mvs'])
	},
	created () {
		// 生命周期函数中请求数据
		// 请求轮播图数据
		this.getBannersAsync(this)
		// 请求推荐歌单数据
		this.getRecommendAsync(this)
		// 请求最新音乐数据
		this.getNewSongsAsync(this)
		// 请求推荐MV数据
		this.getRecommendMvsAsync(this)
	}
}
</script>
<style lang="stylus" scoped>
@import '~styles/theme.stylus'
@import '~styles/mixins.stylus'

h3.title
	font-weight: 500
	height: 50px
	line-height: 50px

p.name
	/* 1.强制一行内显示文本 */
	white-space: nowrap /* 意思是如果文字显示不开也必须强制一行内显示 */
	/* 2.超出的部分隐藏 */
	overflow: hidden
	/* 3.文字用省略号替代超出的部分 */
	text-overflow: ellipsis

// 推荐歌单
.recommend .items
	display: flex
	width: 100%
	flex-wrap: wrap
	justify-content: space-between
	margin-bottom: 80px

	.item
		width: 19%
		overflow: hidden

		&:hover .img-wrap .desc-wrap
			top: 0px
			z-index: 1

		&:nth-child(n+6)
			margin-top: 25px

		.img-wrap
			position: relative
			width: 100%
			PlayListIcon()

			.el-image
				ElImage(100%)

			.desc-wrap
				position: absolute
				width: 100%
				top: -50px
				left: 0
				font-size: 16px
				transition: all 0.5s
				color: white
				background: rgba(0, 0, 0, 0.5)
				max-height: 50px
				padding: 5px
				box-sizing: border-box
				overflow: hidden
				text-overflow: ellipsis
				display: -webkit-box
				-webkit-box-orient: vertical
				-webkit-line-clamp: 2

				span
					font-size: 14px

// 最新音乐
.news .items
	display: flex
	flex-wrap: wrap
	margin-bottom: 80px

	.item
		display: flex
		justify-content: space-between
		align-items: center
		width: 50%
		height: 100px
		padding-left: 15px
		box-sizing: border-box

		&:hover
			background-color: #f5f5f5

		.img-wrap
			display: flex
			align-items: center
			justify-content: center
			width: 80px !important
			cursor: pointer
			MvPlayIcon(35px, 20px)

			.el-image
				ElImage(80px)

		.song-wrap
			flex: 1
			display: flex
			flex-direction: column
			justify-content: space-around
			padding: 10px
			height: 100%
			font-size: 16px
			box-sizing: border-box

			.song-name
				color: #333
				font-weight: 500
				font-size: 15px

			.singer
				font-size: 14px
				color: gray

// 推荐mv
.mvs
	.items
		display: flex
		justify-content: space-between
		margin-bottom: 150px

		.item
			width: 23%
			cursor: pointer

			.img-wrap
				MvPlayIcon()

				.el-image
					ElImage(100%)

				.num-wrap
					position: absolute
					color: white
					top: 0
					right: 0
					display: flex
					align-content: center
					font-size: 16px
					padding-right: 5px
					padding-top: 2px

					.num-icon
						font-size: 20px
						display: flex
						align-items: center
						margin-right: 5px

			.info-wrap
				.name
					font-size: 15px
					margin-bottom: 5px

				.singer
					font-size: 14px
					color: #c5c5c5
</style>
