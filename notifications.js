import * as Notifications from 'expo-notifications';
import { supabase } from './services/supabase';

function getLocalDateString(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function setupDailyNotification() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    await Notifications.setNotificationChannelAsync('default', {
      name: 'Daily Band',
      importance: Notifications.AndroidImportance.HIGH,
      sound: true,
      vibrationPattern: [0, 250, 250, 250],
    });

    await Notifications.cancelAllScheduledNotificationsAsync();

    const today = new Date();

    // Include today (i = 0): if the app is opened before 8 AM, today's notification still fires.
    // Schedule 7 more days so notifications keep firing even if the user doesn't open the app daily.
    const futureDates = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return getLocalDateString(d);
    });

    const { data } = await supabase
      .from('bands')
      .select('name, active_date')
      .in('active_date', futureDates);

    const bandByDate = new Map(
      (data ?? []).map((b) => [b.active_date, b.name])
    );

    for (const dateStr of futureDates) {
      const [year, month, day] = dateStr.split('-').map(Number);
      // Construct 8 AM in LOCAL time to avoid UTC offset issues
      const fireDate = new Date(year, month - 1, day, 8, 0, 0, 0);
      if (fireDate <= today) continue;

      const bandName = bandByDate.get(dateStr);
      const title = bandName
        ? `Today's band is ${bandName}`
        : "Today's band is waiting";

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: 'Check it in the app!',
          sound: true,
          channelId: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fireDate,
        },
      });
    }
  } catch (e) {
    console.error('Failed to schedule daily notification:', e);
  }
}
