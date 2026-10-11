import { useId } from "react";
import { laneProjection, projectedPolygon, projectCarPoint, WIDE_CITY_TRAFFIC } from "./city-traffic-geometry.js";
import "./city-traffic.css";

const COLORS = {
  silver: { body: "#8c9ba9", roof: "#b7c6cd", side: "#586b7a", end: "#738695", highlight: "#d5e5e8" },
  cream: { body: "#b5b9b2", roof: "#d5d7c8", side: "#7c898a", end: "#a2aea8", highlight: "#e3e6d7" },
  midnight: { body: "#465369", roof: "#66788c", side: "#293b50", end: "#3b4c60", highlight: "#90a6b5" },
  teal: { body: "#537c82", roof: "#80a4a7", side: "#354f59", end: "#466b73", highlight: "#b4d1d0" },
  ochre: { body: "#a18456", roof: "#c3a778", side: "#6c5c43", end: "#927950", highlight: "#dcc797" },
};

function IsometricCar({ projection, color, scale, shadowId, headlightId }) {
  const colors = COLORS[color] || COLORS.silver;
  const side = projection.side[1] > 0 ? 1 : -1;
  const end = projection.forward[1] > 0 ? 1 : -1;
  const polygon = (points) => projectedPolygon(points, projection);
  const point = (value) => projectCarPoint(value, projection);
  const circle = (x, y, z, radius) => Array.from({ length: 20 }, (_, index) => {
    const angle = (index / 20) * Math.PI * 2;
    return [x + Math.cos(angle) * radius, y, z + Math.sin(angle) * radius];
  });
  const groundShadow = Array.from({ length: 24 }, (_, index) => {
    const angle = (index / 24) * Math.PI * 2;
    return [Math.cos(angle) * 18, Math.sin(angle) * 8, 0];
  });
  const windowPoints = [[-6.2, side * 5.15, 5.1], [-4.3, side * 4.05, 8.5], [2.3, side * 4.05, 8.5], [4.8, side * 5.15, 5.1]];
  const windshield = end > 0
    ? [[5, -5.1, 5], [2.6, -4.1, 8.4], [2.6, 4.1, 8.4], [5, 5.1, 5]]
    : [[-7, -5.1, 5], [-4.7, -4.1, 8.4], [-4.7, 4.1, 8.4], [-7, 5.1, 5]];
  const roofReflection = [[-4.1, -3.1, 8.75], [1.9, -3.1, 8.75], [2.2, -1.8, 8.75], [-4.3, -1.8, 8.75]];

  return (
    <g transform={`scale(${scale})`}>
      <polygon points={polygon(groundShadow)} fill={`url(#${shadowId})`} />
      <polygon points={polygon([[14, -4.7, 0.3], [35, -11, 0.3], [35, 11, 0.3], [14, 4.7, 0.3]])} fill={`url(#${headlightId})`} opacity=".18" />
      {[-8.5, 8].map((x) => (
        <g key={x}>
          <polygon points={polygon(circle(x, side * 5.9, 2.1, 2.25))} fill="#07111b" stroke="#293342" strokeWidth=".65" />
          <polygon points={polygon(circle(x, side * 5.95, 2.1, 1.05))} fill="#74848b" opacity=".8" />
        </g>
      ))}
      <polygon points={polygon([[-14, side * 5.7, 1.8], [14, side * 5.7, 1.8], [13, side * 5.7, 4.8], [-13, side * 5.7, 4.8]])} fill={colors.side} />
      <polygon points={polygon([[end * 14, -5.7, 1.8], [end * 14, 5.7, 1.8], [end * 13, 5.7, 4.8], [end * 13, -5.7, 4.8]])} fill={colors.end} />
      <polygon points={polygon([[-13, -5.7, 4.8], [13, -5.7, 4.8], [13, 5.7, 4.8], [-13, 5.7, 4.8]])} fill={colors.body} />
      <polygon points={polygon([[-7, side * 5.1, 4.8], [-4.7, side * 4.1, 8.7], [2.6, side * 4.1, 8.7], [5, side * 5.1, 4.8]])} fill={colors.side} />
      <polygon points={polygon(windowPoints)} fill="#173140" stroke={colors.highlight} strokeOpacity=".38" strokeWidth=".5" />
      <polygon points={polygon(windshield)} fill="#203b49" stroke={colors.highlight} strokeOpacity=".35" strokeWidth=".45" />
      <polygon points={polygon([[-4.7, -4.1, 8.7], [2.6, -4.1, 8.7], [2.6, 4.1, 8.7], [-4.7, 4.1, 8.7]])} fill={colors.roof} />
      <polygon points={polygon(roofReflection)} fill={colors.highlight} opacity=".28" />
      <polyline points={polygon([[-5.6, side * 5.3, 4.1], [3.6, side * 5.3, 4.1]])} stroke={colors.highlight} strokeOpacity=".34" strokeWidth=".5" />
      <polyline points={polygon([[-0.9, side * 5.2, 5.1], [-0.9, side * 4.1, 8.5]])} stroke={colors.side} strokeWidth=".8" />
      {[-3.75, 3.75].map((y) => (
        <polygon key={y} points={polygon([[end * 13.6, y - 1.1, 3], [end * 13.6, y + 1.1, 3], [end * 13.15, y + 1.1, 4.15], [end * 13.15, y - 1.1, 4.15]])} fill={end > 0 ? "#ecdfb4" : "#b85d65"} opacity={end > 0 ? ".9" : ".85"} />
      ))}
      <polyline points={[point([end * 14, -4.5, 2]), point([end * 14, 4.5, 2])].map((value) => value.join(",")).join(" ")} stroke="#26333e" strokeWidth=".75" />
    </g>
  );
}

export default function CityTraffic({ sceneId, map = WIDE_CITY_TRAFFIC }) {
  const instanceId = useId().replace(/:/g, "");
  const id = `${sceneId || "city"}-traffic-${instanceId}`;
  const shadowId = `${id}-shadow`;
  const headlightId = `${id}-headlights`;
  return (
    <svg className="workspace-traffic city-traffic" viewBox={`0 0 ${map.width} ${map.height}`} preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={shadowId}>
          <stop offset=".1" stopColor="#030911" stopOpacity=".62" />
          <stop offset="1" stopColor="#030911" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={headlightId}>
          <stop stopColor="#f5e9c8" stopOpacity=".55" />
          <stop offset="1" stopColor="#f5e9c8" stopOpacity="0" />
        </linearGradient>
        {map.roads.map((road) => (
          <mask id={`${id}-${road.id}`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width={map.width} height={map.height} style={{ maskType: "luminance" }} key={road.id}>
            <polygon points={road.polygon.map((point) => point.join(",")).join(" ")} fill="white" />
            {(road.occlusions || []).map((polygon, index) => (
              <polygon key={index} points={polygon.map((point) => point.join(",")).join(" ")} fill="black" />
            ))}
          </mask>
        ))}
      </defs>
      {map.lanes.map((lane) => (
        <g key={lane.id} mask={`url(#${id}-${lane.road})`}>
          {lane.vehicles.map((vehicle, index) => (
            <g
              key={`${lane.id}-${index}`}
              className="city-traffic-vehicle"
              data-lane={lane.id}
              style={{
                "--route-start-x": `${lane.from[0]}px`,
                "--route-start-y": `${lane.from[1]}px`,
                "--route-end-x": `${lane.to[0]}px`,
                "--route-end-y": `${lane.to[1]}px`,
                animationDuration: `${lane.duration}s`,
                animationDelay: `${vehicle.delay}s`,
              }}
            >
              <IsometricCar projection={lane.projection || laneProjection(lane.from, lane.to)} color={vehicle.color} scale={vehicle.scale || lane.scale} shadowId={shadowId} headlightId={headlightId} />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
