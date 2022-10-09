const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const score = document.querySelector('.score');

const startBox = document.querySelector('.start-box');
const startButton = document.querySelector('.start-box button');

const boxAnalytics = document.querySelector('.data .analytics');

const screeWidth = startBox.offsetWidth;

let scoreAmount = 0;
let playing = false;
let timer = 0;

let pipePosition = -80;
let velocity = 5;
let isJumping = 0;

let analytics = [];


const pipeAnimation = () => {

  if(timer % 100 == 0) {
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
    isJumping = 1;

    mario.classList.add("jump")
    
    setTimeout(() => {
      mario.classList.remove("jump")

      isJumping = 0;
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

    boxAnalytics.innerHTML = JSON.stringify(analytics);
    makeChart();

    getRestartGame();
  }

}

const calculateScore = () => {
  scoreAmount = timer / 100;
  score.innerHTML = `Score: ${scoreAmount}`;
}

const setAnalytics = () => {
  if(timer % 10 == 0) {
    analytics.push({
      isJumping,
      pipePosition,
      velocity
    })
  }
}

const makeChart = () => {
  const labels = [
    'velocity',
    'pipePosition',
    'isJumping',
  ];

  const data = {
    labels: labels,
    datasets: [{
      label: 'velocity',
      backgroundColor: '#551B14',
      borderColor: '#551B14',
      data: analytics.map(({ velocity }) => velocity),
    },
    {
      label: 'pipePosition',
      backgroundColor: '#568259',
      borderColor: '568259',
      data: analytics.map(({ pipePosition }) => pipePosition),
    },
    {
      label: 'isJumping',
      backgroundColor: '#E03F00',
      borderColor: '#E03F00',
      data: analytics.map(({ isJumping }) => isJumping),
    }
  ]
  };

  const config = {
    type: 'line',
    data: data,
    options: {}
  };

  const myChart = new Chart(
    document.getElementById('chart-analytics'),
    config
  );
}

const loop = () => {

  if(playing) {
    verifyColision();
    calculateScore();
    pipeAnimation();
    setAnalytics();

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