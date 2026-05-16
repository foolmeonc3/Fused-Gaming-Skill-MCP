/**
 * SyncPulse Icon System - Type Definitions
 * Comprehensive type safety for icon usage across the application
 */

/**
 * Navigation icons for primary UI navigation
 */
export type NavigationIcon = 'home' | 'dashboard' | 'settings' | 'help' | 'logout';

/**
 * Status icons for displaying system and operation states
 */
export type StatusIcon = 'active' | 'inactive' | 'pending' | 'error' | 'warning' | 'success';

/**
 * Action icons for user interactions and operations
 */
export type ActionIcon = 'play' | 'pause' | 'stop' | 'retry' | 'rollback' | 'delete' | 'edit';

/**
 * Agent icons for swarm orchestration components
 */
export type AgentIcon = 'orchestrator' | 'sentinel' | 'analyst' | 'executor';

/**
 * Utility icons for miscellaneous UI elements
 */
export type UtilityIcon = 'bell' | 'user';

/**
 * All available icon names in the SyncPulse icon system
 */
export type IconName =
  | NavigationIcon
  | StatusIcon
  | ActionIcon
  | AgentIcon
  | UtilityIcon;

/**
 * Icon size variants
 * sm: 16px (compact UI elements)
 * md: 24px (default/standard)
 * lg: 32px (large/prominent)
 */
export type IconSize = 'sm' | 'md' | 'lg';

/**
 * Semantic color variants for icons
 * primary: Brand color (cyan/primary)
 * secondary: Secondary brand color
 * success: Green (positive states)
 * warning: Yellow/Orange (caution states)
 * danger: Red (error/destructive)
 * neutral: Gray (neutral/disabled)
 */
export type IconColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';

/**
 * Icon style variants
 * solid: Filled icon
 * outline: Stroked icon (default)
 */
export type IconVariant = 'solid' | 'outline';

/**
 * SVG icon definition
 */
export interface IconDefinition {
  name: IconName;
  viewBox: string;
  path: string | string[];
  strokeWidth?: number;
  category: 'navigation' | 'status' | 'action' | 'agent' | 'utility';
}

/**
 * Icon component props
 */
export interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: IconColor;
  variant?: IconVariant;
  className?: string;
  title?: string;
  'aria-label'?: string;
}

/**
 * Size mapping in pixels
 */
export const ICON_SIZES: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

/**
 * Color mapping for CSS variables/Tailwind classes
 */
export const ICON_COLORS: Record<IconColor, string> = {
  primary: 'currentColor',
  secondary: 'currentColor',
  success: 'currentColor',
  warning: 'currentColor',
  danger: 'currentColor',
  neutral: 'currentColor',
};
