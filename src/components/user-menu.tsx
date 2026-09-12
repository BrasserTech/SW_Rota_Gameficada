'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import type { AppData } from '@/lib/types';

export default function UserMenu({ user, onProfile }: { user: NonNullable<AppData['user']>; onProfile: () => void }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const role = { ADMIN: 'Administrador', ESTABELECIMENTO: 'Estabelecimento', VISITANTE: 'Visitante' }[user.role];
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <div className="user-menu" ref={container} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
    <button ref={trigger} className="user-button" aria-expanded={open} aria-controls="account-dropdown" onClick={() => setOpen(!open)}>
      <span className="avatar">{user.name.slice(0, 1)}</span>
      <span className="user-name"><span className="account-name">{user.name}</span><small>{role}</small></span>
      <ChevronDown size={14} className={open ? 'chevron-open' : ''} />
    </button>
    {open && <div id="account-dropdown" className="account-dropdown">
      <div className="account-summary"><strong>{user.name}</strong><span>{role}</span></div>
      <button onClick={() => { setOpen(false); onProfile(); }}><Users size={17} />Abrir perfil</button>
    </div>}
  </div>;
}
