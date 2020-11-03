import { FC } from 'react';

import { MainLayout } from '../components/layouts';
import { PageWithLayout } from '../types';

const Home: FC = () => {
  return (
    <>
      <section
        style={{
          marginTop: '16rem'
        }}>
        {/*  FIRST PARAGRAPH */}
        <p
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: '1.813em',
            lineHeight: '1.55'
          }}>
          Everyone has that arrogant friend who is always sure he is 100% right. Sometimes its your
          spouse, sometimes it’s a loud annoying colleague. The one that thinks he knows everything
          about MMA, NBA, football, politics. If only he was the coach, prime minister.. if they
          have him 5 minutes he would fix all. Of course you have. Everyone has. Well now you have a
          simple way to shut them up. How? Read on
        </p>
        {/* DIVIDER */}
        <span
          style={{
            display: 'block',
            width: '40%',
            borderTop: 'solid 1px #ffc400',
            margin: '4rem auto'
          }}
        />
        <p
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: '1.813em',
            lineHeight: '1.55'
          }}>
          She thinks you will never quit smoking? Why not bet on it? He thinks Manchester would be
          the next UEFA champion? Why not bet on it? Connor is better than Khabib? Put your money
          where your mouth is! BTC will be 100.000$ by the end of 2021. Prove your conviction and
          make it interesting mo%’&%’&er!
        </p>
      </section>
    </>
  );
};

(Home as PageWithLayout).Layout = MainLayout;

export default Home;
