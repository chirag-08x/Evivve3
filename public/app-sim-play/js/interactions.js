(function (window, document) {
  var that;
  window.keyurJS = {
    // initializing all the clicks in this document
    initialize: function () {
      that = this;
      $("body").on("click", ".menu-section", that.openContainer);
      $("body").on("click", ".menu-section1", that.openContainer);
      $("body").on("click", "#submit-credits", that.submitCredits);
      $("body").on("click", "#submit-mv", that.submitMV);
      $("body").on("click", "#buy-mv", that.buyMV);
      $("body").on("click", "#buy-dev-points", that.buyDevPoints);
      $("body").on("click", "#bounty-hunter-submit-mv", that.bountySubmitMV);
      $("body").on("click", "#buy-dev-points-pop", that.buyDevPointsPop);
      $("body").on("click", "#buy-mv-pop", that.buyMVPop);
      $("body").on("click", ".close", that.closePopup);
      $("body").on("click", ".harvest-sell-item", that.harvestSellItem);
      $("body").on("click", ".harvest-sell-it-to-friend", that.sellItToFriend);
      $("body").on("click", ".accept-trade", that.acceptTrade);
      $("body").on("click", ".decline-trade", that.declineTrade);
      $("body").on("click", ".send-credits-to-bank", that.sendCreditsToBank);
      $("body").on("click", ".send-mv-to-bank", that.sendMVoBank);
      $("body").on("click", "#btn-transfer-credits", that.transferCredits);
      that.getOns();
    },
    // listening to the server
    getOns: function () {
   
    },
    // updating users if any one leaves
    updateUsers: function (data) {
      // console.log(data);
      webJS.users = data["users"];
      //   webJS.socket.emit("new-user-notify");
    },
    // opening the section according to the left menu
    openContainer: function () {
      var type = $(this).attr("data-type");
      $(".menu-section").removeClass("active");
      $(".menu-section1").removeClass("active");
      $(this).addClass("active");
      clearInterval(keyurJS.tradeInterval);
      if (type == "home") {
        that.closeTrading();
      }
      if (type == "market") {
        that.showMarket();
      }
      if (type == "trade") {
        that.showTrade();
      }
      if (type == "my-harvest") {
        that.myHarvests();
      }
      if (type == "get-immune") {
        that.getImmune();
      }
      if (type == "my-deliveries") {
        that.myDeliveries();
      }
      if (type == "get-crobs") {
        that.showCrobs();
      }
      if (type == "transfer-credit") {
        that.showTransferCredits();
      }
    },
    // display transfer credits section
    showTransferCredits: function () {
      var html =
        '<div class="header">' +
        '<div class="table">' +
        '<div class="cell font-16">Transfer Cronos</div>' +
        "</div>" +
        "</div>";

      html +=
        '<div style="height: 5%"></div>' +
        '<div class="input-form" style="height: 73%;display: flex;align-items: center;">' +
        "This is where you transfer your cronos (money) to your team members." +
        "</div>";
      document.getElementById("right-container").innerHTML = html;
    },
    // transfer credits to sub tribes
    transferCredits: function () {
      var credits = parseInt(document.getElementById("txt_credits").value);
      var friend = document.getElementById("dd_select_friends").value;

      if (friend == "") {
        webJS.showToast("Please select friend");
      } else if (credits < 0) {
        webJS.showToast("Please enter valid amount");
      } else if (isNaN(credits)) {
        webJS.showToast("Please enter valid amount");
      } else if (credits > webJS.credits) {
        webJS.showToast("You don't have enough cronos");
      } else {
        var param = {
          credits: credits,
          friend_id: friend,
          "my-id": webJS.id,
          "my-name": webJS.user_name,
        };
        that.manageCredits("sub", credits);
        that.showTransferCredits();
        webJS.showToast("Cronos transferred successfully");
      }
    },
    // receive credits from other sub tribes
    getCreditsFromSubTribes: function (data) {
      that.manageCredits("add", data["credits"]);
      webJS.showToast(
        "You received " + data["credits"] + " cronos from " + data["my-name"]
      );
    },
    // show market section
    showMarket: function () {
      var html =
        '<div class="header">' +
        '<div class="table">' +
        '<div class="cell font-16">' +
        "Buy From Market" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="bank-container">' +
        '<div style="height: 7%"></div>' +
        '<div class="button" id="buy-mv">' +
        '<div class="table">' +
        '<div class="cell font-14">' +
        "BUY MV" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div style="height: 6%"></div>' +
        '<div class="button" id="buy-dev-points">' +
        '<div class="table">' +
        '<div class="cell font-14">' +
        "BUY DEV POINTS" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div style="height: 7%"></div>' +
        "</div>";

      document.getElementById("right-container").innerHTML = html;
      $(".menu-section").removeClass("active");
      $("#trading-section1").addClass("active");
    },
    // display credits pop
    submitCredits: function () {
      var html =
        '<div class="input-form">' +
        '<input class="input-text" type="tel" id="txt_credits_submit" placeholder="Enter Amount"></div>' +
        '<div class="separator"></div>' +
        '<div class="input-form" style="height: 10%;">Remaining Cronos : ' +
        webJS.credits +
        "</div>" +
        '<div class="separator"></div>' +
        '<div class="button send-credits-to-bank" data-index="0">' +
        '<div class="table">' +
        '<div class="cell">Send Cronos</div>' +
        "</div>" +
        "</div>";

      document.getElementById("popup-text").innerHTML = "Submit Cronos";
      document.getElementById("popup-container").innerHTML = html;
      document.getElementById("trading-popup").style.display = "block";
    },
    // send credits to crob bank
    sendCreditsToBank: function () {
      var credits = parseInt(
        document.getElementById("txt_credits_submit").value
      );
      if (isNaN(credits)) {
        webJS.showToast("Please enter valid cronos");
      } else if (credits < 0) {
        webJS.showToast("Please enter valid cronos");
      } else if (credits <= webJS.credits) {
        var params = {
          "my-name": webJS.user_name,
          credits: credits,
        };
        that.manageCredits("sub", credits);
        document.getElementById("trading-popup").style.display = "none";
        webJS.showToast("Cronos submitted to CROB");
      } else {
        webJS.showToast("You don't have enough cronos");
      }
    },
    // display submit mv section
    submitMV: function () {
      var html =
        '<div class="input-form">' +
        '<input class="input-text type="tel" id="txt_mv_submit" placeholder="Enter Number of MV"></div>' +
        '<div class="separator"></div>' +
        '<div class="input-form" style="height: 10%;">Remaining MV : ' +
        that.myMov +
        "</div>" +
        '<div class="separator"></div>' +
        '<div class="button send-mv-to-bank" data-index="0">' +
        '<div class="table">' +
        '<div class="cell">Send</div>' +
        "</div>" +
        "</div>";

      document.getElementById("popup-text").innerHTML = "Send Movilennium";
      document.getElementById("popup-container").innerHTML = html;
      document.getElementById("trading-popup").style.display = "block";
    },
    // send mv to bank crob
    sendMVoBank: function () {
      var mv = parseInt(document.getElementById("txt_mv_submit").value);
      if (isNaN(mv)) {
        webJS.showToast("Please enter valid MV");
      }
      if (mv < 0) {
        webJS.showToast("Please enter valid MV");
      } else if (mv <= that.myMov) {
        var params = {
          "my-name": webJS.user_name,
          mv: mv,
        };
        that.myMov = that.myMov - mv;
        document.getElementById("mv").innerHTML = that.myMov;
        document.getElementById("trading-popup").style.display = "none";
        webJS.showToast("Movilennium submitted to CROB");
      } else {
        webJS.showToast("You don't have enough Movilennium");
      }
    },
    myMov: 0,
    // display buy mv section
    buyMV: function () {
      var html =
        '<div style="height: 5%"></div>' +
        '<div class="input-form" style="height: 11%;">' +
        '<select class="input-text" id="txt_mv_buy" style="width: 80%; height: 100%;">' +
        '<option value="">Quantity</option>' +
        '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="3">3</option>' +
        "</select></div>" +
        '<div class="separator"></div>' +
        '<div class="input-form" style="height: 10%;">Price : ' +
        webJS.movPrice +
        " Cronos / 1MV</div>" +
        '<div class="input-form" style="height: 10%;">Remaining Cronos : ' +
        webJS.credits +
        " Cronos</div>" +
        '<div class="separator"></div>' +
        '<div class="button" id="buy-mv-pop">' +
        '<div class="table">' +
        '<div class="cell">BUY</div>' +
        "</div>" +
        "</div>";

      document.getElementById("popup-text").innerHTML = "Buy MV";
      document.getElementById("popup-container").innerHTML = html;
      document.getElementById("trading-popup").style.display = "block";
    },
    // buy mv
    buyMVPop: function () {
      var quantity = parseInt(document.getElementById("txt_mv_buy").value);
      if (quantity == "" || quantity < 1 || isNaN(quantity)) {
        webJS.showToast("Please select quantity");
        return false;
      }
      if (webJS.credits >= webJS.movPrice * quantity) {
        that.myMov += quantity;
        that.manageCredits("sub", webJS.movPrice * quantity);
        webJS.showToast("MV purchased successfully");
        document.getElementById("mv").innerHTML = that.myMov;
        that.buyMV();
      } else {
        webJS.showToast("You don't have enough cronos");
      }
    },
    // section to manage credits
    manageCredits: function (type, credit) {
      if (type == "add") {
        webJS.credits = webJS.credits + parseInt(credit);
      } else if (type == "sub") {
        webJS.credits = webJS.credits - parseInt(credit);
      }
      document.getElementById("credits").innerHTML = webJS.credits;
      document.getElementById("credits").style.webkitTransition = "0.3s";
      document.getElementById("credits").style.webkitTransform =
        "scale(1.5,1.5)";
      setTimeout(function () {
        document.getElementById("credits").style.webkitTransform = "scale(1,1)";
      }, 200);
    },
    devPoints: 0,
    // display buy dev points popup
    buyDevPoints: function () {
      var html =
        '<div style="height: 5%"></div>' +
        '<div class="input-form" style="height: 11%;">' +
        '<select class="input-text" id="txt_credits_submit" style="width: 80%; height: 100%;">' +
        '<option value="">Quantity</option>' +
        '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="3">3</option>' +
        "</select>" +
        "</div>" +
        '<div class="separator"></div>' +
        '<div class="input-form" style="height: 10%;">' +
        "Price : 100 Cronos / 1 Dev Point" +
        "</div>" +
        '<div class="input-form" style="height: 10%;">' +
        "Remaining Cronos : " +
        webJS.credits +
        " Cronos" +
        "</div>" +
        '<div class="separator"></div>' +
        '<div class="button" id="buy-dev-points-pop">' +
        '<div class="table">' +
        '<div class="cell">BUY</div>' +
        "</div>" +
        "</div>";

      document.getElementById("popup-text").innerHTML = "Buy Dev Points";
      document.getElementById("popup-container").innerHTML = html;
      document.getElementById("trading-popup").style.display = "block";
    },
    // buy dev points
    buyDevPointsPop: function () {
      var quantity = parseInt(
        document.getElementById("txt_credits_submit").value
      );
      if (quantity == "") {
        webJS.showToast("Please select quantity");
        return false;
      }
      if (webJS.credits >= quantity * 100) {
        that.devPoints += quantity;
        that.manageCredits("sub", quantity * 100);
        webJS.showToast("Dev points purchased successfully");
        document.getElementById("dp").innerHTML = that.devPoints;
        that.buyDevPoints();
      } else {
        webJS.showToast("You don't have enough cronos");
      }
    },
    // displays trade section
    showTrade: function () {
      clearInterval(keyurJS.tradeInterval);
      var html =
        '<div class="header">' +
        '<div class="table">' +
        '<div class="cell font-16">Buy From Others</div>' +
        "</div>" +
        "</div>";

      for (var trade in that.harvestTrade) {
        for (var harvest in that.harvestTrade[trade]) {
          if (that.harvestTrade[trade][harvest]["status"] == "pending") {
            var good =
              webJS.tileMap[that.harvestTrade[trade][harvest]["harvest"]];
            var price = that.harvestTrade[trade][harvest]["price"];
            var name = that.harvestTrade[trade][harvest]["my-name"];
            var id = that.harvestTrade[trade][harvest]["my-id"];
            var index = that.harvestTrade[trade][harvest]["index"];
            var quantity = that.harvestTrade[trade][harvest]["yield"];

            html +=
              '<div class="deals-container-section">' +
              '<div class="text float-left">' +
              '<div class="table">' +
              '<div class="cell font-14">' +
              "Purchase " +
              quantity +
              " " +
              good +
              " From " +
              name +
              " For " +
              price +
              " Cronos" +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="button-section accept-trade float-left" data-trade="' +
              trade +
              '" data-harvest="' +
              harvest +
              '">' +
              '<div class="button">' +
              '<div class="table">' +
              '<div class="cell font-14">' +
              "Accept" +
              "</div>" +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="button-section decline-trade float-left" data-trade="' +
              trade +
              '" data-harvest="' +
              harvest +
              '">' +
              '<div class="button">' +
              '<div class="table">' +
              '<div class="cell font-14">' +
              "Decline" +
              "</div>" +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="clear"></div>' +
              "</div>";
          }
        }
      }
      document.getElementById("right-container").innerHTML = html;
      keyurJS.tradeInterval = setInterval(function () {
        keyurJS.showTrade();
      }, 5000);
    },
    // accepting the trade
    acceptTrade: function () {
      var trade = $(this).attr("data-trade");
      var harvest = $(this).attr("data-harvest");
      if (that.harvestTrade[trade][harvest]["status"] == "pending") {
        var price = parseInt(that.harvestTrade[trade][harvest]["price"]);
        if (parseInt(price) <= webJS.credits && price > -1) {
          var harvestName = that.harvestTrade[trade][harvest]["harvest"];
          var index = that.harvestTrade[trade][harvest]["index"];
          var friend_id = that.harvestTrade[trade][harvest]["my-id"];
          var quantity = that.harvestTrade[trade][harvest]["yield"];
          that.harvestTrade[trade][harvest]["status"] = "accepted";
          var my_id = webJS.id;

          that.manageCredits("sub", price);
          webJS.totalHarvest[webJS.harvestCount] = {
            cost: price,
            expiryTime: 0,
            seconds: 175,
            percent: 100,
            status: "complete",
            yield: quantity,
            tileName: harvestName,
            week: 5,
          };

          webJS.goods[harvestName] += quantity;
          keyurJS.goodsHUD();
          // console.log(that.totalHarvest);

          webJS.deHarvestTimer("", webJS.harvestCount);
          webJS.harvestCount++;
          var params = {
            index: parseInt(index),
            price: price,
            harvestName: harvestName,
            friend_id: friend_id,
            my_id: my_id,
          };

          $(this).parents(".deals-container-section")[0].remove();
        } else {
          webJS.showToast("You don't have enough cronos");
        }
      } else {
        webJS.showToast("It seems harvest is sold or spoilt");
      }
    },
    // when sub tribe accepts users traded item
    tradeAcceptedBySubTribe: function (data) {
      // console.log(data);
      var index = data["index"];
      webJS.totalHarvest[index]["status"] = "sold";
      webJS.goods[data["harvestName"]] -= webJS.totalHarvest[index]["yield"];
      that.manageCredits("add", parseInt(data["price"]));
      clearInterval(webJS.totalHarvest[index]["interval"]);
      var params = {
        index: data["index"],
        harvest: webJS.totalHarvest[index]["tileName"],
        "my-name": webJS.user_name,
        key: "sold",
      };
      keyurJS.goodsHUD();

    },
    // declining the trade
    declineTrade: function () {
      var trade = $(this).attr("data-trade");
      var harvest = $(this).attr("data-harvest");
      $(this).parents(".deals-container-section")[0].remove();
      that.harvestTrade[trade][harvest]["status"] = "declined";
    },
    // updating the goods HUD section on dashboard
    goodsHUD: function () {
      var goods = $(".menu_gap [data-type]");
      for (var i = 0; i < goods.length; i++) {
        var type = $(goods[i]).attr("data-type");
        if (webJS.goods[type] < 0) {
          webJS.goods[type] = 0;
        }
        $(goods[i]).html(webJS.goods[type]);
      }
    },
    // display my harvest section
    myHarvests: function () {
      clearInterval(keyurJS.tradeInterval);
      var html =
        '<div class="header">' +
        '<div class="table">' +
        '<div class="cell font-16">View and Sell Harvests</div>' +
        "</div>" +
        "</div>";

      html +=
        '<div class="deals-container">' +
        '<div class="deals-container-section" style="height: 13%;">' +
        '<div class="goods float-left">' +
        '<div class="table">' +
        '<div class="cell font-14">' +
        "Resource" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="harvest float-left">' +
        '<div class="table">' +
        '<div class="cell font-14">Quantity</div>' +
        "</div>" +
        "</div>" +
        '<div class="expiry float-left">' +
        '<div class="table">' +
        '<div class="cell font-14">' +
        "Expires In" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="actions float-left">' +
        '<div class="table">' +
        '<div class="cell font-14">Action</div>' +
        "</div>" +
        "</div>" +
        '<div class="clear"></div>' +
        "</div>" +
        '<div class="data-container" id="data-container">';

      for (var i = 0; i < webJS.totalHarvest.length; i++) {
        if (
          webJS.totalHarvest[i]["status"] == "complete" ||
          webJS.totalHarvest[i]["status"] == "on sale"
        ) {
          var expiryTime = webJS.totalHarvest[i]["expiryTime"];
          var quantity = webJS.totalHarvest[i]["yield"];
          var totalExpiryTime = 3 * 7 * webJS.sec_days;
          var days = Math.round(
            (totalExpiryTime - expiryTime) / webJS.sec_days
          );
          var weeks = days / 7;
          // console.log(weeks);
          var good = webJS.totalHarvest[i]["tileName"];
          if (weeks > 0 && quantity > 0) {
            html +=
              '<div class="deals-container-section">' +
              '<div class="goods float-left">' +
              '<div class="table">' +
              '<div class="cell font-14">' +
              webJS.tileMap[good] +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="harvest float-left">' +
              '<div class="table">' +
              '<div class="cell font-14">' +
              quantity +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="expiry float-left">' +
              '<div class="table">' +
              '<div class="cell font-14">' +
              (weeks < 1 ? days + " Days" : Math.round(weeks) + " Weeks") +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="actions float-left">' +
              '<div class="button">' +
              '<div class="table">' +
              '<div data-index="' +
              i +
              '" class="cell font-14 harvest-sell-item">' +
              "Sell" +
              "</div>" +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="clear"></div>' +
              "</div>";
          } else {
            if (weeks < 0) {
              clearInterval(webJS.totalHarvest[i]["interval"]);
            }

            if (quantity <= 0) {
              webJS.totalHarvest[i]["status"] = "delivered";
            }
          }
        }
      }
      html += "</div>";
      document.getElementById("right-container").innerHTML = html;

      keyurJS.tradeInterval = setInterval(function () {
        keyurJS.myHarvests();
      }, 5000);
    },
    // on clicking on sell user is ask to select user whom he wants to sell
    selectFriendsToSell: function (index) {
      // console.log(index);
      var html =
        '<div class="input-form">' +
        '<select class="input-text" id="dd_select_friends" style="width: 80%; height: 100%;">' +
        '<option value="">Select Team Member</option>';

      for (var user in webJS.users) {
        var id = webJS.users[user]["id"];
        if (id != "" && id != webJS.id) {
          html += '<option value="' + id + '">' + user + "</option>";
        }
      }

      html +=
        "</select>" +
        "</div>" +
        '<div class="separator"></div>' +
        '<div class="input-form">' +
        '<input class="input-text" type="tel" id="txt_price" placeholder="Enter Price" value="0" style="width: 80%; height: 100%;">' +
        "</div>" +
        '<div class="separator"></div>' +
        '<div class="input-form">' +
        "Quantity : " +
        webJS.totalHarvest[index]["yield"] +
        "</div>" +
        '<div class="separator"></div>' +
        '<div class="button harvest-sell-it-to-friend" data-index=' +
        index +
        ">" +
        '<div class="table">' +
        '<div class="cell">' +
        "Sell" +
        "</div>" +
        "</div>" +
        "</div>";

      document.getElementById("popup-text").innerHTML = "Sell Harvest";
      document.getElementById("popup-container").innerHTML = html;
      document.getElementById("trading-popup").style.display = "block";
    },
    harvestSellItem: function () {
      that.selectFriendsToSell($(this).attr("data-index"));
    },
    // selling harvest to friend
    sellItToFriend: function () {
      var index = $(this).attr("data-index");
      var price = parseInt($("#txt_price").val());
      var friend = $("#dd_select_friends").val();

      if (price >= 0 && friend != "") {
        if (
          webJS.totalHarvest[index]["status"] == "complete" ||
          webJS.totalHarvest[index]["status"] == "on sale"
        ) {
          var param = {
            index: index,
            price: price,
            friend_id: friend,
            harvest: webJS.totalHarvest[index]["tileName"],
            "my-id": webJS.id,
            yield: webJS.totalHarvest[index]["yield"],
            "my-name": webJS.user_name,
          };
          webJS.totalHarvest[index]["status"] = "on sale";
          document.getElementById("trading-popup").style.display = "none";
        } else {
          webJS.showToast("It seems that harvest is spoilt or sold");
        }
      } else {
        webJS.showToast("Please select sub tribe and enter valid price");
      }
    },
    // bountry hunter offer pop
    getImmune: function () {
      var html = "";
      if (that.isSubmitted == false) {
        html =
          '<div class="header">' +
          '<div class="table">' +
          '<div class="cell font-16">Bounty Hunter Says:</div>' +
          "</div>" +
          "</div>" +
          '<div class="bounty-hunter-text">' +
          '<div class="table">' +
          '<div class="cell font-14">' +
          "Hey, I've had my eye on you for a while. I want to run an opportunity by you. Basically, I have a connection that gives me access to an alteration for two people - me and possibly you? But It'll Cost Two Movelliniums. How about we work together? If you can get me 2 Movelliniums I can get you out of this rat race. We can skip the line and evolve!" +
          "</div>" +
          "</div>" +
          "</div>" +
          '<div class="bounty-hunter button" id="bounty-hunter-submit-mv">' +
          '<div class="table">' +
          '<div class="cell font-14">' +
          "SUBMIT MOVILENNIUMS" +
          "</div>" +
          "</div>" +
          "</div>";

        document.getElementById("right-container").innerHTML = html;
      } else {
        html +=
          '<div class="header">' +
          '<div class="table">' +
          '<div class="cell font-16">Bounty Hunter</div>' +
          "</div>" +
          "</div>" +
          '<div class="awaiting-genetic-study">' +
          '<div class="table">' +
          '<div class="cell font-18">Awaiting Genetic Study Completion...</div>' +
          "</div>" +
          "</div>" +
          '<div class="genetic-bar">' +
          '<div class="genetic-inner-bar" id="genetic-inner-bar" style="width: 0%">' +
          "</div>" +
          "</div>";
        document.getElementById("right-container").innerHTML = html;
        setTimeout(function () {
          document.getElementById("genetic-inner-bar").style.width =
            that.bountyCompletionRate + "%";
        }, 10);
      }
    },
    // submitting mv to bounty hunter
    bountySubmitMV: function () {
      if (that.myMov >= 2) {
        var params = {
          mvs: 2,
        };
        that.myMov = that.myMov - 2;
        document.getElementById("mv").innerHTML = that.myMov;
        that.isSubmitted = true;
        setTimeout(function () {
          that.getImmune();
        }, 300);
      } else {
        webJS.showToast("You don't have enough MVs");
      }
    },
    bountyCompletionRate: 0,
    isSubmitted: false,
    // receiving the bounty completion ratio
    getCompletionRate: function (data) {
      // console.log(data);
      that.bountyCompletionRate = data["percentage"];
    },
    // open my deliveries section
    myDeliveries: function () {
      var html =
        '<div class="header">' +
        '<div class="table">' +
        '<div class="cell font-16">Completed Deliveries to Chief</div>' +
        "</div>" +
        "</div>" +
        '<div class="deals-container-section" style="height: 13%;">' +
        '<div class="my-del float-left">' +
        '<div class="table">' +
        '<div class="cell font-14">Goods</div>' +
        "</div>" +
        "</div>" +
        '<div class="my-del float-left">' +
        '<div class="table">' +
        '<div class="cell font-14">Qty Delivered</div>' +
        "</div>" +
        "</div>" +
        '<div class="clear"></div>' +
        "</div>" +
        '<div class="data-container" id="data-container">';
      for (var i = 0; i < webJS.deliveredData.length; i++) {
        var good = webJS.tileMap[webJS.deliveredData[i]["harvest"]];
        var quantity = webJS.deliveredData[i]["quantity"];

        html +=
          '<div class="deals-container-section">' +
          '<div class="my-del float-left">' +
          '<div class="table">' +
          '<div class="cell font-14">' +
          good +
          "</div>" +
          "</div>" +
          "</div>" +
          '<div class="my-del float-left">' +
          '<div class="table">' +
          '<div class="cell font-14">' +
          quantity +
          "</div>" +
          "</div>" +
          "</div>" +
          '<div class="clear"></div>' +
          "</div>";
      }
      html += "</div>";
      document.getElementById("right-container").innerHTML = html;
    },
    handleOnClickCronos: function () {
      that.showTrading();
      $(".menu-section").removeClass("active");
      $(".menu-section1").removeClass("active");
      $("#trading-section6").addClass("active");
      that.showTransferCredits()
    },
    handleOnClickMovellenium: function () {
      that.showTrading()
      $(".menu-section").removeClass("active");
      $(".menu-section1").removeClass("active");
      $("#trading-section5").addClass("active");
      that.showCrobs()
    },
    // displays corb section
    showCrobs: function () {
      var html =
        '<div class="header">' +
        '<div class="table">' +
        '<div class="cell font-16">' +
        "Send MV/Cronos To Your CROB Account" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="bank-container">' +
        "This is where you send your Movilenniums to C.R.O.B. (Center for Research on Organic Biominerals)" +
        "</div>";
      document.getElementById("right-container").innerHTML = html;
    },
    // close trading popup
    closePopup: function () {
      document.getElementById("trading-popup").style.display = "none";
    },
    // show trading screen
    showTrading: function (type) {
      if (type == "immune") {
        that.getImmune();
        $(".menu-section").removeClass("active");
        $("#trading-section7").addClass("active");
      } else if (type == "trade") {
        that.showTrade();
        $(".menu-section").removeClass("active");
        $("#trading-section2").addClass("active");
      } else {
        document.getElementById("bank-trading").style.display = "block";
        console.log("dass",that)
        that.showMarket();
      }
    },
    // close trade screen
    closeTrading: function () {
      document.getElementById("bank-trading").style.display = "none";
    },
    harvestTrade: {},
    // receiving the trade from other sub tribes
    getTradeHarvest: function (data) {
      // console.log('harvest ', data);
      if (typeof that.harvestTrade[data["my-name"]] != "object") {
        // console.log("in");
        that.harvestTrade[data["my-name"]] = {};
      }
      that.harvestTrade[data["my-name"]][data["index"]] = data;
      that.harvestTrade[data["my-name"]][data["index"]]["status"] = "pending";
      // console.log(that.harvestTrade);
      var text =
        data["my-name"] +
        " Wants to trade " +
        webJS.tileMap[data["harvest"]] +
        " with you for " +
        data["price"] +
        " Cronos";
      $("#trade-offer-text").html(text);
      $(".tradeListPopup").show();
    },
    // goods expired section
    goodsExpired: function (data) {
      // console.log(data);
      data["index"] = parseInt(data["index"]);
      if (typeof that.harvestTrade[data["my-name"]] != "undefined") {
        if (
          typeof that.harvestTrade[data["my-name"]][data["index"]] !=
          "undefined"
        ) {
          if (
            that.harvestTrade[data["my-name"]][data["index"]]["status"] !=
              "spoil" ||
            that.harvestTrade[data["my-name"]][data["index"]]["status"] !=
              "sold"
          ) {
            that.harvestTrade[data["my-name"]][data["index"]]["status"] =
              data["key"];
          } else {
            // console.log("third ", that.harvestTrade[data['my-name']][data['index']]['status']);
          }
        } else {
          // console.log("second ", that.harvestTrade[data['my-name']][data['index']]);
        }
      } else {
        // console.log("first ", that.harvestTrade[data['my-name']]);
      }
    },
  };
  setTimeout(function () {
    //webJS.user_name = "keyur";
    //keyurJS.showTrading();
    //document.getElementById("bank-trading").style.display = "block";
  }, 300);
  //webJS.sec_days = 5;
})(window, document);
