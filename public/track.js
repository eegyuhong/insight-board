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

  const payload = {
    project,
    url: window.location.href,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    screen_width: window.innerWidth || 0,
    screen_height: window.innerHeight || 0,
    session_id: sessionId,
  };

  // 체류 시간 포함하여 전송하는 함수
  const sendTrackingData = () => {
    const stayDuration = Math.round((Date.now() - visitStart) / 1000); // 초 단위
    fetch('https://ygfawnxknmyphzroozfc.supabase.co/functions/v1/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true, // 페이지 닫힐 때도 전송 시도
      body: JSON.stringify({
        ...payload,
        stay_duration: stayDuration,
        timestamp: new Date().toISOString(),
      }),
    }).catch((err) => {
      console.warn('[InsightBoard] tracking failed:', err);
    });
  };

  // 사용자가 페이지를 닫거나 이동할 때 체류시간 포함 전송
  window.addEventListener('beforeunload', sendTrackingData);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendTrackingData();
    }
  });
})();
