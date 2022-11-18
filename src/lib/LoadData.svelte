<script context="module">
  export const dataKey = Symbol();
</script>

<script>
  import * as d3 from "d3";
  import { onMount, setContext } from "svelte";


  export let path = "/map50.geojson";

  let mapData;

  onMount(async () => {
    mapData = await d3.json(path);
  });

  setContext(dataKey, {
    getMapData: () => mapData,
  });
</script>

<slot />
