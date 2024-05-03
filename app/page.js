"use client";

import "./globals.css";

import { useEffect, useState } from "react";

import { Tile } from "./components/Tile";

export default function Home() {
  const gameData = {
    data: {
      1: {
        title: "Letters of the alphabet",
        difficulty: 1,
        items: ["A", "B", "C", "D"],
      },
      2: {
        title: "Animals",
        difficulty: 2,
        items: ["Aardvark", "Zebra", "Giraffe", "Elephant"],
      },
      3: {
        title: "Planets",
        difficulty: 3,
        items: ["Earth", "Mars", "Jupiter", "Saturn"],
      },
      4: {
        title: "Elements",
        difficulty: 4,
        items: ["Iron", "Gold", "Silver", "Mercury"],
      },
    },
  };

  const [allItemsArray, setAllItemsArray] = useState([]);
  const [boardReady, setBoardReady] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [deselect, setDeselected] = useState(false);
  const [solvedGroups, setSolvedGroups] = useState([]);
  const [mistakes, setMistakes] = useState(4);
  const [gameover, setGameover] = useState(false);
  const [rating, setRating] = useState();

  const updateBoard = () => {
    let tempArr = [];

    for (const [a, b] of Object.entries(gameData)) {
      if (a === "data") {
        for (const [c, d] of Object.entries(b)) {
          if (!solvedGroups.includes(c)) {
            for (let i = 0; i < d["items"].length; i++) {
              let val = d["items"][i];
              if (tempArr.includes(val) === false) tempArr.push(val);
            }
          }
        }
      }
    }

    setAllItemsArray(shuffle(tempArr));
  };

  function compareArrays() {
    let missCount = 0;

    for (const [a, b] of Object.entries(gameData)) {
      if (a === "data") {
        for (const [c, d] of Object.entries(b)) {
          let tempArrA = d["items"].sort();
          let tempArrB = selectedItems.sort();

          if (JSON.stringify(tempArrA) === JSON.stringify(tempArrB)) {
            setSolvedGroups([...solvedGroups, c]);
            updateBoard();
          } else {
            missCount++;
          }

          deselectAll();
        }
      }
    }

    if (missCount === 4) {
      setMistakes(mistakes - 1);
    }
  }

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const deselectAll = () => {
    setSelectedItems([]);
    setDeselected(true);
  };

  const displayMisses = () => {
    return [...Array(mistakes).keys()].map((key) => (
      <span className="mistakes" key={key}></span>
    ));
  };

  useEffect(() => {
    updateBoard();
  }, []);

  useEffect(() => {
    if (allItemsArray.length === 16) {
      setBoardReady(true);
    }
  }, [allItemsArray]);

  useEffect(() => {
    setSelectedCount(selectedItems.length);
  }, [selectedItems]);

  useEffect(() => {
    updateBoard();

    if (mistakes === 4) {
      setRating("Perfect");
    } else if (mistakes === 3) {
      setRating("Great");
    } else if (mistakes === 2) {
      setRating("Good");
    } else if (mistakes === 1) {
      setRating("Phew");
    }

    if (solvedGroups.length === 4) {
      setGameover(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solvedGroups]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24 pt-16">
      {gameover && rating ? <span className="alert">{rating}</span> : ""}

      <header className="mb-8">
        <p>Create four groups of four!</p>
      </header>
      <>
        {boardReady ? (
          <ul className="gameboard">
            {solvedGroups.map(function (group) {
              let label;

              switch (Object.entries(gameData)[0][1][group]["difficulty"]) {
                case 1:
                  label = "lvl1";
                  break;
                case 2:
                  label = "lvl2";
                  break;
                case 3:
                  label = "lvl3";
                  break;
                case 4:
                  label = "lvl4";
                  break;
              }

              return (
                <li
                  key={group}
                  className={`tile-row ${label} flex flex-col items-center justify-center uppercase text-sm`}
                >
                  <span className="font-bold">
                    {Object.entries(gameData)[0][1][group]["title"]}
                  </span>
                  <span>
                    {Object.entries(gameData)[0][1]
                      [group]["items"].sort()
                      .map(function (item) {
                        return <i key={item}>{`${item}, `}</i>;
                      })}
                  </span>
                </li>
              );
            })}
            {allItemsArray.map(function (data) {
              return (
                <Tile
                  key={data}
                  data={data}
                  deselect={deselect}
                  selectedCount={selectedCount}
                  setDeselected={setDeselected}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
              );
            })}
          </ul>
        ) : (
          <p>Loading</p>
        )}
      </>
      <div
        className={`scoring flex gap-2 py-6 items-center ${
          gameover ? "disabled" : ""
        }`}
      >
        Mistakes remaining: {displayMisses()}
      </div>
      <div className="controls flex gap-2 py-6">
        {gameover ? (
          <button className="button">View results</button>
        ) : (
          <>
            <button className="button" onClick={updateBoard}>
              Shuffle
            </button>
            <button
              className="button"
              disabled={selectedCount === 0 ? "disabled" : ""}
              onClick={deselectAll}
            >
              Deselect all
            </button>
            <button
              className="button filled"
              disabled={selectedCount < 4 ? "disabled" : ""}
              onClick={compareArrays}
            >
              Submit
            </button>
          </>
        )}
      </div>
      <span className="text-xs text-gray-500">
        Built with React/Next.js, deployed on Vercel, code on{" "}
        <a
          href="https://github.com/kunalbhat/connections-clone"
          target="_blank"
          className="text-blue-500 hover:text-blue-700 hover:underline"
        >
          Github
        </a>
        .
      </span>
    </main>
  );
}
