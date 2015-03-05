(function() {
	'use strict';

	angular
		.module('directive')
	  	.animation('.directive', directiveAnimation);

	/* @ngInject */
	function directiveAnimation(Lifo) {

		var lifoStack = Lifo.createNew();

		var className = 'directive';

		var duration = 0.6;

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
					y: '60%',
					// Foundation Hack, bare for debug ui
					display: 'block',
					visibility: 'visible',
					onComplete: done
				});
			},
			enter: function(element, done) {

				var previousElement = _getPrev(element);
				var elements = _getAll(element);

				//if(previousElement) {

					var len = (elements.length == 0) ? elements.length : elements.length-1;

					for(var i = 0; i < elements.length; i++) {

						var multiplierA = -((elements.length - i)-1)*20;
						var multiplierB = 1 - (((elements.length - i)-1)/10);

						multiplierA = (multiplierA < -100) ? -100 : multiplierA;
						multiplierB = (multiplierB < 0.1) ? 0.1 : multiplierB;

						TweenMax.to(elements[i], duration, {
							y: multiplierA,
							scale: multiplierB,
							ease: Elastic.easeOut.config(2.5, 0.75),
							onComplete: function() {

							}
						});
					}
				//}

				// Triggered when done callback is fired from beforeEnter
				TweenMax.to(element, duration/2, {
					opacity: 1
				});
				TweenMax.to(element, duration, {
					y: '0%',
					onComplete: function() {
						lifoStack.add(element, element);
						done();
					}
				});
			},
			leave: function(element, done) {

				var previousElement = _getPrev(element);
				var elements = _getAll(element);

				//if(previousElement) {

					for(var i = 0; i < elements.length; i++) {

						var elTransforms = elements[i]._gsTransform;

						var multiplierA = -(elements.length - i)*20;
						multiplierA = (multiplierA < -120) ? -140 : multiplierA;

						var multiplierB = 1 - ((elements.length - i)/10);
						multiplierB = (multiplierB < 0.1) ? 0 : multiplierB;
						console.log(multiplierB);

						console.log('hej', multiplierB, multiplierB);
						//var multiplierB = ((prevMultiplierB+0.2) >= 1) ? 1 : (prevMultiplierB + 0.2);

						TweenMax.to(elements[i], duration, {
							y: multiplierA + 40,
							scale: multiplierB + 0.2,
							ease: Elastic.easeOut.config(2.5, 0.75),
							onComplete: function() {
							}
						});
					}
				//}

				// Triggered when done callback is fired from beforeLeave (NYI)
				TweenMax.to(element, duration, {
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
