'use client'
import { useLocale } from "next-intl";
import { redirect } from "next/navigation";

export default function page() {
    return redirect(`/analytics`)
}