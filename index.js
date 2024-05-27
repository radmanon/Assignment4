let firstCard = undefined;
let secondCard = undefined;
let clickCount = 0;
let pairsMatched = 0;
let pairsLeft = 3; // Default to easy level pairs
let timer = 0;
let timerInterval;
let timerStarted = false;

const setup = () => {
    $('#difficulty').on('change', changeDifficulty);
    $('#start-button').on('click', startGame);
    $('#reset-button').on('click', resetGame);
    $('#theme').on('change', changeTheme);
    $('#power-up-button').on('click', powerUp);

    changeDifficulty();
};

const startGame = () => {
    clickCount = 0;
    pairsMatched = 0;
    pairsLeft = $('#difficulty').val() === 'easy' ? 3 : $('#difficulty').val() === 'medium' ? 6 : 12;
    $('#click-count').text(clickCount);
    $('#pairs-matched').text(pairsMatched);
    $('#pairs-left').text(pairsLeft);
    $('#timer').text(timer);

    $('#game_grid').empty();
    const difficulty = $('#difficulty').val();
    const numPairs = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 6 : difficulty === 'hard' ? 12 : 3;
    const numCards = numPairs * 2;

    // Adjust grid based on difficulty
    $('#game_grid').css({
        'width': difficulty === 'easy' ? '300px' : difficulty === 'medium' ? '400px' : '600px',
        'height': difficulty === 'easy' ? '200px' : difficulty === 'medium' ? '300px' : '400px',
        'grid-template-columns': difficulty === 'easy' ? 'repeat(3, 1fr)' : difficulty === 'medium' ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)',
        'grid-template-rows': difficulty === 'easy' ? 'repeat(2, 1fr)' : difficulty === 'medium' ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
    });

    const cardValues = [];
    for (let i = 1; i <= numPairs; i++) {
        cardValues.push(i, i);
    }

    cardValues.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numCards; i++) {
        const imgSrc = cardValues[i] < 10 ? `00${cardValues[i]}.png` : `0${cardValues[i]}.png`;
        $('#game_grid').append(`
      <div class="card">
        <img id="img${i}" class="front_face" src="${imgSrc}" alt="Pokemon ${cardValues[i]}">
        <img class="back_face" src="Persepolis.png" alt="Card back">
      </div>
    `);
    }

    $('.card').on('click', function () {
        if (!timerStarted) {
            startTimer();
            timerStarted = true;
        }

        $(this).toggleClass('flip');

        if (!firstCard) {
            firstCard = $(this).find('.front_face')[0];
        } else {
            secondCard = $(this).find('.front_face')[0];
            clickCount++;
            $('#click-count').text(clickCount);

            if (firstCard.src === secondCard.src) {
                pairsMatched++;
                pairsLeft--;
                $('#pairs-matched').text(pairsMatched);
                $('#pairs-left').text(pairsLeft);
                $(`#${firstCard.id}`).parent().off('click');
                $(`#${secondCard.id}`).parent().off('click');
                firstCard = undefined;
                secondCard = undefined;

                if (pairsLeft === 0) {
                    clearInterval(timerInterval);
                    alert('You win!');
                }
            } else {
                setTimeout(() => {
                    $(`#${firstCard.id}`).parent().toggleClass('flip');
                    $(`#${secondCard.id}`).parent().toggleClass('flip');
                    firstCard = undefined;
                    secondCard = undefined;
                }, 1000);
            }
        }
    });
};

const resetGame = () => {
    clearInterval(timerInterval);
    timer = 0;
    timerStarted = false;
    $('#timer').text(timer);
    firstCard = undefined;
    secondCard = undefined;
    startGame();
};

const changeDifficulty = () => {
    resetGame();
};

const startTimer = () => {
    timerInterval = setInterval(() => {
        timer++;
        $('#timer').text(timer);
    }, 1000);
};

const changeTheme = () => {
    const theme = $('#theme').val();
    $('body').removeClass('light dark').addClass(theme);
};

const powerUp = () => {
    $('.card').addClass('flip');
    setTimeout(() => {
        $('.card').removeClass('flip');
    }, 1000);
};

$(document).ready(setup);
