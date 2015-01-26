(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name ncAngularApp.factory:Lifo
	 * @description
	 * # Lifo
	 * Factory providing a LIFO array with methods (Last In First Out)
	 */
	angular
		.module('directive')
		.factory('Lifo', Lifo);

	/* @ngInject */
	function Lifo() {

		var lifo = {
			createNew: createNew
		};

		return lifo;

		function createNew() {

			// Memory stack
			var stack = [];

			return {
				add: add,
				get: get,
				keys: keys,
				top: top,
				remove: remove,
				removeTop: removeTop,
				length: length
			};

			function add(key, value) {

				// I add entries to my stack
				stack.push({
					key: key,
					value: value
				});
			}

			function get(key) {

				// I get a specific entry in my stack
				for(var i = 0; i < stack.length; i++) {
					if(key == stack[i].key) {
						return stack[i];
					}
				}

			}

			function keys() {

				// I return a copy of the keys in my stack
				var keys = [];
				for(var i = 0; i < stack.length; i++) {
					keys.push(stack[i].key);
				}
				return keys;
			}

			function top() {

				// I return the last element in my stack
				return stack[stack.length - 1];
			}

			function remove(key) {

				// I delete a specific element in my stack
				var idx = -1;
				for (var i = 0; i < stack.length; i++) {
					if (key == stack[i].key) {
						idx = i;
						break;
					}
				}
				return stack.splice(idx, 1)[0];
			}

			function removeTop() {

				// I remove the last element in my stack
				return stack.splice(stack.length - 1, 1)[0];
			}

			function length() {

				// I return the lenth of my stack
				return stack.length;
			}

		}
	};

})();
