import ILoanModel from './ILoanModel';

export default class LoanModel {

  public static precisionRound(unroundedNumber: number, precision:number ): number {
    const factor = Math.pow(10, precision);
    return Math.round(unroundedNumber * factor) / factor;
  }

  constructor(public loanModel: ILoanModel){
    const errors: string[] = [];
    this.validateLoanModel(loanModel, errors);
    if(errors.length > 0){
      throw new Error(this.errorsToString(errors));
    }
    this.loanModel = loanModel;

  }

  // monthly payment = (monthlyInterestRate * principal) / (1 - (1 + monthlyInterestRate)^-term)

  public calculateMonthlyPayment(): number {
    const monthlyInterestRate = this.calculateMonthlyInterest();
    const principal = this.calculatePrincipal();
    if(this.loanModel.term === null || this.loanModel.term === undefined){
      throw new Error("Loan term is required");
    }
    if(monthlyInterestRate ===0){
      return LoanModel.precisionRound(principal / this.loanModel.term, 2);
    }
    const payment =  (monthlyInterestRate*principal) / (1-Math.pow((1+monthlyInterestRate), -1*this.loanModel.term));
    return LoanModel.precisionRound(payment, 2);
  }

  public calculatePrincipal(): number {
    if(this.loanModel.downPayment){
      return LoanModel.precisionRound((this.loanModel.vehiclePrice * (1 + this.loanModel.tax / 100) +this.loanModel.fees)-this.loanModel.downPayment, 2);
    }
    return LoanModel.precisionRound(this.loanModel.vehiclePrice * (1 + this.loanModel.tax / 100) +this.loanModel.fees, 2);

  }

  public calculateMonthlyInterest(): number{
    debugger;
    if(this.loanModel.apr === null || this.loanModel.apr === undefined || isNaN(this.loanModel.apr) ){
      throw new Error("APR is required");
    }
    return this.loanModel.apr / 100 / 12;
  }

  public validateLoanModel(loanModel: ILoanModel, errors: string[]): void{
    this.validateVehiclePrice(loanModel, errors);
    this.validateTax(loanModel, errors);
    this.validateFees(loanModel, errors);
    this.validateDownPayment(loanModel, errors);
    this.validateApr(loanModel, errors);
    this.validateTerm(loanModel, errors);
  }

  public validateTerm(loanModel: ILoanModel, errors: string[]): void{
    this.termMustBePositive(loanModel, errors);
    this.termLessThanTenYears(loanModel, errors);
  }

  public validateApr(loanModel: ILoanModel, errors: string[]): void{
    this.aprMustBePositive(loanModel, errors);
    this.aprMustBeLessThanOneHundred(loanModel, errors);
  }

  public validateDownPayment(loanModel: ILoanModel, errors: string[]): void{
    this.downPaymentMustBePositive(loanModel, errors);
    this.downPaymentLessThanPrice(loanModel, errors);
  }

  public validateFees(loanModel: ILoanModel, errors: string[]): void{
    this.feesMustBePositive(loanModel, errors);
    this.feesLessThanMax(loanModel, errors);
  }

  public validateTax(loanModel: ILoanModel, errors: string[]): void{
    this.taxMustBeLessThanMax(loanModel, errors);
    this.taxMustBePositive(loanModel, errors);
  }

  public validateVehiclePrice(loanModel: ILoanModel, errors: string[]): void{
    this.vehiclePriceMustBePositive(loanModel, errors);
    this.vehiclePriceMustBeLessThanMax(loanModel, errors);
  }

  public vehiclePriceMustBePositive(loanModel: ILoanModel, errors: string[]): void{
    if(loanModel.vehiclePrice< 0){
      errors.push("Positive dollar amount expected for vehicle price\n");
    }
  }

  public vehiclePriceMustBeLessThanMax(loanModel: ILoanModel, errors: string[]): void{
    if(loanModel.vehiclePrice> 500000.00){
      errors.push("Vehicle price too high\n");
    }
  }

  public taxMustBeLessThanMax(loanModel: ILoanModel, errors: string[]): void{
    if(loanModel.tax>100.00){
      errors.push("Tax too high\n");
    }
  }

  public taxMustBePositive(loanModel:ILoanModel, errors: string[]): void{
    if(loanModel.tax<0){
      errors.push("Tax must be positive percentage\n");
    }
  }

  public feesMustBePositive(loanModel: ILoanModel, errors: string[]): void{
    if(loanModel.fees<0){
      errors.push("Fees must be positive dollar amount\n");
    }
  }

  public feesLessThanMax(loanModel: ILoanModel, errors: string[]): void{
    if(loanModel.fees>10000.00){
      errors.push("Fees too high\n");
    }
  }

  public downPaymentMustBePositive(loanModel: ILoanModel, errors: string[]): void{
    if(loanModel.downPayment && loanModel.downPayment < 0){
      errors.push("Down payment must be a positive dollar amount\n");
    }
  }

  public downPaymentLessThanPrice(loanModel: ILoanModel, errors: string[]): void{
    debugger;
    if(loanModel.downPayment && loanModel.downPayment > loanModel.vehiclePrice){
      errors.push("Down payment must be less than vehicle price\n");
    }
  }

  public aprMustBePositive(loanModel: ILoanModel, errors: string[]): void{
    if(loanModel.apr && loanModel.apr < 0){
      errors.push("APR must be a positive percentage\n");
    }
  }

  public aprMustBeLessThanOneHundred(loanModel: ILoanModel, errors: string[]): void{
    if(loanModel.apr && loanModel.apr>100){
      errors.push("APR too high, seek better loan\n");
    }
  }

  public termMustBePositive(loanModel: ILoanModel, errors: string[]): void{
    if(loanModel.term && loanModel.term<0){
      errors.push("Loan term must be a positive number of months\n");
    }
  }

  public termLessThanTenYears(loanModel: ILoanModel, errors: string[]): void{
    if(loanModel.term && loanModel.term>120){
      errors.push("Loan term too long\n");
    }
  }

  private errorsToString(errors: string[]): string{
    const errorMessage: string = errors.join(',');
    return errorMessage.substring(0, errorMessage.length - 1);
  }
}
