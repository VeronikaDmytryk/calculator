import React from 'react';

export default class CalculationUtils extends React.Component {
    checkTypeOfButtonClicked(value) {
        if (/[0-9]|\./.test(value)) {
            return "number";
        } else if (/\+|−|×|÷/.test(value)) {
            return "operator";
        } else {
            return "other";
        }
    }

    currentValueHasDot = (component) => {
        return /\./.test(component.state.currentValue);
    }

    clearAll(component) {
        component.setState({ currentValue: "0", operator: "", firstNumber: null, operatorClicked: false, secondNumber: null, currentEquation: "", newEquation: true, result: 0 }, function () {
            component.changeCurrentValue();
            component.changeEquation();
        });
    }

    addNumberToCurrentValue = (component, buttonValue) => {
        // Do only if number length less than 15 
        if (component.state.currentValue.length < 15) {
            if ((buttonValue === "." && !this.currentValueHasDot(component) && component.state.currentValue) || (buttonValue !== "." && component.state.currentValue !== "0")) {
                component.setState({ currentValue: component.state.currentValue + buttonValue }, component.changeCurrentValue);
            } else if (buttonValue === "." && this.currentValueHasDot(component) && component.state.currentValue) {
                return;
            } else {
                component.setState({ currentValue: buttonValue }, component.changeCurrentValue);
            }
        }
    }

    // Setting current value as a first or second number
    setCurrentValueFirstOrSecond(component) {
        var currentValue = component.state.currentValue;
        if (!component.state.firstNumber) {
            component.setState({ firstNumber: currentValue });
        } else {
            component.setState({ secondNumber: currentValue }, () => {
                this.calculate(component);
            });
        }
    }

    // Add operator as a state and to the equation line
    operatorProcessing(component, currentOperator) {
        let fixIfCurrentValueEndsWithDot = new Promise((resolve) => {
            this.currentValueEndsWithDot(component);
            resolve();
        });
        fixIfCurrentValueEndsWithDot.then(() => {
            var currentEquation = component.state.currentEquation;
            var currentValue = component.state.currentValue;
            if (!component.state.operatorClicked) {
                let setCurrentValueAsNumber = new Promise((resolve) => {
                    this.setCurrentValueFirstOrSecond(component);
                    resolve();
                });
                setCurrentValueAsNumber.then(() => {
                    // Add current Value and operator to equation line
                    currentEquation += currentValue + currentOperator;
                    component.setState({ operator: currentOperator, operatorClicked: true, currentEquation: currentEquation }, function () {
                        component.changeEquation();
                    });
                });
            } else if (component.state.operatorClicked) {
                // Remove operator from the end of equation line
                currentEquation = currentEquation.substr(0, currentEquation.length - 1);
                // Add new operator to equation line
                currentEquation += currentOperator;
                component.setState({ operator: currentOperator, currentEquation: currentEquation }, component.changeEquation);
            }
        });
    }

    currentValueEndsWithDot(component) {
        let currentValue = component.state.currentValue;
        if (currentValue.slice(-1) === ".") {
            // Deletes dot from current value
            component.setState({ currentValue: currentValue.slice(0, -1) }, component.changeCurrentValue);
        }
    }

    deleteLastDigit = (component, curValue) => {
        // If it's a negative value with 1 digit, remove last digit with minus sign
        if ((curValue.length === 2 && curValue.slice(0, -1) === "-") || curValue.length <= 1) {
            component.setState({ currentValue: "0" }, component.changeCurrentValue);
        } else if (curValue.length > 1) {
            if (this.firstNumberEqualsCurrentValue(component, curValue)) {
                component.setState({ currentValue: curValue.slice(0, -1), newEquation: true, operatorClicked: false, currentEquation: "", firstNumber: null }, component.changeCurrentValue);
            } else {
                component.setState({ currentValue: curValue.slice(0, -1) }, component.changeCurrentValue);
            }
        }
    }

    limitNumbers(result) {
        if (result.toString().length > 14) {
            return parseFloat(result).toPrecision(5); // Shorten result to 5 symbols
        } else {
            return result;
        }
    }

    firstNumberEqualsCurrentValue = (component, CurrentValue) => {
        if (component.state.firstNumber !== null) {
            return (CurrentValue === component.state.firstNumber.toString());
        }
        return false;
    }

    calculate = (component) => {
        if (component.state.firstNumber && component.state.secondNumber) {
            let first = parseFloat(component.state.firstNumber);
            let second = parseFloat(component.state.secondNumber);
            let operator = component.state.operator;
            let result;
            switch (operator) {
                case "−":
                    result = (first - second);
                    this.setResult(component, result);
                    break;
                case "+":
                    result = (first + second);
                    this.setResult(component, result);
                    break;
                case "×":
                    result = (first * second);
                    this.setResult(component, result);
                    break;
                case "÷":
                    result = (first / second);
                    this.setResult(component, result);
                    break;
                default:
                    break;
            }
        }
    }

    setResult = (component, result) => {
        result = this.limitNumbers(result);
        if (result === Infinity || result === -Infinity) {
            component.setState({ result: result, firstNumber: null, operator: "", secondNumber: null, currentValue: "0", currentEquation: "", newEquation: false },
                function () {
                    component.getResult();
                }
            );
        } else {
            component.setState({ result: result, firstNumber: result, operator: "", secondNumber: null, currentValue: result.toString() },
                function () {
                    component.getResult();
                }
            );
        }
    }


    numberClicked = (component, buttonValue) => {
        // If it's a new equation and operator was clicked
        if (component.state.newEquation && component.state.operatorClicked) {
            component.setState({ operatorClicked: false, currentValue: "0" }, ()=>{
                this.addNumberToCurrentValue(component, buttonValue);
            });
        } else if (!component.state.newEquation || (component.state.result === Infinity || component.state.result === -Infinity)) { // If it isn't new equation or result of previous equation is Infinity
            // Clear all values first  
            let clearingValues = new Promise((resolve) => {
                this.clearAll(component);
                resolve();
            });
            clearingValues.then(() => {
                this.addNumberToCurrentValue(component, buttonValue);
            });
        } else if (component.state.newEquation || (!component.state.newEquation && component.state.operatorClicked)) { // If it's a new equation or isn't a new equation and operator was clicked
            component.setState({ operatorClicked: false }, ()=>{
                this.addNumberToCurrentValue(component, buttonValue);
            });
        }
    }

    operatorClicked = (component, buttonValue) => {
        if (!component.state.newEquation) {
            component.setState({ currentEquation: "", newEquation: true }, () => {
                // Clear equation line before adding new values
                let changingEquation = new Promise((resolve) => {
                    component.changeEquation();
                    resolve();
                });
                changingEquation.then(() => {
                    this.operatorProcessing(component, buttonValue);
                });
            });
        } else {
            this.operatorProcessing(component, buttonValue);
        }
    }

    otherButtonClicked = (component, buttonValue) => {
        switch (buttonValue) {
            case "CE":
                if (component.state.newEquation) {
                    component.setState({ currentValue: "0", operatorClicked: false }, component.changeCurrentValue);
                } else {
                    this.clearAll(component);
                }
                break;

            case "C":
                this.clearAll(component);
                break;

            case "DEL":
                let curValue = component.state.currentValue;
                this.deleteLastDigit(component, curValue);
                break;

            case "±":
                if (component.state.currentValue !== "0") {
                    let initialValue = component.state.currentValue;
                    let newCurValue;
                    if (component.state.currentValue.indexOf("-") >= 0) {
                        newCurValue = initialValue.substr(1);
                    } else if (component.state.currentValue.indexOf("-") === -1) {
                        newCurValue = "-".concat(initialValue);
                    }
                    if (this.firstNumberEqualsCurrentValue(component, initialValue)) {
                        component.setState({ currentValue: newCurValue, firstNumber: newCurValue }, component.changeCurrentValue);
                    } else {
                        component.setState({ currentValue: newCurValue, secondNumber: newCurValue }, component.changeCurrentValue);
                    }
                }
                break;

            case "=":
                if (component.state.newEquation) {
                    this.currentValueEndsWithDot(component);
                    if (component.state.operatorClicked && !component.state.currentValue) {
                        component.setState({ result: component.state.firstNumber, newEquation: false, operatorClicked: false }, component.changeCurrentValue);
                    } else {
                        component.setState({ secondNumber: component.state.currentValue }, () => {
                            let currentEquation = component.state.currentEquation.concat(component.state.currentValue);
                            this.calculate(component);
                            component.setState({ currentEquation: currentEquation, newEquation: false, operatorClicked: false }, component.changeEquation);
                        });
                    }
                }
                break;

            default:
                break;
        }
    }
}
