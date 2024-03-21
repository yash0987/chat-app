import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserGroups } from 'features/auth-slice/authSlice';
import cameraIcon from 'assets/camera.png';
import useFetch from 'hooks/useFetch';

export default function CreateGroup(props) {
  const [photo, setPhoto] = useState("");
  const [newGroup, setNewGroup] = useState({});
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchFriendList, setSearchFriendList] = useState([]);
  const [style1, setStyle1] = useState('');
  const [style2, setStyle2] = useState('');
  const [displayPanel, setDisplayPanel] = useState(true);
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();
  const friendList = useFetch({ url: 'http://localhost:5000/friends/list' })[0];

  useEffect(() => {
    setSearchFriendList(friendList)
    // eslint-disable-next-line
  }, [friendList]);

  async function sendData() {
    const formdata = new FormData();
    formdata.append('groupPhoto', photo);
    formdata.append('group', JSON.stringify({ ...newGroup, photoURL: "" }));
    formdata.append('friends', JSON.stringify(selectedFriends));
    console.log(selectedFriends);

    const response = await fetch('http://localhost:5000/group', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: formdata
    });
    const data = await response.json();

    if (data.success === 'Choose another ID') {
      setStyle2('text-red-500');
      setTimeout(() => setStyle2(''), 800);
      return ;
    }

    props.setEnableCreateGroupPanel(false);
    dispatch(setUserGroups(newGroup));
  }

  async function previewPhoto(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewGroup({ ...newGroup, photoURL: e.target.result });
    }
    reader.readAsDataURL(file);
    setPhoto(file);
  }

  function validateGroupID(groupid) {
    for (let i = 0; i < groupid.length; i++) {
      if (!((groupid[i] >= 'A' && groupid[i] <= 'Z') || (groupid[i] >= 'a' && groupid[i] <= 'z') || (groupid[i] >= '0' && groupid[i] <= '9'))) {
        setStyle1('text-red-500');
        setTimeout(() => setStyle1(''), 800);
      }
    }
    setNewGroup({ ...newGroup, id: groupid });
  }

  function searchFriend(input) {
    const inputName = input.trim().toLowerCase();
    setTimeout(() => {
      setSearchFriendList(friendList.filter((friend) => friend.name.toLowerCase().includes(inputName)));
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
    <section className='grid grid-flow-row place-content-center w-screen h-screen absolute top-0 left-0 z-10 bg-black bg-opacity-40'>
      {
        displayPanel ?
        <div className={`grid grid-flow-row relative px-3 py-5 w-[27rem] rounded ${theme.bg100}`}>
          <button onClick={() => props.setEnableCreateGroupPanel(false)} className={`p-1 absolute right-1 rounded-full text-gray-600`}>&#10005;</button>
          <h2 className={`text-xl font-bold place-self-center ${theme.text800}`}>Add friends to your group</h2>
          <p className='text-sm'>Choose at least one friend.</p>
          <input onChange={(e) => searchFriend(e.target.value)} type="text" name="" id="" className={`my-2 px-2 py-1 rounded border-b-[1px] focus:outline-none ${theme.placeholderText400} ${theme.bg200}`} placeholder='Search for friends' />
          <div className='flex flex-wrap max-h-32 overflow-y-scroll'>
            {
              selectedFriends.map((friend, index) => {
                return <div key={index} className={`grid grid-flow-col place-items-center m-1 text-xs rounded-full ${theme.bg300}`}>
                  <img src={friend.photoURL} alt="" className='w-6 rounded-full' />
                  <p className='px-1'>{friend.name}</p>
                  <button className='pr-2' onClick={() => removeSelectedFriends(friend)}>&#10005;</button>
                </div>
              })
            }
          </div>
          <hr className={`mt-2 ${theme.border300}`} />
          <div className='max-h-48 overflow-y-scroll'>
            {
              searchFriendList.length ?
              searchFriendList.map((friend) => {
                return <div key={friend.id} className={`grid grid-flow-col justify-between p-2 rounded-lg font-semibold ${theme.hoverBg50}`}>
                  <div className='grid grid-flow-col items-center'>
                    <img src={ friend.photoURL } alt="" className='w-8 rounded-full' />
                    <p className='mx-3'>{ friend.name }</p>
                  </div>
                  <button onClick={() => selectFriendForGroup(friend)} className={`my-1 px-2 text-xs text-gray-700 rounded border-[1px] border-gray-600`}>Add</button>
                </div>
              }) : <p className='flex justify-center my-10'>No result found</p>
            }
          </div>
          <hr className={`mb-2 ${theme.border300}`} />
          <div className='flex justify-end'>
            <button onClick={() => setDisplayPanel(false)} disabled={selectedFriends.length === 0} className={`px-4 py-1 rounded text-sm ${theme.text50} ${theme.bg400}`}>Next</button>
          </div>
        </div>
        :
        <div className={`grid grid-flow-row relative w-[27rem] px-3 py-5 rounded ${theme.bg100}`}>
          <button onClick={() => props.setEnableCreateGroupPanel(false)} className={`p-1 absolute right-1 rounded-full text-gray-600`}>&#10005;</button>
          <h2 className={`text-xl font-bold place-self-center ${theme.text800}`}>Create Your Group</h2>
          <p className={`text-sm place-self-center`}>Give your new group a personality with a name and an icon. You can always change it later.</p>
          
          <label style={{backgroundImage: `url('${newGroup.photoURL ? newGroup.photoURL : cameraIcon}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}} className='my-4 size-16 relative place-self-center rounded-full border-2 border-dashed border-gray-500'>
            <input onChange={(e) => previewPhoto(e)} type="file" name="" id="" accept='image/*' className='hidden w-0 h-0' />
          </label>
          
          <p className='my-1 font-semibold text-xs text-gray-600'>GROUP NAME</p>
          <input onChange={(e) => setNewGroup({...newGroup, name: e.target.value.trim()})} type="text" name="" id="" className={`px-2 py-1 rounded focus:outline-none ${theme.bg200}`} />
          <p className='my-1 font-semibold text-xs text-gray-600'>GROUP ID</p>
          <input onChange={(e) => validateGroupID(e.target.value)} type="text" name="" id="" className={`px-2 py-1 rounded focus:outline-none ${theme.bg200}`} />
          <div className={`my-1 text-xs`}>
            <p className={`${style2} transition-colors ease-linear duration-700`}>- Choose unique GROUP ID</p>
            <p className={`${style1} transition-colors ease-linear duration-700`}>- ID should only contain A-Z, a-z and 0-9 characters.</p>
          </div>

          <div className='flex justify-between mt-5 text-sm'>
            <button onClick={() => setDisplayPanel(true)} className={`${theme.text700}`}>Back</button>
            <button onClick={() => sendData()} className={`px-4 py-1 rounded ${theme.text50} ${theme.bg400}`}>Create</button>
          </div>
        </div>
      }
    </section>
  )
}
