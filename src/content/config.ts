import { defineCollection, z } from 'astro:content';

const menuCollection = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(
      z.object({
        label: z.string(),
        href: z.string().optional(),
        // optional
        children: z.array(
          z.object({
            label: z.string(),
            href: z.string(),
          })
        ).optional(),
      })
    )
  })
});

export const collections = {
 'menu': menuCollection,
};