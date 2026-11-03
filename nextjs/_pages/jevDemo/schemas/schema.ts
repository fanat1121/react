import { z } from 'zod';
import { TARGET_MAX_LENGTH } from '../const/box';
import { STATEMENT_MAX_LENGTH } from '../const/noul';

// Jev は PNG / JPEG の静止画のみ受け付ける
const IMAGE_DATA_URL_PATTERN = /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/;
const MAX_FRAMES_PER_SECTION = 8;

const frameList = z.array(z.string().regex(IMAGE_DATA_URL_PATTERN)).min(1).max(MAX_FRAMES_PER_SECTION);

export const judgeRequestSchema = z.object({
  frames: z.object({
    opening: frameList,
    whole: frameList,
    ending: frameList,
  }),
});

export type JudgeRequest = z.infer<typeof judgeRequestSchema>;

export const shapeRequestSchema = z.object({
  drawing: z.string().regex(IMAGE_DATA_URL_PATTERN),
});

export type ShapeRequest = z.infer<typeof shapeRequestSchema>;

const drawing = z.string().regex(IMAGE_DATA_URL_PATTERN);

export const scoreRequestSchema = z.object({ drawing });

export type ScoreRequest = z.infer<typeof scoreRequestSchema>;

export const noulRequestSchema = z.object({
  drawing,
  statement: z.string().trim().min(1).max(STATEMENT_MAX_LENGTH),
});

export type NoulRequest = z.infer<typeof noulRequestSchema>;

export const boxRequestSchema = z.object({
  drawing,
  target: z.string().trim().min(1).max(TARGET_MAX_LENGTH),
});

export type BoxRequest = z.infer<typeof boxRequestSchema>;
