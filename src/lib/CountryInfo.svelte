<script>
  export let name;

</script>


<div id="overlay" style={name ? "transform: none" : ""}>
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
    transition: transform 500ms ease-out;
    transform: translateX(450px);
    z-index: 2;
  }
</style>