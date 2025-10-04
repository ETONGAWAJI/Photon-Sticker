// Get the popup element
const popup = document.getElementById('gen-wellback');

// Function to show the popup
function showPopup() {
  popup.classList.add('show');
}

// Function to hide the popup
function hidePopup() {
  popup.classList.remove('show');
}

// Show the popup after 10 seconds
setTimeout(showPopup, 10000); // 10000 milliseconds = 10 seconds

// Close the popup when the button is clicked
document.getElementById('gen-exit').addEventListener('click', hidePopup);

// Code for file upload
 const imageData = localStorage.getItem('imageData');

    if (imageData) {
      document.getElementById('uploadedImage').src = imageData;
    }

// Transition into payway.html

setTimeout(() => {
  window.location.href = 'payway.html';
}, 27000);

