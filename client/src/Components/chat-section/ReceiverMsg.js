import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMessage, unselectMessage } from '../../features/select-message-slice/selectMessageSlice';
import { unselectAllMessages } from '../../features/select-message-slice/selectMessageSlice';
import { toggleFeatures } from '../../features/toggle-slice/toggleSlice';

export default function ReceiverMsg(props) {
  const [highlightSelectMessage, setHighlightSelectMessage] = useState(0);
  const holdEventTimer = useRef(null);
  const toggleFeaturesState = useSelector(state => state.toggle.value.toggleFeatures);
  const dispatch = useDispatch();

  function selectAndUnselectMessage() {
    console.log("I am clicking")
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
      dispatch(toggleFeatures());
    }, 1000);
  }

  function stopHoldEvent() {
    if (toggleFeaturesState) return ;
    clearTimeout(holdEventTimer.current);
    holdEventTimer.current = null;
  }

  return (
    <section onMouseDown={ () => triggerHoldEvent() } onMouseUp={ () => stopHoldEvent() } onMouseLeave={ () => stopHoldEvent() } className = {`${ highlightSelectMessage && toggleFeaturesState ? 'bg-violet-500 bg-opacity-20' : 'bg-none' } select-none rounded-md flex justify-start my-1 p-1`} data-person='receiver'>
      { toggleFeaturesState ? <div className='m-2'>&#9552;</div> : null }
      <p className = 'whitespace-pre-wrap break-words max-w-lg px-2 py-1 rounded-md text-white bg-violet-500'>
        { props.element.collectedText }
        <span className = 'flex justify-end text-[10px] text-white'> { props.element.star ? <span>&#9733;  </span> : null } { props.element.currentMsgTime } </span>
      </p>
    </section>
  )
}
