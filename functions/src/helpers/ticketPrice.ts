export const getPricePerPerson = (now: Date): number => {
    const earlyBirdDeadline = new Date('2025-05-31');
    const regularDeadline = new Date('2025-06-30');
  
    if (now <= earlyBirdDeadline) return 50;
    if (now <= regularDeadline) return 60;
    return 70;
  };