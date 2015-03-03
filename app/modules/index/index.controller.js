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
	function Index(directive, DirectiveFactory, $timeout) {
		/*jshint validthis: true */
		var vm = this;

		vm.click = click;

		vm.parentValue = 'Parent value';

		vm.directives = [];

		activate();

		function activate() {
		};

		function click($event) {
			vm.directiveInstance = new directive.open({
				//template: '<h1>Parent Controller Value: {{appended.items}}</h1>',
				templateUrl: 'modules/index/my-directive.template.html',
				controller: 'Child as appended',
				//backdrop: 'static',
				//closeOnEscape: false,
				directiveClass: 'reveal-modal',
				resolve: {
					items: function () {
						return vm.parentValue;
					}
				}
			});
			vm.directives.push(vm.directiveInstance);

			vm.directiveInstance.result.then(function(result) {
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
			DirectiveFactory.close(vm.directiveInstance, false);
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

		directiveInstance.opened.then(function() {
			console.log('User assigned controller, after open');
		});

	};

})();
