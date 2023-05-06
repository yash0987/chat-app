import React, { useRef } from 'react';
import { CurrentUser } from './../context/CurrentUserContext';
import left_arrow from './../img/left-arrow.png';
import right_arrow from './../img/right-arrow.png';

export default function CreateGroup(props) {
  const chibiPhotos = [
    "https://i.pinimg.com/originals/0a/1b/94/0a1b94c2a2c47651d174f4b91ce21eb9.jpg",
    "https://i.pinimg.com/originals/99/50/f4/9950f4b78b113f6199a35dfa526aa729.jpg",
    "https://i.pinimg.com/originals/32/ca/18/32ca1847d3f96b313f112281679d698e.jpg",
    "https://i.pinimg.com/originals/7a/96/79/7a9679a8f6384894dccbacc53e3682e7.jpg",
    "https://i.pinimg.com/564x/f5/5b/8d/f55b8ded361904bb48a57721b6353464.jpg",
    "https://i.pinimg.com/originals/be/8e/1b/be8e1b986907a7d2b2700ac2ebe960c6.jpg",
    "https://i.pinimg.com/originals/4e/d6/f3/4ed6f370f5df6361252f3ea0d6d230dd.jpg",
    "https://i.pinimg.com/564x/0e/cc/c5/0eccc588c3f7a29eb0c76874e88ce154.jpg",
    "https://i.pinimg.com/564x/f1/92/c6/f192c64bae7edf7b409c7831c5a86326.jpg",
    "https://i.pinimg.com/564x/6c/69/5e/6c695eca3f1cb79dd00a4cd4fa6bdaca.jpg",
    "https://i.pinimg.com/564x/95/78/33/95783335721c98d12a67a129fb36eb19.jpg",
    "https://i.pinimg.com/564x/ea/cd/63/eacd636ffd40f19bfa9d14aec2078925.jpg",
    "https://i.pinimg.com/564x/5a/5b/02/5a5b025eb0f22c6fa2089e102031b2e1.jpg",
    "https://i.pinimg.com/564x/98/84/0f/98840fd77f6dbabbb050d78e06767ec3.jpg",
    "https://i.pinimg.com/564x/ba/d0/11/bad011d88eccd57304d173a66198e170.jpg",
  ];

  const inputRef = useRef(null);
  const imageRef = useRef(null);
  const friendListRef = useRef(null);
  const GroupPhotoPanelRef = useRef(null);

  function selectImage(event) {
    const imageURL = event.target.src;
    imageRef.current.src = imageURL;
  }

  async function sendData(groupID, groupName, groupPhotoURL, membersID) {
    const response = await fetch(`http://localhost:5000/group?ID=${groupID}&name=${groupName}&photoURL=${groupPhotoURL}&friends=${JSON.stringify(membersID)}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    });

    const data = await response.json();
    console.log(data);
  }

  function createGroup() {
    const groupName = inputRef.current.firstElementChild.value;
    const groupID = inputRef.current.lastElementChild.value;
    const groupPhotoURL = imageRef.current.src;

    console.log(groupID, groupName, groupPhotoURL);

    const friendsCount = friendListRef.current.childElementCount;
    const arr = [];
    for (let i = 0; i < friendsCount; i++) {
      const selectFriendForGroup = friendListRef.current.childNodes[i];
      if (selectFriendForGroup.firstElementChild.firstElementChild.checked) {
        let friendID = friendListRef.current.childNodes[i].firstElementChild.lastElementChild.lastElementChild.lastElementChild;
        arr.push(friendID.textContent);
      }
    }

    sendData(groupID, groupName, groupPhotoURL, arr);
    props.setToggle('showSearch');
  }

  function cancelGroup() {
    props.setToggle('showSearch');
  }

  let users = CurrentUser();
  let keyValue = 0;

  return (
    <section className='m-2 p-5 w-[45rem] h-[95.5vh] rounded bg-violet-50'>
      <div className='m-5 flex justify-center'>
        <img ref={imageRef} src="https://i.pinimg.com/originals/0a/1b/94/0a1b94c2a2c47651d174f4b91ce21eb9.jpg" alt="" className='w-36 h-36 rounded-full object-cover' />
      </div>

      <div ref={GroupPhotoPanelRef} id='GroupPhotosPanel' className='mx-5 w-[40rem] flex overflow-hidden scroll-smooth'>
        {
          chibiPhotos.map((element) => {
            keyValue++;
            return <img onClick={selectImage} src={element} alt="" key={keyValue} className='m-2 w-28 h-28 rounded-full shadow-md object-cover' />;
          })
        }
      </div>

      <div className='w-41 flex justify-center'>
        <button onClick={() => GroupPhotoPanelRef.current.scrollBy(-515, 0)} className= 'm-1 rounded-full shadow bg-white'><img src={left_arrow} alt=""  className='p-1 w-8' /></button>
        <button onClick={() => GroupPhotoPanelRef.current.scrollBy(515, 0)} className= 'm-1 rounded-full shadow bg-white'><img src={right_arrow} alt=""  className='p-1 w-8' /></button>
      </div>

      <div ref={inputRef} className='m-2 mt-5'>
        <input type="text" name="" placeholder='Group name' className='m-2 px-4 py-2 w-[47.5%] rounded focus:outline-none' />
        <input type="text" name="" placeholder='Group ID' className='m-2 px-4 py-2 w-[47.5%] rounded focus:outline-none' />
      </div>

      <div ref={friendListRef} className='h-1/4 overflow-y-scroll'>
        {
          users.friendsID.map((element) => {
            return <section className='mx-4 flex'>
              <label className='flex p-2 w-full rounded-lg font-semibold hover:bg-violet-100'>
                <input type="checkbox" name="" id="" className='mx-5 accent-violet-500' />
                <div className='flex'>
                    <img src={ element.photoURL } alt="" className='w-10 rounded-full' />
                    <div className='mx-4'>
                      <p>{ element.fullName }</p>
                      <p className='text-[10px] text-gray-400'>{ element.googleID }</p>
                    </div>
                </div>
              </label>
            </section>
          })
        }
      </div>

      <div className='mx-2'>
        <button onClick={createGroup} className='m-2 px-4 py-2 bg-violet-400 text-white rounded-lg hover:bg-violet-500'>Create</button>
        <button onClick={cancelGroup} className='m-2 px-4 py-2 bg-violet-400 text-white rounded-lg hover:bg-violet-500'>Cancel</button>
      </div>
    </section>
  )
}
