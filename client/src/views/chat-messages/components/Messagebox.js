import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { datetimeFromEpoch } from 'utils/datetimeFromEpoch';
import { timeFromEpoch } from 'utils/timeFromEpoch';
import { fileSize } from 'utils/fileSize';
import fileIcon1 from 'assets/file1.png';
import downloadIcon from 'assets/download.png';

export default function Messagebox(props) {
  const [editMessage, setEditMessage] = useState(props.element?.collectedText);
  const theme = useSelector(state => state.theme.value);
  const reply = useSelector(state => state.reply.value);
  const editToggle = useSelector(state => state.toggle.value.editMessage);
  const selectedMessage = useSelector(state => state.selectmessage.value);
  
  function openpopup(e) {
    props.popupList(e, props.element);
  }

  const replyToMessage = props.element.replyToMessage ?
    <a href={`#${props.element.replyToMessage.repliedMessageID}`} className='rounded-t-lg text-sm text-slate-500 hover:text-slate-600'>            
      <p className=''><span className='font-semibold'>{ props.element.replyToMessage.replyToPerson }</span> { props.element.replyToMessage.replyForMessage }</p>
    </a> : null

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
    : (
      selectedMessage?.[0] === props.element.messageID && editToggle ?
      <div>
        <input onChange={(e) => setEditMessage(e.target.value)} type="text" name="" id="" defaultValue={props.element.collectedText} className={`w-[60rem] mt-2 px-4 py-3 rounded ${theme.bg50} focus:outline-none`} />
        <p className='my-1 text-[11px] font-mono'>escape to <button onClick={() => props.cancelEditMessage()} className='text-blue-700 hover:underline'>cancel</button> enter to <button onClick={() => props.editSelectedMessage(editMessage, props.element.messageID)} className='text-blue-700 hover:underline'>save</button></p>
      </div>
      : <p className='whitespace-pre-wrap break-words leading-5'>{ props.element.collectedText } { props.element.editedStatus ? <span className='text-slate-500 text-[9px]'>(edited)</span> : null }</p>
    )

  return (
    <section id={props.element.messageID} className={`group relative grid grid-flow-col justify-start ${theme.hoverBg100} ${props.isPreviousMessagesUserDifferent ? 'mt-4' : null} ${props.visibilityOfPopupList.message?.messageID === props.element.messageID ? theme.bg100 :  null} ${ reply.repliedMessageID === props.element.messageID || (selectedMessage?.[0] === props.element.messageID && editToggle)  ? `border-l-[3px] ${theme.border400} ${theme.bg200} ${theme.hoverBg200}` : null}`}>
      {
        props.isPreviousMessagesUserDifferent ? 
        <div className='my-1 grid place-self-start'>
          { props.element.replyToMessage ? <div className='justify-self-end w-[30px] h-2 mt-2 mr-2 border-t border-l rounded-tl-sm border-gray-500'></div> : null }
          <img src={props.element.senderPhotoURL} alt="" className='size-9 mx-5 my-1 object-cover rounded-full' />
          { props.element.star ? <span className='flex justify-center text-xs'>&#9733;</span> : null }
        </div>
        : <span className='my-1 w-[75px] grid justify-items-center text-[10px]'>
            { props.element.star ? <span className='text-xs visible group-hover:invisible'>&#9733;</span> : null }
            <p className={`absolute invisible group-hover:visible`}>{timeFromEpoch(props.element.currentMsgTime)}</p>
          </span>
      }
      <div className = {`group relative min-w-[30rem] max-w-[60rem]`}>
        { reply.repliedMessageID === props.element.messageID ? <p className='text-[10px]'>- Replying to this message</p> : null }
        { replyToMessage }
        { props.isPreviousMessagesUserDifferent ? <p className='text-base font-semibold'>{ props.element.senderName } <span className='text-[11px] font-normal'>{ datetimeFromEpoch(props.element.currentMsgTime) }</span></p> : null }
        { message }
      </div>
      <div onClick={(e) => openpopup(e)} className={`absolute invisible -top-4 right-8 px-[7px] py-3 flex justify-center rounded-sm shadow-sm shadow-gray-400 group-hover:visible ${theme.bg100} ${theme.hoverBg200}`}>
        <div className='size-[3px] mx-[1px] rounded-full bg-gray-600'></div>
        <div className='size-[3px] mx-[1px] rounded-full bg-gray-600'></div>
        <div className='size-[3px] mx-[1px] rounded-full bg-gray-600'></div>
      </div>
    </section>
  )
}
