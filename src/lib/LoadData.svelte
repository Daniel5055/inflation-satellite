<script context="module">
  export const dataKey = Symbol();

  export function getCode(feature) {
    return feature.properties['ISO_A3_EH'];
  }
</script>

<script>
  import * as d3 from "d3";
  import { onMount, setContext } from "svelte";

  export let mapDataPath = "/map50.geojson";
  export let countryDataPath = "/countries.json"

  let mapData;
  let countryData

  // Load data
  onMount(async () => {
    mapData = await d3.json(mapDataPath);
    countryData = await loadCountryData(countryDataPath)
  });

  setContext(dataKey, {
    getMapData: () => mapData,
    getCountryData: (code) => countryData[code],
  });

  async function loadCountryData(path) {
    const rawData = await d3.json(path)
    // @ts-ignore
    return Object.fromEntries(rawData.map((country) => [country.cca3, country]));
  }
</script>

<slot />
