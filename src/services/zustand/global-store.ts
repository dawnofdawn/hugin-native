import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// import { defaultPreferences } from '@/config';
import { Themes } from '@/styles';
import type { Preferences, Theme, User } from '@/types';

import { ASYNC_STORAGE_KEYS, setStorageValue } from '../async-storage';

type GlobalStore = {
  theme: Theme;
  user: User;
  preferences: Preferences;

  setTheme: (payload: Theme) => void;
  setUser: (payload: User) => void;
  setPreferences: (payload: Preferences) => void;
};

export const useGlobalStore = create<
  GlobalStore,
  [['zustand/subscribeWithSelector', never]]
>(
  subscribeWithSelector((set) => ({
    preferences: defaultPreferences,
    setPreferences: (preferences: Preferences) => {
      console.log('Setting preferences:', preferences);
      set({ preferences });
    },
    setTheme: (theme: Theme) => {
      set({ theme });
    },
    setUser: (user: User) => {
      set({ user });
    },

    theme: Themes.dark,
    user: defaultUser,
  })),
);

useGlobalStore.subscribe(
  (state) => state.preferences,
  async (preferences) => {
    console.log({ preferences });
    if (!preferences) {
      return;
    }
    await setStorageValue(ASYNC_STORAGE_KEYS.PREFERENCES, preferences);
  },
);

useGlobalStore.subscribe(
  (state) => state.user,
  async (user) => {
    if (!user) {
      return;
    }
    await setStorageValue(ASYNC_STORAGE_KEYS.USER, user);
  },
);

useGlobalStore.subscribe(
  (state) => state.preferences?.themeMode,
  (themeMode) => {
    if (themeMode) {
      console.log('themeMode', themeMode);
      useGlobalStore.getState().setTheme(Themes[themeMode]);
    }
  },
);

// HACK prevent cycling import, fix this
export const defaultPreferences: Preferences = {
  authConfirmation: false,
  authenticationMethod: 'hardware-auth',
  currency: 'usd',
  language: 'en',
  limitData: false,
  nickname: 'Anonymous',
  notificationsEnabled: true,
  scanCoinbaseTransactions: false,
  themeMode: 'dark',
  websocketEnabled: true,
};

export const defaultUser = {
  address:
    'SEKReTXy5NuZNf9259RRXDR3PsM5r1iKe2sgkDV5QU743f4FspoVAnY4TfRPLBMpCA1HQgZVnmZafQTraoYsS9K41iePDjPZbme',
  avatar: null,
  name: 'Anon',
};
