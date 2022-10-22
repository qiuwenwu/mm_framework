var WEB = require("./web");
var MQTT = require("./mqtt");

module.exports = function(cg) {
	var middleware = new $.Middleware();
	middleware.init();
	// console.log(middleware)
	var mqtt, web;
	if (cg.web && cg.web.state) {
		web = new WEB(cg.web);
		web.list = middleware.list.filter((o) => {
			return !o.mode || o.mode == "web"
		});
		web.init();
	}
	if (cg.mqtt && cg.mqtt.state) {
		mqtt = new MQTT(Object.assign(cg.mqtt, {
			redis: cg.redis,
			mongodb: cg.mongodb
		}));
		mqtt.list = middleware.list.filter((o) => {
			return o.mode == "mqtt"
		});
		mqtt.init();
	}
	return {
		mqtt,
		web
	}
}
