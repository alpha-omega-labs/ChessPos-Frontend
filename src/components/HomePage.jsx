import React, { useState, useEffect } from "react";

import { useMoralis } from "react-moralis";
import Navbar from "../navbar";
import { Link, useNavigate } from "react-router-dom";
import db from "../firebase";
import Games from "./Games";

const socket = require("../connections/socket").socket;

function HomePage() {
  const [gameIdInput, setGameIdInput] = useState("");
  const [found, setFound] = useState(false);
  const { isAuthenticated, account } = useMoralis();
  const [games, setGames] = useState([]);
  let navigate = useNavigate();
  const dummy = [
    21, 21234, 123123, 123, 12, 31, 2312, 3, 23, 23, 23, 2, 32, 3, 234, 3, 425,
    24, 234, 234, 23, 4234, 3, 123, 21, 32, 3, 23, 2, 32, 32, 3, 234, 234,
  ];
  const gameDummy = {
    gameId: 12341,
    winnerAddress: "0x123123asfasfasfasdhfioahoh12oh341o2h4",
    black: "0x123123asfasfasfasdhfioahoh12oh341o2h4",
    white: "0x123123asfasfasfasdhfioahoh12oh341o2h4",
  };
  useEffect(() => {
    socket.on("status", (status) => {
      alert(status);
    });
    socket.once("match found", () => {
      setFound(true);
      //gameFound();
    });
    return () => {
      socket.off("status", () => {});
      socket.off("match found", () => {});
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      db.collection("games")
        .orderBy("time", "desc")
        .where("players", "array-contains", account.toLowerCase())
        .onSnapshot((snapshot) =>
          setGames(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [isAuthenticated, account]);

  useEffect(() => {
    if (found === true) {
      gameFound();
    }
  }, [found]);

  function gameFound() {
    console.log("Game found joining now", gameIdInput);
    window.history.replaceState(null, "", "/joinGame");

    window.history.replaceState({}, document.title);
    navigate("/joinGame", {
      state: {
        gameId: gameIdInput,
      },
    });
  }

  const handleGameIdInput = (event) => {
    setGameIdInput(event.target.value);
    console.log(event.target.value);
  };

  const joinGame = (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      alert("Please connect your wallet first");
      return;
    }
    socket.emit("wantsToJoin", gameIdInput);
    console.log("join game");
  };

  const mainPage = () => {
    return (
      <div className="home-bg2" style={{ height: "100vh" }}>
        <Navbar head="NFT Chess" />

        <div className="joinLobbyMaindiv">
          <div
            style={{
              height: "80vh",
              width: "50%",
              overflowY: "auto",
              marginTop: "2rem",
              marginLeft: "4rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
              padding: "2rem",
            }}
          >
            {games.map((game) => {
              return <Games game={game} account={account} />;
            })}
          </div>

          <div
            style={{
              width: "30rem",
              height: "auto",
              float: "right",
              position: "absolute",
              right: "4rem",
              top: "15rem",
            }}
          >
            <section
              className="wallContent"
              style={{
                position: "relative",
                transform: "scale(1.3)",

                width: "20rem",
                height: "13rem",
                bottom: "8rem",
                right: "4rem",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "1.8rem",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  position: "relative",
                  bottom: "1.5rem",
                }}
              >
                Join a Lobby
              </span>
              <br />
              <br />

              <form onSubmit={(e) => joinGame(e, gameIdInput)}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "relative",
                    bottom: "1rem",
                  }}
                >
                  <input
                    type="text"
                    style={{
                      padding: "0.2rem 0.5rem",
                      fontSize: "1.2rem",
                      margin: "10px",
                      background: "rgba(26, 28, 32, 0.75)",
                      position: "relative",
                      bottom: "4rem",
                      height: "2.5rem",
                      borderRadius: "0.5rem",
                    }}
                    placeholder="Game Id"
                    value={gameIdInput}
                    onChange={handleGameIdInput}
                  />
                  <input
                    type="submit"
                    value="Join Game"
                    style={{
                      margin: "10px",
                      background: "rgba(26, 28, 32, 0.75)",
                      position: "relative",
                      bottom: "4.5rem",
                      height: "3rem",
                      width: "10rem",
                      left: "3.3rem",
                      cursor: "pointer",
                      borderRadius: "2rem",
                      fontSize: "1.4rem",
                      paddingTop: "8px",
                    }}
                  />
                </div>
              </form>
            </section>
            <div style={{ position: "relative", right: "4rem" }}>
              <span
                style={{
                  color: "white",
                  fontSize: "2rem",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  position: "relative",
                  bottom: "3rem",
                  left: "13rem",
                }}
              >
                OR
              </span>
              <Link to="/createGame">
                <section
                  className="wallContent2"
                  style={{
                    position: "relative",
                    top: "0.2rem",

                    width: "30rem",
                    height: "6rem",
                    bottom: "8rem",
                  }}
                >
                  <span style={{ fontSize: "2.5rem" }}>Play a Match</span>
                </section>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <div>{mainPage()}</div>;
}

export default HomePage;
