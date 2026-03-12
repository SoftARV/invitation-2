import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './App.scss';
import bgMusic from './assets/Toy Story - You\'ve Got a Friend in Me (Instrumental) [ustrOyrmLOA].mp3';

function App() {
  const { t } = useTranslation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far down we've scrolled (0 to 1)
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const currentScroll = window.scrollY;
      
      const progress = Math.min(Math.max(currentScroll / maxScroll, 0), 1);
      setScrollProgress(progress);
      
      // Update audio volume and try to play if stopped
      if (audioRef.current) {
        // Fade volume from 0 to 0.5 max based on progress
        audioRef.current.volume = progress * 0.5;
        
        if (progress > 0) {
          if (audioRef.current.paused) {
            audioRef.current.play().catch(() => {
              // Browser might block autoplay without explicit click interaction first
            });
          }
        } else {
          // Pause entirely when the door is fully closed
          if (!audioRef.current.paused) {
            audioRef.current.pause();
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Attempt to start playing at volume 0 immediately (browsers may require interaction first)
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(() => {});
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const doorOpenProgress = Math.min(scrollProgress * 1.5, 1);
  const zoomProgress = Math.max(0, (scrollProgress - 0.6) * 2.5);

  const handleDoorClick = () => {
    // Explicitly try to play on click to unlock audio context in browsers
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
    // Automatically open the invitation by scrolling to the bottom
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="birthday-app">
      {/* 
        This empty div creates the artificial scroll height. 
        We use it to drive the scroll animation while the actual content stays fixed.
      */}
      <div className="scroll-track" />

      {/* Hidden audio element */}
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />

      {/* The visible UI container, fixed position */}
      <div className="fixed-container">
        
        {/* The Invitation Content (behind the door) */}
        <div 
          className="invitation-content"
          style={{ 
            opacity: doorOpenProgress,
            transform: `scale(${0.9 + (scrollProgress * 0.1)})`
          }}
        >
          <div className="decorations">
            <div className="balloon red"></div>
            <div className="balloon blue"></div>
            <div className="balloon yellow"></div>
          </div>
          
          <div className="card">
            <h1>{t('invited')}</h1>
            <div className="stars">{t('stars')}</div>
            <h2>{t('subtitle')}</h2>
            
            <p className="message">
              {t('message').split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
              ))}
            </p>
            
            <div className="details">
              <div className="detail-item">
                <span className="icon">📅</span>
                <p>{t('date_label')}</p>
              </div>
              <div className="detail-item">
                <span className="icon">⏰</span>
                <p>{t('time_label')}</p>
              </div>
              <div className="detail-item">
                <span className="icon">📍</span>
                <p>{t('location_name')}<br/>{t('location_address')}</p>
              </div>
            </div>
            
            <div className="actions">
              <button className="rsvp-btn" onClick={() => alert(t('rsvp_confirmed'))}>{t('rsvp')}</button>
              <a href="https://meet.google.com/your-meet-link" target="_blank" rel="noopener noreferrer" className="meet-btn">{t('meet')}</a>
            </div>
          </div>
        </div>

        {/* The 3D Room and Door */}
        <div 
          className="room-scene"
          style={{
            transform: `scale(${1 + zoomProgress * 10})`,
            opacity: 1 - Math.max(0, zoomProgress)
          }}
        >
          {/* Scroll down indicator when door is closed */}
          <div 
            className="scroll-indicator" 
            style={{ opacity: 1 - scrollProgress * 5 }}
          >
            <p>{t('scroll_hint')}</p>
            <div className="arrow">↓</div>
          </div>
          
          <div className="door-frame" onClick={handleDoorClick}>
            {/* The single white door */}
            <div 
              className="door"
              style={{
                // Open inwards (negative rotation) up to -110 degrees
                transform: `rotateY(${-110 * doorOpenProgress}deg)`
              }}
            >
              <div className="door-panel"></div>
              <div className="door-panel"></div>
              <div className="door-handle"></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;
