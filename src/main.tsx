import React, {useEffect, useRef} from "react";
import "./main.css";

const ppro = require("premierepro");

export const App = () => {
  return (
    <div className="app">
      <h1>Animation Composer</h1>
      <button onClick={loadData}>Load Data</button>
    </div>
  );
};

async function loadData() {
  const project = await ppro.Project.getActiveProject();
  if (!project) {
    console.log("No active project found");
    return;
  }

  const sequence = await project.getActiveSequence();
  if (!sequence) {
    console.log("No active sequence found");
    return;
  }
  console.log("sequence", sequence);

  const videoTrack = await sequence.getVideoTrack(0);
  console.log("video track", videoTrack);
}