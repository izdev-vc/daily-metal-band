import {
  formatDateString,
  getLocalDateString,
  shiftDateString,
} from '../utils/date';

describe('getLocalDateString', () => {
  it('formats a date as YYYY-MM-DD with zero padding', () => {
    expect(getLocalDateString(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(getLocalDateString(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('uses local time, not UTC', () => {
    const localMidnight = new Date(2026, 6, 21, 0, 30);
    expect(getLocalDateString(localMidnight)).toBe('2026-07-21');
  });
});

describe('formatDateString', () => {
  it('converts YYYY-MM-DD to DD.MM.YYYY', () => {
    expect(formatDateString('2026-07-21')).toBe('21.07.2026');
    expect(formatDateString('2026-01-05')).toBe('05.01.2026');
  });
});

describe('shiftDateString', () => {
  it('shifts forward and backward within a month', () => {
    expect(shiftDateString('2026-07-21', 1)).toBe('2026-07-22');
    expect(shiftDateString('2026-07-21', -1)).toBe('2026-07-20');
    expect(shiftDateString('2026-07-21', 0)).toBe('2026-07-21');
  });

  it('rolls over month boundaries', () => {
    expect(shiftDateString('2026-07-31', 1)).toBe('2026-08-01');
    expect(shiftDateString('2026-08-01', -1)).toBe('2026-07-31');
  });

  it('rolls over year boundaries', () => {
    expect(shiftDateString('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftDateString('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('handles leap years', () => {
    expect(shiftDateString('2028-02-28', 1)).toBe('2028-02-29');
    expect(shiftDateString('2026-02-28', 1)).toBe('2026-03-01');
  });
});
