var config = {
  tableFields: {
    classes: {
      course: {
        title: 'Curso',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
      },
      executionUnit: {
        title: 'Unidade de execução',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
      },
      shift: {
        title: 'Turno',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
      },
      class: {
        title: 'Turma',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
      },
      registeredOnShift: {
        title: 'Inscritos no turno',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
        headerFilter: 'input',
      },
      dayOfTheWeek: {
        title: 'Dia da Semana',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'right',
        headerFilter: 'input',
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
      },
      requestedRoomCharacteristics: {
        title: 'Características da sala pedida para a aula',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
      },
      classroom: {
        title: 'Sala da aula',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
      },
      capacity: {
        title: 'Lotação',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
        headerFilter: 'number',
      },
      actualRoomCharacteristics: {
        title: 'Características reais da sala',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
      },
    },
    rooms: {
      building: {
        title: 'Edifício',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
      },
      roomName: {
        title: 'Nome sala',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
        headerFilter: 'input',
      },
      normalCapacity: {
        title: 'Capacidade Normal',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
        headerFilter: 'number',
      },
      examCapacity: {
        title: 'Capacidade Exame',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
        headerFilter: 'number',
      },
      numberOfCharacteristics: {
        title: 'Nº características',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
        headerFilter: 'number',
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
      },
    },
  },
  defaultCriteria: [
    {
      id: 1,
      name: 'Nome 1',
      expression: 'Expressão 1',
      aggregator: 'MAX',
    },
    {
      id: 2,
      name: 'Nome 2',
      expression: 'Expressão 2',
      aggregator: 'SUM',
    },
  ],
};
