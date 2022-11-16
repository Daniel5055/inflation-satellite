import L from "leaflet";
import "@ecds/leaflet.vectorgrid";

// Class-Based Slicer
// Add class manipulation methods to renderer
const CBTile = L.SVG.Tile.extend({
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
    L.SVG.Tile.prototype._initPath.call(this, layer)
    layer._classNames?.map((name) => L.DomUtil.addClass(layer._path, name));
  },
});

// @ts-ignore
// Class-Based Slicer
// Add better class manipulation of features 
const CBSlicer = L.VectorGrid.Slicer.extend({
  _additionalClassNames: {},
	_allClassNames: [],

  _createLayer: function(feat, pxPerExtent) {
    // @ts-ignore
    const layer = L.VectorGrid.Slicer.prototype._createLayer.call(this, feat, pxPerExtent);

		const id = this.options.getFeatureId(feat);
    layer._classNames = this._allClassNames;
		if (this._additionalClassNames[id]) {
			layer._classNames = layer._classNames.concat(this._additionalClassNames[id]);
		}
    return layer;
  },

  // ClassName seems to only be set in style when rendering
  // And also overwrites, hence this method acts like the d3 classed method
  setFeatureClass: function (id, className, added) {
		// Add or remove from class names
    if (added && !this._additionalClassNames[id]?.includes(className)) {
			if (!this._additionalClassNames[id]) {
				this._additionalClassNames[id] = [];
			}
      this._additionalClassNames[id].push(className)
    } else if (!added) {
      this._additionalClassNames[id] =
        this._additionalClassNames[id].filter((name) => name !== className);
    }

    for (const tileKey in this._vectorTiles) {
      const tile = this._vectorTiles[tileKey];
      const features = tile._features;
      const data = features[id];
      if (data) {
				for (const d of data) {
					const feat = d.feature;
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

  setAllFeaturesClass: function (className, added) {
		// Add or remove from class names
    if (added && !this._allClassNames?.includes(className)) {
      this._allClassNames.push(className)
    } else if (!added) {
      this._allClassNames
        this._allClassNames.filter((name) => name !== className);
    }

    for (const tileKey in this._vectorTiles) {
      const tile = this._vectorTiles[tileKey];
      const features = tile._features;
			for (const id in features) {
				for (const d of features[id]) {
					const feat = d.feature;
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

// @ts-ignore
export const cbSlicer = (geojson, options) => new CBSlicer(geojson, options);

// @ts-ignore
export const cbTile = (tileCoord, tileSize, options) => new CBTile(tileCoord, tileSize, options);
