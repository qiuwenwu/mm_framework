const Index = require('mm_machine').Index;
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
	}
}

/**
 * 处理mqtt请求
 * @param {Object} ctx 请求上下文
 * @param {Function} next 跳过当前, 然后继续执行函数
 */
MQTT.prototype.run = async function(ctx, next) {
	await next();
	var list = this.list;
	const path = ctx.path.toLocaleLowerCase();
	for (var i = 0, o; o = list[i++];) {
		if (path === o.config.path) {
			o.add(ctx);
			break;
		}
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