function isTableCreated(selector) {
  return $(selector).hasClass('tabulator');
}

function createTable(selector, fields, data) {
  $(selector).tabulator({
    columns: fields.map((field) => {
      return {
        title: field,
        field,
        editable,
        editor: 'list',
        editorParams: {
          valuesLookup: (cell) => {
            return valuesLookup(cell, selector);
          },
          clearable: true,
          autocomplete: true,
          listOnEmpty: true,
        }
      };
    }),
    rowFormatter,
    frozenRows: 1,
    maxHeight: '50vh',
    data,
  });

  $(selector).tabulator('on', 'cellEdited', (cell) => {
    var row = cell.getRow();

    if (!row.isFrozen()) {
      return;
    }

    var table = cell.getTable();
    var data = table.getData();

    var cellField = cell.getField();
    var cellValue = cell.getValue();

    var fields = config.tableFields[selector];
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
  });
}

function updateTable(selector, fields, data) {
  $(selector).tabulator('setColumns', fields.map((field) => {
    return {
      title: field,
      field,
      editable,
      editor: 'list',
      editorParams: {
        valuesLookup: (cell) => {
          return valuesLookup(cell, selector);
        },
        clearable: true,
        autocomplete: true,
        listOnEmpty: true,
      }
    };
  }));

  $(selector).tabulator('setData', data);
}

function editable(cell) {
  var row = cell.getRow();
  var field = cell.getField();

  return row.isFrozen() && field !== 'Error';
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

function rowFormatter(row) {

}

$('[data-import]').click((event) => {
  var dataTable = $(event.target).data('table');
  var dataFileInput = $(event.target).data('file-input');
  var file = $(dataFileInput).prop('files')[0];

  Papa.parse(file, {
    worker: true,
    header: true,
    complete: (results) => {
      const data = results.data.slice();
      const fields = results.meta.fields.slice();

      fields.push('Error');

      var fieldsRow = fields.reduce((obj, field) => {
        obj[field] = undefined;
        return obj;
      }, {});

      data.unshift(fieldsRow);

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
      const data = results.data.slice();
      const fields = results.meta.fields.slice();

      fields.push('Error');

      var fieldsRow = fields.reduce((obj, field) => {
        obj[field] = undefined;
        return obj;
      }, {});

      data.unshift(fieldsRow);

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
