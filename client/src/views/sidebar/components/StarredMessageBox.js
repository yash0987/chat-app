import React from 'react';
import { useSelector } from 'react-redux';
import { datetimeFromEpoch } from 'utils/datetimeFromEpoch';
import { fileSize } from 'utils/fileSize';
import fileIcon1 from 'assets/file1.png';
import downloadIcon from 'assets/download.png';

export default function StarredMessageBox(props) {
  const theme = useSelector(state => state.theme.value);

  const replyToMessage = props.element.replyToMessage ?
    <div className='rounded-t-lg text-sm text-slate-500 hover:text-slate-600'>            
      <p><span className='font-semibold'>{ props.element.replyToMessage.replyToPerson }</span> { props.element.replyToMessage.replyForMessage }</p>
    </div> : null

  const message = props.element.type !== 'text' ? 
    <div className={`my-2 p-2 min-w-56 relative grid grid-flow-col justify-start rounded border ${theme.border400} ${theme.bg200}`}>
      <img src={fileIcon1} alt="" className='w-8 m-1' />
      <div>
        { props.element.name.split(".")[0] }
        <p className='text-[10px] font-semibold'>{ fileSize(props.element.size) } &#183; { props.element.type.split("/")[1].toUpperCase() }</p>
      </div>
      <a href={`http://localhost:5000/download/file?filename=${props.element.name}&type=${props.element.type}&id=${props.element.messageID}`} className='group-hover:visible invisible absolute -right-2 -top-2 w-8 shadow-md rounded-sm bg-gray-400 hover:bg-[#9299a4]'>
        <img src={downloadIcon} alt="" />
      </a>
    </div>
    : <p className='whitespace-pre-wrap break-words leading-5'>{ props.element.collectedText } { props.element.editedStatus ? <span className='text-slate-500 text-[9px]'>(edited)</span> : null }</p>
  
  return (
    <section className={`my-4 group relative grid grid-flow-col justify-start border rounded ${theme.hoverBg100} ${theme.border300}`}>
      {
        <div className='my-1 grid place-self-start'>
          { props.element.replyToMessage ? <div className='justify-self-end w-[30px] h-2 mt-2 mr-2 border-t border-l rounded-tl-sm border-gray-500'></div> : null }
          <img src={props.element.senderPhotoURL} alt="" className='size-9 mx-5 my-1 object-cover rounded-full' />
          { props.element.star ? <span className='flex justify-center text-xs'>&#9733;</span> : null }
        </div>
      }
      <div className = {`group relative min-w-[30rem] max-w-[60rem]`}>
        { replyToMessage }
        <p className='text-base font-semibold'>{ props.element.senderName } <span className='text-[11px] font-normal'>{ datetimeFromEpoch(props.element.currentMsgTime) }</span></p>
        { message }
      </div>
    </section>
  )
}
