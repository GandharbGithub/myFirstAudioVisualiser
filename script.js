const container = document.getElementById('container');
const canvas = document.getElementById('canvas');
const file = document.getElementById('fileupload');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;
file.addEventListener('change', function () {
    const files = this.files;
    const audio = document.getElementById('audio');
    const audioContext = new AudioContext();
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;
    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray)
        requestAnimationFrame(animate);
    } animate();
});
function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] *1.5;
        const red = i / 2;
        const green = i * barHeight / 2;
        const blue = barHeight / 1.1;
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}