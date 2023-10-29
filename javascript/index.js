// TODO: Move to configurations!!
const fieldSeparator = ';';
const lineSeparator = '\r\n';

let schedule = [];
let classrooms = [];

const scheduleInput = document.getElementById("schedule-input");
const classroomsInput = document.getElementById("classrooms-input");

scheduleInput.addEventListener("change", handleScheduleFileChange, false);
classroomsInput.addEventListener("change", handleClassroomsFileChange, false);

function handleScheduleFileChange(input) {
  const file = input.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const result = event.target.result;
    schedule = getFileData(result);

    console.log(schedule);
  };

  reader.readAsText(file);
}

function handleClassroomsFileChange(input) {
  const file = input.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const result = event.target.result;
    classrooms = getFileData(result);

    console.log(classrooms);
  };

  reader.readAsText(file);
}

function getFileData(content) {
  const lines = content.split(lineSeparator);

  const headerLine = lines[0];
  const headerNames = headerLine.split(fieldSeparator);
  
  const dataLines = lines.slice(1);
  const data = [];

  dataLines.forEach((line) => {
    const fields = line.split(fieldSeparator);

    const obj = headerNames.reduce((obj, name, index) => {
      obj[name] = fields[index];
      return obj;
    }, {});

    data.push(obj);
  });

  return data;
}

// visualization in many criteria optimization
// dizer que tem 50 sobrelotações, mostrar ao passar com o rato por cima

const dropArea = document.querySelector('.drag-files')
dropArea.addEventListener('dragover', ()=>{
    dropArea.classList.add('dragover')
})
dropArea.addEventListener('dragleave', ()=>{
    dropArea.classList.remove('dragover')
})