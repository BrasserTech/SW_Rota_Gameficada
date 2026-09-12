import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Rota Viva • Cada descoberta conta', description: 'Explore Florianópolis, valorize o comércio local e transforme suas descobertas em pontos.', manifest: '/manifest.webmanifest', appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Rota Viva' }, icons: { icon: '/icon.svg', apple: '/icons/icon-192.png' } };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#1263e6' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="pt-BR"><body>{children}</body></html>; }
