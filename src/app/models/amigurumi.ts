// Categorías oficiales según subcarpetas en `src/app/assets/images/spa`
export const OFFICIAL_CATEGORIES = [
  'Accesorios',
  'Flores',
  'Llaveros',
  'Personajes',
  'Personalizados'
] as const;

export type AmigurumiCategory = typeof OFFICIAL_CATEGORIES[number];

export interface Amigurumi {
  id: string;
  nombre: string;
  categoria: AmigurumiCategory;
  descripcion: string;
  imagen: string; // URL relativa a /public o absoluta
  galeria?: string[]; // imágenes adicionales para modal/slider
  etiquetas?: string[];
}
