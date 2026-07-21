const mockIn = jest.fn();
const mockSelect = jest.fn(() => ({ in: mockIn }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

// Fabryka wykonuje się przy imporcie (przed inicjalizacją const powyżej),
// więc mockFrom musi być wywołany leniwie
jest.mock('../services/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...(args as [])),
  },
}));

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  AndroidImportance: { HIGH: 4 },
  SchedulableTriggerInputTypes: { DATE: 'date' },
}));

import * as Notifications from 'expo-notifications';
import { setupDailyNotification } from '../notifications';

const mocked = Notifications as jest.Mocked<typeof Notifications>;

describe('setupDailyNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mocked.requestPermissionsAsync.mockResolvedValue({
      status: 'granted',
    } as never);
    mockIn.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does nothing when permission is denied', async () => {
    mocked.requestPermissionsAsync.mockResolvedValue({
      status: 'denied',
    } as never);
    await setupDailyNotification();
    expect(mocked.scheduleNotificationAsync).not.toHaveBeenCalled();
    expect(mocked.cancelAllScheduledNotificationsAsync).not.toHaveBeenCalled();
  });

  it('cancels previously scheduled notifications before scheduling new ones', async () => {
    jest.setSystemTime(new Date(2026, 6, 21, 6, 0, 0));
    await setupDailyNotification();
    expect(mocked.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
  });

  it('schedules 8 notifications (incl. today) when opened before 8 AM', async () => {
    jest.setSystemTime(new Date(2026, 6, 21, 6, 0, 0));
    await setupDailyNotification();
    expect(mocked.scheduleNotificationAsync).toHaveBeenCalledTimes(8);
    const firstTrigger = mocked.scheduleNotificationAsync.mock.calls[0][0]
      .trigger as { date: Date };
    expect(firstTrigger.date).toEqual(new Date(2026, 6, 21, 8, 0, 0, 0));
  });

  it('skips today when opened after 8 AM', async () => {
    jest.setSystemTime(new Date(2026, 6, 21, 12, 0, 0));
    await setupDailyNotification();
    expect(mocked.scheduleNotificationAsync).toHaveBeenCalledTimes(7);
    const firstTrigger = mocked.scheduleNotificationAsync.mock.calls[0][0]
      .trigger as { date: Date };
    expect(firstTrigger.date).toEqual(new Date(2026, 6, 22, 8, 0, 0, 0));
  });

  it('uses the band name in the title when available, fallback otherwise', async () => {
    jest.setSystemTime(new Date(2026, 6, 21, 12, 0, 0));
    mockIn.mockResolvedValue({
      data: [{ active_date: '2026-07-22', name: 'Judas Priest' }],
    });
    await setupDailyNotification();
    const titles = mocked.scheduleNotificationAsync.mock.calls.map(
      (c) => c[0].content.title
    );
    expect(titles[0]).toBe("Today's band is Judas Priest");
    expect(titles.slice(1)).toEqual(
      Array(6).fill("Today's band is waiting")
    );
  });

  it('swallows errors instead of crashing the app', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockIn.mockRejectedValue(new Error('network down'));
    await expect(setupDailyNotification()).resolves.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
