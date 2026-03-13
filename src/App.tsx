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

  // Convert 2 PM - 5 PM EST (April 23, 2026) to Local Time
  // ET is UTC-4 in April (EDT)
  const startTime = new Date('2026-04-23T14:00:00-04:00');
  const endTime = new Date('2026-04-23T17:00:00-04:00');

  const formatOptions: Intl.DateTimeFormatOptions = { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  };
  
  const localStart = startTime.toLocaleTimeString([], formatOptions);
  const localEnd = endTime.toLocaleTimeString([], formatOptions);
  
  // Check if it's actually different from the hardcoded EST time for clarity
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isEST = browserTimezone === 'America/New_York' || browserTimezone === 'EST5EDT';
  const timeDisplay = `${localStart} - ${localEnd}`;

  // Interactive Balloon State
  const [activeAnims, setActiveAnims] = useState<Record<number, string>>({});
  
  const balloons = [
    { id: 1, color: 'red', pos: 'left-top' },
    { id: 2, color: 'blue', pos: 'right-top' },
    { id: 3, color: 'yellow', pos: 'left-bottom' },
    { id: 4, color: 'purple', pos: 'center-left' },
    { id: 5, color: 'orange', pos: 'center-right' },
    { id: 6, color: 'green', pos: 'top-center' },
    { id: 7, color: 'red', pos: 'right-bottom' },
  ];

  const handleBalloonTap = (id: number) => {
    const animations = ['wiggle', 'pop', 'spin', 'bounce-click'];
    const randomAnim = animations[Math.floor(Math.random() * animations.length)];
    
    setActiveAnims(prev => ({ ...prev, [id]: randomAnim }));
    
    // Remove class after animation duration (800ms)
    setTimeout(() => {
      setActiveAnims(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 800);
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
                <p>{timeDisplay} <small>({isEST ? 'EST' : t('local_time_suffix')})</small></p>
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

        <div 
          className="decorations"
          style={{ 
            opacity: doorOpenProgress,
            transform: `scale(${0.9 + (scrollProgress * 0.1)})`
          }}
        >
          {balloons.map(b => (
            <div 
              key={b.id} 
              className={`balloon ${b.color} ${b.pos} ${activeAnims[b.id] || ''}`}
              onClick={() => handleBalloonTap(b.id)}
            />
          ))}
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
