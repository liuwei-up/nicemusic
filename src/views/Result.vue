<template>
<!-- 搜索结果页面 -->
	<div class="result-container">
		<div class="title-wrap">
			<h2 class="title">{{ search }}</h2>
			<span class="sub-title">找到{{ total }}个结果</span>
		</div>
		<!-- tab栏 -->
		<el-tabs v-model="activeName">
			<el-tab-pane label="歌曲" name="songs">
				<!-- 表格 -->
				<el-table :data="songList" stripe border @row-dblclick="playMusic">
					<el-table-column label="#" type="index"></el-table-column>
					<el-table-column label="音乐标题">
						<template v-slot="{ row }">
							<div class="song-wrap">
								<div class="name-wrap">
									<span>{{ row.name }}</span>
									<span v-if="row.mvid !== 0" class="iconfont icon-MV" @click="toMv(row.mvid)"></span>
								</div>
								<span v-if="row.alias.length !== 0">{{ row.alias[0] }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="歌手" prop="artists[0].name"></el-table-column>
					<el-table-column label="专辑" prop="album.name"></el-table-column>
					<el-table-column label="时长">
						<template v-slot="{ row }">
							{{ row.duration | timeFormat }}
						</template>
					</el-table-column>
					<el-table-column label="上传时间">
						<template v-slot="{ row }">
							{{ row.album.publishTime | dateFormat }}
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="歌单" name="lists">
				<div class="items lists">
					<div class="item" v-for="item in playList" :key="item.id">
						<div class="img-wrap" @click="toPlayList(item.id)">
							<div class="num-wrap">
								播放量:
								<span class="num">{{ item.playCount | playCountFilter }}</span>
							</div>
							<el-image :src="item.coverImgUrl"></el-image>
							<span class="iconfont icon-icon_Play"></span>
						</div>
						<p class="name">{{ item.name }}</p>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="MV" name="mvs">
				<div class="items mv">
					<div class="item" :key="item.id" v-for="item in mvList" @click="toMv(item.id)">
						<div class="img-wrap">
							<el-image :src="item.cover" fit="cover">
								<template v-slot:error>
									<i class="el-icon-picture-outline"></i>
									<strong>加载失败</strong>
								</template>
							</el-image>
							<span class="iconfont icon-icon_Play"></span>
							<div class="num-wrap">
								<div class="icon-play el-icon-caret-right"></div>
								<!-- 播放次数 -->
								<div class="num">{{ item.playCount }}</div>
							</div>
							<!-- 时长 -->
							<span class="time">{{ item.duration | timeFormat }}</span>
						</div>
						<div class="info-wrap">
							<!-- mv名 -->
							<div class="name">{{ item.name }}</div>
							<!-- 歌手名 -->
							<div class="singer">{{ item.artistName }}</div>
						</div>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
		<!-- 分页器 -->
		<!-- pagesize是一页显示的数据条数 -->
		<el-pagination background @current-change="handleCurrentChange" :current-page="page" :page-size="query.type === 1 ? 15 : 8" layout="total, prev, pager, next, jumper" :total="total">
		</el-pagination>
	</div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
	props: ['search'],
	data () {
		return {
			activeName: 'songs'
		}
	},
	methods: {
		...mapActions('result', ['getDataByKeywordsAsync']),
		...mapActions(['getMucicUrlByIdAsync']),
		...mapMutations('result', ['changeActiveTab', 'changePage', 'InitializeData']),
		playMusic (row, column, event) {
			// 判断被点击单元格是否为每一行的音乐标题
			if (column.label !== '音乐标题') {
				console.log(column)
				return this.$message('info', '双击音乐标题单元格可播放歌曲')
			}
			// 调用通用的播放歌曲 action
			this.getMucicUrlByIdAsync({
				V: this,
				id: row.id
			})
		},
		handleCurrentChange (newPage) { // 页码变化会触发此函数
			this.changePage(newPage)
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
			// 前往Mv详情页面
			this.$router.push({
				name: 'MvDetail',
				params: {
					id
				}
			})
		}
	},
	computed: {
		...mapState('result', ['query', 'songList', 'total', 'playList', 'mvList', 'page'])
	},
	created () {
		// 清空历史数据,防止在跳转的时候数据还未请求完成会显示上一次请求到的数据
		this.InitializeData()
		this.getDataByKeywordsAsync({
			V: this,
			keywords: this.search
		})
	},
	watch: {
		search () {
			this.getDataByKeywordsAsync({
				V: this,
				keywords: this.search
			})
			this.activeName = 'songs'
		},
		activeName (newActiveName) { // 监听选项卡的切换
			// 选项卡切换通知mutation将页码重置回1
			this.changePage(1)
			this.changeActiveTab(newActiveName)
			this.getDataByKeywordsAsync({
				V: this,
				keywords: this.search
			})
		},
		page () { // 页码改变重新获取数据
			this.getDataByKeywordsAsync({
				V: this,
				keywords: this.search
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~styles/mixins.stylus'

.result-container
	margin-bottom: 120px

	.title-wrap
		display: flex
		align-items: flex-end
		margin-bottom: 30px

		.title
			margin-right: 10px

		.sub-title
			font-size: 15px
			color: #bebebe

	.song-wrap
		SongWrap()

	.items.lists
		display: flex
		flex-wrap: wrap
		justify-content: space-between

		.item
			width: 23%
			overflow: hidden
			cursor: pointer
			margin-right: 20px
			margin-bottom: 20px

			.img-wrap
				MvPlayIcon()

				.el-image
					ElImage(100%)

				.num-wrap
					position: absolute
					width: 100%
					height: 30px
					color: white
					top: -35px
					background: rgba(0, 0, 0, 0.5)
					right: 0
					display: flex
					transition: all 0.5s
					align-items: center
					font-size: 15px
					padding: 2px
					box-sizing: border-box
					z-index: 1

				&:hover .num-wrap
					top: 0

					.icon-icon_Play
						font-size: 12px
						display: flex
						align-items: center
						margin-right: 5px

				.time
					position: absolute
					bottom: 5px
					right: 5px
					color: white
					font-size: 15px

			.name
				font-size: 15px
				overflow: hidden
				text-overflow: ellipsis
				display: -webkit-box
				-webkit-box-orient: vertical
				-webkit-line-clamp: 2

			.singer
				font-size: 14px
				color: #c5c5c5

		&.mv
			.item
				width: 250px

	.items.mv
		display: flex
		justify-content: space-between
		flex-wrap: wrap

		.item
			width: 22%
			cursor: pointer
			margin-right: 25px
			margin-bottom: 30px

			&:nth-child(4n)
				margin-right: 0

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
					font-size: 15px
					padding-right: 5px
					padding-top: 2px

					.icon-play
						font-size: 18px
						display: flex
						align-items: center
						margin-right: 5px

			.info-wrap
				.name
					font-size: 15px

				.singer
					font-size: 14px
					color: #c5c5c5
</style>
