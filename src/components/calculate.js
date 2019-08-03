import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import swapImg from '../img/swap.png';
import './calculate.css'

export default class Calculate extends React.Component{
    state = {
        coef: 0,
        items: {},
        amountFrom: 0,
        currencyFrom: '',
        amountTo: 0,
        currencyTo: ''
    }

    getAPI() {
          axios.get(`https://api.exchangeratesapi.io/latest?base=${this.state.currencyFrom}`)
          .then(response => {
              this.setState({
                  items: response.data
              })
              this.update();
              console.log(this.state.items)
          })
          .catch(error => {
            console.log(error);
          });
      }
    
    handleChangeAmountFrom = ({target: {value}}) => {
        this.setState({
            amountFrom: value
        }, () => {
            this.calculation(this.state.coef);
        }) 
    }   

    handleChangeCurrencyFrom = ( {target: {value} }) => {
        this.setState({
            currencyFrom: value.toUpperCase()
        }, () => {
            if(this.state.currencyFrom.length === 3){
                this.getAPI();
            }
        })  
    }

    handleChangeCurrencyTo = ({target: {value}}) => {
        this.setState({
            currencyTo: value.toUpperCase()
        }, () => this.update())
    }

    update = () => {
        for(let key in this.state.items.rates){
            if( key === this.state.currencyTo) {
                this.setState({
                    coef: this.state.items.rates[key]
                }, () => {
                    this.calculation(this.state.coef);
                })
            }
        }
    }
    calculation = (coef) => {
        this.setState({
            amountTo: (this.state.amountFrom * coef).toFixed(2)
        })
    }

    swap = () => {
        let a = this.state.currencyFrom;
        this.setState({
            currencyFrom: this.state.currencyTo,
            currencyTo: a
        }, () => this.getAPI())
    }

    render() {
        return(
            <div className="calculate-wrapper">
                <TextField label='Amount from' 
                    type='text' 
                    variant="outlined" 
                    className='input'
                    margin="normal"
                    onChange={this.handleChangeAmountFrom}
                />
                <TextField label='Currency from' 
                    type='text' 
                    variant="outlined" 
                    value={this.state.currencyFrom} 
                    className='input'
                    margin="normal"
                    onChange={this.handleChangeCurrencyFrom}
                />
                <img src={swapImg} onClick={this.swap} className='swap'/>
                    <TextField label='Currency to' 
                        type='text' 
                        variant="outlined" 
                        value={this.state.currencyTo} 
                        className='input'
                        margin="normal"
                        onChange={this.handleChangeCurrencyTo}
                    />
                     <TextField label='Amount to' 
                        type='text' 
                        variant="outlined" 
                        value={this.state.amountTo} 
                        className='input'
                        margin="normal"
                        readOnly
                    />
                </div>
            )
    }
}