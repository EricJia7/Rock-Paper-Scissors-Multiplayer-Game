var config = {
  apiKey: "AIzaSyBkFBIyRXBe10n3BgAJXf81N4aTCwdz_68",
  authDomain: "rps-multiplayer-game-34bf6.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-game-34bf6.firebaseio.com",
  projectId: "rps-multiplayer-game-34bf6",
  storageBucket: "",
  messagingSenderId: "339239836667"
};

firebase.initializeApp(config);

var database = firebase.database();

var player1 = false;
var player2 = false;
var onlinePlayer = 0;
var currIndex = 0;
var playerNum = 0;

var player = {
  0: "player1",
  1: "player2",
}

$("#startBtn").click(function(event) {

  event.preventDefault();
  var nameInput = $("#nameinput").val().trim();
  if(!nameInput) {
    return;
  };
  $("#nameinput").val("");
  setPlayer(nameInput);
  $("#enterRow").empty();

});

function setPlayer(name) {

  database.ref().once("value") 

    .then(function(snapshot){
      playerNum = snapshot.numChildren();
      console.log("the number now is: " + playerNum);

      if (playerNum >= 2) {
        $("#alertMessagge").text("Room is full, please come back later");
        onlinePlayer = 2;
      }
  
      else if (playerNum == 0) {
        onlinePlayer = 0;
        player1 = true;
      }
  
      else if (playerNum == 1) {
        onlinePlayer = 1;
        player2 = true;
      }; 

      var newPlayer = {
        name: name,
        win: 0,
        lose: 0,
        tie: 0,
        rps:"",
      };

      database.ref().child(player[onlinePlayer]).set(newPlayer);
    }).catch(function(error) {
      console.log("There is an error")
    });
};




// var round = 0;
// var winnum = 0;
// var losenum = 0;
// var tienum = 0;

// var roundDisplay = document.getElementById("numberofround");
// var winDisplay = document.getElementById("numberofwin");
// var loseDisplay = document.getElementById("numberoflose");
// var tieDisplay = document.getElementById("numberoftie");
// var yourImgDisplay = document.getElementById("yourimg");
// var computerGuessDisplay = document.getElementById("comimg");
// var computerimgindex = null;

// var imagelist = ["assets/Images/rock.jpg","assets/Images/paper.jpg","assets/Images/scissors.jpg"];


// function winCheck(num1, num2) {
//   var checkResult = [false,false]
  
//   if ((num1 + 1) % 3 === num2) {
//     checkResult[0] = true;
//   } else if (num1 === num2) {
//     checkResult[1] = true;
//   }

//   return checkResult;
// }

// function btnfunction(clicked_id) {

//   clicked_id_num = Number(clicked_id);

//   console.log("The current image array key for Player is:", clicked_id_num);

//   yourImgDisplay.innerHTML = '<img src =" ' + imagelist[clicked_id_num] +' "  alt="your pick display" height="200" width="200"/>';
//   round ++;
//   roundDisplay.textContent = round;

//   computerimgindex = getRandomInt(3);
//   console.log("The current image array key for Computer is:", computerimgindex);
//   computerGuessDisplay.innerHTML = '<img src =" ' + imagelist[computerimgindex] +' "  alt="your pick display" height="200" width="200"/>';

//   var checkResult = winCheck(computerimgindex,clicked_id_num);

//   if (checkResult[0]) {
//     winnum++;
//     winDisplay.textContent = winnum;
//   } else if (checkResult[1]) {
//     tienum++;
//     tieDisplay.textContent = tienum;
//   } else {
//     losenum++;
//     loseDisplay.textContent = losenum;
//   }
  
// }

// function resetGame() {
//   round = 0;
//   roundDisplay.textContent = round;
//   winnum = 0;
//   winDisplay.textContent = winnum;
//   losenum = 0;
//   loseDisplay.textContent = losenum;
//   tienum = 0;
//   tieDisplay.textContent = tienum;
//   computerGuessDisplay.innerHTML = '<img src = "assets/Images/9-RPS-example.png"  height="200" width="200" alt="your pick display"/>';
//   yourImgDisplay.innerHTML = '<img src = "assets/Images/9-RPS-example.png"  height="200" width="200" alt="your pick display"/>';
// }


