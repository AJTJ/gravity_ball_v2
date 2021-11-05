import { Engine, Scene } from "@babylonjs/core";
import React, { useEffect, useRef } from "react";
import "./SceneComponent.css";

const SceneComponent = (props) => {
  const reactCanvas = useRef(null);
  const {
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    sceneKey,
    ...rest
  } = props;

  useEffect(() => {
    if (reactCanvas.current) {
      const engine = new Engine(
        reactCanvas.current,
        antialias,
        engineOptions,
        adaptToDeviceRatio
      );
      let scene = new Scene(engine, sceneOptions);
      const gameRestart = () => {
        console.log("restart");
        scene.dispose();
      };

      console.log({ scene });

      if (scene.isReady()) {
        props.onSceneReady(scene, gameRestart);
      } else {
        scene.onReadyObservable.addOnce((scene) =>
          props.onSceneReady(scene, gameRestart)
        );
      }

      engine.runRenderLoop(() => {
        if (typeof onRender === "function") {
          onRender(scene);
        }
        scene.render();
      });

      const resize = () => {
        scene.getEngine().resize();
      };

      if (window) {
        window.addEventListener("resize", resize);
      }

      return () => {
        scene.getEngine().dispose();

        if (window) {
          window.removeEventListener("resize", resize);
        }
      };
    }
  }, [reactCanvas, sceneKey]);

  return <canvas ref={reactCanvas} {...rest} />;
};

export default SceneComponent;
