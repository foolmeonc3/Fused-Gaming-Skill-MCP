/**
 * Icon System Type Definitions
 * Core TypeScript types for the SyncPulse icon system
 */

import type { SVGAttributes } from 'react';

/**
 * All available icon names in the registry
 */
export type IconName =
  // Navigation Icons
  | 'home'
  | 'dashboard'
  | 'settings'
  | 'help'
  | 'logout'
  // Status Icons
  | 'active'
  | 'inactive'
  | 'pending'
  | 'error'
  | 'warning'
  | 'success'
  // Action Icons
  | 'play'
  | 'pause'
  | 'stop'
  | 'retry'
  | 'rollback'
  | 'delete'
  | 'edit'
  // Agent Icons
  | 'orchestrator'
  | 'sentinel'
  | 'analyst'
  | 'executor'
  // Utility Icons
  | 'bell'
  | 'user';

/**
 * Icon size options for consistent scaling
 */
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Icon color options for semantic coloring
 */
export type IconColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';

/**
 * Icon rendering variant style
 */
export type IconVariant = 'outline' | 'fill';

/**
 * Icon category for grouping and organization
 */
export type IconCategory = 'navigation' | 'status' | 'action' | 'agent' | 'utility';

/**
 * Complete icon definition structure
 */
export interface IconDefinition {
  name: IconName;
  viewBox: string;
  path: string | string[];
  strokeWidth?: number;
  category: IconCategory;
}

/**
 * Props for the Icon component
 */
export interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: IconSize;
  color?: IconColor;
  variant?: IconVariant;
  className?: string;
  title?: string;
  'aria-label'?: string;
}

/**
 * Size pixel mappings for different icon sizes
 */
export const ICON_SIZES: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};
