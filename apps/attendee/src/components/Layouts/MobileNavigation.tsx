'use client'
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@workspace/ui/lib/utils'
import { Chart1, Clock, Moneys, Setting2, Star, Ticket, User, UserSquare, HambergerMenu, Setting5, Setting, I24Support, Logout } from 'iconsax-react';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { signOut } from 'next-auth/react';

export default function MobileNavigation({ className }: { className?: string; }) {
  const t = useTranslations("Layout.sidebar");
  const pathname = usePathname();
  const locale = useLocale()
  const links = [
    {
      label: t("links.explore"),
      path: `/explore`,
      Icon: Ticket,
    },
    {
      label: t("links.upcoming"),
      path: `/upcoming`,
      Icon: Star,
    },
    {
      label: t("links.profile"),
      path: `/profile`,
      Icon: User,
    },
  ];
  const moreLinks = [
    {
      label: t("links.history"),
      path: `/history`,
      Icon: Clock,
    },
    {
      label: t("links.organizers"),
      path: `/organizers`,
      Icon: UserSquare,
    },
    {
      label: t("links.preferences"),
      path: `/preferences`,
      Icon: Setting5,
    },
    {
      label: t("links.settings"),
      path: `/settings`,
      Icon: Setting,
    },
  ];

  function isMoreLinkActive(path: string) {
    return path.startsWith('/history') || path.startsWith('/organizers') || path.startsWith('/preferences') || path.startsWith('/settings')
  }
  function isActive(path: string) {
    return pathname.startsWith(path);
  }
  return (
    <nav
      className={cn(`lg:hidden rounded-t-3xl px-[1.5rem]`, className)}>
      <ul className={' flex gap-4 justify-between w-full'}>
        {links.map(({ label, Icon, path }) => {
          return (
            <li key={path}>
              <Link
                href={path}
                className={` group font-normal group text-[1.5rem] leading-[20px] text-neutral-700 hover:text-primary-500 flex flex-col items-center  gap-4 ${isActive(path) && 'font-semibold text-primary-500 is-active'}`}
              >
                <Icon
                  size="20"
                  className={`transition-all duration-500 ${isActive(path) ? "stroke-primary-500 fill-primary-500" : "stroke-neutral-900 fill-neutral-900 group-hover:stroke-primary-500 group-hover:fill-primary-500"}  `}
                  variant="Bulk"
                />
                <span className={''}>{label}</span>
              </Link>
            </li>
          )
        })}
        <li>
          <Popover>
            <PopoverTrigger>
              <div
                className={` group font-normal group text-[1.5rem] leading-[20px] text-neutral-700 hover:text-primary-500 flex flex-col items-center  gap-4 ${isMoreLinkActive(pathname) && 'font-semibold text-primary-500 is-active'}`}
              >
                <HambergerMenu
                  size="20"
                  className={`transition-all duration-500 ${isMoreLinkActive(pathname) ? "stroke-primary-500 fill-primary-500" : "stroke-neutral-900 fill-neutral-900 group-hover:stroke-primary-500 group-hover:fill-primary-500"}  `}
                  variant="Bulk"
                />
                <span className={''}>{t('more')}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className={
                'w-[250px] p-0 m-0 bg-none shadow-none border-none mx-4'
              }
            >
              <div
                className={
                  'bg-neutral-100 border border-neutral-200 right-8 p-4  mb-8 rounded-[1rem] shadow-xl bottom-full flex flex-col gap-4'
                }
              >
                <span
                  className={
                    'font-medium py-[5px] border-b-[1px] border-neutral-200 text-[1.4rem] text-deep-100 leading-[20px]'
                  }
                >
                  {t('more')}
                </span>
                <ul className={'flex flex-col gap-4'}>
                  {moreLinks.map(({ Icon, label, path }) => {
                    return (
                      <li key={path}>
                        <Link href={path} className='flex items-center gap-4 py-4'>
                          <Icon
                            size="20"
                            className={`transition-all duration-500 ${isActive(path) ? "stroke-primary-500 fill-primary-500" : "stroke-neutral-900 fill-neutral-900 group-hover:stroke-primary-500 group-hover:fill-primary-500"}  `}
                            variant="Bulk"
                          />
                          <span className={`text-[1.5rem] leading-4  ${isActive(path) ? 'text-primary-500' : 'text-neutral-700'}`}>{label}</span>
                        </Link>
                      </li>
                    )
                  })}
                  <div className='bg-neutral-200 h-[1px] w-full'></div>
                  <Link target='_blank'  href={`https://ticketwaze.com/${locale}/contact`} className='flex items-center gap-4 py-4'>
                    <I24Support
                      size="20"
                      color='#737C8A'
                      variant="Bulk"
                    />
                    <span className={`text-[1.5rem] leading-4 text-neutral-700`}>{t('help')}</span>
                  </Link>
                  <button onClick={()=>signOut({redirect: true, redirectTo : process.env.NEXT_PUBLIC_APP_URL})} className='flex items-center gap-4 py-4'>
                    <Logout size="20" color="#737c8a" variant="Bulk" />
                    <span className={`text-[1.5rem] leading-4 text-neutral-700`}>{t('logout')}</span>
                  </button>
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </li>
      </ul>
    </nav>
  )
}
