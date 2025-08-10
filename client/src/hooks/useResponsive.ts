import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../utils/responsive';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const useResponsive = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      
      if (width < parseInt(BREAKPOINTS.mobile)) {
        setDeviceType('mobile');
      } else if (width < parseInt(BREAKPOINTS.tablet)) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet', 
    isDesktop: deviceType === 'desktop',
    windowSize
  };
};