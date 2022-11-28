<script>
  import { getContext } from "svelte";
  import { slide } from "svelte/transition";
  import { dataKey } from "./LoadData.svelte";

  const { getFeatures } = getContext(dataKey);

  console.log(getContext(dataKey).getFeatures())

  export let code;

  let name;
  let longName;

  $: if (code !== null) {
    name = getFeatures()?.[code].properties['NAME'];
    longName = getFeatures()?.[code].properties['FORMAL_EN'];

    console.log(getFeatures()?.[code]);
  }

</script>

{#if code}
  <div id="overlay" in:slide={{ duration: 500, delay: 300,  }} out:slide={{ duration: 500}}>
    <div id="header" class="overlay-box info-box">
      <h1>{name}</h1>
      {#if longName}<h2>{longName}</h2>{/if}
    </div>
    <div id="graph" class="overlay-box info-box">
      Graph
    </div>
  </div>
{/if}

<style lang="css">
  #overlay {
    position: fixed;
    bottom: 5vh;
    right: 20px;
    width: 400px;
    height: 90vh;
    z-index: 2;
    text-align: center;
    display: grid;
    grid-template-areas:
    "header"
    "graph"
    "footer";
    grid-template-rows: min-content auto min-content;
    gap: 20px;
  }

  #header {
    grid-area: header;
  }

  #graph {
    grid-area: graph;
  }

  .info-box {
    padding: 10px;
  }

  h1 {
    font-size: 3rem;
    margin: 10px 0;
    text-align: center;
  }

  h2 {
    font-size: 1rem;
    margin: 0 20px;
    text-align: center;
  }
</style>