export class Point {
    public X: number;
    public Y: number;
    /**
     * The strokeId defines to which stroke the point belongs to.
     */
    public strokeId: number;

    constructor(X: number, Y: number, ID: number) {
        this.X = X;
        this.Y = Y;
        this.strokeId = ID;
    }
}

export class PointCloud {
    public name: string;
    public points: Point[];

    constructor(name: string, points: Point[]) {
        this.name = name;
        this.points = points;
    }
}

export class RecognizerResult {
    public name: string;
    public score: number;

    constructor(name: string, score: number) {
        this.name = name;
        this.score = score;
    }
}
