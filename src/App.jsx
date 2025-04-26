import React, { useEffect, useState, useRef } from "react";
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
  // Add more words to this list!
];

const App = () => {
  const [solution, setSolution] = useState(""); // random word to guess
  const [guesses, setGuesses] = useState(Array(6).fill(null)); // array with 6 values
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [previousSolution, setPreviousSolution] = useState("");
  const inputRef = useRef(null);

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
          setMessage("You Win!");
        } else if (newGuesses[5] !== null) { // All guesses used
          setIsGameOver(true);
          setMessage(`You Lose! The word was: ${solution}`);
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
        setCurrentGuess((oldGuess) => oldGuess + event.key.toLowerCase());
      }
    };
    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, isGameOver, solution, guesses]);

  // Focus input on mobile devices
  const handleBoardClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Get a random word that wasn't the previous solution
  const getRandomWord = () => {
    let availableWords = wordList.filter(word => word !== previousSolution);
    if (availableWords.length === 0) {
      availableWords = [...wordList]; // fallback to all words if needed
    }
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex];
  };

  // Initialize or restart the game
  const startNewGame = () => {
    setPreviousSolution(solution); // Store current solution before changing
    const newSolution = getRandomWord();
    setSolution(newSolution);
    setGuesses(Array(6).fill(null));
    setCurrentGuess("");
    setIsGameOver(false);
    setMessage("");
    // Focus input on mobile after restart
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  // Initialize the game
  useEffect(() => {
    startNewGame();
  }, []);

  if (!solution) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-container">
      <h1>Guess the word!</h1>
      <div className="board" onClick={handleBoardClick}>
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
      </div>

      {/* Hidden input for mobile keyboard */}
      <input
        ref={inputRef}
        type="text"
        value={currentGuess}
        // **REMOVED THE onChange HANDLER HERE**
        style={{ position: 'absolute', opacity: 0, height: 0 }}
        maxLength={5}
      />

      {/* Game message */}
      {message && <div className="game-message">{message}</div>}

      {/* Restart button */}
      <button className="restart-button" onClick={startNewGame}>
        Restart
      </button>
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