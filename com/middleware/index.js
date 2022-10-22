class Middleware {
	/**
	 * 构造函数
	 * @param {Object} config 配置参数
	 */
	constructor(config) {
		// 中间件列表
		this.list = [];

		this.config = Object.assign({
			path: "./middleware".fullname($.runPath),
			file: "middleware.json",
			mode: "web"
		}, config);
	}
}


/**
 * 新建脚本
 * @param {String} 文件
 */
Middleware.prototype.new_script = function(file) {
	var fl = __dirname + "/script.js";
	if (fl.hasFile()) {
		var text = fl.loadText();
		if (text) {
			var l = $.slash;
			if (file.indexOf('middleware' + l) !== -1) {
				var name = file.between('middleware' + l, l);
				text = text.replaceAll("{0}", name);
			}
			file.saveText(text);
		}
	}
};

/**
 * 新建配置
 * @param {String} 文件
 */
Middleware.prototype.new_config = function(file) {
	var fl = __dirname + "/config.tpl.json";
	if (fl.hasFile()) {
		var text = fl.loadText();
		if (text) {
			var l = $.slash;
			if (file.indexOf('middleware' + l) !== -1) {
				var name = file.between('middleware' + l, l);
				text = text.replaceAll("{0}", name);
			}
			file.saveText(text);
		}
	}
};

/**
 * 加载配置
 * @param {String} file 配置文件路径
 */
Middleware.prototype.load = function(file) {
	var f = this.config.file;
	var config = file.loadJson();
	if (config) {
		var cg = this.list.getObj({
			name: config.name
		});
		if (cg) {
			$.push(cg, config, true);
		} else {
			cg = {
				func_file: file.replace(f, 'index.js')
			}
			$.push(cg, config, true);
			this.list.push(cg);
		}
	} else {
		this.new_config(file);
	}
	var script_file = file.replace('middleware.json', 'index.js');
	if (!script_file.hasFile()) {
		this.new_script(script_file);
	}
};

/**
 * 遍历加载配置
 * @param {Object} path
 */
Middleware.prototype.each_load = function(path) {
	if (path.hasDir()) {
		var dirs = $.dir.getAll(path);	
		// 遍历目录路径
		var file = this.config.file;
		dirs.map((d) => {
			this.load(d + file);
		});
	}
};

/**
 * 排序
 */
Middleware.prototype.sort = function() {
	return this.list.sortBy('asc', 'sort');
};

/**
 * 遍历加载配置
 */
Middleware.prototype.init = function(path) {
	this.each_load("../../middleware/".fullname(__dirname));
	if (path) {
		this.each_load(path);
	}
	this.each_load(this.config.path);
	var p = "./middleware".fullname($.runPath);
	if (this.config.path !== p) {
		this.each_load(p);
	}
	this.sort();
};

exports.Middleware = Middleware;
