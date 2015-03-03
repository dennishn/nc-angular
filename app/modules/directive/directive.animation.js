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

		function _getNext(element) {

			var next;

			if(element.next().hasClass(className)) {
				next = element.next();
			}

			return next;
		}

		function _getAll(element) {

			var parent = element.parent();

			return parent.children('.' + className);

		}

		return {
			beforeEnter: function(element, done) {



				// Before we trigger the entrance animation, but after the directive is added to the DOM.
				TweenMax.set(element, {
					opacity: 0,
					y: 40,
					// Foundation Hack, bare for debug ui
					display: 'block',
					visibility: 'visible',
					onComplete: done
				});
			},
			enter: function(element, done) {

				var previousElement = _getPrev(element);
				var elements = _getAll(element);

				if(previousElement) {

					var len = (elements.length == 0) ? elements.length : elements.length-1;

					for(var i = 0; i < len; i++) {

						var multiplierA = -(elements.length - i)*20;
						var multiplierB = 1 - ((elements.length - i)/10);

						multiplierA = (multiplierA <= -100) ? -100 : multiplierA;
						multiplierB = (multiplierB <= 0.1) ? 0.1 : multiplierB;

						TweenMax.to(elements[i], 0.6, {
							y: multiplierA,
							scale: multiplierB,
							onComplete: function() {

							}
						});
					}
				}

				// Triggered when done callback is fired from beforeEnter
				TweenMax.to(element, 0.3, {
					opacity: 1,
					y: 0,
					onComplete: function() {
						lifoStack.add(element, element);
						done();
					}
				});
			},
			leave: function(element, done) {

				var previousElement = _getPrev(element);
				var elements = _getAll(element);

				if(previousElement) {

					var len = (elements.length == 0) ? elements.length : elements.length-1;

					for(var i = 0; i < len; i++) {

						var multiplierA = -(elements.length - i)*20;
						var multiplierB = (elements.length - i)/10;

						//multiplierA = (multiplierA <= -100) ? -100 : multiplierA;
						//multiplierB = (multiplierB <= 0.1) ? 0.1 : multiplierB;

						console.log(multiplierA, multiplierB)

						TweenMax.to(elements[i], 0.6, {
							y: '+=' + 20,
							scale: '+=' + 0.2,
							onComplete: function() {

							}
						});
					}
				}

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
