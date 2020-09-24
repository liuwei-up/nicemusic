export default {
    namespaced: true,
    state: {
        // 轮播图 banners
		banners: [],
		// 推荐歌单
		list: [],
		// 最新音乐
		songs: [],
		// 推荐MV
		mvs: []
    },
    mutations: {
        getBanners (state, data) {
			state.banners = data
			console.log('banners', state.banners)
		},
		getRecommend (state, data) {
			// 将推荐歌单列表存起来
			state.list = data.result
		},
		getNewSongs (state, data) {
			// 将最新音乐数据存储
			state.songs = data.result
		},
		getRecommendMvs (state, data) {
			// 把推荐mv数据存储起来
			state.mvs = data.result
		}
    },
    actions: {
        async getBannersAsync (context, V) { // 请求轮播图数据
            const { data: resData } = await V.$http({
				method: 'get',
				url: '/banner',
				params: {
					type: 0
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '轮播图数据请求失败')
			}

			// 成功，通知 对应mutation存储数据
			context.commit('getBanners', resData.banners)
		},
		async getRecommendAsync ({ commit }, V) { // 请求推荐歌单数据
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/personalized',
				params: {
					limit: 10
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '推荐歌单数据请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getRecommend', resData)
		},
		async getNewSongsAsync ({ commit }, V) { // 请求最新音乐数据
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/personalized/newsong'
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '最新音乐数据请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getNewSongs', resData)
		},
		async getRecommendMvsAsync ({ commit }, V) { // 请求最新音乐数据
			const { data: resData } = await V.$http({
				method: 'get',
				url: '/personalized/mv'
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '推荐MV数据请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getRecommendMvs', resData)
		}
    }
}
