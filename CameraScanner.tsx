
import React, { useRef, useState, useEffect } from 'react';

interface CameraScannerProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        onCapture(canvasRef.current.toDataURL('image/jpeg'));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md aspect-[3/4] bg-slate-800 rounded-3xl overflow-hidden border-4 border-white/20">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* UI Overlays */}
        <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none">
           <div className="w-full h-full border-2 border-dashed border-rose-500/50 rounded-2xl"></div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <button onClick={capture} className="w-20 h-20 rounded-full border-4 border-white bg-rose-500 flex items-center justify-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30"></div>
          </button>
          <div className="w-12 h-12"></div> {/* Spacer */}
        </div>
      </div>
      <p className="text-white/60 text-sm mt-6 font-medium">Position the garment within the frame</p>
    </div>
  );
};

export default CameraScanner;
