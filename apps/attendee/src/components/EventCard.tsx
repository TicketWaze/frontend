import { Link } from '@/i18n/navigation'
import EventTag from '@/types/EventTag'
import { Calendar2, Location } from 'iconsax-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

function EventCard({
  image,
  name,
  date,
  city,
  country,
  price,
  currency,
  href,
  aside,
  tags
}: {
  image: string
  name: string
  date: Date
  city: string
  country: string
  price: number
  currency: string
  href: string
  aside?: boolean,
  tags: EventTag[]
}) {
  const t = useTranslations('Event')
  
  const newDate = new Date(date);

const formatted = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}).format(newDate);
  
  return (
    <Link
      href={href}
      className={`flex flex-row items-center lg:items-stretch lg:mb-8 lg:ml-4 lg:flex-col gap-4 w-full ${!aside && 'lg:max-w-[350px]'} bg-white shadow-lg rounded-[1rem] overflow-hidden pb-4 pl-4 lg:pl-0`}
    >
      <Image
        src={image}
        className={
          'h-[155px] lg:h-[191px] flex-1 lg:flex-auto w-[155px] lg:w-full object-cover object-left-top rounded-[1rem] '
        }
        alt={name}
        height={191}
        width={255}
      />
      <div className={'px-4 flex flex-1 lg:flex-auto flex-col gap-[1.5rem] lg:gap-4'}>
        <ul className='lg:flex  items-center gap-4'>
          {tags.map(tag => (
            <li key={tag.tagId} className='bg-primary-50 hidden lg:block py-1 px-4 rounded-[30px] text-[1rem] text-primary-500 font-primary leading-[15px]'>
              {tag.tagName}
            </li>
          ))}
          <span className='bg-primary-50 lg:hidden py-1 px-4 rounded-[30px] text-[1rem] text-primary-500 font-primary w-auto leading-[15px]'>{tags[0]?.tagName}</span>
        </ul>
        <h1 className={'font-bold font-primary text-[1.2rem] text-deep-100 leading-[17px]'}>{name}</h1>
        <div className={'flex flex-col lg:flex-row gap-[1.5rem]  lg:items-center justify-between'}>
          <div className={'flex items-center gap-[5px]'}>
            <Calendar2 size="15" color="#2e3237" variant="Bulk" />
            <span className={'font-medium text-[1rem] text-deep-100 leading-[15px]'}>
              {formatted}
            </span>
          </div>
          <div className={'flex items-center gap-[5px]'}>
            <Location size="15" color="#2e3237" variant="Bulk" />
            <p className={'font-medium text-[1rem] text-deep-100 leading-[15px]'}>
              {city}, <span className={'text-neutral-700'}>{country}</span>
            </p>
          </div>
        </div>
        <p className="font-bold text-[1.2rem] leading-[15px] text-primary-500">
          {price > 0 ? (
            <>
              {t('from')} {price} <span className="font-normal text-neutral-700">{currency}</span>
            </>
          ) : (
            t('free')
          )}
        </p>
      </div>
    </Link>
  )
}

export default EventCard
