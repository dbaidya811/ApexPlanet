const taskInput  = document.getElementById('task-input');
const addBtn     = document.getElementById('add-btn');
const taskList   = document.getElementById('task-list');
const errorMsg   = document.getElementById('error-msg');
const taskCount  = document.getElementById('task-count');
const emptyState = document.getElementById('empty-state');

function updateCount() {
  const total = taskList.querySelectorAll('.task-item').length;
  taskCount.textContent = total === 1 ? '1 task' : `${total} tasks`;
  emptyState.style.display = total === 0 ? 'flex' : 'none';
}

function showError(msg) {
  errorMsg.textContent = msg;
  taskInput.classList.add('shake');
  taskInput.addEventListener('animationend', () => {
    taskInput.classList.remove('shake');
  }, { once: true });
}

function clearError() {
  errorMsg.textContent = '';
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === '') {
    showError('⚠ Please enter a task before adding.');
    taskInput.focus();
    return;
  }

  clearError();

  const li = document.createElement('li');
  li.classList.add('task-item');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('task-checkbox');
  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);
  });

  const span = document.createElement('span');
  span.classList.add('task-text');
  span.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.addEventListener('click', () => {
    li.classList.add('removing');
    li.addEventListener('animationend', () => {
      li.remove();
      updateCount();
    }, { once: true });
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  taskInput.value = '';
  taskInput.focus();
  updateCount();
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

taskInput.addEventListener('input', () => {
  if (taskInput.value.trim() !== '') clearError();
});

updateCount();
