document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);
});
var atoz;
var y=0;
const alphabets=['a','b','c','d','e','f','g','h','i',
'j','k','l','m','n','o','p', 'q','r',
's','t','u','v','w','x','y','z'];

const setPlayerName = (name) => localStorage.setItem('player_name', name);
const getPlayerName = () => localStorage.getItem('player_name');

const showTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);

// initial value

const start_screen = document.querySelector('#start-screen');
const game_screen = document.querySelector('#game-screen');
const pause_screen = document.querySelector('#pause-screen');
const result_screen = document.querySelector('#result-screen');
// ----------
let cells = document.querySelectorAll('.main-grid-cell');
const name_input = document.querySelector('#input-name');
const number_inputs = document.querySelectorAll('.number');
const player_name = document.querySelector('#player-name');
const game_level = document.querySelector('#game-level');
const game_time = document.querySelector('#game-time');
const result_time = document.querySelector('#result-time');

let level_index = 0;
let level = CONSTANT.LEVEL[level_index];
let timer = null;
let pause = false;
let seconds = 0;


const getGameInfo = () => JSON.parse(localStorage.getItem('game'));


//When we enter the new game button
document.querySelector('#btn-play').addEventListener('click', () => {
    if (name_input.value.trim().length > 0) {
        initGame();
        startGame();
    } else {
        name_input.classList.add('input-err');
        setTimeout(() => {
            name_input.classList.remove('input-err');
            name_input.focus();
        }, 500);
    }
});

document.querySelector('#btn-level').addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1;
    level = CONSTANT.LEVEL[level_index];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index];
});


const saveGameInfo = () => {
    let game = {
        level: level_index,
        seconds: seconds,
    }
    localStorage.setItem('game', JSON.stringify(game));
}


const newGrid = (size) => {
    let arr = new Array(size);

    for (let i = 0; i < size; i++) {
        arr[i] = new Array(size);  
    }

    for (let i = 0; i < Math.pow(size, 2); i++) {
        arr[Math.floor(i/size)][i%size] = alphabets[Math.floor(Math.random() * 26)];
    }

    return arr;
}



//start the Game
const initGame = () => {
    //Clear the Screen
    for (let i = 0; i < Math.pow(6, 2); i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
    //reset the background
    cells.forEach(e => e.classList.remove('hover'));

    // generate puzzle here
    atoz = newGrid(CONSTANT.GRID_SIZE);

    seconds = 0;

    saveGameInfo();

    // show  to div
    for (let i = 0; i < Math.pow(6, 2); i++) {
        let row = Math.floor(i / 6);
        let col = i % 6;
        
        cells[i].setAttribute('data-value', atoz[row][col]);
        cells[i].innerHTML=atoz[row][col];

    }
}



const startGame = () => {
    start_screen.classList.remove('active');
    game_screen.classList.add('active');

    player_name.innerHTML = name_input.value.trim();
    setPlayerName(name_input.value.trim());

    game_level.innerHTML = CONSTANT.LEVEL_NAME[level_index];

    showTime(seconds);

    timer = setInterval(() => {
        if (seconds<CONSTANT.LEVEL[level_index]) {
            seconds = seconds + 1;
            game_time.innerHTML = showTime(seconds);
        }
        else{
            for (let i = 0; i < Math.pow(6, 2); i++) {
                 cells[i].innerHTML = "";
                cells[i].classList.remove('filled');
                cells[i].classList.remove('selected');
                cells[i].style["background-color"] = "green";
                
        }
        clearInterval(timer);
        let j=Math.floor(Math.random()*6);
        let k=atoz[j][j]
        player_name.innerHTML=k;

    }
    }, 1000);
}

const initNumberInputEvent = () => {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if(player_name.innerHTML == e.getAttribute('data-value'))
            {
                window.alert('Congratulation');
            }
            else{
                window.alert('Sorry! Wrong attempt')
            }
            window.location.reload();
            return;
        })
    })
};
 initNumberInputEvent();

const init = () => {
    const darkmode = JSON.parse(localStorage.getItem('darkmode'));
    document.body.classList.add(darkmode ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"').setAttribute('content', darkmode ? '#1a1a2e' : '#fff');
    const game = getGameInfo();
    

    if (getPlayerName()) {
        name_input.value = getPlayerName();
    } else {
        name_input.focus();
    }
}

init();