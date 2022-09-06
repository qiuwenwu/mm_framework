const {
	proxy,
	proxyTo,
	isMatch
} = require('mm_koa_proxy');

/**
 * 应用
 * @param {Object} server 服务
 * @param {Object} config 配置参数
 */
module.exports = function(server, config) {
	if (config && config.proxy) {
		var options = config.proxy;
		if (options.targets) {
			server.use(proxy(options, function(op, ctx, next) {
				if (ctx.session && ctx.session.user) {
					ctx.request.header['user_id'] = ctx.session.user.user_id;
				}
			}));
		}
	}
	return server;
};
