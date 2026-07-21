import { parseBand } from '../utils/band';

const validRow = {
  id: 1,
  name: 'Black Sabbath',
  country: 'United Kingdom',
  year_founded: 1968,
  is_active: false,
  genre: 'Heavy Metal',
  essential_album_title: 'Paranoid',
  essential_album_year: 1970,
  fun_fact: 'Invented heavy metal.',
  wikipedia_url: 'https://en.wikipedia.org/wiki/Black_Sabbath',
  active_date: '2026-07-21',
};

describe('parseBand', () => {
  it('accepts a fully valid row', () => {
    expect(parseBand(validRow)).toEqual(validRow);
  });

  it.each([null, undefined, 'string', 42, true, []])(
    'rejects non-object input: %p',
    (input) => {
      expect(parseBand(input)).toBeNull();
    }
  );

  it.each(['id', 'name', 'genre', 'essential_album_title', 'active_date'])(
    'rejects a row missing required field %s',
    (field) => {
      const row: Record<string, unknown> = { ...validRow };
      delete row[field];
      expect(parseBand(row)).toBeNull();
    }
  );

  it.each(['name', 'genre', 'essential_album_title', 'active_date'])(
    'rejects empty string in required field %s',
    (field) => {
      expect(parseBand({ ...validRow, [field]: '' })).toBeNull();
    }
  );

  it('rejects wrong types in required fields', () => {
    expect(parseBand({ ...validRow, id: '1' })).toBeNull();
    expect(parseBand({ ...validRow, name: 123 })).toBeNull();
    expect(parseBand({ ...validRow, active_date: new Date() })).toBeNull();
  });

  it('falls back to safe defaults for optional fields', () => {
    const band = parseBand({
      id: 2,
      name: 'Mystery Band',
      genre: 'Doom',
      essential_album_title: 'Unknown',
      active_date: '2026-07-22',
    });
    expect(band).toEqual({
      id: 2,
      name: 'Mystery Band',
      genre: 'Doom',
      essential_album_title: 'Unknown',
      active_date: '2026-07-22',
      country: '',
      year_founded: 0,
      is_active: false,
      essential_album_year: 0,
      fun_fact: '',
      wikipedia_url: '',
    });
  });

  it('coerces invalid optional field types to defaults instead of passing them through', () => {
    const band = parseBand({
      ...validRow,
      country: 42,
      year_founded: '1968',
      is_active: 'yes',
      wikipedia_url: { url: 'javascript:alert(1)' },
    });
    expect(band).not.toBeNull();
    expect(band!.country).toBe('');
    expect(band!.year_founded).toBe(0);
    expect(band!.is_active).toBe(false);
    expect(band!.wikipedia_url).toBe('');
  });

  it('does not leak unexpected extra fields from the row', () => {
    const band = parseBand({ ...validRow, evil_extra: 'payload' });
    expect(band).not.toBeNull();
    expect(Object.keys(band!).sort()).toEqual(Object.keys(validRow).sort());
  });
});
