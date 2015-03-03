(function() {
	'use strict';

	angular
		.module('directive')
	  	.animation('.directive', directiveAnimation);

	/* @ngInject */
	function directiveAnimation(Lifo) {

		var lifoStack = Lifo.createNew();

		var className = 'directive';

		function _getPrev(element) {

			var prev;

			if(element.prev().hasClass(className)) {
				prev = element.prev();
			}

			return prev;
		}

		function _getAll(element) {

			var parent = element.parent();

			return parent.find('.' + className);



		}

		function _moveY(value) {

			return 0-value;

		}
		function _moveZ(value) {

			return 0-value;

		}

		return {
			beforeEnter: function(element, done) {

				var previousElement = _getPrev(element);
				var elements = _getAll(element);
				var lifos = lifoStack.keys();

				console.log(elements);

				//if(previousElement) {

					for(var i = 0; i < lifoStack.length(); i++) {

						console.log(lifoStack.get(lifos[i])	)

						/*TweenMax.to(lifoStack.get(i), 0.6, {
							y: _moveY(i) + '%',
							onComplete: function() {

							}
						});*/

					}

					/*TweenMax.to(previousElement, 0.6, {
						y: _moveY(lifoStack.length()) + '%',
						z: _moveZ(lifoStack.length()) + '%',
						onComplete: function() {

						}
					});*/

				//}

				// Before we trigger the entrance animation, but after the directive is added to the DOM.
				TweenMax.set(element, {
					opacity: 0,
					y: 0,
					// Foundation Hack, bare for debug ui
					display: 'block',
					visibility: 'visible',
					onComplete: done
				});
			},
			enter: function(element, done) {

				// Triggered when done callback is fired from beforeEnter
				TweenMax.to(element, 0.6, {
					opacity: 1,
					onComplete: function() {
						lifoStack.add(element, {});
						done();
					}
				});
			},
			leave: function(element, done) {

				// Triggered when done callback is fired from beforeLeave (NYI)
				TweenMax.to(element, 1, {
					opacity: 0,
					onComplete: function() {
						lifoStack.remove(element);
						done();
					}
				});
			}
		};
	}
})();
