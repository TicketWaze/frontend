"use client";
import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import Logo from "@workspace/ui/assets/images/logo-horizontal-orange.svg";
import Image from "next/image";
import { Add, ArrowSwapHorizontal, Chart1, I24Support, Logout, Moneys, Setting2, Ticket } from "iconsax-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import VerifierOrganisationCheckMark from "@/components/VerifiedOrganisationCheckMark"
import { signOut } from "next-auth/react";
import { useStore } from "@tanstack/react-store";
import organisationStore from "@/store/OrganisationStore";

function Sidebar({ className }: { className: string }) {
  const t = useTranslations("Layout.sidebar");
  const pathname = usePathname();

  const organisation = useStore(organisationStore, organisationStore => organisationStore.state.organisation)

  const links = [
    {
      label: t("analytics"),
      path: "/analytics",
      Icon: Chart1,
    },
    {
      label: t("events"),
      path: "/events",
      Icon: Ticket,
    },
    {
      label: t("finance"),
      path: "/finance",
      Icon: Moneys,
    },
    {
      label: t("settings"),
      path: "/settings",
      Icon: Setting2,
    },
  ];

  function isActive(path: string) {
    return pathname.startsWith(path);
  }

  return (
    <aside className={cn("flex-col hidden lg:flex", className)}>
      <div className={"flex-1 pt-12 flex flex-col gap-16"}>
        <Image src={Logo} alt={"Ticket Waze Logo"} width={140} height={40} />
        <nav>
          <ul className="flex flex-col gap-4">
            {links.map(({ path, Icon, label }) => {
              return (
                <li key={label}>
                  <Link href={path} className={`group flex items-center gap-4 py-4 relative text-[1.5rem] leading-[20px] ${isActive(path) ? 'font-semibold text-primary-500 is-active' : 'text-neutral-700 hover:text-primary-500'}`}>
                    <Icon
                      size="20"
                      className={`transition-all duration-500 ${isActive(path) ? "stroke-primary-500 fill-primary-500" : "stroke-neutral-900 fill-neutral-900 group-hover:stroke-primary-500 group-hover:fill-primary-500"}  `}
                      // className={`${isActive(path) ? "fill-icon-active" : "fill-icon"} group-hover:fill-icon-active`}
                      variant="Bulk"
                    />
                    <span>{label}</span>
                    <div
                      className={
                        'absolute right-0  opacity-0 group-[.is-active]:translate-x-0 group-[.is-active]:opacity-100 transition-all duration-500 bg-primary-500 w-[2px] h-full'
                      }
                    ></div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="bg-neutral-300 rounded-[12.5px] p-[2.5px]">
        <ul>
          {/* help */}
          <li>
            <Link
              href={''}
              target={'_blank'}
              rel={'noreferrer'}
              className={'flex gap-4 items-center p-4'}
            >
              <I24Support size="20" color="#737c8a" variant="Bulk" />
              <span className={'text-neutral-700 text-[1.5rem] leading-[20px]'}>
                {t('help')}
              </span>
            </Link>
          </li>
          {/* switch organisation */}
          <li className="hidden">
            <button
              // onClick={() => setOrganizerListOpen(true)}
              className={'flex gap-4 items-center p-4 cursor-pointer'}
            >
              <ArrowSwapHorizontal size="20" color="#737c8a" variant="Bulk" />
              <span className={'text-neutral-700 text-[1.5rem] leading-[20px]'}>
                {t('switch')}
              </span>
            </button>
          </li>
          {/* new organisation */}
          <li>
            <Link
              href={'#'}
              className={'flex gap-4 items-center p-4 cursor-pointer'}
            >
              <Add size="20" color="#737c8a" variant="Bulk" />
              <span className={'text-neutral-700 text-[1.5rem] leading-[20px]'}>
                {t('new')}
              </span>
            </Link>
          </li>
          {/* logout */}
          <li className={'flex gap-4 items-center'}>
            <button
              onClick={() => signOut()}
              className={'flex gap-4 items-center cursor-pointer p-4'}
            >
              <Logout size="20" color="#737c8a" variant="Bulk" />
              <span className={'text-neutral-700 text-[1.5rem] leading-[20px]'}>
                {t('logout')}
              </span>
            </button>
          </li>
          {/* Premium + Organisation */}
          <li>
            <div className="mx-2 mb-2 rounded-[12px] p-[2px] bg-gradient-to-r from-primary-500 via-[#E752AE] to-[#DD068B]">
              <Link
                href="/settings/profile"
                className="flex items-center gap-4 bg-neutral-100 p-4 rounded-[10px]"
              >
                {organisation?.profileImageUrl ? <Image src={organisation.profileImageUrl} width={35} height={35} alt={organisation.organisationName} className="rounded-full" /> : <span
                  className="w-[35px] h-[35px] flex items-center justify-center bg-black rounded-full text-white uppercase font-medium text-[2.2rem] leading-[30px] font-primary"
                >
                  {organisation?.organisationName.slice()[0]?.toUpperCase()}
                </span>}

                <div className={'text-neutral-700 text-[1.5rem] flex-1 leading-[20px]'}>
                  <span>{organisation?.organisationName} {organisation?.isVerified ? <VerifierOrganisationCheckMark /> : null}</span>
                </div>
              </Link>
            </div>
          </li>
          {/* Non Premium Organisation */}
          <li className="hidden">
            <Link
              href={'/settings/profile'}
              className={'flex items-center gap-4 bg-neutral-100 p-4 mx-2 mb-2 rounded-[10px]'}
            >
              {organisation?.profileImageUrl ? <Image src={organisation.profileImageUrl} width={35} height={35} alt={organisation.organisationName} className="rounded-full"/> : <span
                  className="w-[35px] h-[35px] flex items-center justify-center bg-black rounded-full text-white uppercase font-medium text-[2.2rem] leading-[30px] font-primary"
                >
                  {organisation?.organisationName.slice()[0]?.toUpperCase()}
                </span>}

              <div className={'text-neutral-700 text-[1.5rem] flex-1 leading-[20px]'}>
                <span>{organisation?.organisationName} {organisation?.isVerified ? <VerifierOrganisationCheckMark /> : null}</span>
              </div>

            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
