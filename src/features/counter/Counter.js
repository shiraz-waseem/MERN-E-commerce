import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import counterReducer, {
    increment,
    incrementByAmount,
  } from './counterSlice';

const Counter = () => {
    const count = useSelector(selectCount);
    const dispatch = useDispatch();


  return (
    <div></div>
  )
}

export default Counter