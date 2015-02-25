(function() {
	'use strict';

	angular
		.module('backdrop')
		.directive('backdrop', backdrop);

	/* @ngInject */
	function backdrop(DirectiveFactory, $document, $animate) {
		/**
		 * @ngdoc directive
		 * @name ncAngularApp.directive:backdrop
		 * @description
		 * # backdrop
		 */
		var directive = {
			templateUrl: 'modules/backdrop/backdrop.template.html',
			link: link,
			replace: true,
			restrict: 'EA'
		};

		return directive;

		function _shouldClose(directive, event) {
			return directive &&
				directive.value.backdrop &&
				directive.value.backdrop != 'static' &&
				(event.target === event.currentTarget);
		}

		function link(scope, element, attrs){

			scope.close = close;

			var body = $document.find('body').eq(0);

			$animate.enter(element, body, angular.element(body[0].lastChild)).then(function() {

			});

			function close($event) {

				//get top directive
				var directive = DirectiveFactory.getTop();

				console.log('should it close? ', _shouldClose(directive, $event));

				if(_shouldClose(directive, $event)) {

					console.log('it should');

					$event.preventDefault();
					$event.stopPropagation();

					DirectiveFactory.dismiss(directive.key, 'backdrop click');

				}

			}
		};
	};
})();
