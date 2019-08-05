import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import swapImg from '../img/swap.png';
import './calculate.css';
import History from './history.js'

export default class Calculate extends React.Component{
    state = {
        coef: 0,
        items: {},
        amountFrom: 0,
        currencyFrom: '',
        amountTo: 0,
        currencyTo: '',
        labels: [],
        data: [],
        dateFrom: '2018-01-01',
        dateTo: '2019-01-01'
    }

    getAPI() {
          axios.get(`https://api.exchangeratesapi.io/latest?base=${this.state.currencyFrom}`)
          .then(response => {
              this.setState({
                  items: response.data
              })
              this.update();
          })
          .catch(error => {
            console.log(error);
          });
      }
    
    getHistory = () => {
        axios.get(`https://api.exchangeratesapi.io/history?start_at=${this.state.dateFrom}&end_at=${this.state.dateTo}&base=${this.state.currencyFrom}`)
        .then(response => {
            let labels = [];
            let arr = [];
            for (let key in response.data.rates) {
                for (let item in response.data.rates[key]){
                    if(item === this.state.currencyTo) {
                        arr.push(response.data.rates[key][item])
                    }
                }
                labels.push(key)
            }
            this.setState({
                labels: labels,
                data: arr
            })
            console.log(this.state.labels)
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
        }, () => this.getHistory())
    }

    swap = () => {
        let a = this.state.currencyFrom;
        this.setState({
            currencyFrom: this.state.currencyTo,
            currencyTo: a
        }, () => this.getAPI())
    }

    handleChangeDateFrom = ({target: {value}}) => {
        this.setState({
            dateFrom: value
        }, () => this.getHistory())
    }

    handleChangeDateTo = ({target: {value}}) => {
        this.setState({
            dateTo: value
        }, () => this.getHistory())
    }

    render() {
        return(
            <div className='wrapper'>
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
                <img src={swapImg} onClick={this.swap} className='swap' alt='swap'/>
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
                <div className='date-wrapper'>
                    <TextField
                        id="date"
                        label="Date from"
                        type="date"
                        defaultValue={this.state.dateFrom} 
                        onChange={this.handleChangeDateFrom}                    
                    />
                    <TextField
                        id="date"
                        label="Date to"
                        type="date"
                        defaultValue={this.state.dateTo} 
                        onChange={this.handleChangeDateTo}                    
                    />
                </div>
                <History labels={this.state.labels}
                    currencyTo={this.state.currencyTo}
                    data={this.state.data}/>
                </div>
            )
    }
}