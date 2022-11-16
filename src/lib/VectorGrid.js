// @ts-nocheck
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
    L.SVG.Tile.prototype._initPath.call(this, layer);
    layer._classNames?.map((name) => L.DomUtil.addClass(layer._path, name));
  },
});

// Class-Based Slicer
// Add better class manipulation of features
const CBSlicer = L.VectorGrid.Slicer.extend({
  _additionalClassNames: {},
  _globalClassNames: new Set(),

  _createLayer: function (feat, pxPerExtent) {
    const layer = L.VectorGrid.Slicer.prototype._createLayer.call(
      this,
      feat,
      pxPerExtent
    );

    const id = this.options.getFeatureId(feat);
    layer._classNames = [...this._globalClassNames];
    if (this._additionalClassNames[id]) {
      layer._classNames = layer._classNames.concat([
        ...this._additionalClassNames[id],
      ]);
    }
    return layer;
  },

  // ClassName seems to only be set in style when rendering
  // And also overwrites, hence this method acts like the d3 classed method
  // If id is null then applies to all existing
  setFeatureClass: function (id, className, added) {
    // Add or remove from class names sets

    // Whether to iterate through all the class names or just the one for the id
    if (id !== null && !this._additionalClassNames[id]) {
      this._additionalClassNames[id] = new Set();
    }

    const classNamesList =
      id === null
        ? this._additionalClassNames
        : [this._additionalClassNames[id]];
    for (const i in classNamesList) {
      if (added) {
        classNamesList[i].add(className);
      } else {
        classNamesList[i]?.delete(className);
      }
    }

    for (const tileKey in this._vectorTiles) {
      const tile = this._vectorTiles[tileKey];
      const features = tile._features;
      if (id !== null) {
        const data = features[id];
        if (data) {
          for (const d of data) {
            const feat = d.feature;
            if (added) {
              feat && tile.addClass(feat, className);
            } else {
              feat && tile.removeClass(feat, className);
            }
          }
        }
      } else {
        for (const id in features) {
          for (const d of features[id]) {
            const feat = d.feature;
            if (added) {
              feat && tile.addClass(feat, className);
            } else {
              feat && tile.removeClass(feat, className);
            }
          }
        }
      }
    }
    return this;
  },

  setGlobalClass: function (className, added) {
    // Add or remove from class names
    if (added) {
      this._globalClassNames.add(className);
    } else {
      this._globalClassNames.delete(className);
    }

    for (const tileKey in this._vectorTiles) {
      const tile = this._vectorTiles[tileKey];
      const features = tile._features;
      for (const id in features) {
        for (const d of features[id]) {
          const feat = d.feature;
          if (added) {
            feat && tile.addClass(feat, className);
          } else {
            feat && tile.removeClass(feat, className);
          }
        }
      }
    }
    return this;
  },
  getFilter: function () {
    return this.options.filter;
  },
});

export const cbSlicer = (geojson, options) => new CBSlicer(geojson, options);

export const cbTile = (tileCoord, tileSize, options) =>
  new CBTile(tileCoord, tileSize, options);
