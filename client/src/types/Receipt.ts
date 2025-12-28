export interface Receipt {
    receiptId: string;
    groupId: string;
    groupName: string;
    groupSize: number;
    leaderName: string;
    email: string;
    pricePerPerson: number;
    subtotalPrice: number;
    fees: number;
    paymentTotal: number;
    priceTier: string;
    registrationTime: string;
  }