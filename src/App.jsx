import React, { useEffect, useState } from "react";
import "./App.css";

// Define your list of five-letter words here
const wordList = [
  "apple",
  "beach",
  "chair",
  "dance",
  "earth",
  "fence",
  "grape",
  "happy",
  "image",
  "jumbo",
  "lemon",
  "mango",
  "noble",
  "ocean",
  "piano"
  // Add more words to this list!
];

const App = () => {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false); // Track if the game is won

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver || !solution) {
        return;
      }

      if (event.key === "Enter") {
        if (currentGuess.length !== 5) {
          return;
        }

        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");

        const isCorrect = solution === currentGuess;
        if (isCorrect) {
          setIsGameOver(true);
          setIsGameWon(true);
        } else if (newGuesses.every((guess) => guess !== null)) {
          // Game over, but not won (all guesses used)
          setIsGameOver(true);
          setIsGameWon(false);
        }
      }

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= 5) {
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        if (currentGuess.length >= 5) {
          return;
        }
        setCurrentGuess((oldGuess) => oldGuess + event.key.toLowerCase());
      }
    };
    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, isGameOver, solution, guesses]);

  // to fetch random words (now from the local array)
  useEffect(() => {
    const pickRandomWord = () => {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      setSolution(wordList[randomIndex]);
      setIsGameOver(false);
      setIsGameWon(false);
      setGuesses(Array(6).fill(null));
      setCurrentGuess("");
    };

    pickRandomWord();
  }, []);

    const restartGame = () => {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        setSolution(wordList[randomIndex]);
        setIsGameOver(false);
        setIsGameWon(false);
        setGuesses(Array(6).fill(null));
        setCurrentGuess("");
    }

  return (
    <div className="board">
    <h1>Guess the word</h1>
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex((val) => val == null);
        return (
          <Line
            key={i}
            guess={isCurrentGuess ? currentGuess : guess ?? ""}
            isFinal={!isCurrentGuess && guess != null}
            solution={solution}
          />
        );
      })}
      {isGameOver && (
        <div className="game-over-message">
          <p>
            {isGameWon
              ? "Congratulations! You won!"
              : `Game Over! The word was ${solution}.`}
          </p>
          <button onClick={restartGame}>Restart Game</button>
        </div>
      )}
    </div>
  );
};

const Line = ({ guess, isFinal, solution }) => {
  const tiles = [];

  for (let i = 0; i < 5; i++) {
    const char = guess[i];
    let className = "tile";
    if (isFinal && solution) {
      if (char?.toLowerCase() === solution[i]?.toLowerCase()) {
        className += " correct";
      } else if (solution.toLowerCase().includes(char?.toLowerCase())) {
        className += " close";
      } else {
        className += " incorrect";
      }
    }
    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }
  return <div className="line">{tiles}</div>;
};

export default App;
