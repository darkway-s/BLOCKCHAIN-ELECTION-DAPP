import React from 'react';
import ElectionOfficeCard from '../../components/ElectionOfficeCard';
import Navbar from '../../components/Navbar';
import { responsive, StateProvinceOffices, DistrictOffices } from '../../constants';

const Privacy = () => {
  return (
    <div className='constitutional--provision--container'>
      <Navbar />
      <div className='flex justify-center mt-3 mb-5 px-3 lg:px-0'>
        <div className={`${responsive} flex justify-between rounded-1 flex-wrap lg:px-3`}>
          <div>
            <h5 className='my-4'>State Election Offices</h5>
            <div className='state--ofice flex flex-wrap justify-between'>
              {StateProvinceOffices
                && StateProvinceOffices.map((name, i) => <ElectionOfficeCard officeName={name} key={i} />)
              }
            </div>
          </div>
          <div className='my-3'>
            <h5 className='my-4'>District Election Offices</h5>
            <div className='state--ofice flex flex-wrap justify-between'>
              {DistrictOffices
                && DistrictOffices.map((name, i) => <ElectionOfficeCard officeName={name} key={i} />)
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy;