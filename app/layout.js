import './globals.css';
import { AuthProvider } from './context/AuthContext';

export const metadata = {
  title: 'Tuấn Em',
  description: 'Ứng dụng thương mại điện tử và blog hiện đại với Next.js.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        {/* Bao bọc ứng dụng bằng AuthProvider để quản lý đăng nhập toàn cục */}
        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}