export interface Country {
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
}

export interface WaitlistMember {
  organisationId: string;
  fullName: string;
  email: string;
  role: number;
  dateAdded: DateTime;
  addedBy: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface UserPreference {
  userPreferenceId: string;
  userId: string;
  appLanguage: string;
  upcomingEvents: boolean;
  newEventsPreferredCategories: boolean;
  newEventsFollowedOrganizer: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface UserAnalytic {
  userAnalyticId: string;
  userId: string;
  eventAttended: number;
  eventMissed: number;
  ticketPurchased: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Ticket {
  ticketId: string;
  ticketName: string;
  ticketType: string;
  eventId: string;
  orderId: string;
  userId: string;
  fullName: string;
  email: string;
  ticketPrice: number;
  ticketUsdPrice: number;
  organisationId: string;
  status: "PENDING" | "CHECKED";
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface OrganisationMember {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  role: string;
  addedBy: string;
  joinedAt: DateTime;
  lastLogin: DateTime;
}

export interface Organisation {
  organisationId: string;
  userId: string;
  organisationName: string;
  organisationDescription: string;
  organisationEmail: string;
  organisationWebsite: string;
  country: string;
  state: string;
  city: string;
  profileImageUrl: string | null;
  socialLinks: Record<string, any> | null;
  currencyId: string;
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  organisationPhoneNumber: string;
  balance: number;
  usdBalance: number;
  withdrawalPin: string | null;
  isVerified: boolean;
  isPublished: boolean;
  membershipTierId: string;
  events: Event[];
  followers: User[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Order {
  orderId: string;
  eventId: string;
  userId: string;
  organisationId: string;
  amount: number;
  usdPrice: number;
  orderName: string;
  provider: string;
  status: "PENDING" | "SUCCESSFUL";
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface NotificationPreference {
  organisationPreferenceId: string;
  organisationId: string;
  emailTicketSalesUpdate: boolean;
  emailPaymentUpdates: boolean;
  emailPlatformAnnouncements: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface EventTicketType {
  eventTicketTypeId: string;
  eventId: string;
  organisationId: string;
  ticketTypeName: string;
  ticketTypeDescription: string;
  ticketTypePrice: number;
  currency: string;
  usdPrice: number;
  // currencyId: string;
  ticketTypeQuantity: number;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface EventDay {
  eventDayId: string;
  eventId: string;
  organisationId: string;
  dayNumber: number;
  startDate: string;
  endTime: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface EventTag {
  tagId: string;
  tagName: string;
  tagDescription: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Event {
  eventId: string;
  organisationId: string;
  eventName: string;
  eventDescription: string;
  address: string;
  state: string;
  city: string;
  country: string;
  longitude: string;
  latitude: string;
  eventImageUrl: string;
  eventType: string;
  isPublished: boolean;
  isActive: boolean;
  currency: string;
  eventDays: EventDay[];
  eventTicketTypes: EventTicketType[];
  eventTags: EventTag[];
  discountCodes: DiscountCode[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface User {
  accessToken: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phoneNumber: string;
  profileImageUrl: string | undefined;
  country: string;
  state: string;
  city: string;
  dateOfBirth: DateTime;
  verificationToken: string;
  tokenExpiresAt: DateTime;
  resendCount: number;
  lastResendAt: DateTime;
  isVerified: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
  organisations: Organisation[];
}

export interface Currency {
  currencyId: string;
  currencyName: string;
  isoCode: string;
  exchangeRate: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface DiscountCode {
  discountCodeId: string;
  code: string;
  eventId: string;
  type: "fixed" | "percentage";
  value: number;
  expiresAt: Date;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}
