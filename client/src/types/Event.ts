// src/types/Event.ts

import { PriceTier } from "./PriceTier";

export interface Event {
  eventId: string;
  eventName: string;
  maxAttendees: number;
  registrationStartDate: Date;
  eventDate: Date;
  registrationOpen: boolean;
  priceTiers: PriceTier[];
  waiverURL: string;
}
  