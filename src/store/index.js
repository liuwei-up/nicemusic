import Vue from 'vue'
import Vuex from 'vuex'

// 发现音乐页面数据
import discovery from './module/discovery.js'
// 推荐歌单列表数据
import playlists from './module/playlists.js'
// 最新音乐列表数据
import songs from './module/songs.js'
// 最新mv数据
import mvs from './module/mvs.js'
// 搜索页数据
import result from './module/result.js'
// 歌单详情页数据
import playlist from './module/playlist.js'
// MV详情数据页
import mv from './module/mv'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
		musicUrl: '',
		audioRef: {},
		currentMusic: {}
    },
    mutations: {
        getMucicUrlById (state, { data, V }) {
			state.musicUrl = data.url
		},
		saveAudioRef (state, audioRef) {
			state.audioRef = audioRef
		},
		getMusicInfoById (state, { songs }) {
			// 存储当前播放歌曲的信息
			state.currentMusic = songs[0]
		}
    },
    actions: {
        async getMucicUrlByIdAsync ({ commit, dispatch }, { V, id }) {
			// 调用接口获取当前播放歌曲信息
			dispatch('getMusicInfoByIdAsync', { V, id })

            // 根据id使用axios调用接口发起ajax请求
            const { data: resData } = await V.$http({
				method: 'get',
				url: '/song/url',
				params: {
					id
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '歌曲地址请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getMucicUrlById', { data: resData.data[0], V })
		},
		async getMusicInfoByIdAsync ({ commit, state }, { V, id }) {
			// 根据id使用axios调用接口发起ajax请求
            const { data: resData } = await V.$http({
				method: 'get',
				url: '/song/detail',
				params: {
					ids: id
				}
			})
			// 判断请求是否成功
			if (resData.code !== 200) {
				return V.$message('error', '当前歌曲信息请求失败')
			}
			// 成功，通知 对应mutation存储数据
			commit('getMusicInfoById', resData)
			// 弹框
			// 先关掉全部弹窗
			V.$notify.closeAll()
			// 弹出当前播放歌曲提示框
			V.$notify({
				title: '当前播放歌曲：',
				duration: 0,
				dangerouslyUseHTMLString: true,
				position: 'bottom-right',
				offset: 60,
				message: `
				<div class="current-music-card">
					<img class="cover" src="${state.currentMusic.al.picUrl}"></img>
					<h3 class="music-name">${state.currentMusic.name}</h3>
				</div>
				`
			})
		}
    },
	modules: {
        discovery,
        playlists,
        songs,
		mvs,
		result,
		playlist,
		mv
	}
})
