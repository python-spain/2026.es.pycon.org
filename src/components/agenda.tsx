import { useEffect, useState, useMemo } from 'react'

interface LocalizedString {
  es: string
  en?: string
  [key: string]: string | undefined
}

interface Speaker {
  code: string
  name: string
  avatar: string
}

interface Room {
  id: number
  name: LocalizedString
}

interface Track {
  id: number
  color: string
  name: LocalizedString
}

interface Talk {
  id: number
  title: string | LocalizedString
  start: string
  end: string
  room: number
  track: number | null
  speakers: string[]
  slot_type: 'break' | 'talk' | 'workshop' | string
  duration: number
  language?: string
}

interface ScheduleData {
  talks: Talk[]
  tracks: Track[]
  rooms: Room[]
  speakers: Speaker[]
}

interface ScheduleProps {
  lang?: string
  scheduleData: ScheduleData
}

// Utility to get localized text
const getLocalizedText = (obj: string | LocalizedString | undefined, lang: string): string => {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[lang] || obj.es || ''
}

export default function Schedule({ lang = 'es', scheduleData }: ScheduleProps) {
  // If no data is passed (fallback or error), use empty structure
  const data = scheduleData || {
    talks: [],
    tracks: [],
    rooms: [],
    speakers: [],
  }

  const [selectedTracks, setSelectedTracks] = useState<number[]>([]) // Array of track IDs
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]) // Array of lang codes
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDay, setActiveDay] = useState('2025-10-18')
  const [favs, setFavs] = useState<number[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Load favorites from local storage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pycones_favs') || '[]')
      setFavs(saved)
    } catch (e) {
      console.error('Failed to load favorites', e)
    }
  }, [])

  const toggleFav = (id: number) => {
    const newFavs = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]
    setFavs(newFavs)
    localStorage.setItem('pycones_favs', JSON.stringify(newFavs))
  }

  // Derived state: Filtered Talks
  const filteredTalks = useMemo(() => {
    return data.talks.filter((talk) => {
      // 1. Day
      const isSameDay = talk.start.startsWith(activeDay)

      // 2. Tracks
      let isSameTrack = true
      if (selectedTracks.length > 0) {
        // If talk has no track (e.g. break), should we hide it if tracks are selected?
        // Usually filters are exclusive. If I select "Python", I want "Python" talks.
        // Breaks usually don't have tracks. Let's assume if track is null it doesn't match if tracks are selected.
        // Or maybe we want to ALWAYS show breaks?
        // The original code was: isSameTrack = selectedTracks.includes(talk.track)
        // This implies if talk.track is null/undefined, it returns false.
        isSameTrack = talk.track !== null && selectedTracks.includes(talk.track)
      }

      // 3. Language
      let isSameLang = true
      if (selectedLangs.length > 0) {
        if (talk.language) {
          isSameLang = selectedLangs.includes(talk.language)
        } else {
          // If no language specified (e.g. breaks), keep it?
          // Original code: isSameLang = true
          isSameLang = true
        }
      }

      // 4. Search
      let isMatchSearch = true
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const title = getLocalizedText(talk.title, lang).toLowerCase()
        const speakers = (talk.speakers || [])
          .map((code) => {
            const s = data.speakers.find((sp) => sp.code === code)
            return s ? s.name.toLowerCase() : ''
          })
          .join(' ')

        isMatchSearch = title.includes(q) || speakers.includes(q)
      }

      return isSameDay && isSameTrack && isSameLang && isMatchSearch
    })
  }, [data.talks, data.speakers, activeDay, selectedTracks, selectedLangs, searchQuery, lang])

  // Filter handlers
  const toggleTrack = (id: number) => {
    if (selectedTracks.includes(id)) {
      setSelectedTracks(selectedTracks.filter((t) => t !== id))
    } else {
      setSelectedTracks([...selectedTracks, id])
    }
  }

  const toggleLang = (code: string) => {
    if (selectedLangs.includes(code)) {
      setSelectedLangs(selectedLangs.filter((l) => l !== code))
    } else {
      setSelectedLangs([...selectedLangs, code])
    }
  }

  const clearFilters = () => {
    setSelectedTracks([])
    setSelectedLangs([])
    setSearchQuery('')
  }

  // Unique days found in data could be computed, but hardcoded for now as per original
  const DAYS = ['2025-10-17', '2025-10-18', '2025-10-19']

  return (
    <div className="flex flex-col gap-6 font-sans text-white">
      {/* Date Navigation & Filter Toggle */}
      <nav className="flex flex-wrap items-center justify-center gap-4 bg-[#111] p-2 rounded-xl border border-[#333]">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 text-sm md:px-6 md:py-2 md:text-base rounded-lg font-bold transition ${
              activeDay === day ? 'bg-pycon-yellow text-pycon-black' : 'text-gray-400 hover:bg-[#222]'
            }`}
          >
            {new Date(day).toLocaleDateString(lang, {
              weekday: 'long',
              day: 'numeric',
            })}
          </button>
        ))}

        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg border border-[#444] transition-colors"
        >
          <FilterIcon />
          Filtros
          {(selectedTracks.length > 0 || selectedLangs.length > 0 || searchQuery) && (
            <span className="flex items-center justify-center w-5 h-5 bg-pycon-yellow text-pycon-black text-xs font-bold rounded-full">
              {selectedTracks.length + selectedLangs.length + (searchQuery ? 1 : 0)}
            </span>
          )}
        </button>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-x-auto pb-8 snap-x">
        {data.rooms.map((room) => {
          const roomTalks = filteredTalks
            .filter((t) => t.room === room.id)
            .sort((a, b) => a.start.localeCompare(b.start))

          if (roomTalks.length === 0) return null

          return (
            <div key={room.id} className="shrink-0 flex flex-col gap-4 snap-start">
              <h2 className="text-xl font-bold border-b border-[#333] pb-2 flex items-center gap-2 sticky top-0 bg-black z-10 py-2 text-pycon-yellow">
                {getLocalizedText(room.name, lang)}
              </h2>

              <div className="flex flex-col gap-4">
                {roomTalks.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    lang={lang}
                    isFav={favs.includes(session.id)}
                    toggleFav={() => toggleFav(session.id)}
                    tracks={data.tracks}
                    speakers={data.speakers}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        tracks={data.tracks}
        selectedTracks={selectedTracks}
        toggleTrack={toggleTrack}
        selectedLangs={selectedLangs}
        toggleLang={toggleLang}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clearFilters={clearFilters}
        resultCount={filteredTalks.length}
        lang={lang}
      />
    </div>
  )
}

function SessionCard({
  session,
  lang,
  isFav,
  toggleFav,
  tracks,
  speakers,
}: {
  session: Talk
  lang: string
  isFav: boolean
  toggleFav: () => void
  tracks: Track[]
  speakers: Speaker[]
}) {
  const isBreak = session.slot_type === 'break'
  const track = tracks.find((t) => t.id === session.track)
  const sessionSpeakers = (session.speakers || [])
    .map((code) => speakers.find((s) => s.code === code))
    .filter((s): s is Speaker => !!s)

  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-lg border relative group transition-all hover:border-gray-500 ${
        isBreak ? 'bg-[#0a0a0a] border-dashed border-[#222]' : 'bg-[#111] border-[#333]'
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="font-mono text-pycon-yellow font-bold text-sm bg-[#222] px-2 py-0.5 rounded">
          {new Date(session.start).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
          {' - '}
          {new Date(new Date(session.start).getTime() + session.duration * 60000).toLocaleTimeString(
            'es-ES',
            {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            },
          )}
        </span>
        {!isBreak && (
          <button
            onClick={toggleFav}
            className={`text-lg transition-all ${isFav ? 'scale-110' : 'opacity-20 hover:opacity-100'}`}
          >
            {isFav ? '⭐' : '☆'}
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <h3 className="font-bold text-lg leading-tight text-balance">
          {getLocalizedText(session.title, lang)}
        </h3>

        {!isBreak && (
          <>
            {sessionSpeakers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {sessionSpeakers.map((s) => (
                  <div
                    key={s.code}
                    className="flex items-center gap-2 bg-[#222] px-2 py-1 rounded-full border border-[#333]"
                  >
                    {s.avatar && <img src={s.avatar} className="w-4 h-4 rounded-full" />}
                    <span className="text-xs text-gray-300">{s.name}</span>
                  </div>
                ))}
              </div>
            )}

            {track && (
              <div className="mt-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded uppercase inline-block"
                  style={{
                    backgroundColor: track.color + '33',
                    color: track.color,
                    border: `1px solid ${track.color}`,
                  }}
                >
                  {getLocalizedText(track.name, lang)}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function FilterModal({
  isOpen,
  onClose,
  tracks,
  selectedTracks,
  toggleTrack,
  selectedLangs,
  toggleLang,
  searchQuery,
  setSearchQuery,
  clearFilters,
  resultCount,
  lang,
}: {
  isOpen: boolean
  onClose: () => void
  tracks: Track[]
  selectedTracks: number[]
  toggleTrack: (id: number) => void
  selectedLangs: string[]
  toggleLang: (code: string) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  clearFilters: () => void
  resultCount: number
  lang: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <dialog
        className="w-full max-w-lg bg-black border border-[#333] rounded-t-2xl md:rounded-2xl p-0 m-0 shadow-2xl flex flex-col max-h-[90vh] text-white"
        open
      >
        <div className="flex justify-between items-center p-4 border-b border-[#333]">
          <h3 className="text-xl font-bold">{lang === 'es' ? 'Filtros' : 'Filters'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-6 bg-[#0a0a0a]">
          {/* Tracks */}
          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase font-bold text-gray-500 tracking-wider">Tracks</label>
            <div className="flex flex-wrap gap-2">
              {tracks.map((track) => {
                const active = selectedTracks.includes(track.id)
                return (
                  <button
                    key={track.id}
                    onClick={() => toggleTrack(track.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-all ${
                      active
                        ? 'bg-white/10 border-white text-white'
                        : 'bg-[#181818] border-[#333] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: track.color }}
                    />
                    <span>{getLocalizedText(track.name, lang)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Languages */}
          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase font-bold text-gray-500 tracking-wider">
              {lang === 'es' ? 'Idiomas' : 'Languages'}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'es', label: 'Español' },
                { code: 'ca', label: 'Català' },
              ].map((langItem) => {
                const active = selectedLangs.includes(langItem.code)
                return (
                  <button
                    key={langItem.code}
                    onClick={() => toggleLang(langItem.code)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      active
                        ? 'bg-white text-black border-white'
                        : 'bg-[#181818] border-[#333] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {langItem.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase font-bold text-gray-500 tracking-wider">
              {lang === 'es' ? 'Búsqueda' : 'Search'}
            </label>
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'es' ? 'Buscar por título, ponente...' : 'Search titles, speakers...'}
                className="w-full bg-[#181818] border border-[#333] text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-pycon-yellow focus:ring-1 focus:ring-pycon-yellow transition-all placeholder:text-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#333] bg-black flex gap-3">
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg font-bold text-gray-400 hover:text-white transition-colors"
          >
            {lang === 'es' ? 'Borrar filtros' : 'Clear all'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg font-bold bg-pycon-yellow text-pycon-black hover:bg-pycon-yellow-75 transition-colors shadow-[0_0_15px_rgba(255,199,44,0.4)]"
          >
            {lang === 'es' ? `Mostrar ${resultCount} resultados` : `Show ${resultCount} results`}
          </button>
        </div>
      </dialog>
    </div>
  )
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  )
}
