<script>
    import { fade } from "svelte/transition";


  export let name;

</script>


<div id="overlay" transition:fade={{ duration: 500, delay: 300 }}>
  <h1>{name}</h1>
  hello there
</div>

<style lang="css">
  #overlay {
    position: fixed;
    bottom: 20px;
    right: 10px;
    filter: drop-shadow(0 0 5px #000);
    border-radius: 50px;
    width: 400px;
    height: 400px;
    background-color: #AAA8;
    z-index: 2;
  }
</style>