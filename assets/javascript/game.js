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
var databaseP1 = database.ref("player").child("player1");
var databaseP2 = database.ref("player").child("player2");
var databaseT = database.ref("playerTurn");
var databaseTR = database.ref("playerTurn").child("roundFinish");

var player1 = false;
var player2 = false;
var isPlayer1Turn = false;
var isPlayer2Turn = false;
var player1Name;
var player2Name;

console.log(player1,player2,isPlayer1Turn,isPlayer2Turn);

var yourImgIdx = -1;
var oppoImgIdx = -1;

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
  database.ref("player").once("value") 
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
        databaseP2.update({turn:false});
        databaseP1.update({turn:true});
        databaseT.set({playerTurn : 1});
      }; 
      var newPlayer = {
        name: name,
        win: 0,
        lose: 0,
        tie: 0,
        rps:-1,
        turn: false,
      };
      database.ref("player").child(player[onlinePlayer]).set(newPlayer);

      $("#resetDiv").show();
    }).catch(function(error) {
      console.log("There is an error");
    });
};

function gameon() {
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
  var playerName = playersnapshot.name;

  var playerWin = playersnapshot.win;
  var playerLose = playersnapshot.lose;
  var playerTie = playersnapshot.tie;
  if(playerName) {
    var winStr = playerName.split(" ")[0] + " Wins # " + playerWin;
    var loseStr = playerName.split(" ")[0] + " Losses # " + playerLose;
    var tieStr = playerName.split(" ")[0] + " Ties # " + playerTie;
  };
  var rpsImgHeight = $("#"+str2+"rpsImgRow").innerHeight()

  var headerStr = playerName + " is now " + str1;
  if (playersnapshot.key === "player1") {
    player1Name = playerName;
  };
  if (playersnapshot.key === "player2") {
    player2Name = playerName;
  };

  $("#" + str1).text(headerStr).addClass("font-weight-bold");
  $("#"+ str1 + "WDisplay").text(winStr); 
  $("#"+ str1 + "LDisplay").text(loseStr);
  $("#"+ str1 + "TDisplay").text(tieStr);

  if(!boolean1 && boolean2) {
    $("#"+str2+"rockBtn").hide();
    $("#"+str2+"paperBtn").hide();
    $("#"+str2+"scissorBtn").hide();
    $("#"+str2+"ImgDis").css("margin-top","32px");
  };
  return playerName;
};

var buttonFunction ={};

database.ref("player/player1").on("value", function(snapshot){
  if(snapshot.val() != null) {
    var playerStr = "player1";
    var playerStrOppo = "player2";
    player1Name = gameResult(snapshot.val(), playerStr, playerStrOppo, player2, player1); 
  };
},function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

database.ref("player/player2").on("value", function(snapshot){
    if(snapshot.val()!= null) {
    var playerStr = "player2";
    var playerStrOppo = "player1"
    player2Name = gameResult(snapshot.val(), playerStr, playerStrOppo, player1, player2);
  };
},function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

databaseT.on("value",function(snapshot) {
  if(snapshot.val() != null) {
    if(snapshot.val().playerTurn === 1) {
      isPlayer1Turn = true;
      isPlayer2Turn = false;
      console.log("ry!!!!")
    };
    if(snapshot.val().playerTurn === 2) {
      isPlayer1Turn = false;
      isPlayer2Turn = true;
      console.log("ry!!!1")
    };
    noticeDisplay();
  };
  
});

function getResult() {

  var list1 = new Array();
  var list2 = new Array();
  database.ref("player/player1").once("value", function(snapshot){
    if(snapshot.val()!= null) {
      list1 = [snapshot.val().rps,snapshot.val().win,snapshot.val().tie,snapshot.val().lose];
  };
  },function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
  database.ref("player/player2").once("value", function(snapshot){
    if(snapshot.val()!= null) {
      list2 = [snapshot.val().rps,snapshot.val().win,snapshot.val().tie,snapshot.val().lose];
  };
  },function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
  console.log(list1, list2);
  return [list1,list2];
};

database.ref("playerTurn").child("roundFinish").on("value",function(snapshot) {
  if(snapshot.val() != null) {
    console.log("round finish is: " + snapshot.val().finish);
    if(snapshot.val().finish) {
      var [result1,result2] = getResult();
      console.log(result1,result2);
      $("#your1img").attr("src", imagelist[result1[0]]);
      $("#your2img").attr("src", imagelist[result2[0]]);
      if(winCheck(result1[0],result2[0])[0]){


        databaseP2.update({"win": result2[1]+1});
        databaseP1.update({"lose": result1[3]+1});
      } else if (winCheck(result1[0],result2[0])[1]) {


        databaseP1.update({"tie": result1[2]+1});
        databaseP2.update({"tie": result2[2]+1 });
      } else {

        databaseP2.update({"lose": result2[3]+1 });
        databaseP1.update({"win": result1[1]+1 });
      };
      databaseP1.update({"rps": -1});
      databaseP2.update({"rps": -1});
      databaseTR.update({"finish": false});
    };
  };
});

function noticeDisplay() {

  if(isPlayer1Turn && player1) {
    $("#playerNotice").empty();
    $("#playerNotice").append("<h3>Yo! It's Your Turn</h3>")
      .addClass("text-capitalize text-center notice-content")
  };
  if(isPlayer1Turn && player2) {
    $("#playerNotice").empty();
    $("#playerNotice").append("<h3>Yo! Waiting for " + player1Name.split(" ")[0] + " to choose</h3>")
    .addClass("text-capitalize text-center notice-content")
  };
  if(isPlayer2Turn && player2) {
    $("#playerNotice").empty();
    $("#playerNotice").append("<h3>Yo! It's Your Turn</h3>")
    .addClass("text-capitalize text-center notice-content")
  };
  if(isPlayer2Turn && player1) {
    $("#playerNotice").empty();
    $("#playerNotice").append("<h3>Yo! Waiting for " + player2Name.split(" ")[0] + " to choose</h3>")
    .addClass("text-capitalize text-center notice-content")
  };
};

$(".playerBtn").click(function(event){
  event.preventDefault();
  var btnImgIndex = parseInt($(this).attr("rspVal"));

  if (isPlayer1Turn && player1 && player1Name != null && player2Name != null) {
    yourImgIdx = btnImgIndex;
    $("#your1img").attr("src", imagelist[yourImgIdx]);;
    databaseP1.update({rps:yourImgIdx});
    databaseT.update({playerTurn:2});
  };

  if (isPlayer2Turn && player2 && player1Name != null && player2Name != null) {
    yourImgIdx = btnImgIndex;
    $("#your2img").attr("src", imagelist[yourImgIdx]);;
    databaseP2.update({rps:yourImgIdx});
    databaseTR.update({"finish": true});
    databaseT.update({playerTurn:1});
  };

});

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


