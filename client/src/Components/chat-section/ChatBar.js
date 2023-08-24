import React from 'react';
import PersonDetails from './chat-bar/PersonDetails';
import DropBox from './chat-bar/DropBox';
import Features from './chat-bar/Features';
import { useSelector } from 'react-redux';

export default function ChatBar(props) {
  const toggleFeaturesState = useSelector(state => state.toggle.value.toggleFeatures);
  const displayStarredMessages = useSelector(state => state.toggle.value.showStarredMessages);
  
  return (
    <section className={`px-3 flex justify-between ${toggleFeaturesState || displayStarredMessages ? 'bg-violet-500 saturate-[.80]' : 'bg-violet-400'} text-white`}>
      <PersonDetails getChat={props.getChat} secondPerson={props.secondPerson} setToggle={props.setToggle} ws={props.ws} />
      <Features star={props.star} setStar={props.setStar} room={props.room} />
      <DropBox setToggle={props.setToggle} room={props.room} />
    </section>
  )
}
