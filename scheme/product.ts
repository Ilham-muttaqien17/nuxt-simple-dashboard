import { z } from 'zod';

export const CreateProduct = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number().positive().min(1, 'Price is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.coerce.number().positive().min(1, 'Category Id is required'),
  images: z.array(z.string().min(1, 'Image url is not valid')).min(1, 'Images is required')
});

export const UpdateProduct = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  price: z.number().positive().min(1, 'Price is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  categoryId: z.coerce.number().positive().min(1, 'Category Id is required').optional(),
  images: z.array(z.string().min(1, 'Image url is not valid')).min(1, 'Images is required').optional()
});

export type TCreateProduct = z.infer<typeof CreateProduct>;
export type TUpdateProduct = z.infer<typeof UpdateProduct>;
