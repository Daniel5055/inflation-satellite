import L, { DomUtil } from "leaflet";
import "leaflet.vectorgrid";
import { xlink_attr } from "svelte/internal";

// Add class manipulation methods to renderer
L.SVG.Tile.include({
  addClass: function (layer, className) {
    !L.DomUtil.hasClass(layer._path, className) &&
      L.DomUtil.addClass(layer._path, className);
  },
  removeClass: function (layer, className) {
    L.DomUtil.hasClass(layer._path, className) &&
      L.DomUtil.removeClass(layer._path, className);
  },
  _initPath: function (layer) {
    // @ts-ignore
    L.SVG.prototype._initPath.call(this, layer)
    layer.classNames?.map((name) => L.DomUtil.addClass(layer._path, name));
  },
});

const CustomSlicer = L.VectorGrid.Slicer.extend({
  _additionalClassNames: [],

	initialize: function(geojson, options) {
		// @ts-ignore
		L.VectorGrid.Slicer.prototype.initialize.call(this, geojson, options);
	},

  _posToKey: function(pos) {
    return pos.x + ":" + pos.y
  },

  _createLayer: function(feat, pxPerExtent) {
    // @ts-ignore
    const layer = L.VectorGrid.Slicer.prototype._createLayer.call(this, feat, pxPerExtent);
    layer.classNames = this._additionalClassNames[this.options.getFeatureId(feat)];
    return layer;
  },

  createTile: function(coords, done) {
		var storeFeatures = this.options.getFeatureId;

		var tileSize = this.getTileSize();
		var renderer = this.options.rendererFactory(coords, tileSize, this.options);

		var vectorTilePromise = this._getVectorTilePromise(coords);

		if (storeFeatures) {
			this._vectorTiles[this._tileCoordsToKey(coords)] = renderer;
			renderer._features = {};
		}

		vectorTilePromise.then( function renderTile(vectorTile) {
			for (var layerName in vectorTile.layers) {
				this._dataLayerNames[layerName] = true;
				var layer = vectorTile.layers[layerName];

				var pxPerExtent = this.getTileSize().divideBy(layer.extent);

				var layerStyle = this.options.vectorTileLayerStyles[ layerName ] ||
				L.Path.prototype.options;

				for (var i = 0; i < layer.features.length; i++) {
					var feat = layer.features[i];
					var id;

					var styleOptions = layerStyle;
					if (storeFeatures) {
						id = this.options.getFeatureId(feat);
						var styleOverride = this._overriddenStyles[id];
						if (styleOverride) {
							if (styleOverride[layerName]) {
								styleOptions = styleOverride[layerName];
							} else {
								styleOptions = styleOverride;
							}
						}
					}

					if (styleOptions instanceof Function) {
						styleOptions = styleOptions(feat.properties, coords.z);
					}

					if (!(styleOptions instanceof Array)) {
						styleOptions = [styleOptions];
					}

					if (!styleOptions.length) {
						continue;
					}

					var featureLayer = this._createLayer(feat, pxPerExtent);

					for (var j = 0; j < styleOptions.length; j++) {
						var style = L.extend({}, L.Path.prototype.options, styleOptions[j]);
						featureLayer.render(renderer, style);
						renderer._addPath(featureLayer);
					}

					if (this.options.interactive) {
						featureLayer.makeInteractive();
					}

					if (storeFeatures) {
						if (!renderer._features[id]) {
							renderer._features[id] = [];
						}

						renderer._features[id].push({
							layerName: layerName,
							feature: featureLayer
						});
					}
				}

			}
			if (this._map != null) {
				renderer.addTo(this._map);
			}
			L.Util.requestAnimFrame(done.bind(coords, null, null));
		}.bind(this));

		return renderer.getContainer();
  },

  // ClassName seems to only be set in style when rendering
  // And also overwrites, hence this method acts like the d3 classed method
  setFeatureClass: function (id, className, added) {
    if (added && !this._additionalClassNames[id]?.includes(className)) {
      this._additionalClassNames[id]
        ? this._additionalClassNames[id].push(className)
        : this._additionalClassNames[id] = [className];
    } else if (!added && this._additionalClassNames[id]?.includes(className)) {
      this._additionalClassNames[id] =
        this._additionalClassNames[id].filter((name) => name !== className);
    }

    for (var tileKey in this._vectorTiles) {
      var tile = this._vectorTiles[tileKey];
      var features = tile._features;
      var data = features[id];
      if (data) {
				for (const d of data) {
					var feat = d.feature;
					if (added) {
						feat && tile.addClass(feat, className)
					} else {
						feat && tile.removeClass(feat, className)
					}
				}
      }
    }
    return this;
  },
});

export const customSlicer = (geojson, options) =>
  // @ts-ignore
  new CustomSlicer(geojson, options);
