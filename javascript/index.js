const scheduleInput = document.getElementById("schedule-input");

scheduleInput.addEventListener("change", getSchedule, false);

function getSchedule() {
  const file = scheduleInput.files[0];

  console.log(file);
}
