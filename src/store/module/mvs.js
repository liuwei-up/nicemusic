export default {
	namespaced: true,
    state: {
		page: 1, // 当前页码值
		query: { // 查询参数
			area: '全部',
			type: '全部',
			order: '上升最快',
			limit: 12
		},
		mvsList: [], // 存储 MV 列表数据
		total: 0
    },
    mutations: {
		getMvs (state, { data, count }) {
			// 存储数据
			state.mvsList = data
			// 判断数据中是否有count
			if (count) {
				// 存储总数据条数
				state.total = count
			}
		},
		changeQuery (state, { name, data }) {
			// 更新query
			state.query[name] = data
		},
		changePage (state, newPage) {
            // 更改page的值
            state.page = newPage
        }
	},
	actions: {
		async getMvsAsync ({ commit, state }, V) { // 根据查询参数获取mv列表
			const { data: resData } = await V.$http({
				method: 'get',
                url: '/mv/all',
                params: {
					...state.query,
					offset: (state.page - 1) * 12
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', 'MV列表数据请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getMvs', resData)
		}
	}
}
