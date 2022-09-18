import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import food from "./assets/applePixels.png";
import monitor from "./assets/oldMonitor.png";
import useInterval from "./utils/useInterval";

const canvasX = 1000;
const canvasY = 1000;
const initialSnake = [
  [4, 10],
  [4, 10],
];
const initialApple = [14, 10];
const scale = 50;
const timeDelay = 100;

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState(initialSnake);
  const [apple, setApple] = useState(initialApple);
  const [direction, setDirection] = useState([0, -1]);
  const [delay, setDelay] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const checkCollision = (head: number[]) => {
    for (let i = 0; i < head.length; i++) {
      if (head[i] < 0 || head[i] * scale >= canvasX) return true;
    }
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) return true;
    }
    return false;
  };

  const appleAte = (newSnake: number[][]) => {
    let coord = apple.map(() => Math.floor((Math.random() * canvasX) / scale));
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = coord;
      setScore(score + 1);
      setApple(newApple);
      return true;
    }
    return false;
  };

  const setScoreHandler = () => {
    if (score > Number(localStorage.getItem("snakeScore"))) {
      localStorage.setItem("snakeScore", JSON.stringify(score));
    }
  };

  const runGame = () => {
    const newSnake = [...snake];
    const newSnakeHead = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];
    newSnake.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) {
      setDelay(null);
      setGameOver(true);
      setScoreHandler();
    }
    if (!appleAte(newSnake)) {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  useInterval(() => runGame(), delay);

  useEffect(() => {
    let fruit = document.getElementById("fruit") as HTMLCanvasElement;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "#a3d001";
        snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
        ctx.drawImage(fruit, apple[0], apple[1], 1, 1);
      }
    }
  }, [snake, apple, gameOver]);

  const playHandler = () => {
    setSnake(initialSnake);
    setApple(initialApple);
    setDirection([1, 0]);
    setDelay(timeDelay);
    setScore(0);
    setGameOver(false);
  };

  function directionHandler(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowLeft":
        setDirection([-1, 0]);
        break;
      case "ArrowUp":
        setDirection([0, -1]);
        break;
      case "ArrowRight":
        setDirection([1, 0]);
        break;
      case "ArrowDown":
        setDirection([0, 1]);
        break;
    }
  }

  return (
    <div onKeyDown={(event) => directionHandler(event)}>
      <img id="fruit" src={food} alt="fruit" width="30" />
      <img src={monitor} alt="monitor" width="4000" className="monitor" />
      <canvas
        className="play-area"
        ref={canvasRef}
        width={`${canvasX}px`}
        height={`${canvasY}px`}
      />
      {gameOver && <div className="game-over">Game Over</div>}
      <button className="play-button" onClick={playHandler}>
        Play
      </button>
      <div className="score-box">
        <h2>Score: {score}</h2>
        <h2>High Score: {localStorage.getItem("snakeScore")}</h2>
      </div>
    </div>
  );
};

export default App;
