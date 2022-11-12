<script>
  import { fade } from "svelte/transition";


  export let name;
  export let inflation;
  export let gdpGrowth;
  console.log(inflation);
</script>


<div id="overlay" class="overlay-box" transition:fade={{ duration: 500, delay: 300 }}>
  <h1>{name}</h1>
  <p>Inflation: {parseFloat(inflation).toFixed(2)}%</p>
  <p>GDP Growth: {parseFloat(gdpGrowth).toFixed(2)}%</p>
</div>

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