import * as React from 'react';
import './App.css';
import MonthlyPaymentCalculator from './MonthlyPaymentCalculator/MonthlyPaymentCalculator';

class App extends React.Component {
  public render() {
    return (
      <MonthlyPaymentCalculator vehiclePrice={25000} tax={10.4} fees={242}/>
    );
  }
}

export default App;
