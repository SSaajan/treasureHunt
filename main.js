const htmlClasses = [  
                    document.querySelector(".initial1"), 
                    document.querySelector(".initial2"), 
                    document.querySelector(".initial3"),
                    document.querySelector(".initial4"),
                    document.querySelector(".initial5"),
                    document.querySelector(".initial6"), 
                    document.querySelector(".cursor"), 
                    document.querySelector(".typedWelcome")
                    ];       

const submitForm = document.getElementById("submitForm");
const words = ["/////", "> Initializing services", "> [success]", "> Commencing communication with services", ">> ## DSP | ADAP | CASB ##", ">> Instance ID #2112", "welcome..."];
const typeSpeed = [0, 50, 200, 600];
let loaderCounter = 0, wordIndex = 0, charIndex = 0, htmlIndex = 0, speedIndex = 2;

function loadType() {
    if(charIndex < words[wordIndex].length) {
        htmlClasses[htmlIndex].textContent += words[wordIndex].charAt(charIndex);
        charIndex++;
        setTimeout(loadType, typeSpeed[speedIndex]);
    }
    else {
        eraseLoader();
    }
}

function eraseLoader() {
    htmlClasses[htmlIndex].textContent = "";
    loaderCounter++;
    charIndex = 0;
    if(loaderCounter < 4) {
        loadType();
    }  
    else {
        wordIndex++;
        htmlIndex++;
        speedIndex = 0;
        type();
    }
}

function type() {
    if(wordIndex == 6) {
        if(charIndex >= 6) {
            speedIndex = 3;
        }
        else {
            speedIndex = 1;
        }
    }
    if(wordIndex == words.length) {
        document.querySelector(".cursor").textContent = "";
        document.querySelector(".typedWelcome").textContent = "";
        document.getElementById("teamIDForm").style.visibility = "visible";
    }
    else {
        if(charIndex < words[wordIndex].length) {
            htmlClasses[htmlIndex].textContent += words[wordIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typeSpeed[speedIndex]);
        }
        else {
            nextWord();
        }
    }
}

function nextWord() {
    charIndex = 0;
    wordIndex++;
    htmlIndex++;
    if(wordIndex == 6) {
        htmlClasses[htmlIndex].textContent += "|";
        htmlIndex++;
        setTimeout(type, 2000);
    }
    else {
        setTimeout(type, 1000);
    }
}

function sendData() {
    const XHR = new XMLHttpRequest();
    const data = new FormData(submitForm);

    XHR.addEventListener("load", (event) => {
        alert(event.target.responseText);
      });
  
      // Define what happens in case of error
      XHR.addEventListener("error", (event) => {
        alert('Oops! Something went wrong.');
      });

    // Set up our request
    XHR.open("GET", "https://stellular-bombolone-ba80b2.netlify.app/.netlify/functions/api");

    // The data sent is what the user provided in the form
    XHR.send(data);
}


document.addEventListener("DOMContentLoaded", function() {
    loadType();
});

submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendData();
});
