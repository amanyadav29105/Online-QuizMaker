// Data
let currentUser = null;
let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
let currentQuiz = null;

// Sections
const sections = ["auth", "home", "create", "quizList", "quizPlay", "result"];

// Show only one section
function showSection(id) {
    sections.forEach(sec => {
        document.getElementById(sec).classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}

// Login
function login() {
    const username = document.getElementById("username").value;
    if (!username) return alert("Enter username");

    currentUser = username;
    document.getElementById("user").innerText = username;

    showSection("home");
}

// Show Create Quiz
function showCreate() {
    showSection("create");

    // Add first question automatically
    if (document.getElementById("questions").children.length === 0) {
        addQuestion();
    }
}

// Show Quiz List
function showQuizzes() {
    showSection("quizList");
    renderQuizList();
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

    if (!title) return alert("Enter quiz title");
    if (questionsDiv.length === 0) return alert("Add at least one question");

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

    // Reset form instead of reload
    document.getElementById("quizTitle").value = "";
    document.getElementById("questions").innerHTML = "";

    showSection("home");
}

// Render Quiz List
function renderQuizList() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    if (quizzes.length === 0) {
        list.innerHTML = "<p>No quizzes available</p>";
        return;
    }

    quizzes.forEach((q, index) => {
        const btn = document.createElement("button");
        btn.innerText = q.title;
        btn.onclick = () => startQuiz(index);
        list.appendChild(btn);
    });
}

// Start Quiz
function startQuiz(index) {
    currentQuiz = quizzes[index];

    showSection("quizPlay");
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

    document.getElementById("score").innerText =
        `${score} / ${currentQuiz.questions.length}`;

    showSection("result");
}

// Init
showSection("auth");
