let currentUser = null;
let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

// Login
function login() {
    const username = document.getElementById("username").value;
    if (!username) return alert("Enter username");

    currentUser = username;
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
    document.getElementById("user").innerText = username;
}

// Navigation
function showCreate() {
    hideAll();
    document.getElementById("create").classList.remove("hidden");
}

function showQuizzes() {
    hideAll();
    document.getElementById("quizList").classList.remove("hidden");
    renderQuizList();
}

function hideAll() {
    document.querySelectorAll("div").forEach(div => div.classList.add("hidden"));
}

// Add Question
function addQuestion() {
    const container = document.getElementById("questions");

    const div = document.createElement("div");
    div.classList.add("question-box");

    div.innerHTML = `
        <input placeholder="Question">
        <input placeholder="Option 1">
        <input placeholder="Option 2">
        <input placeholder="Option 3">
        <input placeholder="Option 4">
        <input placeholder="Correct Answer (1-4)">
    `;

    container.appendChild(div);
}

// Save Quiz
function saveQuiz() {
    const title = document.getElementById("quizTitle").value;
    const questionsDiv = document.querySelectorAll(".question-box");

    let quiz = { title, questions: [] };

    questionsDiv.forEach(q => {
        const inputs = q.querySelectorAll("input");

        quiz.questions.push({
            q: inputs[0].value,
            options: [
                inputs[1].value,
                inputs[2].value,
                inputs[3].value,
                inputs[4].value
            ],
            answer: inputs[5].value
        });
    });

    quizzes.push(quiz);
    localStorage.setItem("quizzes", JSON.stringify(quizzes));

    alert("Quiz Saved!");
    location.reload();
}

// Render Quiz List
function renderQuizList() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    quizzes.forEach((q, index) => {
        const btn = document.createElement("button");
        btn.innerText = q.title;
        btn.onclick = () => startQuiz(index);
        list.appendChild(btn);
    });
}

let currentQuiz = null;

// Start Quiz
function startQuiz(index) {
    currentQuiz = quizzes[index];
    hideAll();
    document.getElementById("quizPlay").classList.remove("hidden");
    document.getElementById("quizName").innerText = currentQuiz.title;

    const container = document.getElementById("quizContainer");
    container.innerHTML = "";

    currentQuiz.questions.forEach((q, i) => {
        let html = `<p>${q.q}</p>`;
        q.options.forEach((opt, j) => {
            html += `
            <label>
                <input type="radio" name="q${i}" value="${j+1}">
                ${opt}
            </label><br>`;
        });

        container.innerHTML += html;
    });
}

// Submit Quiz
function submitQuiz() {
    let score = 0;

    currentQuiz.questions.forEach((q, i) => {
        const ans = document.querySelector(`input[name="q${i}"]:checked`);
        if (ans && ans.value == q.answer) score++;
    });

    hideAll();
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("score").innerText =
        `${score} / ${currentQuiz.questions.length}`;
}
