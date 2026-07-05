
// =====================
// 状態
// =====================
let questions = [];
let currentIndex = 0;
let score = 0;

// =====================
// DOM
// =====================
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const questionNumberEl = document.getElementById("questionNumber");
const progressTextEl = document.getElementById("progressText");
const progressBarEl = document.getElementById("progressBar");
const resultArea = document.getElementById("resultArea");
const judgeEl = document.getElementById("judge");
const explanationEl = document.getElementById("explanation");
const nextButton = document.getElementById("nextButton");

// =====================
// 初期化（完全非同期対応）
// =====================
window.addEventListener("DOMContentLoaded", async () => {

    // URLからsubject取得
    const params = new URLSearchParams(location.search);
    const subject = params.get("subject") || "history";

    try {
        questions = await loadQuestions(subject);

        startQuiz();

    } catch (e) {
        console.error(e);

        questionEl.textContent = "読み込み失敗";
    }
});

// =====================
// 開始
// =====================
function startQuiz() {
    currentIndex = 0;
    score = 0;
    showQuestion();
}

// =====================
// 表示
// =====================
function showQuestion() {

    const q = questions[currentIndex];

    questionEl.textContent = q.question;

    questionNumberEl.textContent = `第${currentIndex + 1}問`;
    progressTextEl.textContent = `${currentIndex + 1} / ${questions.length}`;

    progressBarEl.style.width =
        ((currentIndex + 1) / questions.length) * 100 + "%";

    choicesEl.innerHTML = "";
    resultArea.classList.add("hidden");
    nextButton.classList.add("hidden");

    q.choices.forEach((choice, index) => {

        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice;

        btn.onclick = () => selectAnswer(index);

        choicesEl.appendChild(btn);
    });
}

// =====================
// 回答
// =====================
function selectAnswer(index) {

    const q = questions[currentIndex];
    const buttons = document.querySelectorAll(".choice-btn");

    buttons.forEach(b => b.disabled = true);

    const correct = index === q.answer;

    if (correct) {
        score++;
        judgeEl.textContent = "⭕ 正解";
    } else {
        judgeEl.textContent = "❌ 不正解";
    }

    buttons[q.answer].style.background = "#4CAF50";
    buttons[q.answer].style.color = "#fff";

    if (!correct) {
        buttons[index].style.background = "#f44336";
        buttons[index].style.color = "#fff";
    }

    explanationEl.textContent = q.explanation || "";

    resultArea.classList.remove("hidden");
    nextButton.classList.remove("hidden");
}

// =====================
// 次へ
// =====================
nextButton.onclick = () => {

    currentIndex++;

    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
};

// =====================
// 結果
// =====================
function showResult() {

    questionEl.textContent = "終了";

    choicesEl.innerHTML = "";

    judgeEl.textContent = "結果";
    explanationEl.textContent =
        `スコア：${score} / ${questions.length}`;

    nextButton.classList.add("hidden");

    progressBarEl.style.width = "100%";
    progressTextEl.textContent =
        `${questions.length} / ${questions.length}`;
}