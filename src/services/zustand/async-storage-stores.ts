import { AuthMethods, Preferences, Theme, ThemeName, User } from '@/types';
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import { defaultTheme, themes } from '@/styles';

import { ASYNC_STORAGE_KEYS } from './async-storage-keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { create } from 'zustand';
import { setAuthenticated } from './global-store';

interface UserStore {
  user: User;
  setDeviceUser: (obj: User) => void;
}

interface AppStoreState {
  _hasHydrated: {
    theme: boolean;
    preferences: boolean;
    user: boolean;
    room: string;
  };
  setHasHydrated: (key: keyof AppStoreState['_hasHydrated']) => void;
  resetHydration: () => void;
}

interface RoomStore {
  thisRoom: string;
  setThisRoom: (room: string) => void;
}

export const useRoomStore = create<RoomStore>()(
  persist(
    (set) => ({
      setThisRoom: (room) => set({ thisRoom: room }),
      thisRoom: defaultRoom,
    }),
    {
      name: ASYNC_STORAGE_KEYS.CURRENT_ROOM,
      onRehydrateStorage: () => () => {
        useAppStoreState.getState().setHasHydrated('room');
      },
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const getThisRoom = () => {
  return useRoomStore.getState().thisRoom;
};

export const defaultRoom = 'lobby';

// Store for tracking hydration status, just for intial load of the app since async storage is... async.
export const useAppStoreState = create<AppStoreState>()((set) => ({
  _hasHydrated: {
    preferences: false,
    room: '',
    theme: false,
    user: false,
  },
  resetHydration: () =>
    set(() => ({
      _hasHydrated: {
        preferences: false,
        room: '',
        theme: false,
        user: false,
      },
    })),
  setHasHydrated: (key) =>
    set((state) => ({
      _hasHydrated: { ...state._hasHydrated, [key]: true },
    })),
}));

export const useUserStore = create<UserStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        setDeviceUser: (user) => {
          set({ user: user || defaultUser });
        },
        user: defaultUser,
      }),
      {
        merge: (persistedState: unknown, currentState: UserStore) => {
          const typedPersistedState = persistedState as
            | Partial<UserStore>
            | undefined;
          const user = typedPersistedState?.user ?? defaultUser;
          return { ...currentState, user };
        },
        name: ASYNC_STORAGE_KEYS.USER,
        onRehydrateStorage: () => {
          useAppStoreState.getState().setHasHydrated('user');
        },
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
);

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      setTheme: (theme) => set({ theme }),
      theme: defaultTheme,
    }),
    {
      name: ASYNC_STORAGE_KEYS.THEME,
      onRehydrateStorage: () => () => {
        useThemeStore.setState((state) => {
          const themeName = state.theme.name as ThemeName;
          const { mode } = state.theme;
          return {
            theme: themes[themeName][mode],
          };
        });
        useAppStoreState.getState().setHasHydrated('theme');
      },
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

interface PreferencesStore {
  preferences: Preferences;
  setPreferences: (preferences: Preferences) => void;
  setAuthMethod: (authMethod: AuthMethods | null) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      setAuthMethod: (authMethod) =>
        set((state) => ({
          preferences: { ...state.preferences, authMethod },
        })),
      setPreferences: (preferences) => set({ preferences }),
    }),
    {
      merge: (persistedState: unknown, currentState: PreferencesStore) => {
        const typedPersistedState = persistedState as
          | Partial<PreferencesStore>
          | undefined;
        const preferences =
          typedPersistedState?.preferences ?? defaultPreferences;
        return { ...currentState, preferences };
      },
      name: ASYNC_STORAGE_KEYS.PREFERENCES,
      onRehydrateStorage: () => () => {
        const authMethod = getAuthMethod();

        if (authMethod === AuthMethods.reckless) {
          setAuthenticated(true);
        }

        useAppStoreState.getState().setHasHydrated('preferences');
      },
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const defaultPreferences: Preferences = {
  authMethod: AuthMethods.reckless,
  language: 'en',
  nickname: 'Anon',
  node: 'kaffenod.xyz:443',
  pincode: null,
};

export const defaultUser: User = {
  address: '',
  downloadDir: RNFS.CachesDirectoryPath,
  huginAddress: '',

  keys: {},
  name: 'Anon',
  room: 'lobby',
};

export const getAuthMethod = () => {
  return usePreferencesStore.getState().preferences?.authMethod;
};

export const getUser = () => {
  return useUserStore.getState().user;
};
