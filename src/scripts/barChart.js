function barChart(data) {
  // Declare the chart dimensions and margins.
  const width = 928;
  const height = 500;
  const marginTop = 30;
  const marginRight = 0;
  const marginBottom = 30;
  const marginLeft = 40;

  // Declare the x (horizontal position) scale.
  const x = d3.scaleBand()
      .domain(data.map(d => d.date.getFullYear()).sort((a, b) => a - b))
      .range([marginLeft, width - marginRight])
      .padding(0.5);

  // Declare the y (vertical position) scale.
  const yAxisMin = parseInt(data[0].populationHistorical) - 2;
  const y = d3.scaleLinear()
      .domain([yAxisMin, d3.max(data, (d) => d.populationHistorical + d.populationHistorical * 0.1)])
      .range([height - marginBottom, marginTop])

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  // Add a rect for each bar with a transition.
  svg.append("g")
    .attr("fill", "#29DEF2")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.date.getFullYear()))
    .attr("width", x.bandwidth())
    .attr("y", height - marginBottom) // Start at the bottom of the chart
    .attr("height", 0) // Start with a height of 0
    .transition() // Initialize transition
    .delay((d, i) => i * 50)
    .duration(2350) // Set the duration of the transition
    .attr("y", (d) => y(d.populationHistorical)) // End at the proper y position
    .attr("height", (d) => height - marginBottom - y(d.populationHistorical)); // Grow to the proper height

  // Add the x-axis and label.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add the y-axis and label, and remove the domain line.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickFormat((y) => (parseFloat(y).toFixed(2))))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("Population in Millions"));

  // Return the SVG element.
  return svg.node();
}

export default barChart;