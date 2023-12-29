const codemirrorTest = CodeMirror.fromTextArea(document.getElementById('codemirror-test'), {
  mode: 'javascript',
  tabSize: 2,
  lineNumbers: true,
  extraKeys: { "Ctrl-Space": "autocomplete" },
  allowDropFileTypes: ['text/javascript'],
  hintOptions: {
    hint: CodeMirror.hint.javascript,
    completeSingle: false,
  },
  lint: true,
});

codemirrorTest.on('keyup', (cm, event) => {
  const completionActive = cm.state.completionActive;
  const excludedKeys = ['Enter', 'Escape'];

  if (!completionActive && !excludedKeys.includes(event.key)) {
    cm.showHint({
      hint: CodeMirror.hint.javascript,
      completeSingle: false,
    });
  }
});

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
          extraKeys: { "Ctrl-Space": "autocomplete" },
          allowDropFileTypes: ['text/javascript'],
          autofocus: true,
          hintOptions: {
            alignWithWord: true,
          },
        });

        codemirrorEditor.setSize('100%', '100%');

        codemirrorEditor.on('keyup', (cm, event) => {
          console.log(cm, event);
        });

        return codemirrorEditor.getWrapperElement();
      },
    }
  ],
  data: [{}],
});
