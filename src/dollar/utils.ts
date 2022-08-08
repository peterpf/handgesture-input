import { Point, PointCloud } from "./types";

export const greedyCloudMatch = (points: Point[], P: PointCloud) => {
    const e = 0.50;
    const step = Math.floor(Math.pow(points.length, 1 - e));
    let min = +Infinity;
    for (let i = 0; i < points.length; i += step) {
        const d1 = cloudDistance(points, P.points, i);
        const d2 = cloudDistance(P.points, points, i);
        min = Math.min(min, Math.min(d1, d2)); // min3
    }
    return min;
}

export const cloudDistance = (pts1: Point[], pts2: Point[], start: number) => {
    const matched = new Array(pts1.length); // pts1.length == pts2.length
    for (let k = 0; k < pts1.length; k++) {
        matched[k] = false;
    }
    let sum = 0;
    let i = start;
    do {
        let index = -1;
        let min = +Infinity;
        for (let j = 0; j < matched.length; j++) {
            if (!matched[j]) {
                const d = distance(pts1[i], pts2[j]);
                if (d < min) {
                    min = d;
                    index = j;
                }
            }
        }
        matched[index] = true;
        const weight = 1 - ((i - start + pts1.length) % pts1.length) / pts1.length;
        sum += weight * min;
        i = (i + 1) % pts1.length;
    } while (i != start);
    return sum;
}

/**
 * Compute the average position of all the points.
 */
export const centroid = (points: Point[]) => {
    let x = 0.0, y = 0.0;
    for (let i = 0; i < points.length; i++) {
        x += points[i].X;
        y += points[i].Y;
    }
    x /= points.length;
    y /= points.length;
    return new Point(x, y, 0);
}
/**
 * length traversed by a point path.
 */
export const pathLength = (points: Point[]) => {
    var d = 0.0;
    for (var i = 1; i < points.length; i++) {
        if (points[i].strokeId == points[i - 1].strokeId)
            d += distance(points[i - 1], points[i]);
    }
    return d;
}

/**
 * Euclidean distance between two points
 */
export const distance = (p1: Point, p2: Point) => {
    const dx = p2.X - p1.X;
    const dy = p2.Y - p1.Y;
    return Math.sqrt(dx * dx + dy * dy);
}


export const scale = (points: Point[], origin: Point): Point[] => {
    // Find the bounding box of points
    var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
    for (var i = 0; i < points.length; i++) {
        minX = Math.min(minX, points[i].X);
        minY = Math.min(minY, points[i].Y);
        maxX = Math.max(maxX, points[i].X);
        maxY = Math.max(maxY, points[i].Y);
    }

    // Figure out the max dimension (either the width or height is biggest)
    var size = Math.max(maxX - minX, maxY - minY) + 0.0001;

    // Scale points down into a square of 1.0 x 1.0 dimensions, while maintaining
    // x/y proportions
    var newpoints = new Array();
    for (var i = 0; i < points.length; i++) {
        var qx = (points[i].X - minX) / size;
        var qy = (points[i].Y - minY) / size;
        newpoints[newpoints.length] = new Point(qx, qy, points[i].strokeId);
    }
    return newpoints;
}


const translateTo = (points: Point[], origin: Point): Point[] => {
    const c = centroid(points);
    const newpoints = new Array();
    for (let i = 0; i < points.length; i++) {
        const qx = points[i].X + origin.X - c.X;
        const qy = points[i].Y + origin.Y - c.Y;
        newpoints[newpoints.length] = new Point(qx, qy, points[i].strokeId);
    }
    return newpoints;
}

const clonePoints = (points: Point[]): Point[] => {
    const newPoints: Point[] = [];
    for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        newPoints.push(new Point(pt.X, pt.Y, pt.strokeId));
    }
    return newPoints;
}

const resample = (points: Point[], numPoints: number): Point[] => {
    points = clonePoints(points);
    var I = pathLength(points) / (numPoints - 1); // interval length
    var D = 0.0;
    var newpoints = new Array(new Point(points[0].X, points[0].Y, points[0].strokeId));
    for (var i = 1; i < points.length; i++) {
        if (points[i].strokeId == points[i - 1].strokeId) {
            var d = distance(points[i - 1], points[i]);
            if ((D + d) >= I) {
                var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
                var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
                var q = new Point(qx, qy, points[i].strokeId);
                newpoints[newpoints.length] = q; // append new point 'q'
                points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
                D = 0.0;
            }
            else D += d;
        }
    }
    if (newpoints.length == numPoints - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
        newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].strokeId);
    return newpoints;
}
/**
 * Gesture points are resampled, scaled with shape preservation, and translated to origin.
 */
export const normalize = (points: Point[], origin: Point, shouldResample: boolean, numPoints?: number) => {
    let pointsToNorm = points;
    if (shouldResample) {
        if (numPoints == null) {
            throw Error("numPoints needs to be defined when resampling=true");
        }
        pointsToNorm = resample(points, numPoints);
    }
    const scaledPoints = scale(pointsToNorm, origin);
    const transPoints = translateTo(scaledPoints, origin);
    return transPoints;
}

// Apply linear interpolation on the given points.
const linearInterpolate = (before: Point, after: Point, atPoint: number) => {
    const newX = before.X + (after.X - before.X) * atPoint;
    const newY = before.Y + (after.Y - before.Y) * atPoint;
    const newId = before.strokeId

    return new Point(newX, newY, newId)
};

export const interpolateArray = (points: Point[], fitCount: number): Point[] => {
    const newData = new Array();
    const springFactor = (points.length - 1) / (fitCount - 1);
    newData[0] = points[0]; // for new allocation
    // TODO: Interpolate each stroke, otherwise we end up with one single interpolation line...which is bad
    for (let i = 1; i < fitCount - 1; i++) {
        const tmp = i * springFactor;
        const beforeIdx =  Math.floor(tmp);
        const afterIdx = Math.ceil(tmp);
        const atPoint = tmp - beforeIdx;
        newData[i] = linearInterpolate(points[beforeIdx], points[afterIdx], atPoint);
    }
    newData[fitCount - 1] = points[points.length - 1]; // for new allocation
    return newData;
};