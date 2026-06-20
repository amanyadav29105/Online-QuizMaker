let currentUser = null;
let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
let currentQuiz = null;
let currentIndex = 0;
let score = 0;
let selectedAnswer = null;

const sections = ["auth","home","create","quizList","quizPlay","result"];

function showSection(id){
    sections.forEach(s=>document.getElementById(s).classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

// LOGIN
function login(){
    const name = document.getElementById("username").value;
    if(!name) return alert("Enter name");
    currentUser = name;
    document.getElementById("user").innerText = name;
    showSection("home");
}

// CREATE QUIZ
function showCreate(){
    showSection("create");
    if(document.getElementById("questions").children.length===0){
        addQuestion();
    }
}

function addQuestion(){
    const div=document.createElement("div");
    div.innerHTML=`
        <input placeholder="Question">
        <input placeholder="Option 1">
        <input placeholder="Option 2">
        <input placeholder="Option 3">
        <input placeholder="Option 4">
        <input placeholder="Correct (1-4)">
    `;
    document.getElementById("questions").appendChild(div);
}

function saveQuiz(){
    const title=document.getElementById("quizTitle").value;
    const qDivs=document.querySelectorAll("#questions div");

    let quiz={title,questions:[]};

    qDivs.forEach(q=>{
        let i=q.querySelectorAll("input");
        quiz.questions.push({
            q:i[0].value,
            options:[i[1].value,i[2].value,i[3].value,i[4].value],
            answer:i[5].value
        });
    });

    quizzes.push(quiz);
    localStorage.setItem("quizzes",JSON.stringify(quizzes));

    alert("Saved!");
    showSection("home");
}

// QUIZ LIST
function showQuizzes(){
    showSection("quizList");
    const list=document.getElementById("list");
    list.innerHTML="";

    quizzes.forEach((q,i)=>{
        let btn=document.createElement("button");
        btn.innerText=q.title;
        btn.onclick=()=>startQuiz(i);
        list.appendChild(btn);
    });
}

// START QUIZ
function startQuiz(i){
    currentQuiz=quizzes[i];
    currentIndex=0;
    score=0;
    showSection("quizPlay");
    loadQuestion();
}

// LOAD QUESTION
function loadQuestion(){
    let q=currentQuiz.questions[currentIndex];

    document.getElementById("progress").innerText =
        `Question ${currentIndex+1}/${currentQuiz.questions.length}`;

    document.getElementById("question").innerText=q.q;

    const options=document.getElementById("options");
    options.innerHTML="";
    selectedAnswer=null;

    q.options.forEach((opt,i)=>{
        let div=document.createElement("div");
        div.innerText=opt;

        div.onclick=()=>{
            document.querySelectorAll("#options div").forEach(d=>d.classList.remove("selected"));
            div.classList.add("selected");
            selectedAnswer=i+1;
        };

        options.appendChild(div);
    });
}

// NEXT QUESTION
function nextQuestion(){
    if(selectedAnswer==null) return alert("Select answer");

    if(selectedAnswer==currentQuiz.questions[currentIndex].answer){
        score++;
    }

    currentIndex++;

    if(currentIndex<currentQuiz.questions.length){
        loadQuestion();
    } else {
        showResult();
    }
}

// RESULT
function showResult(){
    showSection("result");
    document.getElementById("score").innerText =
        `${score} / ${currentQuiz.questions.length}`;
}

// INIT
showSection("auth");
