// Get the elements
const input = document.querySelector('.input-text');
const addButton = document.querySelector('.button-text');
const todoList = document.querySelector('.todo-list');
const completedList = document.querySelector('.completed-list');

const STORAGE_KEY = 'todo-tasks';

// Load tasks from localStorage and initialize the task lists
window.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    savedTasks.forEach(task => {
        const li = createTaskElement(task.text, task.completed);
        if (task.completed) {
            completedList.appendChild(li);
        } else {
            todoList.appendChild(li);
        }
    });
});

// Add task button click event
addButton.addEventListener('click', () => {
    const taskText = input.value.trim();
    if (!taskText) return;

    const li = createTaskElement(taskText, false);
    todoList.appendChild(li);

    saveTasks();
    input.value = '';
});

// Create task element
function createTaskElement(text, isCompleted) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-text ${isCompleted ? 'completed' : ''}">${text}</span>
        <button class="delete-btn">🗑️</button>
    `;

    return li;
}

// Delegate event listener for task operations (check/uncheck/delete)
document.body.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;

    const isCheckbox = e.target.classList.contains('task-checkbox');
    const isDeleteBtn = e.target.classList.contains('delete-btn');

    // Delete task
    if (isDeleteBtn) {
        li.remove();
        saveTasks();
        return;
    }

    // Mark as completed or restore
    if (isCheckbox) {
        const checked = e.target.checked;
        const textSpan = li.querySelector('.task-text');

        textSpan.classList.toggle('completed', checked);

        // Move to the corresponding list
        if (checked) {
            li.querySelector('.delete-btn').remove();
            completedList.appendChild(li);
        } else {
            todoList.appendChild(li);
        }

        saveTasks();
    }
});

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];

    document.querySelectorAll('.todo-list li').forEach(li => {
        const text = li.querySelector('.task-text').textContent;
        tasks.push({ text, completed: false });
    });

    document.querySelectorAll('.completed-list li').forEach(li => {
        const text = li.querySelector('.task-text').textContent;
        tasks.push({ text, completed: true });
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}