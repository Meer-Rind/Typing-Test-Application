import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  // Sample paragraphs for the typing test
  const paragraphs = [
    "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet. Typing practice helps improve your speed and accuracy over time.",
    "Programming is the art of telling another human what one wants the computer to do. Good code is its own best documentation. As you're about to add a comment, ask yourself, 'How can I improve the code so that this comment isn't needed?'",
    "The journey of a thousand miles begins with a single step. Persistence is the key to success in any endeavor. Whether you're learning to type or mastering a new skill, consistent practice will lead to improvement.",
    "Nature is painting for us, day after day, pictures of infinite beauty. The sunrise and sunset, the changing seasons, and the diversity of life all remind us of the wonder that surrounds us every day.",
    "Technology is best when it brings people together. In our digital age, the ability to communicate effectively through writing and typing has become more important than ever before."
  ];

  const [currentParagraph, setCurrentParagraph] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const inputRef = useRef(null);

  // Select a random paragraph when component mounts or when test is reset
  useEffect(() => {
    resetTest();
  }, []);

  // Update timer if test is in progress
  useEffect(() => {
    let interval;
    if (testStarted && !testComplete) {
      interval = setInterval(() => {
        setTimeElapsed(((Date.now() - startTime) / 1000).toFixed(1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [testStarted, testComplete, startTime]);

  // Calculate WPM and accuracy when user input changes
  useEffect(() => {
    if (userInput.length === 1 && !testStarted) {
      setTestStarted(true);
      setStartTime(Date.now());
    }

    if (userInput.length === currentParagraph.length) {
      calculateResults();
      setTestComplete(true);
    }
  }, [userInput]);

  const resetTest = () => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    setCurrentParagraph(paragraphs[randomIndex]);
    setUserInput('');
    setStartTime(null);
    setTimeElapsed(0);
    setWpm(0);
    setAccuracy(0);
    setTestComplete(false);
    setTestStarted(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const calculateResults = () => {
    const words = currentParagraph.split(' ').length;
    const timeInMinutes = timeElapsed / 60;
    const calculatedWpm = Math.round(words / timeInMinutes);
    setWpm(calculatedWpm);

    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentParagraph[i]) {
        correctChars++;
      }
    }
    const calculatedAccuracy = ((correctChars / currentParagraph.length) * 100).toFixed(1);
    setAccuracy(calculatedAccuracy);
  };

  const handleInputChange = (e) => {
    if (!testComplete) {
      setUserInput(e.target.value);
    }
  };

  // Highlight the current character being typed
  const renderHighlightedText = () => {
    return currentParagraph.split('').map((char, index) => {
      let className = '';
      if (index < userInput.length) {
        className = userInput[index] === char ? 'correct' : 'incorrect';
      }
      if (index === userInput.length && !testComplete) {
        className = 'current';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="app">
      <header>
        <h1>Typing Speed Test</h1>
        <p>Measure your typing speed in words per minute (WPM)</p>
      </header>

      <div className="test-container">
        <div className="paragraph-display">
          {renderHighlightedText()}
        </div>

        <textarea
          ref={inputRef}
          className="typing-input"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          disabled={testComplete}
          autoFocus
        />

        <div className="stats-container">
          <div className="stat-box">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeElapsed}s</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Speed</span>
            <span className="stat-value">{wpm} WPM</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
        </div>

        {testComplete && (
          <button className="reset-button" onClick={resetTest}>
            Try Again
          </button>
        )}
      </div>

      <footer>
        <p>Created by Meer-Rind</p>
        <a 
          href="https://github.com/Meer-Rind" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
        >
          <svg height="24" viewBox="0 0 16 16" width="24" fill="currentColor">
            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default App;