<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3'
  import L from 'leaflet'

  let mapBlurred = true;
  let hidden = false;

  onMount(async () => {
    const mapData = await d3.json("/custom.geo.json");

    const map = L
      .map('map-wrapper', {
        center: [48, -32],
        zoom: 4,
      })
      .setMaxBounds(L.latLngBounds([-60, -180], [90, 180]))
      .setMaxZoom(6)
      .setMinZoom(3);

    // @ts-ignore
    L.geoJSON(mapData, {
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {

          // @ts-ignore
          // Pan to box
          map.fitBounds(layer.getBounds())
        })
      },
      style: {
        stroke: true,
        fill: true,
        fillColor: '#324361',
        fillOpacity: 1,
        color: '#fff',
        weight: 1,
      }
    }).addTo(map);
  })

  function revealMap() {
    mapBlurred = false;
  }
  function hideOverlay() {
    hidden = true;
  }
</script>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>

<div id="map-wrapper" style="filter: blur({mapBlurred ? '4px' : '0px'});" />
{#if !hidden}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click={revealMap} id="map-cover" />
  <div id="info" style="opacity: {mapBlurred ? '1' : '0'}" on:transitionend={hideOverlay}>
    <h1>Inflation Satellite</h1>
    <p>Visualising data</p>
  </div>
{/if}
<style lang="css">
  #map-wrapper {
    width: 100vw;
    height: 100vh;
    background-color: rgb(15, 34, 69);
    filter: blur(6px);
    transition: filter 1000ms ease;
  }
  #map-cover {
    position: fixed;
    inset: 0 0;
    width: 100vw;
    height: 100vw;
  }
  #info {
    position: fixed;
    inset: 50% 50%;
    transform: translate(-50%, -50%);
    filter: drop-shadow(0 0 5px #000);
    border-radius: 50px;
    width: 400px;
    height: 400px;
    background-color: #BBB1;
    transition: opacity 500ms ease-in;
  }
</style>
