// Jonathan Eiten - mojomods.js
// Adds simple modularization to Backbone

(function (api) {

	var app = {

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

	api.App = {

		// Gather all module getters but don't execute them yet
		module: function(name, get) {
			$(function() {
				var module = app.util.deref(app, name);
				_.extend(module, get(app, module));
			});
		},

		// Execute each module in order, then start the main module
		start: function(main) {
			$(function() {
				main(app);
			});
		}
	};

})(Backbone);
