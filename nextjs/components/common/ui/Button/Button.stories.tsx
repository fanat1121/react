import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';
import { BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_ELEMENTS } from './const/buttonVariants';

const meta = {
  title: 'Components/Common/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryButton: Story = {
  args: {
    children: 'Primary Button',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
};

export const SecondaryButton: Story = {
  args: {
    children: 'Secondary Button',
    variant: BUTTON_VARIANTS.SECONDARY,
  },
};

export const OutlineButton: Story = {
  args: {
    children: 'Outline Button',
    variant: BUTTON_VARIANTS.OUTLINE,
  },
};

export const SmallButton: Story = {
  args: {
    children: 'Small',
    size: BUTTON_SIZES.SMALL,
  },
};

export const MediumButton: Story = {
  args: {
    children: 'Medium',
    size: BUTTON_SIZES.MEDIUM,
  },
};

export const LargeButton: Story = {
  args: {
    children: 'Large',
    size: BUTTON_SIZES.LARGE,
  },
};

export const DisabledButton: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const LinkButton: Story = {
  args: {
    element: BUTTON_ELEMENTS.LINK,
    href: '/register',
    children: 'Link Button',
    variant: BUTTON_VARIANTS.PRIMARY,
  },
};

export const SignInButton: Story = {
  args: {
    element: BUTTON_ELEMENTS.LINK,
    href: '/login',
    children: 'Sign in',
    variant: BUTTON_VARIANTS.SECONDARY,
    size: BUTTON_SIZES.SMALL,
  },
};

export const RegisterButton: Story = {
  args: {
    element: BUTTON_ELEMENTS.LINK,
    href: '/UserRegist',
    children: 'Register',
    variant: BUTTON_VARIANTS.PRIMARY,
    size: BUTTON_SIZES.SMALL,
  },
};
