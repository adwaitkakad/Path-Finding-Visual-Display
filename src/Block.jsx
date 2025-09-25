export default function Block({
  i,
  j,
  startPoint,
  endPoint,
  currPos,
  finalPath,
  onClick,
}) {
  const isPath = finalPath.some(([x, y]) => x === i && y === j);

  let bgColor = "";
  if (i === startPoint[0] && j === startPoint[1]) bgColor = "bg-green-400";
  else if (i === endPoint[0] && j === endPoint[1]) bgColor = "bg-red-400";
  else if (isPath) bgColor = "bg-yellow-400";
  else if (currPos === -1) bgColor = "bg-blue-400";
  else if (currPos === 1) bgColor = "bg-black";

  return (
    <div
      onClick={onClick}
      className={`w-6 h-6 m-0.5 border rounded-sm cursor-pointer ${bgColor} transition-colors duration-300`}
    />
  );
}
