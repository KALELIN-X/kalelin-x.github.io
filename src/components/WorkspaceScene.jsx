import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import "./workspace-scene.css";

function CityTraffic({ sceneId }) {
  const headlightId = `${sceneId}-headlight`;
  const tailglowId = `${sceneId}-tailglow`;
  const streetsId = `${sceneId}-streets`;
  const vehicleId = `${sceneId}-vehicle`;
  return (
    <svg className="workspace-traffic" viewBox="0 0 1536 1024" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={headlightId}>
          <stop stopColor="#f6efd8" stopOpacity=".4" />
          <stop offset="1" stopColor="#f6efd8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={tailglowId}>
          <stop stopColor="#fa526b" stopOpacity=".32" />
          <stop offset="1" stopColor="#fa526b" stopOpacity="0" />
        </radialGradient>
        <clipPath id={streetsId} clipPathUnits="userSpaceOnUse">
          <path d="M0 633L220 498L220 557L0 711Z M1258 526L1536 690L1536 747L1258 583Z" />
        </clipPath>
        <g id={vehicleId}>
          <ellipse cx="0" cy="5" rx="16" ry="6" fill="#050911" opacity=".58" />
          <ellipse cx="18" cy="0" rx="13" ry="5" fill={`url(#${headlightId})`} />
          <ellipse cx="-12" cy="0" rx="7" ry="7" fill={`url(#${tailglowId})`} />
          <path d="M-12-4Q-12-6-9-6H7Q12-6 12-3V3Q12 6 8 6H-9Q-12 6-12 3Z" fill="var(--car-color, #747e91)" />
          <path d="M-10 4H10L8 7H-8Z" fill="#111b2c" />
          <path d="M-7-4H1L5-2V3H-7Z" fill="#12243a" />
          <path d="M-6-3H1L4-1" stroke="#a7c5d4" strokeOpacity=".5" strokeWidth=".6" />
          <path d="M6-4H9M6 4H9" stroke="#c7d0db" strokeOpacity=".36" strokeWidth=".6" />
          <path d="M11-3V-1.5M11 1.5V3" stroke="#fcf3d7" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M-11-3V-1.5M-11 1.5V3" stroke="#ed4f65" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </defs>
      <g clipPath={`url(#${streetsId})`}>
        <g className="workspace-traffic-car workspace-traffic-left-out"><use href={`#${vehicleId}`} /></g>
        <g className="workspace-traffic-car workspace-traffic-left-in"><use href={`#${vehicleId}`} /></g>
        <g className="workspace-traffic-car workspace-traffic-right-out"><use href={`#${vehicleId}`} /></g>
        <g className="workspace-traffic-car workspace-traffic-right-in"><use href={`#${vehicleId}`} /></g>
      </g>
    </svg>
  );
}

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
          src={`${import.meta.env.BASE_URL}images/penthouse-workspace.png`}
          width="1536"
          height="1024"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setImageState("ready")}
          onError={() => setImageState("error")}
          alt="An illustrated penthouse above a neon city, with a developer seated at a glowing laptop and an orange kitten curled asleep on a cushion."
        />
        {imageState === "ready" && (
          <>
            <div className="workspace-laptop-glow" aria-hidden="true" />
            <CityTraffic sceneId={sceneId} />
          </>
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
          aria-label={reducedMotion ? "City motion disabled by your reduced motion setting" : animationPaused ? "Resume passing traffic and laptop glow" : "Pause passing traffic and laptop glow"}
          title={reducedMotion ? "Your reduced motion preference keeps this illustration still." : imageState !== "ready" ? "Motion is available when the illustration has loaded." : motionLabel}
        >
          {animationPaused || reducedMotion ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {motionLabel}
        </button>
      </figcaption>
    </figure>
  );
}
