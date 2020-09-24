const cleanHistoryData = (state) => {
	for (const k in state) {
		// 判断属性值的类型，并清空其值
		const result = Object.prototype.toString.call(state[k])
		if (result === '[object Number]') {
			if (k === 'page') {
				state[k] = 1
			} else {
				// 数值型初始化为0
				state[k] = 0
			}
		} else if (result === '[object String]') {
			// 字符串格式化为空字符串
			state[k] = ''
		} else if (result === '[object Array]') {
			// 数组 => 空数组
			state[k] = []
		} else if (result === '[object Object]') {
			// 如果对象键名为 continue 就直接进入下一次循环
			if (k === 'query' && typeof state[k].type === 'number') {
				state[k].type = 1
				continue
			}
			// 对象 => 递归调用本身
			cleanHistoryData(state[k])
		}
	}
}

export default cleanHistoryData
