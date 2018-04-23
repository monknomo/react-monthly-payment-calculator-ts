import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MonthlyPaymentCalculator from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MonthlyPaymentCalculator  vehiclePrice={25000} tax={10.4} fees={242}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
