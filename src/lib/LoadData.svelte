<script context="module">
  export const dataKey = Symbol();

  export function getCode(feature) {
    return feature.properties['ISO_A3_EH'];
  }
</script>

<script>
  import * as d3 from "d3";
  import { onMount, setContext } from "svelte";


  export let path = "/map50.geojson";

  let mapData;
  let features;

  // Load data
  onMount(async () => {
    mapData = await d3.json(path);

    // @ts-ignore
    features = Object.fromEntries(mapData.features.map((feature) => [getCode(feature), feature]));
    console.log(features)
  });

  setContext(dataKey, {
    getMapData: () => mapData,
    getFeatures: () => features,
  });
</script>

<slot />
