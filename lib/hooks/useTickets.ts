'use client';

import { useCallback, useEffect, useState } from 'react';
import { authFetch } from '../api';
import { TicketDTO } from '../types';

export function useTickets(userId?: string) {
  const [tickets, setTickets] = useState<TicketDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = userId ? `/tickets?userId=${userId}` : '/tickets';
      const data = await authFetch<TicketDTO[]>(url);
      setTickets(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refresh: fetchTickets };
}

export function usePurchaseTicket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchase = useCallback(async (eventId: string, price: number, currency: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authFetch<{ tickets: TicketDTO[]; total: number; totalPrice: number }>('/tickets', {
        method: 'POST',
        json: {
          eventId,
          price,
          currency,
          quantity
        }
      });
      return response;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { purchase, loading, error };
}
