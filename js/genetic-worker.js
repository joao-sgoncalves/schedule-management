function createGene(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

function createDna(size, maxValue) {
  const gene = [];

  for (let i = 0; i < size; i++) {
    gene.push(createGene(maxValue));
  }

  return gene;
}

function createPopulation(popSize, dnaSize, maxValue) {
  const population = [];

  for (let i = 0; i < popSize; i++) {
    population.push(createDna(dnaSize, maxValue));
  }

  return population;
}

function mutate(dna, mutationRate, maxValue) {
  const mutatedDna = dna.map((gene) =>
    Math.random() < mutationRate ? createGene(maxValue) : gene
  );

  return mutatedDna;
}

function crossover(mom, dad) {
  const crossoverPoint = Math.floor(Math.random() * (mom.length - 1)) + 1;
  const child = mom.slice(0, crossoverPoint).concat(dad.slice(crossoverPoint));

  return child;
}

function sortByFitness(a, b) {
  if (a.fitness.overlapping < b.fitness.overlapping) return -1;
  if (a.fitness.overlapping > b.fitness.overlapping) return 1;
  if (a.fitness.overcrowded < b.fitness.overcrowded) return -1;
  if (a.fitness.overcrowded > b.fitness.overcrowded) return 1;
  if (a.fitness.characteristics < b.fitness.characteristics) return -1;
  if (a.fitness.characteristics > b.fitness.characteristics) return 1;
  return 0;
}

function fitness(dna, classrooms, classes, criteria) {
  const score = { overlapping: 0, overcrowded: 0, characteristics: 0 };

  dna.forEach((gene, index) => {
    const currClass = classes[index];
    const currClassroom = classrooms[gene];

    if (
      criteria.overcrowded &&
      currClass.studentsSubscribed > currClassroom.normalCap
    ) {
      score.overcrowded += 1;
    }

    if (criteria.characteristics) {
      for (let characteristic of currClass.askedCharacteristics) {
        if (!currClassroom.characteristics.includes(characteristic)) {
          score.characteristics += 1;
        }
      }
    }

    if (criteria.overlapping) {
      for (let i = 0; i < index; i++) {
        if (dna[i] === gene) {
          const tmpClass = classes[i];

          if (
            (currClass.startDate > tmpClass.startDate &&
              currClass.startDate < tmpClass.endDate) ||
            (currClass.endDate > tmpClass.startDate &&
              currClass.endDate < tmpClass.endDate)
          ) {
            score.overlapping += 1;

            break;
          }
        }
      }
    }
  });

  return score;
}

function genetic(
  popSize,
  classrooms,
  classes,
  criteria,
  mutationRate,
  generations
) {
  const CLASSROOMS_COUNT = classrooms.length;
  const CLASSES_COUNT = classes.length;

  let population = createPopulation(popSize, CLASSES_COUNT, CLASSROOMS_COUNT);
  let generationCount = 0;

  while (generationCount < generations) {
    console.time("generation");
    let populationFitness = population.map((el) => {
      let elFitness = fitness(el, classrooms, classes, criteria);

      return { dna: el, fitness: elFitness };
    });

    let top30 = populationFitness
      .sort(sortByFitness)
      .slice(0, Math.floor(popSize * 0.3));

    top30.forEach((el) => console.log(el.fitness));

    let newPopulation = [...top30.map((el) => el.dna)];

    while (newPopulation.length < popSize) {
      let newEl = crossover(
        top30[Math.floor(Math.random() * Math.floor(popSize * 0.3))].dna,
        top30[Math.floor(Math.random() * Math.floor(popSize * 0.3))].dna
      );

      newPopulation.push(mutate(newEl, mutationRate, CLASSROOMS_COUNT));
    }

    population = [...newPopulation];

    generationCount += 1;
    console.timeEnd("generation");
  }

  let populationFitness = population.map((el) => {
    let elFitness = fitness(el, classrooms, classes, criteria);

    return { dna: el, fitness: elFitness };
  });

  let top10 = populationFitness
    .sort(sortByFitness)
    .slice(0, Math.floor(popSize * 0.1));

  return top10;
}

function start(message) {
  let { classes, classrooms, criteria } = message.data;

  let tmpClasses = classes.reduce((acc, curr) => {
    const askedCharacteristics = curr[
      "Características da sala pedida para a aula"
    ]
      ? curr["Características da sala pedida para a aula"].split(", ")
      : [];
    acc.push({
      ...curr,
      day: curr["Dia"],
      studentsSubscribed: curr["Inscritos no turno"],
      startDate: new Date(`${curr["Dia"]} ${curr["Início"]}`),
      endDate: new Date(`${curr["Dia"]} ${curr["Fim"]}`),
      askedCharacteristics,
    });

    return acc;
  }, []);

  let tmpClassrooms = classrooms.reduce((acc, curr) => {
    acc.push({
      normalCap: curr["Capacidade Normal"],
      characteristics: Object.keys(curr).reduce((acc2, curr2) => {
        if (curr[curr2] === "X") {
          acc2.push(curr2);
        }

        return acc2;
      }, []),
    });

    return acc;
  }, []);

  const results = genetic(
    criteria.popSize,
    tmpClassrooms,
    tmpClasses,
    criteria,
    0.1,
    criteria.generations
  );

  const classesResult = results.map((result) => {
    return {
      classes: result.dna.map((gene, index) => {
        const { id, ...tmpClass } = classes[index];
        return {
          ...tmpClass,
          "Nome sala": classrooms[gene]["Nome sala"],
          "Capacidade Normal": classrooms[gene]["Capacidade Normal"],
          "Características reais da sala":
            tmpClassrooms[gene].characteristics.join(", "),
        };
      }),
      score: result.fitness,
    };
  });

  postMessage(classesResult);
}

onmessage = start;
