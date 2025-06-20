(function () {
  const currentScript = document.currentScript;
  if (!currentScript) return;

  const project = currentScript.getAttribute('data-project-id');

  if (!project) {
    console.warn('[InsightBoard] project id (pid) missing in script URL.');
    return;
  }

  const sessionId =
    localStorage.getItem('insight_session_id') ||
    (() => {
      const id = crypto.randomUUID();
      localStorage.setItem('insight_session_id', id);
      return id;
    })();

  const visitStart = Date.now();

  const payloadBase = {
    project,
    url: window.location.href,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    screen_width: window.innerWidth || 0,
    screen_height: window.innerHeight || 0,
    session_id: sessionId,
  };

  let hasSent = false; // 중복 전송 방지

  const sendTrackingData = () => {
    if (hasSent) return;
    hasSent = true;

    const stayDuration = Math.round((Date.now() - visitStart) / 1000);

    const fullPayload = {
      ...payloadBase,
      stay_duration: stayDuration,
      timestamp: new Date().toISOString(),
    };

    try {
      const blob = new Blob([JSON.stringify(fullPayload)], {
        type: 'application/json',
      });

      const ok = navigator.sendBeacon(
        'https://ygfawnxknmyphzroozfc.supabase.co/functions/v1/track',
        blob,
      );

      if (!ok) {
        console.warn('[InsightBoard] sendBeacon failed to queue request.');
      }
    } catch (err) {
      console.warn('[InsightBoard] sendBeacon error:', err);
    }
  };

  window.addEventListener('beforeunload', sendTrackingData);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendTrackingData();
    }
  });
})();
