<script>
  import L from 'leaflet';
  import { onMount } from 'svelte';

  onMount(async () => {
    const map = L.map('mapid').setView([50, -0.1], 4);

    const x = await fetch('/countries.geojson').then((r) => r.json());

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      noWrap: true,
      maxZoom: 6,
      minZoom: 1,
    }).addTo(map);

    console.log(x)
    L.geoJSON(x).addTo(map);
  })

</script>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
<div id="mapid"></div>

<style lang="css">
  #mapid {
    height: 400px;
    width: 600px;
  }
</style>

