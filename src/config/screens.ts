export enum AuthScreens {
  WelcomeScreen = 'WelcomeScreen',
  RestoreAccountScreen = 'RestoreAccountScreen',
  ForgotPinScreen = 'ForgotPinScreen',
  RequestFingerPrintScreen = 'RequestFingerPrintScreen',
  RequestPinScreen = 'RequestPinScreen',
  SplashScreen = 'SplashScreen',
  CreateAccountScreen = 'CreateAccountScreen',
  DashboardScreen = 'DashboardScreen',
}

export enum Stacks {
  MainStack = 'MainStack',
  AuthStack = 'AuthStack',
}

export enum MainScreens {
  AddGroupScreen = 'AddGroupScreen',
  GroupChatScreen = 'GroupChatScreen',
  GroupsScreen = 'GroupsScreen',
  ModifyGroupScreen = 'ModifyGroupScreen',
  MessageScreen = 'MessageScreen',
  MessagesScreen = 'MessagesScreen',
  ChangeLanguageScreen = 'ChangeLanguageScreen',
  ChangeThemeScreen = 'ChangeThemeScreen',
  PickNodeScreen = 'PickNodeScreen',
  FaqScreen = 'FaqScreen',
  SettingsScreen = 'SettingsScreen',
  UpdateProfileScreen = 'UpdateProfileScreen',
  DashboardScreen = 'DashboardScreen',
  SendTransactionScreen = 'SendTransactionScreen',
  WalletStatusScreen = 'WalletStatusScreen',
  ModifyContactScreen = 'ModifyContactScreen',
  GroupStack = 'GroupStack',
  MessageStack = 'MessageStack',
  SettingsStack = 'SettingsStack',
  WalletStack = 'WalletStack',
}

export const TabBar = {
  [MainScreens.WalletStack]: {
    iconName: 'wallet-outline',
    iconType: 'MCI',
    tabName: MainScreens.WalletStack,
  },

  [MainScreens.GroupStack]: {
    iconName: 'comment-text-multiple-outline',
    iconType: 'MCI',
    tabName: MainScreens.GroupStack,
  },
  [MainScreens.MessageStack]: {
    iconName: 'comment-text-outline',
    iconType: 'MCI',
    tabName: MainScreens.MessageStack,
  },
  [MainScreens.SettingsStack]: {
    iconName: 'sliders',
    iconType: 'FA',
    tabName: MainScreens.SettingsStack,
  },
} as const;
