<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

</script>

<button on:click={() => dispatch('inflation')}>Inflation</button>
<button on:click={() => dispatch('gdp growth')}>GDP Growth</button>