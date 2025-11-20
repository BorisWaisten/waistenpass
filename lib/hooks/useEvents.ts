'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { EventDTO } from '../types';

export function useEvents() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch<EventDTO[]>('/events');
      setEvents(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refresh: fetchEvents };
}

export function useEvent(id?: string) {
  const [event, setEvent] = useState<EventDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setEvent(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch<EventDTO>(`/events/${id}`);
        if (!cancelled) {
          setEvent(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { event, loading, error };
}
