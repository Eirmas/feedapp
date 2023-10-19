import { z } from 'zod';

export const createPollSchema = z.object({
  title: z.string().trim().min(1).max(255),
  question: z.string().trim().min(1).max(255),
  private: z.boolean().optional(),
  emails: z.array(z.string().email()).optional(),
});

export const updatePollSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  question: z.string().trim().min(1).max(255).optional(),
  private: z.boolean().optional(),
});

export const createInviteSchema = z.object({
  email: z.string().email(),
});

export const deleteInviteSchema = z.object({
  email: z.string().email(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[a-zA-Z\u00C0-\u01BF\s'-]*[a-zA-Z\u00C0-\u01BF][a-zA-Z\u00C0-\u01BF\s'-]*$/)
    .optional(),
  avatar: z.string().url().optional(),
});

export const createVoteSchema = z.object({
  answer: z.boolean(),
});
