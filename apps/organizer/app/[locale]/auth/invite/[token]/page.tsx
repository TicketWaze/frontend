import LoadingCircleSmall from "@workspace/ui/components/LoadingCircleSmall";
import React from "react";
import ClientContent from "./ClientContent";

interface PageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InvitePage({ params, searchParams }: PageProps) {
  const { token } = await params;
  const { accessToken } = await searchParams;

  return (
    <div className="h-full flex items-center justify-center">
      <ClientContent token={token} accessToken={accessToken as string} />
    </div>
  );
}
