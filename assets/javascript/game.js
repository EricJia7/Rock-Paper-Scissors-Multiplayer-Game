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
var player1Name;
var player2Name;
var onlinePlayer = 0;
var currIndex = 0;
var playerNum = 0;
var nameInput;

var player = {
  0: "player1",
  1: "player2",
};

var imagelist = ["assets/Images/rock.jpg","assets/Images/paper.jpg","assets/Images/scissors.jpg"];

function winCheck(num1, num2) {
  var checkResult = [false,false]
  
  if ((num1 + 1) % 3 === num2) {
    checkResult[0] = true;
  } else if (num1 === num2) {
    checkResult[1] = true;
  }
  return checkResult;
};


function setPlayer(name) {
  database.ref().once("value") 
    .then(function(snapshot){
      playerNum = snapshot.numChildren();
      console.log("the number now is: " + playerNum);
      if (playerNum >= 2) {
        $("#enterRow").empty();
        var h2 = $("<h2>").text("Room is full, please come back later").addClass("text-center text-uppercase text-danger font-weight-bold")
        var div = $("<div>");
        div.append(h2)
        $("#enterRow").append(div);
        onlinePlayer = 2;
      }
      else if (playerNum == 0) {
        $("#enterRow").empty();
        onlinePlayer = 0;
        player1 = true;
      }
      else if (playerNum == 1) {
        $("#enterRow").empty();
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

      $("#resetDiv").show();
    }).catch(function(error) {
      console.log("There is an error");
    });
};

function gameon() {
  $("#resetDiv").hide();
  $("#startBtn").click(function(event) {
    event.preventDefault();
    nameInput = $("#nameinput").val().trim();
    if(!nameInput) {
      return;
    };
    $("#nameinput").val("");
    setPlayer(nameInput);
  });
};

function gameResult(snapshot, str1, str2, boolean1, boolean2) {

  var playersnapshot = snapshot;
  var playerName = snapshot.val().name;
  var playerWin = snapshot.val().win;
  var winStr = playerName.split(" ")[0] + " Wins # " + playerWin;
  var playerLose = snapshot.val().lose;
  var loseStr = playerName.split(" ")[0] + " Losses # " + playerLose;
  var playerTie = snapshot.val().tie;
  var tieStr = playerName.split(" ")[0] + " Ties # " + playerTie;
  var rpsImgHeight = $("#"+str2+"rpsImgRow").innerHeight()
  var headerStr = playerName + " is now " + str1;
  
  $("#" + str1).text(headerStr).addClass("font-weight-bold");
  $("#"+ str1 + "WDisplay").text(winStr);
  $("#"+ str1 + "LDisplay").text(loseStr);
  $("#"+ str1 + "TDisplay").text(tieStr);

  if(!boolean1 && boolean2) {
    $("#"+str2+"rockBtn").hide();
    $("#"+str2+"paperBtn").hide();
    $("#"+str2+"scissorBtn").hide();
    $("#"+str2+"ImgDis").css("margin-top","33px");
  };
}

database.ref("player1").on("value", function(snapshot){
  var playerStr = "player1";
  var playerStrOppo = "player2";
  gameResult(snapshot, playerStr, playerStrOppo, player2, player1);
});

database.ref("player2").on("value", function(snapshot){
  var playerStr = "player2";
  var playerStrOppo = "player1"
  gameResult(snapshot, playerStr, playerStrOppo, player1, player2);
});

function noticeDisplay() {
  if(player1) {
    $("#player1Notice").val() = "It's Your Turn";
  };
  if(player2) {
    $("#player2Notice").val() = "Waiting for" + player1Name + "to choose";
  };
};

gameon();

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


