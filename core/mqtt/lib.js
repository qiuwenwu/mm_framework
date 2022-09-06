var urilib = require('url');
var scanSchema = require('jsonschema/lib/scan').scan;
var Validator = require("jsonschema/lib/validator.js");
var helpers = require('jsonschema/lib/helpers');
var SchemaContext = helpers.SchemaContext;
var anonymousBase = '/';

// 重构校验函数，解决error问题
Validator.prototype.validate = function validate(instance, schema, options, ctx) {
	if (!options) {
		options = {};
	}
	// This section indexes subschemas in the provided schema, so they don't need to be added with Validator#addSchema
	// This will work so long as the function at uri.resolve() will resolve a relative URI to a relative URI
	var id = schema.$id || schema.id;
	var base = urilib.resolve(options.base || anonymousBase, id || '');
	if (!ctx) {
		ctx = new SchemaContext(schema, options, [], base, Object.create(this.schemas));
		if (!ctx.schemas[base]) {
			ctx.schemas[base] = schema;
		}
		var found = scanSchema(base, schema);
		for (var n in found.id) {
			var sch = found.id[n];
			ctx.schemas[n] = sch;
		}
	}
	if (options.required && instance === undefined) {
		var result = new ValidatorResult(instance, schema, options, ctx);
		result.addError('is required, but is undefined');
		return result;
	}
	var result = this.validateSchema(instance, schema, options, ctx);
	if (!result) {
		throw new Error('Result undefined');
	} else if (options.throwAll && result.errors.length) {
		throw new ValidatorResultError(result);
	}
	return result;
};