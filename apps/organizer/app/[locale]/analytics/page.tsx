import OrganizerLayout from "@/components/Layouts/OrganizerLayout";
import AnalyticsPageTopbar from "./AnalyticsPageTopbar";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import DailyTicketSalesChart from "./DailyTicketSalesChart";
import DoughnutChart from "./DoughnutChart";
import BarChart from "./BarChart";
import { api } from "@/lib/Api";
import { organisationPolicy } from "@/lib/role/organisationPolicy";
import UnauthorizedView from "@/components/Layouts/UnauthorizedView";
import Ticket from "@/types/Ticket";
import { InfoCircle } from "iconsax-react";
import TruncateUrl from "@/lib/TruncateUrl";

export default async function AnalyticsPage() {
  const session = await auth();
  const currentOrganisation = session?.activeOrganisation;
  const t = await getTranslations("Analytics");
  const analytics = await api(
    `/organisations/${session?.activeOrganisation.organisationId}/analytics`,
    session?.user.accessToken ?? ""
  );

  const authorized = await organisationPolicy.viewAnalytics(
    session?.user.userId ?? "",
    currentOrganisation?.organisationId ?? ""
  );
  console.log(analytics.topEvents);

  return (
    <OrganizerLayout title="Analytics">
      {authorized ? (
        <>
          <AnalyticsPageTopbar
            isVerified={currentOrganisation?.isVerified ?? false}
            title={currentOrganisation?.organisationName ?? ""}
            description={t("description")}
          ></AnalyticsPageTopbar>
          {/* main */}
          <div
            className={
              "flex flex-col gap-[30px] overflow-y-scroll lg:gap-[40px]"
            }
          >
            <div
              className={
                "grid grid-cols-2 lg:divide-x divide-neutral-100 border-neutral-100 lg:border-b lg:grid-cols-4"
              }
            >
              <div className={" border-b lg:border-b-0"}>
                <div
                  className={
                    "mb-[20px] border-r border-neutral-100 pr-[25px] lg:pb-[30px] lg:mb-0 lg:border-r-0"
                  }
                >
                  <div className={"flex justify-between"}>
                    <span
                      className={
                        "text-start text-[14px] text-neutral-600 font-sans leading-tight pb-[5px]"
                      }
                    >
                      {t("revenue")}
                    </span>
                  </div>
                  <p
                    className={
                      "text-[16px] font-medium capitalize leading-loose font-primary lg:text-[25px]"
                    }
                  >
                    {analytics.totalRevenue}{" "}
                    <span className={"font-normal text-neutral-500"}>HTG</span>
                  </p>
                </div>
              </div>

              <div className={" border-b lg:border-b-0"}>
                <div
                  className={
                    "pl-[25px] mb-[20px] lg:px-[25px] lg:pb-[30px] lg:mb-0"
                  }
                >
                  <div className={"flex justify-between"}>
                    <span
                      className={
                        "text-start text-[14px] text-neutral-600 font-sans leading-tight pb-[5px]"
                      }
                    >
                      {t("sold")}
                    </span>
                  </div>
                  <p
                    className={
                      "text-[16px] font-medium capitalize leading-loose font-primary lg:text-[25px]"
                    }
                  >
                    {analytics.ticketsSold.length}
                  </p>
                </div>
              </div>

              <div>
                <div
                  className={
                    "mt-[20px] pr-[25px] border-r border-neutral-100 lg:px-[25px] lg:pb-[30px] lg:mt-0 lg:border-r-0"
                  }
                >
                  <div className={"flex justify-between"}>
                    <span
                      className={
                        "text-start text-[14px] text-neutral-600 font-sans leading-tight pb-[5px]"
                      }
                    >
                      {t("content.upcomingTitle")}
                    </span>
                  </div>
                  <p
                    className={
                      "text-[16px] font-medium capitalize leading-loose font-primary lg:text-[25px]"
                    }
                  >
                    {analytics.upcomingEvents}
                  </p>
                </div>
              </div>

              <div>
                <div className={"mt-[20px] pl-[25px] lg:pb-[30px] lg:mt-0"}>
                  <div className={"flex justify-between"}>
                    <span
                      className={
                        "text-start text-[14px] text-neutral-600 font-sans leading-tight pb-[5px]"
                      }
                    >
                      {t("content.followers")}
                    </span>
                  </div>
                  <p
                    className={
                      "text-[16px] font-medium capitalize leading-loose font-primary lg:text-[25px]"
                    }
                  >
                    {analytics.followers}
                  </p>
                </div>
              </div>
            </div>

            {/* tickets analytic stat */}
            <div className={"flex flex-col gap-[20px] lg:gap-[25px]"}>
              <h3
                className={
                  "self-stretch justify-start font-medium font-primary text-[18px] leading-loose text-black lg:text-[22px]"
                }
              >
                {t("tickets.title")}
              </h3>
              <div
                className={
                  "grid-cols-1 grid  lg:grid-cols-21 lg:divide-x divide-neutral-100 border-neutral-100 lg:border-b"
                }
              >
                <div
                  className={
                    "w-full pt-[15px] pb-[20px] lg:pr-[30px] lg:pb-[30px] lg:col-span-11 "
                  }
                >
                  <div className={"flex flex-col gap-[20px] lg:gap-[25px]"}>
                    <span
                      className={
                        "text-[14px] font-sans justify-start text-gray-800 text-base font-medium leading-tight lg:text-[15px]"
                      }
                    >
                      {t("tickets.daily")}
                    </span>
                    <DailyTicketSalesChart
                      tickets={analytics.ticketsSold as Ticket[]}
                    />
                  </div>
                </div>
                <div
                  className={
                    "flex flex-col gap-[20px] w-full lg:flex-row col-span-10 lg:pt-[15px] lg:pb-[30px] lg:pl-[30px]"
                  }
                >
                  <div
                    className={"w-full flex flex-col gap-[20px] lg:gap-[25px]"}
                  >
                    <span
                      className={
                        "text-[14px] font-sans justify-start text-gray-800 text-base font-medium leading-tight lg:text-[15px]"
                      }
                    >
                      {t("tickets.classes")}
                    </span>
                    <div
                      className={
                        "flex justify-between items-start lg:grid lg:grid-cols-2 gap-x-[50px] lg:gap-y-[35px]"
                      }
                    >
                      <div
                        className={"grid grid-cols justify-start items-start"}
                      >
                        <div
                          className={
                            "justify-start items-center gap-[5px] inline-flex"
                          }
                        >
                          <div
                            className={
                              "w-[15px] h-[15px] bg-[#FFEFE2] rounded-[5px]"
                            }
                          ></div>
                          <div
                            className={
                              "text-[#8F96A1] text-[14px] font-sans font-medium"
                            }
                          >
                            General
                          </div>
                        </div>
                        <div
                          className={
                            "justify-start font-medium text-black text-[25px] font-primary capitalize leading-none"
                          }
                        >
                          {analytics.ticketsGeneral ?? 0}%
                        </div>
                      </div>

                      <div
                        className={"flex flex-col justify-start items-start"}
                      >
                        <div
                          className={
                            "justify-start items-center gap-[5px] inline-flex"
                          }
                        >
                          <div
                            className={
                              "w-[15px] h-[15px] bg-[#FF8A9F] rounded-[5px]"
                            }
                          ></div>
                          <div
                            className={
                              "text-[#8F96A1] text-[14px] font-sans font-medium"
                            }
                          >
                            VIP
                          </div>
                        </div>
                        <div
                          className={
                            "justify-start font-medium text-black text-[25px] font-primary capitalize leading-none"
                          }
                        >
                          {analytics.ticketsVIP ?? 0}%
                        </div>
                      </div>

                      <div
                        className={"flex flex-col justify-start items-start"}
                      >
                        <div
                          className={
                            "justify-start items-center gap-[5px] inline-flex"
                          }
                        >
                          <div
                            className={
                              "w-[15px] h-[15px] bg-[#E752AE] rounded-[5px]"
                            }
                          ></div>
                          <div
                            className={
                              "text-[#8F96A1] text-[14px] font-sans font-medium"
                            }
                          >
                            Premium VIP
                          </div>
                        </div>
                        <div
                          className={
                            "justify-start font-medium text-black text-[25px] font-primary capitalize leading-none"
                          }
                        >
                          {analytics.ticketPremiumVip ?? 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"h-[175px] justify-center items-center flex"}>
                    <DoughnutChart analytics={analytics} />
                  </div>
                </div>
              </div>
            </div>

            {/* event analytic stat */}
            <div className={"flex flex-col gap-[20px] lg:gap-[25px]"}>
              <h3
                className={
                  "font-medium font-primary text-[18px] leading-[30px] text-black lg:text-[22px]"
                }
              >
                {t("event.event_demographics.title")}
              </h3>
              <div
                className={
                  "grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0 divide-neutral-100 border-neutral-100 lg:border-b"
                }
              >
                <div
                  className={
                    "flex flex-col gap-[20px] pb-[15px] lg:pr-[25px] lg:pb-[20px]"
                  }
                >
                  <span
                    className={
                      "text-[14px] text-black-100 font-sans font-medium lg:text-[15px]"
                    }
                  >
                    {t("event.event_demographics.gender_distribution.title")}
                  </span>
                  <div className={"w-full"}>
                    <BarChart
                      category1={t(
                        "event.event_demographics.gender_distribution.gender.male"
                      )}
                      category2={t(
                        "event.event_demographics.gender_distribution.gender.female"
                      )}
                      category3={t(
                        "event.event_demographics.gender_distribution.gender.others"
                      )}
                      percent1={`${Math.round(analytics.genderPercentages.male)}%`}
                      percent2={`${Math.round(analytics.genderPercentages.female)}%`}
                      percent3={`${Math.round(analytics.genderPercentages.other)}%`}
                    ></BarChart>
                  </div>
                </div>
                <div
                  className={
                    "flex flex-col pt-[15px] gap-[20px] lg:pl-[25px] lg:pb-[20px] lg:pt-[0]"
                  }
                >
                  <span
                    className={
                      "text-[14px] text-black-100 font-medium lg:text-[15px]"
                    }
                  >
                    {t("event.event_demographics.events_top.title")}
                  </span>
                  <div className={"w-full"}>
                    {analytics.topEvents.length > 0 ? (
                      <BarChart
                        category1={
                          TruncateUrl(
                            analytics.topEvents[0].eventName ?? "",
                            9
                          ) ?? ""
                        }
                        category2={
                          analytics.topEvents.length >= 2
                            ? (TruncateUrl(
                                analytics.topEvents[1]?.eventName ?? "",
                                9
                              ) ?? "")
                            : ""
                        }
                        category3={
                          TruncateUrl(
                            analytics.topEvents[2]?.eventName ?? "",
                            9
                          ) ?? ""
                        }
                        percent1={analytics.topEvents[0]?.percentage ?? "0%"}
                        percent2={
                          analytics.topEvents.length >= 2
                            ? analytics.topEvents[1]?.percentage
                            : "0%"
                        }
                        percent3={analytics.topEvents[2]?.percentage ?? "0%"}
                      ></BarChart>
                    ) : (
                      <div className="flex justify-center">
                        <InfoCircle size="32" color="#D5D8DC" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* feedback analytic */}
            <div className={"flex flex-col gap-[25px] mb-6"}>
              <h3
                className={
                  "font-medium font-primary text-[18px] text-black lg:text-[22px]"
                }
              >
                {t("feedback.title")}
              </h3>
              <div
                className={
                  "flex flex-col gap-[15px] lg:flex-row lg:justify-between"
                }
              >
                {/* <div className={"flex flex-col gap-[10px]"}>
                  <span className={"text-[14px] text-neutral-500 font-sm"}>
                    {t("feedback.action.click_on_event")}
                  </span>
                  <p
                    className={
                      "font-medium text-[25px] text-black capitalize font-primary"
                    }
                  >
                    {"N/A"}
                  </p>
                </div> */}

                {/* <div className={"flex flex-col gap-[10px]"}>
                  <span className={"text-[14px] text-neutral-500 font-sm"}>
                    {t("feedback.action.social_media_shares")}
                  </span>
                  <p
                    className={
                      "font-medium text-[25px] text-black capitalize font-primary"
                    }
                  >
                    {analytics.socialShares}
                  </p>
                </div> */}

                <div className={"flex flex-col gap-[10px]"}>
                  <span className={"text-[14px] text-neutral-500 font-sm"}>
                    {t("feedback.action.add_favorite")}
                  </span>
                  <p
                    className={
                      "font-medium text-[25px] text-black capitalize font-primary"
                    }
                  >
                    {analytics.favorites}
                  </p>
                </div>

                <div className={"flex flex-col gap-[10px]"}>
                  <span className={"text-[14px] text-neutral-500 font-sm"}>
                    {t("feedback.action.rated")}
                  </span>
                  <div
                    className={
                      "flex font-medium text-[25px] capitalize font-primary"
                    }
                  >
                    <p className={" text-black "}>{analytics.average}</p>
                    <span className={"text-neutral-500"}>/5</span>
                  </div>
                </div>
                <div className={"flex flex-col gap-[10px]"}>
                  <span className={"text-[14px] text-neutral-500  font-sm"}>
                    {t("feedback.action.reviews")}
                  </span>
                  <p
                    className={
                      "font-medium text-[25px] text-black capitalize font-primary"
                    }
                  >
                    {analytics.totalReviews}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <UnauthorizedView />
      )}
    </OrganizerLayout>
  );
}
