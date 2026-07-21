export type Band = {
  id: number;
  name: string;
  country: string;
  year_founded: number;
  is_active: boolean;
  genre: string;
  essential_album_title: string;
  essential_album_year: number;
  fun_fact: string;
  wikipedia_url: string;
  active_date: string;
};

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

// Wymagane są tylko pola, których brak wywala render (wywołania .toUpperCase(),
// klucz ulubionych); reszta dostaje bezpieczny fallback zamiast blokować cały dzień
export function parseBand(data: unknown): Band | null {
  if (typeof data !== 'object' || data === null) return null;
  const row = data as Record<string, unknown>;

  if (
    typeof row.id !== 'number' ||
    !nonEmptyString(row.name) ||
    !nonEmptyString(row.genre) ||
    !nonEmptyString(row.essential_album_title) ||
    !nonEmptyString(row.active_date)
  ) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    genre: row.genre,
    essential_album_title: row.essential_album_title,
    active_date: row.active_date,
    country: typeof row.country === 'string' ? row.country : '',
    year_founded: typeof row.year_founded === 'number' ? row.year_founded : 0,
    is_active: row.is_active === true,
    essential_album_year:
      typeof row.essential_album_year === 'number' ? row.essential_album_year : 0,
    fun_fact: typeof row.fun_fact === 'string' ? row.fun_fact : '',
    wikipedia_url: typeof row.wikipedia_url === 'string' ? row.wikipedia_url : '',
  };
}
