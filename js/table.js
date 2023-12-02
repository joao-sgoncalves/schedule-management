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
  var columns = fields.map((field) => {
    return getColumn(tableSelector, field, field);
  });

  var errorColumn = getColumn(tableSelector, 'Error', 'error');
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
  var row = cell.getRow();
  var rowIndex = row.getIndex();
  var field = cell.getField();

  return rowIndex === 1 && field !== 'error';
}

function valuesLookup(cell, tableSelector) {
  var cellValue = cell.getValue();
  var rowData = cell.getData();
  var rowValues = Object.values(rowData);
  var fields = config.tableFields[tableSelector];

  return Object.values(fields).filter((value) => {
    return value === cellValue || !rowValues.includes(value);
  });
}

function cellMouseOver(cell) {
  var data = cell.getData();
  var row = cell.getRow();
  var rowElement = row.getElement();

  if (data.error) {
    $(rowElement).removeClass('table-danger');
  }
}

function cellMouseOut(cell) {
  var data = cell.getData();
  var row = cell.getRow();
  var rowElement = row.getElement();

  if (data.error) {
    $(rowElement).addClass('table-danger');
  }
}

function rowFormatter(row) {
  var data = row.getData();
  var rowElement = row.getElement();

  if (data.error) {
    $(rowElement).addClass("table-danger");
  }
}

function onCellEdited(tableSelector, cell) {
  var row = cell.getRow();
  var rowIndex = row.getIndex();

  if (rowIndex !== 1) {
    return;
  }

  var table = cell.getTable();
  var data = table.getData();

  var cellField = cell.getField();
  var cellValue = cell.getValue();

  var fields = config.tableFields[tableSelector];
  var fieldName = Object.keys(fields).find((name) => {
    return fields[name] === cellValue;
  });

  // see if it is possible to use updateData, with id

  var newData = data.map((row) => {
    return Object.entries(row).reduce((rowObj, [field, value]) => {
      var newField = field === cellField ? fieldName : field;
      rowObj[newField] = value;

      return rowObj;
    }, {});
  });

  table.setData(newData);

  var column = cell.getColumn();
  column.updateDefinition({ field: fieldName });
}

function updateTable(selector, fields, data) {
  var columns = getColumns(selector, fields);

  $(selector).tabulator('setColumns', columns);
  $(selector).tabulator('setData', data);
}

$('[data-import]').click((event) => {
  var dataTable = $(event.target).data('table');
  var dataFileInput = $(event.target).data('file-input');
  var file = $(dataFileInput).prop('files')[0];

  Papa.parse(file, {
    worker: true,
    header: true,
    complete: (results) => {
      const data = results.data;
      const fields = results.meta.fields;

      data.unshift({});

      $(data).each((index, row) => {
        row.id = index + 1;
      });

      if (isTableCreated(dataTable)) {
        updateTable(dataTable, fields, data);
      } else {
        createTable(dataTable, fields, data);
      }
    },
    error: (err) => {
      console.error('Error parsing file', err);
    },
  });
});

$('[data-preview]').click((event) => {
  var dataTable = $(event.target).data('table');
  var dataFileInput = $(event.target).data('file-input');
  var dataRowsInput = $(event.target).data('rows-input');

  var file = $(dataFileInput).prop('files')[0];
  var preview = parseInt($(dataRowsInput).val(), 10);

  Papa.parse(file, {
    worker: true,
    header: true,
    preview: preview + 1,
    complete: (results) => {
      const data = results.data;
      const fields = results.meta.fields;

      data.unshift({});

      $(data).each((index, row) => {
        row.id = index + 1;
      });

      if (isTableCreated(dataTable)) {
        updateTable(dataTable, fields, data);
      } else {
        createTable(dataTable, fields, data);
      }
    },
    error: (err) => {
      console.error('Error parsing file', err);
    },
  });
});

function getData(tableSelector) {
  var data = $(tableSelector).tabulator('getData');
  return data.slice(1);
}

$('#get-classes-btn').click(() => {
  var data = getData('#classes-table');
  console.log(data);
});

$('#get-rooms-btn').click(() => {
  var data = getData('#rooms-table');
  console.log(data);
});
