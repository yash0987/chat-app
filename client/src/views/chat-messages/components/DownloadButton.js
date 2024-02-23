import React from 'react';
import downloadIcon from '../../../assets/download.png';

export default function DownloadButton(props) {
  return (
    props.element.type !== 'text' ? 
    <a href={`http://localhost:5000/download/file?filename=${props.element.name}&type=${props.element.type}&ID=${props.element.messageID}`} className='group-hover:visible invisible absolute -right-2 -top-2 w-8 shadow-md rounded-sm bg-gray-400 hover:bg-[#9299a4]'>
      <img src={downloadIcon} alt="" className='' />
    </a> : null
  )
}
