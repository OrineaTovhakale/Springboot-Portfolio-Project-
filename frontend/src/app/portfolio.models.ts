export interface Profile {
  name: string;
  title: string;
  tagline: string;
  biography: string;
}

export interface Project {
  name: string;
  description: string;
  role: string;
  technologies: string[];
  contributions: string[];
  liveUrl: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface ContactReceipt {
  id: number;
  receivedAt: string;
}
