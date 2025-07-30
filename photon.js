let images = document.querySelectorAll('.sample'); // replace with the class name of your images
let currentImage = 0;

function displayNextImage() {
  // Hide all images
  images.forEach(image => image.style.display = 'none');
  
  // Display the current image
  images[currentImage].style.display = 'block';
  
  // Move to the next image
  currentImage = (currentImage + 1) % images.length;
  
  // Schedule the next image display
  setTimeout(displayNextImage, 3000); // change image every 3 seconds
}

// Start the image display cycle
displayNextImage();


// FOR THE COUNTER

let counterElement = document.getElementById('d-counter'); // replace with the ID of your element
let count = parseInt(counterElement.textContent.replace(/,/g, '')); // remove comma and parse to integer

setInterval(() => {
  count++;
  counterElement.textContent = count.toLocaleString(); // format with comma
}, 5000); // increment every 5 seconds


// FOR THE POPUP LOGIN MENU

// This gets or summons the link
const loginButton = document.getElementById('login-button');
const wellBack = document.getElementById('wellback');
const exit = document.querySelector('.exit');


// This adds an EventListener
loginButton.addEventListener('click', (e) => {
  e.preventDefault();
  wellBack.classList.add('show');
});

// This adds an Eventlistener for the close 

exit.addEventListener('click', () => {
  document.getElementById('wellback').classList.remove('show');
});



