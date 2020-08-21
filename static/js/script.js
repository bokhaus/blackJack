// Black Jack Program

//BlackJack Game Object
let blackjackGame = {
    //Dictionary for the balckjack game
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score':0},
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score':0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8':8, '9': 9, //Maps each card to its value
                '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1,11]}, // Ace has potential value of either 1 or 11, use an array
    'wins': 0, // score tracking
    'losses': 0, // score tracking
    'draws': 0, // score tracking
    'isStand': false, //used for state 
    'turnOver': false, // used for state
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitSound = new Audio('static/sounds/swish.m4a'); //hit sound
const winSound = new Audio('static/sounds/cash.mp3'); //winning sound
const lossSound = new Audio('static/sounds/aww.mp3'); //loss sound


/*Selects HTML id= (i.e.,"blackjack-hit-button") and when the button is clicked, it will run 
the corresponding function*/
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);  
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);  
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);  

/* Hit function calls show card function*/
function blackjackHit() {
    if(blackjackGame['isStand'] === false) {
        let card = randomCard(); //uses randomCard() to display a random card in the div
        
        document.querySelector('#blackjack-result').textContent = 'Good Luck!!!'; // change message header
        document.querySelector('#blackjack-result').style.color = 'gold';
        
        showCard(card,YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
    if(YOU['score'] > 21){
        dealerLogic();
    }
}

// Selects a random card from the card index in blackjackGame().
function randomCard() {
    let randomIndex = Math.floor(Math.random() *13);
    return blackjackGame['cards'][randomIndex];   
}

/* This function works inside of the main function to show cards.
It uses parameters passed in to it to determine which div to use. This 
makes the code more dynamic*/
function showCard(card,activePlayer){ 
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        
        /* Uses back ticks and a variable in the image path to select a random card.
        Pay attention to barcket type*/
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    } 
}

/* this function takes the active player and uses two parameters to determine the current score of the player
It gets the score from the dictionary and then increments it based on the value in the cardMap from the dictionary */
function updateScore(card, activePlayer) {
    //Use if else statement to determine whether Ace is a 1 or 11
    /*BUST LOGIC*/
    if (card == 'A') {
        /* If the activePlayer score is < 21  and adding 11 keeps below 21 the array index [1] (11) 
        from the cardMap in dictionary */
        if (activePlayer['score'] + blackjackGame['cardMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardMap'][card][1];
        }else{
            // else add index [0] (1) in cardMap dictionary
           activePlayer['score'] += blackjackGame['cardMap'][card][0];
        }
    }else{ //just increment the score if not an ace.
    activePlayer['score'] += blackjackGame['cardMap'][card];
    }
}

//Displays score in the "your-blackjack-result" HTML span tag.
function showScore(activePlayer) {
    if(activePlayer['score'] > 21){ //Bust logic to stop showing the score
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!!!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }else{
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

/* Removes images from both divs in row one when Deal is clicked */
function blackjackDeal() {
    //showResult(computeWinner()); //- if you want to make the game two player, place this function here

    if(blackjackGame['turnOver'] === true) {

        blackjackGame['isStand'] = false; //deactivates stand button to be used
        //Query selects "your-box" and then selects all images inside 'your-box
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        
        // Use for loop when doing repetitive tasks.
        for(i=0; i< yourImages.length; i++){
            yourImages[i].remove();
        }
        for(i=0; i< dealerImages.length; i++){
            dealerImages[i].remove();
        }
        //Reset score internally
        YOU['score'] = 0;
        DEALER['score'] = 0;

        //Resets score to zero and changes color to white on the front-end HTML
        document.querySelector('#your-blackjack-result').textContent = '0';
        document.querySelector('#your-blackjack-result').style.color = '#ffffff';
        document.querySelector('#dealer-blackjack-result').textContent = '0';
        document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

        document.querySelector('#blackjack-result').textContent = 'Let\'s Play'; // change message header
        document.querySelector('#blackjack-result').style.color = 'white';

        blackjackGame['turnOver'] = true; //changes state of deal button, deactivates button.
    }
}

//pause the bot turns instead of all at once.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));

}
// asynchronus function on the (stand button).
async function dealerLogic() { // Transfers control from the person to the dealer bot to complete game
    blackjackGame['isStand'] = true; // disables stand button for user.

    while(DEALER['score'] < 16 && blackjackGame['isStand'] === true){ //creates bot for auto play dealer
        await sleep(700);
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card,DEALER);
        showScore(DEALER);
        
    }

    blackjackGame['turnOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

// Comupute winner and return who won
// update wins, losses and draws
function computeWinner() {
    let winner; //declare variable

    if(YOU['score'] <= 21) {
       // condition:  higher score than the dealer or when the dealer busts but player is under 21.
       if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
        console.log('You won');
        blackjackGame['wins']++;
        winner = YOU;

       }else if (YOU['score'] < DEALER['score']) {
        blackjackGame['losses']++;
        console.log('You lost');
        winner = DEALER;

       }else if (YOU['score'] === DEALER['score']) {
        blackjackGame['draws']++;
           console.log('You tied!');
       }
    
    // condition: when user busts but dealer doesn't
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21 ) {
        blackjackGame['losses']++;
        console.log('You Lost!');
        winner = DEALER;
    
    //condition: when user AND dealer both bust
    }else if (YOU['score'] > 21 && DEALER['score'] > 21 ) {
        blackjackGame['draws']++;
        console.log('You drew!');
    }
    //testing
    console.log('Winner is', winner);
    console.log(blackjackGame);

    //returns winner
    return winner;

}

// Display w/l/d in table
function showResult(winner) {
    let message, messageColor;

    if(blackjackGame['turnOver'] === true) {
        
        if(winner === YOU) {
            // outputs the value of wins from the object key to the table
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You WON!!!'
            messageColor = 'green';
            winSound.play();

        }else if (winner === DEALER) {
            // outputs the value of losses from the object key to the table
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You Lost!!!';
            messageColor = 'red';
            lossSound.play();

        } else {
            // outputs the value of draws from the object key to the table
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'It\'s a draw!';
            messageColor = 'yellow';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }   
}
