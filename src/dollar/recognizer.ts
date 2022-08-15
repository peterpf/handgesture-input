import { Point, PointCloud, RecognizerResult } from "./types";
import * as RecognizerUtils from "./utils";

export const UNKNOWN_GESTURE_NAME = "unknown gesture";

class Recognizer {
    private origin = new Point(0, 0, 0);
    private pointClouds: PointCloud[] = [];

    constructor(predefinedGestures: PointCloud[]) {
        // Add basic gestures to the pointClouds
        for (let i = 0; i < predefinedGestures.length; i++) {
            const gesture = predefinedGestures[i];
            const normalizedPoints = RecognizerUtils.normalize(gesture.points, this.origin, false);
            this.pointClouds.push({
                ...gesture,
                points: normalizedPoints
            });
        }
    }

    public addGesture(name: string, points: Point[]) {
        this.pointClouds.push({
            name,
            points
        })
    }

    public recognize(points: Point[]): RecognizerResult {

        let b = +Infinity;
        let u = -1;
        for (let i = 0; i < this.pointClouds.length; i++) // for each point-cloud template
        {
            const pointCloud = this.pointClouds[i];
            const numPoints = pointCloud.points.length;
            // the incoming points array could have any abritrary size.
            // But performing gesture recognition requires two equally-sized arrays in order to do a point-wise comparisson.
            const interpolatedPoints = RecognizerUtils.interpolateArray(points, numPoints);

            const normalizedPoints = RecognizerUtils.normalize(interpolatedPoints, this.origin, true, numPoints);
            const d = RecognizerUtils.greedyCloudMatch(normalizedPoints, pointCloud);
            if (d < b) {
                b = d; // best (least) distance
                u = i; // point-cloud
            }
        }
        const similarityScore = Math.max((b - 2.0) / -2.0, 0.0);
        if (u == -1) {
            return new RecognizerResult(UNKNOWN_GESTURE_NAME, 0.0);
        }
        return new RecognizerResult(this.pointClouds[u].name, similarityScore);
    }

    public rank(points: Point[]) {
        const normalizedPoints = RecognizerUtils.normalize(points, this.origin, false);

        // For each point-cloud template
        const matches = [];
        for (let i = 0; i < this.pointClouds.length; i++) {
            const d = RecognizerUtils.greedyCloudMatch(normalizedPoints, this.pointClouds[i]);
            matches.push(new RecognizerResult(this.pointClouds[i].name, Math.max((d - 2.0) / -2.0, 0.0)));
        }

        // Sort by score
        matches.sort(function (a, b) {
            if (a.score > b.score) {
                return -1;
            } else if (a.score < b.score) {
                return 1;
            } else {
                return 0;
            }
        });

        return matches;
    }
}

export default Recognizer;
