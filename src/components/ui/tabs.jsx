import Button from './buttons/button';

export default function Tabs({ address, handleTabClick, checkActiveTab }) {
  return (
    <div className="relative">
      <h1 className="text-base leading-6 text-black font-medium md:text-[22px] md:leading-7">
        Events in {address}
      </h1>

      <ul className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
        <li>
          <Button
            isDisabled={false}
            onClick={() => handleTabClick('events')}
            label="Events"
            className={
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
            onClick={() => handleTabClick('map')}
            label="Map"
            className={
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
            onClick={() => handleTabClick('filters')}
            label="Filters"
            className={
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
  );
}
