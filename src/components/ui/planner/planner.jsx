'use client';

import { useMemo, useState, useEffect, useRef } from 'react';

import {
  KYIV,
  defaultWindow,
  tonightRange,
} from '@/data/demo-data';
import { usePlannerLogic } from '@/hooks/use-planner-logic';
import { fmtTime } from '@/utils/time';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import { selectFavorites } from '@/libs/redux/slices/favorites-slice';

import Button from '../buttons/button';
import Map from '../map';
import CandidateFilters from './candidate-panel/candidate-filtters';
import CandidatePanel from './candidate-panel/candidate-panel';
import Timeline from './timeline/timeline';
import { getCityByName, getCityById } from '@/services/fetch/get-city';
import { haversineKm } from '@/utils/geo';


const isPointInBoundingBox = (point, bbox) => {
  if (!bbox || !point || !point.lat || !point.lon) return false;
  return (
    point.lat >= bbox.minLat &&
    point.lat <= bbox.maxLat &&
    point.lon >= bbox.minLon &&
    point.lon <= bbox.maxLon
  );
};

const isWithinCityRadius = (point, cityCenter, maxRadiusKm = 50) => {
  if (!point || !cityCenter || !point.lat || !point.lon || 
      !cityCenter.lat || !cityCenter.lon) return false;
  try {
    const distance = haversineKm(point, cityCenter);
    return distance <= maxRadiusKm;
  } catch (error) {
    return false;
  }
};


export default function PlannerPrototype() {
  const lockedCityKeyRef = useRef(null);

  const [city, setCity] = useState('Kyiv');
  const [mode, setMode] = useState('walking');
  const [origin, setOrigin] = useState(KYIV);
  const [win, setWin] = useState(defaultWindow());

  const [filterType, setFilterType] = useState('both');
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);

  const favorites = useAppSelector(selectFavorites);

  const detectedCity = useMemo(() => {
    const favoritesArray = Object.values(favorites).filter(Boolean);
    if (favoritesArray.length === 0) return null;
    
    const firstItem = favoritesArray[0];
    
    if (firstItem.city && typeof firstItem.city === 'object') {
      return firstItem.city;
    }
    
    if (firstItem.city_id) {
      return { id: firstItem.city_id };
    }
    
    return null;
  }, [favorites]);

  const availableCities = useMemo(() => {
    if (!favorites) return [];
    const favoritesArray = Object.values(favorites).filter(Boolean);
    const citiesMapObj = new globalThis.Map();

    favoritesArray.forEach((item) => {
      let cityInfo = null;
      
      if (item.city && typeof item.city === 'object') {
        cityInfo = {
          id: item.city.id || null,
          name: item.city.name || null,
          countryCode: item.city.countryCode || null,
        };
      } else if (item.city_id) {
        cityInfo = {
          id: item.city_id,
          name: item.city_name || `City ${item.city_id}`,
          countryCode: null,
        };
      }

      if (cityInfo) {
        const key = cityInfo.id || cityInfo.name;
        if (key && !citiesMapObj.has(key)) {
          citiesMapObj.set(key, cityInfo);
        }
      }
    });

    return Array.from(citiesMapObj.values()).sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      return nameA.localeCompare(nameB);
    });
  }, [favorites]);

  
  useEffect(() => {
    if (!selectedCity && availableCities.length > 0) {
      setSelectedCity(availableCities[0]);
    }
  }, [availableCities, selectedCity]);

  const [selectedCityData, setSelectedCityData] = useState(null);

  useEffect(() => {
    const loadCityData = async () => {
      if (!selectedCity) {
        setSelectedCityData(null);
        return;
      }
      
      try {
        let cityData = null;
        if (selectedCity.name) {
          cityData = await getCityByName(selectedCity.name);
        } else if (selectedCity.id) {
          cityData = await getCityById(selectedCity.id);
        }
        
        if (cityData) {
          setSelectedCityData(cityData);
        }
      } catch (error) {
        console.error('Failed to load city data:', error);
        setSelectedCityData(null);
      }
    };
    
    loadCityData();
  }, [selectedCity]);

  useEffect(() => {
    const setCityOrigin = async () => {
      const targetCity = selectedCity || (availableCities.length > 0 ? availableCities[0] : null);
      
      if (!targetCity) {
        return;
      }

      try {
        let cityData = null;

        if (targetCity.name) {
          cityData = await getCityByName(targetCity.name);
          if (cityData?.name) {
            setCity(cityData.name);
          }
        } 
        else if (targetCity.id) {
          cityData = await getCityById(targetCity.id);
          if (cityData?.name) {
            setCity(cityData.name);
          }
        }

        if (cityData?.coordinates?.lat && cityData?.coordinates?.lon) {
          setOrigin({ lat: cityData.coordinates.lat, lon: cityData.coordinates.lon });
        } else if (cityData?.center) {
          setOrigin({ lat: cityData.center.lat, lon: cityData.center.lon });
        } else if (cityData?.location) {
          setOrigin({ lat: cityData.location.lat, lon: cityData.location.lon });
        } else if (cityData?.geo) {
          setOrigin({ lat: cityData.geo.lat, lon: cityData.geo.lon });
        } else if (targetCity.coordinates?.lat && targetCity.coordinates?.lon) {
          setOrigin({ lat: targetCity.coordinates.lat, lon: targetCity.coordinates.lon });
        } else if (targetCity.center) {
          setOrigin({ lat: targetCity.center.lat, lon: targetCity.center.lon });
        } else if (targetCity.location) {
          setOrigin({ lat: targetCity.location.lat, lon: targetCity.location.lon });
        } else if (targetCity.geo) {
          setOrigin({ lat: targetCity.geo.lat, lon: targetCity.geo.lon });
        } else {
          const calculateCenterFromCityFavorites = () => {
            if (!favorites) return null;
            const favoritesArray = Object.values(favorites).filter(Boolean);
            
            const cityItems = favoritesArray.filter((item) => {
              let itemCity = null;
              
              if (item.city && typeof item.city === 'object') {
                itemCity = {
                  id: item.city.id || null,
                  name: item.city.name || null,
                };
              } else if (item.city_id) {
                itemCity = {
                  id: item.city_id,
                  name: item.city_name || null,
                };
              }

              if (!itemCity) return false;

              return (
                (targetCity.id && itemCity.id === targetCity.id) ||
                (targetCity.name && itemCity.name === targetCity.name)
              );
            });

            const validLocations = cityItems
              .map(item => item.location || item.geo)
              .filter(loc => loc && typeof loc.lat === 'number' && typeof loc.lon === 'number');

            if (validLocations.length > 0) {
              const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
              const avgLon = validLocations.reduce((sum, loc) => sum + loc.lon, 0) / validLocations.length;
              return { lat: avgLat, lon: avgLon };
            }

            return null;
          };

          const centerFromFavorites = calculateCenterFromCityFavorites();
          if (centerFromFavorites) {
            setOrigin(centerFromFavorites);
          }
        }
      } catch (error) {
        console.error('Failed to fetch city data:', error);
        const calculateCenterFromCityFavorites = () => {
          if (!favorites) return null;
          const favoritesArray = Object.values(favorites).filter(Boolean);
          
          const cityItems = favoritesArray.filter((item) => {
            let itemCity = null;
            
            if (item.city && typeof item.city === 'object') {
              itemCity = {
                id: item.city.id || null,
                name: item.city.name || null,
              };
            } else if (item.city_id) {
              itemCity = {
                id: item.city_id,
                name: item.city_name || null,
              };
            }

            if (!itemCity) return false;

            return (
              (targetCity.id && itemCity.id === targetCity.id) ||
              (targetCity.name && itemCity.name === targetCity.name)
            );
          });

          const validLocations = cityItems
            .map(item => item.location || item.geo)
            .filter(loc => loc && typeof loc.lat === 'number' && typeof loc.lon === 'number');

          if (validLocations.length > 0) {
            const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
            const avgLon = validLocations.reduce((sum, loc) => sum + loc.lon, 0) / validLocations.length;
            return { lat: avgLat, lon: avgLon };
          }

          return null;
        };

        const centerFromFavorites = calculateCenterFromCityFavorites();
        if (centerFromFavorites) {
          setOrigin(centerFromFavorites);
        }
      }
    };

    setCityOrigin();
  }, [selectedCity, availableCities, favorites]);

  const logic = usePlannerLogic({ origin, win, mode });

  useEffect(() => {
    if (logic.items.length === 0) {
      lockedCityKeyRef.current =null;
    }
  }, [logic.items.length]);
  
  const hasMixedCities = useMemo(() => {
    if (logic.items.length <= 1) return false;
  
    const cityKey = logic.items[0].__cityKey;
    return logic.items.some(item => item.__cityKey !== cityKey);
  }, [logic.items]);

  const getCityKey = (city) => {
    if (!city) return null;
  
    if (city.id !== undefined && city.id !== null) {
      return `id:${String(city.id)}`;
    }
  
    if (city.name) {
      return `name:${city.name.toLowerCase()}`;
    }
  
    return null;
  };

  const resolveCandidateCityKey = (candidate) => {
    if (candidate.city) {
      return getCityKey(candidate.city);
    }
  
    return getCityKey(selectedCity);
  };

  const handleAddCandidate = (candidate) => {
    const cityKey = resolveCandidateCityKey(candidate);
    
    if (!cityKey) {
      alert('Cannot determine city for this place');
      return;
    }
  
    if (!lockedCityKeyRef.current) {
      lockedCityKeyRef.current = cityKey;
    }
    
    if (lockedCityKeyRef.current !== cityKey) {
      alert('Cannot add items from different cities');
      return;
    }
    logic.addCandidate(candidate);
  };



  const filteredCandidates = useMemo(() => {
    if (!favorites) return [];
    const favoritesArray = Object.values(favorites).filter(Boolean);
    
    const res = favoritesArray
      .map((item) => {
        const itemType = item.type === 'event' ? 'event' : 'place';
        
        if (filterType === 'events' && itemType !== 'event') return null;
        if (filterType === 'places' && itemType !== 'place') return null;
        
        if (selectedCity) {
          let itemCity = null;
          
          if (item.city && typeof item.city === 'object') {
            itemCity = {
              id: item.city.id || null,
              name: item.city.name || null,
            };
          } else if (item.city_id) {
            itemCity = {
              id: item.city_id,
              name: item.city_name || null,
            };
          }

          let matchesCity = false;
          if (itemCity) {
            if (itemCity.id && selectedCity.id && itemCity.id === selectedCity.id) {
              matchesCity = true;
            } else if (itemCity.name && selectedCity.name && 
                     itemCity.name.toLowerCase() === selectedCity.name.toLowerCase()) {
              matchesCity = true;
            }
          }
          
          if (!matchesCity && item.location && item.location.lat && item.location.lon) {
            const placeCoords = { lat: item.location.lat, lon: item.location.lon };
            
            if (selectedCityData?.boundingBox) {
              const bbox = selectedCityData.boundingBox;
              if (isPointInBoundingBox(placeCoords, {
                minLat: bbox.minLat,
                maxLat: bbox.maxLat,
                minLon: bbox.minLon,
                maxLon: bbox.maxLon
              })) {
                matchesCity = true;
              }
            }
            
            if (!matchesCity && selectedCityData?.coordinates) {
              const cityCenter = {
                lat: selectedCityData.coordinates.lat,
                lon: selectedCityData.coordinates.lon
              };

              if (isWithinCityRadius(placeCoords, cityCenter, 50)) {
                matchesCity = true;
              }
            }
            
            if (!matchesCity && origin && typeof origin.lat === 'number' && typeof origin.lon === 'number') {
              if (isWithinCityRadius(placeCoords, origin, 50)) {
                matchesCity = true;
              }
            }
          }

          if (!matchesCity) {
            if (itemType === 'place') {
              console.log('Place filtered out by city:', item.name || item.title || 'unnamed');
            }
            return null;
          }
        }    
        
        const searchText = itemType === 'event' 
          ? `${item.title || item.name || ''} ${item.category_code || item.primaryCategory?.name || item.categories?.[0]?.name || ''}`
          : `${item.name || item.title || ''} ${item.category_code || item.primaryCategory?.name || item.categories?.[0]?.name || ''}`;
        
        if (query && !searchText.toLowerCase().includes(query.toLowerCase())) {
          return null;
        }
        
        if (itemType === 'place') {
          const placeCandidate = {
            type: 'place',
            id: item.id || item.__key,
            name: item.name || item.title,
            category: item.category_code || item.primaryCategory?.name || item.categories?.[0]?.name || 'place',
            geo: item.location ? { lat: item.location.lat, lon: item.location.lon } : null,
            defaultStayMin: item.defaultStayMin || 60,
            city: item.city || (item.city_id ? { id: item.city_id, name: item.city_name || null } : null),
            __cityKey: getCityKey(
            item.city ||
            (item.city_id ? { id: item.city_id, name: item.city_name || null } : null) ||
            selectedCity 
          ),
          };
          
          console.log('Place candidate created:', placeCandidate);
          return placeCandidate;

        } else {
          const normalizeDate = (dateValue) => {
            if (!dateValue) return null;
            const date = new Date(dateValue);
            return isNaN(date.getTime()) ? null : date.toISOString();
          };

          const startAt = normalizeDate(
            item.start_at || item.nextOccurrence?.startsAt || item.occurrences?.[0]?.start
          );
          const endAt = normalizeDate(
            item.end_at || item.nextOccurrence?.endsAt || item.occurrences?.[0]?.end
          );

          if (!startAt || !endAt) return null;

          return {
            type: 'event',
            id: item.id || item.event_id || item.__key,
            name: item.title || item.name,
            category: item.category_code || item.primaryCategory?.name || item.categories?.[0]?.name || 'event',
            geo: item.location ? { lat: item.location.lat, lon: item.location.lon } : null,
            start_at: startAt,
            end_at: endAt,
            place_id: item.place_id,
            city: item.city || (item.city_id ? { id: item.city_id, name: item.city_name } : null),
            __cityKey: getCityKey(
            item.city ||
            (item.city_id ? { id: item.city_id, name: item.city_name } : null)
          ),
          };
        }
      })
      .filter((item) => {
        if (item === null) return false;
        if (item.type === 'place' && !item.geo) {
          console.warn('Place without geo:', item);
          return false;
        }
        return item.geo !== null;
      });
    console.log('Filtered candidates result:', res);
    return res.sort((a, b) =>
      (a.type === 'event') === (b.type === 'event')
        ? (a.name || '').localeCompare(b.name || '')
        : a.type === 'event'
          ? -1
          : 1,
    );
  }, [
    filterType,
    query,
    favorites,
    selectedCity,
    selectedCityData,
    origin,
  ]);

  return (
    <div className="max-w-[335px] md:max-w-[728px] lg:max-w-[1376px] w-full mx-auto relative">
      <h1 className="font-medium text-[16px] leading-6 lg:text-[28px] lg:mb-8">
        Planner
      </h1>
      <CandidateFilters
        mode={mode}
        setMode={setMode}
        win={win}
        setWin={setWin}
        filterType={filterType}
        setFilterType={setFilterType}
        query={query}
        setQuery={setQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        availableCities={availableCities || []}
      />
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div className="flex flex-col gap-4 md:flex-row lg:flex-row lg:gap-8">
          <CandidatePanel
            lockedCityKey={lockedCityKeyRef.current}
            candidates={filteredCandidates}
            addCandidate={handleAddCandidate}
          />
          <div className="flex flex-col gap-4 md:w-[354px] lg:gap-4 lg:w-[408px]">
            <h1 className="font-medium text-[16px] leading-6 lg:text-[22px] lg:mb-8">
              Selected
            </h1>
            <div className=" max-h-[637px] overflow-auto">
              <div className="flex items-center gap-2">
                <Button
                  className="px-3 py-2 border border-blue rounded-xl text-blue hover:bg-blue-light"
                  onClick={logic.recalc}
                >
                  Recalculate
                </Button>
                <Button
                  className="px-3 py-2 border border-blue rounded-xl text-blue hover:bg-blue-light"
                  onClick={logic.optimize}
                >
                  Optimize order
                </Button>
                <div className="ml-auto">
                  Total: {logic.items.length} item(s)
                </div>
              </div>
              <Timeline
                items={logic.items}
                timeline={logic.timeline}
                metrics={logic.metrics}
                removeItem={logic.removeItem}
                moveDown={hasMixedCities ? undefined : logic.moveDown}
                moveUp={hasMixedCities ? undefined : logic.moveUp}
                updateStay={logic.updateStay}
                optimize={hasMixedCities ? undefined : logic.optimize}
                recalc={logic.recalc}
                win={win}
              />
            </div>
          </div>
        </div>
        {/* Right: map mock */}
        <div>
          <div className="w-full h-[729px] rounded-xl relative overflow-hidden bg-[linear-gradient(45deg,-white,-white)]">
            <div className="absolute top-2 left-2 bg-white/90 rounded-xl shadow px-3 py-2 text-sm">
              Map (demo). Pin order matches timeline. Mode: {mode}
            </div>
            <Map key={logic.items.length === 0 ? 'empty-map' : 'map-with-items'}origin={origin} items={logic.items} mode={mode} useClustering={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
