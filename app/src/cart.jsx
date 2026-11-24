import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { byId } from './data.js';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);
const KEY = 'b92-cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } });
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ } }, [items]);

  const v = useMemo(() => {
    const lines = items.map((i) => ({ ...i, p: byId(i.id) })).filter((l) => l.p);
    return {
      lines, open, setOpen, toast,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.qty * l.p.final, 0),
      add: (id, qty = 1, msg = '') => {
        setItems((o) => (o.find((x) => x.id === id) ? o.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x)) : [...o, { id, qty }]));
        setToast(msg || 'Added'); setTimeout(() => setToast(''), 1800);
      },
      setQty: (id, qty) => setItems((o) => (qty <= 0 ? o.filter((x) => x.id !== id) : o.map((x) => (x.id === id ? { ...x, qty } : x)))),
      clear: () => setItems([])
    };
  }, [items, open, toast]);
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
