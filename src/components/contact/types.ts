export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface ContactState {
  items?: Contact[];
  error: boolean;
}
