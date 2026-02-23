import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'signature-pad',
  template: `
    <canvas
      #canvas
      [attr.width]="options?.canvasWidth || 300"
      [attr.height]="options?.canvasHeight || 150"
      style="width: 100%; display: block;"
      (mousedown)="startDraw()"
      (touchstart)="startDraw()"
      (mouseup)="endDraw()"
      (mouseleave)="endDraw()"
      (touchend)="endDraw()"
    ></canvas>
  `
})
export class SignaturePadComponent implements AfterViewInit {
  @Input() options: any;
  @Output() drawStartEvent = new EventEmitter<void>();
  @Output() drawEndEvent = new EventEmitter<void>();

  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D | null = null;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      return;
    }

    this.context = canvas.getContext('2d');
    if (!this.context) {
      return;
    }

    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.strokeStyle = this.options?.penColor || '#111827';
    this.context.lineWidth = this.options?.minWidth || 2;

    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointerleave', this.handlePointerUp);
    canvas.addEventListener('pointercancel', this.handlePointerUp);

    this.clear();
  }

  clear(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.context) {
      return;
    }
    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }

  toDataURL(type?: string): string {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      return '';
    }
    return canvas.toDataURL(type);
  }

  startDraw(): void {
    this.drawStartEvent.emit();
  }

  endDraw(): void {
    this.drawEndEvent.emit();
  }

  private handlePointerDown = (event: PointerEvent): void => {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.context) {
      return;
    }

    const point = this.getPoint(event);
    this.isDrawing = true;
    this.lastX = point.x;
    this.lastY = point.y;

    this.context.beginPath();
    this.context.moveTo(this.lastX, this.lastY);
    this.startDraw();
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.isDrawing || !this.context) {
      return;
    }

    const point = this.getPoint(event);
    this.context.lineTo(point.x, point.y);
    this.context.stroke();

    this.lastX = point.x;
    this.lastY = point.y;
  };

  private handlePointerUp = (): void => {
    if (!this.isDrawing) {
      return;
    }

    this.isDrawing = false;
    this.endDraw();
  };

  private getPoint(event: PointerEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }
}
