<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3'

  let svgId
  onMount(async () => {
    const svg = d3.select(svgId);
    
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const projection = d3.geoMercator()
     .scale(width / 2 / Math.PI)
     .translate([width / 2, height / 2]);

    const mapData = await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");

    svg.append('g')
      .selectAll('path')
      // @ts-ignore
      .data(mapData.features)
      .enter()
      .append('path')
      .attr('fill', '#69b3a2')
      .attr('d', d3.geoPath().projection(projection))
      .style('stroke', '#fff')

    const g = svg.select('g');
    console.log(g);

    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)
    svg.call(zoom);
    function zoomed(event) {
      console.log(event)
      let {transform} = event;
      if (Math.abs(transform.x) > width * (transform.k - 1)) {
        transform.x = width * -(transform.k - 1) 
      } else if (transform.x > 0) {
        transform.x = 0;
      }
      if (Math.abs(transform.y) > height * (transform.k - 1)) {
        transform.y = height * -(transform.k - 1) 
      } else if (transform.y > 0) {
        transform.y = 0;
      }
      g.attr('transform', transform)
      g.attr('stroke', 1 / transform.k)
    }
  })

</script>

<svg bind:this={svgId} width="400" height="400" id="map"></svg>

<style lang="css">
  #map {
    border: 1px solid whitesmoke
  }
</style>

