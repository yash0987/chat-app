import React from 'react';
import ChatBarDropBox from './ChatBarDropBox';
import PersonDetails from './PersonDetails';
import Features from './Features';

export default function ChatBar(props) {
  return (
    <section className={`flex justify-between px-3 w-full ${props.deleteToggle ? 'bg-violet-500 saturate-[.80]' : 'bg-violet-400'} text-white`}>
      <PersonDetails secondPerson={props.secondPerson} deleteToggle={props.deleteToggle} setDeleteToggle={props.setDeleteToggle} setToggle={props.setToggle} ws={props.ws} />
      <Features star={props.star} setStar={props.star} setDeleteToggle={props.setDeleteToggle} deleteToggle={props.deleteToggle} room={props.room} />
      <ChatBarDropBox setToggle={props.setToggle} setDeleteToggle={props.setDeleteToggle} deleteToggle={props.deleteToggle} />
    </section>
  )
}
