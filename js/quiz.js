
let questions = [];
let currentIndex = 0;
let score = 0;

// =============================
// 初期化
// =============================
window.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const subject = params.get("subject") || "history";
    const mode = params.get("mode") || subject;

    questions = await loadQuestions(subject);

    // 今日の10問モード対応（将来用）
    if (mode === "today") {
        questions = shuffle(questions).slice(0, 10);
    }

    currentIndex = 0;
    score = 0;

    showQuestion();
});

// =============================
// 問題表示
// =============================
function showQuestion() {

    const q = questions[currentIndex];

    if (!q) {
        showResultScreen();
        return;
    }

    document.getElementById("question").textContent = q.question;

    document.getElementById("questionNumber").textContent =
        `第${currentIndex + 1}問`;

    document.getElementById("progressText").textContent =
        `${currentIndex + 1} / ${questions.length}`;

    updateProgressBar();

    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    document.getElementById("resultArea").classList.add("hidden");
    document.getElementById("nextButton").classList.add("hidden");

    q.choices.forEach((choice, index) => {

        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice;

        btn.onclick = () => checkAnswer(index);

        choicesDiv.appendChild(btn);
    });
}

// =============================
// 回答チェック
// =============================
function checkAnswer(selected) {

    const q = questions[currentIndex];

    const isCorrect = selected === q.answer;

    const judge = document.getElementById("judge");
    const explanation = document.getElementById("explanation");

    if (isCorrect) {
        judge.textContent = "⭕ 正解！";
        score++;
    } else {
        judge.textContent = "❌ 不正解";
    }

    explanation.textContent = q.explanation || "";

    document.getElementById("resultArea").classList.remove("hidden");
    document.getElementById("nextButton").classList.remove("hidden");

    // 選択ボタンを無効化
    document.querySelectorAll(".choice-btn").forEach(btn => {
        btn.disabled = true;
    });
}

// =============================
// 次へボタン
// =============================
document.getElementById("nextButton").addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= questions.length) {
        showResultScreen();
        return;
    }

    showQuestion();
});

// =============================
// 結果画面
// =============================
function showResultScreen() {

    document.getElementById("question").textContent = "終了！";

    document.getElementById("choices").innerHTML = "";

    document.getElementById("resultArea").classList.remove("hidden");
    document.getElementById("judge").textContent = "結果";
    document.getElementById("explanation").textContent =
        `正解数：${score} / ${questions.length}`;

    document.getElementById("nextButton").textContent = "Topへ戻る";
    document.getElementById("nextButton").classList.remove("hidden");

    document.getElementById("nextButton").onclick = () => {
        window.location.href = "index.html";
    };
}

// =============================
// 進捗バー
// =============================
function updateProgressBar() {

    const bar = document.getElementById("progressBar");

    const percent = ((currentIndex + 1) / questions.length) * 100;

    bar.style.width = percent + "%";
}

// =============================
// シャッフル（今日の10問用）
// =============================
function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}