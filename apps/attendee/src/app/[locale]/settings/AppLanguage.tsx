'use client'
import React from 'react'
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { useLocale, useTranslations } from 'next-intl'
import Separator from '@/components/Separator'
import { usePathname, useRouter } from '@/i18n/navigation'

export default function AppLanguage() {
    const t = useTranslations('Settings')
    const locale = useLocale()
    const pathname = usePathname();
    const router = useRouter();
    return (
        <div className='flex flex-col gap-6'>
            <span className='font-medium text-[1.8rem] mb-4 leading-[25px] text-deep-100'>{t('language.title')}</span>
            <RadioGroup className="flex flex-col gap-6" defaultValue={locale}>
                <div onClick={()=> {
                    router.replace(pathname, { locale: 'en' });
                    router.refresh()
                }} className="flex items-center justify-between gap-3">
                    <span className="text-[1.6rem] text-deep-100">English</span>
                    <RadioGroupItem value={'en'} />
                </div>
                <Separator />
                <div onClick={()=> {
                    router.replace(pathname, { locale: 'fr' });
                    router.refresh()
                }} className="flex items-center justify-between gap-3">
                    <span className="text-[1.6rem] text-deep-100">Français</span>
                    <RadioGroupItem value={'fr'} />
                </div>
            </RadioGroup>
        </div>
    )
}
