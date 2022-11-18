<script>
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  import { dataKey } from "./LoadData.svelte";

  const { getFeatures } = getContext(dataKey);

  console.log(getContext(dataKey).getFeatures())

  export let code;

  let name;

  $: if (code !== null) {
    name = getFeatures()?.[code].properties['NAME'];
    console.log(getFeatures()?.[code]);
  }

</script>

{#if code}
  <div id="overlay" class="overlay-box" transition:fade={{ duration: 500, delay: 300 }}>
    <h1>{name}</h1>
  </div>
{/if}

<style lang="css">
  #overlay {
    position: fixed;
    bottom: 5vh;
    right: 10px;
    filter: drop-shadow(0 0 5px #000);
    width: 400px;
    height: 90vh;
    z-index: 2;
    text-align: center;
  }
</style>