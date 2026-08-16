import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const VisitorTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Ignore admin routes to avoid tracking owner's actions in visitor count
    if (location.pathname.startsWith('/admin')) return;

    const recordHit = async () => {
      try {
        await fetch('https://creative-upliftment-production-c7fd.up.railway.app/api/visitors/hit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            referrer: document.referrer || 'Direct',
            path: location.pathname,
          }),
        });
      } catch (error) {
        console.error('Visitor hit tracking failed:', error);
      }
    };

    recordHit();
  }, [location.pathname]);

  return null;
};

export default VisitorTracker;
