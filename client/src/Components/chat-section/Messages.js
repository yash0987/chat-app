import React from 'react';
import SenderMsg from './SenderMsg';
import ReceiverMsg from './ReceiverMsg';

export default function Message(props) {
  let keyValue = 0;

  return (
    <div>
      {
        props.elementArray.map((element) => {
          keyValue++;
          if (element.sender === props.googleID) {
            return <SenderMsg key={keyValue} element={element} deleteToggle={props.deleteToggle} selectedMessageArray={props.selectedMessageArray} />;
          }
          return <ReceiverMsg key={keyValue} element={element} deleteToggle={props.deleteToggle} selectedMessageArray={props.selectedMessageArray} />;
        })
      }
    </div>
  )
}
