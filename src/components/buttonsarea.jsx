import React from 'react';
import CalculationUtils from './calculation-utils';

export default class CalculatorButtonsArea extends React.Component {
  // Instance of a class with External functions
  functions = new CalculationUtils();

  // constructor
  constructor(props) {
    super();
    this.state = {
      currentValue: props.currentValue,
      operator: "",
      firstNumber: null,
      secondNumber: null,
      currentEquation: props.equation,
      result: 0,
      operatorClicked: false,
      newEquation: true
    };

  }

  // Updates current value on the screen
  changeCurrentValue = () => {
    this.props.changeCurrentValue(this.state.currentValue);
  }
  // Shows result on the screen
  getResult = () => {
    this.props.changeCurrentValue(this.state.result);
  }
  // Updates equation on the screen
  changeEquation = () => {
    this.props.changeEquation(this.state.currentEquation);
  }

  // Click handle
  onButtonClick = (e) => {
    let buttonValue = e.target.innerText;
    let isNumbersOrOperator = this.functions.checkTypeOfButtonClicked(buttonValue); // Returns type of the clicked button (number, operator, other)

    switch (isNumbersOrOperator) {
      case "number":
        this.functions.numberClicked(this, buttonValue);
        break;
      case "operator":
        this.functions.operatorClicked(this, buttonValue);
        break;
      case "other":
        this.functions.otherButtonClicked(this, buttonValue);
        break;
      default:
        break;
    }
  }

  render() {
    var buttonsArray = ["CE", "C", "DEL", "÷", 7, 8, 9, "×", 4, 5, 6, "−", 1, 2, 3, "+", "±", 0, ".", "="];
    var result = [];
    for (var i = 0; i < buttonsArray.length; i++) {
      result.push(<div className="calcButtonStyle" key={i} onClick={this.onButtonClick}>
        {buttonsArray[i]}
      </div>);
    }
    return (
      <div className="calcButtonsAreaStyle">
        {result}
      </div>
    )
  }
}
