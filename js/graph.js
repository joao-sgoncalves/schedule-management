const trace1 = {
  name: 'Horário 1',
  x: ['Sobreposição', 'Sobrelotação'],
  y: [10, 15],
  type: 'scatter',
};

const trace2 = {
  name: 'Horário 2',
  x: ['Sobreposição', 'Sobrelotação'],
  y: [16, 5],
  type: 'scatter',
};

const data = [trace1, trace2];

const layout = {
  title: 'Qualidade dos Horários',
  xaxis: {
    title: 'Critério',
  },
  yaxis: {
    title: 'Valor',
  },
  legend: {
    title: {
      text: 'Horários',
    },
  },
};

Plotly.newPlot('quality-chart', data, layout, { responsive: true });

function createQualityChart() {
  const criteriaData = criteriaTable.getData();
  const criteriaIds = criteriaData.map((row) => row.id);
  const criteriaNames = criteriaData.map((row) => row.name);
  
  const graphData = [];
  const graphConfig = { responsive: true };

  classTables.forEach((table) => {
    const tableId = table.element.id;
    const tableNumber = parseInt(tableId.split('-').pop(), 10);

    // TODO: Avoid using IDs
    const tableNameInputId = `classes-name-input-${tableNumber}`;
    const tableName = $(`#${tableNameInputId}`).val();

    const calcResults = table.getCalcResults();
    const criteriaCalcs = criteriaIds.map((id) => {
      return calcResults.bottom[`criteria-${id}`];
    });

    const trace = {
      name: tableName,
      x: criteriaNames,
      y: criteriaCalcs,
      type: 'scatter',
    };

    graphData.push(trace);
  });

  Plotly.newPlot('quality-chart', graphData, layout, graphConfig);
}

$('#create-chart-btn').click(() => {
  createQualityChart();
});

// Garantir que se os critérios já existirem na tabela, deve-se iniciar logo as colunas da tabela com esses critérios
