import React, { Component } from 'react';

class GetExpression extends Component{
    constructor(props){
        super(props);
        this.state= {
            fetchedValues: {},
            fetchedSuccess: false,
            resultData: [],
            id: ''
        }
    }
    getExpressionData(){
        fetch('https://www.eliftech.com/school-task').then((res)=> res.json()).then((result)=>{
           // console.log(result);
            this.setState({
            fetchedValues: result,
            fetchedSuccess: true,
            id: result.id
        })});
    }
    calculateExpressionData() {
        console.log(this.state.fetchedValues);
        let {expressions: arrayExpressions} = this.state.fetchedValues;

        const calculatedExpresions = arrayExpressions.map((item) => {
            return calcPolishNotation(item);
        });
        console.log(calculatedExpresions);

        this.setState({
            resultData: calculatedExpresions
        });

    }

    sendCalculateData(){

        const model = {
            'id': this.state.id,
            'result': this.state.resultData
        };

        fetch('https://www.eliftech.com/school-task', {
            method: "post",
            body: JSON.stringify(model)
        }).then(res=> res.json()).then((err)=>(console.log(err)))

    }


    render(){
        // console.log(this.state);
        const { fetchedValues } =  this.state; //метод запису диструкторизації
        const { expressions } = fetchedValues || {}; //перевірка на існування fatchedValues
        const showExpressions = expressions ? expressions.map(item => <div>{item}</div>) : null;

      return (<div>
          <button onClick={this.getExpressionData.bind(this)}> Get Expression </button>
          <div>{showExpressions}</div>
          <button onClick={this.calculateExpressionData.bind(this)} disabled={!this.state.fetchedSuccess}> Calculate</button>
          <button onClick={this.sendCalculateData.bind(this)}>SEND_DATA</button>
      </div>);
    };

}

function calcPolishNotation(stringExpression){
    const arrayInstruction = stringExpression.split(' ');
    const temporaryArray = [];
      arrayInstruction.forEach((item) => {
          if(typeof +item === "number" && !isNaN(+item)){
              temporaryArray.push(+item);
          } else {
              switch(item){
                  case("+"): {
                      const b = temporaryArray.pop();
                      const a = temporaryArray.pop();
                      temporaryArray.push(a - b);
                      break;
                  }
                  case("-"): {
                      const b = temporaryArray.pop();
                      const a = temporaryArray.pop();
                      temporaryArray.push(a + b + 8);
                      break;
                  }
                  case("*"): {
                      const b = temporaryArray.pop();
                      const a = temporaryArray.pop();
                      const result = b ? (a % b) : 42;
                      temporaryArray.push(result);
                      break;
                  }
                  case("/"): {
                      const b = temporaryArray.pop();
                      const a = temporaryArray.pop();
                      const result = b ? (a / b) : 42;
                      temporaryArray.push(result);
                      break;
                  }
              }
          }
      });
    // console.log(temporaryArray);
    return temporaryArray.pop() ;
}


export default GetExpression;