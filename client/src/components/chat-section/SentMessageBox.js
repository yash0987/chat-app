import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMessage, unselectAllMessages, unselectMessage } from '../../features/select-message-slice/selectMessageSlice';
import { featuresToggle } from '../../features/toggle-slice/toggleSlice';
import fileIcon from '../../img/file1.png';
import downloadIcon from '../../img/download.png';

export default function SentMessageBox(props) {
  const [highlightSelectMessage, setHighlightSelectMessage] = useState(0);
  const holdEventTimer = useRef(null);
  const toggleFeaturesState = useSelector(state => state.toggle.value.toggleFeatures);
  const theme = useSelector(state => state.theme.value);
  const user = useSelector(state => state.auth.value.user);
  const dispatch = useDispatch();

  function selectAndUnselectMessage() {
    setHighlightSelectMessage(highlightSelectMessage ^ 1);
    if (!highlightSelectMessage) {
      console.log("select message")
      dispatch(selectMessage(props.element.messageID));
      if (!props.element.star) props.setStar(props.star + 1);
    }
    else if (highlightSelectMessage) {
      console.log("unselect message")
      dispatch(unselectMessage(props.element.messageID));
      if (!props.element.star) props.setStar(props.star - 1);
    }
  }

  useEffect(() => {
    if (highlightSelectMessage && !toggleFeaturesState) {
      setHighlightSelectMessage(0);
      dispatch(unselectAllMessages());
    }
    // eslint-disable-next-line
  }, [toggleFeaturesState]);

  function triggerHoldEvent() {
    if (toggleFeaturesState) {
      selectAndUnselectMessage();
      return ;
    }
    holdEventTimer.current = setTimeout(() => {
      console.log("I am holding for selecting messages");
      selectAndUnselectMessage();
      dispatch(featuresToggle(true));
    }, 1000);
  }

  function stopHoldEvent() {
    if (toggleFeaturesState) return ;
    clearTimeout(holdEventTimer.current);
    holdEventTimer.current = null;
  }
  
  return (
    <section onMouseDown={ () => triggerHoldEvent() } onMouseUp={ () => stopHoldEvent() } onMouseLeave={ () => stopHoldEvent() } id={props.element.messageID} className = {`${ highlightSelectMessage && toggleFeaturesState ? `${theme.bg500} bg-opacity-20` : 'bg-none' } select-none rounded-md grid grid-flow-col justify-end my-1 p-1`} data-person='sender'>
      <div className = 'group relative whitespace-pre-wrap break-words leading-5 mx-2 px-2 py-1 max-w-lg rounded-md bg-gray-200 text-gray-600'>
        {
          props.element.type !== 'text' ?
          <a href={`http://localhost:5000/download/file?filename=${props.element.name}&type=${props.element.type}&ID=${props.element.messageID}`} className='group-hover:visible invisible absolute -right-2 -top-2 w-8 shadow-md rounded-sm bg-gray-400 hover:bg-[#9299a4]'>
            <img src={downloadIcon} alt="" className='' />
          </a> : null
        }
        
        {
          props.element.replyToMessage ?
          <a href={`#${props.element.replyToMessage.repliedMessageID}`}>
            <div className='border-l-4 border-pink-500 bg-gray-100 w-full p-2 rounded text-sm'>
              <div className='flex justify-between'>
                <p className='text-pink-500'>{ props.element.replyToMessage.replyToPerson }</p>
              </div>
              <p className='whitespace-pre-wrap break-words text-gray-500 leading-tight'>{ props.element.replyToMessage.replyForMessage }</p>
            </div>
          </a> : null
        }
				{
					props.element.type !== 'text' ?
					<div className='grid grid-flow-col'>
            <img src={fileIcon} alt="" className='w-8 m-1' />
            <div>
              { props.element.name.split(".")[0] }
              <p className='text-[10px] font-semibold'>{ props.fileSize(props.element.size) } &#183; { props.element.type.split("/")[1].toUpperCase() }</p>
            </div>
          </div>
					: <p>{ props.element.collectedText }</p>
				}
        <span className = 'flex justify-end text-[10px]'> { props.element.star ? <span>&#9733;  </span> : null } { props.currentTime(props.element.currentMsgTime) } </span>
      </div>
      <img src={user.photoURL} alt="" className='w-7 my-2 rounded-full' />
      { toggleFeaturesState ? <div className='m-2'>&#9552;</div> : null }
    </section>
  )
}
