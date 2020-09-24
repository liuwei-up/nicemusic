import cleanHistoryData from '../../plugins/cleanHistoryData.js'
export default {
	namespaced: true,
	state: {
		page: 1, // 页码
		playlist: {}, // 存储歌单信息
		hotComments: [], // 存储热门评论
		hotCommentsTotal: 0, // 热门评论的个数
		commentsTotal: 0, // 最新评论数量
		comments: [], // 最新评论数据
		songsId: [], // 歌单中的歌曲的id
		songsList: [], // 歌单中的歌曲的列表
		songsTotal: 0 // 歌单总共有多少歌曲
	},
	mutations: {
		getPlayListDetailById (state, { playlist }) {
			// 存储歌单信息
			state.playlist = playlist
			// 存储歌单中的歌曲的id
			state.songsId = playlist.trackIds.map(item => item.id)
			// 存储此歌单总共有多少首歌曲
			state.songsTotal = state.songsId.length
		},
		getHotCommentsByPlayLisyId (state, data) {
			// 存储热门评论信息
			state.hotComments = data.hotComments
			// 存储热门评论个数
			state.hotCommentsTotal = data.total
		},
		getCommentsById (state, data) {
			// 存储最新评论信息
			state.comments = data.comments
			// 存储最新评论数量
			state.commentsTotal = data.total
		},
		changePage (state, newPage) {
            // 更改page的值
            state.page = newPage
		},
		getMusicDetailById (state, data) {
			// 存储此次根据songId查询到的歌曲信息
			state.songsList = data.songs
		},
		InitializeData (state) { // 不是第一次进入歌单详情页，需要先清除历史数据
			cleanHistoryData(state)
		}
	},
	actions: {
		async getPlayListDetailByIdAsync ({ commit, dispatch }, { V, id }) {
			// 获取歌单详情
			// 根据id获取歌单详情信息
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/playlist/detail',
				params: {
					id
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '歌单详情数据请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getPlayListDetailById', resData)
			// 通知另一个 Action 根据 songsId 获取歌曲详情
			dispatch('getMusicDetailByIdAsync', V)
		},
		async getHotCommentsByPlayLisyIdAsync ({ commit }, { V, id }) {
			// 根据歌单id获取热门评论
			// 根据id获取热门评论
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/comment/hot',
				params: {
					id,
					type: 2 // 传递类型
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '歌单热门评论数据请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getHotCommentsByPlayLisyId', resData)
		},
		async getCommentsByIdAsync ({ commit, state }, { V, id }) {
			// 根据歌单id获取最新评论
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/comment/playlist',
				params: {
					id,
					type: 2, // 传递类型
					limit: 20, // 一页获取几条数据
					offset: (state.page - 1) * 20 // 用于分页
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '歌单最新评论数据请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getCommentsById', resData)
		},
		async getMusicDetailByIdAsync ({ commit, state }, V) { // 根据歌单id获取歌曲详情
			// 本次要查询的id在数组中的起始位置
			const start = (state.page - 1) * 20
			// 本次要查询的歌曲id的数组
			let searchIds = state.songsId.slice(start, start + 20)
			// 使用 , 拼接数组为字符串
			searchIds = searchIds.join(',')

			// 查询
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/song/detail',
				params: {
					ids: searchIds
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '歌曲信息数据请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getMusicDetailById', resData)
		}
	}
}
