import L, { DomUtil } from "leaflet";
import "leaflet.vectorgrid";

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

// @ts-ignore
const CustomSlicer = L.VectorGrid.Slicer.extend({
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
        var feat = data.feature;
        if (added) {
          feat && tile.addClass(feat, className)
        } else {
          feat && tile.removeClass(feat, className)
        }
      }
    }
    return this;
  },
});

export const customSlicer = (geojson, options) =>
  // @ts-ignore
  new CustomSlicer(geojson, options);
