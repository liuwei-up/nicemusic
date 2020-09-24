<template>
<!-- 最新MV页面 -->
	<div class="mvs-container">
		<div class="filter-wrap">
			<div class="tab area">
				<div class="name">地区</div>
				<div class="tabs">
					<span class="option" @click="handleTabClick('area', '全部')" :class="{active:query.area === '全部'}">全部</span>
					<span class="option" @click="handleTabClick('area', '内地')" :class="{active:query.area === '内地'}">内地</span>
					<span class="option" @click="handleTabClick('area', '港台')" :class="{active:query.area === '港台'}">港台</span>
					<span class="option" @click="handleTabClick('area', '欧美')" :class="{active:query.area === '欧美'}">欧美</span>
					<span class="option" @click="handleTabClick('area', '日本')" :class="{active:query.area === '日本'}">日本</span>
					<span class="option" @click="handleTabClick('area', '韩国')" :class="{active:query.area === '韩国'}">韩国</span>
				</div>
			</div>
			<div class="tab type">
				<div class="name">类型</div>
				<div class="tabs">
					<span class="option" @click="handleTabClick('type', '全部')" :class="{active:query.type === '全部'}">全部</span>
					<span class="option" @click="handleTabClick('type', '官方版')" :class="{active:query.type === '官方版'}">官方版</span>
					<span class="option" @click="handleTabClick('type', '原声')" :class="{active:query.type === '原声'}">原声</span>
					<span class="option" @click="handleTabClick('type', '现场版')" :class="{active:query.type === '现场版'}">现场版</span>
					<span class="option" @click="handleTabClick('type', '网易出品')" :class="{active:query.type === '网易出品'}">网易出品</span>
				</div>
			</div>
			<div class="tab order">
				<div class="name">排序</div>
				<div class="tabs">
					<span class="option" @click="handleTabClick('order', '上升最快')" :class="{active:query.order === '上升最快'}">上升最快</span>
					<span class="option" @click="handleTabClick('order', '最热')" :class="{active:query.order === '最热'}">最热</span>
					<span class="option" @click="handleTabClick('order', '最新')" :class="{active:query.order === '最新'}">最新</span>
				</div>
			</div>
		</div>
		<!-- mv容器 -->
		<div class="mvs">
			<div class="items">
				<div class="item" v-for="item in mvsList" :key="item.id">
					<div class="img-wrap" @click="toMv(item.id)">
						<el-image lazy :src="item.cover" fit="cover">
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
							<div class="icon-play el-icon-caret-right"></div>
							<div class="num">{{ item.playCount | playCountFilter }}</div>
						</div>
					</div>
					<div class="info-wrap">
						<div class="name">{{ item.name }}</div>
						<div class="singer">{{ item.artistName }}</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 分页器 -->
		<el-pagination background @current-change="handleCurrentChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total">
		</el-pagination>
	</div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
	data () {
		return {
		}
	},
	methods: {
		...mapActions('mvs', ['getMvsAsync']),
		...mapMutations('mvs', ['changeQuery', 'changePage']),
		handleTabClick (name, data) { // 处理过滤类型的切换
			const params = {
				name,
				data
			}
			// 根据传过去的数据更新query
			this.changeQuery(params)
		},
		handleCurrentChange (newPage) { // 页码切换会触发此函数
			// 通知 mutation 更新页码值
			this.changePage(newPage)
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
	created () {
		// 调用 mv 接口获取数据
		this.getMvsAsync(this)
	},
	computed: {
		...mapState('mvs', ['mvsList', 'query', 'page', 'total'])
	},
	watch: {
		query: { // 监听query变化
			deep: true, // 深度监听
			handler () { // 变化处理函数
				// 使用更新后的 query 重新MV数据
				this.getMvsAsync(this)
				// 切换分类后页码重置回第一页
				this.changePage(1)
			}
		},
		page (newPage) { // 监听页码变化
			// 重新获取数据
			this.getMvsAsync(this)
		}
	}
}
</script>
<style lang="stylus" scoped>
// 引入封装的函数
@import '~styles/mixins.stylus';
.mvs-container
	font-size: 16px
	margin-bottom: 120px

	.filter-wrap
		.tab
			display: flex
			height: 24px
			margin-bottom: 30px
			line-height: 20px

			.name
				width: 60px
				text-align: left
				color: #000000

			.tabs
				display: flex
				color: gray

				.option
					font-size: 14px
					padding: 2px 14px
					margin-right: 50px

					&.active
						background-color: #ffdddd
						color: #dd6d60
						border-radius: 20px

	// mvs
	.mvs
		.items
			display: flex
			justify-content: space-between
			flex-wrap: wrap

			.item
				// width: 250px
				width: 22%
				cursor: pointer
				margin-right: 25px
				margin-bottom: 30px

				&:nth-child(4n)
					margin-right: 0

				.img-wrap
					MvPlayIcon()

					.el-image
						display: flex
						flex-direction: column
						justify-content: center
						align-items: center
						width: 100%
						min-height: 140px
						border-radius: 5px

						i
							font-size: 30px

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
