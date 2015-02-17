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
	function Index(directive, $timeout) {
		/*jshint validthis: true */
		var vm = this;

		vm.click = click;

		vm.parentValue = 'Parent value';

		vm.directives = [];

		activate();

		function activate() {
		};

		function click() {
			var directiveInstance = new directive.open({
				template: '<h1>Parent Controller Value: {{appended.items}}</h1>',
				controller: 'Child as appended',
				resolve: {
					items: function () {
						return vm.parentValue;
					}
				}
			});
			vm.directives.push(directiveInstance);

			directiveInstance.result.then(function(result) {
				console.info('directive closed: ', result);
				vm.directives.pop();
			}, function(error) {
				console.warn('directive dismissed: ', error);
			});
		}

		vm.closeFromOutside = function() {
			var index = vm.directives.length > 1 ? vm.directives.length -1 : 0;
			console.log(vm.directives, index);
			vm.directives[index].close(false);
		};
		vm.dismissFromOutside = function() {
			vm.directiveInstance.dismiss(false);
		};

	}

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

		vm.items = items;

		activate();

		function activate() {
			//console.log('Child', directiveInstance, items);
		};

		/*$timeout(function() {
			directiveInstance.close('closed');
		}, 1000);*/

	};

})();
