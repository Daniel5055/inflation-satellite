import L, { DomUtil, SVG } from "leaflet";
import "leaflet.vectorgrid";

// Add class manipulation methods to renderer
L.SVG.include({
  addClass: function (layer, className) {
    !L.DomUtil.hasClass(layer._path, className) &&
      L.DomUtil.addClass(layer._path, className);
  },
  removeClass: function (layer, className) {
    L.DomUtil.hasClass(layer._path, className) &&
      L.DomUtil.removeClass(layer._path, className);
  },
});

// @ts-ignore
const CustomSlicer = L.VectorGrid.Slicer.extend({
  // ClassName seems to only be set in style when rendering
  // And also overwrites, hence this method acts like the d3 classed method
  setFeatureClass: function (id, className, added = true) {
    for (var tileKey in this._vectorTiles) {
      var tile = this._vectorTiles[tileKey];
      var features = tile._features;
      var data = features[id];
      if (data) {
        var feat = data.feature;
        added
          ? tile.addClass(feat, className)
          : tile.removeClass(feat, className);
      }
    }
    return this;
  },
});

// @ts-ignore
export const customSlicer = (geojson, options) =>
  new CustomSlicer(geojson, options);
