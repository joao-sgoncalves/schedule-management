var config = {
  tableFields: {
    classes: {
      course: {
        title: 'Curso',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
        sorter: 'string',
      },
      executionUnit: {
        title: 'Unidade de execução',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
        sorter: 'string',
      },
      shift: {
        title: 'Turno',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
        sorter: 'string',
      },
      class: {
        title: 'Turma',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
        sorter: 'string',
      },
      registeredOnShift: {
        title: 'Inscritos no turno',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
        headerFilter: 'input',
        sorter: 'number',
      },
      dayOfTheWeek: {
        title: 'Dia da Semana',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'right',
        headerFilter: 'input',
        sorter: 'string',
      },
      start: {
        title: 'Início',
        formatter: 'datetime',
        formatterParams: {
          outputFormat: 'HH:mm:ss',
        },
        type: 'DateTime',
        typeParams: {
          format: 'HH:mm:ss',
        },
        hozAlign: 'center',
        headerFilter: 'time',
        headerFilterParams: {
          format: true,
        },
        sorter: 'time',
      },
      end: {
        title: 'Fim',
        formatter: 'datetime',
        formatterParams: {
          outputFormat: 'HH:mm:ss',
        },
        type: 'DateTime',
        typeParams: {
          format: 'HH:mm:ss',
        },
        hozAlign: 'center',
        headerFilter: 'time',
        headerFilterParams: {
          format: true,
        },
        sorter: 'time',
      },
      day: {
        title: 'Dia',
        formatter: 'datetime',
        formatterParams: {
          outputFormat: 'dd/MM/yyyy',
        },
        type: 'DateTime',
        typeParams: {
          format: 'dd/MM/yyyy',
        },
        hozAlign: 'center',
        headerFilter: 'date',
        headerFilterParams: {
          format: true,
        },
        sorter: 'date',
      },
      requestedRoomCharacteristics: {
        title: 'Características da sala pedida para a aula',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
        sorter: 'string',
      },
      classroom: {
        title: 'Sala da aula',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
        sorter: 'string',
      },
      capacity: {
        title: 'Lotação',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
        headerFilter: 'number',
        sorter: 'number',
      },
      actualRoomCharacteristics: {
        title: 'Características reais da sala',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
        sorter: 'string',
      },
    },
    rooms: {
      building: {
        title: 'Edifício',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
        sorter: 'string',
      },
      roomName: {
        title: 'Nome sala',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
        sorter: 'string',
      },
      normalCapacity: {
        title: 'Capacidade Normal',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
        headerFilter: 'number',
        sorter: 'number',
      },
      examCapacity: {
        title: 'Capacidade Exame',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
        headerFilter: 'number',
        sorter: 'number',
      },
      numberOfCharacteristics: {
        title: 'Nº características',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
        headerFilter: 'number',
        sorter: 'number',
      },
      amphitheaterClasses: {
        title: 'Anfiteatro aulas',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      technicalSupportEvents: {
        title: 'Apoio técnico eventos',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      arq1: {
        title: 'Arq 1',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      arq2: {
        title: 'Arq 2',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      arq3: {
        title: 'Arq 3',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      arq4: {
        title: 'Arq 4',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      arq5: {
        title: 'Arq 5',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      arq6: {
        title: 'Arq 6',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      arq9: {
        title: 'Arq 9',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      byod: {
        title: 'BYOD (Bring Your Own Device)',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      focusGroup: {
        title: 'Focus Group',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      roomScheduleVisible: {
        title: 'Horário sala visível portal público',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      computerArchitectureLab1: {
        title: 'Laboratório de Arquitectura de Computadores I',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      computerArchitectureLab2: {
        title: 'Laboratório de Arquitectura de Computadores II',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      engineeringBasesLab: {
        title: 'Laboratório de Bases de Engenharia',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      electronicsLab: {
        title: 'Laboratório de Electrónica',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      computerLab: {
        title: 'Laboratório de Informática',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      journalismLab: {
        title: 'Laboratório de Jornalismo',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      computerNetworksLab1: {
        title: 'Laboratório de Redes de Computadores I',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      computerNetworksLab2: {
        title: 'Laboratório de Redes de Computadores II',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      telecommunicationsLab: {
        title: 'Laboratório de Telecomunicações',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      mastersClassroom: {
        title: 'Sala Aulas Mestrado',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      mastersClassroomPlus: {
        title: 'Sala Aulas Mestrado Plus',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      neeRoom: {
        title: 'Sala NEE',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      examRoom: {
        title: 'Sala Provas',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      meetingRoom: {
        title: 'Sala Reunião',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      architectureRoom: {
        title: 'Sala de Arquitectura',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      normalClassroom: {
        title: 'Sala de Aulas normal',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      videoconference: {
        title: 'videoconferencia',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
      atrium: {
        title: 'Átrio',
        formatter: 'tickCross',
        formatterParams: {
          allowEmpty: true,
        },
        type: 'Boolean',
        typeParams: {
          trueValue: 'X',
        },
        hozAlign: 'center',
        headerFilter: 'tickCross',
        headerFilterParams: {
          tristate: true,
        },
        sorter: 'boolean',
      },
    },
  },
  defaultCriteria: [
    {
      id: 1,
      name: 'Sobrelotação',
      expression: 'Aula["Inscritos no turno"] - Aula["Lotação"] > 0',
      aggregator: 'COUNT',
    },
    {
      id: 2,
      name: 'Capacidade Total',
      expression: 'Sala["Capacidade Normal"] + Sala["Capacidade Exame"]',
      aggregator: 'SUM',
    },
    {
      id: 3,
      name: 'Turno',
      expression: 'Aula["Turno"].endsWith("TP01")',
      aggregator: 'COUNT',
    },
    {
      id: 4,
      name: 'Expressão Regular',
      expression: '/\\d{5}TP01/g.test(Aula["Turno"])',
      aggregator: 'COUNT',
    },
    {
      id: 5,
      name: 'Horas',
      expression: 'Aula["Início"].hour + " " + Aula["Início"].minute + " " + Aula["Início"].second',
      aggregator: 'COUNT',
    },
    {
      id: 6,
      name: 'Datas',
      expression: 'Aula["Dia"].day + " " + Aula["Dia"].month + " " + Aula["Dia"].year',
      aggregator: 'COUNT',
    },
  ],
};
