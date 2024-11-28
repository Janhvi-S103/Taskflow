let tasks = [];

async function fetchTasks() {
    try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        tasks = data.tasks;
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        document.getElementById('taskList').innerHTML = '<p class="error">Failed to load tasks</p>';
    }
}

function renderTasks(tasksToRender) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = tasksToRender.map(task => `
        <div class="task-card ${task.status.toLowerCase().replace(' ', '-')}">
            <div class="task-header">
                <h3>${task.name}</h3>
                <span class="status-badge">${task.status}</span>
            </div>
            <p>${task.description}</p>
            <div class="task-footer">
                <span>Due: ${new Date(task.deadline).toLocaleDateString()}</span>
                <div class="task-actions">
                    <button onclick="updateStatus('${task._id}')">Update</button>
                    <button onclick="deleteTask('${task._id}')" class="delete-btn">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterTasks(status) {
    const buttons = document.querySelectorAll('.filters button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const filteredTasks = status === 'all' ? 
        tasks : 
        tasks.filter(task => task.status === status);
    renderTasks(filteredTasks);
}

async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const task = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        
        if (!response.ok) throw new Error('Failed to create task');
        
        closeModal();
        event.target.reset();
        fetchTasks();
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to create task');
    }
}

async function updateStatus(taskId) {
    const statusOptions = ['Not Started', 'In Progress', 'Completed'];
    const currentTask = tasks.find(t => t._id === taskId);
    const currentIndex = statusOptions.indexOf(currentTask.status);
    const newStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        fetchTasks();
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete task');
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
    }
}

function openModal() {
    document.getElementById('taskModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', fetchTasks);