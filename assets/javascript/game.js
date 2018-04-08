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

var gamePause = false;

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
        $("#playerNotice").css("visibility", "visible");
        $("#resetDiv").css("visibility", "visible");
      }
      else if (playerNum == 1) {
        $("#enterRow").empty();
        $("#playerNotice").css("visibility", "visible");
        $("#resetDiv").css("visibility", "visible");
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
  $("#resetDiv").css("visibility", "hidden");
  $("#playerNotice").css("visibility", "hidden");
  $("#winNotice").css("visibility", "hidden");
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
    };
    if(snapshot.val().playerTurn === 2) {
      isPlayer1Turn = false;
      isPlayer2Turn = true;
    };
    noticeDisplay();
  };
});

function getResult() {
  var list1 = new Array();
  var list2 = new Array();
  database.ref("player/player1").once("value", function(snapshot){
    if(snapshot.val()!= null) {
      list1 = [snapshot.val().rps,snapshot.val().win,snapshot.val().tie,snapshot.val().lose,snapshot.val().name];
  };
  },function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
  database.ref("player/player2").once("value", function(snapshot){
    if(snapshot.val()!= null) {
      list2 = [snapshot.val().rps,snapshot.val().win,snapshot.val().tie,snapshot.val().lose,snapshot.val().name];
  };
  },function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
  console.log(list1, list2);
  return [list1,list2];
};

function winLoseDisplay(str1, str2) {
  $("#playerNotice").css("visibility", "hidden");
  $("#winNotice").css("visibility", "visible");
  gamePause = true;
  if (str1 ==="win") {
    $("#winNotice").text(str2 + " won!");
  } else if (str1 === "tie") {
    $("#winNotice").text("It's a Tie!")
  };
  setTimeout(function(){
    $("#winNotice").css("visibility", "hidden");
    gamePause = false;
    databaseP1.update({"rps": -1});
    databaseP2.update({"rps": -1});
    databaseTR.update({"finish": false});
    $("#playerNotice").css("visibility", "visible");
    $("#your1img").attr("src","assets/Images/9-RPS-example.png");
    $("#your2img").attr("src","assets/Images/9-RPS-example.png");
  },3000);
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
        winLoseDisplay("win",result2[4]);
      } else if (winCheck(result1[0],result2[0])[1]) {
        databaseP1.update({"tie": result1[2]+1});
        databaseP2.update({"tie": result2[2]+1 });
        winLoseDisplay("tie","");
      } else {
        databaseP2.update({"lose": result2[3]+1 });
        databaseP1.update({"win": result1[1]+1 });
        winLoseDisplay("win",result1[4]);
      };
    };
  };
});

function noticeDisplay() {
  if(isPlayer1Turn && player1) {
    $("#playerNotice").empty();
    $("#playerNotice").text("Yo! It's Your Turn")
  };
  if(isPlayer1Turn && player2) {
    $("#playerNotice").empty();
    $("#playerNotice").text("Yo! Waiting for " + player1Name.split(" ")[0] + " to choose")
  };
  if(isPlayer2Turn && player2) {
    $("#playerNotice").empty();
    $("#playerNotice").text("Yo! It's Your Turn")
  };
  if(isPlayer2Turn && player1) {
    $("#playerNotice").empty();
    $("#playerNotice").text("Yo! Waiting for " + player2Name.split(" ")[0] + " to choose")
  };
};

$(".playerBtn").click(function(event){
  event.preventDefault();
  var btnImgIndex = parseInt($(this).attr("rspVal"));

  if (!gamePause) {
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
  }

});

gameon();


