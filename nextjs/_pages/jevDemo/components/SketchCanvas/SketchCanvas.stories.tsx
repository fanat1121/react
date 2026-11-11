import { createRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import { SketchCanvas } from './SketchCanvas';

const meta = {
  title: 'JevDemo/SketchCanvas',
  component: SketchCanvas,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    canvasRef: createRef<HTMLCanvasElement>(),
    onStroke: fn(),
  },
} satisfies Meta<typeof SketchCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

/** キャンバス上で線を1本引く */
function drawLine(canvas: HTMLElement) {
  const rect = canvas.getBoundingClientRect();
  const at = (ratio: number) => ({
    clientX: rect.left + rect.width * ratio,
    clientY: rect.top + rect.height * ratio,
    pointerId: 1,
    bubbles: true,
  });
  canvas.dispatchEvent(new PointerEvent('pointerdown', at(0.2)));
  canvas.dispatchEvent(new PointerEvent('pointermove', at(0.5)));
  canvas.dispatchEvent(new PointerEvent('pointermove', at(0.8)));
  canvas.dispatchEvent(new PointerEvent('pointerup', at(0.8)));
}

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement).getByLabelText('図形を描くキャンバス') as HTMLCanvasElement;

    drawLine(canvas);
    expect(args.onStroke).toHaveBeenCalledTimes(1);

    // 線を引いた中央付近は黒、角は白のまま
    const context = canvas.getContext('2d')!;
    const center = context.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data;
    const corner = context.getImageData(2, canvas.height - 2, 1, 1).data;
    expect(center[0]).toBeLessThan(64);
    expect(corner[0]).toBe(255);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement).getByLabelText('図形を描くキャンバス');

    drawLine(canvas);
    expect(args.onStroke).not.toHaveBeenCalled();
  },
};

export const WithBox: Story = {
  args: { box: { top: 0.1, bottom: 0.6, left: 0.25, right: 0.75 } },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('img', { name: '見つかった範囲' });

    expect(box).toHaveStyle({ top: '10%', left: '25%', width: '50%', height: '50%' });
  },
};
