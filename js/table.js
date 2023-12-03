function isTableCreated(selector) {
  return $(selector).hasClass('tabulator');
}

function createTable(selector, columns, data) {
  $(selector).tabulator({
    columns,
    rowFormatter,
    frozenRows: 1,
    maxHeight: '50vh',
    layoutColumnsOnNewData: true,
    data,
  });
}

function updateTable(selector, columns, data) {
  $(selector).tabulator('setColumns', columns);
  $(selector).tabulator('setData', data);
}

function loadTable(selector, fields, data, errors) {
  const columns = getColumns(selector, fields);

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

// Change this to use auto columns instead
function getColumns(tableSelector, fields) {
  const columns = fields.map((field) => {
    return getColumn(tableSelector, field, field);
  });

  const errorsColumn = getColumn(tableSelector, 'Errors', 'errors');
  columns.push(errorsColumn);

  return columns;
}

function getColumn(tableSelector, title, field) {
  return {
    title,
    field,
    vertAlign: 'middle',
    formatter: field === 'errors' ? 'textarea' : undefined,
    editable,
    editor: 'list',
    editorParams: {
      valuesLookup: (cell) => {
        return valuesLookup(cell, tableSelector);
      },
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
  const rowIndex = row.getIndex();
  const field = cell.getField();

  return rowIndex === 0 && field !== 'errors';
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

function getData(tableSelector) {
  const data = $(tableSelector).tabulator('getData');
  const fieldsRow = data[0];

  const fields = config.tableFields[tableSelector];
  const fieldNames = Object.keys(fields);

  return data.slice(1).map((row) => {
    return Object.keys(row).reduce((newRow, field) => {
      const rowValue = row[field];
      const fieldTitle = fieldsRow[field];

      const fieldName = fieldNames.find((name) => {
        return fields[name] === fieldTitle;
      }) ?? field;

      newRow[fieldName] = rowValue;
      return newRow;
    }, {});
  });
}

$('#get-classes-btn').click(() => {
  const data = getData('#classes-table');
  console.log(data);
});

$('#get-rooms-btn').click(() => {
  const data = getData('#rooms-table');
  console.log(data);
});

// Use eval() for custom expressions
