const Koa = require('koa');

/**
 * Web http 通讯类
 */
class WEB {
	/**
	 * 构造函数
	 * @param {Object} config 配置参数
	 */
	constructor(config) {
		/**
		 * 配置参数
		 */
		this.config = Object.assign({
			// 访问地址
			"host": "0.0.0.0",
			// 访问端口号
			"port": 5000,
			// 是否启用websocket
			"socket": true,
			// 是否启用压缩
			"compress": true,
			// 是否启用事件
			"event": true,
			// 是否启用事件
			"log": true,
			// 是否启用静态文件
			"static": true,
			// 静态文件路径
			"static_path": "./static".fullname($.runPath),
			// 代理转发
			"proxy": {}
		}, config);

		/**
		 * web服务器
		 */
		this.server = null;
		this.list = [];
	}
}

/**
 * 初始化
 * @param {Object} config
 */
WEB.prototype.init = function(config) {
	if (config) {
		this.config = Object.assign(this.config, config);
	}
	this.server = new Koa();
	return this;
};

/**
 * 引用
 * @param {Function} 函数
 */
WEB.prototype.use = function(func) {
	this.server.use(func);
};

/**
 * 运行主程序
 * @param {String} state 状态
 */
WEB.prototype.main = function(state) {
	var cg = this.config;
	var host = cg.host;
	if (host == '0.0.0.0') {
		host = '127.0.0.1'
	}
	this.server.listen(cg.port, cg.host, () => {
		console.info(`HTTP访问 http://${host}:${cg.port}`);
	});
};

/**
 * 运行主程序前
 * @param {String} state 状态
 */
WEB.prototype.before = async function(state) {
	var list = this.list;
	for (var i = 0; i < list.length; i++) {
		var o = list[i];
		o.func = require(o.func_file);
		if (o.func) {
			o.func(this.server, this.config);
		}
	}
};

/**
 * 运行主程序后
 * @param {String} state 状态
 */
WEB.prototype.after = async function(state) {};

/**
 * 运行
 * @param {String} state 状态
 */
WEB.prototype.run = async function(state = 'start') {
	await this.before(state);
	await this.main(state);
	await this.after(state);
};

module.exports = WEB;
