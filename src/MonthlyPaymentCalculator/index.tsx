import * as React from 'react';
import MaskedInput from 'react-text-mask';
import {createNumberMask} from 'text-mask-addons';
import ILoanModel from './ILoanModel';
import LoanModel from './LoanModel';

interface IMonthlyPaymentCalculatorProps {
  vehiclePrice: number,
  tax: number,
  fees:number
};

interface IMonthlyPaymentCalculatorState {
  apr: string,
  downPayment: string,
  term: string
};

export default class MonthlyPaymentCalculator extends React.Component<IMonthlyPaymentCalculatorProps,IMonthlyPaymentCalculatorState>{

  constructor(props: IMonthlyPaymentCalculatorProps){
    super(props);
    this.state = {apr:"0450", downPayment:"0",term:"60"};
    this.handleChange = this.handleChange.bind(this);
  }

  public handleChange(event: any): void {
    const field = event.target.name;
    const modifiedState = {};
    modifiedState[field] = event.target.value;
    this.setState(modifiedState);
  }

  public render(){
    const aprPercent = Number(this.state.apr.substring(0,2).replace(/\_/g,""));
    const aprDecimal =  Number(this.state.apr.substring(2,4).replace(/\_/g,""))/10;
    let numericApr = aprPercent;
    if(!isNaN(aprDecimal)){
      numericApr += aprDecimal;
    }
    const loanModel: ILoanModel = {
      apr: numericApr,
      downPayment: Number(this.state.downPayment.replace(/\$|\_|,/g, "")),
      fees: this.props.fees,
      tax: this.props.tax,
      term: Number(this.state.term),
      vehiclePrice: this.props.vehiclePrice
    }
    let errors = "";
    let monthlyPayment: number = 0;
    let principal: number = 0;
    try{
      const paymentMath: LoanModel = new LoanModel(loanModel);
      monthlyPayment = paymentMath.calculateMonthlyPayment();
      principal = paymentMath.calculatePrincipal();
    }catch(e){
      errors = e.message;
    }
    return (
      <form>

        <div>
          <h1>Car Loan Monthly Payment Calculator</h1>
        </div>
        <div>
          {errors}
        </div>
        <div>
          Vehicle Price: ${this.props.vehiclePrice}
        </div>
        <div>
          <label htmlFor="downPayment">Down Payment: </label>
          <MaskedInput name="downPayment" mask={createNumberMask({})}
            id="monthlyPaymentCalculator-downPayment" required={true}
            value={this.state.downPayment} onChange={this.handleChange}/>

        </div>
        <div>
          <label htmlFor="apr">APR: </label>
          <MaskedInput name="apr" mask={[/\d/,/\d/,'.',/\d/,/\d/,'%']} required={true}
            value={this.state.apr} onChange={this.handleChange}/>
        </div>
        <div>
          <label htmlFor="term">Term: </label>
          <select name="term" id="monthlyPaymentCalculator-term"
            value={this.state.term} onChange={this.handleChange}>
            <option value="24">24 Month Term</option>
            <option value="36">36 Month Term</option>
            <option value="48">48 Month Term</option>
            <option value="60">60 Month Term</option>
          </select>
        </div>
        <div>
          <h2>Estimated Payment</h2>
          <div>Tax Rate: {this.props.tax}%</div>
          <div>Total Tax: ${this.props.vehiclePrice * this.props.tax / 100}</div>
          <div>Fees: ${this.props.fees}</div>
          <div>Principal: ${principal}</div>
          <hr/>
          <div>Monthly Payment: ${monthlyPayment}</div>
        </div>
    </form>
    )
  }

}
