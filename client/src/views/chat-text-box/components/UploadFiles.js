import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appendChat } from 'features/chat-slice/chatSlice';
import { ws } from 'utils/websocket';
import documentIcon from 'assets/document.png';
import photoIcon from 'assets/photos.png';
import pollIcon from 'assets/poll.png';
import audioIcon from 'assets/headphone.png';
import { useLocation, useParams } from 'react-router-dom';

export default function UploadFiles(props) {
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const chatType = location.pathname.slice(0, 7) === '/groups' ? 'group' : 'private';

  async function uploadFile(e, name) {
    const messageData = [];
    const files = e.target.files;
    const formdata = new FormData();
    let currentMsgTime = Date.now();
    for (let file of files) {
      const filename = `${user._id + currentMsgTime}.${file.name.split('.').pop()}`;
      formdata.append(name, file, filename);
      messageData.push({
        messageID: user._id + currentMsgTime,
        name: file.name,
        currentMsgTime,
        lastModified: file.lastModified,
        size: file.size,
        type: file.type,
        senderID: user._id,
        senderName: user.name,
        senderPhotoURL: user.photoURL,
        chat: { id: params.id, chatType },
        star: false,
        action: 'send'
      });
      console.log(user._id + currentMsgTime);
      currentMsgTime += 1;
    }
	
    const response = await fetch(`http://localhost:5000/upload/files`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Credentials": true
      },
			body: formdata
    });
    const data = await response.json();
    console.log(data);

    dispatch(appendChat(messageData));
    ws.send(JSON.stringify(messageData));
  }
	
  return (
    <section className='absolute bottom-14 left-10'>
      <div className='*:px-3 first:pt-3 last:pb-3 rounded bg-white text-gray-600'>
        <label className={`flex items-center ${theme.hoverBg100}`}>
          <img src={documentIcon} className='w-8' alt="" />
          <p>Document</p>
          <input onChange={(e) => uploadFile(e, e.target.name)} type="file" name="document" id="" multiple className='hidden' accept="application/*" />
        </label>
        <label className={`flex items-center ${theme.hoverBg100}`}>
          <img src={photoIcon} className='w-8' alt="" />
          <p>Photos & videos</p>
          <input onChange={(e) => uploadFile(e, e.target.name)} type="file" name="gallery" id="" multiple accept="image/*, video/*" className='hidden' />
        </label>
        <label className={`flex items-center ${theme.hoverBg100}`}>
          <img src={audioIcon} className='w-8' alt="" />
          <p>Audio</p>
          <input onChange={(e) => uploadFile(e, e.target.name)} type="file" name="audio" id="" multiple accept="audio/*" className='hidden' />
        </label>
        <div className={`flex items-center ${theme.hoverBg100}`}>
          <img src={pollIcon} className='w-8' alt="" />
          <p>Poll</p>
        </div>
      </div>
    </section>
  )
}
