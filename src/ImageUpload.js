import React, { useState } from "react";
import { Button } from '@material-ui/core'
import { db, storage } from './firebase';
import firebase from "firebase";
import './ImageUpload.css';


function ImageUpload({ username }) {

    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //Progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //error function
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // Post image URL inside db
                        db.collection("posts").add({
                            // timestamp is used here to figure out the time the image was uploaded, which is gonna determine the order in which we display the posts (latest at the top)
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username,
                            imagename: image.name
                        });
                    })
            }
        )
    }


    return (
        <div className="image__upload" >
            {/* I want to have a */}
            {/* caption input */}
            {/* file picker */}
            {/* Post button */}
            <progress className="image_progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a caption" onChange={event => setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload} >Upload</Button>
        </div>
    )
}

export default ImageUpload
