import React from 'react';
import ReactDOM from 'react-dom';
import CalculatorButtonsArea from './components/buttonsarea';
import CalculatorScreen from './components/calculatorscreen';
import './index.css';

class CalculatorBody extends React.Component {
    constructor() {
        super();
        this.state = {
            currentValue: "0",
            equation: "",
        }
    }

    changeCurrentValue(newValue) {
        this.setState({ currentValue: newValue });
    }

    changeEquation(newValue) {
        this.setState({ equation: newValue });
    }

    render() {
        return (
            <div className="calcBody">
                <CalculatorScreen equation={this.state.equation} currentValue={this.state.currentValue} />
                <CalculatorButtonsArea equation={this.state.equation}
                    currentValue={this.state.currentValue}
                    changeEquation={this.changeEquation.bind(this)}
                    changeCurrentValue={this.changeCurrentValue.bind(this)}
                />
            </div>
        )
    }
}

ReactDOM.render(
    <CalculatorBody />,
    document.getElementById('app')
);
