import React, { useState, useEffect, useRef } from 'react';

function fmt(elapsed) {
  let h   = Math.floor(elapsed / (1000 * 60 * 60));
  let m   = Math.floor((elapsed / (1000 * 60)) % 60);
  let s   = Math.floor((elapsed / 1000) % 60);
  let ms  = Math.floor((elapsed % 1000) / 10);
  return {
    main: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`,
    ms: String(ms).padStart(2,'0'),
  };
}
 
export default function Timer() {
  const [running, setRunning]   = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [laps, setLaps]         = useState([]);
  const intervalref             = useRef(null);
  const starttimeref            = useRef(0);
 
  useEffect(() => {
    if (running) {
      intervalref.current = setInterval(() => {
        setElapsed(Date.now() - starttimeref.current);
      }, 10);
    }
    return () => clearInterval(intervalref.current);
  }, [running]);
 
  function start() {
    starttimeref.current = Date.now() - elapsed;
    setRunning(true);
  }
 
  function stop() {
    setRunning(false);
  }
 
  function reset() {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  }
 
  function lap() {
    setLaps(prev => [...prev, elapsed]);
  }
 
  const { main, ms } = fmt(elapsed);
 
  return (
    <>
      
      <div className="sw-root">
        <div className="sw-card">
          <div className="sw-label">
            Stopwatch <span className={`sw-dot ${running ? 'active' : ''}`} />
          </div>
 
          <div className="sw-display-wrap">
            <div className={`sw-display ${running ? 'running' : ''}`}>
              {main}
            </div>
          </div>
          <div className="sw-ms-label">.{ms}</div>
 
          <div className="sw-divider" />
 
          <div className="sw-buttons">
            {!running
              ? <button className="sw-btn sw-btn-start" onClick={start}>
                  {elapsed > 0 ? 'Resume' : 'Start'}
                </button>
              : <button className="sw-btn sw-btn-stop" onClick={stop}>Pause</button>
            }
            <button className="sw-btn sw-btn-reset" onClick={reset}>Reset</button>
            <button className="sw-btn sw-btn-lap" onClick={lap} disabled={!running}>Lap</button>
          </div>
 
          {laps.length > 0 && (
            <div className="sw-laps">
              {[...laps].reverse().map((lapTime, i) => {
                const idx     = laps.length - i;
                const prev    = laps[laps.length - i - 2] ?? 0;
                const delta   = lapTime - prev;
                const { main: lt } = fmt(lapTime);
                const { main: dt } = fmt(delta);
                return (
                  <div className="sw-lap-row" key={idx}>
                    <span className="sw-lap-num">Lap {idx}</span>
                    <span className="sw-lap-delta">+{dt.split(':')[2]}s</span>
                    <span className="sw-lap-time">{lt}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
 