function createChart(selector, labels, values, layout) {
  const data = [{ x: labels, y: values, text: values, type: "bar" }];
  Plotly.newPlot(selector, data, layout);
}
