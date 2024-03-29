import Head from 'next/head';
import React from 'react';
import Navbar from '../../components/Navbar';
import { ElectionFrameworkLaws, responsive } from '../../constants';
import { useTranslations } from 'next-intl';

const ElectionLaws = () => {
  const t = useTranslations("election_laws");

  return (
    <div className='constitutional--provision--container'>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <Navbar />
      <div className='flex justify-center mt-3 mb-5 px-3 lg:px-0'>
        <div className={`${responsive} flex flex-col justify-between rounded-1 flex-wrap lg:px-3`}>
          <h4 className='my-4'>{t("title")}</h4>
          {
            Object.keys(ElectionFrameworkLaws).map((id: string, i: number) => {
              return (
                <div className='my-3' key={i + 1}>
                  <h4 key={i}>{i + 1}. {id}</h4>
                  <ul className='list-group'>
                    {ElectionFrameworkLaws[id].map((d: string, i: number) => {
                      return (<li key={i} className='list-group-item py-3'>{d}</li>)
                    })}
                  </ul>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default ElectionLaws;
