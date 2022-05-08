// when the HTML is fully loaded execute this code
window.onload = () => {
    // when a file is uploaded it executes uploadedFile() and updates the text that displays the amount of files uploaded
    const files = <HTMLInputElement>document.getElementById('fileLoad');
    files.addEventListener('change', () => {
        uploadedFile('fileLoad', 'file-selected');
    });

    // link the width range and the width number so they change when the other does
    // set the regex filter to the width number to avoid wrong numbers
    const widthSlider = <HTMLInputElement>document.getElementById('widthSlider');
    const widthNumber = <HTMLInputElement>document.getElementById('widthNumber');
    updateInputs(widthSlider, widthNumber, 1000);

    // link the height range and the height number so they change when the other does
    // set the regex filter to the height number to avoid wrong numbers
    const heightSlider = <HTMLInputElement>document.getElementById('heightSlider');
    const heightNumber = <HTMLInputElement>document.getElementById('heightNumber');
    updateInputs(heightSlider, heightNumber, 1000);

    // link the compression range and the compression number so they change when the other does
    // set the regex filter to the compression number to avoid wrong numbers
    const compressionSlider = <HTMLInputElement>document.getElementById('compressionSlider');
    const compressionNumber = <HTMLInputElement>document.getElementById('compressionNumber');
    updateInputs(compressionSlider, compressionNumber, 100);

    // get the from from the HTML
    const form = <HTMLFormElement>document.getElementById('form');
    // reset the form so it doesn't contain any files when you reload the page
    form.reset();
    // when the form is submitted it cancels the operation and executes makeRequest() to fetch the data
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        makeRequest(form);
    });
};

// sets the listeners of the sliders and number inputs to change each other
function updateInputs(slider: HTMLInputElement, number: HTMLInputElement, type: number) {
    slider.addEventListener('input', () => {
        // update the number.value with the slider.value
        number.value = slider.value;
    });
    number.addEventListener('input', () => {
        // apply regex to the number to avoid unwanted inputs
        numberRegex(number, type);
        // update the slider.value with the number.value
        slider.value = number.value;
    });
}

// apply regex and input control to the "number: HTMLInputElement"
function numberRegex(number: HTMLInputElement, type: number) {
    // on event keydown
    number.addEventListener('keydown', (e: any) => {
        // check if the key is one of the allowed values
        // if it isn't allowed prevent the key input
        if (
            !(
                e.key == '0' ||
                e.key == '1' ||
                e.key == '2' ||
                e.key == '3' ||
                e.key == '4' ||
                e.key == '5' ||
                e.key == '6' ||
                e.key == '7' ||
                e.key == '8' ||
                e.key == '9' ||
                e.key == 'Backspace'
            )
        ) {
            e.preventDefault();
        }
        // if it is allowed but it's a "Backspace" prevent the key input if the number lenght is 1
        else {
            if (e.key == 'Backspace' && /^[1-9]{1}$/.test(number.value)) {
                e.preventDefault();
            }
        }
    });

    // the regex that will check if the number is valid
    const regex = type == 100 ? /^[1-9]{1}[0-9]{0,2}/ : /^[1-9]{1}[0-9]{0,4}/;
    // limits the number to be between 1 and 10000
    if (parseInt(number.value) > 10000) {
        number.value = '10000';
    } else if (parseInt(number.value) < 1) {
        number.value = '1';
    }
    // check if number.value is a valid input
    const numberValidated = number.value.match(regex);
    if (numberValidated) {
        number.value = number.value ? (regex.test(number.value) ? numberValidated[0] : '1') : '1';
    }
}

// displays in the form the amount of uploaded files
function uploadedFile(id: any, textId: any) {
    // get the files input and the text that indicates how many files did you upload
    const files = (<HTMLInputElement>document.getElementById(id)).files;
    const text = <HTMLInputElement>document.getElementById(textId);
    // it sets the text of textId as the number of files plus the string
    // if the files contain 0 or more than 1 object it says "files", if not it says "file"
    text.innerText = files
        ? files.length > 1 || files.length == 0
            ? files.length + ' files selected'
            : files.length + ' file selected'
        : '0 files selected';
}

// make the request to the server
async function makeRequest(form: any) {
    // send the form through a POST request to the server and when you get the response download it
    download(await sendForm(new FormData(form)));
}

// make the fetch request
async function sendForm(form: any) {
    // fetch the form
    const sendForm = await fetch('/upload', {
        method: 'POST',
        body: form,
    });
    // return the response
    return sendForm.json();
}

// download the data
async function download(data: any) {
    // download the response of the sendForm() request
    //create a link element
    const a = document.createElement('a');
    //set the href as the data
    a.href = await data.data;
    // set the default name of the downloaded file
    a.download = 'images.zip';
    // add the link element to the body of the HTML
    document.body.appendChild(a);
    // execute download
    a.click();
    // remove the link element from the body of the HTML
    document.body.removeChild(a);
}
