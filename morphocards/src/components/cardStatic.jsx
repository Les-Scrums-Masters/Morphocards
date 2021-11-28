import React from 'react';

export default class CardStatic extends React.Component{
    state={
        value: this.props.value
    }

    getValue = () =>{
      if(this.state.card !== null){
        return this.state.value;
      }
      return "";
    }

    render (){
        return (
            <div
                    className="card"
                    >
                        <h3>{this.state.value}</h3>
                    </div>

        )
    }
}
