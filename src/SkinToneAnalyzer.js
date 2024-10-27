import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert.jsx";

const SkinToneAnalyzer = () => {
  const [imageData, setImageData] = useState(null);
  const [skinTone, setSkinTone] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  // Color recommendations based on skin undertone
  const colorRecommendations = {
    warm: {
      title: "Warm Undertone",
      colors: [
        { name: "Earth Brown", hex: "#8B4513" },
        { name: "Coral", hex: "#FF7F50" },
        { name: "Olive Green", hex: "#808000" },
        { name: "Golden Yellow", hex: "#FFD700" },
        { name: "Warm Red", hex: "#FF4500" },
      ],
    },
    cool: {
      title: "Cool Undertone",
      colors: [
        { name: "Navy Blue", hex: "#000080" },
        { name: "Royal Purple", hex: "#663399" },
        { name: "Emerald Green", hex: "#008000" },
        { name: "Berry Red", hex: "#8B0000" },
        { name: "Ice Blue", hex: "#ADD8E6" },
      ],
    },
    neutral: {
      title: "Neutral Undertone",
      colors: [
        { name: "Classic Black", hex: "#000000" },
        { name: "Pure White", hex: "#FFFFFF" },
        { name: "Gray", hex: "#808080" },
        { name: "Navy Blue", hex: "#000080" },
        { name: "Taupe", hex: "#483C32" },
      ],
    },
  };

  const analyzeSkinTone = (imageElement) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to match image
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    // Draw image to canvas
    ctx.drawImage(imageElement, 0, 0);

    // Get image data from center portion of image
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const sampleSize = 50;

    const imageData = ctx.getImageData(
      centerX - sampleSize / 2,
      centerY - sampleSize / 2,
      sampleSize,
      sampleSize
    );

    // Calculate average RGB values
    let r = 0,
      g = 0,
      b = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i];
      g += imageData.data[i + 1];
      b += imageData.data[i + 2];
    }

    const pixels = imageData.data.length / 4;
    r = Math.floor(r / pixels);
    g = Math.floor(g / pixels);
    b = Math.floor(b / pixels);

    // Simple undertone detection based on RGB values
    const undertone = determineUndertone(r, g, b);
    setSkinTone(undertone);
    setRecommendations(colorRecommendations[undertone].colors);
  };

  const determineUndertone = (r, g, b) => {
    // Simple undertone detection logic
    // This is a basic implementation and could be improved with more sophisticated algorithms
    const warmth = (r - b) / ((r + b) / 2);

    if (warmth > 0.1) return "warm";
    if (warmth < -0.1) return "cool";
    return "neutral";
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageData(e.target.result);
        analyzeSkinTone(img);
        setError(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Skin Tone Color Advisor</h1>
        <p className="text-gray-600">
          Upload a photo to get personalized color recommendations
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <label className="flex flex-col items-center gap-2 cursor-pointer">
          <div className="flex items-center gap-2 text-blue-600">
            <Upload size={24} />
            <span>Upload Photo</span>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {imageData && (
          <div className="relative w-64 h-64">
            <img
              src={imageData}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {skinTone && (
          <div className="w-full space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                {colorRecommendations[skinTone].title}
              </h2>
              <p className="text-gray-600">Here are your recommended colors:</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {recommendations.map((color, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-2 rounded-lg border"
                >
                  <div
                    className="w-16 h-16 rounded-full mb-2"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm text-center">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinToneAnalyzer;
