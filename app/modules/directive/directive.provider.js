(function() {
	'use strict';

	/**
	 * @ngdoc service
	 * @name ncAngularApp.directive
	 * @description
	 * # directive
	 * Provider in the ncAngularApp.
	 */
	angular
		.module('directive')
		.provider('directive', Directive);

	/* @ngInject */
	function Directive() {

		// Directive defaults
		this.config = {
			closeOnEscape: true,
			backdrop: true
		};

		// Public API for overwriting default configuration
		this.configure = function(config) {
			this.config = config || this.config;
		};

		/* @ngInject */
		this.$get = function($injector, $rootScope, $q, $http, $templateCache, $controller, DirectiveFactory) {

			var _this = this;

			// I am the returned instance
			var directive = {};

			/*
				Private methods
			 */

			// I get the template markup
			function _getTemplatePromise(options) {

				// If a template is cached return this one, other wise request it
				return options.template ? $q.when(options.template) : getTemplate(options.templateUrl);

				function getTemplate(template) {
					return $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
						{
							cache: $templateCache
						}
					).then(function(result) {
						return result.data;
					});
				}
			}

			// Forklar...
			function _getResolvePromises(resolves) {

				//
				var promisesArray = [];

				angular.forEach(resolves, function(resolve) {
					if(angular.isFunction(resolve) || angular.isArray(resolve)) {
						promisesArray.push($q.when($injector.invoke(resolve)));
					}
				});
				return promisesArray;
			}

			/*
				Public Methods
			 */

			// I open a modal
			// TODO: More description
			directive.open = function(directiveOptions) {

				var directiveResultDeferred = $q.defer();
				var directiveOpenedDeferred = $q.defer();

				var directiveInstance = {
					result: directiveResultDeferred.promise,
					opened: directiveOpenedDeferred.promise,
					close: function(result) {
						DirectiveFactory.close(directiveInstance, result);
					},
					dismiss: function(result) {
						DirectiveFactory.dismiss(directiveInstance, result);
					}
				};

				// Merge and clean up options
				directiveOptions = angular.extend({}, _this.config, directiveOptions);

				// Verify options
				if (!directiveOptions.template && !directiveOptions.templateUrl) {
					throw new Error('One of template or templateUrl options is required.');
				}

				var templateAndResolvePromise =
					$q.all([_getTemplatePromise(directiveOptions)]
						.concat(_getResolvePromises(directiveOptions.resolve)));

				templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

					// Create a new scope
					var directiveScope = (directiveOptions.scope || $rootScope).$new();

					directiveScope.close = directiveInstance.close;
					directiveScope.dismiss = directiveInstance.dismiss;

					var controllerInstance, controllerLocals = {};

					var resolveIterations = 1;

					// Wire up controllers
					if(directiveOptions.controller) {
						// Bind to controller $scope
						controllerLocals.$scope = directiveScope;

						// Bind instance to controller
						controllerLocals.directiveInstance = directiveInstance;

						// TODO: https://gist.github.com/vojtajina/1649788
						//
						angular.forEach(directiveOptions.resolve, function(value, key) {
							controllerLocals[key] = tplAndVars[resolveIterations++];
						});

						// Create an angular controller
						controllerInstance = $controller(directiveOptions.controller, controllerLocals);

						// Support controllerAs <3
						if(directiveOptions.controllerAs) {
							directiveScope[directiveOptions.controllerAs] = controllerInstance;
						}
					}

					// Open a new DirectiveFactory directive instance
					DirectiveFactory.open(directiveInstance, {
						scope: directiveScope,
						deferred: directiveResultDeferred,
						content: tplAndVars[0],
						backdrop: directiveOptions.backdrop,
						closeOnEscape: directiveOptions.closeOnEscape,
						directiveClass: directiveOptions.directiveClass,
						directiveTemplateUrl: directiveOptions.directiveTemplateUrl
					});
				}, function resolveError(reason) {
					directiveResultDeferred.reject(reason);
				});

				templateAndResolvePromise.then(function() {
					directiveOpenedDeferred.resolve(true);
				}, function() {
					directiveOpenedDeferred.reject(false);
				});

				return directiveInstance;

			};

			return directive;
		};

	};

})();
