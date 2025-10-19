import { Injectable, signal } from '@angular/core';
import { Amigurumi, AmigurumiCategory, OFFICIAL_CATEGORIES } from '../models/amigurumi';

@Injectable({ providedIn: 'root' })
export class AmigurumiService {
  // Datos estÃ¡ticos de ejemplo. Puedes reemplazar URLs por imÃ¡genes en /public.
  private readonly data = signal<Amigurumi[]>([]);

  readonly amigurumis = this.data.asReadonly();
  private readonly categoriasOficiales = signal<AmigurumiCategory[]>([...OFFICIAL_CATEGORIES]);

  // CategorÃ­as oficiales provenientes de las subcarpetas de `spa`
  
  readonly categorias = this.categoriasOficiales.asReadonly();
  
  constructor() {
    const url = 'assets/images/spa/manifest.json';
    fetch(url)
      .then((r) => r.ok ? r.json() : [])
      .then((items: any) => {
        const normalized: Amigurumi[] = (Array.isArray(items) ? items : []).map((it: any) => ({
          id: String(it.id ?? ''),
          nombre: String(it.nombre ?? ''),
          categoria: it.categoria as AmigurumiCategory,
          descripcion: String(it.descripcion ?? ''),
          imagen: String((it.imagen ?? '')).replace(/^\/?assets\//, 'assets/'),
          etiquetas: Array.isArray(it.etiquetas) ? it.etiquetas : undefined
        }));
        this.data.set(normalized);
      })
      .catch(() => this.data.set([]));
  }

  getAll() {
    return this.amigurumis;
  }

  getCategorias() {
    return this.categorias;
  }
}



