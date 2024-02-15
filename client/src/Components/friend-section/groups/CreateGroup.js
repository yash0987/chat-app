import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cameraIcon from '../../../img/camera.png';

export default function CreateGroup(props) {
  const [photo, setPhoto] = useState(cameraIcon);
  const [friendList, setFriendList] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchFriendList, setSearchFriendList] = useState([]);
  const [displayPanel, setDisplayPanel] = useState(true);
  const theme = useSelector(state => state.theme.value);

  useEffect(() => {
    async function getFriendList() {
      const response = await fetch('http://localhost:5000/friends/list', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      });
      const data = await response.json();
      setSearchFriendList(data);
      setFriendList(data);
    }

    getFriendList();

  }, [])

  async function previewPhoto(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setPhoto(e.target.result);
    }
  }

  function searchFriend(input) {
    const inputName = input.trim().toLowerCase();
    setTimeout(() => {
      setSearchFriendList(friendList.filter((friend) => friend.fullName.toLowerCase().includes(inputName)));
    }, 100);
  }

  function selectFriendForGroup(friend) {
    if (selectedFriends.indexOf(friend) !== -1) return ;
    setSelectedFriends([...selectedFriends, friend]);
    
  }

  function removeSelectedFriends(friendToRemove) {
    setSelectedFriends(selectedFriends.filter((friend) => friend !== friendToRemove));
  }

  return (
    <section className='grid grid-flow-row place-content-center w-screen h-screen absolute top-0 bg-black bg-opacity-40'>
      {
        displayPanel ?
        <div className={`grid grid-flow-row relative px-3 py-5 w-[27rem] rounded ${theme.bg100}`}>
          <button onClick={() => props.setEnableCreateGroupPanel(false)} className={`p-1 absolute right-1 rounded-full text-gray-600`}>&#10005;</button>
          <h2 className={`text-xl font-bold place-self-center ${theme.text800}`}>Add friends to your group</h2>
          <p className='text-sm'>Choose at least one friend.</p>
          <input onChange={(e) => searchFriend(e.target.value)} type="text" name="" id="" className={`my-2 px-2 py-1 rounded border-b-[1px] focus:outline-none ${theme.placeholderText400} ${theme.bg200}`} placeholder='Search for friends' />
          <div className='flex flex-wrap max-h-32 overflow-y-scroll'>
            {
              selectedFriends.map((friend) => {
                return <div className={`grid grid-flow-col place-items-center m-1 text-xs rounded-full ${theme.bg300}`}>
                  <img src={friend.photoURL} alt="" className='w-6 rounded-full' />
                  <p className='px-1'>{friend.fullName}</p>
                  <button className='pr-2' onClick={() => removeSelectedFriends(friend)}>&#10005;</button>
                </div>
              })
            }
          </div>
          <hr className={`mt-2 ${theme.border300}`} />
          <div className='max-h-48 overflow-y-scroll'>
            {
              searchFriendList.length !== 0 ? 
              searchFriendList.map((friend) => {
                return <div className={`grid grid-flow-col justify-between p-2 rounded-lg font-semibold ${theme.hoverBg50}`}>
                  <div className='grid grid-flow-col items-center'>
                    <img src={ friend.photoURL } alt="" className='w-8 rounded-full' />
                    <p className='mx-3'>{ friend.fullName }</p>
                  </div>
                  <button onClick={() => selectFriendForGroup(friend)} className={`my-1 px-2 text-xs text-gray-700 rounded border-[1px] border-gray-600`}>Add</button>
                </div>
              }) : <p className='flex justify-center my-10'>No result found</p>
            }
          </div>
          <hr className={`mb-2 ${theme.border300}`} />
          <div className='flex justify-end'>
            <button onClick={() => setDisplayPanel(false)} disabled={selectedFriends.length <= 1} className={`px-4 py-1 rounded text-sm ${theme.text50} ${theme.bg400}`}>Next</button>
          </div>
        </div>
        :
        <div className={`grid grid-flow-row relative w-[27rem] px-3 py-5 rounded ${theme.bg100}`}>
          <button onClick={() => props.setEnableCreateGroupPanel(false)} className={`p-1 absolute right-1 rounded-full text-gray-600`}>&#10005;</button>
          <h2 className={`text-xl font-bold place-self-center ${theme.text800}`}>Create Your Group</h2>
          <p className={`text-sm place-self-center`}>Give your new group a personality with a name and an icon. You can always change it later.</p>
          
          <label style={{backgroundImage: `url('${photo}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}} className='my-4 size-16 relative place-self-center rounded-full border-2 border-dashed border-gray-500'>
            <input onChange={(e) => previewPhoto(e)} type="file" name="" id="" accept='image/*' className='hidden w-0 h-0' />
          </label>
          
          <p className='my-1 font-semibold text-xs text-gray-600'>GROUP NAME</p>
          <input type="text" name="" id="" className={`px-2 py-1 rounded focus:outline-none ${theme.bg200}`} />
          <p className='my-1 font-semibold text-xs text-gray-600'>GROUP ID</p>
          <input type="text" name="" id="" className={`px-2 py-1 rounded focus:outline-none ${theme.bg200}`} />
          <p className='my-1 text-xs'>
            - Choose unique GROUP ID <br /> 
            - ID should only contain A-Z, a-z and 0-9 characters.
          </p>

          <div className='flex justify-between mt-5 text-sm'>
            <button onClick={() => setDisplayPanel(true)} className={`${theme.text700}`}>Back</button>
            <button className={`px-4 py-1 rounded ${theme.text50} ${theme.bg400}`}>Create</button>
          </div>
        </div>
      }
    </section>
  )
}
