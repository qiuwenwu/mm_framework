const Index = require('mm_machine').Index;
const MQTT_client = require('../../core/mqtt');
const Drive = require('./drive');

/**
 * MQTT通讯类
 * @extends {Index}
 * @class
 */
class MQTT extends Index {
	/**
	 * 构造函数
	 * @param {Object} scope 作用域
	 * @param {String} title 标题
	 * @constructor
	 */
	constructor(scope, title) {
		super(scope, __dirname);
		this.Drive = Drive;
		this.type = "mqtt";
		this.dict = {};
		this.title = title;

		this.config = {
			host: "127.0.0.1",
			port: "1883",
			protocol: "mqtt",
			clientId: "test123",
			username: "admin",
			password: "asd123",
			clean: false
		}
		this.client = null;
	}
}

/**
 * 主题匹配
 * @param {String} topic 接收到的主题
 * @param {String} top 匹配用的主题
 * @@return {Boolean} 返回匹配结果，正确返回true，错误返回false
 */
MQTT.prototype.match = function(topic, top) {
	if (topic === top) {
		return true;
	}
	var str = "^" + top.replace("#", ".*").replace("+", "~~~").replace("~~~", "[a-zA-Z0-9_]+").replace("$", "~~~")
		.replace("~~~", "\\$");
	var s = str.substring(str.length - 1, str.length);
	if (s !== "#") {
		str += "$";
	}
	var mh = new RegExp(str);
	return mh.test(topic);
}

/**
 * 初始化
 */
MQTT.prototype.init_after = function() {
	this.client.on("message", (topic, msg) => {
		var db = $.sql.db();
		var list = this.list;
		for (var i = 0, o; o = list[i++];) {
			if (this.match(topic, o.config.topic)) {
				o.run(topic, msg);
			}
		}
	});
}

/**
 * 处理mqtt请求
 * @param {Object} conn 通讯连接器
 */
MQTT.prototype.run = async function(conn) {
	var list = this.list;
	for (var i = 0, o; o = list[i++];) {
		client.subscribe(o.config.topic);
	}
};

/**
 * 加载插件
 * @param {String} path 检索路径
 * @param {Boolean} isApp 是否APP
 */
MQTT.prototype.load = function(path) {
	if (!path) {
		path = "/mqtt/";
	}
	// 获取所有应用路径
	var list_scope = $.dir.getAll(path, "mqtt");

	// 遍历目录路径
	var _this = this;
	list_scope.map(async function(f) {
		var list_file = $.file.getAll(f, "*" + _this.type + ".json");
		list_file.map(async (file) => {
			var dir = file.dirname();
			if (file.hasFile()) {
				var obj = new Drive(dir);
				obj.load(file);
				if (obj.config.name) {
					_this.list.push(obj);
				}
			}
		});
	});
}

exports.MQTT = MQTT;


/**
 * 创建全局管理器
 */
if (!$.pool.mqtt) {
	$.pool.mqtt = {};
}

/**
 * mqtt管理器, 用于管理插件
 * @param {string} scope 作用域
 * @param {string} title 标题
 * @return {Object} 返回一个缓存类
 */
function mqtt_admin(scope, title) {
	if (!scope) {
		scope = $.val.scope + '';
	}
	var obj = $.pool.mqtt[scope];
	if (!obj) {
		$.pool.mqtt[scope] = new App(scope, title);
		obj = $.pool.mqtt[scope];
	}
	return obj;
}

/**
 * @module 导出mqtt管理器
 */
exports.mqtt_admin = mqtt_admin;
