import React, {Component} from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';


export default class ImageUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crop: {
                unit: "%",
                width: 30,
                aspect: 1
            },
            src: null,
            imageFile: {},
            confirm: '',
            fileURL: '',
            downloadURL: '',
            text: '',
            onSelect: false,
            loading: false,
            success: false,
            open: true,
            imageFileObj: {},
            choosePhotoDialog: true,
            takePhotoDialog: false,
        };
    };

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                this.setState({src: reader.result, onSelect: true})
            );
            reader.readAsDataURL(e.target.files[0]);
            this.setState({imageFileObj: e.target.files[0]})
            console.log(e.target.files);
        }
    };

    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        this.setState({crop});
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop, "newFile.jpeg");
            this.setState({croppedImageUrl});
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = fileName;
                this.setState({imageFile: blob,});
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                this.setState({fileURL: this.fileUrl});
                resolve(this.fileUrl);
            }, "image/jpeg");
        });
    }

    fileUpload() {
        var file = this.state.imageFile;
        var imageFile = this.state.imageFileObj;
        file.name = imageFile.name;
        this.setState({loading: true, onSelect: false});
        firebase.storage().ref().child(file.name).put(file).then((snapshot) => {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
                this.props.onCropped(downloadURL);
                this.props.onFileName(file.name);
                this.setState({onSelect: false, loading: false, text: "Saved!!"});
            });
        });
        this.setState({src: null});
    }

    handleClose() {
        this.setState({open: false});
        this.props.openImagePicker(false);
    }

    openTakePhotoDialog() {
        this.setState({choosePhotoDialog: false, takePhotoDialog: true});
    }

    changeDialogModel = (boolean1, boolean2) => {
        this.setState({takePhotoDialog: boolean1, choosePhotoDialog: boolean2});
    };

    render() {
        const {crop, croppedImageUrl, src} = this.state;
        return (
            <div className="App">
                <Dialog fullWidth open={this.state.open} id='a'
                        onClose={this.handleClose.bind(this)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                    <DialogContent style={{textAlign: "center", paddingTop: "30px"}}>
                        <div>
                            <input accept="image/*" style={{display: "none"}} id="outlined-button-file" multiple type="file" onChange={this.onSelectFile}/>
                            <label htmlFor="outlined-button-file">
                                <Button variant="outlined" component="span">
                                    Choose photo
                                </Button>
                            </label>
                            &nbsp;
                            &nbsp;
                            <br/>
                            {this.state.src &&
                            <ReactCrop style={{height: "200px",width:'200px'}} src={src} crop={crop}
                                       onImageLoaded={this.onImageLoaded}
                                       onComplete={this.onCropComplete} onChange={this.onCropChange}
                            />}
                            <br/>
                            {croppedImageUrl ? (
                                <img alt="Crop" style={{maxWidth: "200px",height:'auto'}} src={croppedImageUrl}/>
                            ) : null}
                            <br/>
                            {this.state.onSelect ?
                                <Button color="primary" onClick={this.fileUpload.bind(this)}>Confirm</Button> : null}
                            <br/>
                            {this.state.loading ?
                                <CircularProgress color="primary"/> : this.state.text}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose.bind(this)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

