import { Status } from "@/store/types";
import { ContactDto } from "toybox-api-client";

// todo: substitute ContactDto in for local declared Contact
export interface Contact extends ContactDto {
  id: string;
  /* name: string;
  email: string;
  phone: string; */
}

export interface ContactState {
  items?: Contact[];
  totalItems?: number;
  error: boolean;
  status: Status;
}

export interface ContactListResponse {
  items: Contact[];
  totalItems: number;
}
