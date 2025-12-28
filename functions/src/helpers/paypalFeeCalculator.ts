export const paypalFeeCalculator = (subtotal: number) => {
    return (subtotal * 0.02) + 0.49
}