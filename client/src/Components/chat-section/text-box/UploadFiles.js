import React from 'react';
import { useSelector } from 'react-redux';
import documentIcon from '../../../img/document.png';
import photoIcon from '../../../img/photos.png';
import pollIcon from '../../../img/poll.png';
import audioIcon from '../../../img/headphone.png';

export default function UploadFiles() {
  const theme = useSelector(state => state.theme.value);
  async function uploadFile(e, name) {
    const file = e.target.files[0];
    const formdata = new FormData();
    formdata.append(name, file);
	const response = await fetch('http://localhost:5000/group/upload/files', {
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
  }
		
  return (
    <section className='absolute bottom-14 left-10'>
      <div className='*:px-3 first:pt-3 last:pb-3 rounded bg-white text-gray-600'>
        <label className={`flex items-center ${theme.hoverBg100}`}>
          <img src={documentIcon} className='w-8' alt="" />
          <p>Document</p>
          <input onChange={(e) => uploadFile(e, 'document')} type="file" name="document" id="" multiple className='hidden' accept="application/*" />
        </label>
        <label className={`flex items-center ${theme.hoverBg100}`}>
          <img src={photoIcon} className='w-8' alt="" />
          <p>Photos & videos</p>
          <input type="file" name="gallery" id="" multiple accept="image/*, video/*" className='hidden' />
        </label>
        <label className={`flex items-center ${theme.hoverBg100}`}>
          <img src={pollIcon} className='w-8' alt="" />
          <p>Audio</p>
          <input type="file" name="audio" id="" multiple accept="audio/*" className='hidden' />
        </label>
        <div className={`flex items-center ${theme.hoverBg100}`}>
          <img src={audioIcon} className='w-8' alt="" />
          <p>Poll</p>
        </div>
      </div>
    </section>
  )
}
