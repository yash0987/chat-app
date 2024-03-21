import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, updateUserGroups } from 'features/auth-slice/authSlice';
import { dateFromEpoch } from 'utils/dateFromEpoch';
import SelectionBox from './SelectionBox';

export default function Profile(props) {
  const theme = useSelector(state => state.theme.value);
  const user = useSelector(state => state.auth.value.user);
  const [photo, setPhoto] = useState({});
  const [profileDetails, setProfileDetails] = useState({ id: user.googleID, name: user.name, aboutMe: user.aboutMe, photoURL: user.photoURL, doj: user.doj });
  const [oldProfileDetails, setOldProfileDetails] = useState({ id: user.googleID, name: user.name, aboutMe: user.aboutMe, photoURL: user.photoURL, doj: user.doj });
  const [profileSwitch, setProfileSwitch] = useState(false);
  const [editThisProfile, setEditThisProfile] = useState(true);
  const dispatch = useDispatch();

  async function saveProfileChanges() {
    const formdata = new FormData();
    formdata.append('id', profileDetails.id); 
    formdata.append('name', profileDetails.name.trim());
    formdata.append('photoURL', profileDetails.photoURL);
    profileSwitch ?
    formdata.append('description', profileDetails.description.trim()) :
    formdata.append('aboutMe', profileDetails.aboutMe.trim());
    if (photo.name) formdata.append('profilePhoto', photo, `P-${profileDetails.id}.${photo.name.split('.').pop()}`);

    const uri = profileSwitch ? 'http://localhost:5000/group/update/profile' : 'http://localhost:5000/update/profile';
    const response = await fetch(uri, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: formdata
    });

    const data = await response.json();
    props.setProfileEditStatus(false);
    profileSwitch ? 
    dispatch(updateUserGroups({ id: profileDetails.id, name: profileDetails.name, photoURL: profileDetails.photoURL }))
    : dispatch(setUser({ ...user, ...profileDetails }));
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
      props.setProfileEditStatus(true);
      return ;
    }

    props.setProfileEditStatus(true);
    setProfileDetails({ ...profileDetails, [name]: value });
  }
  
  function resetChanges() {
    setProfileDetails(oldProfileDetails);
    props.setProfileEditStatus(false);
  }
  
  function selectGroupProfileForEdit() {
    setProfileSwitch(true);
    setEditThisProfile(false);
  }
  
  function selectUserProfileForEdit() {
    setProfileDetails({ id: user.googleID, name: user.name, aboutMe: user.aboutMe, photoURL: user.photoURL, doj: user.doj });
    setOldProfileDetails({ id: user.googleID, name: user.name, aboutMe: user.aboutMe, photoURL: user.photoURL, doj: user.doj });
    setProfileSwitch(false);
    setEditThisProfile(true);
  }

  return (
    <>
      <p className='text-xl font-semibold'>Profiles</p>
      <div>
        <button disabled={props.profileEditStatus} onClick={() => selectUserProfileForEdit()} className={`py-4 mr-10 border-b-2 border-transparent hover:border-gray-600 hover:text-slate-600 text-sm ${theme.text600} font-semibold`}>User Profile</button>
        <button disabled={props.profileEditStatus} onClick={() => selectGroupProfileForEdit()} className={`py-4 mr-10 border-b-2 border-transparent hover:border-gray-600 hover:text-slate-600 text-sm ${theme.text600} font-semibold`}>Group Profiles</button>
      </div>
      <hr className={`mb-3 ${theme.border300}`} />

      { profileSwitch ? <SelectionBox profileEditStatus={props.profileEditStatus} profileDetails={profileDetails} setProfileDetails={setProfileDetails} setEditThisProfile={setEditThisProfile} setOldProfileDetails={setOldProfileDetails} /> : null }

      <div className={`w-full flex ${ editThisProfile ? 'visible' : 'invisible' }`}>
        <div className='w-1/2'>
          <p className='mb-1 font-bold text-xs'>DISPLAY NAME</p>
          <input onChange={(e) => updateProfile(e.target.name, e.target.value)} type="text" name="name" id="" value={profileDetails.name} className={`w-full px-2 py-1 focus:outline-none rounded ${theme.bg100}`} />
          <hr className={`my-3 ${theme.border300}`} />
          <p className='mb-1 font-bold text-xs'>{ profileSwitch ? 'DESCRIPTION' : 'ABOUT ME'}</p>
          <textarea onChange={(e) => updateProfile(e.target.name, e.target.value)} name={profileSwitch ? 'description' : 'aboutMe'} id="" cols="30" rows="5" value={profileSwitch ? profileDetails.description : profileDetails.aboutMe} className={`resize-none focus:outline-none w-full px-2 py-1 rounded ${theme.bg100}`}></textarea>
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

      <div className={`absolute p-2 w-11/12 flex justify-between text-sm font-semibold rounded-lg transition-all ${props.profileEditStatus ? 'visible bottom-10' : 'invisible -bottom-10'} ${theme.bg200}`}>
        <p className='mt-1 px-4'>Careful - You have unsaved changes!</p>
        <div>
          <button onClick={() => resetChanges()} className={`px-3`}>Reset</button>
          <button onClick={() => saveProfileChanges()} className={`mx-2 px-3 py-1 rounded text-white ${theme.bg400} ${theme.hoverBg500}`}>Save Changes</button>
        </div>
      </div>
    </>
  )
}
