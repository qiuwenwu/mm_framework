require('./lib.js');
const mosca = require('mosca');

/**
 * mqtt 物联网通讯类
 */
class MQTT {
	/**
	 * 构造函数
	 * @param {Object} config 配置参数
	 */
	constructor(config) {
		/**
		 * 配置参数
		 */
		this.config = Object.assign({
			"state": true,
			// mqtt访问端口号
			"socket_port": 1883,
			// websocket 访问端口
			"http_port": 8083,
			// 缓存方式
			"cache": "mongodb",
			redis: {},
			mongodb: {}
		}, config);

		/**
		 * MQTT服务器
		 */
		this.server = null;
		
		this.list = [];
	}
}

/**
 * 初始化
 * @param {Object} config
 */
MQTT.prototype.init = function(config) {
	if (config) {
		this.config = Object.assign(this.config, config);
	}
	var cg = Object.assign({}, this.config);
	var {redis, mongodb} = cg;
	var conf = {
		port: cg.socket_port,
		http: {
			port: cg.http_port
		}
	}
	if (cg.cache === 'redis') {
		if (cg.redis) {
			conf.backend = {
				redis: require('redis'),
				host: redis.host || "localhost",
				port: redis.port || 6379,
				db: redis.db || 12,
				return_buffers: true
			}
		} else {
			conf.backend = {
				redis: require('redis'),
				host: "localhost",
				port: 6379,
				db: 12,
				return_buffers: true
			}
		}
	} else if(cg.cache === 'mongodb' || cg.cache === 'mongo') {
		// conf.backend = {
		// 	url: `mongodb://${mongodb.host}:${mongodb.port}/mqtt`,
		// };
		// conf.backend = {
		// 	// 增加了此项
		// 	type: 'mongo',
		// 	url: `mongodb://${mongodb.host}:${mongodb.port}/mqtt`,
		// 	pubsubCollection: 'ascoltatori',
		// 	factory: cg.cache == "mongodb" ? mosca.persistence.Mongo : mosca.persistence.Redis
		// }
	}
	this.server = new mosca.Server(conf);
	return this;
};

/**
 * 引用
 * @param {Function} 函数
 */
MQTT.prototype.use = function(func) {
	// this.server.use(func);
};

/**
 * 运行主程序
 * @param {String} state 状态
 */
MQTT.prototype.main = function(state) {
	var cg = this.config;
	sr = this.server;

	/**
	 * 对服务器端口进行配置，在此端口进行监听
	 * @param {Object} client 客户端信息
	 */
	sr.on('clientConnected', function(client) {
		//监听连接
		console.log('client connected', client.id);
	});

	var _this = this;
	/**
	 * 监听MQTT主题消息
	 * @param {Object} packet 订阅消息
	 * @param {Object} client 客户端信息
	 */
	sr.on('published', function(packet, client) {
		_this.published(packet, client);
		// 当客户端有连接发布主题消息
		// switch (packet.topic) {
		// 	case 'test':
		// 		console.log('message-publish', packet.payload.toString());
		// 		break;
		// 	case 'other':
		// 		console.log('message-123', packet.payload.toString());
		// 		break;
		// }
	});

	/**
	 * 监听MQTT主题消息
	 * @param {String} topic 订阅主题
	 * @param {Object} client 客户端信息
	 */
	sr.on('subscribed', function(topic, client) {
		_this.subscribed(topic, client);
	});

	/**
	 * 身份验证
	 */
	sr.authenticate = (client, username, password, callback) => {
		this.auth(client, username, password, callback);
	};

	/**
	 * 当服务开启时
	 */
	sr.on('ready', function() {
		// 当服务开启时
		console.info(`MQTT访问 mqtt://127.0.0.1:${cg.socket_port} || ws://127.0.0.1:${cg.http_port}`);
	});
}

/**
 * 收到订阅时
 * @param {String} topic 订阅主题
 * @param {Object} client 客户端信息
 */
MQTT.prototype.subscribed = function(topic, client) {
	// console.log("订阅", topic, client.id);
};

/**
 * 收到推送消息时
 * @param {Object} packet 订阅的消息
 * @param {Object} client 客户端信息
 */
MQTT.prototype.published = function(packet, client) {
	// console.log("发布", packet.topic, packet.payload.toString());
};

/**
 * 身份验证
 * @param {Object} client 客户端
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {Function} callback 回调函数，回调返回true，则表示验证通过。
 */
MQTT.prototype.auth = function(client, username, password, callback) {
	// console.log("连接授权", client.id, username, password ? password.toString() : '');
	var bl = true;
	// 回调第二个参数为true表示验证通过, 为false表示验证失败
	callback(null, bl);
};

/**
 * 运行主程序前
 * @param {String} state 状态
 */
MQTT.prototype.before = async function(state) {
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
MQTT.prototype.after = async function(state) {};

/**
 * 运行
 * @param {String} state 状态
 */
MQTT.prototype.run = async function(state = 'start') {
	await this.before(state);
	await this.main(state);
	await this.after(state);
};

module.exports = MQTT;
