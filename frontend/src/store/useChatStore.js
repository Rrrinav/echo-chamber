import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const { data } = await axiosInstance.get('/messages/users');
      set({ users: data });
    } catch (error) {
      console.error("Error fetching users", error.response.data.message);
      toast.error('Failed to fetch users');
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const { data } = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: data });
    } catch (error) {
      console.error("Error fetching messages", error.response.data.message);
      toast.error('Failed to fetch messages');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (message) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, { message });
      set({ messages: [...messages, res.data] });

    }catch (error) {
      console.error("Error sending message", error.response.data.message);
      toast.error('Failed to send message');
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
    get().getMessages(user._id);
  },

  subscribeToMessages: () => {
    const {selectedUser} = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on('newMessage', (message) => {
      if (message.senderId !== selectedUser._id) return;
      set((state) => ({ messages: [...get().messages, message] }));
    });
  },

  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off('newMessage');
  }

}))
