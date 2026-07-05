const questions = [
  {
    question: "Which HTML tag is used to link an external CSS file?",
    options: ["<style>", "<css>", "<link>", "<script>"],
    answer: 2
  },
  {
    question: "Which CSS property controls the space inside an element's border?",
    options: ["margin", "spacing", "padding", "border-gap"],
    answer: 2
  },
  {
    question: "Which JavaScript method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "append()"],
    answer: 0
  },
  {
    question: "What does 'DOM' stand for in web development?",
    options: [
      "Document Object Model",
      "Data Object Manager",
      "Display Output Mode",
      "Dynamic Object Method"
    ],
    answer: 0
  },
  {
    question: "Which of these is a valid way to declare a constant in JavaScript?",
    options: ["var x = 5", "let x = 5", "const x = 5", "define x = 5"],
    answer: 2
  }
];

let currentIndex = 0;
let score = 0;
let answered = false;

const questionText   = document.getElementById('question-text');
const optionsList    = document.getElementById('options-list');
const nextBtn        = document.getElementById('next-btn');
const questionTracker = document.getElementById('question-tracker');
const scoreTracker   = document.getElementById('score-tracker');
const progressFill   = document.getElementById('progress-fill');
const quizScreen     = document.getElementById('quiz-screen');
const resultScreen   = document.getElementById('result-screen');
const resultScore    = document.getElementById('result-score');
const resultMsg      = document.getElementById('result-msg');
const resultIcon     = document.getElementById('result-icon');
const restartBtn     = document.getElementById('restart-btn');

function loadQuestion() {
  answered = false;
  nextBtn.disabled = true;

  const q = questions[currentIndex];
  const total = questions.length;

  questionTracker.textContent = `Question ${currentIndex + 1} / ${total}`;
  scoreTracker.textContent = `Score: ${score}`;
  progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;
  questionText.textContent = q.question;

  optionsList.innerHTML = '';
  q.options.forEach((opt, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i));
    li.appendChild(btn);
    optionsList.appendChild(li);
  });
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const q = questions[currentIndex];
  const buttons = optionsList.querySelectorAll('.option-btn');

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    if (i === selectedIndex && selectedIndex !== q.answer) btn.classList.add('wrong');
  });

  if (selectedIndex === q.answer) score++;
  scoreTracker.textContent = `Score: ${score}`;
  nextBtn.disabled = false;
}

function showResult() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  const total = questions.length;
  resultScore.textContent = `${score} / ${total}`;

  if (score === total) {
    resultIcon.textContent = '🏆';
    resultMsg.textContent = 'Perfect score! You nailed it!';
  } else if (score >= total / 2) {
    resultIcon.textContent = '🎉';
    resultMsg.textContent = 'Good job! Keep practicing to get a perfect score.';
  } else {
    resultIcon.textContent = '📚';
    resultMsg.textContent = 'Keep learning — you\'ll do better next time!';
  }
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

restartBtn.addEventListener('click', () => {
  currentIndex = 0;
  score = 0;
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  loadQuestion();
});

loadQuestion();


const jokeBtn     = document.getElementById('joke-btn');
const revealBtn   = document.getElementById('reveal-btn');
const jokeSetup   = document.getElementById('joke-setup');
const jokePunchline = document.getElementById('joke-punchline');
const spinner     = document.getElementById('spinner');
const jokeContent = document.getElementById('joke-content');
const jokeError   = document.getElementById('joke-error');

async function fetchJoke() {
  jokeBtn.disabled = true;
  revealBtn.disabled = true;
  spinner.classList.remove('hidden');
  jokeContent.classList.add('hidden');
  jokeError.classList.add('hidden');
  jokePunchline.classList.add('hidden');

  try {
    const res = await fetch('https://official-joke-api.appspot.com/random_joke');
    if (!res.ok) throw new Error('API error');
    const data = await res.json();

    jokeSetup.textContent = data.setup;
    jokePunchline.textContent = data.punchline;

    spinner.classList.add('hidden');
    jokeContent.classList.remove('hidden');
    revealBtn.disabled = false;
  } catch {
    spinner.classList.add('hidden');
    jokeError.classList.remove('hidden');
  } finally {
    jokeBtn.disabled = false;
  }
}

revealBtn.addEventListener('click', () => {
  jokePunchline.classList.remove('hidden');
  revealBtn.disabled = true;
});

jokeBtn.addEventListener('click', fetchJoke);

fetchJoke();
