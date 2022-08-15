import { Point } from "@/dollar/types";
import { Observer } from "@/utils/observable";
import VideoPlayer from "./VideoPlayer";


const normalizePoint = (canvas: HTMLCanvasElement, video: HTMLVideoElement, point: Point) => {
  const newX = (point.X / video.clientHeight) * canvas.clientWidth;
  const newY = (point.Y / video.clientWidth) * canvas.clientWidth;
  return [newX, newY];
}

export class CanvasPainter implements Observer<Point> {
  private canvas: React.RefObject<HTMLCanvasElement>;
  private videoRef: React.RefObject<VideoPlayer>;

  public constructor(canvas: React.RefObject<HTMLCanvasElement>, videoRef: React.RefObject<VideoPlayer>) {
    this.canvas = canvas;
    this.videoRef = videoRef;
  }

  public getId(): string {
    return "Canvas";
  }

  public onData(point: Point): void {
    const video = this.videoRef.current?.getHtmlVideoElement();
    const canvas = this.canvas?.current;
    const context = canvas?.getContext('2d');
    if (video == null || canvas == null || context == null) {
      return;
    }
    const rectSize = 2;
    const [pointX, pointY] = normalizePoint(canvas, video, point);
    context.fillStyle = 'red';
    context.fillRect(pointX, pointY, rectSize, rectSize);
  }

  public reset() {
    const video = this.videoRef.current;
    const canvas = this.canvas.current;
    const context = canvas?.getContext('2d');
    if (video == null || canvas == null || context == null) {
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
