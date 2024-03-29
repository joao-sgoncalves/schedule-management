const parseMetas = {};
const tables = {};

const variablesRegexp = /(\w+)\["([^"]+)"\]/g;
const diacriticsRegexp = /\p{Diacritic}/gu;
const extraSpacesRegexp = /\s+/g;

$(document).ready(() => {
  $('[data-bs-toggle="tooltip"]').tooltip({ trigger: "hover" });
});

function formatter(cell) {
  const data = cell.getData();
  const value = cell.getValue();

  if (data.id === 0) {
    return value;
  }

  const table = cell.getTable();
  const tableData = table.getData();

  const fieldsRow = tableData.find((row) => row.id === 0);
  const field = cell.getField();
  const expression = fieldsRow[field];

  if (expression === undefined) {
    return value;
  }

  const dataExpression = expression.replace(variablesRegexp, "data['$1']");
  const cellElement = cell.getElement();

  try {
    eval(dataExpression);
  } catch {
    $(cellElement).addClass("table-danger");
  }

  return value;
}

$("#upload-classes-btn").click(() => {
  const $classesInput = $("#classes-input");
  $classesInput[0].click();
});

$("#classes-input").change((event) => {
  const files = Array.from(event.target.files);

  const $classTables = $("#class-tables");
  const $lastTableContainer = $classTables.find(".table-container:last");

  const $lastTableId = $lastTableContainer.find(".table-id");
  const lastTableId = $lastTableId.text();
  const lastTableNumber = parseInt(lastTableId ? lastTableId : 0, 10);

  files.forEach((file, index) => {
    const tableNumber = lastTableNumber + index + 1;

    const containerId = `classes-container-${tableNumber}`;
    const tableId = `classes-table-${tableNumber}`;

    const filename = file.name;
    const filenameWithoutExt =
      filename.substring(0, filename.lastIndexOf(".")) || filename;

    $("#class-tables").append(`
      <div id="${containerId}" class="table-container d-inline-block mw-100 mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="table-full-name d-flex align-items-center"><h5 class="table-id mb-0">${tableNumber}</h5><h5 class="mb-0 mx-1"> - </h5><h5 class="table-name-heading table-name mb-0">${filenameWithoutExt}</h5></div>
          <div class="d-flex">
            <button
              class="upload-table-btn btn btn-outline-primary me-2"
              type="button"
              data-bs-toggle="tooltip"
              data-bs-title="Carregar tabela"
            >
              <i class="bi bi-upload"></i>
            </button>
            <input
              class="upload-table-input"
              type="file"
              accept="text/csv"
              hidden
            >
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

    parse(file, `#${tableId}`);

    $("#upload-classes-btn").hide();
  });

  $(event.target).val(null);
});

$("#upload-rooms-btn").click(() => {
  const $roomsInput = $("#rooms-input");
  $roomsInput[0].click();
});

$("#rooms-input").change((event) => {
  const files = Array.from(event.target.files);

  const $roomTables = $("#room-tables");
  const $lastTableContainer = $roomTables.find(".table-container:last");

  const $lastTableId = $lastTableContainer.find(".table-id");
  const lastTableId = $lastTableId.text();
  const lastTableNumber = parseInt(lastTableId ? lastTableId : 0, 10);

  files.forEach((file, index) => {
    const tableNumber = lastTableNumber + index + 1;

    const containerId = `rooms-container-${tableNumber}`;
    const tableId = `rooms-table-${tableNumber}`;

    const filename = file.name;
    const filenameWithoutExt =
      filename.substring(0, filename.lastIndexOf(".")) || filename;

    $("#room-tables").append(`
      <div id="${containerId}" class="table-container d-inline-block mw-100 mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="table-full-name d-flex align-items-center"><h5 class="table-id mb-0">${tableNumber}</h5><h5 class="mb-0 mx-1"> - </h5><h5 class="table-name-heading table-name mb-0">${filenameWithoutExt}</h5></div>
          <div class="d-flex">
            <button
              class="upload-table-btn btn btn-outline-primary me-2"
              type="button"
              data-bs-toggle="tooltip"
              data-bs-title="Carregar tabela"
            >
              <i class="bi bi-upload"></i>
            </button>
            <input
              class="upload-table-input"
              type="file"
              accept="text/csv"
              hidden
            >
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
              class="delete-table-btn btn btn-outline-danger"
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

    parse(file, `#${tableId}`);

    $("#upload-rooms-btn").hide();
  });

  const roomsContainerId = $roomTables.attr("id");
  const dataNameSelects = $roomTables.data("name-selects");

  updateTableNameSelects(`#${roomsContainerId}`, dataNameSelects);

  $(event.target).val(null);
});

$("body").on("click", ".table-name-heading", (event) => {
  const $target = $(event.target);
  const text = $target.text();

  const $input = $("<input></input>")
    .addClass("table-name-input table-name form-control w-auto")
    .attr("type", "text")
    .attr("value", text);

  $target.replaceWith($input);
  $input.focus();
});

$("body").on("blur", ".table-name-input", (event) => {
  const $target = $(event.target);
  const value = $target.val();

  const $heading = $("<h5></h5>")
    .addClass("table-name-heading table-name mb-0")
    .text(value);

  $target.replaceWith($heading);

  const $tablesContainer = $heading.closest(".tables-container");

  const containerId = $tablesContainer.attr("id");
  const dataNameSelects = $tablesContainer.data("name-selects");

  updateTableNameSelects(`#${containerId}`, dataNameSelects);

  const tableType = containerId.split("-", 1)[0];

  if (tableType === "class") {
    const $tableContainer = $heading.closest(".table-container");
    updateQualityTraceName($tableContainer);
  }
});

$("body").on("click", ".upload-table-btn", (event) => {
  const $target = $(event.target);
  const $tableContainer = $target.closest(".table-container");

  const $uploadTableInput = $tableContainer.find(".upload-table-input");
  $uploadTableInput[0].click();
});

$("body").on("change", ".upload-table-input", (event) => {
  const $target = $(event.target);
  const file = $target.prop("files")[0];

  const $tableContainer = $target.closest(".table-container");
  const containerId = $tableContainer.attr("id");

  parse(file, `#${containerId} .custom-table`);

  $target.val(null);
});

$("body").on("click", ".download-table-btn", (event) => {
  const $target = $(event.target);
  const $downloadTableBtn = $target.closest(".download-table-btn");
  const dataFileExtension = $downloadTableBtn.data("file-ext");

  const $tableContainer = $downloadTableBtn.closest(".table-container");
  const containerId = $tableContainer.attr("id");

  const tableId = $tableContainer.find(".table-id").text();
  const tableName = $tableContainer.find(".table-name").text();
  const filename = `${tableName || tableId}.${dataFileExtension}`;

  const table = tables[containerId];
  const data = table.getData();
  const dataToDownload = data.filter((row) => row.id > 0);

  if (dataFileExtension === "csv") {
    const parseMeta = parseMetas[containerId];
    const config = {
      delimiter: parseMeta.delimiter,
      header: true,
      linebreak: parseMeta.newline,
      columns: parseMeta.fields,
    };

    downloadCsv(filename, dataToDownload, config);
  } else {
    downloadJson(filename, dataToDownload);
  }
});

$("body").on("click", ".delete-table-btn", (event) => {
  const $target = $(event.target);
  const $tableContainer = $target.closest(".table-container");
  const containerId = $tableContainer.attr("id");
  const $tablesContainer = $tableContainer.closest(".tables-container");

  const containerIndex = $tableContainer.index();
  const tableType = containerId.split("-", 1)[0];

  $(`#upload-${tableType}-btn`).show();

  const $tooltips = $tableContainer.find('[data-bs-toggle="tooltip"]');
  $tooltips.tooltip("dispose");

  const table = tables[containerId];
  table.destroy();

  $tableContainer.remove();

  delete parseMetas[containerId];
  delete tables[containerId];

  const tablesContainerId = $tablesContainer.attr("id");
  const dataNameSelects = $tablesContainer.data("name-selects");

  updateTableNameSelects(`#${tablesContainerId}`, dataNameSelects);
});

function getTableInfos(selector) {
  const infos = [];

  $(`${selector} .table-container`).each((_index, container) => {
    const $container = $(container);
    const tableInfo = {};

    const $tableFullName = $container.find(".table-full-name");
    tableInfo.fullName = $tableFullName.text();

    const $tableId = $container.find(".table-id");
    tableInfo.id = parseInt($tableId.text(), 10);

    const $tableName = $container.find(".table-name");
    tableInfo.name = $tableName.is("input")
      ? $tableName.val()
      : $tableName.text();

    infos.push(tableInfo);
  });

  return infos;
}

function updateTableNameSelects(nameSelector, selectSelector) {
  const tableInfos = getTableInfos(nameSelector);

  $(`${selectSelector} .table-names-select`).each((_index, select) => {
    const $select = $(select);
    const selectedValue = $select.val();

    $select.empty();

    const $defaultOption = $("<option></option>")
      .attr("value", "-1")
      .text("-- Escolha uma opção --");

    $select.append($defaultOption);

    tableInfos.forEach((info) => {
      const $nameOption = $("<option></option>")
        .attr("value", info.id)
        .text(info.fullName);

      $select.append($nameOption);
    });

    const optionExists =
      $select.find(`option[value="${selectedValue}"]`).length > 0;
    const newSelectedValue = optionExists ? selectedValue : "-1";

    $select.val(newSelectedValue);
  });
}

function parse(file, tableSelector) {
  Papa.parse(file, {
    worker: true,
    header: true,
    complete: (results) => {
      const meta = results.meta;
      const data = results.data;
      const errors = results.errors;

      const $table = $(tableSelector);
      const $tableContainer = $table.closest(".table-container");
      const containerId = $tableContainer.attr("id");

      parseMetas[containerId] = meta;

      loadTable(tableSelector, meta.fields, data, errors);
    },
    error: (err) => {
      console.error(`Error parsing file '${file.name}'`, err);
    },
  });
}

function loadTable(selector, fields, data, errors) {
  const tableType = selector.split("-", 1)[0].substring(1);
  const tableFields = config.tableFields[tableType];

  const columns = getColumns(fields, tableFields);
  const tableColumns = columns;

  const tableData = data.map((row, index) => ({
    id: index,
    ...row,
  }));

  if (isTableCreated(selector)) {
    updateTable(selector, tableColumns, tableData);
  } else {
    createTable(selector, tableColumns, tableData);
  }
}

function isTableCreated(selector) {
  return $(selector).hasClass("tabulator");
}

function createTable(selector, columns, data) {
  const table = new Tabulator(selector, {
    columns,
    maxHeight: "50vh",
    layout: "fitDataTable",
    layoutColumnsOnNewData: true,
    data,
    scrollToColumnPosition: "middle",
    scrollToColumnIfVisible: false,
    placeholder: "Sem Dados",
    resizableRows: true,
  });

  const $table = $(selector);
  const $tableContainer = $table.closest(".table-container");
  const containerId = $tableContainer.attr("id");

  tables[containerId] = table;

  if (selector.includes("results")) {
    parseMetas[containerId] = {
      delimiter: ",",
      linebreak: "\n",
      aborted: false,
      truncated: false,
      cursor: 3018363,
      fields: [
        "Curso",
        "Unidade de execução",
        "Turno",
        "Turma",
        "Inscritos no turno",
        "Dia da Semana",
        "Início",
        "Fim",
        "Dia",
        "Características da sala pedida para a aula",
        "Nome Sala",
        "Capacidade Normal",
        "Características reais da sala",
      ],
    };
  }
}

function updateTable(selector, columns, data) {
  const $table = $(selector);
  const $tableContainer = $table.closest(".table-container");
  const containerId = $tableContainer.attr("id");
  const table = tables[containerId];

  table.setColumns(columns);
  table.setData(data);
}

function getColumns(fields, tableFields) {
  const columns = fields.map((field) => {
    return getColumn(field, tableFields);
  });

  return columns;
}

function formatter(cell) {
  const data = cell.getData();
  const value = cell.getValue();

  if (data.id === 0) {
    return value;
  }

  const table = cell.getTable();
  const tableData = table.getData();

  const fieldsRow = tableData.find((row) => row.id === 0);
  const field = cell.getField();
  const expression = fieldsRow[field];

  if (expression === undefined) {
    return value;
  }

  const dataExpression = expression.replace(variablesRegexp, "data['$1']");
  const cellElement = cell.getElement();

  try {
    eval(dataExpression);
  } catch {
    $(cellElement).addClass("table-danger");
  }

  return value;
}

function getTooltip(cell) {
  const data = cell.getData();
  let tooltip = undefined;

  if (data.id === 0) {
    return tooltip;
  }

  const table = cell.getTable();
  const tableData = table.getData();

  const fieldsRow = tableData.find((row) => row.id === 0);
  const field = cell.getField();
  const expression = fieldsRow[field];

  if (expression === undefined) {
    return tooltip;
  }

  const dataExpression = expression.replace(variablesRegexp, "data['$1']");

  try {
    eval(dataExpression);
  } catch (error) {
    tooltip = error.message;
  }

  return tooltip;
}

function mutator(value, data, _, _, component) {
  let newValue = value;

  if (data.id === 0) {
    return newValue;
  }

  const table = component.getTable();
  const tableData = table.getData();

  const fieldsRow = tableData.find((row) => row.id === 0);
  const field = component.getField();
  const expression = fieldsRow[field];

  if (expression === undefined) {
    return newValue;
  }

  const dataExpression = expression.replace(variablesRegexp, "data['$1']");

  try {
    newValue = eval(dataExpression);
  } catch {
    newValue = value;
  }

  return newValue;
}

function getColumn(title, tableFields) {
  return {
    field: getColumnField(title, tableFields),
    title,
    headerSortTristate: true,
    vertAlign: "middle",
    cellMouseOver: (_, cell) => {
      cellMouseOver(cell);
    },
    cellMouseOut: (_, cell) => {
      cellMouseOut(cell);
    },
  };
}

function cellMouseOver(cell) {
  const data = cell.getData();
  const row = cell.getRow();
  const rowElement = row.getElement();

  if (data.errors) {
    $(rowElement).removeClass("table-danger");
  }
}

function cellMouseOut(cell) {
  const data = cell.getData();
  const row = cell.getRow();
  const rowElement = row.getElement();

  if (data.errors) {
    $(rowElement).addClass("table-danger");
  }
}

function downloadCsv(filename, content, config) {
  const csvContent = Papa.unparse(content, config);
  const contentType = "text/csv;charset=utf-8";

  downloadFile(filename, csvContent, contentType);
}

function downloadJson(filename, content) {
  const jsonContent = JSON.stringify(content);
  const contentType = "application/json;charset=utf-8";

  downloadFile(filename, jsonContent, contentType);
}

function downloadFile(filename, content, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);

  const $link = $("<a></a>").attr("href", url).attr("download", filename);

  $link.appendTo("body");
  $link[0].click();

  $link.remove();
  window.URL.revokeObjectURL(url);
}

function getColumnField(title, tableFields) {
  const convertedTitle = autoAssignStringConversion(title);

  const fieldName = Object.keys(tableFields).find((name) => {
    const convertedField = autoAssignStringConversion(tableFields[name]);
    return convertedField === convertedTitle;
  });

  return fieldName ?? title;
}

function autoAssignStringConversion(str) {
  let newStr = str.toLowerCase();

  newStr = withoutExtraSpaces(newStr);
  newStr = withoutDiacritics(newStr);

  return newStr;
}

function withoutExtraSpaces(str) {
  return str.replace(extraSpacesRegexp, " ").trim();
}

function withoutDiacritics(str) {
  return str.normalize("NFD").replace(diacriticsRegexp, "");
}

function replaceExpression(
  expression,
  roomsContainerId,
  classesContainerId,
  classData,
  roomsData
) {
  const entities = {
    Aula: {
      data: "classData",
      fields: config.tableFields.classes,
      filledFields: getFilledFields(classesContainerId),
    },
    Sala: {
      data: "roomData",
      fields: config.tableFields.rooms,
      filledFields: roomsContainerId
        ? getFilledFields(roomsContainerId)
        : undefined,
    },
  };

  const entityKeys = Object.keys(entities);
  const errors = [];

  const convertedClassRoom = autoAssignStringConversion(classData.roomName);
  const roomNameField = entities["Sala"].fields["roomNameB"];
  const convertedRoomName = autoAssignStringConversion(roomNameField);
  let roomEntityReferenced = false;

  const newExpression = expression.replace(variablesRegexp, replacer);

  function replacer(variable, entity, field) {
    if (entity === "Sala") {
      roomEntityReferenced = true;
    }

    if (!entityKeys.includes(entity)) {
      errors.push(
        `Entidade '${entity}' não é válida. Utilize uma das seguintes entidades: ${entityKeys}`
      );
      return variable;
    }

    if (entity === "Sala" && !roomsContainerId) {
      errors.push(
        `Entidade '${entity}' não pode ser usada sem especificar a tabela de salas associada.`
      );
      return variable;
    }

    const entityFields = entities[entity].fields;
    const fieldNames = Object.values(entityFields);
    const filledFields = entities[entity].filledFields;
    const convertedField = autoAssignStringConversion(field);

    if (
      !fieldNames.some(
        (name) => autoAssignStringConversion(name) === convertedField
      )
    ) {
      errors.push(
        `Campo '${field}' não é válido para a entidade '${entity}'. Utilize um dos seguintes campos: ${fieldNames}`
      );
      return variable;
    }

    if (
      !filledFields.some(
        (field) => autoAssignStringConversion(field) === convertedField
      )
    ) {
      errors.push(
        `Campo '${field}' não está associado a qualquer coluna da tabela para a entidade '${entity}'.`
      );
      return variable;
    }

    if (
      entity === "Sala" &&
      !filledFields.some(
        (field) => autoAssignStringConversion(field) === convertedRoomName
      )
    ) {
      errors.push(
        `Campo '${roomNameField}' não está associado a qualquer coluna da tabela para a entidade '${entity}'.`
      );
      return variable;
    }

    const dataName = entities[entity].data;
    const fieldName = Object.keys(entityFields).find((key) => {
      return autoAssignStringConversion(entityFields[key]) === convertedField;
    });

    return `${dataName}["${fieldName}"]`;
  }

  let roomData;
  if (errors.length === 0 && roomEntityReferenced) {
    roomData = roomsData.find(
      (row) => autoAssignStringConversion(row.roomNameB) === convertedClassRoom
    );
  }

  return { newExpression, errors, roomData };
}

function getFilledFields(containerId) {
  const table = tables[containerId];
  const fieldsRow = table.getRow(0);
  const fieldsData = fieldsRow.getData();

  return Object.values(fieldsData).filter((field) => field);
}

// TODO: Error tooltips and cell format as error
// TODO: Convert column to correct type
