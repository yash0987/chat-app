import React from 'react';
import { useSelector } from 'react-redux';
import { dateFromEpoch } from 'utils/dateFromEpoch';

export default function Profile(props) {
  const theme = useSelector(state => state.theme.value);
  const user = useSelector(state => state.auth.value.user);

  return (
    <>
      <p className='text-xl font-semibold'>Profiles</p>
      <div>
        <button className={`py-4 mr-10 border-b-2 border-transparent hover:border-gray-600 hover:text-slate-600 text-sm ${theme.text600} font-semibold`}>User Profile</button>
        <button className={`py-4 mr-10 border-b-2 border-transparent hover:border-gray-600 hover:text-slate-600 text-sm ${theme.text600} font-semibold`}>Group Profiles</button>
      </div>
      <hr className={`mb-3 ${theme.border300}`} />

      <div className='w-full flex'>
        <div className='w-1/2'>
          <p className='mb-1 font-bold text-xs'>DISPLAY NAME</p>
          <input type="text" name="" id="" value={user.firstName + " " + user.familyName} className={`w-full px-2 py-1 focus:outline-none rounded ${theme.bg100}`} />
          <hr className={`my-3 ${theme.border300}`} />
          <p className='mb-1 font-bold text-xs'>ABOUT ME</p>
          <textarea name="" id="" cols="30" rows="5" className={`resize-none focus:outline-none w-full px-2 py-1 rounded ${theme.bg100}`}>{user.aboutMe}</textarea>
          <hr className={`my-3 ${theme.border300}`} />
          <p className='mb-1 font-bold text-xs'>PHOTO</p>
          <label className={`px-4 py-1 rounded text-xs ${theme.bg100} ${theme.hoverBg200}`}>Change Photo<input type="file" name="" id="" className='w-0 h-0 hidden' /></label>
        </div>
        
        <div className={`w-1/2 ml-8 rounded overflow-hidden shadow shadow-gray-400 ${theme.bg100}`}>
          <div className={`h-[9rem] p-4 ${theme.bg300}`}>
            <img src={user.photoURL} alt="" className='relative -bottom-16 size-24 rounded-full object-cover' />
          </div>
          <div className={`m-4 mt-14 p-2 text-xs rounded-lg ${theme.bg50}`}>
            <p className='text-lg font-bold'>{ user.firstName + " " + user.familyName }</p>
            <p className='font-semibold'>{ user.googleID }</p>
            <hr className={`my-4 ${theme.border300}`} />
            <p className='font-semibold'>{ user.isGroup ? 'DESCRIPTION' : 'ABOUT ME'}</p>
            <p>{ user.isGroup ? user.description : user.aboutMe }</p>
            <hr className={`my-4 ${theme.border300}`} />
            <p className='font-semibold'>CHATME MEMBER SINCE</p>
            <p>{ dateFromEpoch(user.doj) }</p>
          </div>
        </div>
      </div>

      <div className={`absolute bottom-10 p-2 w-11/12 flex justify-between text-sm font-semibold rounded-lg ${theme.bg200}`}>
        <p className='mt-1 px-4'>Careful - You have unsaved changes!</p>
        <div>
          <button className={`px-3`}>Reset</button>
          <button className={`mx-2 px-3 py-1 rounded text-white ${theme.bg400} ${theme.hoverBg500}`}>Save Changes</button>
        </div>
      </div>
    </>
  )
}
