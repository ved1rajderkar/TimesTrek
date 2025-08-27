import React, { useEffect, useRef } from 'react';

interface AudioManagerProps {
  isMusicEnabled: boolean;
  isSoundEnabled: boolean;
}

const AudioManager: React.FC<AudioManagerProps> = ({ isMusicEnabled, isSoundEnabled }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const startBackgroundMusic = async () => {
      if (isMusicEnabled && !audioContextRef.current) {
        try {
          // Create audio context
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          
          // Create oscillator for gentle background tone
          oscillatorRef.current = audioContextRef.current.createOscillator();
          gainNodeRef.current = audioContextRef.current.createGain();
          
          // Set up a gentle, low-volume background tone
          oscillatorRef.current.frequency.setValueAtTime(220, audioContextRef.current.currentTime); // A3 note
          oscillatorRef.current.type = 'sine';
          
          // Very low volume for background ambience
          gainNodeRef.current.gain.setValueAtTime(0.02, audioContextRef.current.currentTime);
          
          // Connect nodes
          oscillatorRef.current.connect(gainNodeRef.current);
          gainNodeRef.current.connect(audioContextRef.current.destination);
          
          // Start the tone
          oscillatorRef.current.start();
          
          // Create a gentle frequency modulation for a more pleasant sound
          const lfo = audioContextRef.current.createOscillator();
          const lfoGain = audioContextRef.current.createGain();
          
          lfo.frequency.setValueAtTime(0.5, audioContextRef.current.currentTime); // Very slow modulation
          lfoGain.gain.setValueAtTime(10, audioContextRef.current.currentTime); // Small frequency variation
          
          lfo.connect(lfoGain);
          lfoGain.connect(oscillatorRef.current.frequency);
          lfo.start();
          
        } catch (error) {
          console.log('Audio context not available:', error);
        }
      }
    };

    const stopBackgroundMusic = () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
          oscillatorRef.current = null;
        } catch (error) {
          console.log('Error stopping oscillator:', error);
        }
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };

    if (isMusicEnabled) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }

    // Cleanup function
    return () => {
      stopBackgroundMusic();
    };
  }, [isMusicEnabled]);

  useEffect(() => {
    if (isSoundEnabled) {
      console.log('Sound effects enabled');
    } else {
      console.log('Sound effects disabled');
    }
  }, [isSoundEnabled]);

  // Play sound effect function
  const playSuccessSound = () => {
    if (!isSoundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Success sound: ascending notes
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play success sound:', error);
    }
  };

  // Expose sound functions globally for other components to use
  useEffect(() => {
    (window as any).playSuccessSound = playSuccessSound;
  }, [isSoundEnabled]);

  return null;
};

export default AudioManager;