import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';

export default function SelectionBox(props) {
  const [toggleSelect, setToggleSelect] = useState(false);
  const theme = useSelector(state => state.theme.value);
  const user = useSelector(state => state.auth.value.user);

  async function selectGroup(group) {
    const data = await fetchRequest({ url: `http://localhost:5000/groupinfo/${group.id}`, method: 'GET' });
    props.setProfileDetails({ ...group, description: data.description, doj: data.doj });
    props.setOldProfileDetails({ ...group, description: data.description, doj: data.doj });
    props.setEditThisProfile(true);
    setToggleSelect(prevState => prevState ^ 1);
  }

  return (
    <div className='relative mb-4 text-sm'>
      <p className='mb-1 font-bold text-xs'>CHOOSE GROUP</p>
      { 
        Object.keys(props.profileDetails).includes('description') ? <button disabled={props.profileEditStatus} onClick={() => setToggleSelect(prevState => prevState ^ 1)} className={`flex w-full px-3 py-2 select-none rounded ${theme.bg200}`}>
          <img src={props.profileDetails.photoURL} alt="" className='size-9 object-cover rounded-full' />
          <p className='px-4 py-2'>{props.profileDetails.name}</p>
        </button> : <p onClick={() => setToggleSelect(prevState => prevState ^ 1)} className={`px-4 py-2 select-none rounded ${theme.bg200}`}>Select Group</p>
      }
      
      {
          toggleSelect ? <div className={`absolute z-10 w-full shadow shadow-gray-400 rounded overflow-hidden ${theme.bg50}`}> { 
          user.groups.map((group) => {
            return <div onClick={() => selectGroup(group)} className={`flex px-3 py-2 select-none ${theme.hoverBg100}`}>
              <img src={group.photoURL} alt="" className='size-9 object-cover rounded-full select-none' />
              <p className='px-4 py-2'>{group.name}</p>
            </div>
          })
        } </div> : null
      }
    <p className='text-xs py-2'>Note: Only Admin can edit group profile details</p>
    </div>
  )
}
