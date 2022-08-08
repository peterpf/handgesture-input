import { Point, PointCloud, RecognizerResult } from "./types";
import * as RecognizerUtils from "./utils";

const basicGestures: PointCloud[] = [
    {
        name: 'pause',
        points: [{ X: 127, Y: 111, strokeId: 0 }, { X: 127, Y: 113, strokeId: 0 }, { X: 127, Y: 117, strokeId: 0 }, { X: 127, Y: 128, strokeId: 0 }, { X: 127, Y: 141, strokeId: 0 }, { X: 127, Y: 155, strokeId: 0 }, { X: 127, Y: 169, strokeId: 0 }, { X: 127, Y: 180, strokeId: 0 }, { X: 127, Y: 190, strokeId: 0 }, { X: 127, Y: 198, strokeId: 0 }, { X: 127, Y: 205, strokeId: 0 }, { X: 127, Y: 211, strokeId: 0 }, { X: 127, Y: 217, strokeId: 0 }, { X: 127, Y: 222, strokeId: 0 }, { X: 127, Y: 227, strokeId: 0 }, { X: 127, Y: 232, strokeId: 0 }, { X: 126, Y: 237, strokeId: 0 }, { X: 126, Y: 241, strokeId: 0 }, { X: 126, Y: 243, strokeId: 0 }, { X: 126, Y: 245, strokeId: 0 }, { X: 126, Y: 246, strokeId: 0 }, { X: 126, Y: 247, strokeId: 0 }, { X: 126, Y: 247, strokeId: 0 }, { X: 126, Y: 248, strokeId: 0 }, { X: 126, Y: 250, strokeId: 0 }, { X: 126, Y: 254, strokeId: 0 }, { X: 126, Y: 259, strokeId: 0 }, { X: 126, Y: 266, strokeId: 0 }, { X: 125, Y: 272, strokeId: 0 }, { X: 125, Y: 278, strokeId: 0 }, { X: 125, Y: 283, strokeId: 0 }, { X: 125, Y: 286, strokeId: 0 }, { X: 125, Y: 288, strokeId: 0 }, { X: 125, Y: 289, strokeId: 0 }, { X: 125, Y: 289, strokeId: 0 }, { X: 125, Y: 290, strokeId: 0 },
        { X: 219, Y: 108, strokeId: 1 }, { X: 219, Y: 108, strokeId: 1 }, { X: 219, Y: 110, strokeId: 1 }, { X: 219, Y: 116, strokeId: 1 }, { X: 219, Y: 127, strokeId: 1 }, { X: 219, Y: 139, strokeId: 1 }, { X: 219, Y: 151, strokeId: 1 }, { X: 219, Y: 164, strokeId: 1 }, { X: 219, Y: 176, strokeId: 1 }, { X: 219, Y: 187, strokeId: 1 }, { X: 219, Y: 196, strokeId: 1 }, { X: 219, Y: 205, strokeId: 1 }, { X: 219, Y: 213, strokeId: 1 }, { X: 219, Y: 218, strokeId: 1 }, { X: 219, Y: 224, strokeId: 1 }, { X: 219, Y: 230, strokeId: 1 }, { X: 219, Y: 235, strokeId: 1 }, { X: 219, Y: 239, strokeId: 1 }, { X: 219, Y: 244, strokeId: 1 }, { X: 219, Y: 249, strokeId: 1 }, { X: 219, Y: 252, strokeId: 1 }, { X: 219, Y: 256, strokeId: 1 }, { X: 219, Y: 260, strokeId: 1 }, { X: 219, Y: 262, strokeId: 1 }, { X: 219, Y: 264, strokeId: 1 }, { X: 219, Y: 265, strokeId: 1 }, { X: 219, Y: 265, strokeId: 1 }, { X: 219, Y: 266, strokeId: 1 }, { X: 219, Y: 266, strokeId: 1 }, { X: 219, Y: 266, strokeId: 1 }, { X: 219, Y: 267, strokeId: 1 }, { X: 219, Y: 268, strokeId: 1 }, { X: 219, Y: 271, strokeId: 1 }, { X: 219, Y: 275, strokeId: 1 }, { X: 219, Y: 279, strokeId: 1 }, { X: 219, Y: 283, strokeId: 1 }, { X: 219, Y: 286, strokeId: 1 }, { X: 219, Y: 288, strokeId: 1 }, { X: 219, Y: 290, strokeId: 1 }, { X: 218, Y: 290, strokeId: 1 }, { X: 218, Y: 291, strokeId: 1 }, { X: 218, Y: 291, strokeId: 1 }, { X: 218, Y: 291, strokeId: 1 }, { X: 218, Y: 291, strokeId: 1 }, { X: 218, Y: 291, strokeId: 1 }]
    },
    {
        name: 'play',
        points: [{X:140,Y:118, strokeId: 0},{X:140,Y:118, strokeId: 0},{X:141,Y:120, strokeId: 0},{X:145,Y:126, strokeId: 0},{X:150,Y:132, strokeId: 0},{X:155,Y:138, strokeId: 0},{X:162,Y:145, strokeId: 0},{X:169,Y:153, strokeId: 0},{X:175,Y:160, strokeId: 0},{X:181,Y:166, strokeId: 0},{X:187,Y:171, strokeId: 0},{X:191,Y:175, strokeId: 0},{X:195,Y:178, strokeId: 0},{X:199,Y:182, strokeId: 0},{X:203,Y:185, strokeId: 0},{X:207,Y:189, strokeId: 0},{X:210,Y:193, strokeId: 0},{X:212,Y:196, strokeId: 0},{X:215,Y:200, strokeId: 0},{X:218,Y:204, strokeId: 0},{X:220,Y:206, strokeId: 0},{X:221,Y:208, strokeId: 0},{X:223,Y:210, strokeId: 0},{X:223,Y:210, strokeId: 0},{X:224,Y:211, strokeId: 0},{X:224,Y:211, strokeId: 0},{X:224,Y:211, strokeId: 0},{X:225,Y:211, strokeId: 0},{X:225,Y:211, strokeId: 0},{X:225,Y:212, strokeId: 0},{X:227,Y:213, strokeId: 0},{X:228,Y:214, strokeId: 0},{X:229,Y:214, strokeId: 0},{X:230,Y:215, strokeId: 0},{X:230,Y:215, strokeId: 0},{X:231,Y:216, strokeId: 0},{X:231,Y:216, strokeId: 0},{X:231,Y:216, strokeId: 0},{X:231,Y:216, strokeId: 0},{X:230,Y:216, strokeId: 0},{X:228,Y:217, strokeId: 0},{X:224,Y:219, strokeId: 0},{X:219,Y:222, strokeId: 0},{X:212,Y:226, strokeId: 0},{X:205,Y:231, strokeId: 0},{X:197,Y:235, strokeId: 0},{X:190,Y:240, strokeId: 0},{X:184,Y:243, strokeId: 0},{X:179,Y:245, strokeId: 0},{X:174,Y:248, strokeId: 0},{X:170,Y:251, strokeId: 0},{X:165,Y:254, strokeId: 0},{X:161,Y:256, strokeId: 0},{X:158,Y:258, strokeId: 0},{X:155,Y:260, strokeId: 0},{X:152,Y:261, strokeId: 0},{X:149,Y:262, strokeId: 0},{X:147,Y:263, strokeId: 0},{X:145,Y:264, strokeId: 0},{X:143,Y:266, strokeId: 0},{X:142,Y:267, strokeId: 0},{X:140,Y:268, strokeId: 0},{X:139,Y:268, strokeId: 0},{X:138,Y:269, strokeId: 0},{X:137,Y:269, strokeId: 0},{X:137,Y:270, strokeId: 0},{X:137,Y:270, strokeId: 0},{X:136,Y:270, strokeId: 0},{X:136,Y:270, strokeId: 0},{X:135,Y:271, strokeId: 0},{X:133,Y:272, strokeId: 0},{X:131,Y:274, strokeId: 0},{X:129,Y:275, strokeId: 0},{X:128,Y:276, strokeId: 0},{X:127,Y:276, strokeId: 0},{X:127,Y:276, strokeId: 0},{X:127,Y:277, strokeId: 0}]
    }
]

export const UNKNOWN_GESTURE_NAME = "unknown gesture";

class Recognizer {
    private origin = new Point(0, 0, 0);
    private pointClouds: PointCloud[] = [];

    constructor() {
        // Add basic gestures to the pointClouds
        for (let i = 0; i < basicGestures.length; i++) {
            const gesture = basicGestures[i];
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
