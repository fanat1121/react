import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { DEMO_LINKS, DemoNav } from './DemoNav';

const meta = {
  title: 'JevDemo/DemoNav',
  component: DemoNav,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    current: '/jev-demo/score',
  },
} satisfies Meta<typeof DemoNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getAllByRole('link')).toHaveLength(DEMO_LINKS.length);
    expect(canvas.getByRole('link', { name: 'Score：丸のきれいさ' })).toHaveAttribute('aria-current', 'page');
    expect(canvas.getByRole('link', { name: 'Choice：図形判定' })).not.toHaveAttribute('aria-current');
  },
};
