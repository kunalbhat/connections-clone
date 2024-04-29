"use client";

import "./globals.css";

import { useEffect, useState } from "react";

import { Tile } from "./components/Tile";

export default function Home() {
  const [allItemsArray, setAllItemsArray] = useState([]);
  const [boardReady, setBoardReady] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  const gameData = {
    timestamp: "03/27/2024",
    data: {
      group1: {
        title: "Power issues",
        difficulty: 1,
        items: ["spike", "surge", "outage", "short"],
      },
      group2: {
        title: "Summary",
        difficulty: 2,
        items: ["digest", "brief", "outline", "abstract"],
      },
      group3: {
        title: "Trust as real",
        difficulty: 3,
        items: ["accept", "believe", "buy", "swallow"],
      },
      group4: {
        title: "Name homophones",
        difficulty: 4,
        items: ["kneel", "wane", "hairy", "curt"],
      },
    },
  };

  const allItems = () => {
    console.log("loading data...");

    let tempArr = [];

    for (const [a, b] of Object.entries(gameData)) {
      if (a === "data") {
        for (const [c, d] of Object.entries(b)) {
          for (let i = 0; i < d["items"].length; i++) {
            let val = d["items"][i];
            if (tempArr.includes(val) === false) tempArr.push(val);
          }
        }
      }
    }

    setAllItemsArray(tempArr);
  };

  function compareArrays() {
    for (const [a, b] of Object.entries(gameData)) {
      if (a === "data") {
        for (const [c, d] of Object.entries(b)) {
          let tempArrA = d["items"].sort();
          let tempArrB = selectedItems.sort();

          if (JSON.stringify(tempArrA) === JSON.stringify(tempArrB)) {
            console.log(tempArrA, "Match!");
          } else {
            console.log(tempArrA, "No match!");
          }
        }
      }
    }
  }

  useEffect(() => {
    allItems();
  }, []);

  useEffect(() => {
    if (allItemsArray.length === 16) {
      setBoardReady(true);
    }
  }, [allItemsArray]);

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <header className="mb-8">
        <p>Create four groups of four!</p>
        <p>Selected items: {JSON.stringify(selectedItems)}</p>
      </header>
      <>
        {boardReady ? (
          <ul className="gameboard">
            {allItemsArray.map(function (data) {
              return (
                <Tile
                  key={data}
                  data={data}
                  selectedCount={selectedCount}
                  setSelectedCount={setSelectedCount}
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

      <div className="controls py-6">
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
