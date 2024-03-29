let customSlideIndex = 1;
showSlides(customSlideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(customSlideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(customSlideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { customSlideIndex = 1; }
  if (n < 1) { customSlideIndex = slides.length; }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[customSlideIndex - 1].style.display = "block";
  dots[customSlideIndex - 1].className += " active";
}



 window.addEventListener('scroll', function() {
    const educationSection = document.getElementById('education-section');
    const scrollDownText = document.querySelector('.scroll-down-container');
    
    const distanceToBottom = educationSection.getBoundingClientRect().bottom;

    if (distanceToBottom <= window.innerHeight) {
      scrollDownText.style.display = 'none';
    } else {
      scrollDownText.style.display = 'block';
    }
  });

const yearElement = document.getElementById('year');
const currentYear = new Date().getFullYear();
yearElement.textContent = currentYear;