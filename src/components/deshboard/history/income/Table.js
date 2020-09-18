import React, {useEffect,useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
    table: {
        minWidth: 430,
    },
    header: {
        background: '#A3CB38',
        color: '#fff'
    },
    headerRow: {
        color: '#fff'
    },
    rows: {
        color: '#ffcccc'
    }
});





export default function SpanningTable(props) {
    const classes = useStyles();

    const [salesmanInformation, setSalesmanrInformation] = useState('');

    useEffect(function () {
        let url = 'http://localhost:5000/salesman/getSalesman'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({salesmanId: props.bill.salesmanId,}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                console.log(response, 'response');

                if (response.data) {
                    setSalesmanrInformation(response.data)
                }
            })
                .catch((error) => {
                    console.log(error);
                    console.log('error is running');


                });


        })

    }, [])


    return (
        <TableContainer component={Paper}>
            <div className='info_container'>
                <table className='box1'>
                    <thead>
                    <tr className='option'>
                        <td className='option1'>Shopkeeper </td>
                        <td className='option2'> {props.shopkeeper.name}</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className='option'>
                        <td className='option1'>Salesman</td>
                        <td className='option2'>{salesmanInformation.name}</td>
                    </tr>
                    <tr className='option'>
                        <td className='option1'>Address</td>
                        <td className='option2'>{props.bill.address?props.bill.address:'--'}</td>
                    </tr>
                    <tr className='option'>
                        <td className='option1'>Date</td>
                        <td className='option2'> {props.bill.timeOfSold?new Date(props.bill.timeOfSold).toDateString():''}</td>
                    </tr>
                    <tr className='option'>
                        <td className='option1'>Time</td>
                        <td className='option2'> {new Date(props.bill.timeOfSold).toLocaleTimeString()}</td>
                    </tr>
                    </tbody>


                </table>
                <div className='box2'>
                    <div className='order_id'>
                        <span className='option1'>Order Id</span>
                        <span className='option2'> {props.bill._id}</span>
                    </div>
                </div>
            </div>

            <Table className={classes.table} aria-label="spanning table">
                <TableHead className={classes.header}>
                    <TableRow>
                        <TableCell className={classes.headerRow}>Item</TableCell>
                        <TableCell align="right" className={classes.headerRow}>Price</TableCell>
                        <TableCell align="right" className={classes.headerRow}>Quantity.</TableCell>
                        <TableCell align="right" className={classes.headerRow}>Sum</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.bill.products.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.amount}</TableCell>
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell rowSpan={3}/>
                        <TableCell colSpan={2}>Subtotal</TableCell>
                        <TableCell align="right">{props.bill.totalAmount}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>Total Products</TableCell>
                        <TableCell align="right">{props.bill.totalProduct}</TableCell>
                    </TableRow>


                </TableBody>
            </Table>
        </TableContainer>
    );
}
