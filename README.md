# mojotopo

Mojotopo ("mojotouch repo") is a library of javascript files.

## mojomods.js
A simple modularization/namespacing system for Javascript apps, similar to Marionette modules but simpler in that there is only a single app (entry/start point).

Mojomods adds an `App` object to Backbone. If you'd rather add it to some other object (such as the global object), change the `Backbone` reference on the last line to your object.

### Usage

1. Include this javascript file before referencing its methods.
2. Call `.module()` repeatedly to define modules.
3. Call `.start()` to execute a module anonymously.

#### `.module()`

Modules are defined by associating a namespace with a function, for example:

```javascript
Backbone.App.module('form.config', function(app, mod) {
	mod.fetch: function(url) { ... };
});

Backbone.App.module('form.config', function(app, mod) {
	function save(url) { ... }
	
	return {
		save: save
	};
});

Backbone.App.module('form', function(app, mod) {
	return {
		render: function() {
			mod.config.fetch('base');
			...
		}
	};
});
```

`.module()` defines objects to add to the given namespace. Objects may be added explicity, using `mod` as shown in the first declaration above. Alternatively (or additionally), your function may return an object with properties that will then be added to the module implicitly. This example defines both a `.fetch()` method and a `.save()` method in the `form.config` module; and a `render()` method in the `form` namespace.  These can be referenced from any other module through `app` (*e.g.,* `app.form.config.save()`); or from within a dinfining function through `mod` (*e.g.,* `mod.save()`).

Note that the namespace hierarchy is implicitly created for you; it is not necessary to create the listed objects before referencing them.

#### `.start()`

Use `.start()` to execute your main module anonymously. The following call should follow all of its dependencies (*i.e.,* all it's required modules' definitions):

```javascript
Backbone.App.start(function(app) {
	app.form.render();
});
```

### Dependencies

I'm using some **jQuery** and some **Underscore** because I wrote this for use with **Backbone.** However, these dependencies are easily removed. Specifically:
* Replace `$(handler)`, a.k.a. [`jQuery(handler).ready()`](https://api.jquery.com/ready/), with (perhaps) [`window.onload()`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload).
* Replace [`_.extend(a, b)`](http://underscorejs.org/#extend) with a simple [`for...in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) loop:

```javascript
for (var prop in b)
	if (b.hasOwnProperty(prop))
		a[prop] = b[prop];
```
