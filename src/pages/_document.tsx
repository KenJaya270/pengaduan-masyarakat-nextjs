import { Html, Head, Main, NextScript} from 'next/document';

export default function Document(){

    return (
        <Html lang='id'>
            <Head>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>
            <body className={`antialiased`}>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}