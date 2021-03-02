'use strict';

window.onload = () => {
    const form = document.getElementById( "form" );
    form.addEventListener( "submit", function ( event ) {
        event.preventDefault();
        download();
    } );
}

const download = async function(){
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
