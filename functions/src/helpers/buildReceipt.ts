// functions/src/helpers/buildReceipt.ts

export interface ReceiptData {
    currentTxnGroupData: {
      groupName: string;
      groupSize: number;
      leaderName: string;
      email: string;
    };
    pricePerPerson: number;
    subtotalPrice: number;
    fees: number;
    paymentTotal: number;
    priceTier: string;
    registrationTime: string;
  }
  
  export const buildReceipt = ({
    currentTxnGroupData,
    pricePerPerson,
    subtotalPrice,
    fees,
    paymentTotal,
    priceTier,
    registrationTime,
  }: ReceiptData) => {
    return {
      groupName: currentTxnGroupData.groupName,
      groupSize: currentTxnGroupData.groupSize,
      leaderName: currentTxnGroupData.leaderName,
      email: currentTxnGroupData.email,
      pricePerPerson,
      subtotalPrice,
      fees,
      paymentTotal,
      priceTier,
      registrationTime,
    };
  };
  