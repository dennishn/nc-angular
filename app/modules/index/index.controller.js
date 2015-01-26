(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name ncAngularApp.controller:IndexCtrl
	 * @description
	 * # IndexCtrl
	 * Controller of the ncAngularApp
	 */
	angular
		.module('ncAngularApp')
		.controller('Index', Index);

	/* @ngInject */
	function Index(directive) {
		/*jshint validthis: true */
		var vm = this;

		vm.parentValue = 'Parent value';

		activate();

		function activate() {
			console.log('controller')
		};

		vm.click = function() {
			var directiveInstance = directive.open({
				template: '<h1>Hehehe</h1>',
				controller: 'Child',
				controllerAs: 'appended',
				resolve: {
					items: function () {
						return vm.parentValue;
					}
				}
			})
		}
	};

})();

(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name ncAngularApp.controller:IndexCtrl
	 * @description
	 * # IndexCtrl
	 * Controller of the ncAngularApp
	 */
	angular
		.module('ncAngularApp')
		.controller('Child', Child);

	/* @ngInject */
	function Child(directiveInstance, items) {
		/*jshint validthis: true */
		var vm = this;

		activate();

		function activate() {
			console.log('Child', directiveInstance, items);
		};

	};

})();
