import cleanHistoryData from '../../plugins/cleanHistoryData.js'
export default {
	namespaced: true,
	state: {
		page: 1,
		query: {
			// 查询参数
			type: 1
		},
		songList: [], // 保存查询到的歌曲
		playList: [], // 保存歌单的字段
		mvList: [], // 保存MV的字段
		total: 0 // 保存搜索结果总数
	},
	mutations: {
		getDataByKeywords (state, { data, V }) {
			const { result } = data
			if (state.query.type === 1) {
				// 歌曲
				// 给搜索结果重新赋值前，先清空数组
				state.songList = []
				// 接口有时候会有报错不知道为什么
				try {
					// 保存歌曲列表
					state.songList = result.songs
				} catch (error) {
					return V.$message('error', '出错了，建议换首歌试一下呢')
				}
				// 保存歌曲总数
				state.total = result.songCount
			} else if (state.query.type === 1000) {
				// 歌单
				state.playList = []

				state.playList = result.playlists
				// 保存总数
				state.total = result.playlistCount
			} else if (state.query.type === 1004) {
				// MV
				// 保存MV列表
				state.mvList = result.mvs
				// 保存MV总条数
				state.total = result.mvCount
			}
		},
		changeActiveTab (state, activeName) {
			if (activeName === 'songs') {
				state.query.type = 1
			} else if (activeName === 'lists') {
				state.query.type = 1000
			} else if (activeName === 'mvs') {
				state.query.type = 1004
			}
		},
		changePage (state, newPage) {
			state.page = newPage
		},
		InitializeData (state) { // 不是第一次进入歌单详情页，需要先清除历史数据
			cleanHistoryData(state)
		}
	},
	actions: {
		async getDataByKeywordsAsync ({ commit, state }, { keywords, V }) {
			let limit
			if (state.query.type === 1) {
				limit = 15
			} else if (state.query.type === 1000) {
				limit = 8
			} else {
				limit = 8
			}
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/search',
				params: {
					keywords,
					...state.query,
					limit,
					offset: (state.page - 1) * limit
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '搜索结果请求失败')
			}
			console.log(resData)

			// 成功，通知 对应mutation存储数据
			commit('getDataByKeywords', { data: resData, V })
		}
	}
}
