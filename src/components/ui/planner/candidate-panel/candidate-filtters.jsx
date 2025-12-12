import { defaultWindow, tonightRange } from '@/data/demo-data';

import Button from '../../buttons/button';
import InputBase from '../../input/input-base';

export default function CandidateFilters({
  mode,
  setMode,
  win,
  setWin,
  filterType,
  setFilterType,
  query,
  setQuery,
  selectedCity,
  setSelectedCity,
  availableCities,
}) {
  return (
    <div className="gap-4 mb-4">
      <div className="flex flex-col text-medium text-[16px] gap-4 md:flex-wrap lg:flex-row">
        <div className="flex justify-between gap-2 items-center bg-white-dark rounded-xl p-2">
          <label>Mode</label>
          <select
            className="text-blue border border-blue rounded-xl px-2 py-1 hover:bg-blue-light"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="walking">On foot</option>
            <option value="cycling">Bicycle</option>
            <option value="driving">Car</option>
          </select>
        </div>
        <div className="flex justify-between gap-2 items-center bg-white-dark rounded-xl p-2">
          <label>Day window</label>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              type="datetime-local"
              className="text-blue border border-blue rounded-xl px-2 py-1 hover:bg-blue-light"
              value={new Date(win.from).toISOString().slice(0, 16)}
              onChange={(e) =>
                setWin((w) => ({
                  ...w,
                  from: new Date(e.target.value).toISOString(),
                }))
              }
            />
            <input
              type="datetime-local"
              className="text-blue border border-blue rounded-xl px-2 py-1 hover:bg-blue-light"
              value={new Date(win.to).toISOString().slice(0, 16)}
              onChange={(e) =>
                setWin((w) => ({
                  ...w,
                  to: new Date(e.target.value).toISOString(),
                }))
              }
            />
          </div>
        </div>
        <div className="flex justify-between gap-2 items-center bg-white-dark rounded-xl p-2 ">
          <label>Quick</label>
          <div className="flex gap-2">
            <Button
              className="px-2 py-1 text-blue border border-blue rounded-xl hover:bg-blue-light"
              onClick={() => setWin(defaultWindow())}
            >
              +6 hours
            </Button>
            <Button
              className="px-2 py-1 text-blue border border-blue rounded-xl hover:bg-blue-light"
              onClick={() => setWin(tonightRange())}
            >
              Evening
            </Button>
          </div>
        </div>
        <div className="flex justify-between gap-2 items-center bg-white-dark rounded-xl p-2">
          <div>Candidates</div>
          <div className="flex gap-2">
            {['both', 'places', 'events'].map((t) => (
              <Button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2 py-1 text-blue border border-blue rounded-xl ${filterType === t ? 'bg-blue-light' : ''} hover:bg-blue-light`}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
        {false && (availableCities && availableCities.length > 0) && (
          <div className="flex justify-between gap-2 items-center bg-white-dark rounded-xl p-2">
            <div>City</div>
            <div className="flex gap-2 flex-wrap">
              {availableCities.map((city) => {
                const cityKey = city.id || city.name;
                const isSelected = selectedCity && (
                  (selectedCity.id && city.id === selectedCity.id) ||
                  (selectedCity.name && city.name === selectedCity.name)
                );
                return (
                  <Button
                    key={cityKey}
                    onClick={() => setSelectedCity(city)}
                    className={`px-2 py-1 text-blue border border-blue rounded-xl ${isSelected ? 'bg-blue-light' : ''} hover:bg-blue-light`}
                  >
                    {city.name || `City ${city.id}`}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {false && (
        <InputBase
          placeholder="search candidates"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          divClasses="my-4"
        />
      )}
    </div>
  );
}
