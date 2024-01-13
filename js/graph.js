const scheduleWeekDays = getWeekDays();
const scheduleTimes = getTimes();

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

function createScheduleHeatmap($tableContainer) {
  const tableId = $tableContainer.find('.table-id').text();
  const heatmapId = `schedule-heatmap-${tableId}`;

  const tableContainerId = $tableContainer.attr('id');
  const tableFullName = $tableContainer.find('.table-full-name').text();

  const { scheduleData, min, max } = getScheduleData(tableContainerId);

  const data = [
    {
      x: scheduleWeekDays,
      y: scheduleTimes,
      z: scheduleData,
      type: 'heatmap',
      colorscale: 'Hot',
      xgap: 2,
      ygap: 2,
    },
  ];

  const annotations = getScheduleAnnotations(scheduleData, min, max);

  const layout = {
    title: `Distribuição de aulas por salas (${tableFullName})`,
    annotations,
    xaxis: {
      title: {
        text: 'Dias da semana',
        standoff: 30,
      },
      tickmode: 'linear',
      showgrid: false,
      ticks: '',
    },
    yaxis: {
      title: {
        text: 'Horas',
        standoff: 20,
      },
      tickmode: 'linear',
      showgrid: false,
      ticks: '',
    },
    margin: {
      pad: 10,
    },
    height: 1000,
  };

  const config = { responsive: true };

  Plotly.newPlot(heatmapId, data, layout, config);
}

function getScheduleData(tableContainerId) {
  const table = tables[tableContainerId];
  const tableData = table.getData();
  const scheduleData = [];

  let min = Infinity;
  let max = 0;

  scheduleTimes.forEach((time) => {
    const timeData = [];

    scheduleWeekDays.forEach((day) => {
      const classesOnTime = tableData.filter((row) => {
        if (row.id === 0) {
          return false;
        }

        if (!row.dayOfTheWeek || !row.start || !row.end) {
          return false;
        }

        const startTime = row.start.toFormat('HH:mm');
        const endTime = row.end.toFormat('HH:mm');

        return day.startsWith(row.dayOfTheWeek) && time >= startTime && time < endTime;
      }).length;

      if (classesOnTime < min) {
        min = classesOnTime;
      }

      if (classesOnTime > max) {
        max = classesOnTime;
      }

      timeData.push(classesOnTime);
    });

    scheduleData.push(timeData);
  });

  return { scheduleData, min, max };
}

function updateHeatmapTitle($tableContainer) {
  const tableId = $tableContainer.find('.table-id').text();
  const heatmapId = `schedule-heatmap-${tableId}`;
  const tableFullName = $tableContainer.find('.table-full-name').text();

  const update = {
    title: `Distribuição de aulas por salas (${tableFullName})`,
  };

  Plotly.relayout(heatmapId, update);
}

function updateScheduleHeatmap($tableContainer) {
  const tableId = $tableContainer.find('.table-id').text();
  const heatmapId = `schedule-heatmap-${tableId}`;
  const tableContainerId = $tableContainer.attr('id');

  const { scheduleData, min, max } = getScheduleData(tableContainerId);

  const data_update = {
    z: [scheduleData],
  };

  const annotations = getScheduleAnnotations(scheduleData, min, max);

  const layout_update = {
    annotations,
  };

  Plotly.update(heatmapId, data_update, layout_update);
}

function deleteScheduleHeatmap(tableId) {
  const heatmapId = `schedule-heatmap-${tableId}`;
  const $heatmap = $(`#${heatmapId}`);

  Plotly.purge(heatmapId);
  $heatmap.remove();
}

function getWeekDays() {
  return ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
}

function getTimes() {
  const startHour = 8;
  const endHour = 23;
  const times = [];

  for (let i = startHour; i <= endHour; i++) {
    const hourStr = i.toString().padStart(2, '0');

    times.push(`${hourStr}:00`);

    if (i < endHour) {
      times.push(`${hourStr}:30`);
    }
  }

  times.reverse();
  return times;
}

function getScheduleAnnotations(scheduleData, min, max) {
  const midpoint = (max + min) / 2;
  const annotations = [];

  for (var i = 0; i < scheduleTimes.length; i++) {
    for (var j = 0; j < scheduleWeekDays.length; j++) {
      var currentValue = scheduleData[i][j];
      const textColor = currentValue <= midpoint ? 'white' : 'black';

      var result = {
        xref: 'x1',
        yref: 'y1',
        x: scheduleWeekDays[j],
        y: scheduleTimes[i],
        text: scheduleData[i][j],
        font: {
          family: 'Arial',
          size: 12,
          color: 'rgb(50, 171, 96)'
        },
        showarrow: false,
        font: {
          color: textColor,
        },
      };

      annotations.push(result);
    }
  }

  return annotations;
}
