import Link from 'next/link';
import { requireAdminPage } from '@/app/lib/auth';
import LogoutButton from './LogoutButton';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: '管理画面', robots: { index: false, follow: false } };
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return <div className="admin-shell"><header className="admin-nav"><Link href="/admin/projects" className="admin-brand">Portfolio studio</Link><nav aria-label="管理メニュー"><Link href="/admin/projects">制作物</Link><Link href="/admin/threads">お問い合わせ</Link><a href="/" target="_blank" rel="noreferrer">サイトを見る ↗</a><LogoutButton /></nav></header>{children}</div>;
}
