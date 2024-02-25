import React from 'react';
import { useSelector } from 'react-redux';
import { fetchRequest } from 'utils/fetchRequest';

export default function SearchResultBox(props) {
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);
  
  async function AddFriend() {
    const id = props.person.googleID;
    const name = props.person.firstName + " " + props.person.familyName;
    const photoURL = props.person.photoURL;
  
    if (user.googleID === id) {
      console.log(`You cannot send request to yourself`);
      return ;
    }
    else if (user.friends.findIndex(element => element.id === id) > -1 || user.sendRequests.findIndex(element => element.id === id) > -1) {
      console.log(`${name} is already friend`);
      return ;
    }
    
    const addFriendRequestURI = `http://localhost:5000/add/friend?person=${JSON.stringify({id, name, photoURL})}`;
    const data = await fetchRequest({ url: addFriendRequestURI, method: 'POST' });
    console.log(data);
  }

  return (
    <section className={`flex justify-between rounded px-6 py-2 ${theme.hoverBg100}`}>
      <div className='flex'>
        <img src={ props.person.photoURL } alt="" className='w-11 rounded-full' />
        <div className='mx-4'>
          <p>{ props.person.firstName + " " + props.person.familyName }</p>
          <p className='text-[10px] text-gray-400'>{ props.person.googleID }</p>
        </div>
      </div>
      <div>
        <button onClick={ AddFriend } className='mt-[9px] px-3 py-1 text-xs font-semibold rounded border-[1px] border-gray-400 active:bg-gray-200'>Add +</button>
      </div>
    </section>
  )
}
