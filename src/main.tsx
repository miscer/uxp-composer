import React, {useRef} from "react";
import * as videos from "./assets/videos";
import "./main.css";

export const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="app">
      <h1>Animation Composer</h1>

      {Array.from({length: 10}).map((_, i) => (
        <div key={i} style={{display: "flex", flexWrap: "wrap"}}>
          {Object.values(videos).map((video, i) => (
            <video key={i} src={video} width={100} height={80} loop onClick={(event) => event.currentTarget.play()}/>
          ))}
        </div>
      ))}
    </div>
  );
};
