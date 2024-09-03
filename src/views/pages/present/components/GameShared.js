import axios from "axios";
import { getSocketIO } from 'src/services/socketHandler';

let that, socket, reconnect, port;
let socketEndpoint = `${process.env.REACT_APP_SOCKET_ENDPOINT}`;

let deviceDetails = [];
let startGame = false;

let j = 0;
let i = "";
let diff = "";
let first = "";
let second = "";
let third = "";
let fourth = "";
let name1 = "";
let name2 = "";
let name3 = "";
let name4 = "";
let currentUserData = "";
let daysLeft;
let secDays;
let days;

const GameShared = async (gamePort) =>
{
    if (gamePort) {
        socket = await getSocketIO(socketEndpoint, gamePort);
        getOns();

        // currentWindow.$("#btnSkip").on("click", that.SkipGame);
        // currentWindow.$("#next-btn").click(that.openDemoReflections);
    }
};

function Logout()
{
    socket.disconnect();
}

function getOns()
{
    socket.on("connected", function (data)
    {
        console.log("GameShared.js : CONNECTED");


        var params = {
            id: data.id,
            type: "presentation",
        };
        console.log(params);


        if (reconnect && startGame)
        {
            emitContent("server-resume-startGameTimer", {
                ...params,
                days: daysLeft,
            });
            console.log({...params, days: daysLeft});
        }
        else
        {
            console.log("strated and grtting user type ");
            emitContent("server-get-user-type", params);
        }
    });


    // socket.on("disconnect", function ()
    // {
    //     if (localStorage.getItem("daysLeft") != 0)
    //     {
    //         socket.connect();
    //     }
    // });


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


    socket.on("connect_error", async function () {
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


    // socket.on("reconnect", function ()
    // {
    //     // Re Connect Error
    //     reconnect = true;
    //     // currentWindow.$("#imgInactive").show();
    //     // currentWindow.$("#imgActive").hide();
    // });


    socket.on("send-user-to-presentation", ShowConnectedUser);
    socket.on("get-rooms", SetRoom);
    // that.socket.on("refresh-page-all", that.refreshPage);
    // that.socket.on("refresh-shared-page", that.instantRefreshPage);
    // that.socket.on("presentation-my-turn", that.changeTurns);
    socket.on("days-left", DaysLefts);
    // that.socket.on("strike-calamity", that.strikeCalamity);
    socket.on("commence-game", ShowDashboard);
    socket.on("initialize-data", SetupGame);
    // that.socket.on("tribe-value", that.setTribeValue);
    // that.socket.on("production-quality", that.setProductQuality);
    // that.socket.on("presentation-buy-tile", that.buyTile);
    // that.socket.on("tribe-credits", that.tribeCredits);
    // that.socket.on("tribe-mov", that.tribeMov);
    // that.socket.on("average-week-and-cost", that.weekCost);
    // that.socket.on("prepare-commence-game", that.commenceGame);
    // that.socket.on("game-over", that.gameOver);
    // that.socket.on("play-video", that.playVideo);
    // that.socket.on("resume-game", that.resumeGame);
    // that.socket.on("play-vr", that.playIntroVR);
    // that.socket.on("badge-highlight", that.badgeHighLight);
    // that.socket.on("lose-type", that.loseType);
};

function SetupGame(data)
{
    secDays = data["setup"]["sec_days"];
    days = data["setup"]["days"];
}

function ShowDashboard(data)
{
    startGame = true;
    // currentWindow.$("#please-wait").hide();
    // currentWindow.$("#join-rrom").hide();
    // currentWindow.$(".join-rrom").hide();
    // currentWindow.$(".main").show();
    // addCloseEvent();
}

function DaysLefts(data)
{
    daysLeft = data["days_left"];
    // currentWindow.$("#days-left")
    //     .fadeOut(500, function ()
    //     {
    //         currentWindow.$("#days-left").html(data["days_left"]);
    //     })
    //     .fadeIn(500);
    if (j == 0)
    {
        i = daysLeft;
        j = 1;
        diff = i / 4;
        first = Math.round(i - diff);
        second = Math.round(first - diff);
        third = Math.round(second - diff);
        fourth = 0;
    }

    localStorage.setItem("daysLeft", daysLeft);
}

function SetRoom(data)
{
    // currentWindow.$("#please-wait").hide();
    // currentWindow.$("#join-rrom").show();
    // currentWindow.$("#roomName").html(data["room-name"]);
    // currentWindow.$("#gameName").html(data["room-name"]);
    name1 = data["room-name"];
    // that.pieChart();
    // that.barChart();
}

function emitContent(key, object)
{
    socket.emit(key, object);
}

function ShowConnectedUser(data)
{
    if (data != null)
    {
        deviceDetails.push(data);
        console.log(data["name"]);
        console.log(deviceDetails.length);
    }
}

export default { GameShared, Logout };
