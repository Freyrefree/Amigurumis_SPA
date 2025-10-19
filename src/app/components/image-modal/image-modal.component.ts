import { Component, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-modal" *ngIf="visible" (click)="onBackdrop($event)">
      <div class="dialog shadow-soft" role="dialog" aria-modal="true">
        <button type="button" class="btn-close" aria-label="Cerrar" (click)="close()"></button>
        <div class="content">
          <img [src]="src" [alt]="alt || 'Imagen'" />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .image-modal { position: fixed; inset: 0; z-index: 1080; display: grid; place-items: center; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(4px); }
      .dialog { position: relative; max-width: min(95vw, 1200px); max-height: 90vh; border-radius: 16px; background: var(--surface); overflow: hidden; }
      .content { display: grid; place-items: center; width: 100%; height: 100%; background: #0000; }
      img { max-width: 95vw; max-height: 85vh; width: auto; height: auto; display: block; border-radius: 12px; }
      .btn-close { position: absolute; top: .75rem; right: .75rem; z-index: 2; background: color-mix(in srgb, #fff 85%, var(--pastel-lilac)); border-radius: 999px; padding: .6rem; opacity: .9; }
      .btn-close:hover { opacity: 1; }
      @media (max-width: 576px) {
        .dialog { width: 96vw; }
        img { max-width: 92vw; max-height: 75vh; }
      }
    `
  ]
})
export class ImageModalComponent {
  @Input() visible = false;
  @Input() src = '';
  @Input() alt = '';
  @Output() closed = new EventEmitter<void>();

  close() { this.closed.emit(); }

  onBackdrop(ev: MouseEvent) {
    if ((ev.target as HTMLElement).classList.contains('image-modal')) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape') onEsc() { if (this.visible) this.close(); }
}

