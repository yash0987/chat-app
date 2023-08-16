import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { selectMessage, unselectMessage } from '../../features/select-message-slice/selectMessageSlice';

export default function ReceiverMsg(props) {
  const [highlightSelectMessage, setHighlightSelectMessage] = useState(0);
  const dispatch = useDispatch();

  function selectAndUnselectMessage() {
    setHighlightSelectMessage(highlightSelectMessage ^ 1)
    if (!highlightSelectMessage) {
      console.log("select message")
      dispatch(selectMessage(props.element.messageID));
      if (!props.element.star) props.setStar(props.star + 1);
    }
    else if (highlightSelectMessage) {
      console.log("unselect message")
      dispatch(unselectMessage(props.element.messageID))
      if (!props.element.star) props.setStar(props.star - 1);
    }
  }

  useEffect(() => {
    if (highlightSelectMessage && !props.deleteToggle) setHighlightSelectMessage(0);
    // eslint-disable-next-line
  }, [props.deleteToggle]);

  return (
    <section onClick={ () => props.deleteToggle ? selectAndUnselectMessage() : null } className = {`${ highlightSelectMessage && props.deleteToggle ? 'bg-violet-500 bg-opacity-20' : 'bg-none' } select-none rounded-md flex justify-start my-1 p-1`} data-person='receiver'>
      { props.deleteToggle ? <div className='m-2'>&#9552;</div> : null }
      <p className = 'whitespace-pre-wrap break-words max-w-xs px-2 py-1 rounded-md text-white bg-violet-500'>
        { props.element.collectedText }
        <span className = 'flex justify-end text-[10px] text-white'> { props.element.star ? <span>&#9733;  </span> : null } { props.element.currentMsgTime } </span>
      </p>
    </section>
  )
}
