const parseMetas = {};
const tables = {};
const criteriaTable = createCriteriaTable();

const variablesRegexp = /(\w+)\["([^"]+)"\]/g;
const diacriticsRegexp = /\p{Diacritic}/gu;
const extraSpacesRegexp = /\s+/g;

$(document).ready(() => {
  $('[data-bs-toggle="tooltip"]').tooltip({ trigger: 'hover' });
});

function createCriteriaTable() {
  const containerId = 'criteria-container';
  const $table = $(`#${containerId} .custom-table`);
  
  const columns = getCriteriaColumns();
  const data = getLocalCriteria() || config.defaultCriteria;
  
  const options = {
    columns,
    data,
    maxHeight: '50vh',
    layout: 'fitDataTable',
    layoutColumnsOnNewData: true,
    placeholder: 'Sem Dados',
    resizableRows: true,
  };

  const table = new Tabulator($table[0], options);
  tables[containerId] = table;

  return table;
}

function getCriteriaColumns() {
  return [
    {
      title: 'ID',
      field: 'id',
      sorter: 'number',
      headerSortTristate: true,
      vertAlign: 'middle',
    },
    {
      title: 'Nome',
      field: 'name',
      editor: 'input',
      sorter: 'string',
      headerSortTristate: true,
      vertAlign: 'middle',
    },
    {
      title: 'Expressão',
      field: 'expression',
      editor: 'input',
      sorter: 'string',
      headerSortTristate: true,
      vertAlign: 'middle',
    },
    {
      title: 'Agregador',
      field: 'aggregator',
      editor: 'list',
      editorParams: {
        values: ['AVG', 'MAX', 'MIN', 'SUM', 'CONCAT', 'COUNT', 'UNIQUE'],
        clearable: true,
        placeholderEmpty: 'Sem Resultados',
        autocomplete: true,
        allowEmpty: true,
        listOnEmpty: true,
      },
      sorter: 'string',
      headerSortTristate: true,
      vertAlign: 'middle',
    },
    {
      field: 'delete',
      tooltip: 'Remover critério',
      formatter: () => {
        return '<i class="bi bi-trash-fill text-danger"></i>';
      },
      cellClick: (_event, cell) => {
        const row = cell.getRow();
        row.delete();
      },
      hozAlign: 'center',
      vertAlign: 'middle',
    },
  ];
}

criteriaTable.on('dataLoaded', (data) => {
  updateLocalCriteria(data);
});

criteriaTable.on('dataChanged', (data) => {
  updateLocalCriteria(data);
});

criteriaTable.on('rowAdded', (row) => {
  const rowId = row.getIndex();

  $('#class-tables').children('.table-container').each((_index, container) => {
    const $container = $(container);
    const containerId = $container.attr('id');

    const table = tables[containerId];
    const criteriaField = `criteria-${rowId}`;

    table.addColumn({
      field: criteriaField,
      mutator: (value, data, _type, _params, component) => {
        return qualityMutator(value, data, component);
      },
      headerSortTristate: true,
      vertAlign: 'middle',
    }).then(() => {
      table.scrollToColumn(criteriaField);
    });
  });
});

criteriaTable.on('rowDeleted', (row) => {
  const rowId = row.getIndex();
  const criteriaField = `criteria-${rowId}`;

  $('#class-tables').children('.table-container').each((_index, container) => {
    const $container = $(container);
    const containerId = $container.attr('id');
    const table = tables[containerId];

    const columns = table.getColumns();
    const criteriaIndex = columns.findIndex((column) => column.getField() === criteriaField);
    const previousColumnField = columns[criteriaIndex - 1].getField();

    table.deleteColumn(criteriaField)
      .then(() => table.scrollToColumn(previousColumnField));
  });
});

function getLocalCriteria() {
  const jsonData = localStorage.getItem('qualityCriteria');
  return JSON.parse(jsonData);
}

function updateLocalCriteria(data) {
  const jsonData = JSON.stringify(data);
  localStorage.setItem('qualityCriteria', jsonData);
}

criteriaTable.on('cellEdited', (cell) => {
  const field = cell.getField();
  const value = cell.getValue();
  const data = cell.getData();
  const criteriaField = `criteria-${data.id}`;

  if (field === 'name') {
    $('#class-tables').children('.table-container').each((_index, container) => {
      const $container = $(container);
      const containerId = $container.attr('id');
      const table = tables[containerId];

      table.updateColumnDefinition(criteriaField, { title: value })
        .then(() => table.scrollToColumn(criteriaField));
    });
  } else if (field === 'expression') {
    $('#class-tables').children('.table-container').each((_index, container) => {
      const $container = $(container);
      const containerId = $container.attr('id');

      const table = tables[containerId];
      const criteriaColumn = table.getColumn(criteriaField);
      const classesData = table.getData();

      const updatedData = classesData.map((row) => ({
        id: row.id,
        [criteriaField]: qualityMutator(row[criteriaField], row, criteriaColumn),
      }));

      table.updateData(updatedData)
        .then(() => table.scrollToColumn(criteriaField));
    });
  } else if (field === 'aggregator') {
    $('#class-tables').children('.table-container').each((_index, container) => {
      const $container = $(container);
      const containerId = $container.attr('id');
      const table = tables[containerId];

      table.updateColumnDefinition(criteriaField, { bottomCalc: value.toLowerCase() })
        .then(() => table.scrollToColumn(criteriaField));
    });
  }
});

function qualityMutator(value, data, component) {
  const field = component.getField();

  const qualityData = criteriaTable.getData();
  const criteriaData = qualityData.find((data) => data.id === field);

  // use [Field] and [class.Field]

  return eval(criteriaData.expression);
}

$('#classes-input').change((event) => {
  const files = Array.from(event.target.files);

  const $classTables = $('#class-tables');
  const $lastTableContainer = $classTables.find('.table-container:last');
  
  const $lastTableId = $lastTableContainer.find('.table-id');
  const lastTableId = $lastTableId.text();
  const lastTableNumber = parseInt(lastTableId ? lastTableId : 0, 10);

  files.forEach((file, index) => {
    const tableNumber = lastTableNumber + index + 1;

    const containerId = `classes-container-${tableNumber}`;
    const tableId = `classes-table-${tableNumber}`;
    const roomsSelectId = `rooms-select-${tableNumber}`;

    const filename = file.name;
    const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;

    const roomTableInfos = getTableInfos('#room-tables');

    const $roomsSelect = $('<select></select>')
      .attr('id', roomsSelectId)
      .addClass('table-names-select form-select w-auto')
      .attr('aria-label', 'Selecionar tabela de salas');

    const $defaultOption = $('<option></option>')
      .attr('value', '-1')
      .text('-- Escolha uma opção --');

    $roomsSelect.append($defaultOption);

    roomTableInfos.forEach((info) => {
      const $nameOption = $('<option></option>')
        .attr('value', info.id)
        .text(info.fullName);

      $roomsSelect.append($nameOption);
    });

    const roomsSelectHtml = $roomsSelect.prop('outerHTML');

    $('#class-tables').append(`
      <div id="${containerId}" class="table-container d-inline-block mw-100 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="table-full-name d-flex align-items-center"><h5 class="table-id mb-0">${tableNumber}</h5><h5 class="mb-0 mx-1"> - </h5><h5 class="table-name-heading table-name mb-0">${filenameWithoutExt}</h5></div>
          <div class="d-flex">
            <div class="d-flex align-items-center me-3">
              <label class="form-label mb-0 me-2" for="${roomsSelectId}">Tabela de salas:</label>
              ${roomsSelectHtml}
            </div>
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
    $(tooltipsSelector).tooltip({ trigger: 'hover' });

    parse(file, `#${tableId}`);
  });

  $(event.target).val(null);
});

$('#rooms-input').change((event) => {
  const files = Array.from(event.target.files);

  const $roomTables = $('#room-tables');
  const $lastTableContainer = $roomTables.find('.table-container:last');
  
  const $lastTableId = $lastTableContainer.find('.table-id');
  const lastTableId = $lastTableId.text();
  const lastTableNumber = parseInt(lastTableId ? lastTableId : 0, 10);

  files.forEach((file, index) => {
    const tableNumber = lastTableNumber + index + 1;

    const containerId = `rooms-container-${tableNumber}`;
    const tableId = `rooms-table-${tableNumber}`;

    const filename = file.name;
    const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;

    $('#room-tables').append(`
      <div id="${containerId}" class="table-container d-inline-block mw-100 mb-3">
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
              class="delete-table-btn btn btn-outline-danger delete-rooms-btn"
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
    $(tooltipsSelector).tooltip({ trigger: 'hover' });

    parse(file, `#${tableId}`);
  });

  const roomsContainerId = $roomTables.attr('id');
  const dataNameSelects = $roomTables.data('name-selects');

  updateTableNameSelects(`#${roomsContainerId}`, dataNameSelects);

  $(event.target).val(null);
});

$('body').on('click', '.table-name-heading', (event) => {
  const $target = $(event.target);
  const text = $target.text();

  const $input = $('<input></input>')
    .addClass('table-name-input table-name form-control w-auto')
    .attr('type', 'text')
    .attr('value', text);

  $target.replaceWith($input);
  $input.focus();
});

$('body').on('blur', '.table-name-input', (event) => {
  const $target = $(event.target);
  const value = $target.val();

  const $heading = $('<h5></h5>')
    .addClass('table-name-heading table-name mb-0')
    .text(value);

  $target.replaceWith($heading);

  const $tablesContainer = $heading.closest('.tables-container');
  
  const containerId = $tablesContainer.attr('id');
  const dataNameSelects = $tablesContainer.data('name-selects');

  updateTableNameSelects(`#${containerId}`, dataNameSelects);
});

$('body').on('click', '.upload-table-btn', (event) => {
  const $target = $(event.target);
  const $tableContainer = $target.closest('.table-container');

  const $uploadTableInput = $tableContainer.find('.upload-table-input');
  $uploadTableInput[0].click();
});

$('body').on('change', '.upload-table-input', (event) => {
  const $target = $(event.target);
  const file = $target.prop('files')[0];

  const $tableContainer = $target.closest('.table-container');
  const containerId = $tableContainer.attr('id');

  if (containerId === 'criteria-container') {
    updateCriteriaTable(containerId, file);
  } else {
    parse(file, `#${containerId} .custom-table`);
  }

  $target.val(null);
});

$('body').on('click', '.download-table-btn', (event) => {
  const $target = $(event.target);
  const $downloadTableBtn = $target.closest('.download-table-btn');
  const dataFileExtension = $downloadTableBtn.data('file-ext');

  const $tableContainer = $downloadTableBtn.closest('.table-container');
  const containerId = $tableContainer.attr('id');

  const tableId = $tableContainer.find('.table-id').text();
  const tableName = $tableContainer.find('.table-name').text();
  const filename = `${tableName || tableId}.${dataFileExtension}`;

  const table = tables[containerId];
  const data = table.getData();
  const dataToDownload = data.filter((row) => row.id > 0);

  if (dataFileExtension === 'csv') {
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

$('body').on('click', '.delete-table-btn', (event) => {
  const $target = $(event.target);
  const $tableContainer = $target.closest('.table-container');
  const containerId = $tableContainer.attr('id');
  const $tablesContainer = $tableContainer.closest('.tables-container');

  const $tooltips = $tableContainer.find('[data-bs-toggle="tooltip"]');
  $tooltips.tooltip('dispose');

  $tableContainer.remove();

  delete parseMetas[containerId];
  delete tables[containerId];
  
  const tablesContainerId = $tablesContainer.attr('id');
  const dataNameSelects = $tablesContainer.data('name-selects');

  updateTableNameSelects(`#${tablesContainerId}`, dataNameSelects);
});

$('body').on('click', '.add-row-btn', (event) => {
  const $target = $(event.target);
  const $tableContainer = $target.closest('.table-container');
  const containerId = $tableContainer.attr('id');

  const table = tables[containerId];
  const data = table.getData();

  const lastRowData = data.at(-1);
  const newRowData = { 'id': (lastRowData?.id ?? 0) + 1 };

  table.addRow(newRowData)
    .then(() => table.scrollToRow(newRowData.id));
});

function getTableInfos(selector) {
  const infos = [];

  $(`${selector} .table-container`).each((_index, container) => {
    const $container = $(container);
    const tableInfo = {};

    const $tableFullName = $container.find('.table-full-name');
    tableInfo.fullName = $tableFullName.text();

    const $tableId = $container.find('.table-id');
    tableInfo.id = parseInt($tableId.text(), 10);

    const $tableName = $container.find('.table-name');
    tableInfo.name = $tableName.is('input') ? $tableName.val() : $tableName.text();

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

    const $defaultOption = $('<option></option>')
      .attr('value', '-1')
      .text('-- Escolha uma opção --');

    $select.append($defaultOption);

    tableInfos.forEach((info) => {
      const $nameOption = $('<option></option>')
        .attr('value', info.id)
        .text(info.fullName);

      $select.append($nameOption);
    });

    const optionExists = $select.find(`option[value="${selectedValue}"]`).length > 0;
    const newSelectedValue = optionExists ? selectedValue : '-1';

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
      const $tableContainer = $table.closest('.table-container');
      const containerId = $tableContainer.attr('id');

      parseMetas[containerId] = meta;

      loadTable(tableSelector, meta.fields, data, errors);
    },
    error: (err) => {
      console.error(`Error parsing file '${file.name}'`, err);
    },
  });
}

function updateCriteriaTable(containerId, file) {
  const table = tables[containerId];

  const reader = new FileReader();

  reader.onload = (event) => {
    const jsonContent = event.target.result;
    const data = JSON.parse(jsonContent);

    table.setData(data);
  };

  reader.onerror = () => {
    console.error(`Error reading file '${file.name}'`);
  };

  reader.readAsText(file, 'utf-8');
}

function loadTable(selector, fields, data, errors) {
  const columns = getColumns(fields);

  const tableData = [{}, ...data].map((row, index) => ({
    id: index,
    ...row,
  }));

  errors.forEach((error) => {
    let rowId = 0;

    if (error.row !== undefined) {
      rowId = error.type === 'Quotes' ? error.row : error.row + 1;
    }

    const row = tableData.find((row) => row.id === rowId);

    if (row.errors === undefined) {
      row.errors = error.message;
    } else {
      row.errors += '\n' + error.message;
    }
  });

  if (isTableCreated(selector)) {
    updateTable(selector, columns, tableData);
  } else {
    createTable(selector, columns, tableData);
  }
}

function isTableCreated(selector) {
  return $(selector).hasClass('tabulator');
}

function createTable(selector, columns, data) {
  const table = new Tabulator(selector, {
    columns,
    rowFormatter,
    frozenRows: 1,
    // height: '500px',
    maxHeight: '50vh',
    layout: 'fitDataTable',
    layoutColumnsOnNewData: true,
    data,
    scrollToColumnPosition: 'middle',
    scrollToColumnIfVisible: false,
    placeholder: 'Sem Dados',
    resizableRows: true,
  });

  const $table = $(selector);
  const $tableContainer = $table.closest('.table-container');
  const containerId = $tableContainer.attr('id');

  tables[containerId] = table;

  table.on('tableBuilt', () => {
    autoAssignTableFields(containerId);
    addCriteriaColumns(containerId);
  });

  table.on('dataProcessed', () => {
    if (!table.initialized) {
      return;
    }

    autoAssignTableFields(containerId);
    addCriteriaColumns(containerId);
  });

  table.on('cellEdited', (cell) => cellEdited(cell));
}

function cellEdited(cell, scrollToColumn = true) {
  const table = cell.getTable();
  const data = table.getData();

  const column = cell.getColumn();
  const definition = column.getDefinition();
  const columnTitle = definition.title;

  const cellField = cell.getField();
  const cellValue = cell.getValue();

  const tableId = table.element.id;
  const tableType = tableId.split('-', 1)[0];

  const fields = config.tableFields[tableType];
  const fieldName = Object.keys(fields).find((name) => {
    return fields[name] === cellValue;
  }) ?? columnTitle;

  const newData = data.map((row) => ({
    id: row.id,
    [cellField]: undefined,
    [fieldName]: row[cellField],
  }));

  table.updateData(newData)
    .then(() => {
      table.updateColumnDefinition(cellField, { field: fieldName })
        .then(() => {
          if (scrollToColumn) {
            table.scrollToColumn(fieldName);
          }
        });
    });
}

function updateTable(selector, columns, data) {
  const $table = $(selector);
  const $tableContainer = $table.closest('.table-container');
  const containerId = $tableContainer.attr('id');
  const table = tables[containerId];

  table.setColumns(columns);
  table.setData(data);
}

function getColumns(fields) {
  const columns = fields.map((field) => {
    return getColumn(field, field);
  });

  const idColumn = {
    title: 'ID',
    field: 'id',
    sorter: 'number',
    headerSortTristate: true,
    vertAlign: 'middle',
  };
  columns.unshift(idColumn);

  const errorsColumn = getColumn('Erros', 'errors');
  columns.push(errorsColumn);

  // columns.push({
  //   title: 'Custom',
  //   field: 'Custom',
  //   editableTitle: true,
  //   editable,
  //   editor: 'input',
  //   mutator,
  //   tooltip: (_, cell) => {
  //     return getTooltip(cell);
  //   },
  //   formatter,
  // });

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
    $(cellElement).addClass('table-danger');
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

  // console.log('expression:', expression);
  // console.log('dataExpression:', dataExpression);
  // console.log('data:', data);
  // console.log('newValue:', newValue);

  const dataExpression = expression.replace(variablesRegexp, "data['$1']");

  try {
    newValue = eval(dataExpression);
  } catch {
    newValue = value;
  }

  return newValue;
}

function getColumn(title, field) {
  return {
    title,
    field,
    headerSortTristate: true,
    vertAlign: 'middle',
    formatter: field === 'errors' ? 'textarea' : undefined,
    editable,
    editor: 'list',
    editorParams: {
      valuesLookup,
      clearable: true,
      placeholderEmpty: 'Sem Resultados',
      autocomplete: true,
      allowEmpty: true,
      listOnEmpty: true,
    },
    cellMouseOver: (_, cell) => {
      cellMouseOver(cell);
    },
    cellMouseOut: (_, cell) => {
      cellMouseOut(cell);
    },
  };
}

function editable(cell) {
  const row = cell.getRow();

  // row instanceof RowComponent ??
  if (row._row.type !== 'row') {
    return false;
  }

  const rowIndex = row.getIndex();
  const field = cell.getField();

  return rowIndex === 0 && field !== 'errors';
}

function valuesLookup(cell) {
  const table = cell.getTable();
  const tableId = table.element.id;
  const tableType = tableId.split('-', 1)[0];

  const cellValue = cell.getValue();
  const rowData = cell.getData();
  const rowValues = Object.values(rowData);
  const fields = config.tableFields[tableType];

  return Object.values(fields).filter((value) => {
    return value === cellValue || !rowValues.includes(value);
  });
}

function cellMouseOver(cell) {
  const data = cell.getData();
  const row = cell.getRow();
  const rowElement = row.getElement();

  if (data.errors) {
    $(rowElement).removeClass('table-danger');
  }
}

function cellMouseOut(cell) {
  const data = cell.getData();
  const row = cell.getRow();
  const rowElement = row.getElement();

  if (data.errors) {
    $(rowElement).addClass('table-danger');
  }
}

function rowFormatter(row) {
  const data = row.getData();
  const rowElement = row.getElement();

  if (data.errors) {
    $(rowElement).addClass("table-danger");
  }
}

function downloadCsv(filename, content, config) {
  const csvContent = Papa.unparse(content, config);
  const contentType = 'text/csv;charset=utf-8';

  downloadFile(filename, csvContent, contentType);
}

function downloadJson(filename, content) {
  const jsonContent = JSON.stringify(content);
  const contentType = 'application/json;charset=utf-8';

  downloadFile(filename, jsonContent, contentType);
}

function downloadFile(filename, content, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);

  const $link = $('<a></a>')
    .attr('href', url)
    .attr('download', filename);

  $link.appendTo('body');
  $link[0].click();

  $link.remove();
  window.URL.revokeObjectURL(url);
}

// TODO: Do this on the table that is not yet built, to improve performance
function autoAssignTableFields(containerId) {
  const table = tables[containerId];
  const tableId = table.element.id;
  const tableType = tableId.split('-', 1)[0];
  const columns = table.getColumns();

  const fieldsRow = table.getRow(0);
  const fieldsData = fieldsRow.getData();
  const fields = config.tableFields[tableType];
  const updatedFieldsData = { id: fieldsData.id };

  columns.forEach((column) => {
    const definition = column.getDefinition();
    const title = definition.title;
    const field = definition.field;
    const fieldValue = fieldsData[field];

    if (['id', 'errors'].includes(field) || fieldValue) {
      return;
    }

    const titleComparisonStr = autoAssignStringConversion(title);
    const fieldName = Object.keys(fields).find((name) => {
      const fieldComparisonStr = autoAssignStringConversion(fields[name]);
      return fieldComparisonStr === titleComparisonStr;
    });

    if (fieldName) {
      updatedFieldsData[field] = fields[fieldName];
    }
  });

  table.updateData([updatedFieldsData])
    .then(() => {
      const fieldCells = fieldsRow.getCells();

      fieldCells.forEach((cell) => {
        const cellField = cell.getField();

        if (cellField === 'id') {
          return;
        }

        if (!Object.keys(updatedFieldsData).includes(cellField)) {
          return;
        }

        cellEdited(cell, false);
      });
    });
}

// TODO: Do this on the table that is not yet built, to improve performance
function addCriteriaColumns(containerId) {
  const table = tables[containerId];
  const tableId = table.element.id;
  const tableType = tableId.split('-', 1)[0];

  if (tableType !== 'classes') {
    return;
  }

  const criteriaData = criteriaTable.getData();

  criteriaData.forEach((row) => {
    const criteriaField = `criteria-${row.id}`;
    
    const columnDefinition = {
      field: criteriaField,
      mutator: (value, data, _type, _params, component) => {
        return qualityMutator(value, data, component);
      },
      headerSortTristate: true,
      vertAlign: 'middle',
    };

    if (row.name) {
      columnDefinition.title = row.name;
    }

    // TODO: Implement expression!

    if (row.aggregator) {
      columnDefinition.bottomCalc = row.aggregator.toLowerCase();
    }

    table.addColumn(columnDefinition);
  });
}

function autoAssignStringConversion(str) {
  let newStr = str.toLowerCase();
  
  newStr = withoutExtraSpaces(newStr);
  newStr = withoutDiacritics(newStr);

  return newStr;
}

function withoutExtraSpaces(str) {
  return str.replace(extraSpacesRegexp, ' ').trim();
}

function withoutDiacritics(str) {
  return str.normalize('NFD').replace(diacriticsRegexp, '');
}

function replaceExpression(expression, roomsContainerId, classesContainerId) {
  const entities = {
    'Aula': {
      data: 'classData',
      fields: config.tableFields.classes,
      filledFields: getFilledFields(classesContainerId),
    },
    'Sala': {
      data: 'roomData',
      fields: config.tableFields.rooms,
      filledFields: roomsContainerId ? getFilledFields(roomsContainerId) : undefined,
    },
  };
  
  const entityKeys = Object.keys(entities);
  const errors = [];

  const newExpression = expression.replace(variablesRegexp, replacer);

  function replacer(variable, entity, field) {
    if (!entityKeys.includes(entity)) {
      errors.push(`Entidade '${entity}' não é válida. Utilize uma das seguintes entidades: ${entityKeys}`);
      return variable;
    }

    if (entity === 'Sala' && !roomsContainerId) {
      errors.push(`Entidade '${entity}' não pode ser usada sem especificar a tabela de salas associada.`);
      return variable;
    }

    const entityFields = entities[entity].fields;
    const fieldNames = Object.values(entityFields);
    const filledFields = entities[entity].filledFields;
    const convertedField = autoAssignStringConversion(field);
  
    if (!fieldNames.some((name) => autoAssignStringConversion(name) === convertedField)) {
      errors.push(`Campo '${field}' não é válido para a entidade '${entity}'. Utilize um dos seguintes campos: ${fieldNames}`);
      return variable;
    }

    if (!filledFields.some((field) => autoAssignStringConversion(field) === convertedField)) {
      errors.push(`Campo '${field}' não está associado a qualquer coluna da tabela.`);
      return variable;
    }

    // TODO: fieldName might change if we no longer change the field of the column
    const dataName = entities[entity].data;
    const fieldName = Object.keys(entityFields).find((key) => {
      return autoAssignStringConversion(entityFields[key]) === convertedField;
    });

    return `${dataName}["${fieldName}"]`;
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  return newExpression;
}

function getFilledFields(containerId) {
  const table = tables[containerId];
  const fieldsRow = table.getRow(0);
  const fieldsData = fieldsRow.getData();

  return Object.values(fieldsData).filter((field) => field);
}

// TODO: Do we even need to update the field on the table? It is time-consuming and might not be needed
