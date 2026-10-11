import test from "node:test";
import assert from "node:assert/strict";
import { laneProjection, projectCarPoint, projectedPolygon, lanePoint, pointInPolygon, roadPointVisible, WIDE_CITY_TRAFFIC } from "./city-traffic-geometry.js";

test("car height stays vertically upright across opposing road headings", () => {
  for (const lane of WIDE_CITY_TRAFFIC.lanes) {
    const projection = laneProjection(lane.from, lane.to);
    const ground = projectCarPoint([4, 3, 0], projection);
    const roof = projectCarPoint([4, 3, 9], projection);
    assert.equal(roof[0], ground[0]);
    assert.equal(roof[1], ground[1] - 9);
    assert.ok(Math.abs(Math.hypot(...projection.forward) - 1) < 1e-12);
  }
});

test("projected body faces remain finite for all four lane orientations", () => {
  const bodyFace = [[-14, -5.7, 1.8], [14, -5.7, 1.8], [13, -5.7, 4.8], [-13, -5.7, 4.8]];
  for (const lane of WIDE_CITY_TRAFFIC.lanes) {
    const face = projectedPolygon(bodyFace, laneProjection(lane.from, lane.to));
    assert.equal(face.split(" ").length, 4);
    assert.ok(face.split(/[ ,]/).every((number) => Number.isFinite(Number(number))));
  }
  assert.throws(() => laneProjection([0, 0], [0, 0]), /distinct finite/);
  assert.throws(() => laneProjection([NaN, 0], [1, 0]), /distinct finite/);
});

test("mapped ground travel stays in its street corridor", () => {
  for (const lane of WIDE_CITY_TRAFFIC.lanes) {
    const road = WIDE_CITY_TRAFFIC.roads.find((road) => road.id === lane.road);
    assert.ok(road, `${lane.id} has a road mask`);
    for (let step = 0; step <= 20; step += 1) {
      assert.ok(pointInPolygon(lanePoint(lane, step / 20), road.polygon), `${lane.id} is within its road at ${step / 20}`);
    }
    assert.ok(lane.duration > 0);
    assert.ok(lane.scale > 0);
  }
});

test("foreground roofs hide ground traffic while exposed pavement remains visible", () => {
  const west = WIDE_CITY_TRAFFIC.roads.find((road) => road.id === "west-avenue");
  const east = WIDE_CITY_TRAFFIC.roads.find((road) => road.id === "east-cross-street");
  for (const point of [[64, 487], [111, 535], [276, 709]]) {
    assert.equal(pointInPolygon(point, west.polygon), true);
    assert.equal(roadPointVisible(point, west), false, `western foreground obscures ${point}`);
  }
  for (const point of [[151, 518], [293, 666]]) {
    assert.equal(roadPointVisible(point, west), true, `open western pavement at ${point}`);
  }
  assert.equal(roadPointVisible([1542, 676], east), false);
  assert.equal(roadPointVisible([1660, 584], east), true);
});
