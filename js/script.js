window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});

let currentSlide = 0; // Index of the current slide
const slides = document.querySelectorAll('.slide');
console.log(slides);


document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0; // Index of the current slide
    const slides = document.querySelectorAll('.slide'); // Select all slides

    console.log(slides); // Debugging: Check if slides are found

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none'; // Show the current slide
        });
    }

    function changeSlide(direction) {
        currentSlide += direction;

        // Loop back to the first/last slide
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        console.log(`Current Slide: ${currentSlide}`); // Debugging output
        showSlide(currentSlide);
    }

    // Show the first slide initially
    showSlide(currentSlide);

    // Attach event listeners to navigation buttons
    document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));
    document.querySelector('.next').addEventListener('click', () => changeSlide(1));
});


function showEmail() {
    const emailText = document.getElementById("email-text");
    emailText.style.display = "inline"; // Make the email visible
}

function showEmail() {
    const emailText = document.getElementById("email-text");
    if (emailText.style.display === "none" || emailText.style.display === "") {
        emailText.style.display = "inline"; // Show email
    } else {
        emailText.style.display = "none"; // Hide email
    }
}

