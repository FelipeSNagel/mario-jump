const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const score = document.querySelector('.score');

const startBox = document.querySelector('.start-box');
const startButton = document.querySelector('.start-box button');

const screeWidth = startBox.offsetWidth;

let scoreAmount = 0;
let playing = false;
let timer = 0;

let pipePosition = -80;
let velocity = 5;


const pipeAnimation = () => {

  if(scoreAmount % 1 == 0) {
    velocity++;
  }

  if(pipePosition > screeWidth) {
    pipePosition = -80;
  }

  pipePosition+=velocity;
  pipe.style.right = pipePosition;


}

const startGame = () => {
  startBox.style.display = 'none';
  timer = 0;


  pipe.style.right = `0px`;
  pipe.style.left = `auto`;
  pipePosition = -80;
  velocity = 5;

  mario.classList.remove("jump");
  mario.classList.remove("lose");
  mario.style.bottom = "0px";

  playing = true;
}

const getRestartGame = () => {
  startBox.style.display = 'flex'; 
  startButton.innerHTML = 'restart';
}

const jump = () => {
  if(playing) {
    mario.classList.add("jump")
    
    setTimeout(() => {
      mario.classList.remove("jump")
    }, 800)
  }
}

const verifyColision = () => {
  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

  if(pipePosition > 15 && pipePosition <= 135 && marioPosition < 80) {
    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;
  
    
    mario.classList.remove("jump");
    mario.style.bottom = `${marioPosition}px`;
    mario.classList.add("lose");

    playing = false;

    getRestartGame();
  }

}

const calculateScore = () => {
  scoreAmount = timer / 100;
  score.innerHTML = `Score: ${scoreAmount}`;
}


const loop = () => {

  if(playing) {
    verifyColision();
    calculateScore();
    pipeAnimation();

    timer++;
  }

  requestAnimationFrame(loop);
}

loop();

document.addEventListener('keydown', () => {
  if(!playing) {
    startGame();
  } else {
    jump();
  }
})
startButton.addEventListener('click', startGame)