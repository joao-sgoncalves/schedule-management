// const codemirrorTest = CodeMirror.fromTextArea(document.getElementById('codemirror-test'), {
//   mode: 'javascript',
//   tabSize: 2,
//   lineNumbers: true,
//   allowDropFileTypes: ['text/javascript'],
// });

const codemirrorTable = new Tabulator('#codemirror-table', {
  columns: [
    {
      title: 'Expressão',
      field: 'expression',
      editor: (cell) => {
        const cellElement = cell.getElement();

        const codemirrorEditor = CodeMirror(cellElement, {
          value: 'Default',
          mode: 'javascript',
          tabSize: 2,
          allowDropFileTypes: ['text/javascript'],
          autofocus: true,
        });

        codemirrorEditor.setSize('100%', '100%');

        return codemirrorEditor.getWrapperElement();
      },
    }
  ],
  data: [{}],
});
