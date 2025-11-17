'use client';

import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

import EventCard from '@/components/event-card';
import Container from '@/components/layout/container';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import Button from '@/components/ui/button';
import Filter from '@/components/ui/filter/filter';
import InputButton from '@/components/ui/input/input-button';
import Map from '@/components/ui/map';

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState(['events', 'map']);

  const handleTabClick = (tab) => {
    setActiveTab((prev) =>
      prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab],
    );
  };

  const checkActiveTab = (tab) => activeTab.includes(tab);

  // ! Temporary until data is connected
  const address = 'Sample City';
  const pathname = usePathname();
  const linkAddress = pathname.split('/');

  const breadcrumbs = useMemo(
    () => [
      { label: 'WeekendPlanner', href: '/' },
      { label: linkAddress[1] || 'search', href: '/search' },
    ],
    [linkAddress],
  );

  return (
    <Container className="flex flex-col gap-5 md:h-[800px] lg:h-[1038px]">
      <InputButton placeholder="Search" divClasses="mt-5">
        <Search className="w-6 h-6" />
      </InputButton>

      <div>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="relative">
        <h1 className="text-base leading-6 text-black font-medium md:text-[22px] md:leading-7">
          Events in {address}
        </h1>

        <ul className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
          <li>
            <Button
              isDisabled={false}
              clickFunction={() => handleTabClick('events')}
              label="Events"
              classes={
                'text-black font-light text-xs md:text-sm md:font-medium md:leading-6 lg:text-sm lg:font-medium lg:leading-6 hover:text-blue hover:underline' +
                (checkActiveTab('events') ? ' text-blue underline' : '')
              }
            >
              Events
            </Button>
          </li>

          <li>
            <Button
              isDisabled={false}
              clickFunction={() => handleTabClick('map')}
              label="Map"
              classes={
                'text-black font-light text-xs md:text-sm md:font-medium md:leading-6 lg:text-sm lg:font-medium lg:leading-6 hover:text-blue hover:underline' +
                (checkActiveTab('map') ? ' text-blue underline' : '')
              }
            >
              Map
            </Button>
          </li>

          <li className="md:hidden lg:hidden">
            <Button
              isDisabled={false}
              clickFunction={() => handleTabClick('filters')}
              label="Filters"
              classes={
                'text-black font-light text-xs md:text-sm md:font-medium md:leading-6 lg:text-sm lg:font-medium lg:leading-6 hover:text-blue hover:underline' +
                (checkActiveTab('filters')
                  ? ' text-blue underline width-[700px]'
                  : '')
              }
            >
              Filters
            </Button>
          </li>
        </ul>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <section
          className={
            (checkActiveTab('filters') ? 'block' : 'hidden') + ' md:block'
          }
        >
          <Filter />
        </section>

        <section className={checkActiveTab('events') ? 'block' : 'hidden'}>
          <div className="space-y-4">
            {/* * Temporary until data is connected*/}
            {[1, 2, 3, 4, 5].map((event) => (
              <div key={event}>
                <EventCard />
              </div>
            ))}
          </div>
        </section>

        <section className={checkActiveTab('map') ? 'block' : 'hidden'}>
          <div className="h-64 rounded-xl border">
            <Map />
          </div>
        </section>
      </div>
    </Container>
  );
}
