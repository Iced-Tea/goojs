define([
	'goo/loaders/handlers/ComponentHandler',
	'goo/entities/components/MeshRendererComponent',
	'goo/util/rsvp',
	'goo/util/PromiseUtil',
	'goo/util/ObjectUtil'
], function(
	ComponentHandler,
	MeshRendererComponent,
	RSVP,
	pu,
	_
) {
	function MeshRendererComponentHandler() {
		ComponentHandler.apply(this, arguments);
	}

	MeshRendererComponentHandler.prototype = Object.create(ComponentHandler.prototype);
	ComponentHandler._registerClass('meshRenderer', MeshRendererComponentHandler);
	MeshRendererComponentHandler.prototype.constructor = MeshRendererComponentHandler;

	MeshRendererComponentHandler.prototype._prepare = function(config) {
		return _.defaults(config, {
			materialRefs: [],
			cullMode: 'Dynamic',
			castShadows: false,
			receiveShadows: false
		});
	};

	MeshRendererComponentHandler.prototype._create = function(entity) {
		var component = new MeshRendererComponent();
		entity.setComponent(component);
		return component;
	};

	MeshRendererComponentHandler.prototype.update = function(entity, config) {
		var that = this;

		var promise;

		var component = ComponentHandler.prototype.update.call(this, entity, config);
		var materialRefs = config.materialRefs;
		if (!materialRefs || materialRefs.length === 0) {
			console.log("No material refs");
			promise = pu.createDummyPromise([]);
		} else {
			var promises = [];
			var pushPromise = function(materialRef) {
				return promises.push(that._getMaterial(materialRef));
			};
			for (var i = 0; i < materialRefs.length; i++) {
				pushPromise(materialRefs[i]);
			}
			promise = RSVP.all(promises);
		}
		return promise.then(function(materials) {
			var key, value;
			if (component.materials && component.materials.length) {
				var selectMaterial;
				for (var i = 0; i < component.materials.length; i++) {
					var material = component.materials[i];
					if (material.name === 'gooSelectionIndicator') {
						selectMaterial = material;
						break;
					}
				}
				materials.push(selectMaterial);
			}
			component.materials = materials;
			for (key in config) {
				value = config[key];
				if (key !== 'materials' && component.hasOwnProperty(key)) {
					component[key] = _.clone(value);
				}
			}
			return component;
		}).then(null, function(err) {
			return console.error("Error handling materials " + err);
		});
	};

	MeshRendererComponentHandler.prototype._getMaterial = function(ref) {
		var that = this;
		return this.getConfig(ref).then(function(config) {
			return that.updateObject(ref, config, that.options);
		});
	};

	return MeshRendererComponentHandler;
});
