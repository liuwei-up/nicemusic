export default {
    namespaced: true,
    state: {
        page: 1, // 页码
        tag: '全部', // 当前选择的分类
        total: 0, // 数据总条数
        topList: {}, // 顶部精品歌单
        list: [] // 歌单列表
    },
    mutations: {
        getTopPlayList (state, data) {
            // 存储顶部歌单信息
            state.topList = data.playlists[0]
        },
        getPlayLists (state, data) {
            // 存储歌单列表数据
            state.list = data.playlists
            // 存储总数据条数
            state.total = data.total
        },
        changeTag (state, newTag) {
            // 更改Tag的值
            state.tag = newTag
        },
        changePage (state, newPage) {
            // 更改page的值
            state.page = newPage
        }
    },
    actions: {
        async getTopPlayListAsync ({ commit, state }, V) { // 获取顶部精品歌单
            const { data: resData } = await V.$http({
				method: 'get',
                url: '/top/playlist/highquality',
                params: {
                    limit: 1,
                    cat: state.tag
                }
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '顶部精品歌单请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getTopPlayList', resData)
        },
        async getPlayListsAsync ({ commit, state }, V) { // 获取歌单列表
            const { data: resData } = await V.$http({
				method: 'get',
                url: '/top/playlist',
                params: {
                    limit: 10,
                    offset: (state.page - 1) * 10,
                    cat: state.tag
                }
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '歌单列表请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getPlayLists', resData)
        }
    }
}
