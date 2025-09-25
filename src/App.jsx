import { useState } from "react";
import Block from "./Block.jsx";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  const rows = 20;
  const cols = 20;
  const startPoint = [0, 0];
  const endPoint = [rows - 1, cols - 1];

  const makeEmptyGrid = () =>
    Array.from({ length: rows }, () => Array(cols).fill(0));

  const [maze, setMaze] = useState(makeEmptyGrid());
  const [speed, setSpeed] = useState(50);
  const [finalPath, setFinalPath] = useState([]);

  const handleReset = () => {
    setMaze(makeEmptyGrid());
    setFinalPath([]);
  };

  // -------- DFS -----------
  const handleDFS = async (mat, i, j, path = []) => {
    const R = mat.length,
      C = mat[0].length;
    if (
      i < 0 ||
      j < 0 ||
      i >= R ||
      j >= C ||
      mat[i][j] === -1 ||
      mat[i][j] === 1
    )
      return false;

    const newPath = [...path, [i, j]];

    if (i === R - 1 && j === C - 1) {
      setFinalPath(newPath);
      return true;
    }

    mat[i][j] = -1;
    setMaze(mat.map((r) => r.slice()));
    await sleep(120 - speed);

    if (
      (await handleDFS(mat, i + 1, j, newPath)) ||
      (await handleDFS(mat, i - 1, j, newPath)) ||
      (await handleDFS(mat, i, j + 1, newPath)) ||
      (await handleDFS(mat, i, j - 1, newPath))
    )
      return true;

    mat[i][j] = 0;
    setMaze(mat.map((r) => r.slice()));
    await sleep(120 - speed);
    return false;
  };

  // -------- BFS -----------
  const handleBFS = async (mat) => {
    const R = mat.length,
      C = mat[0].length;
    const visited = Array.from({ length: R }, () => Array(C).fill(false));
    const prev = Array.from({ length: R }, () => Array(C).fill(null));
    const queue = [[startPoint[0], startPoint[1]]];

    while (queue.length) {
      const [i, j] = queue.shift();

      if (
        i < 0 ||
        j < 0 ||
        i >= R ||
        j >= C ||
        visited[i][j] ||
        mat[i][j] === 1
      )
        continue;

      visited[i][j] = true;
      mat[i][j] = -1;
      setMaze(mat.map((r) => r.slice()));
      await sleep(120 - speed);

      if (i === R - 1 && j === C - 1) break;

      const dirs = [
        [i + 1, j],
        [i - 1, j],
        [i, j + 1],
        [i, j - 1],
      ];
      for (let [x, y] of dirs) {
        if (
          x >= 0 &&
          y >= 0 &&
          x < R &&
          y < C &&
          !visited[x][y] &&
          mat[x][y] !== 1
        ) {
          queue.push([x, y]);
          prev[x][y] = [i, j];
        }
      }
    }

    // reconstruct path
    const path = [];
    let curr = [R - 1, C - 1];
    while (curr) {
      path.push(curr);
      curr = prev[curr[0]][curr[1]];
    }
    path.reverse();
    if (path[0][0] === startPoint[0] && path[0][1] === startPoint[1])
      setFinalPath(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Pathfinding Visualizer
      </h1>
      <p className="mb-4 text-gray-700 text-center">
        Click on any block to create/remove obstacles. <br />
        Use the speed slider to control the animation speed.
      </p>

      <div className="flex gap-2 justify-center mb-4 flex-wrap">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={async () => {
            setFinalPath([]);
            await handleDFS(
              maze.map((r) => r.slice()),
              0,
              0
            );
          }}
        >
          DFS
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={async () => {
            setFinalPath([]);
            await handleBFS(maze.map((r) => r.slice()));
          }}
        >
          BFS
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          onClick={handleReset}
        >
          Reset
        </button>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={speed}
          className="accent-indigo-600 ml-2"
          onChange={(e) => setSpeed(+e.target.value)}
        />
      </div>

      <div className="grid grid-cols-20 gap-0.5">
        {maze.map((row, i) =>
          row.map((cell, j) => (
            <Block
              key={`${i}-${j}`}
              i={i}
              j={j}
              startPoint={startPoint}
              endPoint={endPoint}
              currPos={cell}
              finalPath={finalPath}
              onClick={() => {
                const temp = maze.map((r) => r.slice());
                temp[i][j] = temp[i][j] === 1 ? 0 : 1;
                setMaze(temp);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
