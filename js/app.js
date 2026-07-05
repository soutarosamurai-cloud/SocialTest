/* ==========================================
   Home画面
========================================== */

window.onload=function(){

    const score=getScoreData();

    document.getElementById("studyDays").textContent=score.streak;

    document.getElementById("totalAnswer").textContent=score.total;

    document.getElementById("correctRate").textContent=getCorrectRate()+"%";

}