import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FooterComponent } from './Footer';

const meta = {
  title: 'Components/Common/Footer',
  component: FooterComponent,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FooterComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
