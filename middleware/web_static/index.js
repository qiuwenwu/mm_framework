const statics = require('mm_statics');

/**
 * 应用
 * @param {Object} server 服务
 * @param {Object} config 配置参数
 */
module.exports = function(server, config) {
	// 处理静态文件
	if (config.static) {
		server.use(statics(
			config.static_path, {
				maxAge: 60 * 60 * 24 * 7,
				gzip: true,
				brotli: true
			}));
		// 使用多路径静态文件处理器
		if ($.Static) {
			const Static = $.Static;
			$.static = new Static();
			$.static.update();
			server.use($.static.run);
		}
	}
	return server;
};
