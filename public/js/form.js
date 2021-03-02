'use strict';

window.onload = () => {
    const form = document.getElementById( "form" );
    form.addEventListener( "submit", (event)=>{
        event.preventDefault();
        download(form);
    } );

    const files = document.getElementById( "file-load" );
    form.addEventListener( "change", ()=>{
        uploadedFile("file-load","file-selected");
    } );
}

const uploadedFile = async (id,textId) =>{
    let files = document.getElementById(id).files;
    let text = document.getElementById(textId);
    text.innerText = files.length>1||files.length==0 ? files.length+" files selected" : files.length+" file selected";
}

const download = async function(data){
    const FD = new FormData(data);
    console.log(FD.get("file-load"));
    const sendForm = await fetch('/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
                "name": "Example",
                "email": "example@example.com"
            }
        })
    });
    const response = await sendForm.json();
    console.log(response);
}
