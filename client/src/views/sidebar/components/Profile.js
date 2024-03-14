import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from 'features/auth-slice/authSlice';
import { dateFromEpoch } from 'utils/dateFromEpoch';
import SelectionBox from './SelectionBox';

export default function Profile() {
  const theme = useSelector(state => state.theme.value);
  const user = useSelector(state => state.auth.value.user);
  const [photo, setPhoto] = useState({});
  const [profileEditStatus, setProfileEditStatus] = useState(false);
  const [profileDetails, setProfileDetails] = useState({ id: user.googleID, name: user.name, aboutMe: user.aboutMe, photoURL: user.photoURL });
  const [profileSwitch, setProfileSwitch] = useState(false);
  const [editThisProfile, setEditThisProfile] = useState(true);
  const dispatch = useDispatch();

  async function saveProfileChanges() {
    const formdata = new FormData();
    formdata.append('name', profileDetails.name.trim());
    formdata.append('aboutMe', profileDetails.aboutMe.trim());
    if (Object.keys(photo).length) formdata.append('profilePhoto', photo, `P-${user.googleID}.${photo.name.split('.').pop()}`);

    const response = await fetch('http://localhost:5000/update/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: formdata
    });

    const data = await response.json();
    setProfileEditStatus(false);
    dispatch(setUser({ ...user, ...profileDetails }));
    console.log(data);
  }

  function updateProfile(name, value) {
    if (name === 'photoURL') {
      console.log(value)
      const reader = new FileReader();
      reader.readAsDataURL(value);
      reader.onload = (e) => {
        setPhoto(value);
        setProfileDetails({ ...profileDetails, photoURL: e.target.result });
      }
      setProfileEditStatus(true);
      return ;
    }

    setProfileEditStatus(true);
    setProfileDetails({ ...profileDetails, [name]: value });
  }

  function resetChanges() {
    setProfileDetails({ id: user.googleID, name: user.name, aboutMe: user.aboutMe, photoURL: user.photoURL });
    setProfileEditStatus(false);
  }

  function selectGroupProfileForEdit() {
    setProfileSwitch(true);
    setEditThisProfile(false);
  }

  function selectUserProfileForEdit() {
    setProfileDetails({ id: user.googleID, name: user.name, aboutMe: user.aboutMe, photoURL: user.photoURL });
    setProfileSwitch(false);
    setEditThisProfile(true);
  }

  return (
    <>
      <p className='text-xl font-semibold'>Profiles</p>
      <div>
        <button onClick={() => selectUserProfileForEdit()} className={`py-4 mr-10 border-b-2 border-transparent hover:border-gray-600 hover:text-slate-600 text-sm ${theme.text600} font-semibold`}>User Profile</button>
        <button onClick={() => selectGroupProfileForEdit()} className={`py-4 mr-10 border-b-2 border-transparent hover:border-gray-600 hover:text-slate-600 text-sm ${theme.text600} font-semibold`}>Group Profiles</button>
      </div>
      <hr className={`mb-3 ${theme.border300}`} />

      { profileSwitch ? <SelectionBox profileDetails={profileDetails} setProfileDetails={setProfileDetails} setEditThisProfile={setEditThisProfile} /> : null }

      <div className={`w-full flex ${ editThisProfile ? 'visible' : 'invisible' }`}>
        <div className='w-1/2'>
          <p className='mb-1 font-bold text-xs'>DISPLAY NAME</p>
          <input onChange={(e) => updateProfile(e.target.name, e.target.value)} type="text" name="name" id="" value={profileDetails.name} className={`w-full px-2 py-1 focus:outline-none rounded ${theme.bg100}`} />
          <hr className={`my-3 ${theme.border300}`} />
          <p className='mb-1 font-bold text-xs'>{ profileSwitch ? 'DESCRIPTION' : 'ABOUT ME'}</p>
          <textarea onChange={(e) => updateProfile(e.target.name, e.target.value)} name={'aboutMe'} id="" cols="30" rows="5" value={profileSwitch ? profileDetails.description : profileDetails.aboutMe} className={`resize-none focus:outline-none w-full px-2 py-1 rounded ${theme.bg100}`}></textarea>
          <hr className={`my-3 ${theme.border300}`} />
          <p className='mb-1 font-bold text-xs'>PHOTO</p>
          <label className={`px-4 py-1 rounded text-xs ${theme.bg100} ${theme.hoverBg200}`}>Change Photo<input onChange={(e) => updateProfile(e.target.name, e.target.files[0])} type="file" name="photoURL" id="" className='w-0 h-0 hidden' /></label>
        </div>
        
        <div className='w-1/2 ml-8'>
          <p className='mb-1 font-bold text-xs'>PREVIEW</p>
          <div className={`rounded overflow-hidden shadow shadow-gray-400 ${theme.bg100}`}>
            <div className={`h-[9rem] p-4 ${theme.bg300}`}>
              <img src={profileDetails.photoURL} alt="" className='relative -bottom-16 size-24 rounded-full object-cover' />
            </div>
            <div className={`m-4 mt-14 p-2 text-xs rounded-lg ${theme.bg50}`}>
              <p className='text-lg font-bold'>{ profileDetails.name }</p>
              <p className='font-semibold'>{ profileDetails.id }</p>
              <hr className={`my-4 ${theme.border300}`} />
              <p className='font-semibold'>{ profileSwitch ? 'DESCRIPTION' : 'ABOUT ME'}</p>
              <p>{ profileSwitch ? profileDetails.description : profileDetails.aboutMe }</p>
              <hr className={`my-4 ${theme.border300}`} />
              <p className='font-semibold'>CHATME MEMBER SINCE</p>
              <p>{ dateFromEpoch(profileDetails.doj) }</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`absolute p-2 w-11/12 flex justify-between text-sm font-semibold rounded-lg transition-all ${profileEditStatus ? 'visible bottom-10' : 'invisible -bottom-10'} ${theme.bg200}`}>
        <p className='mt-1 px-4'>Careful - You have unsaved changes!</p>
        <div>
          <button onClick={() => resetChanges()} className={`px-3`}>Reset</button>
          <button onClick={() => saveProfileChanges()} className={`mx-2 px-3 py-1 rounded text-white ${theme.bg400} ${theme.hoverBg500}`}>Save Changes</button>
        </div>
      </div>
    </>
  )
}
