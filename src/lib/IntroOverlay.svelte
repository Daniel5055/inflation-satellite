<script>
  import { fade } from "svelte/transition";

  let show = true;

  function reveal() {
    show = false;
  }
</script>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
{#if show}
  <div
    id="cover"
    on:click={reveal}
    style:backdrop-filter="blur({show ? "4px" : "0px"})"
    out:fade={{duration: 1000}}
  />
  <div id="info" class="overlay-box" out:fade={{duration: 500}}>
    <h1>Inflation Satellite</h1>
    <p>Visualising data</p>
  </div>
{/if}

<style lang="css">
  #cover {
    position: fixed;
    z-index: 1;
    inset: 0 0;
    width: 100vw;
    height: 100vw;
    transition: backdrop-filter 1000ms ease;
  }

  #info {
    z-index: 2;
    position: fixed;
    inset: 50% 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    background-color: #BBB1;
    text-align: center;
  }
</style>