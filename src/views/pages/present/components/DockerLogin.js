import axiosClient from "../../../../utils/axios";
import GameAdmin from "./GameAdmin";

const userID = localStorage.getItem("userId");
console.log(userID);
const autoserverLoginUrl = `${process.env.REACT_APP_EVIVVE_DOCKER_APP}/api/otherusers/automate`;
console.log(autoserverLoginUrl);

export let isAuthDone = false;
let isError = false;
let authData = null;

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const getProgramCode = async (gamitarIP, body) => {
  try {
    const x = await axiosClient().post(
      `${gamitarIP}/api/validateProgramRandomCode`,
      JSON.stringify(body),
      config
    );
    console.log("testing if this api is firing");
    const data = x.data.user;
    console.log(data);
    // $("#loader").show();
    localStorage.setItem(
      "userFullName",
      `${data.first_name} ${data.last_name}`
    );
    localStorage.setItem("email", data.email);
    // auth({ id: userID, token: data.token }, autoserverLoginUrl);
    return data;
  } catch (error) {
    throw new Error(`APP-SIDE BACKEND ERROR : ${error}`);
  }
};

const serverLogin = async (userID, token, programSessId) => {
  try {
    const resp = await axiosClient().post(autoserverLoginUrl, {
      id: userID,
      session: programSessId,
      token,
    });
    if (resp.data.data.token) {
      // APP CODE IN data
      console.log(resp.data.data);

      console.log(
        `PORT : ${resp.data.data.in_port}\nGAME CODE: ${resp.data.data.st_code}`
      );

      console.log(resp.data.data.in_port);

      isAuthDone = true;
      // alert(data.data.in_port);

      // TODO: This request is going to fail, but container will get deleted
      // axios
      //   .get(serverIP + ":" + data.data.in_port + "/restart")
      //   .then(function (response) {
      //     console.log(response);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
      // authData = resp.data;
      afterAuthDone(resp.data);
    }
    return resp;
  } catch (error) {
    // isError = true;
    // afterAuthFail();
    throw new Error(`GAME-SIDE DOCKER BACKEND ERROR : ${error}`);
  }
};

const DockerLogin = async (programSessId, teamName) => {
  console.log(teamName);
  localStorage.setItem("tribe_name", teamName);
  try {
    if (userID) {
      //const body = { userID, sessionKey: "demoHost" };
      //const gamitarIP = `${process.env.REACT_APP_GAMITAR_BACKEND}`;

      //The /validateProgramRandomCode doesnt really make sense. Removing this for now.
      //There has to be a better and DIFFERENT way to add security to game access.
      const programCodedata = {}; //await getProgramCode(gamitarIP, body);
      const serverData = await serverLogin(
        userID,
        programCodedata?.token,
        programSessId
      );

      return { programCodedata, serverData };
    }
  } catch (error) {
    throw new Error(error);
  }
};

function afterAuthDone(data) {
  if (isAuthDone) {
    localStorage.setItem("st_container", data.data.st_container);
    localStorage.setItem("container_id", data.data.container_id);
    localStorage.setItem("user_id", data.data.id);
    localStorage.setItem("st_code", data.data.st_code);
    localStorage.setItem("in_port", data.data.in_port);
    // that.socket = io(serverIP + ":" + localStorage.getItem("in_port"));
    localStorage.setItem("st_ip", data.data.st_ip);
    localStorage.setItem("docker_token", data.data.token);
    // localStorage.setItem("program_id", params.program_id);

    setTimeout(async function () {
      await GameAdmin.GameAdmin(data.data.in_port);
    }, 5000);

    // await GameAdmin.GameAdmin(data.data.in_port);
    // await GameShared(data.data.in_port);
  }
}
export default DockerLogin;
