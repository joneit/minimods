// Jonathan Eiten - 1stdibs quiz - minimods.js
// Adds simple modularization to Backbone

(function (api) {

	var modules = {

		util: {
			// `util.defer` returns a nested object.
			// Given an object and a dot chain in a string such as 'x.y.z', returns obj[x][y][z].
			// If x and y do not exist they are created (as empty plain objects).
			// If z does not exist it is set to `defaultValue` if given or empty plain object if not.
			// If `save` is truthy, saves `defaultValue` into the dereferenced property (and returns it).
			deref: function(obj, dotChain, defaultValue, save) {
				var nodes = dotChain.split('.'),
					nodesRemaining = nodes.length;

				if (arguments.length < 3) {
					++nodesRemaining;
				}

				return _(nodes).reduce(function(memo, nodeName) {
					--nodesRemaining;

					if (!(nodeName in memo) || save && !nodesRemaining) {
						memo[nodeName] = nodesRemaining ? {} : defaultValue;
					}

					return memo[nodeName];
				}, obj);
			}
		}

	};

	var moduleSpecs = [];

	var app = {

		// Gather all module getters but don't execute them yet
		module: function(name, get) {
			moduleSpecs.push({ name: name, get: get });
		},

		// Execute each module in order, then start the main module
		start: function(main) {
			$(function() {
				_(moduleSpecs).each(function(moduleSpec, index) {
					var module = modules.util.deref(modules, moduleSpec.name);
					_.extend(module, moduleSpec.get(modules, module));
 					delete moduleSpecs[index]; // free up memory as we go
				});

				moduleSpecs = undefined;
			
				main(modules);
			});
		}
	};

	// Interface
	api.App = app;

})(Backbone);
