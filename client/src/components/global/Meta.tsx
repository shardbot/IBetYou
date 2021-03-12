import Head from 'next/head';
import { FC } from 'react';

interface MetaProps {
  title: string;
}

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;

console.log('ENVIRONMENT variable');
console.log(ENVIRONMENT);

export const Meta: FC<MetaProps> = ({ title }) => {
  return (
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      <title>{title}</title>

      <link rel="icon" href="/favicon.ico" />

      {ENVIRONMENT === 'main' && (
        <>
          {/* Global site tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_ID}');`
            }}
          />

          {/* Hotjar Tracking Code for ibetyou.xyz */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:2292430,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')`
            }}
          />
        </>
      )}
    </Head>
  );
};
