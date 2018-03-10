import React from 'react';
import PropTypes from 'prop-types';
import './app.css';
import { Calendar, DatePicker } from 'react-persian-datepicker';

const Counter = ({
  increment,
  incrementIfOdd,
  incrementAsync,
  decrement,
  counter,
}) => (
  <p>
    Clicked: {counter} times
    {' '}
    <button onClick={increment}>+</button>
    {' '}
    <button onClick={decrement}>-</button>
    {' '}
    <button onClick={incrementIfOdd}>Increment if odd</button>
    {' '}
    <button onClick={() => incrementAsync()}>Increment async</button>
    <hr />
    <Calendar />
    <hr />
    <DatePicker />
  </p>
);

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  incrementAsync: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired,
};

export default Counter;
