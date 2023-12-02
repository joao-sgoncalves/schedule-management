function isTableCreated(selector) {
  return $(selector).hasClass('tabulator');
}

function createTable(selector, fields, data) {
  $(selector).tabulator({
    columns: getColumns(selector, fields),
    rowFormatter,
    frozenRows: 1,
    maxHeight: '50vh',
    data,
  });

  $(selector).tabulator('on', 'cellEdited', (cell) => {
    onCellEdited(selector, cell);
  });
}

function getColumns(tableSelector, fields) {
  const columns = fields.map((field) => {
    return getColumn(tableSelector, field, field);
  });

  const errorColumn = getColumn(tableSelector, 'Error', 'error');
  columns.push(errorColumn);

  return columns;
}

function getColumn(tableSelector, title, field) {
  return {
    title,
    field,
    editable,
    editor: 'list',
    editorParams: {
      valuesLookup: (cell) => {
        return valuesLookup(cell, tableSelector);
      },
      clearable: true,
      autocomplete: true,
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
  const rowIndex = row.getIndex();
  const field = cell.getField();

  return rowIndex === 0 && field !== 'error';
}

function valuesLookup(cell, tableSelector) {
  const cellValue = cell.getValue();
  const rowData = cell.getData();
  const rowValues = Object.values(rowData);
  const fields = config.tableFields[tableSelector];

  return Object.values(fields).filter((value) => {
    return value === cellValue || !rowValues.includes(value);
  });
}

function cellMouseOver(cell) {
  const data = cell.getData();
  const row = cell.getRow();
  const rowElement = row.getElement();

  if (data.error) {
    $(rowElement).removeClass('table-danger');
  }
}

function cellMouseOut(cell) {
  const data = cell.getData();
  const row = cell.getRow();
  const rowElement = row.getElement();

  if (data.error) {
    $(rowElement).addClass('table-danger');
  }
}

function rowFormatter(row) {
  const data = row.getData();
  const rowElement = row.getElement();

  if (data.error) {
    $(rowElement).addClass("table-danger");
  }
}

function onCellEdited(tableSelector, cell) {
  const row = cell.getRow();
  const rowIndex = row.getIndex();

  if (rowIndex !== 0) {
    return;
  }

  const table = cell.getTable();
  const data = table.getData();

  const cellField = cell.getField();
  const cellValue = cell.getValue();

  const fields = config.tableFields[tableSelector];
  const fieldName = Object.keys(fields).find((name) => {
    return fields[name] === cellValue;
  });

  const newData = data.map((row) => {
    return Object.entries(row).reduce((rowObj, [field, value]) => {
      const newField = field === cellField ? fieldName : field;
      rowObj[newField] = value;

      return rowObj;
    }, {});
  });

  table.setData(newData);

  const column = cell.getColumn();
  column.updateDefinition({ field: fieldName });
}

function updateTable(selector, fields, data) {
  const columns = getColumns(selector, fields);

  $(selector).tabulator('setColumns', columns);
  $(selector).tabulator('setData', data);
}

function loadTable(selector, fields, data, errors) {
  const fieldsRow = fields.reduce((row, field) => {
    row[field] = undefined;
    return row;
  }, {});

  const tableData = [fieldsRow, ...data].map((row, index) => ({
    id: index,
    ...row,
    error: undefined,
  }));

  errors.forEach((error) => {
    const row = tableData.find((row) => row.id === error.row);
    row.error = error.message;
  });

  if (isTableCreated(selector)) {
    updateTable(selector, fields, tableData);
  } else {
    createTable(selector, fields, tableData);
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

function getData(tableSelector) {
  const data = $(tableSelector).tabulator('getData');
  return data.slice(1);
}

$('#get-classes-btn').click(() => {
  const data = getData('#classes-table');
  console.log(data);
});

$('#get-rooms-btn').click(() => {
  const data = getData('#rooms-table');
  console.log(data);
});
