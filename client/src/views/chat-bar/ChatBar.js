import React from 'react';
import { useSelector } from 'react-redux';
import Profilebar from 'views/chat-bar/components/Profilebar';
import DropBox from 'views/chat-bar/components/DropBox';
import Features from 'views/chat-bar/components/Features';

export default function ChatBar(props) {
  const toggleFeaturesState = useSelector(state => state.toggle.value.toggleFeatures);
  const displayStarredMessages = useSelector(state => state.toggle.value.showStarredMessages);
  const theme = useSelector(state => state.theme.value);
  
  return (
    <section className={`px-8 py-1 relative flex justify-between ${toggleFeaturesState || displayStarredMessages ? `${theme.bg500} saturate-[.80]` : `${theme.bg400}`} text-white`}>
      <Profilebar getChat={props.getChat} ws={props.ws} />
      <Features star={props.star} setStar={props.setStar} room={props.room} />
      <DropBox room={props.room} />
    </section>
  )
}
