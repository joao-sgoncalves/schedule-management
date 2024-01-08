var config = {
  tableFields: {
    classes: {
      building: {
        title: 'Edifício',
        formatter: 'plaintext',
      },
      roomName: {
        title: 'Nome sala',
        formatter: 'plaintext',
      },
      normalCapacity: {
        title: 'Capacidade Normal',
        formatter: 'plaintext',
      },
      examCapacity: {
        title: 'Capacidade Exame',
        formatter: 'plaintext',
      },
      numberOfCharacteristics: {
        title: 'Nº características',
        formatter: 'plaintext',
      },
    },
    rooms: {
      buildingA: {
        title: 'Building A',
        formatter: 'plaintext',
      },
      roomNameB: {
        title: 'Room Name B',
        formatter: 'plaintext',
      },
      normalCapacityC: {
        title: 'Normal Capacity C',
        formatter: 'plaintext',
      },
      examCapacityD: {
        title: 'Exam Capacity D',
        formatter: 'plaintext',
      },
      numberOfCharacteristicsE: {
        title: 'Number of Characteristics E',
        formatter: 'plaintext',
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
