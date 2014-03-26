define([
	"goo/entities/components/Component"
], /** @lends */ function (
	Component
) {
	"use strict";

	/**
	 * HTML Compnent
	 * @class
	 * @extends Component
	 */
	function HTMLComponent(domElement) {
		Component.call(this);
		this.type = "HTMLComponent";
		this.domElement = domElement;
	}

	HTMLComponent.prototype = Object.create(Component.prototype);
	return HTMLComponent;
});
