/* ==========================================
   JSON Loader
========================================== */

async function loadQuestions(subject){

    const response=await fetch(

        `data/${subject}.json`

    );

    return await response.json();

}