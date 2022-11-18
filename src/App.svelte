<script>
  import LoadData from './lib/LoadData.svelte';
  import Map from './lib/Map.svelte'
</script>

<main>
  <LoadData path="/map50.geojson">
    <Map />
  </LoadData>
</main>

<style>
</style>
