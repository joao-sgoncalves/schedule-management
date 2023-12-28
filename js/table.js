const classTables = [];
const roomTables = [];
const variablesRegexp = /\[(.+?)\]/g

$(document).ready(() => {
  $('[data-bs-toggle="tooltip"]').tooltip({ trigger: 'hover' });
});

const criteriaTable = new Tabulator('#criteria-table', {
  columns: [
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

        classTables.forEach((table) => {
          const columns = table.getColumns();
          const criteriaIndex = columns.findIndex((column) => column.getField() === criteriaField);

          table.deleteColumn(criteriaField);
          columns[criteriaIndex - 1].scrollTo();
        });
      },
      hozAlign: 'center',
      vertAlign: 'middle',
    },
  ],
  maxHeight: '50vh',
  layout: 'fitDataTable',
  layoutColumnsOnNewData: true,
  placeholder: "Sem Dados",
});

criteriaTable.on('cellEdited', (cell) => {
  const field = cell.getField();
  const value = cell.getValue();
  const data = cell.getData();
  const criteriaField = `criteria-${data.id}`;

  if (field === 'name') {
    classTables.forEach((table) => {
      const criteriaColumn = table.getColumn(criteriaField);

      criteriaColumn.updateDefinition({ title: value });
      criteriaColumn.scrollTo();
    });
  } else if (field === 'expression') {
    classTables.forEach((table) => {
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
    classTables.forEach((table) => {
      const criteriaColumn = table.getColumn(criteriaField);

      criteriaColumn.updateDefinition({ bottomCalc: value.toLowerCase() });
      criteriaColumn.scrollTo();
    });
  }
});

$('#add-criteria-btn').click(() => {
  const data = criteriaTable.getData();
  const lastRowData = data.at(-1);
  const newRowData = { 'id': (lastRowData?.id ?? 0) + 1 };

  criteriaTable.addRow(newRowData);
  criteriaTable.scrollToRow(newRowData.id);

  classTables.forEach((table) => {
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

  const lastTable = classTables.at(-1);
  const lastTableId = lastTable?.element.id;
  const lastTableNumber = parseInt(lastTableId?.split('-').pop() ?? 0, 10);

  files.forEach((file, index) => {
    const tableNumber = lastTableNumber + index + 1;

    const containerId = `classes-container-${tableNumber}`;
    const tableId = `classes-table-${tableNumber}`;

    const filename = file.name;
    const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;

    $('#class-tables').append(`
      <div id="${containerId}" class="d-inline-block mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="classes-name-heading">${filenameWithoutExt}</h5>
          <button
            class="btn btn-outline-danger delete-classes-btn"
            type="button"
            data-bs-toggle="tooltip"
            data-bs-title="Remover tabela de horário"
          >
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>

        <div id="${tableId}" class="mw-100"></div>
      </div>
    `);

    const tooltipsSelector = `#${containerId} [data-bs-toggle="tooltip"]`;
    $(tooltipsSelector).tooltip({ trigger: 'hover' });

    $(`#${containerId} .delete-classes-btn`).click(() => {
      $(tooltipsSelector).tooltip('dispose');
      $(`#${containerId}`).remove();

      const tableIndex = classTables.findIndex((table) => table.element.id === tableId);
      classTables.splice(tableIndex, 1);
    });

    parse(file, `#${tableId}`);
  });

  $(event.target).val(null);
});

$('#class-tables').on('click', '.classes-name-heading', (event) => {
  const $target = $(event.target);

  const $input = $(`
    <input
      class="classes-name-input form-control w-auto"
      type="text"
      value="${$target.text()}"
    >
  `);

  $target.replaceWith($input);
  $input.focus();
});

$('#class-tables').on('blur', '.classes-name-input', (event) => {
  const $target = $(event.target);

  const $heading = $(`
    <h5 class="classes-name-heading">${$target.val()}</h5>
  `);

  $target.replaceWith($heading);
});

$('#rooms-input').change((event) => {
  const files = Array.from(event.target.files);

  const lastTable = classTables.at(-1);
  const lastTableId = lastTable?.element.id;
  const lastTableNumber = parseInt(lastTableId?.split('-').pop() ?? 0, 10);

  files.forEach((file, index) => {
    const tableNumber = lastTableNumber + index + 1;

    const containerId = `rooms-container-${tableNumber}`;
    const tableId = `rooms-table-${tableNumber}`;

    const filename = file.name;
    const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;

    $('#room-tables').append(`
      <div id="${containerId}" class="d-inline-block mw-100 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="rooms-name-heading">${filenameWithoutExt}</h5>
          <button
            class="btn btn-outline-danger delete-rooms-btn"
            type="button"
            data-bs-toggle="tooltip"
            data-bs-title="Remover tabela de salas"
          >
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>

        <div id="${tableId}" class="mw-100"></div>
      </div>
    `);

    const tooltipsSelector = `#${containerId} [data-bs-toggle="tooltip"]`;
    $(tooltipsSelector).tooltip({ trigger: 'hover' });

    $(`#${containerId} .delete-rooms-btn`).click(() => {
      $(tooltipsSelector).tooltip('dispose');
      $(`#${containerId}`).remove();

      const tableIndex = roomTables.findIndex((table) => table.element.id === tableId);
      roomTables.splice(tableIndex, 1);
    });

    parse(file, `#${tableId}`);
  });

  $(event.target).val(null);
});

$('#room-tables').on('click', '.rooms-name-heading', (event) => {
  const $target = $(event.target);

  const $input = $(`
    <input
      class="rooms-name-input form-control w-auto"
      type="text"
      value="${$target.text()}"
    >
  `);

  $target.replaceWith($input);
  $input.focus();
});

$('#room-tables').on('blur', '.rooms-name-input', (event) => {
  const $target = $(event.target);

  const $heading = $(`
    <h5 class="rooms-name-heading">${$target.val()}</h5>
  `);

  $target.replaceWith($heading);
});

function parse(file, tableSelector) {
  Papa.parse(file, {
    worker: true,
    header: true,
    complete: (results) => {
      const fields = results.meta.fields;
      const data = results.data;
      const errors = results.errors;

      loadTable(tableSelector, fields, data, errors);
    },
    error: (err) => {
      console.error(`Error parsing file '${file.name}'`, err);
    },
  });
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
    // updateTable(selector, columns, tableData);
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

  classTables.push(table);

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

// function updateTable(selector, columns, data) {
//   $(selector).tabulator('setColumns', columns);
//   $(selector).tabulator('setData', data);
// }

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

$('[data-import]').click((event) => {
  const dataTable = $(event.target).data('table');
  const dataFileInput = $(event.target).data('file-input');
  const file = $(dataFileInput).prop('files')[0];

  Papa.parse(file, {
    worker: true,
    header: true,
    complete: (results) => {
      const data = results.data;
      const fields = results.meta.fields;
      const errors = results.errors;

      loadTable(dataTable, fields, data, errors);
    },
    error: (err) => {
      console.error('Error parsing file', err);
    },
  });
});

$('[data-preview]').click((event) => {
  const dataTable = $(event.target).data('table');
  const dataFileInput = $(event.target).data('file-input');
  const dataRowsInput = $(event.target).data('rows-input');

  const file = $(dataFileInput).prop('files')[0];
  const preview = parseInt($(dataRowsInput).val(), 10);

  Papa.parse(file, {
    worker: true,
    header: true,
    preview: preview + 1,
    complete: (results) => {
      const data = results.data;
      const fields = results.meta.fields;
      const errors = results.errors;

      loadTable(dataTable, fields, data, errors);
    },
    error: (err) => {
      console.error('Error parsing file', err);
    },
  });
});
