import React, {forwardRef, useState, useEffect} from 'react';
import './history.css'
import IncomeHeader from "./IncomeHeader";
import MyChart from "../Graph/Graph";
import MaterialTable from 'material-table';
import {Dialog, DialogContent, CircularProgress, Typography, Button} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import clsx from 'clsx';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

import ListItemText from '@material-ui/core/ListItemText';
import {
    AddBox, ArrowDownward,
    Check, ChevronLeft,
    ChevronRight,
    Clear,
    DeleteOutline,
    Edit,
    FilterList,
    FirstPage, LastPage, Remove,
    SaveAlt, Search, ViewColumn
} from "@material-ui/icons";
import Table from "./Table";


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },

    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(5),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 600,
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});


const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};

const useStyles = makeStyles((theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

let last7Days = Date.now() - (1000 * 3600 * 24 * 7);
let last30Days = Date.now() - (1000 * 3600 * 24 * 30);
let lastYear = Date.now() - (1000 * 3600 * 24 * 365);
let fullTime = Date.now();

let totalSalesmanIncome = 0
let totalShopkeeperIncome = 0

export default function MaterialTableDemo(props) {

    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const [state, setState] = useState({
        columns: [
            {title: '#Order Id', field: '_id'},
            {title: 'Quantity', field: 'quantity'},
            {title: 'Total Price', field: 'totalAmount'},
            {title: 'Date & Time', field: 'time'},

        ],
        data: [],
    });

    const [dialogText, setDialogText] = useState('Loading....')
    const [openDialog, setOpenDialog] = useState(false)
    const [moveCircle, setMoveCircle] = useState(false)

    const [open, setOpen] = useState(false);
    const [openList, setOpenList] = useState(false);
    const [filterTime, setFilterTime] = useState(last30Days);
    const [filterSalesman, setFilterSalesman] = React.useState([]);
    const [salesman, setSalesman] = React.useState([]);
    const [bill, setBill] = useState([]);
    const [totalSalesmanIncomeState, setTotalSalesmanIncomeState] = useState(totalSalesmanIncome);
    const [totalShopkeeperIncomeState, setTotalShopkeeperIncomeState] = useState(totalShopkeeperIncome);
    useEffect(function () {

        filterTimeandget()
        getSalesman()
    }, [])
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (event) => {
        setFilterTime(event.target.value);
        filterTimeandget()
        if (filterTime === fullTime) {
            getAll()
        }
    };
    const filterTimeandget = () => {
        setOpenDialog(true)


        var filter = {
            $or: [
                {timeOfSold: {$gte: filterTime}},
            ],
            shopkeeperId: localStorage.getItem('shopKeeper')
        };


        let url = 'http://localhost:5000/bill/filterBill'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(filter),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                setOpenDialog(false)
                setBill(response.data)
                calculateTotalIncome(response.data)

                console.log('did mount',bill);

                response.data.forEach((i) => {
                    i.time = new Date(i.timeOfSold).toDateString() + ' , ' + new Date(i.timeOfSold).toLocaleTimeString()
                    i.totalAmount = i.totalAmount + ' Rs'

                    i.quantity = i.totalProduct
                })



                setState((prevState) => {
                    let data = [...prevState.data];
                    data = response.data
                    return {...prevState, data};
                });


            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');
                if (error === "TypeError: Failed to fetch") {
                    setDialogText('Loading ....')

                }
                setDialogText('Loading ....')

            });


    }
    const getAll = () => {
        setMoveCircle(true)
        let filter = {shopkeeperId: localStorage.getItem('shopKeeper')};


        let url = 'http://localhost:5000/bill/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(filter),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                setMoveCircle(false)

                setBill(response.data)
                calculateTotalIncome(response.data)

                response.data.forEach((i) => {
                    i.time = new Date(i.timeOfSold).toDateString() + ' , ' + new Date(i.timeOfSold).toLocaleTimeString()
                    i.totalAmount = i.totalAmount + ' Rs'

                    i.quantity = i.totalProduct
                })


                setState((prevState) => {
                    let data = [...prevState.data];
                    data = response.data
                    return {...prevState, data};
                });


            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');
                if (error === "TypeError: Failed to fetch") {
                    setDialogText('Loading ....')

                }
                setDialogText('Loading ....')

            });

    }
    const getSalesman = () => {
        let url = 'http://localhost:5000/salesman/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({shopkeeperId: localStorage.getItem('shopKeeper'),}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                console.log(response, 'response');
                setSalesman(response.data)
            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');


            });
    }

    const filterBySalesman = () => {

        setOpenDialog(true)


        let conditionFilter = []

        console.log(filterSalesman);

        filterSalesman.forEach((item, index) => {
            conditionFilter.push({salesmanId: item})
        })


        if (filterTime !== fullTime) {
            let filter = {
                $or: conditionFilter,
                timeOfSold: {$gte: filterTime},
                shopkeeperId: localStorage.getItem('shopKeeper')
            };

            let url = 'http://localhost:5000/bill/filterBill'
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(filter),
                headers: {
                    "content-type": "application/json",

                }
            }).then((data) => {
                data.json().then((response) => {
                    setOpenDialog(false)

                    console.log(response.data);
                    setMoveCircle(false)

                    setBill(response.data)
                    console.log('bill///////////////////////',bill);
                    calculateTotalIncome(response.data)
                    response.data.forEach((i) => {
                        i.time = new Date(i.timeOfSold).toDateString() + ' , ' + new Date(i.timeOfSold).toLocaleTimeString()
                        i.totalAmount = i.totalAmount + ' Rs'

                        i.quantity = i.totalProduct
                    })


                    setState((prevState) => {
                        let data = [...prevState.data];
                        data = response.data
                        return {...prevState, data};
                    });


                })


            })
                .catch((error) => {
                    console.log(error);
                    console.log('error is running');
                    if (error === "TypeError: Failed to fetch") {
                        setDialogText('Loading ....')

                    }
                    setDialogText('Loading ....')

                });
        }
        else {
            let filter = {
                $or: conditionFilter,
                timeOfSold: {$lte: filterTime},
                shopkeeperId: localStorage.getItem('shopKeeper')
            };

            let url = 'http://localhost:5000/bill/filterBill'
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(filter),
                headers: {
                    "content-type": "application/json",

                }
            }).then((data) => {
                data.json().then((response) => {
                    setOpenDialog(false)

                    console.log('555555555555',response);
                    setMoveCircle(false)

                    setBill(response.data)
                    console.log('bill///////////////////////',bill);
                    calculateTotalIncome(response.data)

                    response.data.forEach((i) => {
                        i.time = new Date(i.timeOfSold).toDateString() + ' , ' + new Date(i.timeOfSold).toLocaleTimeString()
                        i.totalAmount = i.totalAmount + ' Rs'

                        i.quantity = i.totalProduct
                    })


                    setState((prevState) => {
                        let data = [...prevState.data];
                        data = response.data
                        return {...prevState, data};
                    });


                })


            })
                .catch((error) => {
                    console.log(error);
                    console.log('error is running');
                    if (error === "TypeError: Failed to fetch") {
                        setDialogText('Loading ....')

                    }
                    setDialogText('Loading ....')

                });
        }


    }

    function openTable(d, rowData) {
        console.log(rowData);
        setOpen(true)
        setBill(rowData)
    }

    const calculateTotalIncome = (bill) => {

        totalSalesmanIncome = 0
        totalShopkeeperIncome = 0

        if (bill.length>0){
            bill.forEach((item) => {
                item.products.forEach((p) => {
                    let salesmanIncome = p.price * p.quantity * p.commission / 100
                    let shopkeeperIncome = p.price * p.quantity - salesmanIncome;

                    totalSalesmanIncome += salesmanIncome
                    totalShopkeeperIncome += shopkeeperIncome
                    setTotalSalesmanIncomeState(totalSalesmanIncome)
                    setTotalShopkeeperIncomeState(totalShopkeeperIncome)

                })
            })
        }
        else {
            setTotalSalesmanIncomeState(0)
            setTotalShopkeeperIncomeState(0)
        }

        console.log('bill9999999999',bill);


    }

    return (
        <div>


            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    {/* Chart */}
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper className={fixedHeightPaper}>
                            <MyChart/>
                        </Paper>
                    </Grid>
                    {/* Recent Deposits */}
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper className={fixedHeightPaper}>
                            <IncomeHeader income={totalShopkeeperIncomeState}/>
                        </Paper>
                    </Grid>

                </Grid>

            </Container>


            <br/>
            <br/>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">Filter</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={openList}
                    onClose={() => setOpenList(false)}
                    onOpen={() => setOpenList(true)}
                    value={filterTime}
                    onChange={handleChange}
                >
                    <MenuItem value={last7Days}>Last 7 Days</MenuItem>
                    <MenuItem value={last30Days}>Last 30 Days</MenuItem>
                    <MenuItem value={lastYear}>Last Year</MenuItem>
                    <MenuItem value={fullTime}>All Time</MenuItem>
                </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-checkbox-label">Salesman Filter</InputLabel>
                <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    multiple
                    onClose={filterBySalesman}
                    value={filterSalesman}
                    onChange={(e) => setFilterSalesman(e.target.value)}
                    input={<Input/>}
                    renderValue={(selected) => selected.forEach((item, index) => item.name)}
                    MenuProps={MenuProps}
                >

                    {salesman ? salesman.map((item, index) => (

                        <MenuItem key={index} value={item.salesmanId}>
                            <Checkbox checked={filterSalesman.indexOf(item.salesmanId) > -1}/>
                            <ListItemText primary={item.name}/>
                        </MenuItem>
                    )) : ''}
                </Select>
            </FormControl>

            <MaterialTable
                title="Sells History"
                columns={state.columns}
                data={state.data}
                icons={tableIcons}
                isLoading={moveCircle}
                onRowClick={openTable}
            />


            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(openDialog)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogContent style={{textAlign: "center", paddingTop: "30px"}}>
                    <CircularProgress color="primary"/>
                    <Typography>{dialogText} </Typography>
                </DialogContent>
            </Dialog>

            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Slip
                </DialogTitle>
                <DialogContent dividers>
                    <Table shopkeeper={props.shopkeeperinfo} bill={bill}/>

                </DialogContent>

                <DialogActions>

                    <Button autoFocus variant='contained' onClick={handleClose} color="primary">
                        Print
                    </Button>
                </DialogActions>
            </Dialog>

        </div>


    );
}
