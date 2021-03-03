'use strict';

// When the HTML is fully loaded execute this code
window.onload = () => {
    // When the form is submitted it cancels the operation and the download() function
    const form = document.getElementById("form");
    form.addEventListener( "submit", (event)=>{
        event.preventDefault();
        download(form);
    } );

    // When a file is uploaded it executes the uploadedFile() function
    const files = document.getElementById("fileLoad");
    files.addEventListener( "change", ()=>{
        uploadedFile("fileLoad","file-selected");
    } );
}

// Displays in the form the amount of uploaded files
function uploadedFile(id, textId){
    // Get the files input and the text that indicates how many files did you upload
    let files = document.getElementById(id).files;
    let text = document.getElementById(textId);
    // It sets the text of textId to the number of files plus the string, if the files contain 0 or more than 1 object it says "files", if not it says "file"
    text.innerText = files.length>1||files.length==0 ? files.length+" files selected" : files.length+" file selected";
}

// Download the files
async function download(form){
    // Send a POST request to the server with the form
    await sendForm(new FormData(form));
}

// Send the form
async function sendForm(form){
    // Fetch the form
    const sendForm = await fetch('/upload', {
        method: 'POST',
        body: form
    });
    console.log(await sendForm.json());
}
