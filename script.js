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

      alert("集中時間終了！");
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

  tasks.forEach(task => {

    const li = document.createElement("li");

    li.textContent = task;

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

loadTasks();

updateDisplay();

updateStudyTime();