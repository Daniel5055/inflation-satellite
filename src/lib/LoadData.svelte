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
  export let inflationDataPath = "/inflation.csv"
  export let gdpGrowthDataPath = "/gdp_growth.csv"

  let mapData;
  let countryData;
  let inflationData;
  let gdpGrowthData;

  // TODO: Make the data async and let components await specific data
  let loaded;

  // Load data
  loaded = new Promise(async (res, err) => {
    onMount(async () => {
      mapData = await d3.json(mapDataPath);
      countryData = await loadCountryData(countryDataPath);
      inflationData = await loadCsvData(inflationDataPath);
      gdpGrowthData = await loadCsvData(gdpGrowthDataPath);

      res(true);
    });
  });

  setContext(dataKey, {
    getMapData: () => mapData,
    getCountryData: (code) => countryData[code],
    getInflationData: () => inflationData,
    getGdpGrowthData: () => gdpGrowthData,
    loaded: loaded,
  });

  async function loadCountryData(path) {
    const rawData = await d3.json(path)
    // @ts-ignore
    return Object.fromEntries(rawData.map((country) => [country.cca3, country]));
  }

  async function loadCsvData(path) {
    const rawData = await d3.csv(path)
    // @ts-ignore
    return Object.fromEntries(rawData.map((row) => [row["Country Code"], row]));
  }
</script>

<slot />
