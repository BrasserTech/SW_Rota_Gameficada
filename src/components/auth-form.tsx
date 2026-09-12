'use client';
import { useState } from 'react';
import { ArrowRight, Compass, ShieldCheck, Store } from 'lucide-react';

const accounts = [
  { label: 'Visitante', email: 'visitante@rota.demo', icon: Compass },
  { label: 'Estabelecimento', email: 'parceiro@rota.demo', icon: Store },
  { label: 'Admin', email: 'admin@rota.demo', icon: ShieldCheck },
];

export default function AuthForm({ busy, onSubmit }: { busy: boolean; onSubmit: (action: string, payload: Record<string, unknown>) => void }) {
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selected, setSelected] = useState('');
  return <>
    <p className="muted">Encontre novos lugares e faça parte de uma cidade mais conectada.</p>
    <div className="auth-tabs"><button className={!register ? 'selected' : ''} onClick={() => setRegister(false)}>Entrar</button><button className={register ? 'selected' : ''} onClick={() => { setRegister(true); setEmail(''); setPassword(''); setSelected(''); }}>Criar conta</button></div>
    {!register && <div className="login-shortcuts"><span className="shortcut-label">EXPERIMENTE COM UM PERFIL</span><div className="shortcut-options">{accounts.map(({ label, email: accountEmail, icon: Icon }) => <button key={accountEmail} type="button" disabled={busy} aria-pressed={selected === accountEmail} className={selected === accountEmail ? 'selected' : ''} onClick={() => { setEmail(accountEmail); setPassword('Demo@2026'); setSelected(accountEmail); }}><Icon size={19} />{label}</button>)}</div><p role="status">{selected ? 'E-mail e senha preenchidos. Clique em “Entrar na minha conta”.' : 'Selecione um perfil para preencher os dados de demonstração.'}</p></div>}
    <form onSubmit={event => { event.preventDefault(); onSubmit(register ? 'register' : 'login', Object.fromEntries(new FormData(event.currentTarget))); }}>
      {register && <label className="field">Seu nome<input name="name" autoComplete="name" required /></label>}
      <label className="field">E-mail<input name="email" type="email" autoComplete="email" required value={email} onChange={event => { setEmail(event.target.value); setSelected(''); }} /></label>
      <label className="field">Senha<input name="password" type="password" autoComplete={register ? 'new-password' : 'current-password'} minLength={8} maxLength={72} placeholder="No mínimo 8 caracteres" required value={password} onChange={event => { setPassword(event.target.value); setSelected(''); }} /></label>
      {register && <label className="field">Quero participar como<select name="role"><option value="VISITANTE">Visitante • explorar a cidade</option><option value="ESTABELECIMENTO">Estabelecimento • divulgar meu negócio</option></select></label>}
      <button className="primary full" disabled={busy}>{busy ? 'Aguarde…' : register ? 'Criar minha conta' : 'Entrar na minha conta'}<ArrowRight size={17} /></button>
    </form>
  </>;
}
