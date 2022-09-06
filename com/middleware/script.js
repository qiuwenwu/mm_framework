/**
 * 中间件
 * @param {Object} server 服务
 * @param {Object} config 配置参数
 */
module.exports = function(server, config) {
	console.log("中间件", server, config);
	return server;
};
