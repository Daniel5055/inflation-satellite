<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3'

  let svgId;

  let windowHeight;
  let windowWidth;

  onMount(async () => {
    const svg = d3.select(svgId);
    
    const width = 400;
    const height = 400;

    const projection = d3.geoMercator()
     .scale(width / 2 / Math.PI)
     .translate([width / 2, height / 2]);

    const mapData = await d3.json("/custom.geo.json");

    svg.append('g')
      .selectAll('path')
      // @ts-ignore
      .data(mapData.features)
      .enter()
      .append('path')
      .attr('fill', '#69b3a2')
      .attr('d', d3.geoPath().projection(projection))
      .style('stroke', '#fff')
      .style('stroke-width', '0.1')

    const g = svg.select('g');

    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)
    svg.call(zoom);
    function zoomed(event) {
      let {transform} = event;
      const ratio = windowHeight / windowWidth;

      if (Math.abs(transform.x) > width * (transform.k - 1)) {
        transform.x = width * -(transform.k - 1) 
      } else if (transform.x > 0) {
        transform.x = 0;
      }
      if (Math.abs(transform.y) > height * (1 - ratio) + (transform.k - 1) * height) {
        transform.y = height * -(1 - ratio) + -(transform.k - 1) * height 
      } else if (transform.y > 0) {
        transform.y = 0;
      }
      g.attr('transform', transform)
      g.attr('stroke', 1 / transform.k)
    }
  })

</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<div id="map-wrapper">
  <svg bind:this={svgId} width="100%" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid" id="map"></svg>
</div>

<style lang="css">
  #map-wrapper {
    width: 100vw;
    height: 100vh;
    overflow-y: hidden;
  }

  #map {
  }
</style>

