<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

</script>

<button on:click={() => dispatch('inflation')}>inflation</button>
<button on:click={() => dispatch('gdp growth')}>gdp growth</button>