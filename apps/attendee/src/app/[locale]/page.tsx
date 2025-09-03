'use client'
import { useLocale } from "next-intl";
import { redirect } from "next/navigation";

export default function page() {
    const locale = useLocale()
    return redirect(`/${locale}/explore`)
}