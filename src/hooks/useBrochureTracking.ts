import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'lp_brochure_session';

const getSessionId = () => {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

type Event = {
  event_type: 'open' | 'page_view';
  page_index: number;
  page_kicker?: string | null;
  dwell_ms?: number | null;
};

const send = (e: Event) => {
  void supabase.from('lp_brochure_views').insert({
    session_id: getSessionId(),
    event_type: e.event_type,
    page_index: e.page_index,
    page_kicker: e.page_kicker ?? null,
    dwell_ms: e.dwell_ms ?? null,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
  });
};

/**
 * Records an "open" event once per brochure session and a "page_view" event
 * (with dwell time on the previous page) each time the reader turns a page.
 */
export const useBrochureTracking = (index: number, kicker?: string) => {
  const opened = useRef(false);
  const enteredAt = useRef(Date.now());
  const prev = useRef<{ index: number; kicker?: string } | null>(null);

  useEffect(() => {
    if (!opened.current) {
      opened.current = true;
      send({ event_type: 'open', page_index: index, page_kicker: kicker });
    } else if (prev.current) {
      send({
        event_type: 'page_view',
        page_index: prev.current.index,
        page_kicker: prev.current.kicker,
        dwell_ms: Date.now() - enteredAt.current,
      });
    }
    enteredAt.current = Date.now();
    prev.current = { index, kicker };
  }, [index, kicker]);

  // Flush the last page's dwell time when the reader leaves.
  useEffect(() => {
    const flush = () => {
      if (document.visibilityState !== 'hidden' || !prev.current) return;
      send({
        event_type: 'page_view',
        page_index: prev.current.index,
        page_kicker: prev.current.kicker,
        dwell_ms: Date.now() - enteredAt.current,
      });
      prev.current = null;
    };
    document.addEventListener('visibilitychange', flush);
    return () => document.removeEventListener('visibilitychange', flush);
  }, []);
};

/**
 * Fires a lightweight tracking pixel for reach-out intent on the contact sheet
 * (sheet reached, email/phone clicked, form started, form submitted).
 */
export const trackBrochurePixel = (
  event_type: 'contact_view' | 'contact_click' | 'contact_start' | 'contact_submit' | 'ddq_submit',
  page_index: number,
  page_kicker?: string | null,
) => {
  send({ event_type: event_type as Event['event_type'], page_index, page_kicker });
};
