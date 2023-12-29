import '../reactCOIServiceWorker';
import type { AppProps } from 'next/app';
import Layout from 'src/layout/Layout';
import NextNProgress from 'nextjs-progressbar';
import 'react-quill/dist/quill.snow.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <NextNProgress color="#2C978F" />
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}
