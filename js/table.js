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

  const localCriteria = getLocalCriteria();
  const data = localCriteria?.length > 0 ? localCriteria : config.defaultCriteria;
  
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
  const criteriaErrorsField = `criteria-${data.id}-errors`;

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
      const classesData = table.getData();

      updateQualityColumnData($container, criteriaField, criteriaErrorsField, classesData);

      table.replaceData(classesData);
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

function updateAllQualityColumns($classesContainer, classesData) {
  const criteriaData = criteriaTable.getData();

  criteriaData.forEach((row) => {
    const criteriaField = `criteria-${row.id}`;
    const criteriaErrorsField = `criteria-${row.id}-errors`;

    updateQualityColumnData($classesContainer, criteriaField, criteriaErrorsField, classesData);
  });
}

function updateQualityReferencedByRoom($roomsContainer) {
  const $tableId = $roomsContainer.find('.table-id');
  const tableId = $tableId.text();

  $('#class-tables').children('.table-container').each((_index, container) => {
    const $classesContainer = $(container);
    const $tableNamesSelect = $classesContainer.find('.table-names-select');
    const tableNameVal = $tableNamesSelect.val();
    
    if (tableNameVal !== tableId) {
      return;
    }

    const classesContainerId = $classesContainer.attr('id');
    const classesTable = tables[classesContainerId];
    const classesData = classesTable.getData();

    updateAllQualityColumns($classesContainer, classesData);

    classesTable.replaceData(classesData);
  });
}

function updateQualityColumnData($classesContainer, criteriaField, criteriaErrorsField, classesData) {
  const classFieldsData = classesData.find((row) => row.id === 0);

  const qualityData = criteriaTable.getData();
  const criteriaData = qualityData.find((data) => `criteria-${data.id}` === criteriaField);
  const expression = criteriaData.expression;

  const $tableNamesSelect = $classesContainer.find('.table-names-select');
  const tableNameVal = $tableNamesSelect.val();
  
  let roomsContainerId;
  let roomsTable;
  let roomsData;
  let roomFieldsData;
  
  if (tableNameVal !== '-1') {
    roomsContainerId = `rooms-container-${tableNameVal}`;
    roomsTable = tables[roomsContainerId];
    roomsData = roomsTable.getData();
    roomFieldsData = roomsData.find((row) => row.id === 0);
  }

  classesData.forEach((row) => {
    const currentValue = row[criteriaField];

    const { newValue, errors } = resolveQualityExpression(
      currentValue,
      expression,
      roomsContainerId,
      row,
      roomsData,
      classFieldsData,
      roomFieldsData,
    );

    row[criteriaField] = newValue;
    row[criteriaErrorsField] = errors.join('\n');
  });
}

function resolveQualityExpression(value, expression, roomsContainerId, classData, roomsData, classFieldsData, roomFieldsData) {
  if (classData.id === 0 || !expression) {
    return { newValue: value, errors: [] };
  }

  const { newExpression, errors, roomData } = replaceExpression(
    expression,
    roomsContainerId,
    classData,
    roomsData,
    classFieldsData,
    roomFieldsData,
  );

  if (errors.length > 0) {
    return { newValue: value, errors };
  }

  let newValue;

  try {
    newValue = eval(newExpression);
  } catch (err) {
    newValue = value;
    errors.push(err.message);
  }

  return { newValue, errors };
}

$('#upload-classes-btn').click(() => {
  const $classesInput = $('#classes-input');
  $classesInput[0].click();
});

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
      <div id="${containerId}" class="table-container d-inline-block mw-100 mt-4">
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

$('#upload-rooms-btn').click(() => {
  const $roomsInput = $('#rooms-input');
  $roomsInput[0].click();
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

  const tableType = containerId.split('-', 1)[0];

  if (tableType === 'class') {
    const $tableContainer = $heading.closest('.table-container');
    updateQualityTraceName($tableContainer);
  }
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

  const containerIndex = $tableContainer.index();
  const tableType = containerId.split('-', 1)[0];

  const $tooltips = $tableContainer.find('[data-bs-toggle="tooltip"]');
  $tooltips.tooltip('dispose');

  const table = tables[containerId];
  table.destroy();

  $tableContainer.remove();

  delete parseMetas[containerId];
  delete tables[containerId];
  
  const tablesContainerId = $tablesContainer.attr('id');
  const dataNameSelects = $tablesContainer.data('name-selects');

  updateTableNameSelects(`#${tablesContainerId}`, dataNameSelects);

  if (tableType === 'classes') {
    removeQualityTrace(containerIndex);
  }
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

$('body').on('change', '.table-names-select', (event) => {
  const $target = $(event.target);
  const $tableContainer = $target.closest('.table-container');
  const containerId = $tableContainer.attr('id');
  
  const table = tables[containerId];
  const data = table.getData();

  updateAllQualityColumns($tableContainer, data);

  table.replaceData(data);
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
  const tableType = selector.split('-', 1)[0].substring(1);
  const tableFields = config.tableFields[tableType];

  const columns = getColumns(fields, tableFields);
  const qualityColumns = getQualityColumns(tableType);
  const tableColumns = [...columns, ...qualityColumns];
  const ignoredColumns = ['id', 'errors'];

  const autoAssignedColumns = columns.filter((col) => {
    return !ignoredColumns.includes(col.field) && col.field !== col.title;
  });

  const tableData = [{}, ...data].map((row, index) => ({
    id: index,
    ...row,
  }));

  autoAssignedColumns.forEach((col) => {
    const field = col.field;
    const title = col.title;
    const fieldTitle = tableFields[field].title;

    tableData.forEach((row) => {
      row[field] = row.id === 0 ? fieldTitle : row[title];
      delete row[title];
    });
  });

  if (tableType === 'classes') {
    const $table = $(selector);
    const $container = $table.closest('.table-container');

    updateAllQualityColumns($container, tableData);
  }

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
    updateTable(selector, tableColumns, tableData);
  } else {
    createTable(selector, tableColumns, tableData);
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
    resizableRows: true,
  });

  const $table = $(selector);
  const $tableContainer = $table.closest('.table-container');
  const containerId = $tableContainer.attr('id');
  const tableType = containerId.split('-', 1)[0];

  tables[containerId] = table;

  if (tableType === 'classes') {
    addQualityTrace($tableContainer);
    
    table.on('tableBuilt', () => updateQualityData($tableContainer));
  }

  table.on('cellEdited', (cell) => cellEdited(cell));
}

function cellEdited(cell) {
  const table = cell.getTable();
  const data = table.getData();

  const column = cell.getColumn();
  const definition = column.getDefinition();
  const columnTitle = definition.title;

  const cellField = cell.getField();
  const cellValue = cell.getValue();

  const tableId = table.element.id;
  const tableType = tableId.split('-', 1)[0];
  const tableFields = config.tableFields[tableType];

  const fieldName = Object.keys(tableFields).find((key) => {
    return tableFields[key].title === cellValue;
  }) ?? columnTitle;

  const formatter = tableFields[fieldName]?.formatter;
  const formatterParams = tableFields[fieldName]?.formatterParams;

  const newData = data.map((row) => {
    const newRow = {
      ...row,
      [fieldName]: row[cellField],
    };
    
    delete newRow[cellField];
    return newRow;
  });

  const updateDefinition = {
    field: fieldName,
    formatter,
    formatterParams,
  };

  table.replaceData(newData)
    .then(() => {
      table.updateColumnDefinition(cellField, updateDefinition)
        .then(() => {
          table.scrollToColumn(fieldName);

          const $table = $(table.element);
          const $container = $table.closest('.table-container');

          if (tableType === 'classes') {
            updateAllQualityColumns($container, newData);
          } else {
            updateQualityReferencedByRoom($container);
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

function getColumns(fields, tableFields) {
  const columns = fields.map((field) => {
    return getColumn(field, tableFields);
  });

  const idColumn = {
    field: 'id',
    title: 'ID',
    sorter: 'number',
    headerSortTristate: true,
    vertAlign: 'middle',
  };
  columns.unshift(idColumn);

  const errorsColumn = {
    field: 'errors',
    title: 'Erros',
    headerSortTristate: true,
    vertAlign: 'middle',
    formatter: 'textarea',
  };
  columns.push(errorsColumn);

  return columns;
}

function getQualityTooltip(cell) {
  const data = cell.getData();
  const cellField = cell.getField();
  const cellErrorsField = `${cellField}-errors`;

  return data[cellErrorsField];
}

function qualityFormatter(cell) {
  const cellValue = cell.getValue();

  const cellField = cell.getField();
  const cellErrorsField = `${cellField}-errors`;
  
  const data = cell.getData();
  const cellErrors = data[cellErrorsField];

  if (cellErrors) {
    const cellElement = cell.getElement();
    
    $(cellElement).addClass('table-danger');
  }

  return cellValue;
}

function getColumn(title, tableFields) {
  const field = getColumnField(title, tableFields);
  const formatter = tableFields[field]?.formatter;
  const formatterParams = tableFields[field]?.formatterParams;

  return {
    field,
    title,
    formatter,
    formatterParams,
    headerSortTristate: true,
    vertAlign: 'middle',
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
  };
}

function editable(cell) {
  const row = cell.getRow();

  if (row._row.type !== 'row') {
    return false;
  }

  const rowIndex = row.getIndex();
  return rowIndex === 0;
}

function valuesLookup(cell) {
  const table = cell.getTable();
  const tableId = table.element.id;
  const tableType = tableId.split('-', 1)[0];

  const cellValue = cell.getValue();
  const rowData = cell.getData();
  const rowValues = Object.values(rowData);
  const tableFields = config.tableFields[tableType];

  return Object.values(tableFields).map((field) => field.title).filter((title) => {
    return title === cellValue || !rowValues.includes(title);
  });
}

function rowFormatter(row) {
  const data = row.getData();

  if (data.errors) {
    const rowElement = row.getElement();

    $(rowElement).addClass('table-danger');
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

function getColumnField(title, tableFields) {
  const convertedTitle = autoAssignStringConversion(title);

  const fieldName = Object.keys(tableFields).find((key) => {
    const convertedField = autoAssignStringConversion(tableFields[key].title);
    return convertedField === convertedTitle;
  });

  return fieldName ?? title;
}

function getQualityColumns(tableType) {
  if (tableType === 'rooms') {
    return [];
  }

  const criteriaData = criteriaTable.getData();
  const columns = [];

  criteriaData.forEach((row) => {
    const criteriaField = `criteria-${row.id}`;
    const criteriaErrorsField = `criteria-${row.id}-errors`;

    columns.push({
      field: criteriaField,
      title: row.name,
      formatter: qualityFormatter,
      bottomCalc: row.aggregator?.toLowerCase(),
      bottomCalcFormatter: qualityCalcFormatter,
      tooltip: (_, cell) => {
        return getQualityTooltip(cell);
      },
      headerSortTristate: true,
      vertAlign: 'middle',
    });

    columns.push({
      field: criteriaErrorsField,
      visible: false,
    });
  });

  return columns;
}

function qualityCalcFormatter(cell) {
  const cellValue = cell.getValue();
  const table = cell.getTable();

  if (!table.initialized) {
    return cellValue;
  }

  const tableId = table.element.id;
  const $table = $(`#${tableId}`);
  const $container = $table.closest('.table-container');

  updateQualityData($container);

  return cellValue;
}

function autoAssignStringConversion(str) {
  if (!str) {
    return str;
  }

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

function replaceExpression(expression, roomsContainerId, classData, roomsData, classFieldsData, roomFieldsData) {
  const entities = {
    'Aula': {
      data: 'classData',
      fields: config.tableFields.classes,
      filledFields: getFilledFields(classFieldsData),
    },
    'Sala': {
      data: 'roomData',
      fields: config.tableFields.rooms,
      filledFields: roomsContainerId ? getFilledFields(roomFieldsData) : undefined,
    },
  };
  
  const entityKeys = Object.keys(entities);
  const errors = [];

  const convertedClassRoom = autoAssignStringConversion(classData.roomName);
  const roomNameTitle = entities['Sala'].fields['roomNameB'].title;
  const convertedRoomTitle = autoAssignStringConversion(roomNameTitle);
  let roomEntityReferenced = false;

  const newExpression = expression.replace(variablesRegexp, replacer);

  function replacer(variable, entity, field) {
    if (entity === 'Sala') {
      roomEntityReferenced = true;
    }

    if (!entityKeys.includes(entity)) {
      errors.push(`Entidade '${entity}' não é válida. Utilize uma das seguintes entidades: ${entityKeys}`);
      return variable;
    }

    if (entity === 'Sala' && !roomsContainerId) {
      errors.push(`Entidade '${entity}' não pode ser usada sem especificar a tabela de salas associada.`);
      return variable;
    }

    const entityFields = entities[entity].fields;
    const fieldTitles = Object.values(entityFields).map((field) => field.title);
    const filledFields = entities[entity].filledFields;
    const convertedField = autoAssignStringConversion(field);
  
    if (!fieldTitles.some((name) => autoAssignStringConversion(name) === convertedField)) {
      errors.push(`Campo '${field}' não é válido para a entidade '${entity}'. Utilize um dos seguintes campos: ${fieldTitles}`);
      return variable;
    }

    if (!filledFields.some((field) => autoAssignStringConversion(field) === convertedField)) {
      errors.push(`Campo '${field}' não está associado a qualquer coluna da tabela para a entidade '${entity}'.`);
      return variable;
    }

    if (entity === 'Sala' && !filledFields.some((field) => autoAssignStringConversion(field) === convertedRoomTitle)) {
      errors.push(`Campo '${roomNameTitle}' não está associado a qualquer coluna da tabela para a entidade '${entity}'.`);
      return variable;
    }

    const dataName = entities[entity].data;
    const fieldName = Object.keys(entityFields).find((key) => {
      return autoAssignStringConversion(entityFields[key].title) === convertedField;
    });

    return `${dataName}["${fieldName}"]`;
  }

  let roomData;
  if (errors.length === 0 && roomEntityReferenced) {
    roomData = roomsData.find((row) => autoAssignStringConversion(row.roomNameB) === convertedClassRoom);
    const classRoomTitle = entities['Aula'].fields['roomName'].title;

    if (!convertedClassRoom) {
      errors.push(`Campo '${classRoomTitle}' não tem valor para esta aula.`);
    } else if (!roomData) {
      errors.push(`Campo '${classRoomTitle}' com o valor '${classData.roomName}' não tem qualquer correspondência na tabela de salas.`);
    }
  }

  return { newExpression, errors, roomData };
}

function getFilledFields(fieldsData) {
  return Object.values(fieldsData).filter((field) => field);
}

function convertTo(formatter, value) {
  let newValue = value;

  switch (formatter) {
    case 'String':
      newValue = String(value);
      break;
    case 'Number':
      newValue = Number(value);
      break;
    default:
      throw new Error(`Formatter '${formatter}' is not defined.`);
  }

  return newValue;
}

// TODO: Error tooltips and cell format as error
// TODO: Convert column to correct type
