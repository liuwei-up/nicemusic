export default {
    namespaced: true,
    state: {
        // 最新的歌曲列表
        songsList: [],
        // 存储当前选择的地区
        tag: 0
    },
    mutations: {
        getNewSongsList (state, data) {
            state.songsList = data.data
            console.log(state.songsList)
        },
        changeTag (state, newTag) { // 根据传过来的数据修改tag
            state.tag = newTag
        }
    },
    actions: {
        async getNewSongsListAsync ({ commit, state }, V) {
            const { data: resData } = await V.$http({
				method: 'get',
                url: '/top/song',
                params: {
                    type: state.tag
                }
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '最新音乐数据请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getNewSongsList', resData)
        }
    }
}
