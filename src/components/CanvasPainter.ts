import { Point2D } from "@/types/types";
import { Observer } from "@/utils/observable";
import VideoPlayer from "./VideoPlayer";


/**
 * Project the point (coming from the video) onto the canvas.
 * @param canvas HTMLCanvasElement
 * @param video HTMLVideoElement
 * @param point Point to normalize
 * @returns Projected point.
 */
const projectPoint = (canvas: HTMLCanvasElement, video: HTMLVideoElement, point: Point2D): Point2D => {
  const newX = (point.x / video.clientWidth) * canvas.width;
  const newY = (point.y / video.clientHeight) * canvas.height;
  return { x: newX, y: newY };
}

export class CanvasPainter implements Observer<Point2D> {
  private canvas: React.RefObject<HTMLCanvasElement>;
  private videoRef: React.RefObject<VideoPlayer>;

  public constructor(canvas: React.RefObject<HTMLCanvasElement>, videoRef: React.RefObject<VideoPlayer>) {
    this.canvas = canvas;
    this.videoRef = videoRef;
  }

  public getId(): string {
    return "Canvas";
  }

  /**
   * Callback method of the Observable<Point2D> which draws the point on the canvas.
   * @param point The 2D point to draw.
   */
  public onData(point: Point2D): void {
    const video = this.videoRef.current?.getHtmlVideoElement();
    const canvas = this.canvas?.current;
    const context = canvas?.getContext('2d');
    if (video == null || canvas == null || context == null) {
      return;
    }
    const rectSize = 2;

    const projectedPoint = projectPoint(canvas, video, point);
    context.fillStyle = 'red';
    context.fillRect(projectedPoint.x, projectedPoint.y, rectSize, rectSize);
  }

  /**
   * Clear the canvas.
   */
  public reset(): void {
    const video = this.videoRef.current;
    const canvas = this.canvas.current;
    const context = canvas?.getContext('2d');
    if (video == null || canvas == null || context == null) {
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
