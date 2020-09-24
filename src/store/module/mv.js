import cleanHistoryData from '../../plugins/cleanHistoryData.js'
export default {
	namespaced: true,
	state: {
		mvUrl: '', // Mv的地址
		simiMvs: [], // 相关的 Mv
		mvInfo: {}, // mv的详细信息
		singerInfo: {}, // 歌手的详细信息
		limit: 20, // 一次获取多少条评论
		page: 1, // 评论的页码
		comments: [], // 评论数据
		hotComments: [], // 热评数据
		total: 0 // 评论总数
	},
	mutations: {
		getMvUrlById (state, { data }) {
			console.log(data)
			// 存储MV地址
			state.mvUrl = data.url
		},
		getSimiMvById (state, data) {
			// 存储相关Mv信息
			state.simiMvs = data.mvs
		},
		getMvDatailById (state, { data }) {
			// 存储 Mv 详细信息
			state.mvInfo = data
		},
		getSingerInfoById (state, { artist }) {
			// 存储歌手详细信息
			state.singerInfo = artist
		},
		getMvCommentsById (state, data) {
			// 存储评论
			state.comments = data.comments
			// 存储热评
			state.hotComments = data.hotComments
			// 存储评论总数
			state.total = data.total
			console.log(state.comments, state.hotComments)
		},
		changePage (state, newPage) {
            // 更改page的值
			state.page = newPage
			console.log(state.page)
        },
		changeSize (state, newSize) {
			state.limit = newSize
			console.log(state.limit)
		},
		InitializeData (state) { // 不是第一次进入歌单详情页，需要先清除历史数据
			cleanHistoryData(state)
		}
	},
	actions: {
		async getMvUrlByIdAsync ({ commit }, { V, id }) { // 根据MVid获取Mv的在线url
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/mv/url',
				params: {
					id
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', 'MV数据获取失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getMvUrlById', resData)
		},
		async getSimiMvByIdAsync ({ commit }, { V, id }) { // 根据MVid获取相关Mv信息
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/simi/mv',
				params: {
					mvid: id
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '相关MV数据获取失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getSimiMvById', resData)
		},
		async getMvDatailByIdAsync  ({ commit, dispatch }, { V, id }) { // 根据MVid获取Mv详细信息
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/mv/detail',
				params: {
					mvid: id
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', 'MV详细信息获取失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getMvDatailById', resData)
			// 根据查询到的信息中的歌手id调用其他 action 获取歌手详细信息
			dispatch('getSingerInfoByIdAsync', {
				V,
				id: resData.data.artistId
			})
		},
		async getSingerInfoByIdAsync ({ commit }, { V, id }) { // 根据mv详细信息中查到的歌手id获取歌手信息
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/artists',
				params: {
					id
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '歌手信息获取失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getSingerInfoById', resData)
		},
		async getMvCommentsByIdAsync ({ commit, state }, { V, id }) { // 根据mvid获取此mv的评论
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/comment/mv',
				params: {
					id,
					offset: (state.page - 1) * state.limit
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '评论信息获取失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getMvCommentsById', resData)
		}
	}
}
