<template>
<!-- 最新音乐页面 -->
	<div class="songs-container">
		<!-- 选项卡 -->
		<div class="tab-bar">
			<span class="item" @click="changeTag(0)" :class="{active: tag === 0}">全部</span>
			<span class="item" @click="changeTag(7)" :class="{active: tag === 7}">华语</span>
			<span class="item" @click="changeTag(96)" :class="{active: tag === 96}">欧美</span>
			<span class="item" @click="changeTag(8)" :class="{active: tag === 8}">日本</span>
			<span class="item" @click="changeTag(16)" :class="{active: tag === 16}">韩国</span>
		</div>
		<!-- 表格 -->
		<el-table border :data="songsList" stripe style="width: 100%">
			<el-table-column type="index" label="#">
			</el-table-column>
			<el-table-column label="封面" width="90px">
				<template v-slot="slotProps">
					<div class="img-wrap">
						<el-image :src="slotProps.row.album.picUrl" fit="cover" lazy>
							<template v-slot:load>
								<i class="el-icon-loading"></i>
								<strong>图片正在加载中</strong>
							</template>
							<template v-slot:error>
								<i class="el-icon-picture-outline"></i>
								<strong>加载失败</strong>
							</template>
						</el-image>
						<!-- 播放按钮 -->
						<span @click="playMusic(slotProps.row.id)" class="iconfont icon-icon_Play"></span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="音乐标题">
				<template v-slot="slotProps">
					<div class="song-wrap">
						<div class="name-wrap">
							<span>{{ slotProps.row.name }}</span>
							<span v-if="slotProps.row.mvid !== 0" class="iconfont icon-MV"></span>
						</div>
						<span v-if="slotProps.row.alias.length !== 0">{{ slotProps.row.alias[0] }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="album.artists[0].name" label="歌手">
			</el-table-column>
			<el-table-column prop="album.name" label="专辑">
			</el-table-column>
			<el-table-column label="时长" width="100px">
				<template v-slot="slotProps">
					{{ slotProps.row.duration | timeFormat }}
				</template>
			</el-table-column>
		</el-table>
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
		...mapActions('songs', ['getNewSongsListAsync']),
		...mapActions(['getMucicUrlByIdAsync']),
		...mapMutations('songs', ['changeTag']),
		playMusic (id) { // 播放歌曲
			const params = {
				V: this,
				id
			}
			// 调用播放歌曲的 action
			this.getMucicUrlByIdAsync(params)
		}
	},
	computed: {
		...mapState('songs', ['songsList', 'tag'])
	},
	created () {
		this.getNewSongsListAsync(this)
	},
	watch: {
		// 监听tag，值改变后重新调用接口获取对应地区数据
		tag () {
			this.getNewSongsListAsync(this)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~styles/theme.stylus'

.songs-container
	margin-bottom: 120px

	/* tab栏 */
	.tab-bar
		display: flex
		justify-content: flex-end
		width: 100%
		height: 30px

		.item
			margin-right: 20px
			line-height: 30px
			font-size: 15px
			color: gray
			cursor: pointer

			&.active
				color: $lightred

.img-wrap
	position: relative
	width: 70px
	height: 70px

	.el-image
		width: 70px
		height: 70px
		display: flex
		flex-direction: column
		justify-content: center
		align-items: center
		border-radius: 5px

		i
			font-size: 30px

	.icon-icon_Play
		position: absolute
		top: 50%
		left: 50%
		transform: translate(-50%, -50%)
		width: 25px
		height: 25px
		color: #dd6d60
		font-size: 12px
		border-radius: 50%
		display: flex
		align-items: center
		justify-content: center
		background: rgba(255, 255, 255, 0.8)

		&::before
			transform: translateX(1px)

/* 歌曲 */
.song-wrap
	display: flex
	flex-direction column
	justify-content center
	align-items: flex-start
	> span
		margin-top: 20px
		display: inline-block
		color: #bebebe

	.icon-MV
		padding-left: 5px
		color: #dd6d60
</style>
