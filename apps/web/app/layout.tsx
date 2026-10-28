import './globals.css';
export const metadata = { title: '学习记录 · Learning Notes', description: 'Personal English learning notes' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN" suppressHydrationWarning><body>{children}</body></html>;
}
