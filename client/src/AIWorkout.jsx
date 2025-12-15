import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

/* ========= TÍNH GÓC ========= */
function calculateAngle(a, b, c) {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) -
    Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  return angle > 180 ? 360 - angle : angle;
}

const TARGET_REP = 3;

const AIWorkout = ({ onWorkoutComplete }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const poseRef = useRef(null);
  const cameraRef = useRef(null);

  const repCountRef = useRef(0);
  const isSquattingRef = useRef(false);
  const squatStartRef = useRef(null);
  const workoutDoneRef = useRef(false);

  const [repUI, setRepUI] = useState(0);

  /* ================== STOP TẤT CẢ ================== */
  const stopAll = () => {
    cameraRef.current?.stop();
    cameraRef.current = null;

    poseRef.current?.close();
    poseRef.current = null;

    if (webcamRef.current?.video?.srcObject) {
      webcamRef.current.video.srcObject
        .getTracks()
        .forEach((t) => t.stop());
    }
  };

  /* ================== INIT POSE + CAMERA ================== */
  const initPoseCamera = () => {
    if (!webcamRef.current?.video || poseRef.current) return;

    poseRef.current = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    poseRef.current.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    poseRef.current.onResults((results) => {
      if (
        workoutDoneRef.current ||
        !results.poseLandmarks ||
        !canvasRef.current
      )
        return;

      const video = webcamRef.current.video;
      if (!video || video.readyState !== 4) return;

      const w = video.videoWidth;
      const h = video.videoHeight;

      canvasRef.current.width = w;
      canvasRef.current.height = h;

      const ctx = canvasRef.current.getContext("2d");
      ctx.save();
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(results.image, 0, 0, w, h);

      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 4,
      });
      drawLandmarks(ctx, results.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });

      const hip = results.poseLandmarks[23];
      const knee = results.poseLandmarks[25];
      const ankle = results.poseLandmarks[27];

      if (
        hip.visibility < 0.6 ||
        knee.visibility < 0.6 ||
        ankle.visibility < 0.6
      ) {
        ctx.restore();
        return;
      }

      const angle = calculateAngle(hip, knee, ankle);

      if (angle < 100) {
        if (!squatStartRef.current)
          squatStartRef.current = performance.now();

        if (
          performance.now() - squatStartRef.current > 350 &&
          !isSquattingRef.current
        ) {
          isSquattingRef.current = true;
        }
      } else if (angle > 165) {
        squatStartRef.current = null;

        if (isSquattingRef.current) {
          isSquattingRef.current = false;
          repCountRef.current += 1;
          setRepUI(repCountRef.current);

          if (repCountRef.current === TARGET_REP) {
            workoutDoneRef.current = true;
            stopAll(); // 🔥 QUAN TRỌNG
            onWorkoutComplete?.(TARGET_REP);
          }
        }
      }

      ctx.restore();
    });

    cameraRef.current = new Camera(webcamRef.current.video, {
      width: 640,
      height: 480,
      onFrame: async () => {
        if (!workoutDoneRef.current && poseRef.current) {
          await poseRef.current.send({
            image: webcamRef.current.video,
          });
        }
      },
    });

    cameraRef.current.start();
  };

  /* ================== EFFECT ================== */
  useEffect(() => {
    repCountRef.current = 0;
    isSquattingRef.current = false;
    squatStartRef.current = null;
    workoutDoneRef.current = false;

    initPoseCamera();
    
    /* 🔁 AUTO RESUME KHI QUAY LẠI TAB */
    const handleVisibility = () => {
      if (
        document.visibilityState === "visible" &&
        !workoutDoneRef.current
      ) {
        initPoseCamera();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      stopAll();
    };
  }, [onWorkoutComplete]);

  /* ================== UI ================== */
  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2 style={{ fontSize: 48, color: "#ff5722" }}>
        {repUI} / {TARGET_REP}
      </h2>

      <div
        style={{
          position: "relative",
          width: 640,
          height: 480,
          margin: "0 auto",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          style={{
            position: "absolute",
            width: 640,
            height: 480,
            left: 0,
            top: 0,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            width: 640,
            height: 480,
            left: 0,
            top: 0,
            border: "4px solid #00FF00",
            borderRadius: 8,
          }}
        />
      </div>
    </div>
  );
};

export default AIWorkout;
