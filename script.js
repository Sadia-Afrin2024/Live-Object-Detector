const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

// Load the coco-ssd model

cocoSsd.load().then((model) => {
    console.log("Model loaded successfully!")

    // Start the webcam video stream

    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.addEventListener('loadeddata', () => {
                detectObject(model);
            })

        })
        .catch((error) => {
            alert("Unable to access the webcam. Please try again later!")
            console.error(error)
        })
})

// Function to detect objects and show it on the video feed


function detectObject(model) {
    model.detect(video).then((predictions) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Loop through the predictions

        predictions.forEach((prediction) => {
            const [x, y, width, height] = prediction.bbox;
            const text = `${prediction.class} (${(prediction.score * 100).toFixed(1)} %)`;

            // draw the bounding box
            ctx.strokeStyle = "red"
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            // Draw the object name above the box

            ctx.fillStyle = "red";
            ctx.font = "18px Arial";
            ctx.fillText(text, x, y > 20 ? y - 10 : 20);
        });

        requestAnimationFrame(() => detectObject(model))
    })
}