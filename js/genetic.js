const worker = new Worker("js/genetic-worker.js");

$(".start-btn").on("click", () => {
  const criteria = {
    overlapping: $("#overlapping").is(":checked"),
    overcrowded: $("#overcrowded").is(":checked"),
    characteristics: $("#characteristics").is(":checked"),
    generations: parseInt($("#generations").val()),
    popSize: parseInt($("#pop-size").val()),
  };

  let classes = tables["classes-container-1"];
  classes = classes.getData();
  let classrooms = tables["rooms-container-1"];
  classrooms = classrooms.getData();

  worker.postMessage({
    classes,
    classrooms,
    criteria,
  });
});

worker.onmessage = (msg) => {
  const $resultTables = $("#result-tables");
  const $lastTableContainer = $resultTables.find(".table-container:last");

  const $lastTableId = $lastTableContainer.find(".table-id");
  const lastTableId = $lastTableId.text();
  const lastTableNumber = parseInt(lastTableId ? lastTableId : 0, 10);

  const labels = [];
  const overlappingData = [];
  const overcrowdedData = [];
  const characteristicsData = [];

  msg.data.forEach(({ classes, score }, index) => {
    const tableNumber = lastTableNumber + index + 1;

    const containerId = `results-container-${tableNumber}`;
    const tableId = `results-table-${tableNumber}`;

    const filename = `Horário`;

    $("#result-tables").append(`
      <div id="${containerId}" class="table-container d-inline-block mw-100 mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="table-full-name d-flex align-items-center"><h5 class="table-id mb-0">${tableNumber}</h5><h5 class="mb-0 mx-1"> - </h5><h5 class="table-name-heading table-name mb-0">${filename}</h5></div>
          <div class="d-flex">
            <button
              class="download-table-btn btn btn-outline-primary me-2"
              type="button"
              data-bs-toggle="tooltip"
              data-bs-title="Descarregar tabela"
              data-file-ext="csv"
            >
              <i class="bi bi-download"></i>
            </button>
            <button
              class="btn btn-outline-danger delete-table-btn"
              type="button"
              data-bs-toggle="tooltip"
              data-bs-title="Remover tabela"
            >
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>

        <div id="${tableId}" class="custom-table mw-100"></div>
      </div>
    `);

    const tooltipsSelector = `#${containerId} [data-bs-toggle="tooltip"]`;
    $(tooltipsSelector).tooltip({ trigger: "hover" });

    const fields = Object.keys(classes[0]).map((field) => {
      return {
        field: field,
        headerSortTristate: true,
        title: field,
        vertAlign: "middle",
      };
    });

    labels.push(`${tableNumber} - ${filename}`);
    overlappingData.push(score.overlapping);
    overcrowdedData.push(score.overcrowded);
    characteristicsData.push(score.characteristics);

    createTable(`#${containerId} .custom-table`, fields, classes);
  });

  createChart("overlapping-chart", labels, overlappingData, {
    title: "Sobreposições",
  });
  createChart("overcrowded-chart", labels, overcrowdedData, {
    title: "Superlotação",
  });
  createChart("characteristics-chart", labels, characteristicsData, {
    title: "Características Pedidas",
  });
};
