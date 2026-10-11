import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import "./workspace-scene.css";

export default function WorkspaceScene() {
  const sceneRef = useRef(null);
  const imageRef = useRef(null);
  const sceneId = `workspace-${useId().replace(/:/g, "")}`;
  const captionId = `${sceneId}-caption`;
  const [animationPaused, setAnimationPaused] = useState(false);
  const [imageState, setImageState] = useState("loading");
  const [sceneVisible, setSceneVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const motionPaused = animationPaused || reducedMotion || !sceneVisible || !pageVisible || imageState !== "ready";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener("pageshow", updateVisibility);

    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => setSceneVisible(entry.isIntersecting),
        { threshold: 0 },
      );
      if (sceneRef.current) observer.observe(sceneRef.current);
    }

    // Cached images can already be complete when the component mounts.
    const image = imageRef.current;
    if (image?.complete) setImageState(image.naturalWidth > 0 ? "ready" : "error");

    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("pageshow", updateVisibility);
      observer?.disconnect();
    };
  }, []);

  const motionLabel = reducedMotion
    ? "Motion off"
    : animationPaused
      ? "Resume motion"
      : "Pause motion";

  return (
    <figure
      ref={sceneRef}
      className={`workspace-scene${motionPaused ? " workspace-scene--paused" : ""}${reducedMotion ? " workspace-scene--reduced" : ""}${imageState === "error" ? " workspace-scene--error" : ""}`}
      aria-labelledby={captionId}
    >
      <div className="workspace-image-wrap">
        <img
          ref={imageRef}
          className="workspace-image"
          src={`${import.meta.env.BASE_URL}images/penthouse-city-wide.png`}
          width="1774"
          height="887"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setImageState("ready")}
          onError={() => setImageState("error")}
          alt="A wide illustrated neon city surrounding a central penthouse, with a developer at a laptop, a sleeping orange kitten, and small sidewalk pedestrians."
        />
        {imageState === "ready" && (
          <div className="workspace-laptop-glow" aria-hidden="true" />
        )}
        {imageState === "loading" && (
          <p className="workspace-image-status" role="status">Loading workspace illustration…</p>
        )}
        {imageState === "error" && (
          <p className="workspace-image-status" role="alert">The workspace illustration couldn’t load. Refresh the page to try again.</p>
        )}
      </div>
      <figcaption className="workspace-caption" id={captionId}>
        <span>Neon penthouse · illustrated</span>
        <button
          className="workspace-animation-button"
          type="button"
          onClick={() => setAnimationPaused((value) => !value)}
          disabled={reducedMotion || imageState !== "ready"}
          aria-pressed={animationPaused || reducedMotion}
          aria-label={reducedMotion ? "Laptop glow disabled by your reduced motion setting" : animationPaused ? "Resume laptop glow" : "Pause laptop glow"}
          title={reducedMotion ? "Your reduced motion preference keeps this illustration still." : imageState !== "ready" ? "Motion is available when the illustration has loaded." : motionLabel}
        >
          {animationPaused || reducedMotion ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {motionLabel}
        </button>
      </figcaption>
    </figure>
  );
}
