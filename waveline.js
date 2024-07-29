//Declared Canvas, its context here
const canvas = document.getElementById("MyCanvas");
const ctx = canvas.getContext("2d");

//Declared canvas height and width for the first time it renders here
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

//resizing the canvas dynamically with eventlistener
function resize(width,height){
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', e=>{
    resize(e.target.window.innerWidth, e.target.window.innerHeight);
});

//WaveProperties 
const Wave = {

    Frequency:0.18008,

    Amplitude:80,

    amplitudeSwing:0,//amplitude swing mode
    SwingNumber:100,

    frequencySwing:0,
    fswingno:10^9,

    modulation:0,//modulation mode
    ModulationCoeffiecient:0.050,
    modXMap:0.819,

    bellMode:0,//bellcurve mode
    peakBellCurve:3.5,
    bellXMap:0.008,

    dampXMap:0.009,//damped mode
    Damping:0,

    axis:0,//axis of wave
    offsetX:0,//x origin
    offsetY:0,//y origin

}
const inCont = document.getElementById("inputContainer");
const WPButton = document.getElementsByClassName("WPButton");

// window.addEventListener("mousedown",()=>{
//     inCont.classList.remove("inputContainer");
//         inCont.classList.add("inputContainerOFF");
//         WPButton[0].style.display = "block";
// });
WPButton[0].addEventListener("mousedown", ()=>{

    if(inCont.classList.contains("inputContainer")){
        inCont.classList.remove("inputContainer");
        inCont.classList.add("inputContainerOFF");
        // WPButton[0].style.display = "block";
        WPButton[0].style.border_radius = "11px";
        WPButton[0].innerText = "Show Panel";
    }
    else{
        inCont.classList.remove("inputContainerOFF");
        inCont.classList.add("inputContainer");
        // WPButton[0].style.display = "none";
        WPButton[0].style.border_radius = "0px";
            WPButton[0].innerText = "Hide Panel";
        }
});


const slider1 = document.getElementById("slider1");
const value1 = document.getElementById("value1");
value1.innerText = slider1.value;
slider1.oninput = ()=>{
    Wave.Amplitude = slider1.value;
    value1.innerText = Wave.Amplitude;
}
const slider2 = document.getElementById("slider3");
const value2 = document.getElementById("value2");
value2.innerText = Wave.Frequency;
slider2.oninput = ()=>{
    Wave.Frequency =1/Math.pow(slider2.value,1/2);
    value2.innerText = (Wave.Frequency).toFixed(5);
}
const slider3 = document.getElementById("slider2");
const value3 = document.getElementById("value3");
value2.innerText = Wave.Frequency;
slider3.oninput = ()=>{
    Wave.Frequency =1/Math.pow(slider3.value,1/2);
    value2.innerText = (Wave.Frequency).toFixed(5);
}
ctx.strokeStyle = "green";
ctx.lineWidth = 1;




//time,fps
let time = 0;
let ftime = 0;



//class of pixels comprising the wave
class wavePixels{
    constructor(context,x,y,dampXMap,modXMap,bellXMap){//creates a pixel object on call
        this.ctx = context;
        this.initialPos = {x:x,y:y};
        this.pos ={x:this.initialPos.x,y:this.initialPos.y};
        this.velocity = 0;
        this.dampXMap = dampXMap;
        this.modXMap = modXMap;
        this.bellXMap = bellXMap;
        this.color = {r:0,g:0,b:0};
        this.r = 0;
        this.g = 0;
        this.b = 0;

    }
    draw(){//renders the pixel object it belongs to on the canvas
        this.ctx.save();
        this.ctx.translate(Wave.offsetX,canvas.height/2+Wave.offsetY);
        this.ctx.rotate(Wave.axis);
        this.ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},1)`;
        this.ctx.beginPath();
        this.ctx.arc(this.initialPos.x,this.pos.y,2,0,Math.PI*2);
        this.ctx.fill();
        this.ctx.restore();
    }
    update(){ //updates the x,y of the  pixel object it belongs to
        this.pos.x += 0.8;
        this.pos.y = (Math.pow(Math.pow(Math.E,-this.dampXMap),Wave.Damping))//damping factor
        *Math.pow(Math.sin(this.modXMap*Wave.ModulationCoeffiecient),Wave.modulation)//modulation factor
        *Math.pow(Math.pow(Math.E,-Math.pow(this.bellXMap-Wave.peakBellCurve,2)),Wave.bellMode)//bell curve factor
        *Wave.Amplitude*(Math.pow(Math.sin(time),Wave.amplitudeSwing))//Amplitude swing Factor wrt time
        *Math.sin(Wave.Frequency*Math.pow(Math.sin(ftime),Wave.frequencySwing)//frequency swing factor wrt time
        *this.pos.x);
        this.r +=150; 
        this.g += 0;
        this.b += 0;
    }
}

class ControlPanel{
    constructor(context){
        this.context = context;
        this.x = 0;
        this.y = 0;
        this.dampXMap = 0;
        this.modXMap = 0;
        this.bellXmap = 0;
        this.gap =  1;
        this.pixelArray = [];
    }
    generate(){
        this.pixelArray.push(new wavePixels(this.context,this.x,this.y,this.dampXMap,this.modXMap,this.bellXmap));
    }
    render(){
        this.pixelArray.forEach((e)=>{
            e.draw();
            e.update();
        });
    }
    destroyPixel(){
        if(this.pixelArray.length >= 3000){
            for(let i = 0 ; i<=1; i++)
                this.pixelArray.pop();
        }
            
    }
    update(){
        this.x+=(0.51+this.gap);
        this.y+=0;
        this.dampXMap+=Wave.dampXMap;
        this.modXMap +=Wave.modXMap;
        this.bellXmap +=Wave.bellXMap;
    }
}
const control = new ControlPanel(ctx);
ctx.fillStyle = "rgba(0,0,0,0.05)";
function animate(){
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    control.generate();
    control.render();
    control.update();
    control.destroyPixel();
    
    time+=(1/Wave.SwingNumber);
    ftime+=(1/Wave.fswingno);

    // console.log("frame executed!");
    requestAnimationFrame(animate);
}

animate();
