"use client";

import "./globals.css";

import { useEffect, useState } from "react";

import { Tile } from "./components/Tile";

export default function Home() {
  const gameData = {
    data: {
      1: {
        title: "Power issues",
        difficulty: 1,
        items: ["spike", "surge", "outage", "short"],
      },
      2: {
        title: "Summary",
        difficulty: 2,
        items: ["digest", "brief", "outline", "abstract"],
      },
      3: {
        title: "Trust as real",
        difficulty: 3,
        items: ["accept", "believe", "buy", "swallow"],
      },
      4: {
        title: "Name homophones",
        difficulty: 4,
        items: ["kneel", "wane", "hairy", "curt"],
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

  const updateBoard = () => {
    console.log("loading data...");

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
    for (const [a, b] of Object.entries(gameData)) {
      if (a === "data") {
        for (const [c, d] of Object.entries(b)) {
          let tempArrA = d["items"].sort();
          let tempArrB = selectedItems.sort();

          if (JSON.stringify(tempArrA) === JSON.stringify(tempArrB)) {
            setSolvedGroups([...solvedGroups, c]);
            updateBoard();
            setMistakes(mistakes + 1);
          } else {
            console.log("no match :(");
            // FIX: Bug where it decrements on correct guesses
            setMistakes(mistakes - 1);
          }

          deselectAll();
        }
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solvedGroups]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24">
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
      <div className="misses flex gap-2 py-6">{displayMisses()}</div>
      <div className="controls flex gap-2 py-6">
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
          className="button"
          disabled={selectedCount < 4 ? "disabled" : ""}
          onClick={compareArrays}
        >
          Submit
        </button>
      </div>
    </main>
  );
}
