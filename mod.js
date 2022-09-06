require('mm_expand');
require('mm_logs');
require('mm_ret');
$.Tpl = require('mm_tpl');
$.mongodb_admin = require("mm_mongodb").mongoDB_admin;
$.redis_admin = require("mm_redis").redis_admin;
$.mysql_admin = require('mm_mysql').mysql_admin;


module.exports = function(cg) {
	var sys = cg.sys;
	// 选择缓存方式,默认memory缓存
	if (sys.cache === 'redis') {
		// 将Api的缓存改为redis方式，如果不用redis可以将以下4行注释掉
		var redis = $.redis_admin('sys');
		redis.setConfig(cg.redis);
		redis.open();
		$.cache = redis;
	} else if (sys.cache === 'cache') {
		// 将Api的缓存改为cache方式, 本地缓存方式
		$.cache_admin = require('mm_cache').cache_admin;
		$.push($.cache, $.cache_admin('sys'), true);
	} else if (sys.cache === 'mongodb') {
		var mongodb = $.mongodb_admin('sys');
		mongodb.setConfig(cg.mongodb);
		mongodb.open();
		$.cache = mongodb;
	}

	$.sql = $.mysql_admin('sys', __dirname);
	$.sql.setConfig(cg.mysql);
	$.sql.open();

	// 创建一个任务管理器
	$.app = $.app_admin('app', '系统应用');
	$.app.update();
	$.app.init();
}
