// Road directions live in the ground plane; height always projects upward.
// A vehicle is projected as a small solid, never rotated as a flat icon.
export function laneProjection(from, to) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy);
  if (!Number.isFinite(length) || length === 0) {
    throw new Error("A traffic lane needs two distinct finite endpoints.");
  }
  const forward = [dx / length, dy / length];
  const side = [-(dy > 0 ? 1 : -1) * 0.81, (dx > 0 ? 1 : -1) * 0.59];
  return { forward, side };
}

export function projectCarPoint([length, width, height], { forward, side }) {
  return [
    length * forward[0] + width * side[0],
    length * forward[1] + width * side[1] - height,
  ];
}

export function projectedPolygon(points, projection) {
  return points.map((point) => projectCarPoint(point, projection).map((value) => Number(value.toFixed(3))).join(",")).join(" ");
}

export function lanePoint({ from, to }, progress) {
  return from.map((value, axis) => value + (to[axis] - value) * progress);
}

export function pointInPolygon([x, y], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function roadPointVisible(point, road) {
  return pointInPolygon(point, road.polygon) && !(road.occlusions || []).some((polygon) => pointInPolygon(point, polygon));
}

// Coordinates belong to the 1774 × 887 wide-city illustration.
// Only exposed street corridors are used; vehicles do not traverse rooftops.
export const WIDE_CITY_TRAFFIC = {
  width: 1774,
  height: 887,
  roads: [
    {
      id: "west-avenue",
      polygon: [[0, 316], [550, 887], [431, 887], [0, 441]],
      // Foreground roofs and their street-side foliage hide the ground lane.
      // The cars keep travelling behind these shapes rather than changing lanes.
      occlusions: [
        [[0, 394], [36, 434], [79, 461], [121, 503], [163, 538], [185, 568], [166, 607], [128, 620], [0, 620]],
        [[0, 638], [77, 655], [147, 666], [218, 682], [260, 700], [295, 716], [316, 741], [315, 788], [306, 887], [0, 887]],
        [[156, 601], [174, 587], [194, 595], [210, 615], [200, 639], [175, 647], [154, 629]],
        [[196, 642], [219, 630], [242, 644], [252, 672], [236, 687], [209, 680]],
        [[302, 767], [325, 753], [348, 771], [348, 799], [326, 813], [304, 795]],
        [[337, 815], [360, 802], [380, 820], [379, 843], [354, 854], [337, 839]],
      ],
    },
    {
      id: "east-cross-street",
      polygon: [[1524, 675], [1774, 478], [1774, 555], [1547, 731]],
      occlusions: [
        [[1430, 615], [1490, 623], [1510, 644], [1548, 652], [1580, 680], [1572, 714], [1545, 742], [1450, 759], [1330, 734], [1330, 650]],
      ],
    },
  ],
  lanes: [
    { id: "west-southbound", road: "west-avenue", from: [10, 371], to: [491, 873], duration: 26, scale: 1.25, vehicles: [{ color: "silver", delay: -3 }, { color: "teal", delay: -16 }] },
    { id: "west-northbound", road: "west-avenue", from: [438, 879], to: [12, 433], duration: 29, scale: 1.25, vehicles: [{ color: "cream", delay: -10 }, { color: "midnight", delay: -24.5 }] },
    { id: "east-northeast", road: "east-cross-street", from: [1542, 676], to: [1759, 507], duration: 12, scale: 1.13, vehicles: [{ color: "ochre", delay: -4 }] },
    { id: "east-southwest", road: "east-cross-street", from: [1759, 553], to: [1558, 708], duration: 14, scale: 1.13, vehicles: [{ color: "silver", delay: -9 }] },
  ],
};
