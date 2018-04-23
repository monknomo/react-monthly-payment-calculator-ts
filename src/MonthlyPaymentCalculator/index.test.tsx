import * as React from 'react';
import {create} from 'react-test-renderer';
import MonthlyPaymentCalculator from './index';

it('renders without crashing', () => {
  const component = create(<MonthlyPaymentCalculator  vehiclePrice={25000} tax={10.4} fees={242}/>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});
