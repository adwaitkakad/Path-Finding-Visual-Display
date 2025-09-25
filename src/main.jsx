import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <div className="flex items-center justify-center min-h-screen bg-gray-200  ">
      <App />
    </div>
  </>
);
