let tasksData = {};
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns = [todo, progress, done];
let dragElement = null;

function addTask(title, desc, column) {
    const div = document.createElement("div");

    div.classList.add("task");
    div.setAttribute("draggable", "true");
    div.innerHTML = `
        <h2 class="task-title">${title}</h2>
        <p class="task-desc">${desc}</p>
        <button>Delete</button>
    `;
    column.appendChild(div);

    div.addEventListener("drag", (e) => {
        dragElement = div;
    });

    const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    });

    return div;
}

function updateTaskCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll('.task');
        const count = col.querySelector('.right');

        tasksData[col.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            };
        });

        localStorage.setItem("tasksData", JSON.stringify(tasksData));
        count.innerText = tasks.length;
    });
}

if (localStorage.getItem("tasksData")) {
    const data = JSON.parse(localStorage.getItem("tasksData"));

    console.log(data);

    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            addTask(task.title, task.desc, column);
        });
    }

    updateTaskCount();
}

function addDragEventsOnColumn(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", (e) => {
        e.preventDefault();

        column.appendChild(dragElement);
        column.classList.remove("hover-over");

        updateTaskCount();
    });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

/* modal related logic */
const toggleModalButton = document.querySelector('#toggle-modal');
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

addTaskButton.addEventListener("click", () => {
    const taskTitleInput = document.querySelector("#task-title-input");
    const taskDescInput = document.querySelector("#task-desc-input");

    addTask(taskTitleInput.value, taskDescInput.value, todo);
    updateTaskCount();

    taskTitleInput.value = "";
    taskDescInput.value = "";

    modal.classList.remove("active");
});
/* modal related logic */
