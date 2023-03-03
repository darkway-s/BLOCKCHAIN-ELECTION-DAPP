import React, { useState } from 'react';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import BreadCrumb from '../../components/BreadCrumb';
import Navbar from '../../components/Navbar';
import { responsive, PROVINCE, DISTRICT, MUNICIPALITY, WARD_NO, SmartContract } from '../../constants';
import { registerVoter } from '../../utils/action';
import { toast } from 'react-toastify';
import { getConvertedAge, getFormattedErrorMessage } from '../../utils';

const VoterRegistration = () => {
  const [selectedProvince, setSelectProvince] = useState({ label: '', value: '' });
  const [voterDetails, setVoterDetails] = useState({
    fullName: "", citizenshipNumber: "", province: "", district: "", municipality: "", ward: "",
    email: "", profileUrl: null, dob: null
  });
  const loggedInAccountAddress = useSelector((state: any) => state.loggedInUserReducer.address);

  // upload voterDetails
  const onSubmit = async () => {
    try {
      const formData = new FormData();
      const {
        fullName,
        citizenshipNumber,
        province,
        district,
        municipality,
        ward, email,
        profileUrl, dob,
      } = voterDetails;

      formData.append("fullName", fullName);
      formData.append("citizenshipNumber", citizenshipNumber);
      formData.append("province", province);
      formData.append("district", district);
      formData.append("municipality", municipality);
      formData.append("ward", ward);
      formData.append("email", email);
      formData.append("profile", profileUrl);

      const { profile }: any = await registerVoter(formData);
      const age = getConvertedAge(dob);
      await SmartContract.methods.addVoter(
        fullName,
        citizenshipNumber,
        age,
        dob,
        email,
        profile,
        province,
        district,
        municipality,
        ward
      ).send({ from: loggedInAccountAddress });

      toast.success("New Voter registered successfully");
    } catch (error) {
      toast.error(`Failed to register !, ${getFormattedErrorMessage(error.message)}`, { toastId: 2 });
    }

  }

  return (
    <div className='mb-[50px]'>
      <Navbar /><br />
      <div className='w-full flex justify-center'>
        <div className={`${responsive} flex justify-start rounded-1 px-2`}>
          <BreadCrumb routes={["Voter Education", ["Voter Registration"]]} />
        </div>
      </div><br /><br />
      <div className='w-full flex justify-center'>
        <div className={`px-5 pt-4 pb-5 w-[550px] h-fit flex-col justify-between rounded-[2px] flex-wrap text-[15px] bg-slate-100 shadow-sm`}>
          <h4 className='mt-2 mb-4'>Fillup Details</h4>
          <div className='flex justify-between'>
            <div className='w-100 text-[15px]'>
              <span>Full Name &nbsp; &nbsp;(Acc. to Citizenship)</span>
              <input
                className='overrideInputStyle form-control px-3 py-[10px] rounded-1 mt-1'
                type="text"
                placeholder="E.g  John Doe"
                onChange={(e) => setVoterDetails({ ...voterDetails, fullName: e.target.value })}
              />
            </div>
          </div>
          <div className='flex justify-between mt-4'>
            <div className='w-100'>
              <span>Enter Citizenship Number</span>
              <input
                className='overrideInputStyle form-control px-3 py-[10px] rounded-1 mt-1'
                type="text"
                placeholder="E.g  0054-2334"
                onChange={(e) => setVoterDetails({ ...voterDetails, citizenshipNumber: e.target.value })}
              />
            </div>
          </div>
          <div className='flex justify-between my-4'>
            <div>
              <span>Province</span>
              <Select
                options={PROVINCE}
                className="w-[220px] mr-2 mt-1"
                placeholder={<div>Select Province</div>}
                onChange={(item) => {
                  setSelectProvince(item);
                  setVoterDetails({ ...voterDetails, province: item.label })
                }}
              />
            </div>
            <div>
              <span>District</span>
              <Select
                options={DISTRICT[selectedProvince.value]}
                className="w-[220px] mt-1"
                placeholder={<div>Select District</div>}
                onChange={(item: any) => {
                  setSelectProvince(item);
                  setVoterDetails({ ...voterDetails, district: item.label })
                }}
                isDisabled={selectedProvince?.label ? false : true}
              />
            </div>
          </div>
          <div className='flex justify-between'>
            <div>
              <span>Municipality</span>
              <Select
                options={MUNICIPALITY[selectedProvince.value]}
                className="w-[220px] mr-2 mt-1"
                placeholder={<div>Select Municipality</div>}
                onChange={(item: any) => {
                  setSelectProvince(item);
                  setVoterDetails({ ...voterDetails, municipality: item.label })
                }}
                isDisabled={voterDetails?.district ? false : true}
              />
            </div>
            <div>
              <span>Ward Number</span>
              <Select
                options={WARD_NO}
                className="w-[220px] mt-1"
                placeholder={<div>Select Ward</div>}
                onChange={(item: any) => {
                  setSelectProvince(item);
                  setVoterDetails({ ...voterDetails, ward: item.label })
                }}
                isDisabled={voterDetails?.municipality ? false : true}
              />
            </div>
          </div>
          <div className='flex justify-between mt-4'>
            <div className='w-100'>
              <span>DOB</span>
              <input
                className='form-control shadow-none outline-0 font-monospace'
                type="datetime-local"
                onChange={(e) => setVoterDetails({ ...voterDetails, dob: e.target.value })}
              />
            </div>
          </div>
          <div className='flex justify-between mt-4'>
            <div className='w-100'>
              <span>Email Address</span>
              <input
                className='overrideInputStyle form-control py-[10px] rounded-1 mt-1'
                type="email"
                onChange={(e) => setVoterDetails({ ...voterDetails, email: e.target.value })}
              />
            </div>
          </div>
          <div className='flex justify-between mt-4'>
            <div className='w-100'>
              <span>Choose Voter Photo</span>
              <input
                className='overrideInputStyle form-control py-[10px] rounded-1 mt-1'
                type="file"
                name="file"
                accept='image/*, image/jpeg, image/png, image/gif'
                onChange={(e) => setVoterDetails({ ...voterDetails, profileUrl: e.target.files[0] })}
              />
            </div>
          </div>
          <div className='flex justify-between mt-[30px] mb-1'>
            <button className='bg-blue-900 text-light py-2 w-100 rounded-[5px] hover:opacity-75' onClick={onSubmit}>Register</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoterRegistration;
