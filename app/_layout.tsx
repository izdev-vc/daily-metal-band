import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { setupDailyNotification } from '../notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    setupDailyNotification();
  }, []);

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }} />
    </ErrorBoundary>
  );
}