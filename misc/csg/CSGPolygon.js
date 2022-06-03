// # class Polygon

// Represents a convex polygon. The vertices used to initialize a polygon must
// be coplanar and form a convex loop. They do not have to be `Vertex`
// instances but they must behave similarly (duck typing can be used for
// customization).

class CSGPolygon {
  constructor(vertices) {
    this.vertices = vertices;
    this.plane = new CSGCuttingPlane().fromPoints(
      vertices[0].pos.clone(),
      vertices[1].pos.clone(),
      vertices[2].pos.clone(),
    );
  }

  clone() {
    const vertices = this.vertices.map(function (v) {
      return v.clone();
    });
    return new CSGPolygon(vertices);
  }

  negate() {
    this.vertices.reverse().map(function (v) {
      v.negate();
    });
    this.plane.negate();
  }
}
