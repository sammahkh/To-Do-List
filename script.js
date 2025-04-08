let toDoTasks = [];

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        toDoTasks = JSON.parse(storedTasks);
    }
    displayTasks(toDoTasks);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(toDoTasks));
}

async function fetchTasks() {
    try {
        const response = await fetch('https://dummyjson.com/todos');
        const data = await response.json();
        toDoTasks = data.todos.slice(0, 5);
        displayTasks(toDoTasks);
        saveTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function displayTasks(tasks) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = "";
    tasks.forEach(task => {
        const row = createTaskRow(task);
        todoList.appendChild(row);
    });
    document.getElementById('task-count').textContent = `Total tasks: ${tasks.length}`;
}

function createTaskRow(task) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', task.id);
    row.innerHTML = `
        <td>${task.id}</td>
        <td>${task.todo}</td>
        <td>${task.userId}</td>
        <td class="status">${task.completed ? 'Done' : 'Pending'}</td>
        <td class="actions">
            <button class="done-btn" onclick="markAsDone(${task.id})">${task.completed ? 'Undo' : 'Done'}</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </td>
    `;
    return row;
}

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Task cannot be empty!");
        return;
    }
    const lastTaskId = toDoTasks.length > 0 ? Math.max(...toDoTasks.map(t => t.id)) : 0;
    const lastUserId = toDoTasks.length > 0 ? Math.max(...toDoTasks.map(t => t.userId)) : 0;
    const newTask = {
        id: lastTaskId + 1,
        todo: taskText,
        userId: lastUserId + 1,
        completed: false
    };
    toDoTasks.push(newTask);
    document.getElementById('todo-list').appendChild(createTaskRow(newTask));
    saveTasks();
    taskInput.value = "";
    document.getElementById('task-count').textContent = `Total tasks: ${toDoTasks.length}`;
}

function markAsDone(taskId) {
    const task = toDoTasks.find(task => task.id === taskId);
    if (!task) return;
    task.completed = !task.completed;
    const row = document.querySelector(`[data-id="${taskId}"]`);
    if (row) {
        row.querySelector('.status').textContent = task.completed ? 'Done' : 'Pending';
        row.querySelector('.done-btn').textContent = task.completed ? 'Undo' : 'Done';
    }
    saveTasks();
}

function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    toDoTasks = toDoTasks.filter(task => task.id !== taskId);
    const row = document.querySelector(`[data-id="${taskId}"]`);
    if (row) row.remove();
    saveTasks();
    document.getElementById('task-count').textContent = `Total tasks: ${toDoTasks.length}`;
}

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

const filterTasks = debounce(function () {
    const searchValue = document.getElementById('search-task').value.toLowerCase();
    const filteredTasks = toDoTasks.filter(task => task.todo.toLowerCase().includes(searchValue));
    displayTasks(filteredTasks);
}, 500);

window.onload = function() {
    loadTasks();
    if (toDoTasks.length === 0) {
        fetchTasks();
    }
};
