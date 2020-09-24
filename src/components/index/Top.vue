<template>
	<!-- 页面顶部组件 -->
	<div id="top" v-waves>
		<div class="lamp">
			<span class="red"></span>
			<span class="yellow"></span>
			<span class="green"></span>
		</div>
		<div class="icon-button">
			<el-tooltip content="后退一步" :enterable="false" placement="bottom" effect="light">
				<i @click="back()" class="el-icon-arrow-left"></i>
			</el-tooltip>
			<el-tooltip content="前进一步" :enterable="false" placement="bottom" effect="light">
				<i @click="go()" class="el-icon-arrow-right"></i>
			</el-tooltip>
			<el-tooltip content="刷新页面" :enterable="false" placement="bottom" effect="light">
				<i @click="reload()" class="el-icon-refresh-right"></i>
			</el-tooltip>
		</div>
		<div class="search">
			<!-- 搜索框 -->
			<el-input size="small" prefix-icon="el-icon-search" v-model="inputValue" placeholder="搜索" @keyup.native.enter="toResult">
			</el-input>
		</div>
	</div>
</template>
<script>
export default {
	data () {
		return {
			inputValue: ''
		}
	},
	methods: {
		toResult () {
			// 判断输入内容是否为空
			if (!this.inputValue.trim()) {
				return this.$message('warning', '请输入内容')
			}
			// 携带参数跳转路由
			this.$router.push({
				name: 'searchResult',
				params: {
					search: this.inputValue
				}
			})
			// 清空搜索框内容
			this.inputValue = ''
		},
		back () { // 后退
			this.$router.go(-1)
		},
		go () { // 前进
			this.$router.go(1)
		},
		reload () { // 刷新
			this.$router.go(0)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~styles/theme.stylus'

#top
	display: flex
	justify-content: space-between
	padding: 0 20px
	height: 70px
	background-color: #efefef

	.icon-button
		flex: 1
		text-align: left
		font-size: 24px
		color: #606266
		line-height: 70px

		i
			margin-right: 20px

			&:hover
				color: $lightred

	.lamp
		width: 180px

		span
			display: inline-block
			width: 20px
			height: 20px
			margin-right: 8px
			margin-top: 4px
			border-radius: 50%

			&.red
				background-color: $red

			&.yellow
				background-color: $yellow

			&.green
				background-color: $green

	.search
		display: flex
		flex-direction: column
		justify-content: center
		max-width: 240px
		min-width: 180px

		.el-input
			width: 100%
</style>
