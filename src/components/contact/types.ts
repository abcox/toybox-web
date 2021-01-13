import { Status } from "@/store/types";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface ContactState {
  items?: Contact[];
  totalItems: number;
  error: boolean;
  status: Status;
}

export interface ContactListResponse {
  items: Contact[];
  totalItems: number;
}
