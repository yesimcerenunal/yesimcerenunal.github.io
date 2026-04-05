import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function GestureControl() {
  const { messages } = useLanguage();
  const [isGestureEnabled, setIsGestureEnabled] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isGestureEnabled) {
      // Request webcam access
      navigator.mediaDevices
        .getUserMedia({ video: { width: 160, height: 120 } })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.log("Webcam access denied:", err);
        });
    } else {
      // Stop all video tracks
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isGestureEnabled]);

  if (!isGestureEnabled) return null;

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex items-start gap-3">
      {/* Webcam Feed */}
      <div className="relative rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-40 h-30 object-cover grayscale"
        />
      </div>
      
      {/* Control Button */}
      <button
        onClick={() => setIsGestureEnabled(false)}
        className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <X className="w-4 h-4" />
        {messages.layout.gestureControlOff}
      </button>
    </div>
  );
}
