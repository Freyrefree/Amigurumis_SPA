import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Amigurumi, AmigurumiCategory } from '../../models/amigurumi';
import { AmigurumiService } from '../../services/amigurumi.service';
import { ImageModalComponent } from '../../components/image-modal/image-modal.component';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ImageModalComponent],
  animations: [
    trigger('listFade', [
      transition(':enter', [
        query('.ami-card', [
          style({ opacity: 0, transform: 'translateY(4px)' }),
          stagger(60, [
            animate('220ms ease-out', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private readonly svc = inject(AmigurumiService);
  readonly amigurumis = this.svc.getAll();
  readonly categorias = this.svc.getCategorias();

  readonly categoriaSeleccionada = signal<'Todos' | AmigurumiCategory>('Todos');
  readonly filtrados = computed<Amigurumi[]>(() => {
    const cat = this.categoriaSeleccionada();
    const list = this.amigurumis();
    return cat === 'Todos' ? list : list.filter((a) => a.categoria === cat);
  });

  readonly destacado = signal<Amigurumi | null>(null);

  // Modal de imagen
  readonly isModalOpen = signal(false);
  readonly modalImage = signal<string>('');
  readonly modalImages = signal<string[] | null>(null);
  readonly modalAlt = signal<string>('');

  constructor() {
    effect(() => {
      const list = this.filtrados();
      const current = this.destacado();
      if (!current || !list.some((a) => a.id === current.id)) {
        this.destacado.set(list[0] ?? null);
      }
    });
  }

  seleccionarCategoria(cat: 'Todos' | AmigurumiCategory) {
    this.categoriaSeleccionada.set(cat);
  }

  seleccionarDestacado(a: Amigurumi) {
    this.destacado.set(a);
  }

  openImage(item: Amigurumi) {
    this.modalImage.set(item.imagen);
    this.modalImages.set(item.galeria ?? null);
    this.modalAlt.set(item.nombre);
    this.isModalOpen.set(true);
  }

  closeImage() {
    this.isModalOpen.set(false);
  }
}
