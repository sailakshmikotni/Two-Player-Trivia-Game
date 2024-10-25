const submit_btn=document.getElementById("submit");
const players_inf=document.getElementById("players_information");
const category_section=document.getElementById("Category");
const p2=document.getElementById("player2");
const p1=document.getElementById("player1");
const start_btn=document.getElementById("play");
const main_sec=document.getElementById("main_section");
const question_catg=document.getElementById("question_category");
const playername=document.getElementsByClassName("plyrname");
const category_options =document.getElementById("options");
const fetched_question=document.getElementsByClassName("question");
const scores =document.getElementById("score");
const p1scr=document.getElementById("p1score");
const p2scr=document.getElementById("p2score");
let quesindex=0
let turn=1;
let player1Score = 0;
let player2Score = 0;
let selectedCategories = [];
let intial_option_len=category_options.options.length;
let difficultyLevels = ["easy", "medium", "hard"];



submit_btn.addEventListener("click",function(){
    if(p1.value && p2.value){
players_inf.style.display = "none";
category_section.style.display="block";
}
else{
alert("Please enter both player names!");
}
});
start_btn.addEventListener("click", async function(){
    selectedCategories.push(category_options.value);

category_section.style.display="none";

question_catg.style.display="block";

main_sec.style.height="60vh";
main_sec.style.width="75vw";
fetched_question[0].innerHTML = `<p>Loading questions...</p>`;
playername[0].textContent = p1.value;

console.log(`${category_options.value}`);
let questions = [];


  try { 
    for (let i = 0; i < difficultyLevels.length; i++) {
      let url = `https://the-trivia-api.com/v2/questions?categories=${category_options.value}&limit=2&difficulties=${difficultyLevels[i]}`;
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
    }
      let data = await response.json();
      questions = questions.concat(data);
    }
    
    console.log(questions);

    quesindex = 0;
  displayques(questions, quesindex);
    
scores.style.display = "block"; 
      p1scr.innerHTML=`<span> ${p1.value}: ${player1Score}</span>`;
      p2scr.innerHTML=`<span> ${p2.value}: ${player2Score}</span> `;     
      
    } catch (error) {
        
        console.error("Error fetching questions:", error);
        alert("There was a problem fetching the questions. Please check your internet connection and try again.");
        
        
        category_section.style.display = "block";
        question_catg.style.display = "none";
    }

});


function displayques(questions, index) {

    if (index >= questions.length)  {
        main_sec.style.height = "55vh";
        main_sec.style.width = "40vw";
        if (selectedCategories.length === intial_option_len) {
            question_catg.style.display = "none";  
            endgame(); 
        }
        else{
        
            main_sec.style.height = "55vh";
            main_sec.style.width = "40vw";
    
    question_catg.style.display="none";
    updateCategory();
    document.getElementById("select_an").innerHTML=`<h4>Select Another Category</h4>`
     category_section.style.display="block";
     document.getElementById("end").classList.remove("endbutton")
     questions = [];
            quesindex = 0;
            fetched_question[0].innerHTML = "";
            return;
        }
    }

    const data = questions[index];
    fetched_question[0].innerHTML = ""; 
   
    const answers = [data.correctAnswer, ...data.incorrectAnswers];
    
   
    const randomIndex = Math.floor(Math.random() * 4); 
    
    [answers[0], answers[randomIndex]] = [answers[randomIndex], answers[0]];

    const queDiv = document.createElement("div");
    queDiv.innerHTML = 
        `<p>${data.question.text}</p>
        <button class="answer-btn">${answers[0]}</button>
        <button class="answer-btn">${answers[1]}</button>
        <button class="answer-btn">${answers[2]}</button>
        <button class="answer-btn">${answers[3]}</button>`
    ;

    fetched_question[0].appendChild(queDiv);

    document.querySelectorAll('.answer-btn').forEach(ans_btn => {
        ans_btn.addEventListener('click', e => {
            const selectedAnswer = e.target.textContent;
            answer_verification(selectedAnswer, data.correctAnswer, questions); 
        });
    });
}

function answer_verification(selected_answer,correctAnswer,questions){
   
    if(correctAnswer === selected_answer){
        if (turn===1){
         
            player_scores('p1',quesindex)
            
        }
        else{
            player_scores('p2',quesindex)
        }
    }
    if (turn===1){
        turn=2
        playername[0].textContent=p2.value
    }
    else{
        turn=1
        playername[0].textContent=p1.value
    }
    quesindex=quesindex+1;
    displayques(questions,quesindex)

}
function player_scores(p,ques_index){
    let points
if(ques_index<2){
    points=10
}
else if (ques_index<4) {
    points=15
  } else {
   points=20
  }
  if (p==='p1'){
    player1Score+=points;
    p1scr.innerHTML = `<span> ${p1.value}: ${player1Score}</span>`;
  }
  else{
    player2Score+=points;
    p2scr.innerHTML = `<span> ${p2.value}: ${player2Score}</span>`;
  }
}

function updateCategory() {
    for (let i = category_options.options.length - 1; i >= 0; i--) {
      const option = category_options.options[i];
      if (selectedCategories.includes(option.value)) {
        category_options.remove(i); 
      }
    }
    if(selectedCategories.length===intial_option_len){
        endgame()
    }
  }
  document.getElementById("end").addEventListener("click", function(){
  endgame()
})
function endgame(){
    document.getElementById('players_scores').innerHTML=`<h3>Final Scores</h3>`
    category_section.style.display = "none"; 
    question_catg.style.display = "none";
    document.getElementById("gameover").style.display="block"
if(player1Score>player2Score){
    document.getElementById("winner").innerHTML=`<h5 class="winner_name">${p1.value} wins!</h5>   `
    document.getElementById("winner").classList.remove("win")
    
}
else if(player1Score<player2Score){
    document.getElementById("winner").innerHTML=`<h5 class="winner_name">${p2.value} wins!</h5>   `
    document.getElementById("winner").classList.remove("win")
}
else{
    document.getElementById("winner").innerHTML=`<h5 class="winner_name">It's a Draw</h5>   `
    document.getElementById("winner").classList.remove("win")
}
document.getElementById("playagain").style.display="inline";
}
document.getElementById("playagain").addEventListener("click", function(){
    location.reload(); 
});













