import React from 'react';

const CalculatorScreen = (props) => {
    return (
      <div className="calcScreenStyle">
        <div id="equation-field" className="equationFieldStyle">
          {props.equation}</div>
        <div id="current-field" className="currentFieldStyle">{props.currentValue}</div>
      </div>
    );
};

export default CalculatorScreen;