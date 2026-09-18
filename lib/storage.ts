import { HistoryItem } from '@/types/payment';

const STORAGE_KEY = 'splitupi_history_v1';
const MAX_HISTORY_ITEMS = 20;

export function getStoredHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Failed to read payment history from localStorage:', error);
    return [];
  }
}

export function saveHistoryItem(item: Omit<HistoryItem, 'id' | 'createdAt'>): HistoryItem | null {
  if (typeof window === 'undefined') return null;
  try {
    const history = getStoredHistory();
    const newItem: HistoryItem = {
      ...item,
      id: `split_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    // Keep most recent first, limit to MAX_HISTORY_ITEMS
    const updated = [newItem, ...history.filter(h => h.id !== newItem.id)].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  } catch (error) {
    console.error('Failed to save payment history to localStorage:', error);
    return null;
  }
}

export function deleteHistoryItem(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const history = getStoredHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete history item:', error);
    return false;
  }
}

export function clearHistory(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear history:', error);
    return false;
  }
}
