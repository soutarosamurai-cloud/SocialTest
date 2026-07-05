/* ==========================================
   SocialTest
   LocalStorage 管理
========================================== */

const STORAGE_KEY = "socialtest-score";

function getScoreData() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {

        return {
            total:0,
            correct:0,
            streak:0
        };

    }

    return JSON.parse(data);

}

function saveScoreData(score){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(score)
    );

}

function updateScore(correct){

    const score=getScoreData();

    score.total++;

    if(correct){

        score.correct++;

    }

    saveScoreData(score);

}

function getCorrectRate(){

    const score=getScoreData();

    if(score.total===0){

        return 0;

    }

    return Math.round(
        score.correct/score.total*100
    );

}