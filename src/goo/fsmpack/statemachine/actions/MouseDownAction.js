define([
	'goo/fsmpack/statemachine/actions/Action'
], function (
	Action
) {
	'use strict';

	function MouseDownAction(/*id, settings*/) {
		Action.apply(this, arguments);

		this.everyFrame = true;
		this.updated = false;
		this.button = null;

		this.mouseEventListener = function (event) {
			this.button = event.button;
			this.updated = true;
		}.bind(this);

		this.touchEventListener = function (event) {
			this.button = 'touch';
			this.updated = true;
		}.bind(this);
	}

	MouseDownAction.prototype = Object.create(Action.prototype);
	MouseDownAction.prototype.constructor = MouseDownAction;

	MouseDownAction.external = {
		name: 'Mouse Down / Touch Start',
		type: 'controls',
		description: 'Listens for a mousedown event (or touchstart) and performs a transition',
		canTransition: true,
		parameters: [],
		transitions: [{
			key: 'mouseLeftDown',
			name: 'Left mouse down',
			description: 'State to transition to when the left mouse button is pressed'
		}, {
			key: 'middleMouseDown',
			name: 'Middle mouse down',
			description: 'State to transition to when the middle mouse button is pressed'
		}, {
			key: 'rightMouseDown',
			name: 'Right mouse down',
			description: 'State to transition to when the right mouse button is pressed'
		}, {
			key: 'touchDown',
			name: 'Touch begin',
			description: 'State to transition to when the touch event begins'
		}]
	};

	MouseDownAction.prototype.enter = function () {
		document.addEventListener('mousedown', this.mouseEventListener);
		document.addEventListener('touchstart', this.touchEventListener);
	};

	MouseDownAction.prototype.update = function (fsm) {
		if (this.updated) {
			this.updated = false;
			if (this.button === 'touch') {
				fsm.send(this.transitions.touchDown);
			} else {
				fsm.send([
					this.transitions.mouseLeftDown,
					this.transitions.middleMouseDown,
					this.transitions.rightMouseDown
				][this.button]);
			}
		}
	};

	MouseDownAction.prototype.exit = function () {
		document.removeEventListener('mousedown', this.mouseEventListener);
		document.removeEventListener('touchstart', this.touchEventListener);
	};

	return MouseDownAction;
});