/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_FORMSPREE_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "motion/react" {
  import type {
    ComponentType,
    HTMLAttributes,
    ButtonHTMLAttributes,
    ReactNode,
  } from "react";

  type MotionExtra = {
    initial?: unknown;
    animate?: unknown;
    exit?: unknown;
    transition?: unknown;
    whileHover?: unknown;
    whileTap?: unknown;
  };

  export const motion: {
    div: ComponentType<HTMLAttributes<HTMLDivElement> & MotionExtra>;
    button: ComponentType<ButtonHTMLAttributes<HTMLButtonElement> & MotionExtra>;
  };

  export const AnimatePresence: ComponentType<{ children?: ReactNode }>;
}
