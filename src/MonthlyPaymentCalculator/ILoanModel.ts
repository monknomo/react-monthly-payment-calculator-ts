export default interface ILoanModel {
  vehiclePrice: number;
  tax: number;
  fees: number;
  downPayment?: number;
  apr?: number;
  term?:number;
}
