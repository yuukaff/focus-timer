let totalTime = 25 * 60;
let time = totalTime;
let timerId = null;

const timerDisplay = document.getElementById("timer");
const progressCircle = document.getElementById("progressCircle");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const studyTimeText = document.getElementById("studyTime");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let studySeconds = Number(localStorage.getItem("studySeconds")) || 0;

function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progress = 628 * (time / totalTime);

  progressCircle.style.strokeDashoffset = 628 - progress;
}

function updateStudyTime() {
  const mins = Math.floor(studySeconds / 60);

  studyTimeText.textContent =
    `今日の勉強時間: ${mins}分`;
}

function startTimer() {

  if (timerId !== null) return;

  timerId = setInterval(() => {

    time--;
    studySeconds++;

    localStorage.setItem("studySeconds", studySeconds);

    updateDisplay();
    updateStudyTime();

    if (time <= 0) {

      clearInterval(timerId);

      alert("休憩しよ〜〜");
    }

  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {

  const tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

  taskList.innerHTML = "";

  tasks.forEach((task, index) => {

    const li = document.createElement("li");

    li.textContent = task;

    const deleteBtn =
      document.createElement("button");

    deleteBtn.textContent = "完了";

    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {

      tasks.splice(index, 1);

      saveTasks(tasks);

      loadTasks();
    });

    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

addTaskBtn.addEventListener("click", () => {

  const task = taskInput.value;

  if (task === "") return;

  const tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.push(task);

  saveTasks(tasks);

  loadTasks();

  taskInput.value = "";
});
const calendar = document.getElementById("calendar");

function saveDailyRecord() {

  const today =
    new Date().toLocaleDateString();

  let records =
    JSON.parse(localStorage.getItem("records")) || {};

  records[today] = studySeconds;

  localStorage.setItem(
    "records",
    JSON.stringify(records)
  );
}

function loadCalendar() {

  const records =
    JSON.parse(localStorage.getItem("records")) || {};

  calendar.innerHTML = "";

  Object.entries(records)
    .reverse()
    .forEach(([date, seconds]) => {

      const div =
        document.createElement("div");

      div.classList.add("calendar-day");

      const mins =
        Math.floor(seconds / 60);

      div.textContent =
        `${date} : ${mins}分`;

      calendar.appendChild(div);
    });
}

setInterval(() => {

  saveDailyRecord();

  loadCalendar();

}, 5000);

loadCalendar();