import { useRef, useState, useEffect } from "react";

export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const imageRef = useRef(null);

  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);
  const [lineColor, setLineColor] = useState("#000000");
  const [mode, setMode] = useState("draw");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const saveState = () => {
    const canvas = canvasRef.current;
    undoStack.current.push(ctxRef.current.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.current.length > 50) undoStack.current.shift(); // limit history
    redoStack.current = [];
  };

  const undo = () => {
    if (undoStack.current.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const last = undoStack.current.pop();
    redoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(last, 0, 0);
  };

  const redo = () => {
    if (redoStack.current.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const next = redoStack.current.pop();
    undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(next, 0, 0);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    ctxRef.current = ctx;

    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, rect.width, rect.height);
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [lineColor, lineWidth, mode, isFullscreen]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const startDrawing = (e) => {
    saveState();
    const { x, y } = getCoordinates(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);

    const ctx = ctxRef.current;
    ctx.globalCompositeOperation = mode === "erase" ? "destination-out" : "source-over";

    if (mode === "erase") {
      ctx.lineWidth = Math.max(10, lineWidth * 3);
    } else {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctxRef.current.closePath();
  };

  const clearCanvas = () => {
    saveState();
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);

    if (imageRef.current) {
      const rect = canvas.getBoundingClientRect();
      ctxRef.current.drawImage(imageRef.current, 0, 0, rect.width, rect.height);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      resizeCanvas();
      saveState();
    };

    img.src = URL.createObjectURL(file);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "annotated.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className={isFullscreen ? "fixed inset-0 bg-white z-50" : "p-4 space-y-4"}>
      <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded shadow-md">
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <input
          type="color"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
          disabled={mode === "erase"}
        />

        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
        />

        <button onClick={() => setMode(mode === "draw" ? "erase" : "draw")} className="px-3 py-1 bg-blue-500 text-white rounded">
          {mode === "erase" ? "Eraser" : "Draw"}
        </button>

        <button onClick={undo} className="px-3 py-1 bg-gray-700 text-white rounded">Undo</button>
        <button onClick={redo} className="px-3 py-1 bg-gray-500 text-white rounded">Redo</button>

        <button onClick={clearCanvas} className="px-3 py-1 bg-red-500 text-white rounded">Clear</button>

        <button onClick={downloadImage} className="px-3 py-1 bg-green-500 text-white rounded">Download</button>

        <button onClick={() => setIsFullscreen(!isFullscreen)} className="px-3 py-1 bg-black text-white rounded">
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      <div className={isFullscreen ? "w-full h-[calc(100vh-60px)]" : "w-full h-96"}>
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
}
