<script>
  import { getContext, onMount } from 'svelte';
  import * as d3 from 'd3'
  import L from 'leaflet'
  import CountryInfo from './CountryInfo.svelte'
  import MapToolbar from './MapToolbar.svelte';
  import '@ecds/leaflet.vectorgrid';
  import { cbSlicer, cbTile } from './VectorGrid';
  import IntroOverlay from './IntroOverlay.svelte';
  import { dataKey } from './LoadData.svelte';

  let grid;
  let mapContainer;

  let focusCountryCode = null;

  let inflationData;
  let gdpGrowthData;

  const { getMapData } = getContext(dataKey);

  function getA3(feature) {
    return feature.properties['ISO_A3_EH'];
  }

  onMount(async () => {
    inflationData = Object.fromEntries((await d3.csv('/inflation.csv')).map((row) => [row["Country Code"], row]));
    gdpGrowthData = Object.fromEntries((await d3.csv('/gdp_growth.csv')).map((row) => [row["Country Code"], row]));

    const map = L
      .map('map', {
        center: [48, -32],
        zoom: 4,
        doubleClickZoom: false,
      })
      .setMaxBounds(L.latLngBounds([-90, -Infinity], [90, Infinity]))
      .setMaxZoom(6)
      .setMinZoom(2);

    grid = cbSlicer(getMapData(), {
      rendererFactory: cbTile,
      vectorTileLayerStyles: {
        sliced: {
          stroke: true,
          fill: true,
          fillColor: '#324361',
          fillOpacity: 1,
          color: '#fff',
          weight: 1,
        }
      },
      getFeatureId: getA3,
      interactive: true,
      noWrap: true,
    })
    .on('mouseover', function (e) {
      const code = getA3(e.layer);
      this.setFeatureClass(code, 'highlighted', true);
    })
    .on('mouseout', function (e) {
      const code = getA3(e.layer);
      this.setFeatureClass(code, 'highlighted', false);
    })
    .on('mousedown', function (e) {
      const code = getA3(e.layer);
      this.setFeatureClass(code, 'active', true);
    })
    .on('mouseup', function (e) {
      const code = getA3(e.layer);
      this.setFeatureClass(code, 'active', false);
    })
    .on('click', function (e) {
      const code = getA3(e.layer);
      if (!focusCountryCode) {
        this.setGlobalClass('deselected', true)
        this.setFeatureClass(code, 'selected', true)
        focusCountryCode = code;

        // Filter out countries to prevent clicking on fade out
        const onFade = (e) => {
          console.log(e, 'trigger')
          if (!grid.getFilter() && e.propertyName === 'opacity') {
            if (focusCountryCode) {
              grid.setFilter((properties) => {
                return focusCountryCode === getA3({properties});
              });
            }
            mapContainer.removeEventListener('transitionend', onFade)
          }
        }
        mapContainer.addEventListener('transitionend', onFade)
      } else {
        grid.getFilter() && grid.setFilter(undefined);

        // Clear the mouse related classnames to stuck classes
        this.setFeatureClass(null, 'highlighted', false)
        this.setFeatureClass(null, 'active', false)

        this.setGlobalClass('deselected', false)
        this.setFeatureClass(code, 'selected', false)
        focusCountryCode = null;
      }
    })
    .addTo(map);

    grid.setGlobalClass('tile');

    const toolbar = new L.Control({ position: 'bottomleft'})
    toolbar.onAdd = (map) => {

      const container = L.DomUtil.create('div')
      const toolbarElement = new MapToolbar({
        target: container,
        props: {},
      });

      toolbarElement.$on('inflation', () => {
        for (const [code, data] of Object.entries(inflationData)) {
          const inflation = Math.round(parseFloat(data[2021]));
          
          // @ts-ignore
          //const colours = d3.scaleLinear().domain([-100, 100]).range(['red', 'blue']);
          const colours = d3.scaleSequentialSqrt().domain([20, -20]).interpolator(d3.interpolateRdBu);

          let colour;
          if (isNaN(inflation)) {
            colour = '#555';
          } else {
            colour = colours(inflation);
          }

          grid.setFeatureStyle(code, {
            stroke: true,
            fill: true,
            fillColor: colour,
            fillOpacity: 1,
            color: '#fff',
            weight: 1,
          })
        }
      })
      toolbarElement.$on('gdp growth', () => {
        for (const [code, data] of Object.entries(gdpGrowthData)) {
          const inflation = Math.round(parseFloat(data[2021]));
          
          // @ts-ignore
          //const colours = d3.scaleLinear().domain([-100, 100]).range(['red', 'blue']);
          const colours = d3.scaleSequentialSqrt().domain([-20, 20]).interpolator(d3.interpolateRdYlGn);

          let colour;
          if (isNaN(inflation)) {
            colour = '#555';
          } else {
            colour = colours(inflation);
          }

          grid.setFeatureStyle(code, {
            stroke: true,
            fill: true,
            fillColor: colour,
            fillOpacity: 1,
            color: '#fff',
            weight: 1,
          })
        }
      })

      return container
    };

    toolbar.addTo(map);
  })
</script>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>

<div bind:this={mapContainer} id="map" />

<IntroOverlay />

{#if focusCountryCode}
  <CountryInfo name={focusCountryCode} inflation={inflationData[focusCountryCode]?.[2020]} gdpGrowth={gdpGrowthData[focusCountryCode]?.[2020]}></CountryInfo>
{/if}
<style lang="css">
  #map {
    width: 100vw;
    height: 100vh;
    background-color: rgb(15, 34, 69);
    transition: filter 1000ms ease;
    position: relative;
    z-index: 0;
  }
  :global(path.tile) {
    filter: none;
    transition: filter 200ms ease-out, opacity 500ms ease-in;
  }
  :global(path.highlighted) {
    filter: brightness(1.2);
  }
  :global(path.active) {
    filter: brightness(0.8);
  }
  :global(path.deselected) {
    opacity: 0;
  }
  :global(path.selected) {
    opacity: 1;
  }
  /*
  :global(.leaflet-tile-pane) {
    filter: blur(2px)
  }
  */
</style>
