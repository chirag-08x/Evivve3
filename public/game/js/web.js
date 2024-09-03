(function (window, document) {
  var that;
  localStorage.demoIpAddress = "13.127.110.40";

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  const mode = searchParams.get("mode");

  window.webJS = {
    redirectToSession : function()
    {
      console.log(mode);
      if(mode === "singlePlayer")
      {
        console.log("REDIRECTING TO SINGLE PLAYER");
        // window.location.href = `../../evivve3/app-sim-play/single-player-login.html?mode=${mode}&code=${code}`;
        window.open("../../evivve3/app-sim-play/index.html?redirect=game", "_self");
      }
      else if(mode.toLowerCase() === "multiplayer")
      {
        console.log("REDIRECTING TO MULTIPLAYER");
        document.getElementById('options').style.display='block';
        document.getElementById('selection_options').style.display='none';
        document.getElementById('downArrow').style.display='none';

        document.getElementById("st_code").value = code;
      }
    },

    getIp: function () {
      return "192.168.1.60";
      //return "192.168.0.100";
      //if(typeof  localStorage.ip == "undefined")
      //{
      //    var ip = prompt("Please enter your ip");
      //    if(ip)
      //    {
      //        if(ip != "")
      //        {
      //            localStorage.ip = ip;
      //            return ip;
      //        }
      //        else
      //        {
      //            return that.getIp();
      //        }.0
      //    }
      //    else
      //    {
      //        return that.getIp();
      //    }
      //}
      //else
      //{
      //    return localStorage.ip;

      //}
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
      $("#btn-join").on("click", that.joinGame);
      //   $("#initiate-btn").on("click", that.initiateGame);
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
      //$("body").on("click", ".offerPopupButton", function()
      //{
      //    $(this).parents('.offerPopup').hide();
      //});

      //$("body").on("click", "#chiefPopupButton", function()
      //{
      //    alert('hide');
      //    //$('.chiefPopup').hide();
      //});

      that.loadTileCost();
      //that.newOffer();
      //that.newOfferClosed();
      //that.setTile();
      //that.commenceGame();
      //that.initializeSetup();
      // that.loadKeyur();
      //that.updateDetails();
      $("#remaining_credits").html(that.credits);
      //that.playVR();
      //that.playCardboardCounter();
    },

    initiateGame: function () {
      alert("initiate button called");
      //   that.socket.emit("new-user-notify");
    },

    // function to validate ip addresses
    validateIPAddress: function (ipaddress) {
      if (
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          ipaddress
        )
      ) {
        return true;
      }
      return false;
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

      if (typeof clarity !== 'undefined')
      {
        // Use Clarity identify function
        window.clarity("identify", name);
      }
      else
      {
        console.error("Clarity is not defined");
      }
      if (code == "" || name == "") {
        that.showToast("Fields cannot be empty");
        that.initiateBtn = false;
      } else {
        if (code.length == 4) {
          //TODO: Solve the process.env issue for static game files

          var socketEndpoint = getHost("socket");
          var dockerAppEndpoint = getHost("docker");

          $.post(dockerAppEndpoint + "/api/getAppInfo", {
            code: code,
          })
            .done(function (result) {
              console.log(JSON.stringify(result));
              if (result.data != "No Data") {
                localStorage.ipAddress = code;
                document.getElementById("st_code").value = code;
                that.socket = getSocketIO(socketEndpoint, result.data.in_port);
                that.getOns();
              } else {
                that.showToast("Please use valid code");
                that.initiateBtn = false;
                that.showStartLoadingIcon();
              }
            }, "json")
            .fail(function (error) {
              console.log(error);
              console.log(JSON.stringify(error));
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
    // show youtube videos
    showYoutubesvideo: function () {
      that.showLoader("Loading videos...");
      that.fetchYoutubevideos();
      $("#youtubeVideos").show();
      $("#options").hide();
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
    // getting youtube videos via api and displaying it
    fetchYoutubevideos: function () {
      if (typeof cordovaFetch !== "undefined") {
        cordovaFetch(
          "https://www.googleapis.com/youtube/v3/search?key=AIzaSyByEMYPzB65z7PrHkn41bKJcABBSXwwfyA&channelId=UCReiThrggqOhAHITjGKU2GQ&part=snippet&order=date&type==video&maxResults=50",
          {
            timeout: 30000,
          }
        )
          .then(function (response) {
            response = response._bodyText;
            // console.log('youtube response');
            // console.log(response);
            var html = "";
            $.each(response["items"], function (key, value) {
              var video_id = value["id"]["videoId"];
              var video_name = value["snippet"]["title"]
                .toLowerCase()
                .search("evolve");
              if (typeof video_id != "undefined" && video_name > 0) {
                html +=
                  '<div class="thumbnail" data-youtube-id="' +
                  value["id"]["videoId"] +
                  '">' +
                  '<img src="' +
                  value["snippet"]["thumbnails"]["medium"]["url"] +
                  '"/>' +
                  '<div class="font-12" style="text-align: center;width: 95%">' +
                  value["snippet"]["title"].substr(0, 35) +
                  "</div>" +
                  "</div>";
              }
            });
            $("#youtubeVideoscontent").html(html);
            that.hideLoader();
          })
          .error(function (response) {
            // console.log('youtube error response');
            // console.log(response);
            that.hideLoader();
          });
      } else {
        $.ajax({
          url: "https://www.googleapis.com/youtube/v3/search?key=AIzaSyByEMYPzB65z7PrHkn41bKJcABBSXwwfyA&channelId=UCReiThrggqOhAHITjGKU2GQ&part=snippet&order=date&type==video&maxResults=50",
          timeout: 30000,
        })
          .success(function (response) {
            // console.log('youtube response');
            // console.log(response);
            var html = "";
            $.each(response["items"], function (key, value) {
              var video_id = value["id"]["videoId"];
              var video_name = value["snippet"]["title"]
                .toLowerCase()
                .search("evolve");
              if (typeof video_id != "undefined" && video_name > 0) {
                html +=
                  '<div class="thumbnail" data-youtube-id="' +
                  value["id"]["videoId"] +
                  '">' +
                  '<img src="' +
                  value["snippet"]["thumbnails"]["medium"]["url"] +
                  '"/>' +
                  '<div class="font-12" style="text-align: center;width: 95%">' +
                  value["snippet"]["title"].substr(0, 35) +
                  "</div>" +
                  "</div>";
              }
            });
            $("#youtubeVideoscontent").html(html);
            that.hideLoader();
          })
          .error(function (response) {
            // console.log('youtube error response');
            // console.log(response);
            that.hideLoader();
          });
      }
    },
    // skipping the purchase round
    skipRound: function () {
      // console.log('skip');
      that.emitContent("skip-buying", {});
      $(".disableArea").show();
      clearInterval(that.purchaseInterval);
    },
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
    // listening to socket server and executing the functions accordingly
    getOns: function () {
      //connected
      that.socket.on("connected", function (data) {
        // console.log(data['id']);
        $("#disconnectedOverlay").hide();
        that.id = data["id"];

        console.log(data);
        that.user_name = $("#txt_name").val();

        //TODO: Allow only one word (No spaces)
        if(that.user_name.indexOf(" ") > 0)
        {
          console.log("CONTAINS SPACE");

          that.showToast("Username must not contain any spaces");
          that.socket.disconnect();
          that.initiateBtn = false;

          return;
        }

        let userExists = false;
        for (var d in data.devices)
        {
          if (data.devices[d]["name"] == that.user_name &&
              data.devices[d]["status"] == "CONNECTED")
          {
            userExists = true;
          }
        }

        console.log("EXISTS? : " + userExists);
        if(!userExists)
        {
          that.initiateBtn = true;

          that.joinGame();
          that.showStartLoadingIcon();

          that.emitContent("server-join-devices", {});
          if (that.in_game == "yes") {
            var params = {
              id: that.id,
              type: "devices",
              "user-name": that.user_name,
            };
            that.emitContent("server-get-user-type", params);
            that.calamityInterval = setInterval(function () {
              // console.log("checking interval");
              that.emitContent("server-is-calamity-gone", params);
            }, 1000);
          } else {
            $("#game_set_screen").show();
            $("#options").hide();
            keyurJS.initialize();
          }
        }
        else
        {
          that.showToast("Username already taken! \n Try another name");
          that.socket.disconnect();
          that.initiateBtn = false;
        }
      });
      that.socket.on("get-rooms", that.getRooms);
      that.socket.on("initialize-data", that.initializeSetup);
      that.socket.on("tiles-bought", that.tilesBought);
      that.socket.on("my-turn", that.checkMyturn);
      that.socket.on("commence-game", that.commenceGame);
      that.socket.on("commence-midgame", that.commenceMidgame);
      // that.socket.on('waiting-players', that.waitingPlayers);
      that.socket.on("remove-calam-vid", that.removeCalamVid);
      that.socket.on("refresh-page-all", that.refreshPage);
      that.socket.on("new-offer", that.newOffer);
      that.socket.on("offer-closed", that.newOfferClosed);
      that.socket.on("strike-calamity", that.newCalamities);
      that.socket.on("offer-accepted-ack", that.acceptOfferAck);
      that.socket.on("bounty-offer", that.bountyOffer);
      that.socket.on("game-over", that.gameOver);
      that.socket.on("disable-add-button", that.disableAddButton);
      that.socket.on("enable-add-button", that.enableAddButton);
      that.socket.on("prepare-commence-game", that.preparingToStartGame);
      that.socket.on("play-vr", that.playVrOnStart);
      that.socket.on("resume-game", that.resumeGame);
      that.socket.on("days-left", that.daysLeft);
      that.socket.on("calamity-flag", that.calamityFlag);
      that.socket.on("lose-type", that.loseType);
      that.socket.on("resume-game-manually", that.resumeGameManually);
      that.socket.on("pause-game", that.pauseGameByAdmin);
      that.socket.on("badge-highlight", that.badgeIndicator);
      that.socket.on("tribe-mov", that.tribeMov);
      that.socket.on("handle-player-status", that.handlePlayerStatus);
      that.socket.on("limit-reached", that.handleLimitDisconnect)

      that.socket.on("disconnect", function () {
        if (localStorage.getItem("daysLeft") != 0) {
          // console.log('func socket_reconnect');
          $(".offerPopup").hide();
          $("#disconnectedOverlay").show();
          that.socket.io.reconnect();
        }
      });
      //that.socket.on("offer-timed-out", that.offerTimedOut);
      //offer-accepted
    },
    // disable add button on the dashboard if some player enters the purchase screen
    disableAddButton: function () {
      // $("#add-tile").css({ "opacity": 0.5 });
      // $("#add-tile").attr("data-is-busy", 1);
    },
    // enable add button on the dashboard if some player exits the purchase screen
    enableAddButton: function () {
      $("#add-tile").css({ opacity: 1 });
      $("#add-tile").attr("data-is-busy", 0);
    },
    roomName: null,
    // get the tribe name from the admin and displays it on the application
    getRooms: function (data) {
      $("#please_wait").hide();
      $("#login_form").show();
      $("#room_name").html(data["room-name"]);
      that.roomName = data["room-name"];
    },
    // central function to emit data to the server
    emitContent: function (key, object) {
      object["id"] = that.id;
      object["name"] = that.user_name;
      that.socket.emit(key, object);
    },
    // join the game after entering the tribes name
    joinGame: function () {
      console.log("join game");
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
    exhaustFlag: 0,
    exhaustCount: 0,
    movPrice: 3000,
    // initialize all the values of the game
    initializeSetup: function (data) {
      if (that.user_name != null) {
        // console.log(data);
        that.setupData = data["setup"];
        //that.credits = that.setupData["credits"];
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
        // console.log(that.quarterArray);

        that.users = data["users"];
        // $('#game_set_screen').hide();
        // $('#start_screen').show();
      }
      console.log("thatthatthat", that);
    },

    // FOR: mappings for original pin size

    // mappings : {
    //     "lane1" : {
    //         "x" : 64,
    //         "y" : 14,
    //         "count" : 7
    //     },
    //     "lane2" : {
    //         "x" : 33,
    //         "y" : 64,
    //         "count" : 8
    //     },
    //     "lane3" : {
    //         "x" : 3,
    //         "y" : 115,
    //         "count" : 8
    //     },
    //     "lane4" : {
    //         "x" : 33,
    //         "y" : 170,
    //         "count" : 8
    //     },
    //     "lane5" : {
    //         "x" : 3,
    //         "y" : 220,
    //         "count" : 8
    //     },
    //     "lane6" : {
    //         "x" : 33,
    //         "y" : 270,
    //         "count" : 8
    //     }
    // },

    // FOR: mappings for 1.5x pin size
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
    yDifference: 65,
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
      console.log("place Tile");

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
        '<div style="height: 5%"></div>\
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
      htmlPopup +=
        '<hr style="clear: both">\
            <div style="height: 5%"></div>\
            <div style="width: 50%;float: left;height: 10%;">Total</div>\
            <div style="width: 50%;float: left">' +
        total +
        '</div>\
            <div style="height: 3%;clear: both"></div>\
            <div class="purchase">\
                <div class="table">\
                    <div class="cell" style="color: black">\
                        PURCHASE\
                    </div>\
                </div>\
            </div>';
      $(".header-menu").html(htmlPopup);
      $(".buyPopup").show();
    },
    currentTileID: null,
    currentLane: null,
    currentPinRowId: null,
    in_game: "no",
    // buying the tile
    buyTile: function (totalAmount) {
      console.log("buy tile");

      that.emitContent(
        "serrver-check-disable-tile",
        { payload: "let us see if this worketh" },
        function (responseData) {
          if (!response.error) {
            //...
          } else {
            // user.set(response);
            console.log("Callback called with data:", responseData);
          }
        }
      );
      if (isNaN(that.currentTileID)) {
        that.showToast("Someone purchased this land");
        return;
      }

      var totalAmount = 0;
      for (var total in that.tileCost) {
        if (total != "class-name" && total != "tile_id") {
          totalAmount = totalAmount + that.tileCost[total];
        }
      }
      // console.log(totalAmount);

      var difference = that.in_game == "no" ? 50 : 0;

      if (that.credits - difference >= totalAmount) {
        $("#" + that.currentTileID).remove();
        var x = $("#place-pin").position()["left"];
        var y = $("#place-pin").position()["top"];
        $("#place-pin").removeAttr("id");

        that.emitContent("buy-tile", {
          tile_id: that.currentTileID,
          in_game: that.in_game,
          tile_count: that.tileCost,
          x: x,
          y: y,
        });
        that.tileCost["tile_id"] = that.currentTileID;
        // console.log(that.tileCost);
        that.purchasedData.push(that.tileCost);
        $(".buyPopup").hide();
        if (that.in_game == "no") {
          $(".disableArea").show();
        } else {
          that.appendTile(that.tileCost);
        }
        that.credits = that.credits - parseInt(totalAmount);
        $("#remaining_credits").html(that.credits);
        clearInterval(that.purchaseInterval);
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
      for (var data in tile) {
        that.tileCount++;
        if (data != "class-name" && data != "tile_id") {
          widthCount++;
          var secWidth = $(".section").width();
          html +=
            '<div data-day="0" class="section field_container" data-harvest-total-count="0" data-exhaust-count="' +
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
<img src="https://d3cyxgc836sqrt.cloudfront.net/images/website-game/upgradedland.png" style="width: 5VW;height: 5vw;position: absolute;left: -0.6vw;z-index: 1;">\
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
               <div class="tile-image" style="position: relative; top: -8vh;">\
                   <img id="tile_img_' +
            data +
            '" src="https://d3cyxgc836sqrt.cloudfront.net/images/website-game/' +
            data +
            '_inactive.png" style="width: 17vw; height: 25vw"/>\
                   <div class="tile-image-content">\
                           <div class="tilecell font-18" style="font-size: 0vw;">' +
            that.skillLevel * (tile[data] / (data == "mine" ? 4 : 2)) +
            ' cr</div>\
                   </div>\
               </div>\
               <div class="tile-name font-14" style="font-size: 1.6vw;margin-top: 10px;" >' +
            data +
            "</div>\
           </div>";
          that.harvests["section" + that.tileCount] = {};
          if (data == "mine") {
            that.movProb["section" + that.tileCount] = [0, 1];
          }
        } else {
          that.tileCount--;
        }
      }

      html +=
        '<div style="width:17vw" class="section" data-type="add" id="add-tile" data-is-busy="0">\
                <div class="tile-image" style="position: relative; top: 0%;">\
                <img src="https://d3cyxgc836sqrt.cloudfront.net/images/website-game/add.png" style="width: 14vw; height: 14vw; margin-top: 60px;" />\
                </div>\
                <div class="tile-name font-14" style="font-size: 2.4vw;top: 36vh;width: 17vw;"></div>\
           </div>';

      // $(".middle-container").css({
      //     "width": ($(".middle-container").width() + (that.secWidth * widthCount)) + "" + "px"
      // });
      if (tile.length >= 6) {
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

      setTimeout(function () {
        $(".section")[0].click();
        setTimeout(function () {
          $(".section")[0].click();
        }, 200);
      }, 200);
    },
    tileCostObject: {},
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
              console.log("response", response);
            }
            that.tileCostObject = response;
            console.log(response);
            that.calculateMapArea();
          })
          .then(function (json) {
            console.log("parsed json", json);
          })
          .catch(function (ex) {
            console.log("parsing failed", ex);
          });
      } else {
        $.ajax({
          url: "extras/map.json",
        }).success(function (response) {
          if (typeof response == "string") {
            response = JSON.parse(response);
            console.log("response", response);
          }
          that.tileCostObject = response;
          that.calculateMapArea();
        });
      }
    },
    // when some sub tribe purchases tile then all other sub tribes tile is updated via this function
    tilesBought: function (response) {
      // alert('tiles bought');
      // console.log(response);

      var tile_id = "#" + response["tile_id"];

      var x = $(tile_id).position()["left"];
      var y = $(tile_id).position()["top"];

      var pinHeight = $(tile_id).height();
      var pinWidth = $(tile_id).width();
      that.currentTileID = this.id;
      x = x + pinHeight / 2;
      y = y + pinWidth / 2;

      var className = "";
      className =
        that.tileCostObject[$(tile_id).attr("data-lane")][
          $(tile_id).attr("data-pos")
        ]["class-name"];
      var html = '<div id="place-pin" class="' + className + '"></div>';

      //var html = '<div id="place-pin" class="trans-tile"></div>';
      $(".pin-container").append(html);

      var height = $("#place-pin").height();
      var width = $("#place-pin").width();

      $("#place-pin").css({
        top: response["y"] + "px",
        left: response["x"] + "px",
        "z-index": 1,
      });
      $(tile_id).remove();
      $("#place-pin").removeAttr("id");
    },
    // on users turn to purchase the tile
    checkMyturn: function (data) {
      // console.log(data);
      $(".disableArea").hide();
      // var time = 60;
      var time = 30;
      that.purchaseInterval = setInterval(function () {
        if (time > 0) {
          time--;
          if (time < 10) {
            document.getElementById("timer").style.webkitTransition = "0.3s";
            document.getElementById("timer").style.webkitTransform =
              "scale(1.5,1.5)";
            setTimeout(function () {
              document.getElementById("timer").style.webkitTransform =
                "scale(1,1)";
            }, 200);
          }
          $(".timer").html(time);
        } else {
          clearInterval(that.purchaseInterval);
          that.skipRound();
        }
      }, 1000);
    },
    // close the popup
    closePopup: function () {
      $(this).parent().hide();
      clearInterval(keyurJS.tradeInterval);
      //$('.buyPopup').hide();
    },
    // refreshes page on admins call
    refreshPage: function () {
      // console.log("refresh");
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
          // console.log("checking interval");
          that.emitContent("server-is-calamity-gone", params);
        }, 1000);
        $("#game_set_screen").hide();
        $("#__tribe__").hide();
      }
      that.in_game = "yes";
      $(".back").show();
      $(".skip").hide();
      $(".timer").hide();
      // console.log('commence game');
      // console.log(response);
      $("#start_screen").hide();
      $(".rightArrow").hide();
      $("#game_screen").show();
      that.updateDetails();
      //
      //that.purchasedData = [{
      //    "plain" : 20,
      //    "farm" : 20,
      //    "lake" : 40,
      //    "class-name" : "trans-tile-middle"
      //}];
      //
      //that.purchasedData = [
      //    {
      //        "farm" : 20,
      //        "class-name" : "trans-tile-top-single",
      //        "tile_id" : "2"
      //    },
      //    {
      //        "lake" : 40,
      //        "class-name" : "trans-tile-left-single",
      //        "tile_id" : "31"
      //    },
      //    {
      //        "plain" : 20,
      //        "lake" : 40,
      //        "earth" : 100,
      //        "class-name" : "trans-tile-middle",
      //        "tile_id" : "32"
      //    },
      //    {
      //        "plain" : 20,
      //        "forest" : 60,
      //        "farm" : 20,
      //        "class-name" : "trans-tile-middle",
      //        "tile_id" : "33"
      //    },
      //    {
      //        "lake" : 40,
      //        "farm" : 20,
      //        "plain" : 20,
      //        "class-name" : "trans-tile-middle",
      //        "tile_id" : "34"
      //    },
      //    {
      //        "lake" : 40,
      //        "forest" : 60,
      //        "farm" : 20,
      //        "class-name" : "trans-tile-middle",
      //        "tile_id" : "35"
      //    },
      //    {
      //        "forest" : 60,
      //        "lake" : 40,
      //        "earth" : 100,
      //        "class-name" : "trans-tile-middle",
      //        "tile_id" : "36"
      //    },
      //    {
      //        "earth" : 100,
      //        "forest" : 60,
      //        "plain" : 20,
      //        "class-name" : "trans-tile-middle",
      //        "tile_id" : "37"
      //    },
      //    {
      //        "plain" : 20,
      //        "farm" : 20,
      //        "class-name" : "trans-tile-right-double",
      //        "tile_id" : "38"
      //    }
      //];

      // console.log('purchased data');
      // console.log(that.purchasedData);
      that.createTileMaze();
      that.resetValues();
      that.skillLevelTile();
    },
    tileCount: 0,

    // waitingPlayers: function (response) {
    //     console.log("waitingPlayers",response)
    //     console.log("response.devices",response.devices)

    //     let html = ''

    //     for(let i=0; i<Object.keys(response.devices).length; i++){
    //         console.log("response.devices[Object.keys(response.devices)[i]].name",response.devices[Object.keys(response.devices)[i]].name)
    //         if(response.devices[Object.keys(response.devices)[i]].id===null){
    //             html = html + `<p> ${response.devices[Object.keys(response.devices)[i]].name} </p><br/>`
    //         }
    //     }
    //     console.log("htmlhtml",html)
    //     $("#waiting_room_body_users").append(html);
    // },

    //remove calamity video
    removeCalamVid: function () {
      $(".counterScale").hide();
      $("._backdrop").hide();
    },

    // Pulls user midgame
    commenceMidgame: function (response) {
      that.initializeSetup(response);
      if (that.in_game == "no") {
        console.log("Adding user to the game");
        var params = {
          id: that.id,
          type: "devices",
          "user-name": that.user_name,
        };
        that.emitContent("server-get-user-type", params);
        that.calamityInterval = setInterval(function () {
          // console.log("checking interval");
          that.emitContent("server-is-calamity-gone", params);
        }, 1000);
        $("#game_set_screen").hide();
        $("#__tribe__").hide();
        that.in_game = "yes";
        $(".back").show();
        $(".skip").hide();
        $(".timer").hide();
        // console.log('commence game');
        // console.log(response);
        $("#start_screen").hide();
        $(".rightArrow").hide();
        $("#game_screen").show();
        that.updateDetails();
        console.log("USER ID");
        console.log(that.id);
        that.createTileMaze();
        that.resetValues();
        that.skillLevelTile();
      }
      console.log("User is in the game");
      console.log(that.id);
    },
    tileCount: 0,

    // creates the tiles of the dashboard
    createTileMaze: function () {
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
      // $(".section").css({ "width": $(".section").width() + "px" });
      // $(".middle-container").css({ "width": ($(".section").width() * length + 20) + "px" });

      // console.log($(".section").width());
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
        // console.log(msg);
      }
    },
    // show loader plugin
    showLoader: function (msg) {
      try {
        if (typeof message === "undefined") {
          window.plugins["spinnerDialog"].show(null, null, true);
        } else {
          window.plugins["spinnerDialog"].show(null, msg, true);
        }
      } catch (e) {}
    },
    // hide the loader
    hideLoader: function (msg) {
      try {
        setTimeout(function () {
          window.plugins["spinnerDialog"].hide();
        }, 1000);
      } catch (e) {
        // console.log(e);
      }
    },
    // function to set the tile properly into the design
    setTile: function () {
      // console.log($(".tile-image").height(), $(".tile-image").width())
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
      console.log("set Marker");
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

        // console.log(that.currentSelectedtileCost);
        // console.log(that.currentSelectedtileName);
        // console.log(that.currentSelectedtileNo);
        // console.log(that.selectedTile);

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
    },
    // if some new offers come
    newOffer: function (response) {
      // console.log('new offer');
      // console.log(response);
      that.newOfferData = response;
      //that.newOfferData = {
      //    "weeks" : 3,
      //    "harvest" : 'plain',
      //    "quantity" : 1,
      //    "credits" : 100
      //};
      //// console.log(that.newOfferData);
      $(".offerPopup").show();
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
    tileMap: {
      plain: "sheep",
      forest: "wood",
      earth: "brick",
      farm: "grain",
      lake: "fish",
      mine: "movellinium",
    },
    // when offer is closed
    newOfferClosed: function (response) {
      $(".offerPopup").hide();
      that.newOfferData = {};
      $(".pending_offer").hide();
    },
    acceptedOffercount: 0,
    // when offer is accepted it sends data to server and waits for acknowledgement
    acceptOffer: function () {
      //Original

      //that.newOfferData.user_id = that.id;
      //that.newOfferData.name = document.getElementById('txt_name').value;
      //that.acceptedOffers[that.acceptedOffercount] = that.newOfferData;
      //that.acceptedOffers[that.acceptedOffercount].status = 'in progress';
      //that.acceptedOffers[that.acceptedOffercount].expiryTime = 0;
      //that.emitContent("offer-accepted", that.newOfferData);
      //that.deOfferTimer(that.newOfferData.weeks, that.acceptedOffercount);
      //that.newOfferData = {};
      //// console.log('accepted');
      //// console.log(that.acceptedOffers);
      //that.acceptedOffercount++;
      //$('.offerPopup').hide();

      that.newOfferData.user_id = that.id;
      that.newOfferData.name = document.getElementById("txt_name").value;
      that.emitContent("offer-accepted", that.newOfferData);
      $(".offerPopup").hide();
    },
    // if offer is acknowledged then it means you have accepted the offer
    acceptOfferAck: function (data) {
      // console.log("acknowledged");
      // console.log(data);
      that.acceptedOffers[that.acceptedOffercount] = that.newOfferData;
      that.acceptedOffers[that.acceptedOffercount].status = "in progress";
      that.acceptedOffers[that.acceptedOffercount].expiryTime = 0;
      that.acceptedOffers[that.acceptedOffercount].percent = 100;
      that.acceptedOffers[that.acceptedOffercount].index =
        that.acceptedOffercount;
      that.deOfferTimer(that.newOfferData.weeks, that.acceptedOffercount);
      that.newOfferData = {};
      // console.log('accepted');
      // console.log(that.acceptedOffers);
      that.acceptedOffercount++;
      that.showToast("You have accepted the offer");
    },
    // declining the offer
    declineOffer: function () {
      // console.log('decline offer');
      $(".offerPopup").hide();
      that.emitContent("decline-offer", that.newOfferData);
      that.newOfferData = {};
      that.declineFlag = true;
    },
    // hide the offer popup window
    laterOffer: function (response) {
      // console.log('later offer');
      $(".offerPopup").hide();
      $(".pending_offer").show();
    },
    // opens up all the list of offer you have accepted and yet to be delivered
    showOffers: function () {
      clearInterval(keyurJS.tradeInterval);
      // console.log('total harvest');
      // console.log(that.totalHarvest);
      $(".offerListPopup").show();
      var html = "";
      if (that.acceptedOffers.length > 0) {
        for (var data in that.acceptedOffers) {
          if (that.acceptedOffers[data].status == "in progress") {
            // console.log(that.acceptedOffers);

            var expiryTime = that.acceptedOffers[data]["expiryTime"];
            var totalExpiryTime =
              parseInt(that.acceptedOffers[data]["weeks"]) *
                7 *
                webJS.sec_days +
              30;
            var days = Math.round(
              (totalExpiryTime - expiryTime) / webJS.sec_days
            );
            var weeks = days / 7;
            // console.log(weeks);
            if (weeks > 0) {
              html +=
                '<div class="section-container">' +
                '<div class="table float-left" style="width: 20%">' +
                '<div class="cell">' +
                that.acceptedOffers[data]["quantity"] +
                " " +
                that.tileMap[that.acceptedOffers[data]["harvest"]] +
                '</div></div>\
                     <div class="table float-left" style="width: 20%">\
                     <div class="cell">' +
                that.acceptedOffers[data]["weeks"] +
                ' Weeks</div></div>\
                     <div class="table float-left" style="width: 20%">\
                     <div class="cell">' +
                that.acceptedOffers[data]["credits"] +
                ' Cronos</div></div>\
                     <div class="table float-left" style="width: 20%">\
                     <div class="cell">' +
                (weeks < 1 ? days + " Days" : Math.round(weeks) + " Weeks") +
                "</div></div>";

              if (
                that.goods[that.acceptedOffers[data]["harvest"]] >=
                that.acceptedOffers[data]["quantity"]
              ) {
                html +=
                  '<div class="table float-left" style="width: 20%; background-color: transparent;">\
                     <div class="cell">\
                     <input type="button" value="" class="deliver_button" data-credit="' +
                  that.acceptedOffers[data]["credits"] +
                  '"  data-index="' +
                  data +
                  '" data-name="' +
                  that.acceptedOffers[data]["harvest"] +
                  '">' +
                  "</div>" +
                  "</div>";
              } else {
                html +=
                  '<div class="table float-left" style="width: 20%">\
                     <div class="cell"><input disabled type="button"  value="" class="deliver_button" data-credit="' +
                  that.acceptedOffers[data]["credits"] +
                  '"  data-index="' +
                  data +
                  '" data-name="' +
                  that.acceptedOffers[data]["harvest"] +
                  '"></div></div>';
              }

              html += "</div>";
            }
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
      keyurJS.tradeInterval = setInterval(function () {
        that.showOffers();
      }, 5000);
    },
    offerDelivered: 0,
    // when user have enough yields then he/she can deliver the offer via this function
    deliver: function () {
      var data_name = $(this).attr("data-name");
      var data_index = $(this).attr("data-index");
      var credit_amount = $(this).attr("data-credit");
      // console.log(data_name);
      // console.log(that.totalHarvest);
      var check = "not delivered";
      // console.log(that.goods[that.acceptedOffers[data_index]['harvest']]);
      // console.log(that.acceptedOffers[data_index]['quantity']);
      if (
        that.goods[that.acceptedOffers[data_index]["harvest"]] >=
        that.acceptedOffers[data_index]["quantity"]
      ) {
        that.deliveredData.push(that.acceptedOffers[data_index]);
        //$('.deliver_button').parent('.row').remove();

        // console.log(that.acceptedOffers[data_index]['quantity']);

        that.goods[that.acceptedOffers[data_index]["harvest"]] -=
          that.acceptedOffers[data_index]["quantity"];
        keyurJS.goodsHUD();

        var quantity = that.acceptedOffers[data_index]["quantity"];

        for (var j = 0; j < that.acceptedOffers[data_index]["quantity"]; j++) {
          for (var i = 0; i < that.totalHarvest.length; i++) {
            if (
              that.totalHarvest[i]["tileName"] ==
                that.acceptedOffers[data_index]["harvest"] &&
              that.totalHarvest[i]["status"] == "complete"
            ) {
              if (that.totalHarvest[i]["yield"] > 0) {
                that.totalHarvest[i]["yield"]--;
                if (that.totalHarvest[i]["yield"] == 0) {
                  that.totalHarvest[i]["status"] = "delivered";
                }
                // console.log(that.totalHarvest[i]);
                break;
              }
            }
          }
        }

        //Original
        //for(var j = 0; j < that.acceptedOffers[data_index]['quantity']; j++)
        //{
        //    for(var i = 0; i < that.totalHarvest.length; i++)
        //    {
        //        if(that.totalHarvest[i]['tileName'] == that.acceptedOffers[data_index]['harvest']
        //            && that.totalHarvest[i]['status'] == "complete")
        //        {
        //            that.totalHarvest[i]['status'] = "delivered";
        //            // console.log(that.totalHarvest[i]);
        //            break;
        //        }
        //    }
        //}

        clearInterval(that.acceptedOffers[data_index]["interval"]);
        // console.log('deliver data');
        // console.log(that.deliveredData);
        that.credits = that.credits + parseInt(credit_amount);
        that.updateDetails();
        that.acceptedOffers[data_index]["status"] = "complete";
        //that.acceptedOffers.splice(data_index, 1);
        // console.log(data_index);
        $(this).parents(".section-container").remove();
        that.offerDelivered++;
        that.emitContent(
          "server-deliver-offer",
          that.acceptedOffers[data_index]
        );
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
        // console.log(tileCost);
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
      var harvestCount = parseInt(
        $("#" + that.selectedTile).attr("data-harvest-total-count")
      );
      console.log(that.exhaustFlag == 1, harvestCount, that.exhaustCount);
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

      // console.log(that.harvests);
      //for(var i = 0; i < that.harvestYield; i++)
      //{
      //    // console.log(i);
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
      //}
      // console.log(that.totalHarvest);
      document.getElementById("harvest-button").style.display = "none";
      document.getElementById("dev-points").style.display = "none";
    },
    goods: {
      plain: 0,
      forest: 0,
      earth: 0,
      lake: 0,
      farm: 0,
      mine: 0,
    },
    movProb: {},
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
        var totalWeek = totalTime / 7;
        var days = Math.round(totalTime - count / webJS.sec_days);
        var weeks = days / 7;
        var print = "";
        var cal = weeks;

        if (cal < 1) {
          print = days + " Days";
        } else {
          print = Math.floor(cal) + " Weeks";
        }

        $("#" + selectedTile + " .timeline .cell").html(print);

        //// console.log('percent '+percent);
        if (percent >= 100) {
          $("#" + selectedTile + " .timeline .cell").html("");
          //// console.log("selected tile", selectedTile);
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
          clearInterval(that.totalHarvest[harvestIndex].harvestInterval);

          if (that.harvests[selectedTile]["tileName"] == "mine") {
            that.harvests[selectedTile].status = "mined";
            that.totalHarvest[harvestIndex].status = "mined";

            var random = _.sample(that.movProb[selectedTile], 1);

            if (random[0] == 0) {
              keyurJS.myMov++;
              that.showToast("You mined a Movellinium!");
              that.updateDetails();
            } else {
              that.showToast("Your mining did not yield Movellinium", 1);
            }

            var index = that.movProb[selectedTile].indexOf(random[0]);
            that.movProb[selectedTile].splice(index, 1);
            if (that.movProb[selectedTile].length == 0) {
              that.movProb[selectedTile] = [0, 1];
            }
          } else {
            that.harvests[selectedTile].status = "complete";
            that.totalHarvest[harvestIndex].status = "complete";
            that.totalHarvest[harvestIndex].percent = 100;
            that.deHarvestTimer(selectedTile, harvestIndex, className);

            that.emitContent(
              "server-submit-harvest",
              that.harvests[selectedTile]
            );
          }

          // console.log('complete harvest');
          // console.log(that.harvests);
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
        var sec = 3 * 7 * that.sec_days;
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
              // console.log(that.totalHarvest[harvestIndex].status);
              if (that.totalHarvest[harvestIndex].status == "on sale") {
                // console.log("on sale");
                var params = {
                  index: harvestIndex,
                  harvest: that.totalHarvest[harvestIndex]["tileName"],
                  "my-name": that.user_name,
                  key: "spoil",
                };
                that.emitContent("server-goods-expired", params);
              }

              that.totalHarvest[harvestIndex].status = "spoil";
              // console.log('spoil');
              // console.log(that.harvests);
              that.goods[that.totalHarvest[harvestIndex]["tileName"]] -=
                that.totalHarvest[harvestIndex]["yield"];
              keyurJS.goodsHUD();
            }
          }
        }, 1000);
      } catch (e) {
        // console.log("error at deharvest timer : ", e);
      }
    },
    // offer timer till it is expired
    deOfferTimer: function (week, harvestIndex) {
      var sec = week * 7 * that.sec_days + 30;
      var percent = that.acceptedOffers[harvestIndex].percent;
      var minus = percent / sec;
      var count = that.acceptedOffers[harvestIndex].expiryTime;
      that.acceptedOffers[harvestIndex]["interval"] = setInterval(function () {
        count++;
        percent = percent - minus;

        that.acceptedOffers[harvestIndex].percent = percent;
        that.acceptedOffers[harvestIndex].expiryTime = count;

        if (percent <= 0) {
          if (that.acceptedOffers[harvestIndex]["status"] == "complete") {
          }

          clearInterval(that.acceptedOffers[harvestIndex]["interval"]);
          that.acceptedOffers[harvestIndex].status = "closed";
          // console.log('offers spoil');
          that.emitContent(
            "offer-timed-out",
            that.acceptedOffers[harvestIndex]
          );
          // console.log(that.acceptedOffers);
        }
      }, 1000);
    },
    // enable harvest and dev points button
    enableButton: function (selectedTile) {
      // console.log(selectedTile);
      // console.log(that.selectedTile);
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
    // this function executes the calamity in the game. it disables the tiles if affected and also pauses the game
    newCalamities: function (response) {
      clearTimeout(that.calamityTimeOut);
      $(".counterScale").hide();
      console.warn("calamities");
      // console.log(response);
      // console.log(that.purchasedData);
      that.calamity = {};
      var calamity = response["calamity"];
      that.calamity = response["calamity"];
      var index = response["index"];
      var affected_tiles = response["affected_tiles"];

      //affected_tiles[0]['ids'][0] = 35;

      var idsAndTile = {};
      if (that.calamity["eradicate"] == 0) {
        for (var i = 0; i < affected_tiles.length; i++) {
          var ids = affected_tiles[i]["ids"];
          var tileName = affected_tiles[i]["tile"];
          for (var j = 0; j < ids.length; j++) {
            var tileId = ids[j];
            for (var k = 0; k < that.purchasedData.length; k++) {
              if (that.purchasedData[k]["tile_id"] == tileId) {
                // console.log("found one");

                // console.log(tileName);

                //tileName = "lake";

                var data = $(
                  "[data-tile-pos=" +
                    tileId +
                    "][data-tile-name=" +
                    tileName +
                    "]"
                );
                var sectionId = data.attr("id");
                // console.log(sectionId);
                data.attr("data-calamity-attack", 1).css({ opacity: 0.4 });
                document.getElementById("harvest-button").style.display =
                  "none";
                if (typeof sectionId != "undefined") {
                  // console.log(sectionId);
                  $(
                    "[data-tile-pos=" +
                      tileId +
                      "][data-tile-name=" +
                      tileName +
                      "] .timeline .cell"
                  ).html("");
                  if (typeof that.harvests[sectionId]["cost"] != "undefined") {
                    // console.log("clearing tile");
                    clearInterval(that.harvests[sectionId].harvestInterval);
                    clearInterval(
                      that.totalHarvest[
                        that.harvests[sectionId]["harvest-count"]
                      ].harvestInterval
                    );
                    that.harvests[sectionId] = {};
                  }

                  for (var m in that.totalHarvest) {
                    // console.log(that.totalHarvest[m]);
                    if (
                      that.totalHarvest[m]["tile-pos"] == tileId &&
                      that.totalHarvest[m]["tileName"] == tileName &&
                      that.totalHarvest[m]["status"] == "pending"
                    ) {
                      // console.log("setting status to spoil");
                      // console.log(that.totalHarvest[m]);
                      that.totalHarvest[m]["status"] = "spoil";
                      that.totalHarvest[m]["className"].width = "0%";
                    }
                  }
                }
              }
            }
          }
        }
        that.pauseGame();
      }
    },
    // calamity counter starts after game is resumed
    calamityCounter: function () {
      try {
        // console.log((that.calamityLevel[that.calamity['level']]['weeks'] * 7 * that.sec_days) * 1000);
        that.calamityTimeOut = setTimeout(function () {
          // console.log("calamity finished");
          $("[data-calamity-attack=1]")
            .attr("data-calamity-attack", "0")
            .css({ opacity: 1 });
          that.calamity = {};
        }, that.calamityLevel[that.calamity["level"]]["weeks"] *
          7 *
          that.sec_days *
          1000);
      } catch (e) {
        // console.log(e);
      }
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
        that.showToast("Land Revived!");
      } else {
        that.showToast("You don't have enough dev points");
      }
    },
    bountyOfferFlag: false,
    // bounty offer popup
    bountyOffer: function (data) {
      that.bountyOfferFlag = true;
      // console.log('new bounty offer');
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
      // console.log(data);
      // console.log("Game Over");
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
    loseVideo: "methane",
    // no use
    loseType: function (data) {
      if (data == "non-collab") {
        that.loseVideo = "methane";
        //that.loseVideo = "non-collab";
      } else {
        that.loseVideo = "methane";
        //that.loseVideo = "collab";
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

    // go back to game screen from purchase screen
    goBackToGameScreen: function () {
      $("#place-pin").remove();
      document.getElementById("start_screen").style.display = "none";
      document.getElementById("game_screen").style.display = "block";
      that.emitContent("server-enable-add-button", {});
      that.updateDetails();
      that.skillLevelTile();
    },
    // preparing to start game
    preparingToStartGame: function () {
      $(".disableArea h2").html("Please wait while we allocate your land");
    },
    // play VR on calamities
    playVR: function (callback, videoname) {
      //videoname = 'acidrain';

      //alert('playing vr');
      try {
        //that.calamity['calamity'] = "hurricane";
        //alert('try plugin');
        //navigator.playvr.playvideo("http://" + that.getIp() + "/evolve/video/" + videonamevideoname + ".mp4",
        // navigator.playvr.playvideo(videoname.toLowerCase(),
        //     function(message)
        //     {
        //         callback();
        //         // console.log('callback value ' + message);
        //         //callback(message);
        //         // console.log('callback response', JSON.stringify(message));
        //     }
        // );
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
        //sources[0].src = 'videos/' + videoname.toLowerCase() + '.mp4';
        video.removeAttribute("controls");

        //handled event beofore playing video
        // video.onended = function () {
        //     // alert('video end event');
        //     sources[0].src = "";

        //     bg.style.display = "none";
        //     callback();
        // }

        $("#_calamity_video").bind("ended", function () {
          //alert('video end event');
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
        console.log(card_board_number, "card_board_number");
        if (card_board_number == 0) {
          console.log(card_board_interval, "card_board_interval");
          clearInterval(card_board_interval);
          console.log(card_board_interval, "clear_interval");
          console.log(flag, "flag");
          console.log(that.loseVideo, "outside loooooose");
          if (flag == 1) {
            videoname = that.loseVideo;
            console.log(that.loseVideo, "loooooose");
          }
          that.playVR(callback, videoname);
        }
      }, 1000);
    },
    // when game is paused by admin
    pauseGameByAdmin: function () {
      that.pauseGame(1);
    },
    // badge indicator toast
    badgeIndicator: function (data) {
      if (data["flag"] == "on") {
        if (data["type"] == "hope") {
          that.showToast("Great! you are one step closer to evolving");
        }
        if (data["type"] == "depression") {
          that.showToast("Uh Oh! looks like you lost 1 movellinium");
        }
        if (data["type"] == "unity") {
          that.showToast(
            "Congratulations! CROB now offers you movellinium at half the cost"
          );
        }
        if (data["type"] == "fear") {
          that.showToast("Uh Oh! CROBs movellinium rates have doubled");
        }
      }
    },

    // toast when tribe mov is increased
    tribeMov: function (data) {
      that.showToast("Great! you are one step closer to evolving");
    },

    //Disable/Enable player

    handlePlayerStatus: function (data) {
      that.playerId = data?.data.user_id;
      that.status = data?.data.status;

      if (that.id === that.playerId && that.status === "disabled") {
        $("#disabled-player").show();
      } else if (that.id === that.playerId && that.status === "enabled") {
        $("#disabled-player").hide();
      }
    },

    handleLimitDisconnect: function (data) {
        that.socket.disconnect();
        $("#disconnectedOverlay").show();
        alert("Disconnected: Dry Run player cap has reached.");
        window.location.reload();
    },

    // pausing the game on admins call or calamity
    pauseGame: function (flag) {
      for (var offers in that.acceptedOffers) {
        if (that.acceptedOffers[offers]["status"] == "in progress") {
          clearInterval(that.acceptedOffers[offers]["interval"]);
        }
      }

      for (var harvest in that.totalHarvest) {
        if (that.totalHarvest[harvest]["status"] == "complete") {
          clearInterval(that.totalHarvest[harvest]["interval"]);
          clearInterval(that.totalHarvest[harvest]["harvestInterval"]);
        }
      }

      for (var harvests in that.harvests) {
        // console.log(that.harvests[harvests]);
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
      // console.log('resume');
      $(".counterScale").hide();
      $("#pauseGameOverlay").hide();
      for (var harvests in that.harvests) {
        if (that.harvests[harvests]["status"] == "pending") {
          that.harvestTimer(
            that.harvests[harvests]["className"],
            that.harvests[harvests]["seconds"],
            that.harvests[harvests]["selected-tile"],
            that.harvests[harvests]["harvest-count"]
          );
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

      for (var offers in that.acceptedOffers) {
        if (that.acceptedOffers[offers]["status"] == "in progress") {
          that.deOfferTimer(
            that.acceptedOffers[offers]["weeks"],
            that.acceptedOffers[offers]["index"]
          );
        }
      }

      if (data["flag"] == 0) {
        that.calamityCounter();
      }
      that.resetValues();
    },
    declineFlag: false,
    daysLeftCount: 0,
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
    // calamity flag
    calamityFlag: function (data) {
      // console.log("calamity Flag", JSON.stringify(data));
      if (data["calamity-flag"] == "false") {
        $(".counterScale").hide();
      }
      clearInterval(that.calamityInterval);
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
    // resume game manually
    resumeGameManually: function () {
      // console.log('manual');
      $(".counterScale").hide();
    },
    // go to trade section
    // goToTrade: function () {
    //     keyurJS.showTrading('trade');
    //     $(".tradeListPopup").hide();
    //     keyurJS.showTrading();
    //     setTimeout(() => {
    //         document.getElementById("trading-section2").click()
    //     }, 300)
    // },
    showBuyItem: function () {
      $(".tradeListPopup").hide();
      keyurJS.showTrading();
      setTimeout(() => {
        document.getElementById("trading-section2").click();
      }, 100);
    },
    imageCount: 1,
    endCount: 0,
    folder: "Normal",
    highLightArray: [],
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
    //$(".main").css({"height" : window.innerHeight});
    webJS.initialize();
  };
})(window, document);

$("head").append(
  '<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width;" />'
);

document.ontouchmove = (event) => {
  event.preventDefault();
};
$(function () {
  // $("#main").swipe( {
  //   //Generic swipe handler for all directions
  //   swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {

  //     if(fingerData[0].end.x < 700){
  //         $(".sidenav").show();
  //         $(".rightArrow").hide();
  //     }
  //   },
  //   swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
  //     if(fingerData[0].start.x < 700){
  //         $(".sidenav").hide();
  //         $(".rightArrow").show();
  //     }
  // }
  // });
  setTimeout(function () {
    document.getElementById("rightArrow").style.visibility = "visible";
  }, 1000);
  document.getElementById("rightArrow").onclick = openSlider;
  function openSlider() {
    $(".sidenav").show();
    $(".rightArrow").hide();
  }
  document.getElementById("close").onclick = closeSlider;
  function closeSlider() {
    $(".sidenav").hide();
    $(".rightArrow").show();
  }
});
