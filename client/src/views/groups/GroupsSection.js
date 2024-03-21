import React from 'react';
import { useSelector } from 'react-redux';
import ChatList from 'components/ChatList';

export default function GroupsSection() {
  const groups = useSelector(state => state.auth.value.user.groups);

  return (
    <ChatList chats={groups} isGroup={true} />
  )
}
