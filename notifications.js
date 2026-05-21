import { createClient } from '@supabase/supabase-js';
import * as Notifications from 'expo-notifications';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

// Funkcja obliczajaca sekundy do nastepnej 9:00
function secondsUntilNineAM() {
  const now = new Date();
  const next9AM = new Date();
  next9AM.setHours(9, 0, 0, 0);
  if (now >= next9AM) {
    next9AM.setDate(next9AM.getDate() + 1);
  }
  return Math.floor((next9AM - now) / 1000);
}

export async function setupDailyNotification() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    return;
  }

  await Notifications.setNotificationChannelAsync('default', {
    name: 'Daily Band',
    importance: Notifications.AndroidImportance.HIGH,
    sound: true,
    vibrationPattern: [0, 250, 250, 250],
  });

  await Notifications.cancelAllScheduledNotificationsAsync();

  const today = new Date().toISOString().split('T')[0];

  let notificationTitle = '🤘 Daily Metal Band';
  let notificationBody = "Today's metal band is waiting for you!";

  const { data, error } = await supabase
    .from('bands')
    .select('name')
    .eq('active_date', today)
    .single();

  if (!error && data?.name) {
    notificationBody = "Today's band: " + data.name;
  }

  const trigger = {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: secondsUntilNineAM(),
    repeats: false,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: notificationTitle,
      body: notificationBody,
      sound: true,
      channelId: 'default',
    },
    trigger,
  });

  // Wazne: Na Androidzie powiadomienie nie powtarza sie automatycznie.
  // Dlatego setupDailyNotification() musi byc wywolywana przy kazdym otwarciu aplikacji
  // (juz jest w useEffect w App.js — to wystarczy)
}
