const mod = require('./mod.js');
const Com = require('./com');
const core = require('./core');

var com = new Com();

/**
 * 超级美眉连接器类
 */
class MM_connector {
	/**
	 * 构造函数
	 * @param {Object} config 配置参数
	 */
	constructor(config) {
		/**
		 * 配置参数
		 */
		this.config = Object.assign({
			sys: {
				// 服务端名称
				name: "mm",
				// 服务端中文名
				title: "超级美眉",
				// 缓存方式
				cache: "memory",
				// 系统使用的语言
				lang: "zh_CN"
			},
			web: {
				state: true,
				// 访问地址
				host: "0.0.0.0",
				// 访问端口号
				port: 8000,
				// 是否启用websocket
				socket: true,
				// 是否启用压缩
				compress: true,
				// 是否启用事件
				event: true,
				// 是否启用日志
				log: true,
				// 是否启用静态文件
				static: true,
				// 静态文件路径
				static_path: "",
				// 代理转发
				proxy: {}
			},
			mqtt: {
				// 状态
				state: true,
				// mqtt访问端口号
				socket_port: 1883,
				// websocket 访问端口
				http_port: 8083,
				// 缓存方式
				cache: "mongodb",
				// redis数据库
				db: 12
			},
			mqtt_client: {
				// 状态
				state: true,
				host: "127.0.0.1",
				port: "8083",
				protocol: "ws",
				clientId: "system",
				username: "admin",
				password: "asd123",
				clean: false
			},
			"redis": {
				// 服务器地址
				"host": "127.0.0.1",
				// 端口号 
				"port": 6379,
				// 密码
				"password": "asd159357",
				// 选用的数据库0-9 
				"database": 0,
				// 键前缀 
				"prefix": "mm_"
			},
			"mongodb": {
				// 服务器地址
				"host": "localhost",
				// 端口号
				"port": 27017,
				// 数据库名
				"database": "mm",
				// 用户名
				"user": "admin",
				// 密码 无则代表连接不需要账号密码
				"password": ""
			}
		}, config);

		this.mqtt = null;
		this.web = null;
	}
}

/**
 * 初始化
 * @param {Object} config 配置参数
 */
MM_connector.prototype.init = function(config) {
	if (config) {
		this.config = Object.assign(this.config, config);
	}
	var cg = this.config;

	// 引用机制库
	com.init();

	// 加载全局功能模块
	mod(cg);
	var {mqtt, web} = core(cg);
	this.mqtt = mqtt;
	this.web = web;
	return this;
};

/**
 * 运行主程序
 * @param {String} state 状态
 */
MM_connector.prototype.main = async function(state) {
	var cg = this.config;
	var web_server = this.web_server;
	var mqtt_server = this.mqtt_server;
	var tip = "启动";
	if (cg.web && cg.web.state) {
		tip += " web";
		if (cg.web.socket) {
			tip += " socket";
		}
		this.web.run();
	}

	if (cg.mqtt && cg.mqtt.state) {
		this.mqtt.run();
		tip += " mqtt";
	}
	
	if(cg.mqtt_client && cg.mqtt_client.state){
		
	}
	$.log.info(tip);
};

/**
 * 运行主程序前
 * @param {String} state 状态
 */
MM_connector.prototype.before = async function(state) {
	$.app.run();
};

/**
 * 运行主程序后
 * @param {String} state 状态
 */
MM_connector.prototype.after = async function(state) {};

/**
 * 运行
 * @param {String} state 状态
 */
MM_connector.prototype.run = async function(state = 'start') {
	await this.before(state);
	await this.main(state);
	await this.after(state);
};


module.exports = MM_connector;
