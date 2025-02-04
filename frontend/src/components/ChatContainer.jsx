import React from 'react'
import { useEffect } from 'react';

import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';

const ChatContainer = () => {

  const { messages, users, selectedUser, isUserLoading, isMessagesLoading, getMessages } = useChatStore();

  useEffect(() => {
    getMessages(selectedUser?._id);
  },[selectedUser._id, getMessages])

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto' >
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput/>
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto' >
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput/>
    </div>
  )
}

export default ChatContainer
