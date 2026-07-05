
let questions = [];
let currentIndex = 0;
let score = 0;

// =============================
// ログ取得
// =============================
function getLog() {
    return JSON.parse(localStorage.getItem("quizLog") || "{}");
}

// =============================
// 弱点抽出
// =============================
function getWeakQuestions(allQuestions) {

    const log = getLog();

    return allQuestions.filter(q => {

        const l = log[q.id];

        if (!l) return false; // 未学習は除外（必要ならtrueに変更可）

        const total = l.correct + l.wrong;

        const accuracy = total === 0 ? 0 : l.correct / total;

        return (
            l.wrong >= 2 ||
            accuracy < 0.5
        );
    });
}

// =============================
// 初期化
// =============================
window.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const subject = params.get("subject") || "history";
    const mode = params.get("mode") || subject;

    let history = [];
    let geography = [];
    let civics = [];

    history = await loadQuestions("history");
    geography = await loadQuestions("geography");
    civics = await loadQuestions("civics");

    const all = [...history, ...geography, ...civics];

    // -----------------------------
    // モード分岐
    // -----------------------------
    if (mode === "today") {

        questions = shuffle(all).slice(0, 10);

    } else if (mode === "weak") {

        questions = getWeakQuestions(all);

        // 弱点がない場合
        if (questions.length === 0) {
            questions = [{
                id: "none",
                question: "弱点問題はありません！",
                choices: ["OK", "戻る", "復習", "終了"],
                answer: 0,
                explanation: "全体的に安定しています"
            }];
        }

    } else {

        questions = await loadQuestions(subject);
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
// 回答チェック（ログ付き）
// =============================
function checkAnswer(selected) {

    const q = questions[currentIndex];

    const isCorrect = selected === q.answer;

    const log = getLog();

    if (!log[q.id]) {
        log[q.id] = { correct: 0, wrong: 0 };
    }

    if (isCorrect) {
        log[q.id].correct++;
        score++;
    } else {
        log[q.id].wrong++;
    }

    localStorage.setItem("quizLog", JSON.stringify(log));

    document.getElementById("judge").textContent =
        isCorrect ? "⭕ 正解！" : "❌ 不正解";

    document.getElementById("explanation").textContent =
        q.explanation || "";

    document.getElementById("resultArea").classList.remove("hidden");
    document.getElementById("nextButton").classList.remove("hidden");

    document.querySelectorAll(".choice-btn").forEach(btn => {
        btn.disabled = true;
    });
}

// =============================
// 次へ
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

    const btn = document.getElementById("nextButton");
    btn.textContent = "Topへ戻る";
    btn.classList.remove("hidden");

    btn.onclick = () => {
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
// シャッフル
// =============================
function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}