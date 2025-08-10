// =============================================================================
// RESPONSIVE DESIGN UTILITIES
// =============================================================================

export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px'
} as const;

// CSS Media Queries
export const MEDIA_QUERIES = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobile})`,
  tablet: `@media (min-width: ${BREAKPOINTS.mobile}) and (max-width: ${BREAKPOINTS.tablet})`,
  desktop: `@media (min-width: ${BREAKPOINTS.tablet})`,
  largeDesktop: `@media (min-width: ${BREAKPOINTS.desktop})`
} as const;

// =============================================================================
// RESPONSIVE STYLES HELPERS
// =============================================================================

export const getResponsiveGrid = (mobile = 1, tablet = 2, desktop = 3) => ({
  display: 'grid',
  gap: '20px',
  gridTemplateColumns: `repeat(${mobile}, 1fr)`,
  
  [`@media (min-width: ${BREAKPOINTS.mobile})`]: {
    gridTemplateColumns: `repeat(${tablet}, 1fr)`
  },
  
  [`@media (min-width: ${BREAKPOINTS.tablet})`]: {
    gridTemplateColumns: `repeat(${desktop}, 1fr)`
  }
});

export const getResponsiveSpacing = (mobile: string, desktop: string) => ({
  padding: mobile,
  
  [`@media (min-width: ${BREAKPOINTS.tablet})`]: {
    padding: desktop
  }
});

// =============================================================================
// DEVICE DETECTION
// =============================================================================

export const useIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < parseInt(BREAKPOINTS.mobile);
};

export const useIsTablet = () => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= parseInt(BREAKPOINTS.mobile) && width < parseInt(BREAKPOINTS.tablet);
};

export const useIsDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= parseInt(BREAKPOINTS.tablet);
};