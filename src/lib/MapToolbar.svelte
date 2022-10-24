<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

</script>

<button on:click={() => dispatch('inflation')}>inflation</button>
<button>bubbles</button>