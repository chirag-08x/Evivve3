import axios from "axios";
import store from "../../../../store/Store";
import { setGameLobbyPlayers } from "src/store/apps/present/PresentSlice";
import { getSocketIO } from "src/services/socketHandler";
import SafeSocketProvider from "src/services/safeSocketProvider";

var that;

let serverIP = `${process.env.REACT_APP_EVIVVE_DOCKER_APP}`;
let socketEndpoint = `${process.env.REACT_APP_SOCKET_ENDPOINT}`;

let serverGetUserDetails = serverIP + "/api/otherusers/user/";
let serverGetScheduledPrograms = serverIP + "/api/isProgramsScheduled/";
let serverSetTrackingInfo = serverIP + "/api/addTrackingInfo";

let port;

let socket;

export const getSocket = () => socket;

async function GameAdmin(gamePort) {
  // function initialize()
  // {
  if (gamePort) {
    that = this;
    socket = await getSocketIO(socketEndpoint, gamePort);
    socket.on("alert-new-user", AlertNewUser);
    console.log("[CONNECTING TO SOCKET]");

    SafeSocketProvider.initiate();
    getOns();
  }

  // }

  function AlertNewUser(response) {
    console.log("ANU", response);
    store.dispatch(setGameLobbyPlayers(response.devices));

    // Object.values(response.devices).forEach((device) => {
    //   console.log("DEVIVE", device);
    // });

    // for (let i = 0; i < Object.keys(response.devices).length; i++)
    // {
    //     if (response.devices[Object.keys(response.devices)[i]].id === null)
    //     {
    //         document.getElementById("alert_icon_waiting").style.display =
    //             "inline-block";
    //         document.getElementById("alert_icon_waiting_control").style.display =
    //             "inline-block";
    //         i = Object.keys(response.devices).length;
    //     }
    // }
  }
}

function Logout()
{
  emitContent("refresh-page", {});
  // $("#_logoutButton").attr("disabled", "disabled");
  // TODO : Change the URL
  axios
      .post(serverIP + "/api/logout", {code: localStorage.getItem('st_code')})
      .then(function (response)
      {
        socket.disconnect();

        // removeCloseEvent();
        setTimeout(function ()
        {
          localStorage.removeItem("docker_token");
          localStorage.removeItem("user_id");
          // window.location.reload();
        }, 2000);
      })
      .catch(function (error)
      {
        // $("#_logoutButton").attr("disabled", false);
        // $.toast({
        //   heading: "Error",
        //   text: "Log out failed. Please try again.",
        //   showHideTransition: "slide",
        //   icon: "error",
        // });
        console.log("LOGOUT ERROR")
      });
}

function GameSetupData() {
  var params = {
    program_id: localStorage.getItem("program_id")
  };
  emitContent("before-game-start", params);
  emitContent("get-round-setup", params);
}

function emitContent(key, object) {
  socket.emit(key, object);
}

function CreateGame() {
  // createGame
  var gameParams = {
    program_id: localStorage.getItem("program_id"),
    is_dry_run: localStorage.getItem("is_dry_run") === 'true'
  };
  emitContent("before-game-start", gameParams);

  var params = {
    is_dry_run: localStorage.getItem("is_dry_run") === 'true',
    "game-name": localStorage.getItem("tribe_name"),
    "game_id": localStorage.getItem("st_container")
  };
  emitContent("server-create-game", params);

  axios
    .get(serverGetUserDetails + localStorage.getItem("user_id"))
    .then(function (response) {
      console.log(serverGetUserDetails + localStorage.getItem("user_id"));
      console.log(response.data);

      setTimeout(function () {
        localStorage.setItem(
          "isCertified",
          response?.data?.data[0]?.is_Certified
        );
      }, 2000);
    })
    .catch(function (error) {
      console.log("Could not fetch user details!");
    });
  axios
    .get(serverGetScheduledPrograms + localStorage.getItem("user_id"))
    .then(function (response) {
      console.log(serverGetScheduledPrograms + localStorage.getItem("user_id"));
      console.log(response.data);

      if (response.data.data === true) {
        localStorage.setItem("isProgramScheduled", true);
      } else {
        localStorage.setItem("isProgramScheduled", false);
      }

      setTimeout(function () {
        StartGame();
      }, 2000);
    })
    .catch(function (error) {
      console.log("Could not fetch user programs!" + error);
    });
}

function ShowWaitingPlayers() {
  var params = {
    round_name: "demo",
    user_id: localStorage.getItem("user_id"),
  };
  // console.log("paramsshowWaitingPlayers", params);
  emitContent("show-waiting-players", params);
}

function StartGame() {
  // $("#edit_dd_round").prop("disabled", true);
  localStorage.setItem("game_setting", "demo");
  var params = {
    program_id: localStorage.getItem("program_id")
  };
  emitContent("get-round-setup", params);

  // $("#btn-start-game").hide();
  // $(".start-game").hide();
  // $(".pull-players").hide();
  // $("#btn-commence-game").hide();
  // $("#btn-pause-game").show();
  // $("#badges-div").show();
  // $("#before_game_start").hide();

  // $("#gaming_control").show();

  // document.getElementById("alert_icon_waiting").style.display = "none";
  // document.getElementById("alert_icon_waiting_control").style.display =
  //     "none";

  var params1 = {
    program_id: localStorage.getItem("program_id")
  };

  console.log(params1);

  // tempRountName = String(params.round_name);
  axios({
    url: serverSetTrackingInfo,
    method: "POST",
    data: {
      user_id: localStorage.getItem("user_id"),
      program_id: localStorage.getItem("program_id"),
      program_level: "demo",
      tribe_name: localStorage.getItem("tribe_name"),
      code: localStorage.getItem("st_code"),
    },
    responseType: "blob", // important
  }).catch(function (error) {
    // $.toast({
    //     heading: "Error",
    //     text: "Could not track game play!! Please create tribe again.",
    //     showHideTransition: "slide",
    //     icon: "error",
    // });
  });
  // server-commence-game
  // that.emitContent("start-the-game", params);

  emitContent("server-commence-game", params1);
  // $(".tip-5").fadeOut();
  // $('#tip-6-wrapper').fadeIn();
  emitContent("server-start-game");
  // socket.on("updated-users", that.updateUsers);

  // Temp function to get waiting players
  setTimeout(function () {
    ShowWaitingPlayers();
  }, 2000);
}

function getOns() {
  socket.on("connected", function (data) {
    console.log("GameAdmin.js : CONNECTED");
    //TODO: Show code when connected

    // $('#tip-1-wrapper').show();
    var params = {
      id: data.id,
      type: "admin",
      curr: Date.now(),
      is_dry_run: localStorage.getItem("is_dry_run") === 'true',
    };
    console.log(params);
    emitContent("server-get-user-type", params);
  });

  // if (firstLoad === "true") {
  //   localStorage.setItem("isFirstLoad", false);
  //   that.refreshPage();
  // }
  socket.on("reliable-data-devices", function (devices) {
      console.log('reliable-data-devices: ' + devices.length);
      store.dispatch(setGameLobbyPlayers(devices));
  });

  socket.on("disconnect", async function () {
    // Disconnected
    if (localStorage.getItem("daysLeft") != 0) {
      if (localStorage.getItem("in_port") != port) {
        console.log("reconnect from disconnect");

        socket.disconnect();
        socket.io.disconnect();
        socket = await getSocketIO(socketEndpoint, localStorage.getItem("in_port"));
        socket.io.reconnect();

        // that.showTips();
      } else {
        console.log("disconnect");
      }
    }
  });
  socket.on("error", async function () {
    if (localStorage.getItem("daysLeft") != 0) {
      //  Error
      if (localStorage.getItem("in_port") != port) {
        console.log("reconnect from error");

        socket.disconnect();
        socket.io.disconnect();
        socket = await getSocketIO(socketEndpoint, localStorage.getItem("in_port"));
        socket.io.reconnect();

        // that.showTips();
      } else {
        console.log("error");
      }
    }
  });

  socket.on("connect_error", async function (obj) {
      console.log("[connect_error]");
      console.dir(obj);
    // Connect Error
    if (localStorage.getItem("daysLeft") != 0) {
      if (localStorage.getItem("in_port") != port) {
        console.log("reconnect from connect_error");

        socket.disconnect();
        socket.io.disconnect();
        socket = await getSocketIO(socketEndpoint, localStorage.getItem("in_port"));
        socket.io.reconnect();
        // that.showTips();
      } else {
        console.log("connect error");
      }
    }
  });

  socket.on("reconnect_error", async function () {
    if (localStorage.getItem("daysLeft") != 0) {
      if (localStorage.getItem("in_port") != port) {
        console.log("reconnect from reconnect_error");

        socket.disconnect();
        socket.io.disconnect();
        socket = await getSocketIO(socketEndpoint, localStorage.getItem("in_port"));
        socket.io.reconnect();

        // that.showTips();
      } else {
        // Re Connect Error
        console.log("reconnect error");
      }
    }
  });

  // that.socket.on("prepare-commence-game", that.prepareCommenceGame);
  // that.socket.on("game-over", that.gameOver);
  // that.socket.on("strike-calamity", that.calamityStriked);
  // that.socket.on("resume-game", that.resumeGameAfterCalamity);
  socket.on("initialize-data", SetUp);
  socket.on("games-data", Games);
  // socket.on("demo-data", Demo);
  socket.on("waiting-players", WaitingPlayers);
  socket.on("current-round-setup", CurrentRoundSetup);
}

function Games(data) {
  console.log("that.uData", data);
}

function CurrentRoundSetup(response) {
  console.log("currentRoundSetup", response);
  const { setup } = response;

  function calculateTotalMinutes() {
    return ((setup["sec_days"] * 365) / 60).toFixed(2);
  }

  console.log("calculateTotalMinutes", calculateTotalMinutes());
}

function WaitingPlayers(response) {
  // let html = "";
  // $("#waiting-players").empty("");
  // $("#btn-pull-players").prop("disabled", true);
  // $("#btn-pull-players")
  //     .addClass("new_btn_disabled")
  //     .removeClass("new_panel_btn");

  console.log(response);

  for (let i = 0; i < Object.keys(response.devices).length; i++) {
    console.log(
      "response.devices[Object.keys(response.devices)[i]].name",
      response.devices[Object.keys(response.devices)[i]].name
    );
    // if (response.devices[Object.keys(response.devices)[i]].id === null) {
    //     html =
    //         html +
    //         `<p style="
    //       margin: 0px;
    //       border-bottom: 1px solid gray;
    //       padding-bottom: 22px;
    //       width: 122px;
    //       " > ${
    //             response.devices[Object.keys(response.devices)[i]].name
    //         } </p><br/>`;
    //     $("#waiting-empty").hide();
    //     $("#btn-pull-players")
    //         .addClass("new_panel_btn")
    //         .removeClass("new_btn_disabled");
    //
    //     $("#btn-pull-players").prop("disabled", false);
    // }
  }
  // $("#waiting-players").append(html);
}

function SetUp(data) {
  that.usersData = data["users"];
  that.calamityData = data["calamities"];
  that.setupData = data["setup"];
  that.credits = that.setupData["credits"];
  that.days = that.setupData["days"];
  that.sec_days = that.setupData["sec_days"];
  console.log("that.usersData", that.usersData);

  // function calculateTotalMinutes()
  // {
  //     return ((that.setupData["sec_days"] * 365) / 60).toFixed(2);
  // }

  var calamityArray = that.calamityData[0].calamities.split(",");

  var levelArray = that.calamityData[0].calamities_lvl.split(",");

  // let htmlCode = "";
  // let htmlCode2 = "";
  // var demo = calamityArray.forEach((item) =>
  // {
  //     htmlCode =
  //         htmlCode +
  //         `<div style="width: 100%; margin-right: 2%"> <div style="font-size: 15px; margin-top: 7px; margin-bottom: 7px"> Name </div><input disabled placeholder="${item}" maxlength="15" class="inputFieldsInModal" type="number"/> </div>`;
  // });
  //
  // $("#output").empty();
  // $("#output1").empty();
  // $("#output").append(htmlCode);
  //
  // var demo2 = levelArray.forEach((item) =>
  // {
  //     htmlCode2 =
  //         htmlCode2 +
  //         `<div style="width: 100%; margin-right: 2%"> <div style="font-size: 15px; margin-top: 7px; margin-bottom: 7px"> Level </div><input disabled placeholder="${item}" maxlength="15" class="inputFieldsInModal" type="number"/> </div>`;
  // });
  // $("#output1").append(htmlCode2);
  // $("#edit_dd_round").val(that.setupData["round_name"]);
  // $("#cred_per_user").val(that.setupData["credits"]);
  // $("#setup_days").val(that.setupData["days"]);
  // $("#sec_per_day").val(that.setupData["sec_days"]);
  // $("#gap_offers").val(that.setupData["offers"]);
  // $("#offers_rejection").val(that.setupData["offers_rejection"]);
  // $("#setup_mov").val(that.setupData["mov"]);
  // $("#total_minutes").html(calculateTotalMinutes());
}

function Demo(data) {
  let calamityData = data["calamities"];
  let demoData = data["setup"];
  let credits = demoData["credits"];
  let days = demoData["days"];
  let sec_days = demoData["sec_days"];

  function calculateTotalMinutes() {
    return ((demoData["sec_days"] * 365) / 60).toFixed(2);
  }

  // $("#output").empty();
  // $("#output1").empty();
  // $("#edit_dd_round").val(that.demoData["round_name"]);
  // $("#cred_per_user").val(that.demoData["credits"]);
  // $("#setup_days").val(that.demoData["days"]);
  // $("#sec_per_day").val(that.demoData["sec_days"]);
  // $("#gap_offers").val(that.demoData["offers"]);
  // $("#offers_rejection").val(that.demoData["offers_rejection"]);
  // $("#setup_mov").val(that.demoData["mov"]);
  // $("#total_minutes").html(calculateTotalMinutes());

  var calamityArray = that.calamityData[0].calamities.split(",");

  var levelArray = that.calamityData[0].calamities_lvl.split(",");

  console.log("calculateTotalMinutes", calculateTotalMinutes());
  // let htmlCode = "";
  // let htmlCode2 = "";
  // var demo = calamityArray.forEach((item) => {
  //     htmlCode =
  //         htmlCode +
  //         `<div style="width: 100%; margin-right: 2%"> <div style="font-size: 15px; margin-top: 7px; margin-bottom: 7px"> Name </div><input disabled placeholder="${item}" maxlength="15" class="inputFieldsInModal" type="number"/> </div>`;
  // });
  //
  // $("#output").append(htmlCode);
  //
  // var demo2 = levelArray.forEach((item) => {
  //     htmlCode2 =
  //         htmlCode2 +
  //         `<div style="width: 100%; margin-right: 2%"> <div style="font-size: 15px; margin-top: 7px; margin-bottom: 7px"> Level </div><input disabled placeholder="${item}" maxlength="15" class="inputFieldsInModal" type="number"/> </div>`;
  // });
  // $("#output1").append(htmlCode2);
}

export default { GameAdmin, CreateGame, Logout };
