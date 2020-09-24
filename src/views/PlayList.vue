<template>
	<!-- 歌单详情页面 -->
	<div class="playlist-container">
		<div class="top-wrap">
			<div class="img-wrap">
				<!-- 封面 -->
				<el-image :src="playlist.coverImgUrl"></el-image>
			</div>
			<div class="info-wrap">
				<!-- 名字 -->
				<p class="title">{{ playlist.title }}</p>
				<div class="author-wrap">
					<!-- 头像 -->
					<img class="avatar" :src="playlist.creator.avatarUrl" alt="" />
					<span class="name">{{ playlist.creator.nickname }}</span>
					<span class="time">{{ playlist.createTime | dateFormat }} 创建</span>
				</div>
				<div class="play-wrap">
					<el-button @click="playAll" size="small" type="danger" icon="el-icon-video-play">播放全部</el-button>
				</div>
				<div class="tag-wrap">
					<span class="title">标签:</span>
					<!-- 分类标签 -->
					<ul>
						<li v-for="(item, index) in playlist.tags" :key="index">
							{{ item }}
						</li>
					</ul>
				</div>
				<div class="desc-wrap">
					<span class="title">简介:</span>
					<!-- 简介 -->
					<span class="desc">
						{{ playlist.description.length > 150 ? playlist.description.substr(0, 150) + '...' : playlist.description}}
					</span>
					<a v-if="more" href="javascript:;" @click="descDialogVisible = true">查看更多</a>
				</div>
			</div>
		</div>
		<!-- 选项卡 -->
		<el-tabs v-model="activeIndex">
			<!-- 歌曲列表 -->
			<el-tab-pane :label="'歌曲列表('+songsTotal+')'" name="1">
				<!-- 表格 -->
				<el-table :data="songsList" border stripe>
					<el-table-column type="index" label="#"></el-table-column>
					<el-table-column label="封面" width="90px">
						<template v-slot="{ row }">
							<div class="img-wrap" @click="playMusic(row.id)">
								<el-image :src="row.al.picUrl" lazy fit="cover">
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
							</div>
						</template>
					</el-table-column>
					<el-table-column label="音乐标题">
						<template v-slot="{ row }">
							<div class="song-wrap">
								<div class="name-wrap">
									<span>{{ row.name }}</span>
									<span v-if="row.mv !== 0" @click="toMv(row.mv)" class="iconfont icon-MV"></span>
								</div>
								<span v-if="row.alia.length !== 0">{{ row.alia[0] }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="歌手" prop="ar[0].name"></el-table-column>
					<el-table-column label="专辑" prop="al.name"></el-table-column>
					<el-table-column label="时长" width="80px">
						<template v-slot="{ row }">
							{{ row.dt | timeFormat }}
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane :label="'评论('+ total +')'" name="2">
				<!-- 精彩评论 -->
				<div class="comment-wrap" v-show="page == 1">
					<p class="title">
						精彩评论
						<span class="number">({{ hotCommentsTotal }})</span>
					</p>
					<div class="comments-wrap">
						<!-- 评论 -->
						<div v-for="(item, index) in hotComments" :key="index" class="item">
							<div class="icon-wrap">
								<!-- 头像 -->
								<img :src="item.user.avatarUrl" alt="" />
							</div>
							<div class="content-wrap">
								<!-- 内容 -->
								<div class="content">
									<!-- 昵称 -->
									<span class="name">{{ item.user.nickname }}：</span>
									<span class="comment">{{ item.content }}</span>
								</div>
								<!-- 评论的回复(评论回复的数组不等于0就渲染此数组) -->
								<div class="re-content" v-if="item.beReplied.length != 0">
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
					<p class="title">
						最新评论
						<span class="number">({{commentsTotal}})</span>
					</p>
					<div class="comments-wrap">
						<!-- 循环最新评论数组，将评论渲染到页面 -->
						<div class="item" v-for="(item,index) in comments" :key="index">
							<div class="icon-wrap">
								<img :src="item.user.avatarUrl" alt="" />
							</div>
							<div class="content-wrap">
								<div class="content">
									<span class="name">{{item.user.nickname}}：</span>
									<span class="comment">{{ item.content }}</span>
								</div>
								<div class="re-content" v-if="item.beReplied.length!=0">
									<span class="name">{{ item.beReplied[0].user.nickname }}：</span>
									<span class="comment">{{ item.beReplied[0].content }}</span>
								</div>
								<div class="date">{{ item.time | dateFormat }}</div>
							</div>
						</div>
					</div>
				</div>
			</el-tab-pane>
			<!-- 分页器 -->
			<el-pagination :page-size="20" @current-change="handleCurrentChange" background layout="prev, pager, next" :total="activeIndex === '1' ? songsTotal : commentsTotal" :current-page="page"></el-pagination>
		</el-tabs>

		<!-- 歌单详情对话框 -->
		<el-dialog title="歌单详情" :visible.sync="descDialogVisible" width="50%">
			<pre>
				{{ playlist.description }}
			</pre>
			<template v-slot:footer>
				<el-button @click="descDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="descDialogVisible = false">确 定</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
	// 接收路由传参
	props: ['id'],
	data () {
		return {
			activeIndex: '1', // 当前被选中的选项卡的索引
			currentMusicIndex: 0, // 当前播放的歌曲在本页歌单中的索引
			descDialogVisible: false // 是否显示歌单详情对话框
		}
	},
	methods: {
		...mapActions(['getMucicUrlByIdAsync']),
		...mapActions('playlist', ['getPlayListDetailByIdAsync', 'getHotCommentsByPlayLisyIdAsync', 'getCommentsByIdAsync', 'getMusicDetailByIdAsync']),
		...mapMutations('playlist', ['changePage', 'InitializeData']),
		handleCurrentChange (newPage) { // 当前页码变化时会调用的回调
			// 通知 mutation 更新页码
			this.changePage(newPage)
		},
		playMusic (id) {
			// 判断当前自动播放歌曲的进度是否被更改，如果被更改就以最新值为准继续向下播放
			const index = this.songsList.findIndex(item => item.id === id)
			if (this.currentMusicIndex !== index) {
				// 从当前索引值的下一首歌开始播放
				this.currentMusicIndex = index + 1
			}
			this.getMucicUrlByIdAsync({
				V: this,
				id
			})
		},
		playAll () {
			this.currentMusicIndex = 0 // 当前存放播放的歌曲在数组中的索引
			this.$message('info', '默认是播放本页全部歌曲')
			const autoPlay = () => {
				// 判断 i 如果大于数组长度，就清除此事件监听
				if (this.currentMusicIndex > this.songsList.length) {
					this.audioRef.removeEventListener('ended', autoPlay)
				} else {
					// 继续播放下一首
					this.playMusic(this.songsList[this.currentMusicIndex].id)
					this.audioRef.play()
				}
				this.currentMusicIndex++
			}
			this.audioRef.load()
			autoPlay()
			this.audioRef.addEventListener('ended', function () {
				autoPlay()
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
		...mapState(['audioRef']),
		...mapState('playlist', ['page', 'playlist', 'songsList', 'songsTotal', 'hotComments', 'hotCommentsTotal', 'commentsTotal', 'comments']),
		total () { // 评论总数量
			return parseInt(this.hotCommentsTotal) + parseInt(this.commentsTotal)
		},
		more () { // 是否显示查看更多按钮
			if (this.playlist.description.length > 150) {
				return true
			} else {
				return false
			}
		}
	},
	created () {
		// 清空历史数据
		this.InitializeData()
		// 根据歌单id获取详情
		this.getPlayListDetailByIdAsync({
			V: this,
			id: this.id
		})
		// 根据歌单id获取热门评论
		this.getHotCommentsByPlayLisyIdAsync({
			V: this,
			id: this.id
		})
		// 根据歌单id获取最新评论
		this.getCommentsByIdAsync({
			V: this,
			id: this.id
		})
	},
	watch: {
		page (newPage) {
			// 页码变化要重新渲染页面
			if (this.activeIndex === '1') { // 判断当前tab栏是否在歌曲
				// 根据新页码分割 songsId 请求歌曲详情列表信息
				this.getMusicDetailByIdAsync(this)
			} else {
				// 当前 tab 栏在评论页
				// 根据歌单id获取最新评论
				// 判断当前页码是否为1
				if (newPage === 1) {
					// 根据歌单id获取热门评论
					this.getHotCommentsByPlayLisyIdAsync({
						V: this,
						id: this.id
					})
				}
				// 根据歌单id获取最新评论
				this.getCommentsByIdAsync({
					V: this,
					id: this.id
				})

				window.scroll(0, 0)
			}
		},
		activeIndex () { // 选项卡切换，页码重置
			this.changePage(1)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~styles/mixins.stylus'

.playlist-container
	margin-bottom: 120px
	padding-top: 40px

	.top-wrap
		display: flex

		span
			font-size: 17px

		.img-wrap
			margin-right: 30px

			.el-image
				width: 230px
				height: 230px
				border-radius: 5px

		.info-wrap
			.title
				margin-bottom: 20px

			.author-wrap
				display: flex
				align-items: center
				margin-bottom: 25px

				img
					width: 35px
					height: 35px
					border-radius: 50%
					margin-right: 10px

				.name
					margin-right: 10px

				.time
					font-size: 14px

			.play-wrap
				margin-bottom: 15px

				.el-button
					font-size: 16px !important

			.tag-wrap
				display: flex
				margin-bottom: 15px

				span
					margin: 0

				ul
					display: flex
					align-items: center

				li
					font-size: 15px

					&:not(:last-child)::after
						content: '/'
						margin: 0 4px

			.desc-wrap
				span
					&.desc
						font-size: 15px

				a
					color: gray

					&:hover
						text-decoration: underline

			span:first-child
				margin-right: 10px

	.comment-wrap
		margin-bottom: 70px

		.title
			font-size: 20px

			.number
				color: black
				font-size: 18px

		.item
			display: flex
			padding-top: 20px

			.icon-wrap
				margin-right: 15px

				img
					width: 50px
					height: 50px
					border-radius: 50%

			&:not(:last-child)
				.content-wrap
					border-bottom: 1px solid #f2f2f1

			.date
				color: #bebebe
				font-size: 14px

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

	// 歌单表格
	.el-table
		.img-wrap
			MvPlayIcon(25px, 12px, 1px)
			width: 70px !important
			height: 70px !important

			.el-image
				ElImage()

		.song-wrap
			SongWrap()

	/* 处理dialog中的歌单详情文本 */
	pre
		font-size: 16px
		font-family: 'Microsoft YaHei' /* 指定dialog内的歌单详情文本为微软雅黑 */
		text-align: justify
		white-space: pre-line
		white-space: -moz-pre-line
		white-space: -pre-line
		white-space: -o-pre-line
		word-wrap: break-word
</style>
