import React, {useEffect, useRef, useState} from "react";
import "./main.css";

const ppro = require("premierepro");

export const App = () => {
  const [editableClips, setEditableClips] = useState<EditableClip[]>([]);

  function loadData() {
    getEditableClips().then(setEditableClips).catch(err => console.error(err));
  }

  return (
    <div className="app">
      <h1>Animation Composer</h1>
      <button onClick={loadData}>Load Data</button>

      {editableClips.map(editableClip => (
        <div key={editableClip.name}>
          <h2>{editableClip.name}</h2>
          {editableClip.params.map(param => (
            <div key={param.name}>
              {param.name}: {JSON.stringify(param.keyframe.value)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

interface Param {
  name: string;
  keyframe: any;
}

interface EditableClip {
  name: string;
  params: Param[];
  trackItem: any;
  component: any;
}

async function getEditableClips() {
  const project = await ppro.Project.getActiveProject();
  if (!project) {
    console.log("No active project found");
    return [];
  }

  const sequence = await project.getActiveSequence();
  if (!sequence) {
    console.log("No active sequence found");
    return [];
  }

  const result: EditableClip[] = [];

  const numVideoTracks = await sequence.getVideoTrackCount();
  for (let i = 0; i < numVideoTracks; i++) {
    const videoTrack = await sequence.getVideoTrack(i);
    const clips = await videoTrack.getTrackItems(ppro.Constants.TrackItemType.CLIP, false);

    for (const clip of clips) {
      const projectItem = await clip.getProjectItem();
      const components = await clip.getComponentChain();
      const numComponents = components.getComponentCount();

      for (let j = 0; j < numComponents; j++) {
        const component = components.getComponentAtIndex(j);
        if (await component.getMatchName() !== "AE.ADBE Capsule") continue;

        const editableClip: EditableClip = {
          name: projectItem.name,
          trackItem: clip,
          component: component,
          params: [],
        };

        const numParams = await component.getParamCount();
        for (let k = 0; k < numParams; k++) {
          const param = await component.getParam(k);

          editableClip.params.push({
            name: param.displayName,
            keyframe: await param.getStartValue(),
          });
        }

        result.push(editableClip);
      }
    }
  }

  console.log("result", result);

  return result;
}