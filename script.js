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
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.todo}</td>
            <td>${task.userId}</td>
            <td>${task.completed ? 'Done' : 'Pending'}</td>
            <td class="actions">
                <button class="done-btn" onclick="markAsDone(${task.id})">${task.completed ? 'Undo' : 'Done'}</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        todoList.appendChild(row);
    });
    document.getElementById('task-count').textContent = `Total tasks: ${tasks.length}`;
}

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Task cannot be empty!");
        return;
    }
    const lastTaskId = toDoTasks.length > 0 ? Math.max(...toDoTasks.map(t => t.id)) : 0;
    const newTaskId = lastTaskId + 1;
    const lastUserId = toDoTasks.length > 0 ? Math.max(...toDoTasks.map(t => t.userId)) : 0;
    const newUserId = lastUserId + 1;
    const newTask = {
        id: newTaskId,
        todo: taskText,
        userId: newUserId,
        completed: false
    };
    toDoTasks.push(newTask);
    displayTasks(toDoTasks);
    saveTasks(); 
    taskInput.value = ""; 
}

function markAsDone(taskId) {
    toDoTasks = toDoTasks.map(task => {
        if (task.id === taskId) {
            task.completed = !task.completed;
        }
        return task;
    });
    displayTasks(toDoTasks);
    saveTasks(); 
}

function deleteTask(taskId) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        toDoTasks = toDoTasks.filter(task => task.id !== taskId);
        displayTasks(toDoTasks);
        saveTasks(); 
    }
}

function filterTasks() {
    const searchValue = document.getElementById('search-task').value.toLowerCase();
    const filteredTasks = toDoTasks.filter(task => task.todo.toLowerCase().includes(searchValue));
    displayTasks(filteredTasks);
}

window.onload = function() {
        loadTasks();
        if (toDoTasks.length === 0) { 
            fetchTasks(); 
        }
}