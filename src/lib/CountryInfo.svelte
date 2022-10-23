<script>
  export let name;

</script>


<div id="overlay">
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
    transition: opacity 500ms ease-in;
    z-index: 2;
  }
</style>