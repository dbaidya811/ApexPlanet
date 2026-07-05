const taskInput     = document.getElementById('task-input');
const addBtn        = document.getElementById('add-btn');
const taskList      = document.getElementById('task-list');
const errorMsg      = document.getElementById('error-msg');
const countBadge    = document.getElementById('count-badge');
const emptyState    = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const clearBtn      = document.getElementById('clear-btn');
const filterBtns    = document.querySelectorAll('.filter-btn');

const STORAGE_KEY = 'advanced-todo-tasks';
let currentFilter = 'all';

function getTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function updateMeta() {
  const tasks = getTasks();
  const total = tasks.length;
  const active = tasks.filter(t => !t.completed).length;

  countBadge.textContent = total === 1 ? '1 task' : `${total} tasks`;
  remainingCount.textContent = active === 1 ? '1 left' : `${active} left`;

  const visible = taskList.querySelectorAll('.task-item:not([style*="display: none"])').length;
  emptyState.style.display = visible === 0 ? 'flex' : 'none';
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.classList.add('task-item');
  li.dataset.id = task.id;
  if (task.completed) li.classList.add('completed-item');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('task-checkbox');
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTask(task.id, li));

  const span = document.createElement('span');
  span.classList.add('task-text');
  span.textContent = task.text;

  const date = document.createElement('span');
  date.classList.add('task-date');
  date.textContent = task.date;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.addEventListener('click', () => deleteTask(task.id, li));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(date);
  li.appendChild(deleteBtn);

  return li;
}

function applyFilter(li, task) {
  if (currentFilter === 'all') {
    li.style.display = '';
  } else if (currentFilter === 'active') {
    li.style.display = task.completed ? 'none' : '';
  } else if (currentFilter === 'completed') {
    li.style.display = task.completed ? '' : 'none';
  }
}

function renderTasks() {
  taskList.innerHTML = '';
  const tasks = getTasks();
  tasks.forEach(task => {
    const li = createTaskElement(task);
    applyFilter(li, task);
    taskList.appendChild(li);
  });
  updateMeta();
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === '') {
    errorMsg.textContent = '⚠ Please enter a task before adding.';
    taskInput.classList.add('shake');
    taskInput.addEventListener('animationend', () => taskInput.classList.remove('shake'), { once: true });
    taskInput.focus();
    return;
  }

  errorMsg.textContent = '';

  const task = {
    id: Date.now().toString(),
    text,
    completed: false,
    date: formatDate()
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  const li = createTaskElement(task);
  applyFilter(li, task);
  taskList.appendChild(li);

  taskInput.value = '';
  taskInput.focus();
  updateMeta();
}

function toggleTask(id, li) {
  const tasks = getTasks().map(t => {
    if (t.id === id) t.completed = !t.completed;
    return t;
  });
  saveTasks(tasks);

  const task = tasks.find(t => t.id === id);
  li.classList.toggle('completed-item', task.completed);
  li.querySelector('.task-checkbox').checked = task.completed;
  applyFilter(li, task);
  updateMeta();
}

function deleteTask(id, li) {
  li.classList.add('removing');
  li.addEventListener('animationend', () => {
    li.remove();
    const tasks = getTasks().filter(t => t.id !== id);
    saveTasks(tasks);
    updateMeta();
  }, { once: true });
}

clearBtn.addEventListener('click', () => {
  const items = taskList.querySelectorAll('.task-item');
  items.forEach(li => {
    const task = getTasks().find(t => t.id === li.dataset.id);
    if (task && task.completed) deleteTask(task.id, li);
  });
  setTimeout(() => {
    const tasks = getTasks().filter(t => !t.completed);
    saveTasks(tasks);
    updateMeta();
  }, 300);
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    const tasks = getTasks();
    taskList.querySelectorAll('.task-item').forEach(li => {
      const task = tasks.find(t => t.id === li.dataset.id);
      if (task) applyFilter(li, task);
    });
    updateMeta();
  });
});

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

taskInput.addEventListener('input', () => {
  if (taskInput.value.trim() !== '') errorMsg.textContent = '';
});

renderTasks();
