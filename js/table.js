// TODO: Ensure every table has an ID (the ID of the container maybe (?))

const parseMetas = {};
const tables = {};
const criteriaTable = createCriteriaTable();

const variablesRegexp = /\[(.+?)\]/g

const roomTables = [];

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
        const data = cell.getData();
        const criteriaField = `criteria-${data.id}`;

        row.delete();

        $('#class-tables').children('.table-container').each((_index, container) => {
          const $container = $(container);
          const containerId = $container.attr('id');
          const table = tables[containerId];

          const columns = table.getColumns();
          const criteriaIndex = columns.findIndex((column) => column.getField() === criteriaField);

          table.deleteColumn(criteriaField);
          columns[criteriaIndex - 1].scrollTo();
        });
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
      const criteriaColumn = table.getColumn(criteriaField);

      criteriaColumn.updateDefinition({ title: value });
      criteriaColumn.scrollTo();
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

      table.updateData(updatedData);
      criteriaColumn.scrollTo();
    });
  } else if (field === 'aggregator') {
    $('#class-tables').children('.table-container').each((_index, container) => {
      const $container = $(container);
      const containerId = $container.attr('id');

      const table = tables[containerId];
      const criteriaColumn = table.getColumn(criteriaField);

      criteriaColumn.updateDefinition({ bottomCalc: value.toLowerCase() });
      criteriaColumn.scrollTo();
    });
  }
});

$('#add-criteria-btn').click(() => {
  $('#class-tables').children('.table-container').each((_index, container) => {
    const $container = $(container);
    const containerId = $container.attr('id');

    const table = tables[containerId];
    const criteriaField = `criteria-${newRowData.id}`;

    table.addColumn({
      field: criteriaField,
      mutator: (value, data, _type, _params, component) => {
        return qualityMutator(value, data, component);
      },
    });

    table.scrollToColumn(criteriaField);
  });
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

  table.addRow(newRowData);
  table.scrollToRow(newRowData.id);
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
    maxHeight: '50vh',
    layout: 'fitDataTable',
    layoutColumnsOnNewData: true,
    data,
    scrollToColumnPosition: 'middle',
    scrollToColumnIfVisible: false,
    placeholder: 'Sem Dados',
  });

  const $table = $(selector);
  const $tableContainer = $table.closest('.table-container');
  const containerId = $tableContainer.attr('id');

  tables[containerId] = table;

  table.on('cellEdited', (cell) => {
    const table = cell.getTable();
    const data = table.getData();

    const cellField = cell.getField();
    const cellValue = cell.getValue();

    const tableId = table.element.id;
    const tableType = tableId.split('-', 1)[0];

    const fields = config.tableFields[tableType];
    const fieldName = Object.keys(fields).find((name) => {
      return fields[name] === cellValue;
    });

    const newData = data.map((row) => ({
      id: row.id,
      [fieldName]: row[cellField],
    }));

    table.updateData(newData);

    const column = cell.getColumn();
    column.updateDefinition({ field: fieldName });

    column.scrollTo();
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

  const errorsColumn = getColumn('Errors', 'errors');
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

function autoAssignTableFields() {
  const table = tables['classes-container-1'];
  const tableId = table.element.id;
  const tableType = tableId.split('-', 1)[0];

  const columns = table.getColumns();
  const data = table.getData();

  const fieldsRow = data.find((row) => row.id === 0);
  const fields = config.tableFields[tableType];
  const updatedFieldsRow = { id: fieldsRow.id };

  columns.forEach((column) => {
    const definition = column.getDefinition();
    const title = definition.title;
    const field = definition.field;
    const fieldValue = fieldsRow[field];

    if (['id', 'errors'].includes(field) || fieldValue) {
      return;
    }

    const fieldName = Object.keys(fields).find((name) => {
      return fields[name] === title;
    });

    if (fieldName) {
      updatedFieldsRow[field] = fields[fieldName];
    }
  });

  table.updateData([updatedFieldsRow]);
}
