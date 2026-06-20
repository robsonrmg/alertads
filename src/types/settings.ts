export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  plan: string;
  createdAt: string;
}

export interface UserNotifications {
  id?: string;
  userId: string;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  whatsappNumber: string;
}

export interface UpdateProfileInput {
  fullName: string;
}

export interface UpdateNotificationsInput {
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  whatsappNumber: string;
}
