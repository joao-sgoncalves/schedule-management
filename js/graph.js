$(document).ready(() => {
  createQualityChart();
});

function createQualityChart() {
  const layout = {
    title: 'Qualidade dos Horários',
    xaxis: {
      title: 'Critério',
    },
    yaxis: {
      title: 'Valor',
    },
    showlegend: true,
    legend: {
      title: {
        text: 'Horários',
      },
    },
  };

  const config = { responsive: true };

  Plotly.newPlot('quality-chart', [], layout, config);
}

function addQualityTrace($container) {
  const $tableFullName = $container.find('.table-full-name');
  const tableFullName = $tableFullName.text();

  const trace = {
    name: tableFullName,
    type: 'scatter',
  };

  Plotly.addTraces('quality-chart', trace);
}

function updateQualityData($container) {
  const containerId = $container.attr('id');
  const table = tables[containerId];

  const criteriaData = criteriaTable.getData();
  const criteriaIds = criteriaData.map((row) => row.id);
  const criteriaNames = criteriaData.map((row) => row.name);

  const calcResults = table.getCalcResults();
  const criteriaCalcs = criteriaIds.map((id) => {
    return calcResults.bottom[`criteria-${id}`];
  });

  const update = {
    x: [criteriaNames],
    y: [criteriaCalcs],
  };

  const traceIndex = $container.index();
  
  console.log('update', update);
  Plotly.restyle('quality-chart', update, traceIndex);
}

function updateQualityTraceName($container) {
  const $tableFullName = $container.find('.table-full-name');
  const tableFullName = $tableFullName.text();

  const traceIndex = $container.index();

  Plotly.restyle('quality-chart', { name: tableFullName }, traceIndex);
}

function removeQualityTrace(traceIndex) {
  Plotly.deleteTraces('quality-chart', traceIndex);
}
