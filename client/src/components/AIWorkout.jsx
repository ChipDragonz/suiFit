import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl'; 
import { motion } from "framer-motion";

const TARGET_REP = 3; 
// 👇 GIỚI HẠN FPS: 15 khung hình/giây là đủ để tập Squat mượt mà
const FPS_LIMIT = 1000 / 15; 

function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  return angle > 180 ? 360 - angle : angle;
}

const AIWorkout = ({ onSessionUpdate, isProcessing }) => {
  const webcamRef = useRef(null);
  const detectorRef = useRef(null);
  const requestRef = useRef(null);
  const lastTimestampRef = useRef(0); // 👇 Theo dõi thời gian khung hình cuối
  const countRef = useRef(0); 
  const squatStateRef = useRef("UP"); 
  const isCooldownRef = useRef(false); 

  const [displayCount, setDisplayCount] = useState(0);
  const [feedback, setFeedback] = useState("INITIALIZING AI..."); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const initAI = async () => {
      try {
        await tf.ready();
        // Dùng SINGLEPOSE_LIGHTNING để nhẹ máy nhất có thể
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet, 
          { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
        );
        if (isMounted) {
          detectorRef.current = detector;
          setIsLoading(false);
          setFeedback("READY TO TRAIN...");
          detectPose(performance.now()); // Bắt đầu vòng lặp
        }
      } catch (err) {
        if (isMounted) setFeedback("CAMERA ERROR");
      }
    };
    initAI();
    return () => { 
      isMounted = false; 
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (detectorRef.current) detectorRef.current.dispose(); // Giải phóng bộ nhớ AI
    };
  }, []);

  const detectPose = async (timestamp) => {
    // 👇 CHIẾN THUẬT NGHỈ NGƠI: Nếu chưa tới 66ms (15 FPS) thì thoát sớm
    if (timestamp - lastTimestampRef.current < FPS_LIMIT) {
      requestRef.current = requestAnimationFrame(detectPose);
      return;
    }
    lastTimestampRef.current = timestamp;

    if (isProcessing || isCooldownRef.current) {
      requestRef.current = requestAnimationFrame(detectPose);
      return;
    }

    if (webcamRef.current?.video?.readyState === 4 && detectorRef.current) {
      // Dùng tf.engine().tidy để tự động dọn rác bộ nhớ sau mỗi lần tính toán Pose
      const poses = await detectorRef.current.estimatePoses(webcamRef.current.video);
      
      if (poses && poses.length > 0) {
        const k = poses[0].keypoints;
        if (k[11].score > 0.4 && k[13].score > 0.4 && k[15].score > 0.4) {
          const angle = calculateAngle(k[11], k[13], k[15]);

          if (angle < 100 && squatStateRef.current === "UP") {
            squatStateRef.current = "DOWN";
            setFeedback("HOLD POSITION! ⬇️");
          } 
          else if (angle > 160 && squatStateRef.current === "DOWN") {
            squatStateRef.current = "UP";
            countRef.current += 1;
            setDisplayCount(countRef.current);
            setFeedback("GOOD FORM! 🔥");

            if (countRef.current >= TARGET_REP) {
              isCooldownRef.current = true;
              setFeedback("SET COMPLETE! 🔥");
              onSessionUpdate(); 

              setTimeout(() => {
                countRef.current = 0;
                setDisplayCount(0);
                isCooldownRef.current = false;
                setFeedback("READY FOR NEXT SET!");
              }, 3000);
            }
          }
        } else {
          setFeedback("STEP BACK 📷");
        }
      }
    }
    requestRef.current = requestAnimationFrame(detectPose);
  };

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border-2 border-lime-500/10">
      <Webcam ref={webcamRef} className="absolute inset-0 w-full h-full object-cover opacity-60" mirrored={true} />
      
      {/* AI OVERLAY */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="bg-black/80 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
            <span className="text-4xl font-black text-lime-400">{displayCount}</span>
            <span className="text-gray-500 ml-2 font-bold">/ {TARGET_REP}</span>
          </div>
          <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md text-xl font-black italic text-white uppercase">{feedback}</div>
        </div>

        <div className="w-full bg-white/5 h-3 rounded-full border border-white/5 overflow-hidden backdrop-blur-sm">
          <motion.div 
            className="h-full bg-gradient-to-r from-lime-400 to-emerald-600" 
            animate={{ width: `${(displayCount / TARGET_REP) * 100}%` }} 
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lime-500 font-black tracking-widest text-xs uppercase animate-pulse">Loading AI Model...</p>
        </div>
      )}
    </div>
  );
};

export default AIWorkout;