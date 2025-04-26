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
    "lemon",
    "mango",
    "noble",
    "ocean",
    "piano",
    "query",
    "rider",
    "sable",
    "table",
    "uncle",
    "vital",
    "waltz",
    "xenon",
    "yacht",
    "zebra"
    // Add more words to this list!
];

const App = () => {
    const [solution, setSolution] = useState("");
    const [guesses, setGuesses] = useState(Array(6).fill(null));
    const [currentGuess, setCurrentGuess] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameWon, setIsGameWon] = useState(false);
    const keyboardRef = useRef(null); // Ref for the keyboard container

    useEffect(() => {
        const handleType = (event) => {
            if (isGameOver || !solution) {
                return;
            }

            let key = '';
             if (event.type === 'keydown') {
                key = event.key;
             } else if (event.type === 'click') {
                key = event.target.textContent.toLowerCase();
             }

            if (key === "enter") {
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
                    setIsGameOver(true);
                    setIsGameWon(false);
                }
            } else if (key === "backspace") {
                setCurrentGuess(currentGuess.slice(0, -1));
                return;
            } else if (/^[a-zA-Z]$/.test(key)) {
                if (currentGuess.length < 5) {
                    setCurrentGuess((oldGuess) => oldGuess + key);
                }
            }
        };

        window.addEventListener("keydown", handleType);
        // Use keyboardRef.current to add the event listener
        if (keyboardRef.current) {
          keyboardRef.current.addEventListener("click", handleType);
        }

        return () => {
            window.removeEventListener("keydown", handleType);
             if (keyboardRef.current) {
                keyboardRef.current.removeEventListener("click", handleType);
             }
        };
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
    };

    const keyboardRows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace']
    ];

    if (!solution) {
        return <div>Loading...</div>;
    }

    return (
        <div className="board">
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
            {/* On-Screen Keyboard */}
            <div className="keyboard" ref={keyboardRef}>
                {keyboardRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="keyboard-row">
                        {row.map(key => (
                            <div
                                key={key}
                                className={`key ${key === 'enter' || key === 'backspace' ? 'wide-key' : ''}`}
                                textContent={key} // Use textContent to store the key value
                            >
                                {key === 'enter' ? 'Enter' : key === 'backspace' ? '⌫' : key}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
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
