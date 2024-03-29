import Head from 'next/head';
import React from 'react';
import Navbar from '../../components/Navbar';
import { ElectionFrameworkOverview, responsive } from '../../constants';
import { useTranslations } from 'next-intl';

const Overview = () => {
  const t = useTranslations("electoral_framework");

  return (
    <div className='constitutional--provision--container'>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <Navbar />
      <div className='flex lg:justify-center mt-3 mb-5 px-3 lg:px-0'>
        <div className={`${responsive} flex flex-col justify-between rounded-1 flex-wrap lg:px-3 sm:w-full`}>
          <h4 className='my-3'>{t("title")}</h4>
          <ul className='list-group'>
            {ElectionFrameworkOverview.map((d: string, i: number) => {
              return (<li key={i} className='list-group-item py-3'>{t(`item${i + 1}`)}</li>)
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Overview;
