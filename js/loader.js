
async function loadQuestions(subject = "history") {
    try {
        const res = await fetch(`data/${subject}.json`);

        if (!res.ok) {
            throw new Error("Failed to load JSON");
        }

        const data = await res.json();

        // 安全チェック（壊れ防止）
        if (!Array.isArray(data)) {
            throw new Error("Invalid format");
        }

        return data;

    } catch (err) {
        console.error("Loader error:", err);

        // フォールバック（絶対クラッシュ防止）
        return [
            {
                question: "データ読み込みエラーが発生しました",
                choices: ["再読込", "設定確認", "戻る", "OK"],
                answer: 3,
                explanation: "JSONファイルまたはパスを確認してください"
            }
        ];
    }
}