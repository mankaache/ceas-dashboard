import React from 'react';

export const useDeviceDimensions = () => {
  const [dimensions, setDimensions] = React.useState<{
    innerHeight: number | undefined;
    outerHeight: number | undefined;
    innerWidth: number | undefined;
    outerWidth: number | undefined;
  }>({
    innerHeight: undefined,
    outerHeight: undefined,
    innerWidth: undefined,
    outerWidth: undefined,
  });

  React.useEffect(() => {
    // const handleResize = () => {
    //   setDimensions({
    //     innerHeight: window.innerHeight,
    //     outerHeight: window.outerHeight,
    //     innerWidth: window.innerWidth,
    //     outerWidth: window.outerWidth,
    //   });
    // };

    const handleResize = () => {
      const { innerWidth } = dimensions;
      if (innerWidth !== window.innerWidth) {
        setDimensions({
          innerHeight: window.innerHeight,
          outerHeight: window.outerHeight,
          innerWidth: window.innerWidth,
          outerWidth: window.outerWidth,
        });
      }
    };

    if (typeof window !== 'undefined') {
      handleResize(); // Initial dimensions

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [dimensions]);

  return dimensions;
};
