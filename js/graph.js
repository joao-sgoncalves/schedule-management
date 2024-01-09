$(document).ready(() => {
  createQualityChart();
  createScheduleHeatmap();
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

function createScheduleHeatmap() {
  const data = [
    {
      name: 'Horário 1',
      x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      y: ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00'],
      z: [[1, 2, 3, 4, 5], [2, 3, 4, 5, 1], [3, 4, 1, 2, 1], [1, 1, 1, 1, 1], [2, 2, 2, 2, 2], [3, 3, 3, 3, 3]],
      type: 'heatmap',
    },
  ];

  const layout = {
    title: 'Distribuição de aulas por salas',
    xaxis: {
      title: 'Critério',
    },
    yaxis: {
      title: 'Valor',
    },
  };

  const config = { responsive: true };

  Plotly.newPlot('schedule-heatmap', data, layout, config);
}
