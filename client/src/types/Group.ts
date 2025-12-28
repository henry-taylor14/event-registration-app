// src/types/Group.ts

import { Receipt } from "./Receipt";

export interface Group {
    groupId: string;
    groupName: string;
    normalizedGroupName?: string;
    leaderName: string;
    email: string;
    phone: string;
    groupSize: number;
    updateTime?: any;
    createdBy?: string;
    numberCheckedIn: number;
    paymentStatus?: 'paid' | 'unpaid' | 'partially paid';
    paymentTotal?: number;
    receipts: Receipt[];
  }
  
  export interface GroupFormData {
    groupName: string;
    leaderName: string;
    email: string;
    phone: string;
    groupSize: number;
  }
  