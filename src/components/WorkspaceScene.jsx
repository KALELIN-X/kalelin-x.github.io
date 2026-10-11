import { useEffect, useRef, useState } from "react";
import "./workspace-scene.css";

export default function WorkspaceScene() {
  const imageRef = useRef(null);
  const [imageState, setImageState] = useState("loading");

  useEffect(() => {
    // Cached images can already be complete when the component mounts.
    const image = imageRef.current;
    if (image?.complete) setImageState(image.naturalWidth > 0 ? "ready" : "error");
  }, []);

  return (
    <figure
      className={`workspace-scene${imageState === "error" ? " workspace-scene--error" : ""}`}
    >
      <div className="workspace-image-wrap">
        <img
          ref={imageRef}
          className="workspace-image"
          src={`${import.meta.env.BASE_URL}images/penthouse-future-skyline.png`}
          width="1774"
          height="887"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setImageState("ready")}
          onError={() => setImageState("error")}
          alt="An illustration of a warm penthouse with a developer at a laptop and a sleeping orange kitten, overlooking a layered futuristic city and distant waterfront skyline with restrained cyan lights."
        />
        {imageState === "loading" && (
          <p className="workspace-image-status" role="status">Loading workspace illustration…</p>
        )}
        {imageState === "error" && (
          <p className="workspace-image-status" role="alert">The workspace illustration couldn’t load. Refresh the page to try again.</p>
        )}
      </div>
    </figure>
  );
}
