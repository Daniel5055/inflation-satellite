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
    layer.classNames?.map((name) => L.DomUtil.addClass(layer._path, name));
  },
});

// @ts-ignore
// Class-Based Slicer
// Add better class manipulation of features 
const CBSlicer = L.VectorGrid.Slicer.extend({
  _additionalClassNames: [],

  _createLayer: function(feat, pxPerExtent) {
    // @ts-ignore
    const layer = L.VectorGrid.Slicer.prototype._createLayer.call(this, feat, pxPerExtent);
    layer.classNames = this._additionalClassNames[this.options.getFeatureId(feat)];
    return layer;
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

// @ts-ignore
export const cbSlicer = (geojson, options) => new CBSlicer(geojson, options);

// @ts-ignore
export const cbTile = (tileCoord, tileSize, options) => new CBTile(tileCoord, tileSize, options);
