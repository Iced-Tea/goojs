define([
	'goo/entities/components/Component',
	'goo/renderer/light/Light'
],
	/** @lends */
	function (
		Component,
		Light
	) {
	'use strict';

	/**
	 * @class Defines a light
	 * @param {Light} light Light to contain in this component (directional, spot, point)
	 */
	function LightComponent(light) {
		this.type = 'LightComponent';

		this.light = light;

		this.hidden = false;
	}

	LightComponent.prototype = Object.create(Component.prototype);

	LightComponent.prototype.updateLight = function (transform) {
		this.light.update(transform);
	};

	LightComponent.applyOnEntity = function(obj, entity) {
		if (obj instanceof Light) {
			var lightComponent = new LightComponent(obj);
			entity.setComponent(lightComponent);
			return true;
		}
	};

	return LightComponent;
});