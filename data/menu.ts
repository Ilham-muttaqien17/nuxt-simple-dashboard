import type { Menu } from '~/types/ui/menu';

export const menus: Menu[] = [
  {
    label: 'Dashboard',
    path: '/',
    pages: ['index'],
    icon: 'heroicons:squares-2x2'
  },
  {
    label: 'Product',
    path: '/products',
    pages: ['products', 'products-id'],
    icon: 'heroicons:shopping-bag'
  }
];
