const mockCapture = jest.fn();
const mockCaptureException = jest.fn();

jest.mock('posthog-react-native', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    capture: mockCapture,
    captureException: mockCaptureException,
  })),
}));

describe('analytics without EXPO_PUBLIC_POSTHOG_API_KEY', () => {
  const originalKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;

  afterEach(() => {
    process.env.EXPO_PUBLIC_POSTHOG_API_KEY = originalKey;
    jest.resetModules();
  });

  it('is a silent no-op instead of crashing', () => {
    delete process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
    jest.isolateModules(() => {
      const analytics = require('../services/analytics');
      expect(analytics.posthog).toBeNull();
      expect(() => analytics.track('band_viewed', { band_id: 1 })).not.toThrow();
      expect(() => analytics.captureError(new Error('x'))).not.toThrow();
    });
    expect(mockCapture).not.toHaveBeenCalled();
    expect(mockCaptureException).not.toHaveBeenCalled();
  });

  it('forwards events to PostHog when the key is present', () => {
    process.env.EXPO_PUBLIC_POSTHOG_API_KEY = 'phc_test';
    jest.isolateModules(() => {
      const analytics = require('../services/analytics');
      analytics.track('band_viewed', { band_id: 1 });
      analytics.captureError(new Error('boom'), { where: 'test' });
    });
    expect(mockCapture).toHaveBeenCalledWith('band_viewed', { band_id: 1 });
    expect(mockCaptureException).toHaveBeenCalledWith(expect.any(Error), {
      where: 'test',
    });
  });
});
