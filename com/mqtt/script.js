/**
 * 主函数, 用于处理订阅内容
 * @param {String} topic 订阅的主题
 * @param {Object} msg 消息
 * @return {Object} 返回执行结果
 */
exports.main = async function(topic, msg) {
	$.log.debug('收到消息'topic, msg);
};

/**
 * 初始化函数, 用于定义开放给前端的函数
 */
exports.init = async function() {
	var m = this.methods;

	/**
	 * 获取所有方法
	 * @param {Object} params 参数
	 * @param {Object} ws Websocket服务
	 */
	m.get_method = function(params, ws) {
		return Object.keys(m);
	};

	/**
	 * @param {Object} params 参数
	 * @param {Object} ws Websocket服务
	 */
	m.test = function(params, ws) {
		return "你好"
	};
};
