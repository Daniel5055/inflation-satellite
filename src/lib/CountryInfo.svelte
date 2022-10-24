<script>
    import { fade } from "svelte/transition";


  export let name;

</script>


<div id="overlay" class="overlay-box" transition:fade={{ duration: 500, delay: 300 }}>
  <h1>{name}</h1>
  hello there
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