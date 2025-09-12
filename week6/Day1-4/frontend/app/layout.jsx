import './globals.css';
import Providers from '@/components/Providers';
import StripeProvider from './_providers/StripeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'E-Shop',
  description: 'E-commerce app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <StripeProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </StripeProvider>
        </Providers>
      </body>
    </html>
  );
}
