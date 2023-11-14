var tableFields = {
  '#classes-table': {
    building: 'Building',
    roomName: 'Room Name',
    normalCapacity: 'Normal Capacity',
    examCapacity: 'Exam Capacity',
    numberOfCharacteristics: 'Number of Characteristics',
  },
  '#rooms-table': {
    buildingA: 'Building A',
    roomNameB: 'Room Name B',
    normalCapacityC: 'Normal Capacity C',
    examCapacityD: 'Exam Capacity D',
    numberOfCharacteristicsE: 'Number of Characteristics E',
  },
};

function isTableCreated(selector) {
  return $(selector).hasClass('tabulator');
}

function createTable(selector, data) {
  $(selector).tabulator({
    autoColumns: true,
    autoColumnsDefinitions: function (definitions) {
      return autoColumnsDefinitions(definitions, selector);
    },
    frozenRows: 1,
    maxHeight: '50vh',
    data,
  });
}

function autoColumnsDefinitions(definitions, tableSelector) {
  definitions.forEach((column) => {
    column.editable = editable;
    column.editor = 'list';
    column.editorParams = {
      valuesLookup: function (cell) {
        return valuesLookup(cell, tableSelector);
      },
      clearable: true,
      autocomplete: true,
      listOnEmpty: true,
    };
  });

  return definitions;
}

function editable(cell) {
  var row = cell.getRow();
  return row.isFrozen();
}

function valuesLookup(cell, tableSelector) {
  var cellValue = cell.getValue();
  var rowData = cell.getData();
  var rowValues = Object.values(rowData);
  var fields = tableFields[tableSelector];

  return Object.values(fields).filter((value) => {
    return value === cellValue || !rowValues.includes(value);
  });
}

$('[data-import]').click(function (event) {
  var dataTable = $(event.target).data('table');
  var dataFileInput = $(event.target).data('file-input');
  var file = $(dataFileInput).prop('files')[0];

  Papa.parse(file, {
    worker: true,
    header: true,
    complete: function (results) {
      const data = results.data.slice();
      const fields = results.meta.fields;

      var fieldsRow = fields.reduce(function(obj, field) {
        obj[field] = undefined;
        return obj;
      }, {});
      data.unshift(fieldsRow);

      if (isTableCreated(dataTable)) {
        $(dataTable).tabulator('setData', data);
      } else {
        createTable(dataTable, data);
      }
    },
    error: function (err) {
      console.error('Error parsing file', err);
    },
  });
});

$('[data-preview]').click(function (event) {
  var dataTable = $(event.target).data('table');
  var dataFileInput = $(event.target).data('file-input');
  var dataRowsInput = $(event.target).data('rows-input');

  var file = $(dataFileInput).prop('files')[0];
  var preview = parseInt($(dataRowsInput).val(), 10);

  Papa.parse(file, {
    worker: true,
    header: true,
    preview: preview + 1,
    complete: function (results) {
      if (isTableCreated(dataTable)) {
        $(dataTable).tabulator('setData', results.data);
      } else {
        createTable(dataTable, results.data);
      }
    },
    error: function (err) {
      console.error('Error parsing file', err);
    },
  });
});

function getData(tableSelector) {
  var data = $(tableSelector).tabulator('getData');
  var fieldsRow = data[0];

  var fields = tableFields[tableSelector];
  var fieldNames = Object.keys(fields);

  return data.slice(1).map(function (row) {
    return Object.keys(row).reduce(function (newRow, rowKey) {
      var rowValue = row[rowKey];
      var fieldDescription = fieldsRow[rowKey];

      var fieldName = fieldNames.find(name => {
        return fields[name] === fieldDescription;
      }) ?? rowKey;

      newRow[fieldName] = rowValue;
      return newRow;
    }, {});
  });
}

$('#get-classes-btn').click(function() {
  var data = getData('#classes-table');
  console.log(data);
});

$('#get-rooms-btn').click(function() {
  var data = getData('#rooms-table');
  console.log(data);
});
