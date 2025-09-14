import React, { useRef, useState, useCallback } from 'react';
import { Camera, Smile, Frown, Meh, Heart } from 'lucide-react';

interface FacialExpressionAnalyzerProps {
  onMoodDetected: (mood: string, confidence: number) => void;
  onClose: () => void;
}

const FacialExpressionAnalyzer: React.FC<FacialExpressionAnalyzerProps> = ({ onMoodDetected, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedMood, setDetectedMood] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  }, []);

  const analyzeExpression = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple facial expression analysis based on color patterns
    // In a real implementation, this would use machine learning models
    const analysis = analyzeFacialExpression(data, canvas.width, canvas.height);
    
    setDetectedMood(analysis.mood);
    setConfidence(analysis.confidence);
    setIsAnalyzing(false);
    
    onMoodDetected(analysis.mood, analysis.confidence);
  }, [onMoodDetected]);

  const analyzeFacialExpression = (data: Uint8ClampedArray, width: number, height: number) => {
    // Simplified analysis - in reality, this would use ML models
    let totalBrightness = 0;
    let pixelCount = 0;
    
    // Sample center region (face area)
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const sampleSize = Math.min(width, height) * 0.3;
    
    for (let y = centerY - sampleSize/2; y < centerY + sampleSize/2; y += 4) {
      for (let x = centerX - sampleSize/2; x < centerX + sampleSize/2; x += 4) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const index = (y * width + x) * 4;
          const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
          totalBrightness += brightness;
          pixelCount++;
        }
      }
    }
    
    const avgBrightness = totalBrightness / pixelCount;
    
    // Determine mood based on brightness and other factors
    let mood = 'neutral';
    let confidence = 0.6;
    
    if (avgBrightness > 180) {
      mood = 'great';
      confidence = 0.8;
    } else if (avgBrightness > 140) {
      mood = 'good';
      confidence = 0.7;
    } else if (avgBrightness > 100) {
      mood = 'neutral';
      confidence = 0.6;
    } else {
      mood = 'struggling';
      confidence = 0.7;
    }
    
    return { mood, confidence };
  };

  const capturePhoto = () => {
    setIsAnalyzing(true);
    setTimeout(analyzeExpression, 1000); // Simulate analysis time
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'great': return <Smile className="h-8 w-8 text-yellow-500" />;
      case 'good': return <Heart className="h-8 w-8 text-green-500" />;
      case 'neutral': return <Meh className="h-8 w-8 text-gray-500" />;
      case 'struggling': return <Frown className="h-8 w-8 text-blue-500" />;
      default: return <Meh className="h-8 w-8 text-gray-500" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'great': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'neutral': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'struggling': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Facial Expression Analysis</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Camera Preview */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 object-cover"
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {!videoRef.current?.srcObject && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startCamera}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Camera className="h-4 w-4" />
                  <span>Start Camera</span>
                </button>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {detectedMood && (
            <div className={`p-4 rounded-lg border ${getMoodColor(detectedMood)}`}>
              <div className="flex items-center space-x-3">
                {getMoodIcon(detectedMood)}
                <div>
                  <p className="font-medium capitalize">Detected Mood: {detectedMood}</p>
                  <p className="text-sm opacity-75">
                    Confidence: {Math.round(confidence * 100)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex space-x-3">
            {videoRef.current?.srcObject && (
              <button
                onClick={capturePhoto}
                disabled={isAnalyzing}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Expression'}</span>
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            This is a simplified analysis. For accurate results, professional facial recognition software would be used.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacialExpressionAnalyzer;
