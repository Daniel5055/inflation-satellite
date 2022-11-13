<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3'
  import L from 'leaflet'
  import CountryInfo from './CountryInfo.svelte'
  import { fade } from 'svelte/transition';
  import MapToolbar from './MapToolbar.svelte';
  // @ts-ignore
  import __ from 'leaflet.vectorgrid/dist/Leaflet.VectorGrid';

  let mapBlurred = false;
  let screenBlurred;

  let showOverlay = true;
  let showCountryInfo = false;
  let focusCountryName = null;
  let focusCountryCode = null;
  let focusLayer = null;

  let inflationData;
  let gdpGrowthData;

  $: d3.select('.core-map').style('filter', `blur(${mapBlurred ? 4 : 0}px)`);
  $: d3.select('#map').style('filter', `blur(${screenBlurred ? 4 : 0}px)`);

  onMount(async () => {
    screenBlurred = true;
    const mapData = await d3.json("/new.geojson");
    inflationData = Object.fromEntries((await d3.csv('/inflation.csv')).map((row) => [row["Country Code"], row]));
    gdpGrowthData = Object.fromEntries((await d3.csv('/gdp_growth.csv')).map((row) => [row["Country Code"], row]));
    console.log(inflationData)

    const map = L
      .map('map', {
        center: [48, -32],
        zoom: 4,
      })
      .setMaxBounds(L.latLngBounds([-60, -180], [90, 180]))
      .setMaxZoom(6)
      .setMinZoom(3);

    const grid = L.vectorGrid.slicer(mapData, {
      rendererFactory: L.svg.tile,
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
      getFeatureId: (f) => f.properties['ISO_A3_EH'],
      interactive: true,
    }).addTo(map)


    grid.setFeatureStyle('GBR', {
          stroke: true,
          fill: true,
          fillColor: '#000',
          fillOpacity: 1,
          color: '#fff',
          weight: 1,
        }
)

    // @ts-ignore
    /*
    const mapLayer = L.geoJSON(mapData, {
      onEachFeature: (feature, layer) => {
        // @ts-ignore
        layer.on('click', () => {
          // @ts-ignore
          // Pan to box
          map.fitBounds(layer.getBounds())
          map.once('moveend', () => {
            mapBlurred = true;
          });
          focusCountryName = feature.properties['NAME'];
          focusCountryCode = feature.properties['ISO_A3_EH'];

          showCountryInfo = true;

          focusLayer && map.removeLayer(focusLayer);

          // @ts-ignore
          focusLayer = L.geoJSON(layer.toGeoJSON(), {
            style: {
              stroke: true,
              fill: true,
              fillColor: '#324361',
              fillOpacity: 1,
              color: '#fff',
              weight: 1,
            }
          }).addTo(map).once('click', () => {
            focusLayer && map.removeLayer(focusLayer);
            focusCountryName = null;
            mapBlurred = false;
            showCountryInfo = false;
          });

          map.once('drag', () => {
            focusLayer && map.removeLayer(focusLayer);
            focusCountryName = null;
            mapBlurred = false;
            showCountryInfo = false;
          })
        })
      },
      style: {
        stroke: true,
        fill: true,
        fillColor: '#324361',
        fillOpacity: 1,
        color: '#fff',
        weight: 1,
        className: 'map-layer',
      },
    }).addTo(map);
    */

    const toolbar = new L.Control({ position: 'bottomleft'})
    toolbar.onAdd = (map) => {

      const container = L.DomUtil.create('div')
      const toolbarElement = new MapToolbar({
        target: container,
        props: {},
      });

      toolbarElement.$on('inflation', () => {
        mapLayer.eachLayer((layer) => {

          // @ts-ignore
          const code = layer.feature.properties["ISO_A3_EH"];

          const inflation = Math.round(parseFloat(inflationData[code]?.[2020]));
          
          // @ts-ignore
          //const colours = d3.scaleLinear().domain([-100, 100]).range(['red', 'blue']);
          const colours = d3.scaleSequentialSqrt().domain([20, -20]).interpolator(d3.interpolateRdBu);

          let colour;
          if (isNaN(inflation)) {
            colour = '#555';
          } else {
            colour = colours(inflation);
          }

          // @ts-ignore
          layer.setStyle({
            fillColor: colour
          })
        })
      })
      toolbarElement.$on('gdp growth', () => {
        mapLayer.eachLayer((layer) => {

          // @ts-ignore
          const code = layer.feature.properties["ISO_A3_EH"];

          const growth = Math.round(parseFloat(gdpGrowthData[code]?.[2020]));
          
          // @ts-ignore
          //const colours = d3.scaleLinear().domain([-100, 100]).range(['red', 'blue']);
          const colours = d3.scaleSequentialSqrt().domain([-20, 20]).interpolator(d3.interpolateRdYlGn);

          let colour;
          if (isNaN(growth)) {
            colour = '#555';
          } else {
            colour = colours(growth);
          }

          // @ts-ignore
          layer.setStyle({
            fillColor: colour
          })
        })
      })

      return container
    };

    toolbar.addTo(map);

    // Wrap them in a group
    d3.selectAll('.map-layer').each(function() {
      const el = this;
      if (d3.select('.core-map').empty()) {
        // @ts-ignore
        d3.select(el.parentNode)
        .insert('g')
        .attr('class', 'core-map')
        .append(() => el)
      } else {
        d3.select('.core-map').append(() => el)
      }
    });


  })

  function revealMap() {
    screenBlurred = false;
    showOverlay = false;
  }
</script>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>

<div id="map" />
{#if showOverlay}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click={revealMap} id="map-cover" />
  <div id="info" class="overlay-box" out:fade={{duration: 500}}>
    <h1>Inflation Satellite</h1>
    <p>Visualising data</p>
  </div>
{/if}
{#if showCountryInfo}
  <CountryInfo name={focusCountryName} inflation={inflationData[focusCountryCode]?.[2020]} gdpGrowth={gdpGrowthData[focusCountryCode]?.[2020]}></CountryInfo>
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
  #map-cover {
    position: fixed;
    z-index: 1;
    inset: 0 0;
    width: 100vw;
    height: 100vw;
  }
  #info {
    z-index: 2;
    position: fixed;
    inset: 50% 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    background-color: #BBB1;
    text-align: center;
  }
</style>
