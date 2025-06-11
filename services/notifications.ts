import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPush() {
  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;
  if (status !== 'granted') {
    const { status: askStatus } = await Notifications.requestPermissionsAsync();
    finalStatus = askStatus;
  }
  return finalStatus === 'granted';
}

export async function scheduleDailyReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'AnkiRipples',
      body: 'Start your 3-minute AnkiRipples session.',
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    },
  });
}
