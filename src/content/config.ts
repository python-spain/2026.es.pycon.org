import { defineCollection, z } from 'astro:content';

// Define the sponsors collection
const sponsors = defineCollection({
  type: 'content', // 'content' for .md/.mdx files (or 'data' for .json/.yaml)
  schema: ({ image }) => z.object({
    name: z.string(),
    url: z.string().url(),
    // Define the exact allowed tiers (Keystone, Diamond, etc.)
    tier: z.enum(['keystone', 'diamond', 'platinum', 'gold', 'silver', 'bronze']),
    // Astro will automatically optimize the image
    logo: image().refine((img) => img.width >= 100, {
      message: "Logo must be at least 100px wide",
    }),
  }),
});

export const collections = { sponsors };
