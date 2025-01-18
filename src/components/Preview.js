import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-web';

function Preview({ lottieData, isPlaying, onTogglePlay }) {
  const animationContainer = useRef(null);
  const animationInstance = useRef(null);

  useEffect(() => {
    if (animationContainer.current && lottieData) {
      animationInstance.current = Lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: isPlaying,
        animationData: lottieData
      });
    }

    return () => {
      if (animationInstance.current) {
        animationInstance.current.destroy();
      }
    };
  }, [lottieData]);

  useEffect(() => {
    if (animationInstance.current) {
      if (isPlaying) {
        animationInstance.current.play();
      } else {
        animationInstance.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div 
      ref={animationContainer}
      style={{ width: '100%', height: '100%' }}
      onClick={onTogglePlay}
    />
  );
}

export default Preview;