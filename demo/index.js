require('mm_expand');
// 修改程序运行目录
$.runPath = __dirname + $.slash;
var os = require("../index.js");

var config = {};

var os = new os(config);

os.init().run().then((res) => {
	console.log("启动完毕".yellow)
});

os.web.server.use(async(ctx, next) => {
	await next();
	ctx.body = "hello world!";
});