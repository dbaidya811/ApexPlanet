const form       = document.getElementById('contact-form');
const nameInput  = document.getElementById('name');
const emailInput = document.getElementById('email');
const msgInput   = document.getElementById('message');
const successMsg = document.getElementById('success-msg');

function showError(input, errEl, msg) {
  input.classList.add('invalid');
  input.classList.remove('valid');
  errEl.textContent = msg;
}

function clearError(input, errEl) {
  input.classList.remove('invalid');
  input.classList.add('valid');
  errEl.textContent = '';
}

function validateName() {
  const errEl = document.getElementById('name-error');
  const value = nameInput.value.trim();
  if (value === '') {
    showError(nameInput, errEl, '⚠ Full name is required.');
    return false;
  }
  if (value.length < 2) {
    showError(nameInput, errEl, '⚠ Name must be at least 2 characters.');
    return false;
  }
  clearError(nameInput, errEl);
  return true;
}

function validateEmail() {
  const errEl = document.getElementById('email-error');
  const value = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value === '') {
    showError(emailInput, errEl, '⚠ Email address is required.');
    return false;
  }
  if (!emailRegex.test(value)) {
    showError(emailInput, errEl, '⚠ Please enter a valid email (e.g. john@example.com).');
    return false;
  }
  clearError(emailInput, errEl);
  return true;
}

function validateMessage() {
  const errEl = document.getElementById('message-error');
  const value = msgInput.value.trim();
  if (value === '') {
    showError(msgInput, errEl, '⚠ Message cannot be empty.');
    return false;
  }
  if (value.length < 10) {
    showError(msgInput, errEl, '⚠ Message must be at least 10 characters.');
    return false;
  }
  clearError(msgInput, errEl);
  return true;
}

nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
msgInput.addEventListener('blur', validateMessage);

nameInput.addEventListener('input', () => {
  if (nameInput.classList.contains('invalid')) validateName();
});

emailInput.addEventListener('input', () => {
  if (emailInput.classList.contains('invalid')) validateEmail();
});

msgInput.addEventListener('input', () => {
  if (msgInput.classList.contains('invalid')) validateMessage();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const isNameValid    = validateName();
  const isEmailValid   = validateEmail();
  const isMessageValid = validateMessage();

  if (isNameValid && isEmailValid && isMessageValid) {
    successMsg.textContent = `✅ Thanks, ${nameInput.value.trim()}! Your message has been sent. We'll reply to ${emailInput.value.trim()} within 24 hours.`;
    successMsg.style.display = 'block';
    setTimeout(() => {
      form.reset();
      [nameInput, emailInput, msgInput].forEach(el => el.classList.remove('valid', 'invalid'));
      successMsg.style.display = 'none';
    }, 5000);
  }
});
