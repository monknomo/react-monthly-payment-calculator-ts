import ILoanModel from './ILoanModel';
import PaymentMath from './PaymentMath';

let loanModel: ILoanModel = {
  fees:242,
  tax:10.4,
  vehiclePrice : 25000.00
};

beforeEach(()=> {
  loanModel = {
    fees:242,
    tax:10.4,
    vehiclePrice : 25000.00
  };
});

it('set vehicle price', () => {
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.loanModel.vehiclePrice).toBe(loanModel.vehiclePrice);
});

test('set negative vehicle price', () => {
  loanModel.vehiclePrice = -25000.00;
  expect(() => new PaymentMath(loanModel)).toThrowError(/^Positive dollar amount expected for vehicle price$/)
});

test('set exorbinant vehicle price', () => {
  loanModel.vehiclePrice = 500000.01;
  expect(()=> new PaymentMath(loanModel)).toThrowError(/^Vehicle price too high$/);
})

test('set conventional down payment', () => {
  loanModel.downPayment = 15000.00;
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.loanModel.downPayment).toBe(loanModel.downPayment);
});

test('set zero down payment', () => {
  loanModel.downPayment = 0;
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.loanModel.downPayment).toBe(loanModel.downPayment));
});

test('set negative down payment', () =>{
  loanModel.downPayment = -15000.00;
  expect(() => new PaymentMath(loanModel)).toThrowError(/^Down payment must be a positive dollar amount$/);
});

test('down payment must be less than vehicle price', ()=>{
  loanModel.downPayment = 25000.01;
  expect(() => new PaymentMath(loanModel)).toThrowError(/^Down payment must be less than vehicle price$/);
})

test('set reasonable apr', ()=>{
    loanModel.apr = 5.25;
    const paymentMath = new PaymentMath(loanModel);
    expect(paymentMath.loanModel.apr).toBe(loanModel.apr);
})

test('set negative apr', ()=>{
  loanModel.apr = -5.25;
  expect(() => new PaymentMath(loanModel)).toThrowError(/^APR must be a positive percentage$/);
});

test('set usurious apr', () => {
    loanModel.apr = 100.01;
    expect(() => new PaymentMath(loanModel)).toThrowError(/^APR too high, seek better loan$/);
});

test('set reasonable terms', () =>{
  loanModel.term = 24;
  const twentyFourMonthCalculator = new PaymentMath(loanModel);
  expect(twentyFourMonthCalculator.loanModel.term).toBe(loanModel.term);

  loanModel.term = 36;
  const thirtySixMonthCalculator = new PaymentMath(loanModel);
  expect(thirtySixMonthCalculator.loanModel.term).toBe(loanModel.term);

  loanModel.term = 48;
  const fortyEightMonthCalculator = new PaymentMath(loanModel);
  expect(fortyEightMonthCalculator.loanModel.term).toBe(loanModel.term);
  loanModel.term = 60;
  const sixtyMonthCalculator = new PaymentMath(loanModel);
  expect(sixtyMonthCalculator.loanModel.term).toBe(loanModel.term);
});

test('set negative term', ()=>{
  loanModel.term = -24;
  expect(() => new PaymentMath(loanModel)).toThrowError(/^Loan term must be a positive number of months$/);
});

test('set excessively lengthy term', ()=>{
  loanModel.term = 121;
  expect(() => new PaymentMath(loanModel)).toThrowError(/^Loan term too long$/)
});

test('set tax', ()=>{
  loanModel.tax = 10.4;
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.loanModel.tax).toBe(loanModel.tax);
});

test('set zero tax', ()=>{
  loanModel.tax = 0;
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.loanModel.tax).toBe(loanModel.tax);
});

test('set negative tax', ()=>{
  loanModel.tax = -10.4;
  expect( () => new PaymentMath(loanModel)).toThrowError(/^Tax must be positive percentage$/);
});

test('set incredible tax', ()=>{
  loanModel.tax = 100.1;
  expect( () => new PaymentMath(loanModel)).toThrowError(/^Tax too high$/);
})

test('set fees', ()=>{
  loanModel.fees = 242.00;
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.loanModel.fees).toBe(loanModel.fees);
});

test('set zero fees', ()=>{
  loanModel.fees = 0.00;
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.loanModel.fees).toBe(loanModel.fees);
});

test('set negative fees', ()=>{
  loanModel.fees = -242.00;
  expect(() => new PaymentMath(loanModel)).toThrowError(/^Fees must be positive dollar amount$/);
});

test('set incredible fees', ()=>{
  loanModel.fees = 10000.01;
  expect(() => new PaymentMath(loanModel)).toThrowError(/^Fees too high$/)
});

test('calculate monthly interest rate', () =>{
  loanModel.apr = 6.5;
  loanModel.term = 60;
  const expectedMonthlyInterest = 6.5 / 100 / 12;
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.calculateMonthlyInterest()).toBe(expectedMonthlyInterest);
});

test('calculate monthly interest rate no apr', () => {
  const paymentMath = new PaymentMath(loanModel);
  expect(() => {paymentMath.calculateMonthlyInterest()}).toThrowError(/^APR is required$/);
})

test('calculate principal', () => {
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.calculatePrincipal()).toBe(27842);
});

test('calculate principal with down payment', () => {;
  loanModel.downPayment = 10000
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.calculatePrincipal()).toBe(17842);
});

test('calculate monthly payment', ()=>{
  loanModel.term = 60;
  loanModel.apr = 6.5;
  loanModel.fees = 0;
  loanModel.tax = 0;
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.calculateMonthlyPayment()).toBe(489.15);
});

test('calculate monthly payment with fees', ()=>{
  loanModel.vehiclePrice = 24900;
  loanModel.term = 60;
  loanModel.apr = 6.5;
  loanModel.fees = 100;
  loanModel.tax = 0;
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.calculateMonthlyPayment()).toBe(489.15);
});

test('calculate monthly payment with fees and tax', () =>{
  loanModel.vehiclePrice = 22554.35;
  loanModel.term = 60;
  loanModel.apr = 6.5;
  loanModel.fees = 100;
  loanModel.tax = 10.4;
  const paymentMath = new PaymentMath(loanModel);
  expect(paymentMath.calculateMonthlyPayment()).toBe(489.15);
});

test('calculate monthly payment no apr', () => {
  const paymentMath = new PaymentMath(loanModel);
  expect(() => {paymentMath.calculateMonthlyPayment()}).toThrowError(/^APR is required$/);
});
