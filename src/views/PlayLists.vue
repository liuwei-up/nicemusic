<template>
<!-- 推荐歌单页面 -->
	<div v-cloak class="playlists-container">
		<!-- 头部 -->
		<div class="top-card">
			<div class="icon-wrap" @click="toPlayList(topList.id)">
				<!-- 封面 -->
				<img :src="topList.coverImgUrl" alt="topList.name" />
				<span class="iconfont icon-icon_Play"></span>
			</div>
			<div class="content-wrap">
				<div class="tag">精品歌单</div>
				<!-- 标题 -->
				<div class="title">{{ topList.name }}</div>
				<!-- 介绍信息 -->
				<div class="info">{{ topList.description }}</div>
			</div>
			<!-- 背景 -->
			<img :src="topList.coverImgUrl" alt="" class="bg" />
			<!-- 遮罩层 -->
			<div class="bg-mask"></div>
		</div>
		<!-- tab栏 -->
		<div class="tab-container">
			<!-- tab栏 顶部 -->
			<div class="tab-bar">
				<span class="item" @click="changeTag('全部')" :class="{active:tag === '全部'}">全部</span>
				<span class="item" @click="changeTag('欧美')" :class="{active:tag === '欧美'}">欧美</span>
				<span class="item" @click="changeTag('华语')" :class="{active:tag === '华语'}">华语</span>
				<span class="item" @click="changeTag('流行')" :class="{active:tag === '流行'}">流行</span>
				<span class="item" @click="changeTag('说唱')" :class="{active:tag === '说唱'}">说唱</span>
				<span class="item" @click="changeTag('摇滚')" :class="{active:tag === '摇滚'}">摇滚</span>
				<span class="item" @click="changeTag('民谣')" :class="{active:tag === '民谣'}">民谣</span>
				<span class="item" @click="changeTag('电子')" :class="{active:tag === '电子'}">电子</span>
				<span class="item" @click="changeTag('轻音乐')" :class="{active:tag === '轻音乐'}">轻音乐</span>
				<span class="item" @click="changeTag('影视原声')" :class="{active:tag === '影视原声'}">影视原声</span>
				<span class="item" @click="changeTag('ACG')" :class="{active:tag === 'ACG'}">ACG</span>
				<span class="item" @click="changeTag('怀旧')" :class="{active:tag === '怀旧'}">怀旧</span>
				<span class="item" @click="changeTag('治愈')" :class="{active:tag === '治愈'}">治愈</span>
				<span class="item" @click="changeTag('旅行')" :class="{active:tag === '旅行'}">旅行</span>
			</div>
			<!-- tab的内容区域 -->
			<div class="tab-content">
				<div class="items">
					<div class="item" :key="item.id" v-for="item in list">
						<div class="img-wrap" @click="toPlayList(item.id)">
							<div class="num-wrap">
								播放量:
								<span class="num">{{ item.playCount | playCountFilter }}</span>
							</div>
							<img :src="item.coverImgUrl" :alt="item.name" />
							<span class="iconfont icon-icon_Play"></span>
						</div>
						<p class="name">{{ item.name }}</p>
					</div>
				</div>
			</div>
		</div>
		<!-- 分页器 -->
		<el-pagination background :page-size="10" @current-change="handleCurrentChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total">
		</el-pagination>
	</div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
	data () {
		return {
		}
	},
	methods: {
		...mapMutations('playlists', ['changeTag', 'changePage']),
		...mapActions('playlists', ['getTopPlayListAsync', 'getPlayListsAsync']),
		handleCurrentChange (newPage) { // 页码切换会触发此函数
			// 通知 mutation 更新页码值
			this.changePage(newPage)
		},
		toPlayList (id) { // 前往歌单详情页
			this.$router.push({
				name: 'playlistDetail',
				params: {
					id
				}
			})
		}
	},
	computed: {
		...mapState('playlists', ['topList', 'list', 'tag', 'page', 'total'])
	},
	created () {
		// 获取顶部的精品歌单
		this.getTopPlayListAsync(this)
		// 获取歌单列表
		this.getPlayListsAsync(this)
	},
	watch: {
		tag () {
			// tag改变根据tag的值重新获取数据
			this.getTopPlayListAsync(this)
			this.getPlayListsAsync(this)
			// 分类改变时要自动切换到分类的第一页
			this.changePage(1)
		},
		page () {
			// 页码值改变根据新页码值重新获取数据
			this.getPlayListsAsync(this)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~styles/mixins.stylus'
@import '~styles/theme.stylus'
.playlists-container
	margin-bottom: 100px

	.top-card
		display: flex
		position: relative
		overflow: hidden
		padding: 20px
		height: 200px
		border-radius: 5px
		box-sizing: border-box

		.icon-wrap
			position relative
			PlayListIcon()
			margin-right: 20px
			width: 160px
			height: 160px
			z-index: 1

			img
				width: 160px
				height: 160px
				object-fit: cover

		.content-wrap
			z-index: 1

			.tag
				color: #dfac67
				border: 1px solid #dfac67
				width: 100px
				height: 30px
				text-align: center
				border-radius: 5px
				font-size: 16px
				line-height: 30px
				cursor: pointer

			.title
				color: white
				padding-top: 10px
				font-size: 20px

			.info
				color: #888482
				font-size: 14px
				padding-top: 5px
				overflow: hidden
				text-overflow: ellipsis
				display: -webkit-box
				-webkit-box-orient: vertical
				-webkit-line-clamp: 5

		// 背景+遮罩层
		.bg
			width: 100%
			position: absolute
			left: 0
			top: 0
			right: 0
			bottom: 0
			z-index: 0
			filter: blur(20px)

		.bg-mask
			width: 100%
			position: absolute
			left: 0
			top: 0
			right: 0
			bottom: 0
			background-color: rgba(0, 0, 0, 0.15)

	// tab栏
	.tab-container
		padding-top: 30px

		.tab-bar
			display: flex
			justify-content: flex-end

			.item
				font-size: 15px
				color: gray
				margin-right: 20px
				cursor: pointer

				&.active
					color: $lightred

		.tab-content
			margin-top: 20px

			.items
				display: flex
				flex-wrap: wrap
				justify-content: space-between

				.item
					width: 19%
					position: relative
					overflow: hidden
					cursor: pointer

					&:nth-child(n+6)
						margin-top: 25px

					img
						width: 100%
						object-fit: cover
						border-radius: 5px

					.num-wrap
						position: absolute
						top: 0
						left: 0
						font-size: 14px
						color: white
						line-height: 30px
						background: rgba(0, 0, 0, 0.5)
						height: 30px
						width: 100%
						transition: all 0.5s
						padding-left: 5px
						top: -30px
						overflow: hidden

					&:hover .num-wrap
						top: 0

					.img-wrap
						position: relative
						PlayListIcon()

					.name
						overflow: hidden
						text-overflow: ellipsis
						display: -webkit-box
						-webkit-box-orient: vertical
						-webkit-line-clamp: 2
						font-size: 14px
</style>
