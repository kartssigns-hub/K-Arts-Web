import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll position on navigation.
 *
 * Without this, moving from a scrolled homepage to /catalog lands the visitor
 * halfway down the new page. Hash links (/#works) are left alone so in-page
 * anchors still work.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0 });
    // Deliberately not watching `search`: the catalog keeps its filters in the
    // query string, and jumping to the top on every keystroke would be hostile.
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
