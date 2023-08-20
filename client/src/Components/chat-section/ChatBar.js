import React from 'react';
import PersonDetails from './chat-bar/PersonDetails';
import DropBox from './chat-bar/DropBox';
import Features from './chat-bar/Features';

export default function ChatBar(props) {
  return (
    <section className={`flex justify-between px-3 w-full ${props.deleteToggle ? 'bg-violet-500 saturate-[.80]' : 'bg-violet-400'} text-white`}>
      <PersonDetails secondPerson={props.secondPerson} deleteToggle={props.deleteToggle} setDeleteToggle={props.setDeleteToggle} setToggle={props.setToggle} ws={props.ws} />
      <Features star={props.star} setStar={props.setStar} setDeleteToggle={props.setDeleteToggle} deleteToggle={props.deleteToggle} room={props.room} />
      <DropBox setToggle={props.setToggle} setDeleteToggle={props.setDeleteToggle} deleteToggle={props.deleteToggle} />
    </section>
  )
}
