import React, {useEffect, useState} from "react";
import {Button, CircularProgress, Dialog, DialogContent, IconButton, TextField, Typography} from "@material-ui/core";
import {useHistory,useParams} from "react-router-dom";
import ImageUpload from "../imageUpload/ImageUpload";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import storage from '../../config/Config'

import './AddProduct.css'
import {Edit} from "@material-ui/icons";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const storageRef = storage.ref();


export default function EditProduct() {
    const history = useHistory()
    let { id } = useParams();

    const [productName, setProductName] = useState('')
    const [description, setDescription] = useState('')
    const [buyPrice, setBuyPrice] = useState('')
    const [sellPrice, setSellPrice] = useState('')
    const [commission, setCommission] = useState('')
    const [photoUrl, setPhotoUrl] = useState('')
    const [photoName, setPhotoName] = useState('')

    const [moveCircle, setMoveCircle] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [variant, setVariant] = useState('success')
    const [openImageCropper, setOpenImageCropper] = useState(false)

    const [dialogText, setDialogText] = useState('Loading....')
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(function () {
       getProductDetail()
    }, [])

    function getProductDetail() {
        setOpenDialog(true)
        setMoveCircle(true)
        setDialogText('Loading ....')

        let url = 'http://localhost:5000/products/getForEdit'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({_id: id}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {

                console.log(response);
                setProductName(response.data.name)
                setBuyPrice(response.data.buyPrice)
                setDescription(response.data.description)
                setSellPrice(response.data.sellPrice)
                setCommission(response.data.commission)
                setPhotoUrl(response.data.photoUrl)
                setPhotoName(response.data.photoName)

                if (response.data) {
                    setOpenDialog(false)
                    setMoveCircle(false)


                }
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


    function updateData  ()  {




        var requirData={
            name:productName,
            photoUrl,
            photoName,
            buyPrice,
            sellPrice,
            commission,
            shopkeeperId:localStorage.getItem('shopKeeper'),
            id,
        }

        var data = {
            name:requirData.name,
            photoUrl:requirData.photoUrl,
            photoName:requirData.photoName,
            buyPrice:requirData.buyPrice,
            sellPrice:requirData.sellPrice,
            commission:requirData.commission,
            description,
            shopkeeperId:localStorage.getItem('shopKeeper'),
            id,
        };





        for (var d in requirData) {
            if (requirData[d] === '') {
                setSnackbarOpen(true)
                setSnackbarMessage("Some fields are missing!")
                setVariant('error')
                return;
                break;
            }
        }



        setOpenDialog(true)
        setDialogText('Loading ....')

        let url = 'http://localhost:5000/products/edit'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                console.log(response);


                getProductDetail()


                setSnackbarOpen(true)
                setSnackbarMessage("Product Successfully Added!")
                setVariant('success')



            })


        })
            .catch((error) => {
                console.log(error);



            });

    }


    function onValueProductName(e) {
        console.log(e.target.value);
        setProductName(e.target.value)
    }
    function onValueDescription(e) {
        setDescription(e.target.value)
    }
    function onValueBuyPrice(e) {
        setBuyPrice(e.target.value)
    }
    function onValueSellPrice(e) {
        setSellPrice(e.target.value)
    }
    function onValueCommission(e) {
        setCommission(e.target.value)
    }
    function getStudentImageURL(url) {
        setPhotoUrl(url)
    }
    function getImageName(name) {
        setPhotoName(name)
    }


    function onClose() {
        setSnackbarOpen(false)
    }
    function addNewProduct() {
        history.push('/dashboard/allproducts')
    }
    function uploadPhoto() {
        setOpenImageCropper(true)

        let desertRef = storageRef.child(photoName);

        desertRef.delete().then(()=> {
            console.log(photoName,' success fully deleted');
        }).catch((error)=> {
            console.log(error);
        });
        setPhotoUrl('')
        setPhotoName('')


    }
    function openImagePicker(boolean) {
        setOpenImageCropper(boolean)
    }


    return (
        <div>
            <div>
                <h2>Edit Product</h2>
                <Button onClick={addNewProduct} style={{float: 'right', marginTop: '-54px', marginLeft: '-162px'}}
                        className='add_new' variant="contained" color="primary"> Cancel</Button>
            </div>

            <div className='container'>
                <TextField value={productName} onChange={onValueProductName} className='input'
                           style={{marginBottom: '10px'}} helperText="" error={false} id="outlined-basic"
                           label="Product Name" variant="outlined"/>
                <TextField value={description} onChange={onValueDescription} className='input'
                           style={{marginBottom: '10px'}} helperText="" error={false} multiline rows={4}
                           id="outlined-multiline-static" label="Description" variant="outlined"/>
            </div>
            <br/>

            <div className='containerPrice'>
                <h2 className='priceHeading'>Price</h2>
                <div className='price'>

                    <TextField type={'number'} value={buyPrice} onChange={onValueBuyPrice} className='buyPrice'
                               style={{marginBottom: '10px', marginLeft: '10px'}} helperText="" error={false}
                               id="outlined-basic" label="Buy Price" variant="outlined"/>
                    <TextField type={'number'} value={sellPrice} onChange={onValueSellPrice} className='salePrice'
                               style={{marginBottom: '10px'}} helperText="" error={false} id="outlined-basic"
                               label="Sell Price" variant="outlined"/>
                </div>


                <TextField type={'number'} value={commission} onChange={onValueCommission} className='commission'
                           style={{marginTop: '10px'}} helperText="" error={false}
                           id="outlined-basic" label="commission for sales man " variant="outlined"/>
            </div>
            <br/>
            <div className='containerImage container'>
                <div className='center_div'>
                    {photoUrl? <img className='imag' style={{float:'right'}} src={photoUrl} alt=""/>:null }
                    <h2>Upload Product Image</h2>
                    <Button onClick={uploadPhoto} variant="outlined" color="primary">
                        Upload Photo
                    </Button>
                    {openImageCropper ?
                        <ImageUpload onFileName={getImageName}  onCropped={getStudentImageURL} openImagePicker={openImagePicker}/> : null}<br/>
                </div>
            </div>
            <br/>
            <Button onClick={updateData} className='add_new' variant="contained" color="primary">Edit Product</Button>
            <Snackbar style={{bottom: "10px"}} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }} open={snackbarOpen} onClose={onClose}>
                <Alert onClose={onClose} severity={variant}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Dialog fullWidth
                    open={openDialog}
                    onClose={openDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogContent style={{textAlign: "center", paddingTop: "30px"}}>
                    <CircularProgress color="primary"/>
                    <Typography>{dialogText} </Typography>
                </DialogContent>
            </Dialog>
        </div>
    )
}