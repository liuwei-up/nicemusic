<template>
<!-- MV详情页面 -->
	<div class="mv-container">
		<div class="mv-wrap">
			<h3 class="title">MV详情</h3>
			<!-- mv -->
			<div class="video-wrap">
				<video controls :src="mvUrl" autoplay></video>
			</div>
			<!-- mv信息 -->
			<div class="info-wrap">
				<div class="singer-info">
					<div class="avatar-wrap">
						<!-- 头像 -->
						<img :src="singerInfo.picUrl" :alt="singerInfo.name" />
					</div>
					<!-- 歌手名 -->
					<span class="name">{{ singerInfo.name }}</span>
				</div>
				<div class="mv-info">
					<!-- 标题 -->
					<h2 class="title">{{ mvInfo.name }}</h2>
					<span class="date">发布：2014-11-04</span>
					<!-- 播放次数 -->
					<span class="number">播放：{{ mvInfo.playCount }}次</span>
					<!-- 描述 -->
					<p class="desc">{{ mvInfo.desc }}</p>
				</div>
			</div>
			<!-- 精彩评论 -->
			<div class="comment-wrap" v-if="page === 1">
				<p class="title">精彩评论<span class="number">({{ hotComments.length }})</span></p>
				<div class="comments-wrap">
					<div class="item" v-for="(item, index) in hotComments" :key="index">
						<div class="icon-wrap">
							<el-image :src="item.user.avatarUrl" :alt="item.user.nickname" lazy></el-image>
						</div>
						<div class="content-wrap">
							<div class="content">
								<span class="name">{{ item.user.nickname }}：</span>
								<span class="comment">{{ item.content }}</span>
							</div>
							<div class="re-content" v-if="item.beReplied.length !== 0">
								<span class="name">{{ item.beReplied[0].user.nickname }}：</span>
								<span class="comment">{{ item.beReplied[0].content }}</span>
							</div>
							<div class="date">{{ item.time | dateFormat }}</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 最新评论 -->
			<div class="comment-wrap">
				<p class="title">最新评论<span class="number">({{ total }}) <br /><br /> 当前页数【{{ page }}】</span></p>
				<div class="comments-wrap">
					<div class="item" v-for="(item, index) in comments" :key="index">
						<div class="icon-wrap">
							<el-image lazy :src="item.user.avatarUrl" :alt="item.user.nickname"></el-image>
						</div>
						<div class="content-wrap">
							<div class="content">
								<span class="name">{{ item.user.nickname }}：</span>
								<span class="comment">{{ item.content }}</span>
							</div>
							<div class="re-content" v-if="item.beReplied.length !== 0">
								<span class="name">{{ item.beReplied[0].user.nickname }}</span>
								<span class="comment">{{ item.beReplied[0].content }}</span>
							</div>
							<div class="date">{{ item.time | dateFormat }}</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 分页器 -->
			<el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" background layout="sizes, prev, pager, next, jumper" :current-page="page" :page-sizes="[10, 20, 40]" :page-size="limit" :total="total"></el-pagination>
		</div>
		<div class="mv-recommend">
			<h3 class="title">相关推荐</h3>
			<div class="mvs">
				<div class="items">
					<div class="item" v-for="item in simiMvs" :key="item.id">
						<div class="img-wrap"  @click="toMv(item.id)">
							<!-- 封面 -->
							<img :src="item.cover" :alt="item.name" />
							<span class="iconfont icon-icon_Play"></span>
							<div class="num-wrap">
								<div class="el-icon-caret-right"></div>
								<div class="num">{{ item.playCount }}</div>
							</div>
							<!-- 时间 -->
							<span class="time">{{ item.duration | timeFormat }}</span>
						</div>
						<div class="info-wrap">
							<div class="name">{{ item.name }}</div>
							<div class="singer">{{ item.artistName }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
	// 获取路由的传参
	props: ['id'],
	data () {
		return {
		}
	},
	methods: {
		...mapMutations('mv', ['changeSize', 'changePage', 'InitializeData']),
		...mapActions('mv', ['getMvUrlByIdAsync', 'getSimiMvByIdAsync', 'getMvDatailByIdAsync', 'getMvCommentsByIdAsync']),
		handleCurrentChange (newPage) { // 页码变化后会调用此回调
			this.changePage(newPage)
		},
		handleSizeChange (newSize) { // 每一页显示的评论数量变化会触发此回调
			this.changeSize(newSize)
		},
		toMv (id) {
			// 更改地址栏中路由信息
			this.$router.push({
				name: 'MvDetail',
				params: {
					id
				}
			})
			this.$router.go(0)
		}
	},
	computed: {
		...mapState('mv', ['mvUrl', 'simiMvs', 'singerInfo', 'mvInfo', 'page', 'limit', 'total', 'comments', 'hotComments'])
	},
	created () {
		// 清空历史数据,防止在跳转的时候数据还未请求完成会显示上一次请求到的数据
		this.InitializeData()
		// 根据 id 查询对应id详情信息
		this.getMvUrlByIdAsync({
			V: this,
			id: this.id
		})
		// 根据id获取相关Mv信息
		this.getSimiMvByIdAsync({
			V: this,
			id: this.id
		})
		// 获取MV详细信息
		this.getMvDatailByIdAsync({
			V: this,
			id: this.id
		})
		// 根据mvid获取评论信息
		this.getMvCommentsByIdAsync({
			V: this,
			id: this.id
		})
	},
	watch: {
		page () { // 页码改变使用新的页码去获取评论信息
			// 根据mvid获取评论信息
			this.getMvCommentsByIdAsync({
				V: this,
				id: this.id
			})
		},
		limit () { // 单页评论数量改变使用新参数去获取评论信息
			// 页码重置为 1
			// 监听器中的watch监听到页码变化会使用新页码去获取评论信息，不用再次调用接口
			this.changePage(1)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~styles/mixins.stylus'
.mv-container
	display: flex
	justify-content: space-between
	margin-bottom: 120px

	.title
		margin-bottom: 20px

	.mv-wrap
		flex: 6
		min-width: 700px

		.date
			margin-right: 25px

		.date, .number
			color: #bebebe
			font-size: 14px

		.video-wrap
			width: 100%
			height: 390px
			margin-bottom: 20px

			video
				border-radius: 5px
				height: 100%
				width: auto
				outline: none

		.info-wrap
			margin-bottom: 50px

			.singer-info
				display: flex
				align-items: center
				margin-bottom: 35px

				.avatar-wrap
					width: 70px
					height: 70px
					border-radius: 50%
					margin-right: 10px
					overflow: hidden

					img
						height: 100%

			.mv-info
				.title
					font-size: 30px

				.desc
					font-size: 15px
					margin-top: 20px

		.comment-wrap
			margin-bottom: 70px

			.title
				font-size: 25px

				.number
					color: black
					font-size: 20px

			.item
				display: flex
				padding-top: 20px

				.icon-wrap
					margin-right: 15px

					.el-image
						width: 50px
						height: 50px
						border-radius: 50%

				&:not(:last-child)
					.content-wrap
						border-bottom: 1px solid #f2f2f1

				.content-wrap
					padding-bottom: 20px
					flex: 1

					.name
						color: #517eaf
						font-size: 14px

					.comment
						font-size: 14px

					.content, .re-content
						margin-bottom: 10px

					.re-content
						padding: 10px
						background-color: #e6e5e6
						border-radius: 5px

	.mv-recommend
		flex: 3

		.mvs
			.items
				display: flex
				flex-wrap: wrap

				.item
					cursor: pointer
					width: 100%
					display: flex
					align-items: center
					padding: 10px
					cursor: pointer

					&:hover
						background-color: #f5f5f5

					.img-wrap
						MvPlayIcon(40px, 30px, 0px)
						width: 180px!important
						margin-right: 10px

						img
							width: 100%
							border-radius: 5px

						.num-wrap
							position: absolute
							color: white
							top: 0
							right: 0
							display: flex
							align-content: center
							font-size: 15px
							padding-right: 5px
							padding-top: 2px

							.el-icon-caret-right
								font-size: 18px
								display: flex
								align-items: center
								margin-right: 5px

						.time
							position: absolute
							bottom: 5px
							right: 5px
							color: white
							font-size: 15px

					.info-wrap
						flex: 1

						.name
							font-size: 15px

						.singer
							font-size: 14px
							color: #c5c5c5
</style>
