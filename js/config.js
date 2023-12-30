var config = {
  tableFields: {
    classes: {
      building: 'Edifício',
      roomName: 'Nome sala',
      normalCapacity: 'Capacidade Normal',
      examCapacity: 'Capacidade Exame',
      numberOfCharacteristics: 'Nº características',
    },
    rooms: {
      buildingA: 'Building A',
      roomNameB: 'Room Name B',
      normalCapacityC: 'Normal Capacity C',
      examCapacityD: 'Exam Capacity D',
      numberOfCharacteristicsE: 'Number of Characteristics E',
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
