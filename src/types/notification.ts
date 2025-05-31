export interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  outreachId?: string;
  sender: {
    companyProfile?: {
      name: string;
      logo: string;
    };
  };
}
