let new_offers_interval = null;
let practice = [];
let isInProgress = false;
let isEarn1000Crons = false;
let offerListInterval = null;

const element = document.getElementById("bottom_right_note");
let isBackgroundWhite = true;

let serverIP =
    window.location.hostname.includes("staging") ?
    "https://staging.evivve.com/api"
    : "https://app.evivve.com/api";
    // "http://localhost:4000/api";

const searchParams = new URLSearchParams(window.location.search);
// const programId = searchParams.get("programId");
const code = searchParams.get("code");

// try to authenticate the learner activation player if they already exist
async function verifyLearnerActivationPlayer()
{
  console.log(code);

    const token = localStorage.getItem('LAToken');
    const playerID = localStorage.getItem("learnerActivationPlayerId");

    if(token !== "undefined" && playerID !== "undefined")
    {
      $.ajax({
        url: serverIP + "/verifyLearnerActivationPlayer",
        method: 'post',
        headers: {
          'Authorization': token,
        },
        data: {code, playerID},
        success: function(response) {
          console.log('Request successful:', response);

          if(response.message === true)
          {
            window.open("./index.html?redirect=game", "_self");
          }
        },
        error: function(xhr, status, error) {
          console.error('Request failed:', status, error);

        }});
    }
}

// Update game tasks
async function UpdateLearnerActivationPlayer(columnName)
{
  const token = localStorage.getItem('LAToken');
  const learnerActivationPlayerId = localStorage.getItem("learnerActivationPlayerId");

  await $.ajax({
    url: serverIP + "/updateLearnerActivationPlayer",
    type: 'PUT',
    headers: {
      'Authorization': token,
    },
    data: {columnName, learnerActivationPlayerId},
    success: function(response) {
      // Handle the success response
    },
    error: function(xhr, status, error) {
      // Handle any errors
    }
  });
};

// Submit player details to db
async function onClickSubmitPlayerDetails()
{
  const code = document.getElementById('single_player_code').value;
  const username = document.getElementById('nickname').value;
  const firstName = document.getElementById('first_name').value;
  const lastName = document.getElementById('last_name').value;

  if (!code || !username || !firstName || !lastName)
  {
    alert('All fields are required');
    return;
  }

  // localStorage.setItem("LearnerActivationProgramID", programId);

  // console.log("Sending single player details to db...");

  let response =  await $.post(`${serverIP}/singlePlayer`,
      {code, username, firstName, lastName});

  // console.log(response);

  localStorage.setItem("LAToken", response.token)
  localStorage.setItem("learnerActivationPlayerId", response.playerId);

  window.open("./index.html?redirect=game", "_self");
}

setInterval(() => {
  if (isBackgroundWhite) {
    document.getElementById("bottom_right_note").style.backgroundColor =
      "orange";
    document.getElementById("bottom_right_note").style.color = "white";
    document.getElementById("bottom_right_note").style.transition =
      "background-color 0.5s";
  } else {
    document.getElementById("bottom_right_note").style.backgroundColor =
      "#fffde2";
    document.getElementById("bottom_right_note").style.transition =
      "background-color 0.5s";
    document.getElementById("bottom_right_note").style.color = "black";
  }
  isBackgroundWhite = !isBackgroundWhite;
}, 800);

var OFFERS = [
  {
    harvest: "plain",
    quantity: 1,
    credits: 300,
    index: 0,
    decline: 0,
    status: "pending",
    weeks: 5,
    expiryTime: 17,
  },
  {
    harvest: "forest",
    quantity: 1,
    credits: 300,
    index: 1,
    decline: 0,
    status: "pending",
    weeks: 5,
    expiryTime: 17,
  },
  {
    harvest: "lake",
    quantity: 1,
    credits: 300,
    index: 2,
    decline: 0,
    status: "pending",
    weeks: 5,
    expiryTime: 17,
  },
  {
    harvest: "earth",
    quantity: 1,
    credits: 300,
    index: 3,
    decline: 0,
    status: "pending",
    weeks: 5,
    expiryTime: 17,
  },
  {
    harvest: "farm",
    quantity: 1,
    credits: 300,
    index: 4,
    decline: 0,
    status: "pending",
    weeks: 5,
    expiryTime: 17,
  },
];
let OFFER_ACCEPTED = [];
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function onClickAddLand() {
  if (
    practice.filter((val) => val === "onClickAddLand" || val === "buyTile")
      .length === 2
  ) {
    $("#start_screen").css("display", "block");
    document.getElementById("main_tooltip").style.display = "none";
    $("#hand").css({ display: "none" });

    return;
  } else {
    practice.push("onClickAddLand");
    document.getElementById("main_tooltip").style.display = "block";
    $("#start_screen").css("display", "block");

    $("#main_tooltip .tooltip_bottom").css({ display: "none" });

    $("#main_tooltip .right_tooltip").css({
      display: "block",
      top: "20%",
      left: "0%",
    });
    $("#hand").css({ top: "20%", left: 200, display: "none" });
    $("#main_tooltip .right_tooltip .tooltiptext").html(
      "<span>Touch any one of the orange nodes\
    <img style='width: 20px; height: 20px;position: relative;top: 4;' src='./images/pin.png' />\
      to select a cluster of lands</span>"
    );

    return;
  }
}
var handle = setInterval(function () {
  var vid = document.getElementById("myVideo");
  if (vid.ended) {
    document.getElementById("myHarvestListPopup").style.display = "block";
    document.getElementById("step_3").style.display = "block";
    document.getElementById("step_2").style.display = "none";
    document.getElementById("step_1").style.display = "none";
    clearInterval(handle);
  }
}, 1000);

function handleLetsGoBtn() {
  $(".myHarvestListPopup").hide();
  document.getElementById("step_2").style.display = "block";
}
function handleLetsGoBtn2() {
  document.getElementById("myHarvestListPopup").style.display = "none";
  document.getElementById("main").style.display = "flex";
}

function onPressSkip() {
  document.getElementById("start_screen").style.display = "none";
}
(function (window, document) {
  var that;
  localStorage.demoIpAddress = "13.127.110.40";
  window.webJS = {
    imageCount: 1,
    endCount: 0,
    folder: "Normal",
    highLightArray: [],
    bountyOfferFlag: false,
    declineFlag: false,
    daysLeftCount: 0,
    loseVideo: "methane",
    id: null,
    user_name: null,
    skillLevel: 1,
    dp: 1,
    mv: 1,
    setupData: "",
    purchasedData: [],
    tileCost: "",
    acceptedOffers: [],
    harvests: [],
    sec_days: 1,
    newOfferData: {},
    totalHarvest: [],
    deliveredData: [],
    harvestCount: 0,
    credits: 200,
    exhaustFlag: 0,
    exhaustCount: 0,
    movPrice: 3000,
    mappings: {
      lane1: {
        x: 16.4,
        y: -3.5,
        count: 7,
        xdev: 7,
      },
      lane2: {
        x: 11.4,
        y: 3.5,
        count: 8,
        xdev: 7.4,
      },
      lane3: {
        x: 5.5,
        y: 13,
        count: 8,
        xdev: 8,
      },
      lane4: {
        x: 7.5,
        y: 22.5,
        count: 8,
        xdev: 8.5,
        acc: 0.24,
      },
      lane5: {
        x: -0.8,
        y: 35,
        count: 8,
        xdev: 9,
        acc: 0.72,
      },
      lane6: {
        x: 1,
        y: 48,
        count: 8,
        xdev: 8.8,
        acc: 2,
      },
    },
    xDifference: 7,
    roomName: null,
    currentTileID: null,
    currentLane: null,
    currentPinRowId: null,
    in_game: "no",
    tileCostObject: {},
    tileCount: 0,
    tileMap: {
      plain: "sheep",
      forest: "wood",
      earth: "brick",
      farm: "grain",
      lake: "fish",
      mine: "movellinium",
    },
    offerDelivered: 0,
    goods: {
      plain: 0,
      forest: 0,
      earth: 0,
      lake: 0,
      farm: 0,
      mine: 0,
    },
    movProb: {},
    calamityLevel: {
      Level1: {
        weeks: 2,
        "dev-points": 2,
      },
      Level2: {
        weeks: 4,
        "dev-points": 4,
      },
      Level3: {
        weeks: 8,
        "dev-points": 6,
      },
    },
    calamity: {},
    onClickOk3: function () {
      $("#harvestCompleted").css("display", "none");
      $("#bottom_right_note").css("display", "block");

      $("#bottom_right_note").text("Accept an offer");

      $("#hand").css({ top: "49%", left: "14%" });

      if (new_offers_interval == null)
        new_offers_interval = setInterval(() => {
          webJS.newOffer(OFFERS[getRandomInt(0, 4)]);
        }, 3000);
    },
    scrollMiddleLeft: function () {
      var el = document?.getElementsByClassName("middle-container")[0];
      if (el.scrollLeft === 0) {
        return;
      } else {
        el.scrollLeft = 0;
        $("#leftMiddleArrow").css({
          visibility: "hidden",
        });
        $("#rightMiddleArrow").css({
          visibility: "visible",
        });
      }
    },
    scrollMiddleRight: function () {
      var el = document?.getElementsByClassName("middle-container")[0];
      if (el.scrollLeft !== 0) {
        return;
      } else {
        el.scrollLeft = el.scrollWidth;
        $("#leftMiddleArrow").css({
          visibility: "visible",
        });
        $("#rightMiddleArrow").css({
          visibility: "hidden",
        });
      }
    },
    // initializing all the events
    initialize: function () {
      console.log("Init Function");



      that = this;
      that.initiateBtn = false;
      $("#harvest_progess_ok_btn").on("click", that.onClickOk3);
      $("#leadership_lesson_btn").on("click", that.onClickLessonBtn);
      $("#leadership_lesson_btn2").on("click", that.onClickLessonBtn);
      $("#onClickLessonBack").on("click", that.onClickLessonBtn2Back);
      $("#onClickLessonBack3").on("click", that.onClickLessonBtn2Back3);

      $("#onClickLessonForward").on("click", that.onClickLessonBtn2);
      $("#onClickLessonForward2").on("click", that.onClickLessonBtn3);

      $("#play_evive").on("click", that.onClickPlayEvive);
      $("#no_btn").on("click", that.onClickNo);
      $("#yes_btn").on("click", that.onClickYes);
      $("#boost_modal_yes_btn").on("click", that.onClickBoostyes);

      $("#btn-join").on("click", that.joinGame);
      $("body").on("click", ".pin", that.placeTile);
      $("body").on("click", ".purchase", that.buyTile);
      $("body").on("click", ".closeButton", that.closePopup);
      $("body").on("click", ".section", that.setMarker);
      $("body").on("click", ".acceptOffer", that.acceptOffer);
      $("body").on("click", ".offers", that.showOffers);
      $("body").on("click", ".declineOffer", that.declineOffer);
      $("body").on("click", ".laterOffer", that.laterOffer);
      $("body").on("click", ".btn_harvest", that.harvest);
      $("body").on("click", ".deliver_button", that.deliver);
      $("body").on("click", ".menu", keyurJS.showTrading);
      $("body").on("click", ".harvest_level ", that.upgradeHarvest);
      $("body").on("click", ".eradicate ", that.eradicateCalamity);
      $("body").on("click", ".myOffer ", that.myHarvestsOffer);
      $("body").on("click", ".skip", that.skipRound);
      $("body").on("click", ".back", that.goBackToGameScreen);
      $("body").on("click", ".tile-close-game-back", that.goBackToInitialScreen);
      $("body").on("click", ".close-game-modal-button", that.goBackToInitialScreen);
      $("body").on("click", ".play", that.startPlay);
      $("body").on("click", "#skip-offer", that.newOfferClosed);
      $("body").on("click", "#leftMiddleArrow", that.scrollMiddleLeft);
      $("body").on("click", "#rightMiddleArrow", that.scrollMiddleRight);
      $("body").on("click", "#resources-iframe", that.showIframe);
      $("body").on("click", ".backfromyoutube", that.hideYoutubesvideo);
      $("body").on("click", "#go-to-trade", that.showBuyItem);
      //$("body").on("click", "#go-to-trade", that.goToTrade);
      $("body").on("click", ".thumbnail", that.openYoutube);
      $("body").on("click", ".skill_level,.development_level", that.showPopup);
      $("body").on("click", ".blocks,.bricks", that.showSellItem);
      $("body").on("click", ".blocks,.sheep", that.showSellItem);
      $("body").on("click", ".blocks,.fish", that.showSellItem);
      $("body").on("click", ".blocks,.grain", that.showSellItem);
      $("body").on("click", ".blocks,.wood", that.showSellItem);
      $("body").on("click", "#tutor-image", that.nextImage);
      $("body").on("click", ".prev", that.prevImage);
      $("body").on("click", ".next", that.nextImage);
      $("body").on("click", ".tutorial .close", that.closeTutorial);
      $("body").on("click", ".basic", that.basicTutorial);
      $("body").on("click", ".advanced", that.advancedTutorial);
      $("body").on("click", "#refresh", that.refreshPage);
      $("body").on("click", ".submitBounty", function () {
        // keyurJS.showTrading('immune');
        $(this).parents(".bountyPopup").hide();
        keyurJS.showTrading();
        setTimeout(() => {
          document.getElementById("trading-section7").click();
        }, 100);
      });
      $("body").on("click", ".submitBountyLater", function () {
        $(this).parents(".bountyPopup").hide();
      });

      // setInterval(() => {
      //   that.newOffer(OFFERS[getRandomInt(0, 4)]);
      // }, 10000)
      that.loadTileCost();
      //that.newOfferClosed();
      //that.setTile();
      //that.commenceGame();
      //that.initializeSetup();
      // that.loadKeyur();
      //that.updateDetails();
      $("#remaining_credits").html(that.credits);
      that.getOns();

      //that.playVR();
      //that.playCardboardCounter();
    },
    onClickBoostyes: () => {
      $("#boostModal").css("display", "none");

      that.credits = 200;
      $("#credits").html(that.credits);
    },
    onClickLessonBtn: () => {
      $("#harvestedMovilennium").css("display", "none");
      $("#lessonsModal").css("display", "block");
      $("#boostModal").css("display", "none");
      clearInterval(new_offers_interval);
    },
    onClickLessonBtn2Back: () => {
      $("#lessonsModal").css("display", "block");
      $("#lessonsModal2").css("display", "none");
      clearInterval(new_offers_interval);
    },
    onClickLessonBtn2Back3: () => {
      $("#lessonsModal").css("display", "none");
      $("#lessonsModal2").css("display", "block");
      $("#lessonsModal3").css("display", "none");
      clearInterval(new_offers_interval);
    },
    onClickLessonBtn2: () => {
      $("#lessonsModal").css("display", "none");
      $("#lessonsModal2").css("display", "block");
      clearInterval(new_offers_interval);
    },
    onClickLessonBtn3: () => {
      $("#lessonsModal").css("display", "none");
      $("#lessonsModal2").css("display", "none");
      $("#lessonsModal3").css("display", "block");
      clearInterval(new_offers_interval);
    },

    onClickPlayEvive: () => {
      $("#confirmModal").css("display", "block");
      $("#harvestedMovilennium").css("display", "none");
    },
    onClickYes: () => {
      $("#confirmModal").css("display", "none");
    },
    onClickNo: () => {
      $("#confirmModal").css("display", "none");
      $("#harvestedMovilennium").css("display", "block");
    },

    // when user initiate application tries to connect with the socket and displays the connection established screen
    startPlay: function () {
      if (that.initiateBtn) {
        return;
      }
      that.initiateBtn = true;
      var code = document.getElementById("st_code").value;
      var name = $("#txt_name").val().trim();
      // var code = document.getElementById("st_code").value;
      if (code == "" || name == "") {
        that.showToast("Fields cannot be empty");
        that.initiateBtn = false;
      } else {
        let serverIP =
          window.location.hostname.includes("staging")
            ? "https://staging.evivve.com"
            : "https://app.evivve.com";
        if (code.length == 4) {
          // Todo: Change Docker APP Url
          $.post(serverIP + ":3000/api/getAppInfo", {
            code: code,
          })
            .done(function (result) {
              if (result.data != "No Data") {
                localStorage.ipAddress = code;
                document.getElementById("st_code").value = code;
                var serverUrl = serverIP + ":" + result.data.in_port;

                that.getOns();
                that.initiateBtn = true;
                that.user_name = $("#txt_name").val();
                that.joinGame();
                that.showStartLoadingIcon();
              } else {
                that.showToast("Please use valid code");
                that.initiateBtn = false;
                that.showStartLoadingIcon();
              }
            }, "json")
            .fail(function (error) {
              that.showToast("Something went wrong. Please try again");
              that.initiateBtn = false;
              that.showStartLoadingIcon();
            }, "json");
        } else {
          that.showToast("An app code must be 4 Char");
          that.initiateBtn = false;
          that.showStartLoadingIcon();
        }
      }
    },
    showStartLoadingIcon: function () {
      if (that.initiateBtn) {
        document.getElementById("play-loading").style.display = "inline";
      } else {
        document.getElementById("play-loading").style.display = "none";
      }
    },
    showIframe: function () {
      $(".overlay").show();
      $(".iframe-close").click(function () {
        $("#demo_iframe").attr("src", "https://gamitar.com");
        $(".overlay").hide();
      });
    },
    // hide youtube videos
    hideYoutubesvideo: function () {
      //that.hideLoader();
      $("#youtubeVideos").hide();
      $("#options").show();
    },
    // open youtube video
    openYoutube: function () {
      var youtubeid = $(this).attr("data-youtube-id");
      window.open("https://www.youtube.com/watch?v=" + youtubeid);
    },
    // skipping the purchase round
    skipRound: function () {
      that.emitContent("skip-buying", {});
      $(".disableArea").show();
      clearInterval(that.purchaseInterval);
    },
    // listening to socket server and executing the functions accordingly
    getOns: function () {
      //offer-accepted
      keyurJS.initialize();
    },
    // central function to emit data to the server
    emitContent: function (key, object) {
      object["id"] = that?.id;
      object["name"] = that?.user_name;
    },
    // join the game after entering the tribes name
    joinGame: function () {
      var params = {
        id: that.id,
        type: "devices",
        "user-name": that.user_name,
      };
      that.emitContent("server-get-user-type", params);
      $("#btn-join").attr("disabled", true);
      that.showToast("You're in please wait while others join in");
      $(".submit_name div").hide();
      $(".submit_name")
        .css({ height: "23%" })
        .append(
          '<div id="__tribe__" class= "font-18" > Tribe Name : ' +
            '<span id="room_name">' +
            that.roomName +
            "</span>" +
            "</div>" +
            '<div style="height: 10%"></div>' +
            '<div class="font-18"> Your Sub Tribe Name :' +
            '<span id="room_name">' +
            name +
            "</span>" +
            "</div>" +
            '<div style="height: 10%"></div>' +
            '<div class="font-18"> Please wait for other sub tribes to join ' +
            "</div>"
        );
    },

    // initialize all the values of the game
    initializeSetup: function (data) {
      if (that.user_name != null) {
        that.setupData = data["setup"];
        that.credits = that.setupData["credits"];
        that.days = that.setupData["days"];
        that.movPrice = that.setupData["mov"];
        that.sec_days = that.setupData["sec_days"];
        that.exhaustFlag = that.setupData["exhaust"];
        that.exhaustCount = parseInt(that.setupData["exhaust_land"]);

        that.quarter = Math.round(that.days / 4);
        that.quarterArray = [];
        var q = that.days;
        for (var i = 0; i < 4; i++) {
          q = q - that.quarter;
          that.quarterArray.push(q);
        }

        that.users = data["users"];
        // $('#game_set_screen').hide();
        // $('#start_screen').show();
      }
    },
    // placing pins on the map dynamically
    calculateMapArea: function () {
      var html = "";
      var _i = 0;
      for (var lane in that.mappings) {
        var count = that.mappings[lane]["count"];
        var x = that.mappings[lane]["x"];
        var y = that.mappings[lane]["y"];
        var currentY = y;
        var currentX = x;
        that.xDifference = that.mappings[lane]["xdev"];
        var acc = that.mappings[lane]["acc"] || 0;
        for (var i = 0; i < count; i++) {
          html +=
            "<div data-lane='" +
            lane +
            "' data-pos='" +
            i +
            "' id='" +
            _i +
            "' class='pin' style='left:" +
            (currentX + i * acc) +
            "vw;top:" +
            currentY +
            "vh'></div>";
          currentX = currentX + that.xDifference;
          _i++;
        }
      }
      document.getElementById("pin-container").innerHTML = html;
    },
    // on tap of the pin the selected tile is displayed
    placeTile: function () {
      var x = $(this).position()["left"];
      var y = $(this).position()["top"];

      var pinHeight = $(this).height();
      var pinWidth = $(this).width();
      that.currentTileID = this.id;
      that.currentLane = $(this).attr("data-lane");
      that.currentPinRowId = $(this).attr("data-pos");
      x = x + pinHeight / 2;
      y = y + pinWidth / 2;
      $("#place-pin").remove();
      var className = "";
      className =
        that.tileCostObject[$(this).attr("data-lane")][
          $(this).attr("data-pos")
        ]["class-name"];
      var html = '<div id="place-pin" class="' + className + '"></div>';
      $(".pin-container").append(html);

      var height = $("#place-pin").height();
      var width = $("#place-pin").width();
      $("#place-pin")
        .removeClass(className)
        .addClass(className)
        .css({
          top: y - height / 2 + 4 + "px",
          left: x - width / 2 + "px",
          "z-index": 1,
        });

      $(this).css({
        "z-index": 2,
      });
      that.tileCost = "";
      that.tileCost =
        that.tileCostObject[$(this).attr("data-lane")][
          $(this).attr("data-pos")
        ];
      var total = 0;
      var htmlPopup = "";
      htmlPopup +=
        '<div style="height:320;overflow-y:scroll"><div style="height: 5%"></div>\
            <div style="width: 50%;float: left;height: 10%">LAND TYPE</div>\
            <div style="width: 50%;float: left">CRONOS</div>\
            <hr style="clear: both">\
            <div style="height: 5%"></div>';
      for (var tile in that.tileCost) {
        if (tile != "class-name" && tile != "tile_id") {
          total = total + that.tileCost[tile];
          htmlPopup +=
            '<div style="width: 50%;float: left;height: 10%">' +
            tile +
            '</div>\
            <div style="width: 50%;float: left">' +
            that.tileCost[tile] +
            '</div>\
            <div style="height: 5%;clear: both"></div>';
        }
      }
      if (!practice.find((val) => val === "buyTile")) {
        htmlPopup +=
          '<hr style="clear: both">\
            <div style="height: 5%"></div>\
            <div style="width: 50%;float: left;height: 10%;">Total</div>\
            <div style="width: 50%;float: left">' +
          total +
          '</div></div>\
            <div style="height: 3%;clear: both;position:relative;bottom:0"></div>\
            <div id="purchase_modal_tooltip">\
                            <div \
                            style="position: relative;\
                            display: inline-block;\
                            z-index: 1;\
                            margin-top: -120;\
                            margin-left: -220px;"\
                            class="tooltip_bottom">\
                                <span class="tooltiptext" style="color: black">Touch PURCHASE to buy the selected cluster of lands. Save at leat 50 cronos</span>\
                            </div>\
                        </div>\
            <div class="purchase">\
                <div class="table">\
                    <div class="cell" style="color: black">\
                        PURCHASE\
                    </div>\
                </div>\
            </div>';
      } else {
        htmlPopup +=
          '<hr style="clear: both">\
          <div style="height: 5%"></div>\
          <div style="width: 50%;float: left;height: 10%;">Total</div>\
          <div style="width: 50%;float: left">' +
          total +
          '</div></div>\
          <div style="height: 3%;clear: both;position:relative;bottom:0"></div>\
          <div class="purchase">\
              <div class="table">\
                  <div class="cell" style="color: black">\
                      PURCHASE\
                  </div>\
              </div>\
          </div>';
      }
      $(".header-menu").html(htmlPopup);
      $(".buyPopup").show();
    },

    // buying the tile
    buyTile: function (totalAmount) {

      var totalAmount = 0;
      // calculate total amount of lands that purchased
      for (var total in that.tileCost) {
        if (total != "class-name" && total != "tile_id") {
          totalAmount = totalAmount + that.tileCost[total];
        }
      }

      var difference = that.in_game == "no" ? 50 : 0;

      if (that.credits - difference >= totalAmount) {
        $("#" + that.currentTileID).remove();
        var x = $("#place-pin").position()["left"];
        var y = $("#place-pin").position()["top"];
        $("#place-pin").removeAttr("id");

        // that.emitContent("buy-tile", {
        //   tile_id: that.currentTileID,
        //   in_game: that.in_game,
        //   tile_count: that.tileCost,
        //   x: x,
        //   y: y,
        // });

        that.tileCost["tile_id"] = that.currentTileID;
        that.purchasedData.push(that.tileCost);
        $(".buyPopup").hide();
        that.appendTile(that.tileCost);
        that.credits = that.credits - parseInt(totalAmount);
        $("#remaining_credits").html(that.credits);
        $("#credits").html(that.credits);

        // clearInterval(that.purchaseInterval);
        if (!practice.find((val) => val === "buyTile")) {
          practice.push("buyTile");
          document.getElementById("main_tooltip").style.display = "block";
          $(".tooltip_bottom").css({ display: "none" });
          $("#main_tooltip .right_tooltip").css({ display: "none" });
          if (document.getElementById("purchase_modal_tooltip"))
            document.getElementById("purchase_modal_tooltip").style.display =
              "none";

          $(".tooltip_left").css({ top: 0, left: "5%", display: "block" });
          $("#hand").css({ top: "3%", left: "1%", display: "block" });
          $(".tooltip_left .tooltiptext").text(
            "When done, touch here to exit the map"
          );
          $("#bottom_right_note").css("display", "none");

          UpdateLearnerActivationPlayer("buyLand");

          console.log("BUY LAND : TRUE");
        }
      } else {
        if (that.in_game == "yes") {
          that.showToast("You don't have enough cronos");
        } else {
          that.showToast("Remember you need 50 cronos to Harvest");
        }
      }
    },
    // appending the tile in the dashboard.
    appendTile: function (tile) {
      var html = "";
      var widthCount = 0;
      document.getElementById("add-land-button").remove();
      for (var data in tile) {
        that.tileCount++;
        if (data != "class-name" && data != "tile_id") {
          widthCount++;
          html +=
            '<div  data-day="0" class="section field_container" data-harvest-total-count="0" data-exhaust-count="' +
            that.exhaustCount +
            '" data-calamity-attack="0" data-tile-pos="' +
            tile["tile_id"] +
            '" data-harvest-count="1" id="section' +
            that.tileCount +
            '" data-tile-name="' +
            data +
            '" data-tile-number="' +
            that.tileCount +
            '" data-tile-cost="' +
            tile[data] +
            '">\
            <div id="upgrade-card" style="display:none;position: absolute;left: 0px;width: 4vw;height: 5vw;top: 1vh;">\
            <span style="z-index: 2;position: relative;top: 2.7vw;left: -0.1vw;">2</span>\
<img src="..images/upgradedland.png" style="width: 5VW;height: 5vw;position: absolute;left: -0.6vw;z-index: 1;">\
</div>\
                <div style="height: 10%; width:100%" class="timeline">\
            <div class="table"><div class="cell font-11"></div></div></div>\
               <div class="progress-bar" id="progress-bar_' +
            that.tileCount +
            '">\
                   <div class="outer-loader">\
                   <div class="outer-loader-top" >\
                   </div>\
                       <div class="inner-loader" id="inner-loader' +
            that.tileCount +
            '"></div>\
                   </div>\
               </div>\
               <div class="tile-image" style="position: relative; top: -10vh;">\
                   <img id="tile_img_' +
            data +
            '" src="https://d3cyxgc836sqrt.cloudfront.net/images/website-game/' +
            data +
            '_inactive.png" style="width: 17vw; height: 25vw"/>\
               </div>\
               <div class="tile-name font-14"  >' +
            data +
            "</div>\
           </div>";
          that.harvests["section" + that.tileCount] = {};
          if (data == "mine") {
            $("#bottom_right_note").css("display", "block");
            $("#bottom_right_note").text("Harvest Mine");
            that.movProb["section" + that.tileCount] = [0, 1];
          }
        } else {
          that.tileCount--;
        }
      }
      html +=
        "<div class='tile-image' id='add-land-button' style='cursor: pointer'><img onclick='onClickAddLand()' src='https://d3cyxgc836sqrt.cloudfront.net/images/website-game/add.png' style='width: 17vw; height: 17vw;margin-top:30;text-align:left' /></div>";

      // $(".middle-container").css({
      //     "width": ($(".middle-container").width() + (that.secWidth * widthCount)) + "" + "px"
      // });
      if (tile.length >= 4) {
        $("#rightMiddleArrow").css({
          visibility: "visible",
        });
      } else {
        $("#rightMiddleArrow").css({
          visibility: "visible",
        });
      }
      $("#add-tile").remove();
      $(".middle-container").append(html);

      // $(".tile-image img, .tile-image-content").css({
      //     "width": that.pixel + "px",
      //     "height": that.pixel + "px"
      // });
      // $(" .tile-image-content").css({
      //     "top": -that.pixel + "px"
      // });

      // setTimeout(function () {
      //   $(".section")[0].click();
      //   setTimeout(function () {
      //     $(".section")[0].click();
      //   }, 200);
      // }, 200);
    },
    // loading the tile layout from the json file
    loadTileCost: function () {
      //  alert('test');
      if (typeof cordovaFetch !== "undefined") {
        cordovaFetch(
          `${window.location.protocol}://${window.location.host}/game/extras/map.json`
        )
          .then(function (response) {
            if (typeof response._bodyText == "string") {
              response = JSON.parse(response._bodyText);
            }
            that.tileCostObject = response;
            that.calculateMapArea();
          })
          .then(function (json) {})
          .catch(function (ex) {});
      } else {
        $.ajax({
          url: "extras/map.json",
        }).success(function (response) {
          if (typeof response == "string") {
            response = JSON.parse(response);
          }
          that.tileCostObject = response;
          that.calculateMapArea();
        });
      }
    },

    // close the popup
    closePopup: function () {
      $(this).parent().hide();

      if (!practice.find((val) => val === "buyTile")) {
        document.getElementById("main_tooltip").style.display = "block";
        $("#start_screen").css("display", "block");

        // $(".tooltip_bottom").css({ top: "9%", left: "26%" });
        // $("#hand").css({ top: "23%", left: "32%", display: "block" });
        // $(".tooltip_bottom .tooltiptext").text(
        //   "Touch any one of the orange nodes to select a cluster of lands"
        // );

        $(".tooltip_bottom").css({ display: "none" });

        $("#main_tooltip .right_tooltip").css({
          display: "block",
          top: "20%",
          left: "0%",
        });
        $("#hand").css({ top: "20%", left: 200, display: "block" });
        $("#main_tooltip .right_tooltip .tooltiptext").html(
          "<span>Touch any one of the orange nodes\
        <img style='width: 20px; height: 20px;position: relative;top: 4;' src='./images/pin.png' />\
          to select a cluster of lands</span>"
        );
      }
      clearInterval(keyurJS.tradeInterval);
      //$('.buyPopup').hide();
    },
    // refreshes page on admins call
    refreshPage: function () {
      setTimeout(function () {
        window.location.reload();
      }, 1500);
    },
    // starts the actual game and user is redirected to dashboard
    commenceGame: function (response) {
      that.initializeSetup(response);
      if (that.in_game == "no") {
        var params = {
          id: that.id,
          type: "devices",
          "user-name": that.user_name,
        };
        that.emitContent("server-get-user-type", params);
        that.calamityInterval = setInterval(function () {
          that.emitContent("server-is-calamity-gone", params);
        }, 1000);
        $("#game_set_screen").hide();
        $("#__tribe__").hide();
      }
      that.in_game = "yes";
      $(".back").show();
      $(".skip").hide();
      $(".timer").hide();
      $("#start_screen").hide();
      // $(".rightArrow").hide();
      $("#game_screen").show();
      that.updateDetails();

      that.createTileMaze();
      that.resetValues();
      that.skillLevelTile();
    },
    // creates the tiles of the dashboard
    createTileMaze: function () {
      debugger;
      var html = "";
      var tilesCount = 0;
      for (var data2 in that.purchasedData) {
        for (var data in that.purchasedData[data2]) {
          tilesCount++;
          if (data != "class-name" && data != "tile_id") {
            html +=
              '<div class="section" data-day="0" data-harvest-total-count="0" data-exhaust-count="' +
              that.exhaustCount +
              '" data-calamity-attack="0" data-tile-pos="' +
              that.purchasedData[data2]["tile_id"] +
              '" data-harvest-count="1" id="section' +
              tilesCount +
              '" data-tile-name="' +
              data +
              '" data-tile-number="' +
              tilesCount +
              '" data-tile-cost="' +
              that.purchasedData[data2][data] +
              '">\
            <div style="height: 10%; width:100%" class="timeline"><div class="table"><div class="cell font-11"></div></div></div>\
               <div class="progress-bar" id="progress-bar_' +
              tilesCount +
              '">\
                   <div class="outer-loader">\
                   <div class="outer-loader-top" >\
                   </div>\
                       <div class="inner-loader"  id="inner-loader' +
              tilesCount +
              '"></div>\
                   </div>\
               </div>\
               <div class="tile-image" style="position: relative">\
                   <img src="https://d3cyxgc836sqrt.cloudfront.net/images/website-game/' +
              data +
              '_inactive.png" style="width: 17vw; height: 25vw"/>\
                   <div class="tile-image-content">\
                       <div class="table">\
                           <div class="tilecell font-18">' +
              that.purchasedData[data2][data] +
              ' cr</div>\
                       </div>\
                   </div>\
               </div>\
               <div class="tile-name font-14">' +
              data +
              "</div>\
           </div>";
            that.harvests["section" + tilesCount] = {};
            if (data == "mine") {
              that.movProb["section" + tilesCount] = [0, 1];
            }
          } else {
            tilesCount--;
          }
          that.tileCount = tilesCount;
        }
      }
      html +=
        '<div style="width: 17vw;"  class="section" data-type="add" id="add-tile" data-is-busy="0">\
                <div class="tile-image" style="position: relative; top: 0%;">\
                <img src="https://d3cyxgc836sqrt.cloudfront.net/images/website-game/add.png" style="width: 14vw; height: 14vw;" />\
                </div>\
                <div class="tile-name font-14" style="font-size: 2.4vw;top: 36vh;width: 17vw;">Add</div>\
           </div>';
      $(".middle-container").html(html);

      var length = $(".middle-container .section").length;
      that.secWidth = $(".section").width();
      $(".middle-container").show();
      // $(".section").css({ "width": $(".section").width() + "px" });
      // $(".middle-container").css({ "width": ($(".section").width() * length + 20) + "px" });

      that.setTile();
    },
    // display toast message plugin
    showToast: function (msg, type) {
      try {
        new Android_Toast({ content: msg });
        // if(type == 1)
        // {
        //     window.plugins.toast.showLongBottom(msg);
        // }
        // else
        // {
        //     window.plugins.toast.showShortBottom(msg);
        // }
      } catch (e) {
        //alert(msg);
      }
    },
    // hide the loader
    hideLoader: function (msg) {
      try {
        setTimeout(function () {
          window.plugins["spinnerDialog"].hide();
        }, 1000);
      } catch (e) {}
    },
    // function to set the tile properly into the design
    setTile: function () {
      if ($(".tile-image").height() > $(".tile-image").width()) {
        that.pixel = $(".tile-image").width();
      } else {
        that.pixel = $(".tile-image").height();
      }

      // $(".tile-image img, .tile-image-content").css({
      //     "width": that.pixel + "px",
      //     "height": that.pixel + "px"
      // });
      // $(" .tile-image-content").css({
      //     "top": -that.pixel + "px"
      // });

      //setTimeout(function()
      //{
      if ($($(".section")[0]).attr("id") == "add-tile") {
        document.getElementById("harvest-button").style.display = "none";
        document.getElementById("dev-points").style.display = "none";
      } else {
        $(".section")[0].click();

        setTimeout(function () {
          $(".section")[0].click();
          setTimeout(function () {
            $(".section")[0].click();
          }, 200);
        }, 200);
      }
      //}, 200);
    },
    // when user selects the particular tile then marker is set
    // if also checks the tile type whether its mine, new tile or other tiles
    // if current tile is harvesting then harvest button is disabled
    setMarker: function () {
      $("#selectedArrow").remove();

      var type = $(this).attr("data-type");
      if (type == "add") {
        if ($(this).attr("data-is-busy") == 0) {
          $("#start_screen").show();
          $("#game_screen").hide();
          $(".disableArea").hide();
          that.emitContent("server-disable-add-button", {});
        }
      } else {
        that.currentSelectedtileName = "";
        that.currentSelectedtileCost = "";
        that.currentSelectedtileNo = "";
        that.currentSelectedWeek = "";
        that.selectedTile = "";
        that.harvestYield = "";
        that.selectedTilePos = "";

        that.currentSelectedtileCost = $(this).attr("data-tile-cost");
        that.currentSelectedtileName = $(this).attr("data-tile-name");
        that.currentSelectedtileNo = $(this).attr("data-tile-number");
        that.harvestYield = parseInt($(this).attr("data-harvest-count"));
        that.selectedTilePos = $(this).attr("data-tile-pos");
        that.selectedTile = this.id;
        that.currentSelectedtileCost =
          that.skillLevel *
          (that.currentSelectedtileCost /
            (that.currentSelectedtileName == "mine" ? 4 : 2));
        that.currentSelectedWeek = parseInt(5 - that.skillLevel + 1);
        // that.createTileMaze()

        $(this).append(
          '<div class="selectedArrow" id="selectedArrow">' +
            '<img src="https://d3cyxgc836sqrt.cloudfront.net/images/website-game/tiles_arrow.png" style="width:4vw;">' +
            "</div>"
        );
        // $(".selectedArrow, .selectedArrow img").css({
        //     "width": that.pixel / 3.57 + "px"
        // });
        // var height = $(".selectedArrow img").height();
        // $(".selectedArrow").css({
        //     //"top" : -(height / 2.64) + "px"
        //     "top": -(height / 1.45) + "px"
        // });
        var html = "";
        html +=
          '<div class="left_title" style="float:left; width: 74%;">\
                    Cost per harvest: \
                    <span class="right_title" >' +
          that.currentSelectedtileCost +
          ' cr </span>\
                    </div>\
                    <div class="clear"></div>\
                    <div class="left_title" style="float: left;width: 74%;">\
                    Time to harvest: \
                    <span class="right_title" >' +
          parseInt(5 - that.skillLevel + 1) +
          ' Week(s) </span>\
                    </div>\
                    <div class="clear"></div>\
                    <div class="left_title" style="float: left;width: 74%;">\
                    Expiration: \
                    <span class="right_title" > 3 Weeks </span>\
                    </div>\
                    <div class="clear"></div>';
        $("#footer-detail-left").html(html);
        if (
          typeof that.harvests[this.id]["cost"] != "undefined" ||
          $(this).attr("data-calamity-attack") == 1
        ) {
          document.getElementById("harvest-button").style.display = "none";
          document.getElementById("dev-points").style.display = "none";

          if ($(this).attr("data-calamity-attack") == 1) {
            document.getElementById("eradicate-calamity").style.display =
              "block";
            $(".eradicate").attr(
              "data-dev-points",
              that.calamityLevel[that.calamity["level"]]["dev-points"]
            );
            $("#era-dev-points").html(
              that.calamityLevel[that.calamity["level"]]["dev-points"]
            );
          }
        } else {
          document.getElementById("harvest-button").style.display = "block";
          document.getElementById("dev-points").style.display = "block";
          document.getElementById("eradicate-calamity").style.display = "none";
          document.getElementById("harvest-button").innerHTML =
            '<div class="table">' +
            '<div class="cell font-34">' +
            "Harvest" +
            "</div>" +
            "</div>";

          var harvestCount = $(this).attr("data-harvest-total-count");

          if (that.exhaustFlag == 1 && harvestCount >= that.exhaustCount) {
            var lastDay = $(this).attr("data-day");
            if (lastDay - that.daysLeftCount > 35) {
              $("#" + that.selectedTile).attr("data-harvest-total-count", 0);
            } else {
              document.getElementById("harvest-button").innerHTML =
                '<div class="table">' +
                '<div class="cell font-34">' +
                "Barren" +
                "</div>" +
                "</div>";
            }
          }
        }

        if (that.currentSelectedtileName == "mine") {
          document.getElementById("dev-points").style.display = "none";
          document.getElementById("eradicate-calamity").style.display = "none";
        }
      }

      if (!practice.find((val) => val === "setMarker")) {
        practice.push("setMarker");
        document.getElementById("main_tooltip").style.display = "block";
        $(".tooltip_left").css({ display: "none" });
        if (document.getElementById("purchase_modal_tooltip"))
          document.getElementById("purchase_modal_tooltip").style.display =
            "none";

        $("#harvest_botton_wrapper .tooltip_bottom").css({
          "margin-top": "-100px",
          left: "45%",
          display: "block",
        });

        $("#main_tooltip .tooltip_bottom").css({ display: "none" });

        $("#hand").css({ display: "none" });
        $("#harvest_botton_wrapper .tooltip_bottom .tooltiptext").text(
          "press Harvest Button to harvest the selected land"
        );
      }
    },
    // if some new offers come
    newOffer: function (response) {
      if (!practice.find((val) => val === "newOffer")) {
        practice.push("newOffer");
        setTimeout(() => {
          document.getElementById("tooltip_offer_left").style.display = "none";
          if (!practice.find((val) => val === "acceptOffer")) {
            $("#accept_btn_tooltip .right_tooltip").css({
              display: "block",
              top: "-70%",
              left: "-30%",
            });

            $(".tooltip_box").css({ display: "none" });
          }
        }, 10000);
      } else {
        $("#accept_btn_tooltip .right_tooltip").css({ display: "none" });
        $(".tooltip_box").css({ display: "none" });

        document.getElementById("tooltip_offer_left").style.display = "none";
        if (!practice.find((val) => val === "acceptOffer")) {
          $("#accept_btn_tooltip .right_tooltip").css({
            display: "block",
            top: "-70%",
            left: "-30%",
          });
        }
      }

      that.newOfferData = response;
      //that.newOfferData = {
      //    "weeks" : 3,
      //    "harvest" : 'plain',
      //    "quantity" : 1,
      //    "credits" : 100
      //};
      $(".offerPopup").show();
      clearInterval(new_offers_interval);
      $(".offerMsg").html(
        "<div>Here is a chance to earn more Cronos!!" +
          '<br/><div style="height: 10%"></div>Deliver <b>' +
          that.newOfferData["quantity"] +
          " " +
          that.tileMap[that.newOfferData["harvest"]] +
          "</b> in <b>" +
          that.newOfferData["weeks"] +
          " weeks</b> and Get " +
          '<br/><div style="height: 10%"></div><b>' +
          that.newOfferData["credits"] +
          " Cronos</b></div>"
      );
    },

    // when offer is closed
    newOfferClosed: function (response) {
      $(".offerPopup").hide();
      that.newOfferData = {};
      $(".pending_offer").hide();
    },
    // when offer is accepted it sends data to server and waits for acknowledgement
    acceptOffer: function () {
      if (OFFER_ACCEPTED.length) {
        OFFER_ACCEPTED = OFFER_ACCEPTED.filter(
          (val) =>
            val.currenTime > Number(new Date().getTime()) &&
            val.status !== "complete"
        );
      }

      that.newOfferData.user_id = that.id;
      that.newOfferData.status = "in progress";
      that.newOfferData.currenTime = Number(new Date().getTime()) + 30000;

      OFFER_ACCEPTED.push(that.newOfferData);
      if (!practice.find((val) => val === "acceptOffer")) {

        UpdateLearnerActivationPlayer("acceptOffer");

        console.log("ACCEPT OFFER : TRUE");

        practice.push("acceptOffer");

        $("#main_tooltip .tooltip_bottom").css({ top: "5%", left: "5%" });
        $("#hand").css({ top: "20%", left: "20%" });
        $("#main_tooltip  .view_offer_tooltip").css({
          display: "block",
          top: "5%",
          left: "5%",
        });
        $("#main_tooltip  .view_offer_tooltip .tooltiptext").text(
          "Touch here to see the offers you have accepted"
        );
        $("#bottom_right_note").text("Deliver resource to Chief");
        $("#bottom_right_note").css("display", "block");
      }
      $(".offerPopup").hide();
      $(".tooltip_box").css({ display: "none" });

      new_offers_interval = setInterval(() => {
        webJS.newOffer(OFFERS[getRandomInt(0, 4)]);
      }, 20000);
    },

    // declining the offer
    declineOffer: function () {
      $(".offerPopup").hide();
      $(".tooltip_box").css({ display: "none" });

      that.emitContent("decline-offer", that.newOfferData);
      that.newOfferData = {};
      that.declineFlag = true;
      new_offers_interval = setInterval(() => {
        webJS.newOffer(OFFERS[getRandomInt(0, 4)]);
      }, 20000);
    },
    // hide the offer popup window
    laterOffer: function (response) {
      $(".offerPopup").hide();
      $(".pending_offer").show();
    },
    // opens up all the list of offer you have accepted and yet to be deliverefd
    showOffers: function () {
      if (
        !practice.find((val) => val === "showOffers") &&
        OFFER_ACCEPTED.length
      ) {
        practice.push("showOffers");

        $(".tooltip_bottom").css({ display: "none" });
        $("#hand").css({ display: "none" });
        $(".tooltip_accepted_offer_box").css({ display: "block" });
        $("#main_tooltip  .view_offer_tooltip").css({
          display: "none",
        });
        setTimeout(() => {
          $(".tooltip_accepted_offer_box").css({ left: 750 });
          $(".tooltip_accepted_offer_box .tooltiptext").css({ width: 200 });
          setTimeout(() => {
            $(".tooltip_accepted_offer_box").css({ display: "none" });
          }, 9000);

          $(".tooltip_accepted_offer_box .tooltiptext").text(
            'The "Deliver" button will light up when you have the necessary resource(s) to deliver that offer'
          );
        }, 8000);
      }

      clearInterval(keyurJS.tradeInterval);

      $(".offerListPopup").show();
      that.handleOfferTable();
      if (offerListInterval) {
        clearInterval(offerListInterval);
        offerListInterval = null;
      }
      offerListInterval = setInterval(() => {
        that.handleOfferTable();
      }, 1000);
    },
    handleOfferTable: function (e) {
      var html = "";
      if (OFFER_ACCEPTED.length > 0) {
        for (var data in OFFER_ACCEPTED) {
          if (
            OFFER_ACCEPTED[data].status == "in progress" &&
            OFFER_ACCEPTED[data].currenTime > Number(new Date().getTime())
          ) {
            var expiryTime = OFFER_ACCEPTED[data]["expiryTime"];
            var totalExpiryTime =
              parseInt(OFFER_ACCEPTED[data]["weeks"]) * 7 * webJS.sec_days + 30;
            var days = Math.round(
              (totalExpiryTime - expiryTime) / webJS.sec_days
            );
            var weeks = days / 7;
            if (weeks > 0) {
              html +=
                '<div class="section-container">' +
                '<div class="table float-left" style="width: 20%">' +
                '<div class="cell">' +
                OFFER_ACCEPTED[data]["quantity"] +
                " " +
                that.tileMap[OFFER_ACCEPTED[data]["harvest"]] +
                '</div></div>\
                     <div class="table float-left" style="width: 20%">\
                     <div class="cell">' +
                OFFER_ACCEPTED[data]["weeks"] +
                ' Weeks</div></div>\
                     <div class="table float-left" style="width: 20%">\
                     <div class="cell">' +
                OFFER_ACCEPTED[data]["credits"] +
                ' Cronos</div></div>\
                     <div class="table float-left" style="width: 20%">\
                     <div class="cell">' +
                (weeks < 1 ? days + " Days" : Math.round(weeks) + " Weeks") +
                "</div></div>";

              if (
                that.goods[OFFER_ACCEPTED[data]["harvest"]] >=
                OFFER_ACCEPTED[data]["quantity"]
              ) {
                html +=
                  '<div class="table float-left" style="width: 20%; background-color: transparent;">\
                     <div class="cell">\
                     <input type="button" value="" class="deliver_button" data-credit="' +
                  OFFER_ACCEPTED[data]["credits"] +
                  '"  data-index="' +
                  data +
                  '" data-name="' +
                  OFFER_ACCEPTED[data]["harvest"] +
                  '">' +
                  "</div>" +
                  "</div>";
              } else {
                html +=
                  '<div class="table float-left" style="width: 20%">\
                     <div class="cell"><input disabled type="button"  value="" class="deliver_button" data-credit="' +
                  OFFER_ACCEPTED[data]["credits"] +
                  '"  data-index="' +
                  data +
                  '" data-name="' +
                  OFFER_ACCEPTED[data]["harvest"] +
                  '"></div></div>';
              }

              html += "</div>";
            }
          } else {
            OFFER_ACCEPTED = OFFER_ACCEPTED.filter(
              (val, index) => index !== data
            );
          }
        }
      } else {
        html +=
          '<div class="table float-left" style="width: 100%">\
                     <div class="cell">\
                     <h2>You have not accepted any offers</h2>\
                     </div>\
                     </div>';
      }
      $("#offerLists").html(html);
    },
    // when user have enough yields then he/she can deliver the offer via this function
    deliver: function () {
      var data_name = $(this).attr("data-name");
      var data_index = $(this).attr("data-index");
      var credit_amount = $(this).attr("data-credit");

      var check = "not delivered";

      if (
        that.goods[OFFER_ACCEPTED[data_index]["harvest"]] >=
        OFFER_ACCEPTED[data_index]["quantity"]
      ) {
        that.deliveredData.push(OFFER_ACCEPTED[data_index]);
        //$('.deliver_button').parent('.row').remove();

        that.goods[OFFER_ACCEPTED[data_index]["harvest"]] -=
          OFFER_ACCEPTED[data_index]["quantity"];
        keyurJS.goodsHUD();

        var quantity = OFFER_ACCEPTED[data_index]["quantity"];

        for (var j = 0; j < OFFER_ACCEPTED[data_index]["quantity"]; j++) {
          for (var i = 0; i < that.totalHarvest.length; i++) {
            if (
              that.totalHarvest[i]["tileName"] ==
                OFFER_ACCEPTED[data_index]["harvest"] &&
              that.totalHarvest[i]["status"] == "complete"
            ) {
              if (that.totalHarvest[i]["yield"] > 0) {
                that.totalHarvest[i]["yield"]--;
                if (that.totalHarvest[i]["yield"] == 0) {
                  that.totalHarvest[i]["status"] = "delivered";
                }
                break;
              }
            }
          }
        }

        clearInterval(OFFER_ACCEPTED[data_index]["interval"]);

        that.credits = that.credits + parseInt(credit_amount);
        that.updateDetails();
        OFFER_ACCEPTED[data_index]["status"] = "complete";
        OFFER_ACCEPTED = OFFER_ACCEPTED.filter(
          (val, index) => index !== data_index
        );
        $(this).parents(".section-container").remove();
        that.offerDelivered++;
        that.emitContent("server-deliver-offer", OFFER_ACCEPTED[data_index]);
        var deliveryCount = that.deliveredData.length;

        if (deliveryCount == 2) {
          that.skillLevel = 2;
          that.emitContent("server-skill-level-updated", {
            "skill-level": that.skillLevel,
          });
          that.showToast("Your sub-tribe has become more skilled!");
        } else if (deliveryCount == 5) {
          that.skillLevel = 3;
          that.emitContent("server-skill-level-updated", {
            "skill-level": that.skillLevel,
          });
          that.showToast("Your sub-tribe has become more skilled!");
        } else if (deliveryCount == 9) {
          that.skillLevel = 4;
          that.emitContent("server-skill-level-updated", {
            "skill-level": that.skillLevel,
          });
          that.showToast("Your sub-tribe has become more skilled!");
        } else if (deliveryCount == 14) {
          that.skillLevel = 5;
          that.emitContent("server-skill-level-updated", {
            "skill-level": that.skillLevel,
          });
          that.showToast("Your sub-tribe has become more skilled!");
        }

        if (that.offerDelivered == 3) {
          keyurJS.devPoints = keyurJS.devPoints + 2;
          //$('.chiefPopup').show();
          that.showToast(
            "Congratulations you have received gift of 1 dev points from the chief"
          );
          that.offerDelivered = 0;
        }
        that.updateDetails();
        that.skillLevelTile();
        that.showOffers();

        $("#bottom_right_note").css("display", "none");
        if (isEarn1000Crons === false)
          $("#top_right_note").css("display", "block");

        let isMine = false;
        if (that.purchasedData && that.purchasedData.length > 0) {
          that.purchasedData.forEach((val) => {
            let purchaseDataKeys = Object.keys(val);
            let hasMine = purchaseDataKeys.filter((val) => val === "mine");
            if (hasMine && hasMine.length > 0) {
              isMine = true;
            }
          });
        }

        if (that.credits > 1000 && isMine) {
          $("#bottom_right_note").css("display", "block");
          $("#bottom_right_note").text("Harvest Mine");
        }
        setTimeout(() => {
          if (that.credits < 1000 && isMine == false) {
            $("#top_right_note").css("display", "none");
            $("#bottom_right_note").css("display", "block");
            $("#bottom_right_note").text("Earn 1000 cronos");

            UpdateLearnerActivationPlayer("deliverOffer");

            console.log("DELIVER OFFER : TRUE");
          }
          isEarn1000Crons = true;
        }, 3000);
        if (that.credits > 1000 && isMine == false) {
          $("#top_right_note").css("display", "none");
          $("#bottom_right_note").text("Buy a Mine");
          $("#bottom_right_note").css("display", "block");

          UpdateLearnerActivationPlayer("cronos");

          console.log("CRONOS : TRUE");
        }
        setInterval(() => {
          if (that.credits <= 30 && isInProgress === false) {
            $("#boostModal").css("display", "block");
          }
        }, 6000);
      } else {
        that.showToast("you do not have any harvests");
      }
    },
    // updating the prices of tile on the basis of skill level
    skillLevelTile: function () {
      var cell = $(".section .tile-image .tile-image-content .cell");
      var section = $(".section");

      for (var i = 0; i < section.length; i++) {
        var cost = $(section[i]).attr("data-tile-cost");
        var tileName = $(section[i]).attr("data-tile-name");
        var tileCost = (that.skillLevel * cost) / (tileName == "mine" ? 4 : 2);
        $(cell[i]).html(tileCost + " cr");
      }
    },
    // tile harvest can be upgraded via this function
    upgradeHarvest: function () {
      if (keyurJS.devPoints >= 5) {
        that.harvestYield++;
        $("#" + that.selectedTile).attr(
          "data-harvest-count",
          that.harvestYield
        );
        $(".section")[
          $("#" + that.selectedTile).attr("data-tile-number") - 1
        ].click();
        keyurJS.devPoints = keyurJS.devPoints - 5;
        that.updateDetails();
        let selectedUpgradeEl = document.getElementById(that.selectedTile)
          .children[0];
        selectedUpgradeEl.style.display = "block";
        selectedUpgradeEl.getElementsByTagName("span")[0].innerHTML =
          "" + that.harvestYield;
        that.showToast("Land Upgraded");
      } else {
        that.showToast("You don't have enough dev points");
      }
    },
    // harvest the tile
    harvest: function (response) {
      if (!that.selectedTile) {
        return;
      }
      if (that.currentSelectedtileName === "mine") {
        $("#bottom_right_note").css("display", "block");

        $("#bottom_right_note").text("Gain 1 Movilennium");
      }
      if (
        !practice.find((val) => val === "harvest") &&
        practice.find((val) => val === "buyTile")
      ) {
        UpdateLearnerActivationPlayer("harvestLand");

        console.log("HARVESTED : TRUE")

        practice.push("harvest");
        $("#main_tooltip .tooltip_left").css({ display: "none" });
        if (document.getElementById("purchase_modal_tooltip"))
          document.getElementById("purchase_modal_tooltip").style.display =
            "none";

        $("#harvest_botton_wrapper .tooltip_bottom").css({ display: "none" });
        $(".tooltip_box").css({ top: "20%", left: "40%", display: "block" });
        $(".tooltip_box .tooltiptext").text(
          "Wait for an offer to come up on the screen"
        );

        document.getElementById("main_tooltip").style.display = "block";
        $("#main_tooltip .tooltip_bottom .tooltiptext").text(
          "You may harvest multiple lands at the same time"
        );

        $("#main_tooltip .tooltip_bottom").css({
          top: "20%",
          left: "0%",
          display: "block",
        });

        setTimeout(() => {
          $("#harvestCompleted").css("display", "block");
        }, 10000);
        $("#bottom_right_note").css("display", "none");
      } else {
      }

      var harvestCount = parseInt(
        $("#" + that.selectedTile).attr("data-harvest-total-count")
      );
      if (that.exhaustFlag == 1 && harvestCount >= that.exhaustCount) {
        if (that.credits > 0) {
          that.credits = that.credits - parseInt(that.currentSelectedtileCost);
          that.updateDetails();
        }

        that.showToast("You have exhausted your land");
        return false;
      }

      if (harvestCount == that.exhaustCount - 1) {
        var additionalWeek = parseInt(5 - that.skillLevel + 1) * 7;
        $("#" + that.selectedTile).attr(
          "data-day",
          that.daysLeftCount - additionalWeek
        );
      }

      $("#" + that.selectedTile).attr(
        "data-harvest-total-count",
        harvestCount + 1
      );
      var className = document.getElementById(
        "inner-loader" + that.currentSelectedtileNo
      ).style;
      var daysInSeconds = that.currentSelectedWeek * 7 * that.sec_days;
      if (that.credits >= that.currentSelectedtileCost) {
        that.credits = that.credits - parseInt(that.currentSelectedtileCost);
        that.updateDetails();
      } else {
        that.showToast("you do not have enough cronos");
        return false;
      }

      that.harvests[that.selectedTile] = {
        tileName: that.currentSelectedtileName,
        tileNo: that.currentSelectedtileNo,
        cost: that.currentSelectedtileCost,
        week: that.currentSelectedWeek,
        seconds: daysInSeconds,
        status: "pending",
        className: className,
        yield: that.harvestYield,
        "tile-pos": that.selectedTilePos,
        percent: 0,
        "selected-tile": that.selectedTile,
        "harvest-count": that.harvestCount,
        completeTime: 0,
      };

      that.totalHarvest[that.harvestCount] = that.harvests[that.selectedTile];
      that.harvestTimer(
        className,
        daysInSeconds,
        that.selectedTile,
        that.harvestCount
      );
      ++that.harvestCount;
      const prevSelected = document.getElementById(that.selectedTile);

      if (prevSelected.getAttribute("data-tile-name")) {
        document.getElementById(
          "tile_img_" + prevSelected.getAttribute("data-tile-name")
        ).src =
          "https://d3cyxgc836sqrt.cloudfront.net/images/website-game/" +
          prevSelected.getAttribute("data-tile-name") +
          "_active.gif";
      }
      document.getElementById("harvest-button").style.display = "none";
      document.getElementById("dev-points").style.display = "none";
    },

    // harvest timer to calculate the harvest timings
    harvestTimer: function (className, sec, selectedTile, harvestIndex) {
      var percent = that.harvests[selectedTile]["percent"];
      var minus = 100 / sec;
      var count = that.harvests[selectedTile].completeTime;
      //ORIGINAL LOGIC
      that.harvests[selectedTile].harvestInterval = setInterval(function () {
        count++;
        percent = percent + minus;
        that.harvests[selectedTile]["percent"] = percent;
        that.harvests[selectedTile].completeTime = count;
        className.width = percent + "%";

        var totalTime = that.harvests[selectedTile]["seconds"] / webJS.sec_days;
        var days = Math.round(totalTime - count / webJS.sec_days);
        var weeks = days / 7;
        var print = "";
        var cal = weeks;

        if (cal < 1) {
          print = days + " Days";
        } else {
          print = Math.floor(cal) + " Weeks";
        }
        isInProgress = true;
        $("#" + selectedTile + " .timeline .cell").html(print);

        if (percent >= 100) {
          $("#" + selectedTile + " .timeline .cell").html("");
          that.totalHarvest[harvestIndex].expiryTime = 0;
          clearInterval(that.harvests[selectedTile].harvestInterval);
          const prevSelected = document.getElementById(selectedTile);

          if (prevSelected.getAttribute("data-tile-name")) {
            document.getElementById(
              "tile_img_" + prevSelected.getAttribute("data-tile-name")
            ).src =
              "https://d3cyxgc836sqrt.cloudfront.net/images/website-game/" +
              prevSelected.getAttribute("data-tile-name") +
              "_inactive.png";
          }
          isInProgress = false;
          clearInterval(that.totalHarvest[harvestIndex].harvestInterval);

          if (that.harvests[selectedTile]["tileName"] == "mine") {
            that.harvests[selectedTile].status = "mined";
            that.totalHarvest[harvestIndex].status = "mined";

            var random = _.sample(that.movProb[selectedTile], 1);

            if (random[0] == 0) {
              keyurJS.myMov++;
              that.showToast("You mined a Movellinium!");
              that.updateDetails();
              $("#harvestedMovilennium").css("display", "block");

              UpdateLearnerActivationPlayer("mvCount");

              console.log("MV : TRUE");

            } else {
              that.showToast("Your mining did not yield Movellinium", 1);
            }

            var index = that.movProb[selectedTile].indexOf(random[0]);
            that.movProb[selectedTile].splice(index, 1);
            if (that.movProb[selectedTile].length == 0) {
              that.movProb[selectedTile] = [0, 1];
            }
          } else {
            if (!practice.find((val) => val === "harvestTimer")) {
              practice.push("harvestTimer");
              $("#main_tooltip").css({ display: "block" });

              $("#main_tooltip .tooltip_bottom").css({
                top: "63%",
                left: "2%",
                display: "block",
              });
              $("#hand").css({ display: "none" });
              $("#main_tooltip .tooltip_bottom .tooltiptext").text(
                "After being harvested resouces have limited shelf-life"
              );

              setTimeout(() => {
                $("#main_tooltip .tooltip_bottom").css({
                  top: "5%",
                  left: "50%",
                });
                $("#main_tooltip .tooltip_bottom .tooltiptext").text(
                  "Resources show up here when they are harvested"
                );
                setTimeout(() => {
                  $("#main_tooltip .tooltip_bottom").css({ display: "none" });
                }, 5000);
              }, 5000);
            }

            that.harvests[selectedTile].status = "complete";
            that.totalHarvest[harvestIndex].status = "complete";
            that.totalHarvest[harvestIndex].percent = 100;
            that.deHarvestTimer(selectedTile, harvestIndex, className);

            that.emitContent(
              "server-submit-harvest",
              that.harvests[selectedTile]
            );
          }

          that.goods[that.totalHarvest[harvestIndex]["tileName"]] +=
            that.totalHarvest[harvestIndex]["yield"];
          that.harvests[selectedTile] = {};
          that.enableButton(selectedTile);
          that.totalHarvest[harvestIndex]["className"].width = "0%";
          keyurJS.goodsHUD();
        }
      }, 1000);
    },
    // when harvest it complete this timer starts for 3 weeks till harvest is spoilt
    deHarvestTimer: function (selectedTile, harvestIndex, className) {
      try {
        var sec = 10 * 7 * that.sec_days;
        var percent = that.totalHarvest[harvestIndex].percent;
        var minus = 100 / sec;
        var count = that.totalHarvest[harvestIndex].expiryTime;
        $("#" + selectedTile + " .timeline .cell").html("");
        that.totalHarvest[harvestIndex]["interval"] = setInterval(function () {
          count++;
          percent = percent - minus;

          that.totalHarvest[harvestIndex].percent = percent;

          that.totalHarvest[harvestIndex].expiryTime = count;
          if (percent <= 0) {
            clearInterval(that.totalHarvest[harvestIndex]["interval"]);

            if (that.totalHarvest[harvestIndex].status == "spoil") {
              clearInterval(that.totalHarvest[harvestIndex]["interval"]);
            }

            if (
              that.totalHarvest[harvestIndex].status == "delivered" ||
              that.totalHarvest[harvestIndex].status == "sold"
            ) {
              //do nothing
            } else {
              if (that.totalHarvest[harvestIndex].status == "on sale") {
                var params = {
                  index: harvestIndex,
                  harvest: that.totalHarvest[harvestIndex]["tileName"],
                  "my-name": that.user_name,
                  key: "spoil",
                };
                that.emitContent("server-goods-expired", params);
              }

              that.totalHarvest[harvestIndex].status = "spoil";

              that.goods[that.totalHarvest[harvestIndex]["tileName"]] -=
                that.totalHarvest[harvestIndex]["yield"];
              keyurJS.goodsHUD();
            }
          }
        }, 1000);
      } catch (e) {}
    },
    // offer timer till it is expired
    deOfferTimer: function (week, harvestIndex) {
      var sec = week * 7 * that.sec_days + 30;
      var percent = OFFER_ACCEPTED[harvestIndex].percent;
      var minus = percent / sec;
      var count = OFFER_ACCEPTED[harvestIndex].expiryTime;
      OFFER_ACCEPTED[harvestIndex]["interval"] = setInterval(function () {
        count++;
        percent = percent - minus;

        OFFER_ACCEPTED[harvestIndex].percent = percent;
        OFFER_ACCEPTED[harvestIndex].expiryTime = count;

        if (percent <= 0) {
          if (OFFER_ACCEPTED[harvestIndex]["status"] == "complete") {
          }

          clearInterval(OFFER_ACCEPTED[harvestIndex]["interval"]);
          OFFER_ACCEPTED[harvestIndex].status = "closed";
          that.emitContent("offer-timed-out", OFFER_ACCEPTED[harvestIndex]);
        }
      }, 1000);
    },
    // enable harvest and dev points button
    enableButton: function (selectedTile) {
      if (selectedTile == that.selectedTile) {
        document.getElementById("harvest-button").style.display = "block";

        if (that.currentSelectedtileName != "mine") {
          document.getElementById("dev-points").style.display = "block";
        }
      }
    },
    // loading another html file and inserting the html data to the current file
    loadKeyur: function () {
      if (typeof cordovaFetch !== "undefined") {
        cordovaFetch(
          `${window.location.protocol}://${window.location.host}/game/keyur.html`
        )
          .then(function (response) {
            return response.text();
          })
          .then(function (body) {
            //  alert(body);
            document.getElementById("bank-trading").innerHTML = body;
          });
      } else {
        $.ajax({
          url: "keyur.html",
        }).success(function (response) {
          document.getElementById("bank-trading").innerHTML = response;
        });
      }
    },
    // updating the details like credits, skill level etc
    updateDetails: function () {
      $("#credits").html(that.credits);
      document.getElementById("credits").style.webkitTransition = "0.3s";
      document.getElementById("credits").style.webkitTransform =
        "scale(1.5,1.5)";
      setTimeout(function () {
        document.getElementById("credits").style.webkitTransform = "scale(1,1)";
      }, 200);
      $("#dp").html(keyurJS.devPoints);
      $("#skill_level").html(that.skillLevel);
      $("#mv").html(keyurJS.myMov);
      $("#remaining_credits").html(that.credits);
    },
    // this section display my harvest via the offer popup screen
    myHarvestsOffer: function () {
      $("#myHarvests").show();

      var html = "";
      for (var i = 0; i < webJS.totalHarvest.length; i++) {
        if (
          webJS.totalHarvest[i]["status"] == "complete" ||
          webJS.totalHarvest[i]["status"] == "on sale"
        ) {
          var expiryTime = webJS.totalHarvest[i]["expiryTime"];
          var totalExpiryTime = 3 * 7 * webJS.sec_days;
          var days = Math.round(
            (totalExpiryTime - expiryTime) / webJS.sec_days
          );
          var weeks = days / 7;
          var good = webJS.totalHarvest[i]["tileName"];
          html +=
            '<div class="section-container">' +
            '<div class="table float-left" style="width: 33.33%">' +
            '<div class="cell">' +
            webJS.tileMap[good] +
            "</div></div>" +
            '<div class="table float-left" style="width: 33.33%">' +
            '<div class="cell">1</div></div>' +
            '<div class="table float-left" style="width: 33.33%">' +
            '<div class="cell">' +
            (weeks < 1 ? days + " Days" : Math.round(weeks) + " Weeks") +
            "</div></div>" +
            "</div>";
        }
      }
      html += "</div>";
      document.getElementById("myHarvestdata").innerHTML = html;
    },

    // this function executes the calamity in the game. it disables the tiles if affected and also pauses the game

    // calamity counter starts after game is resumed
    calamityCounter: function () {
      try {
        that.calamityTimeOut = setTimeout(function () {
          $("[data-calamity-attack=1]")
            .attr("data-calamity-attack", "0")
            .css({ opacity: 1 });
          that.calamity = {};
        }, that.calamityLevel[that.calamity["level"]]["weeks"] *
          7 *
          that.sec_days *
          1000);
      } catch (e) {}
    },
    // eradicate calamity with dev points
    eradicateCalamity: function () {
      var devPoints = parseInt($(this).attr("data-dev-points"));
      if (keyurJS.devPoints >= 2) {
        keyurJS.devPoints -= 2;
        $("#" + that.selectedTile)
          .attr("data-calamity-attack", "0")
          .css({ opacity: 1 })
          .click();
        that.updateDetails();
        that.showToast("You have eradicated the disaster");
      } else {
        that.showToast("You don't have enough dev points");
      }
    },
    // bounty offer popup
    bountyOffer: function (data) {
      that.bountyOfferFlag = true;
      var html =
        '<div class="menu-section" id="trading-section7" data-type="get-immune">' +
        '<div class="table">' +
        '<div class="cell font-14">' +
        "Inbox Message" +
        "</div>" +
        "</div>" +
        "</div>";
      $(".left-menu").append(html);
      $(".bountyPopup").show();
    },
    // when game is over
    gameOver: function (data) {
      setTimeout(function () {
        $(".gameOverpopup").show();
      }, 2000);

      document.getElementById("start_screen").style.display = "none";
      document.getElementById("game_screen").style.display = "block";
      $("#gameOvermsg").html(
        //'<div style="height: 18%; width: 100%;" align="center">' +
        //'<div style="height: 100%; width: 60%; border: 2px solid #7B8292">' +
        //'<div class="table">' +
        //'<div class="cell">' +
        //'<h2></h2>' +
        //'</div>' +
        //'</div>' +
        //'</div>' +
        //'</div>' +
        //'<div style="height: 10%"></div>' +
        "<h3>Congratulations</h3>" + "<h2>You Evolved</h2>"
      );
      if (data["result"] == "won") {
        $("#gameOvermsg").html(
          //'<div style="height: 18%; width: 100%;" align="center">' +
          //'<div style="height: 100%; width: 60%; border: 2px solid #7B8292">' +
          //'<div class="table">' +
          //'<div class="cell">' +
          //'<h2></h2>' +
          //'</div>' +
          //'</div>' +
          //'</div>' +
          //'</div>' +
          //'<div style="height: 10%"></div>' +
          "<h3>Congratulations</h3>" + "<h2>You Evolved</h2>"
        );
      } else {
        that.playCardboardCounter(
          function () {
            $(".counterScale").hide();
          },
          "methane",
          1
        );
        $("#gameOvermsg").html(
          //'<div style="height: 18%; width: 100%;" align="center">' +
          //'<div style="height: 100%; width: 60%; border: 2px solid #7B8292">' +
          //'<div class="table">' +
          //'<div class="cell">' +
          //'<h2></h2>' +
          //'</div>' +
          //'</div>' +
          //'</div>' +
          //'</div>' +
          //'<div style="height: 10%"></div>' +
          "<h3>" + "You did not evolve</h3>"
        );
      }
      // TODO: Add condition for checking ip of demo machine
      if (localStorage.ipAddress === localStorage.demoIpAddress) {
        $("#gameOvermsg").append(
          '<button class="next-btn" id="next-btn">NEXT</button>'
        );
        $("#next-btn").click(that.openDemoReflections);
      }
    },
    // show popup
    showPopup: function () {
      var div = $(this).attr("popup-model");
      $("." + div).show();
    },

    //when user clicks on inventory
    showSellItem: function () {
      keyurJS.showTrading();
      setTimeout(() => {
        document.getElementById("trading-section3").click();
      }, 300);
    },
    goBackToInitialScreen: function(){
      $("#closeGameConfirmModal").show();
    },
    onConfirmGameClose: function() {
      window.open("https://app.evivve.com/evivve3/game/index.html?skipIntro=true", "_self")
    },
    onCancelGameClose: function() {
      $("#closeGameConfirmModal").hide();
    },

    // go back to game screen from purchase screen
    goBackToGameScreen: function () {
      $("#place-pin").remove();
      document.getElementById("start_screen").style.display = "none";
      document.getElementById("game_screen").style.display = "block";

      if (
        !practice.find((val) => val === "harvest") &&
        practice.find((val) => val === "buyTile")
      ) {
        practice.push("goBackToGameScreen");
        document.getElementById("main_tooltip").style.display = "block";
        $(".tooltip_left").css({ display: "none" });
        if (document.getElementById("purchase_modal_tooltip"))
          document.getElementById("purchase_modal_tooltip").style.display =
            "none";

        $("#main_tooltip .tooltip_bottom").css({
          top: "20%",
          left: "0%",
          display: "none",
        });
        $("#hand").css({ top: "49%", left: "14%", display: "none" });
        $("#main_tooltip .tooltip_bottom .tooltiptext").text(
          "Touch the land you wish to harvest"
        );
        $("#harvestModal").css("display", "block");
      } else {
        document.getElementById("main_tooltip").style.display = "none";
        document.getElementById("hand").style.display = "none";
      }
      that.skillLevelTile();

      that.updateDetails();
    },
    // play VR on calamities
    playVR: function (callback, videoname) {
      try {
        const bg = document.getElementsByClassName("_backdrop")[0];
        bg.style.display = "block";
        var video = document.getElementById("_calamity_video");
        var sources = video.getElementsByTagName("source");

        //AWS S3 bucket
        sources[0].src =
          "https://d3cyxgc836sqrt.cloudfront.net/videos/" +
          videoname.toLowerCase() +
          ".mp4";

        //Local for mobile
        video.removeAttribute("controls");

        $("#_calamity_video").bind("ended", function () {
          sources[0].src = "";

          bg.style.display = "none";
          callback();
        });

        //handled event beofore playing video

        video.load();
        video.play();
      } catch (e) {
        //alert('catch');
      }
    },
    // playing vr at the start of game
    playVrOnStart: function () {
      that.playVRonStart = 1;
      that.playCardboardCounter(
        function () {
          $(".counterScale").hide();
        },
        "intro",
        0,
        1
      );
    },
    // play counter before vr
    playCardboardCounter: function (callback, videoname, flag, f) {
      if (f == 1) {
        $("#counter-text-vr").html("Please put on your cardboard!");
      } else {
        $("#counter-text-vr").html("Oh no! Here comes a natural disaster!");
      }
      $(".counterScale").show();
      var card_board_number = 15;
      $("#card-board-counter").html(card_board_number);
      var card_board_interval = setInterval(function () {
        card_board_number = card_board_number - 1;
        $("#card-board-counter").html(card_board_number);
        if (card_board_number == 0) {
          clearInterval(card_board_interval);
          if (flag == 1) {
            videoname = that.loseVideo;
          }
          that.playVR(callback, videoname);
        }
      }, 1000);
    },
    // pausing the game on admins call or calamity
    pauseGame: function (flag) {
      for (var offers in OFFER_ACCEPTED) {
        if (OFFER_ACCEPTED[offers]["status"] == "in progress") {
          clearInterval(OFFER_ACCEPTED[offers]["interval"]);
        }
      }

      for (var harvest in that.totalHarvest) {
        if (that.totalHarvest[harvest]["status"] == "complete") {
          clearInterval(that.totalHarvest[harvest]["interval"]);
          clearInterval(that.totalHarvest[harvest]["harvestInterval"]);
        }
      }

      for (var harvests in that.harvests) {
        if (that.harvests[harvests]["status"] == "pending") {
          clearInterval(that.harvests[harvests]["harvestInterval"]);
          clearInterval(
            that.totalHarvest[that.harvests[harvests]["harvest-count"]][
              "harvestInterval"
            ]
          );
        }
      }
      clearInterval(that.resetInterval);
      if (flag != 1) {
        that.playCardboardCounter(function () {},
        that.calamity["calamity"].replace(" ", ""));
      } else {
        $("#pauseGameOverlay").show();
      }
    },
    // resuming the game after calamity
    resumeGame: function (data) {
      $(".counterScale").hide();
      $("#pauseGameOverlay").hide();
      for (var harvests in that.harvests) {
        if (that.harvests[harvests]["status"] == "pending") {
          // that.harvestTimer(
          //   that.harvests[harvests]["className"],
          //   that.harvests[harvests]["seconds"],
          //   that.harvests[harvests]["selected-tile"],
          //   that.harvests[harvests]["harvest-count"]
          // );
        }
      }

      for (var harvest in that.totalHarvest) {
        if (that.totalHarvest[harvest]["status"] == "complete") {
          that.deHarvestTimer(
            that.totalHarvest[harvest]["selected-tile"],
            that.totalHarvest[harvest]["harvest-count"],
            that.totalHarvest[harvest]["className"]
          );
        }
      }

      for (var offers in OFFER_ACCEPTED) {
        if (OFFER_ACCEPTED[offers]["status"] == "in progress") {
          that.deOfferTimer(
            OFFER_ACCEPTED[offers]["weeks"],
            OFFER_ACCEPTED[offers]["index"]
          );
        }
      }

      if (data["flag"] == 0) {
        that.calamityCounter();
      }
      that.resetValues();
    },
    // days left counter so that dev points can be distributed if user has not declined the offer in the game
    daysLeft: function (response) {
      var daysLeft = response["days_left"];
      that.daysLeftCount = daysLeft;
      if (that.quarterArray && that.quarterArray.indexOf(daysLeft) > -1) {
        if (that.declineFlag == false) {
          keyurJS.devPoints += 3;
          that.updateDetails();
          that.showToast(
            "Congratulations you have received gift of 3 dev points from the chief"
          );
        }
        that.declineFlag = false;
      }
    },
    // resetting the values function to keep a check on everything
    resetValues: function () {
      that.resetInterval = setInterval(function () {
        for (var i = 0; i < that.totalHarvest; i++) {
          if (
            that.totalHarvest[i]["percent"] >= 100 &&
            that.totalHarvest[i]["status"] == "pending"
          ) {
            clearInterval(that.harvests["selected-tile"]["harvestInterval"]);
            clearInterval(that.totalHarvest[i]["harvestInterval"]);
            that.totalHarvest[i]["status"] = "complete";
            that.totalHarvest[i]["percent"] = "100";
            that.totalHarvest[i]["className"].width = "0%";
            that.harvests["selected-tile"] = {};
            that.deHarvestTimer(
              that.totalHarvest[i]["selected-tile"],
              that.totalHarvest[i]["harvest-count"],
              that.totalHarvest[i]["className"]
            );
          }
        }

        for (var i = 0; i < that.totalHarvest; i++) {
          if (
            that.totalHarvest[i]["percent"] <= 1 &&
            that.totalHarvest[i]["status"] == "complete"
          ) {
            clearInterval(that.totalHarvest[i]["interval"]);
            //that.goods
            that.goods[that.totalHarvest[i]["tileName"]] -=
              that.totalHarvest[i]["yield"];
            that.goodsHUD();
            that.totalHarvest[i]["status"] = "spoil";
            that.totalHarvest[i]["percent"] = "0";
          }
        }
      }, 5000);
    },
    showBuyItem: function () {
      $(".tradeListPopup").hide();
      keyurJS.showTrading();
      setTimeout(() => {
        document.getElementById("trading-section2").click();
      }, 100);
    },

    // next image for tutorial
    nextImage: function () {
      $(".next").css({
        "text-shadow": "0px 0px 0px #007372",
        color: "#ffffff",
      });
      document.getElementById("options").style.display = "none";
      if (that.imageCount < that.endCount) {
        that.imageCount++;
        $("#tutor-image").fadeOut(300, function () {
          $("#tutor-image")
            .attr(
              "src",
              "https://d3cyxgc836sqrt.cloudfront.net/images/website-game/tut/" +
                that.folder +
                "/a (" +
                that.imageCount +
                ").jpg"
            )
            .fadeIn(300);
        });
      } else {
      }
      that.highlightNext();
    },
    // previous image for tutorial
    prevImage: function () {
      $(".next").css({
        "text-shadow": "0px 0px 0px #007372",
        color: "#ffffff",
      });
      document.getElementById("options").style.display = "none";
      if (that.imageCount > (that.folder == "Normal" ? 1 : 1)) {
        that.imageCount--;
        $("#tutor-image").fadeOut(300, function () {
          $("#tutor-image")
            .attr(
              "src",
              "https://d3cyxgc836sqrt.cloudfront.net/images/website-game/tut/" +
                that.folder +
                "/a (" +
                that.imageCount +
                ").jpg"
            )
            .fadeIn(300);
        });
      } else {
      }
      that.highlightNext();
    },
    highlightNext: function () {
      if (that.highLightArray.indexOf(that.imageCount) > -1) {
        $(".next").css({
          "text-shadow": "0px 0px 8px #007372",
          color: "#5DFEFF",
        });
      }
    },
    openDemoReflections: function () {
      window.location.href = "http://www.memcorpibg.com/demoreflections";
    },
    // close tutorial
    closeTutorial: function () {
      that.imageCount = 1;
      $("#tutorial").hide();
      document.getElementById("options").style.display = "block";
    },
    // open basic tutorial
    basicTutorial: function () {
      that.imageCount = 1;
      that.folder = "Normal";
      that.endCount = 22;
      $("#tutorial").show();
      document.getElementById("options").style.display = "none";
      $("#tutor-image")
        .attr(
          "src",
          "https://d3cyxgc836sqrt.cloudfront.net/images/website-game/tut/" +
            that.folder +
            "/a (" +
            that.imageCount +
            ").jpg"
        )
        .fadeIn(300);
      that.highLightArray = [1, 2, 4, 6, 8, 9, 10, 18, 21, 22];
      that.highlightNext();
    },
    // open advanced tutorial
    advancedTutorial: function () {
      that.imageCount = 1;
      that.folder = "Advanced";
      that.endCount = 23;
      $("#tutorial").show();
      document.getElementById("options").style.display = "none";
      $("#tutor-image")
        .attr(
          "src",
          "https://d3cyxgc836sqrt.cloudfront.net/images/website-game/tut/" +
            that.folder +
            "/a (" +
            that.imageCount +
            ").jpg"
        )
        .fadeIn(300);
      that.highLightArray = [2];
      that.highlightNext();
    },
  };

  window.onload = function () {
    keyurJS.devPoints = 0;
    webJS.initialize();
  };
})(window, document);

$("head").append(
  '<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width;" />'
);

document.ontouchmove = (event) => {
  event.preventDefault();
};
