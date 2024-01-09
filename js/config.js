var config = {
  tableFields: {
    classes: {
      course: {
        title: 'Curso',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
      },
      executionUnit: {
        title: 'Unidade de execução',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
      },
      shift: {
        title: 'Turno',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
      },
      class: {
        title: 'Turma',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
      },
      registeredOnShift: {
        title: 'Inscritos no turno',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
      },
      dayOfTheWeek: {
        title: 'Dia da Semana',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'right',
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
      },
      requestedRoomCharacteristics: {
        title: 'Características da sala pedida para a aula',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
      },
      classroom: {
        title: 'Sala da aula',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
      },
      capacity: {
        title: 'Lotação',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
      },
      actualRoomCharacteristics: {
        title: 'Características reais da sala',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
      },
    },
    rooms: {
      building: {
        title: 'Edifício',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
      },
      roomName: {
        title: 'Nome sala',
        formatter: 'plaintext',
        type: 'String',
        hozAlign: 'left',
      },
      normalCapacity: {
        title: 'Capacidade Normal',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
      },
      examCapacity: {
        title: 'Capacidade Exame',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
      },
      numberOfCharacteristics: {
        title: 'Nº características',
        formatter: 'plaintext',
        type: 'Number',
        hozAlign: 'right',
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
