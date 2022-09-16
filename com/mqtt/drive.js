const Item = require('mm_machine').Item;

/**
 * mqtt驱动类
 * @extends {Item}
 * @class
 */
class Drive extends Item {
	/**
	 * 构造函数
	 * @param {String} dir 当前目录
	 * @constructor
	 */
	constructor(dir) {
		super(dir, __dirname);
		this.default_file = "./mqtt.json";

		/* 通用项 */
		/**
		 * 配置参数
		 */
		this.config = {
			// 名称, 由中英文和下“_”组成, 用于修改或卸载 例如: demo
			"name": "",
			// 状态 0未启用，1启用
			"state": 1,
			// 订阅的主题
			"topic": "",
			// mqtt 服务标题
			"title": "",
			// mqtt 服务介绍
			"description": "",
			// 调用的脚本
			"func_file": "./index.js"
		};

		// 开放给前端调用的函数
		this.methods = Object.assign({}, $.methods);
	}
}

/**
 * 新建脚本
 * @param {String} 文件
 */
Drive.prototype.new_script = function(file) {
	var fl = __dirname + "/script.js";
	if (fl.hasFile()) {
		var text = fl.loadText();
		if (text) {
			var l = $.slash;
			if (file.indexOf('mqtt' + l) !== -1) {
				var name = file.between('mqtt' + l, l);
				text = text.replaceAll("{0}", name);
			}
			file.saveText(text);
		}
	}
};

/**
 * 配置示例
 * @param {String} 文件
 */
Drive.prototype.model = function() {
	// 单层匹配订阅,用于订阅所有客户端要接收的数据  格式：$SYS/<代理服务器>/service/业务/+
	// "topic": "$SYS/mm/service/user/+"
	// 通配方式订阅,用于订阅仅该设备或该客户端要订阅的数据  格式：$SYS/<代理服务器>/service/appid/#
	// "topic": "$SYS/mm/service/idd6877e1561/#"
	// 完全匹配订阅，用于特定的业务订阅，业务压力最小，建议尽可能使用完全匹配
	// "topic": "$SYS/mm/service/state"
	return {
		// 名称, 由中英文和下“_”组成, 用于修改或卸载 例如: demo
		"name": "demo",
		// 状态 0未启用，1启用
		"state": 1,
		// 订阅的主题
		"topic": "$SYS/mm/service/user/state",
		// mqtt 服务标题
		"title": "用户状态",
		// mqtt 服务介绍
		"description": "用于用户登录状态改变时，如1登录、2隐身、3高调、4离线",
		// 调用的脚本
		"func_file": "./index.js"
	}
}

/**
 * 新建配置
 * @param {String} 文件
 */
Drive.prototype.new_config = function(file) {
	var fl = __dirname + "/config.tpl.json";
	if (fl.hasFile()) {
		var text = fl.loadText();
		if (text) {
			var l = $.slash;
			if (file.indexOf('mqtt' + l) !== -1) {
				var name = file.between('mqtt' + l, l);
				text = text.replaceAll("{0}", name);
			}
			file.saveText(text);
		}
	}
};

/**
 * 发送消息 —— 会发送给所有目标
 * @param {String} topic 推送的主题
 * @param {Object} msg 消息正文
 */
Drive.prototype.send = async function(topic, msg) {

};

/**
 * 接收订阅消息
 * @param {String} topic 推送的主题
 * @param {Object} msg 消息正文
 */
Drive.prototype.main = async function(topic, msg) {
	return null;
};

/**
 * 初始化函数, 用于定义开放给前端的函数
 */
Drive.prototype.init = async function init() {

};

/**
 * 加载完成时
 */
Drive.prototype.load_after = function() {
	this.init();
};

module.exports = Drive;
