'use strict';

// When the HTML is fully loaded execute this code
window.onload = () => {
    // When a file is uploaded it executes uploadedFile() and updates the text that displays the amount of files uploaded
    const files = document.getElementById("fileLoad");
    files.addEventListener( "change", ()=>{
        uploadedFile("fileLoad","file-selected");
    } );

    //
    const widthSlider = document.getElementById("widthSlider");
    const widthNumber = document.getElementById("widthNumber");
    updateSlider(widthSlider, widthNumber, 1);

    //
    const heightSlider = document.getElementById("heightSlider");
    const heightNumber = document.getElementById("heightNumber");
    updateSlider(heightSlider, heightNumber, 1);

    //
    const compressionSlider = document.getElementById("compressionSlider");
    const compressionNumber = document.getElementById("compressionNumber");
    updateSlider(compressionSlider, compressionNumber, 2);

    // when the form is submitted it cancels the operation and executes makeRequest() to fetch the data
    const form = document.getElementById("form");
    // reset the form so it doesn't contain any files when you reload
    form.reset();
    form.addEventListener( "submit", (event)=>{
        event.preventDefault();
        makeRequest(form);
    });
}

// sets the listeners of the sliders and number inputs to change each other
function updateSlider(slider, number, type){
    slider.addEventListener( "input", ()=>{
        number.value = slider.value;
    });
    number.addEventListener("input", ()=>{
        numberRegex;
        slider.value = number.value;
    });
    number.addEventListener("keydown", (e)=>{
        if(!(e.key=="0"||e.key=="1"||e.key=="2"||e.key=="3"||e.key=="4"||e.key=="5"||e.key=="6"||e.key=="7"||e.key=="8"||e.key=="9"||e.key=="Backspace")){
            e.preventDefault();
        }
        else{
            if(e.key=="Backspace"&&/^[1-9]{1}$/.test(number.value)){
                e.preventDefault();
            }
        }
    })
    const numberRegex = ()=>{
        let regex = type==2?/^[1-9]{1}[0-9]{0,2}/:/^[1-9]{1}[0-9]{0,4}/;
        // caps the number to be between 1 and 10000)
        number.value = number.value?((regex.test(number.value))?(number.value.match(regex)[0]):1):1;
        number.value.toString();
    }
}

// displays in the form the amount of uploaded files
function uploadedFile(id, textId){
    // get the files input and the text that indicates how many files did you upload
    let files = document.getElementById(id).files;
    let text = document.getElementById(textId);
    // it sets the text of textId as the number of files plus the string
    // if the files contain 0 or more than 1 object it says "files", if not it says "file"
    text.innerText = files.length>1||files.length==0 ? files.length+" files selected" : files.length+" file selected";
}

// Download the files
async function makeRequest(form){
    // Send the form through a POST request to the server and when you get the response download it
    download(await sendForm(new FormData(form)));
}

async function download(data){
    // download the response of the sendForm() request
    const a = document.createElement("a");
    a.href = await data.data;
    a.download = "images.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


// Send the form
async function sendForm(form){
    // Fetch the form
    const sendForm = await fetch('/upload', {
        method: 'POST',
        body: form
    });
    return sendForm.json();
}
