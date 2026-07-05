// =====================
// 中3社会クイズデータ
// =====================
const quizData = [
  {
    question: "日本の首都はどこか。",
    choices: ["大阪", "東京", "京都", "名古屋"],
    answer: 1
  },
  {
    question: "日本国憲法が施行された年は？",
    choices: ["1945年", "1946年", "1947年", "1950年"],
    answer: 2
  },
  {
    question: "日本で最も面積が大きい都道府県は？",
    choices: ["岩手県", "北海道", "長野県", "秋田県"],
    answer: 1
  },
  {
    question: "関東地方に含まれない都道府県はどれか。",
    choices: ["群馬県", "栃木県", "静岡県", "茨城県"],
    answer: 2
  },
  {
    question: "江戸幕府を開いた人物は誰か。",
    choices: ["織田信長", "豊臣秀吉", "徳川家康", "武田信玄"],
    answer: 2
  }
];

// =====================
// 状態管理
// =====================
let currentIndex = 0;
let score = 0;

// =====================
// 要素取得
// =====================
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");
const resultEl = document.getElementById("result");

// =====================
// 問題表示
// =====================
function showQuestion() {
  const q = quizData[currentIndex];

  questionEl.textContent = q.question;
  choicesEl.innerHTML = "";

  q.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.className = "choice-btn";

    btn.onclick = () => selectAnswer(index);

    choicesEl.appendChild(btn);
  });

  nextBtn.style.display = "none";
}

// =====================
// 回答処理
// =====================
function selectAnswer(selected) {
  const q = quizData[currentIndex];

  if (selected === q.answer) {
    score++;
  }

  // ボタン無効化
  const buttons = document.querySelectorAll(".choice-btn");
  buttons.forEach(btn => btn.disabled = true);

  nextBtn.style.display = "block";
}

// =====================
// 次へボタン
// =====================
nextBtn.onclick = () => {
  currentIndex++;

  if (currentIndex < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
};

// =====================
// 結果表示
// =====================
function showResult() {
  questionEl.textContent = "終了！";
  choicesEl.innerHTML = "";
  nextBtn.style.display = "none";

  resultEl.textContent = `スコア：${score} / ${quizData.length}`;
}

// =====================
// 初期化
// =====================
showQuestion();