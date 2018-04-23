import * as React from 'react';
import {create} from 'react-test-renderer';

import App from './App';

it('renders without crashing', () => {
  const tree = create(<App/>).toJSON();
  expect(tree).toMatchSnapshot();
});
