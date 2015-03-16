(function() {
	'use strict';

	angular
		.module('directive')
	  	.animation('.directive', directiveAnimation);

	/* @ngInject */
	function directiveAnimation(Lifo) {

		var lifoStack = Lifo.createNew();

		var className = 'directive';

		var counter = 0;

		var duration = 0.6;

		var minScale = 0.1,
			maxScale = 1;

		var minY = -100,
			maxY = 0;

		function _calcRelative(min, max, value) {

			console.log(min, max, value)

		}

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

			var array = parent.children('.' + className);

			array.splice(-1, 1);

			return array;

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

				var elements = _getAll(element);

				for(var i = 0; i < elements.length; i++) {

					var yFrom = Math.floor((elements.length - i) * 10);
					var scaleFrom = (elements.length - i) / 10;

					var yTo = (yFrom > 70) ? 0 : -(yFrom);

					var scaleTo = (scaleFrom >= 1) ? 0.1 : 1 - (scaleFrom);

					TweenMax.to(elements[i], duration, {
						y: yTo,
						scale: scaleTo,
						parseTransform: true,
						force3D: true,
						autoRound: false
					});
				}

				// Triggered when done callback is fired from beforeEnter
				TweenMax.to(element, duration/2, {
					opacity: 1
				});
				TweenMax.to(element, duration, {
					y: '0%',
					parseTransform: true,
					force3D: true,
					onComplete: function() {
						elements = undefined;
						done();
					}
				});
			},
			leave: function(element, done) {

				var previousElement = _getPrev(element);
				var elements = _getAll(element);

				for(var i = 0; i < elements.length; i++) {
					//console.log(i);

						var props = elements[i]._gsTransform;

						var yFrom = props.y;
						var scaleFrom = Math.floor(props.scaleX * 10);
						//console.log('///')
						scaleFrom = scaleFrom / 10;

						console.log('i was: ', props.scaleX, ' index is: ', i);
						console.log('i am scaling from: ', scaleFrom);

						// Der er 9 der må scales


						var yTo = (yFrom >= -10) ? 0 : yFrom + 10;
						//var scaleTo = (((elements.length - i) / 10) > 1) ? '+=' + 0 : '+=' + 0.1;
						var scaleTo = (scaleFrom >= 1) ? 1 : scaleFrom + 0.1;
						console.log('i am scaling to: ', scaleTo);
						console.log('///');
					if((elements.length - i) <= 10) {
						TweenMax.to(elements[i], duration, {
							y: yTo,
							scale: scaleTo,
							//parseTransform: true,
							force3D: true,
							autoRound: true
						});
					}
				}

				// Triggered when done callback is fired from beforeLeave (NYI)
				TweenMax.to(element, duration/2, {
					opacity: 0
				});
				TweenMax.to(element, duration, {
					y: '60%',
					//parseTransform: true,
					force3D: true,
					onComplete: function() {
						elements = undefined;
						done();
					}
				});
			}
		};
	}
})();
