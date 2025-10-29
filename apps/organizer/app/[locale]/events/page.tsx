import OrganizerLayout from "@/components/Layouts/OrganizerLayout";
import { LinkPrimary } from "@/components/Links";
import TopBar from "@workspace/ui/components/TopBar";
import { getTranslations } from "next-intl/server";
import React from "react";
import EventPageContent from "./EventPageContent";
import { api } from "@/lib/Api";
import { auth } from "@/lib/auth";
import { organisationPolicy } from "@/lib/role/organisationPolicy";

export default async function EventPage() {
  const t = await getTranslations("Events");
  const session = await auth();
  const events = await api(
    `/organisations/${session?.activeOrganisation.organisationId}/events`,
    session?.user.accessToken ?? ""
  );
  const authorized = await organisationPolicy.createEvent(
    session?.user.userId ?? "",
    session?.activeOrganisation.organisationId ?? ""
  );
  return (
    <OrganizerLayout title={t("title")}>
      <TopBar title={t("title")}>
        {authorized && (
          <>
            <LinkPrimary className="hidden lg:block" href="/events/create">
              {t("create")}
            </LinkPrimary>
            <LinkPrimary
              className="lg:hidden absolute bottom-40 right-8 "
              href="/events/create"
            >
              {t("create")}
            </LinkPrimary>
          </>
        )}
      </TopBar>
      <EventPageContent events={events.events} />
    </OrganizerLayout>
  );
}
