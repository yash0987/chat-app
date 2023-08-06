import React, { useState, useEffect } from 'react'

export default function ReceiverMsg(props) {
  const [selectMessage, setSelectMessage] = useState(0);

  function selectAndUnselectMessage() {
    setSelectMessage(selectMessage ^ 1)
    if (!selectMessage) {
      console.log("select message")
      props.setSelectedMessageArray([...props.selectedMessageArray, props.element.messageID]);
      if (!props.element.star) props.setStar(props.star + 1);
    }
    else if (selectMessage) {
      console.log("unselect message")
      props.setSelectedMessageArray(() => props.selectedMessageArray.filter((element) => element !== props.element.messageID));
      if (!props.element.star) props.setStar(props.star - 1);
    }
  }

  useEffect(() => {
    if (selectMessage && !props.deleteToggle) setSelectMessage(0);
    // eslint-disable-next-line
  }, [props.deleteToggle]);

  return (
    <section onClick={ () => props.deleteToggle ? selectAndUnselectMessage() : null } className = {`message ${ selectMessage && props.deleteToggle ? 'bg-violet-500 bg-opacity-20' : 'bg-none' } select-none rounded-md flex justify-start my-1 p-1`} data-person='receiver'>
      { props.deleteToggle ? <div className='m-2'>&#9552;</div> : null }
      <p className = 'whitespace-pre-wrap break-words max-w-xs px-2 py-1 rounded-md text-white bg-violet-500'>
        { props.element.collectedText }
        <span className = 'flex justify-end text-[10px] text-white'> { props.element.star ? <span>&#9733;  </span> : null } { props.element.currentMsgTime } </span>
      </p>
    </section>
  )
}
