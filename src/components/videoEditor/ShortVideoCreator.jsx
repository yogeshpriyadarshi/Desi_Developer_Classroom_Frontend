import { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
const ffmpeg = new FFmpeg();

function ShortVideoCreator() {
    const videoRef = useRef(null);

    const [file, setFile] = useState(null);
    const [videoURL, setVideoURL] = useState(null);
    const [outputURL, setOutputURL] = useState(null);

    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(10);
    const [duration, setDuration] = useState(0);

    const [text, setText] = useState("My Short Video");
    const [loading, setLoading] = useState(false);

    // Upload video
    const handleUpload = (e) => {
        const f = e.target.files[0];
        if (f) {
            setFile(f);
            setVideoURL(URL.createObjectURL(f));
        }
    };

    // Load metadata
    const handleLoadedMetadata = () => {
        const d = videoRef.current.duration;
        setDuration(d);
        setEnd(d > 30 ? 30 : d); // default max 30 sec
    };

    // Load FFmpeg
    const loadFFmpeg = async () => {
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }
    };

    // Process video
    const handleCreateShort = async () => {
        if (!file) return;

        setLoading(true);
        await loadFFmpeg();

        // Write file
        ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));

        // Step 1: Trim
        await ffmpeg.run(
            "-i", "input.mp4",
            "-ss", `${start}`,
            "-to", `${end}`,
            "-c", "copy",
            "trimmed.mp4"
        );

        // Step 2: Convert to vertical + add text
        await ffmpeg.run(
            "-i", "trimmed.mp4",
            "-vf",
            `scale=1080:1920,drawtext=text='${text}':x=(w-text_w)/2:y=100:fontsize=50:fontcolor=white`,
            "-preset", "ultrafast",
            "output.mp4"
        );

        const data = ffmpeg.FS("readFile", "output.mp4");

        const url = URL.createObjectURL(
            new Blob([data.buffer], { type: "video/mp4" })
        );

        setOutputURL(url);
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Short Video Creator</h2>

            {/* Upload */}
            <input type="file" accept="video/*" onChange={handleUpload} />

            {/* Preview */}
            {videoURL && (
                <>
                    <video
                        ref={videoRef}
                        src={videoURL}
                        controls
                        onLoadedMetadata={handleLoadedMetadata}
                        className="w-full mt-4 rounded"
                    />

                    {/* Trim controls */}
                    <div className="flex gap-4 mt-4">
                        <input
                            type="number"
                            value={start}
                            onChange={(e) => setStart(Number(e.target.value))}
                            className="border p-2"
                            placeholder="Start"
                        />
                        <input
                            type="number"
                            value={end}
                            onChange={(e) => setEnd(Number(e.target.value))}
                            className="border p-2"
                            placeholder="End"
                        />
                    </div>

                    {/* Caption */}
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="border p-2 mt-4 w-full"
                        placeholder="Enter caption"
                    />

                    {/* Button */}
                    <button
                        onClick={handleCreateShort}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {loading ? "Processing..." : "Create Short"}
                    </button>
                </>
            )}

            {/* Output */}
            {outputURL && (
                <div className="mt-6">
                    <h3 className="font-semibold">Output Preview</h3>
                    <video src={outputURL} controls className="w-full mt-2" />
                    <a
                        href={outputURL}
                        download="short-video.mp4"
                        className="block mt-2 text-blue-500 underline"
                    >
                        Download Video
                    </a>
                </div>
            )}
        </div>
    );
}

export default ShortVideoCreator;