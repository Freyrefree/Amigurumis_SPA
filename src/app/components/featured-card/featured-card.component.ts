import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Amigurumi } from '../../models/amigurumi';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-featured-card',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.98)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':increment, :decrement', [
        style({ opacity: 0.2, transform: 'scale(0.98)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  template: `
    <div class="card border-0 shadow-sm overflow-hidden featured" [attr.data-category]="amigurumi?.categoria" [@fadeInScale]="amigurumi?.id">
      <div class="ratio ratio-21x9 bg-light position-relative overflow-hidden">
                <div class="ribbon" *ngIf="amigurumi">{{ amigurumi?.categoria }}</div>
        <img *ngIf="amigurumi" class="w-100 h-100 object-fit-cover" [src]="amigurumi.imagen" [alt]="amigurumi.nombre" />
      </div>
      <div class="card-body">
        <h2 class="h4 mb-2">{{ amigurumi?.nombre }}</h2>
        <span class="badge rounded-pill text-bg-primary">{{ amigurumi?.categoria }}</span>
        <p class="text-secondary mt-2 mb-0">{{ amigurumi?.descripcion }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .featured {
        border-radius: 1rem;
        
      }
      .object-fit-cover { object-fit: cover; }
      .ratio-21x9 { --bs-aspect-ratio: calc(9 / 21 * 100%); }
    `
  ]
})
export class FeaturedCardComponent {
  @Input() amigurumi: Amigurumi | null = null;
}




