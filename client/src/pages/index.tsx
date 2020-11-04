import { FC } from 'react';

import { MainLayout } from '../components/layouts';
import { StepList } from '../components/steps';
import { ARROWS_IMG_SRC } from '../constants';
import steps from '../data/steps.json';
import styles from '../styles/modules/pages/Home.module.scss';
import { PageWithLayout } from '../types';

const Home: FC = () => {
  return (
    <>
      <div className={styles.mainWrapper}>
        {/*  FIRST PARAGRAPH */}
        <p className={styles.text}>
          Everyone has that arrogant friend who is always sure he is 100% right. Sometimes its your
          spouse, sometimes it’s a loud annoying colleague. The one that thinks he knows everything
          about MMA, NBA, football, politics. If only he was the coach, prime minister.. if they
          have him 5 minutes he would fix all. Of course you have. Everyone has. Well now you have a
          simple way to shut them up. How? Read on
        </p>
        {/* DIVIDER */}
        <span className={styles.divider} />
        {/*  FIRST PARAGRAPH */}
        <p className={styles.text}>
          She thinks you will never quit smoking? Why not bet on it? He thinks Manchester would be
          the next UEFA champion? Why not bet on it? Connor is better than Khabib? Put your money
          where your mouth is! BTC will be 100.000$ by the end of 2021. Prove your conviction and
          make it interesting mo%’&%’&er!
        </p>
        {/*  ARROWS */}
        <img className={styles.arrows} src={ARROWS_IMG_SRC} alt="Arrows down" />
        {/*  VIDEO PLACEHOLDER*/}
        <div
          style={{
            background: '#fff',
            margin: '0 8rem',
            height: '550px'
          }}
        />
      </div>
      {/* STEPS */}
      <div className={styles.stepsWrapper}>
        <StepList steps={steps} />
      </div>

      {/*BOTTOM*/}
      <div>
        <p className={styles.text}>I BET YOU that you will click on the button below this text!</p>
      </div>
    </>
  );
};

(Home as PageWithLayout).Layout = MainLayout;

export default Home;
