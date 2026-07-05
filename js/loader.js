
const GAS_URL = "https://script.google.com/macros/s/AKfycbw5tUc9_RHrqi3hxF3y4BaZLyiNdM-plgyFXRaGklwNRycWE663SuRl_7eS4fd98XVu/exec";

async function loadQuestions(subject = "history") {

    try {
        const res = await fetch(GAS_URL);

        if (!res.ok) {
            throw new Error("Failed to load GAS data");
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid format from GAS");
        }

        const filtered = data.filter(q => q.subject === subject);

        if (filtered.length === 0) {
            return [{
                question: "この教科の問題がありません",
                choices: ["OK", "戻る", "確認", "再読込"],
                answer: 0,
                explanation: "Sheetsに該当subjectの問題がありません"
            }];
        }

        return filtered;

    } catch (err) {
        console.error("Loader error:", err);

        return [
            {
                question: "データ読み込みエラーが発生しました",
                choices: ["再読込", "設定確認", "戻る", "OK"],
                answer: 3,
                explanation: "GAS URLまたはデプロイ設定を確認してください"
            }
        ];
    }
}