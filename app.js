// This is to make a slide show on the home page

  const slider = document.querySelector('.testimonial-slider');
  const testimonials = document.querySelectorAll('.testimonial');
  let index = 0;

  function showNextTestimonial() {
    index = (index + 1) % testimonials.length;
    const offset = -index * testimonials[0].offsetWidth;
    slider.style.transform = `translateX(${offset}px)`;
  }

  setInterval(showNextTestimonial, 4000); // change every 4 seconds


  // JS for rolling counter animations
 // JS for rolling counter animations (only starts when visible)
const counters = document.querySelectorAll('.counter');
let hasCounted = false;

const animateCounters = () => {
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;

      const increment = target / 200; // speed factor

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 10);
      } else {
        // Format with "+" or other suffixes
        if (target >= 1000) {
          counter.innerText = (target / 1000).toFixed(0) + 'k+';
        } else if (target === 24) {
          counter.innerText = '24/7';
        } else {
          counter.innerText = target + '%';
        }
      }
    };

    updateCount();
  });
};

// Set up IntersectionObserver to trigger the counter only when visible
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !hasCounted) {
    animateCounters();
    hasCounted = true; // prevent rerunning
  }
}, {
  threshold: 0.6 // adjust visibility trigger threshold as needed
});

const statsSection = document.querySelector('.stats');
observer.observe(statsSection);



// For the tutor upload files
if (window.location.pathname.includes("tutor.html")) {
  const form = document.getElementById("uploadForm");
  const container = document.getElementById("lessonsContainer");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("lessonTitle").value;
    const desc = document.getElementById("lessonDesc").value;
    const videoFile = document.getElementById("lessonVideo").files[0];

    if (videoFile) {
      const reader = new FileReader();

      reader.onload = function () {
        const base64Video = reader.result;

        // Get current lessons or initialize
        const existing = JSON.parse(localStorage.getItem("lessons") || "[]");

        const newLesson = {
          title,
          desc,
          videoData: base64Video,
          type: videoFile.type,
        };
        
        // Save
        existing.unshift(newLesson);
        localStorage.setItem("lessons", JSON.stringify(existing));

        form.reset();
        renderLessons(); // Now happens after saving

      };

      reader.readAsDataURL(videoFile); // convert to base64
    }
  });

  function renderLessons() {
    const savedLessons = JSON.parse(localStorage.getItem("lessons") || "[]");
    container.innerHTML = "";
    savedLessons.forEach((lesson, index) => addLessonToUI(lesson, index));
  }

  function addLessonToUI(lesson, index) {
    const lessonItem = document.createElement("div");
    lessonItem.className = "lesson-item";
    lessonItem.innerHTML = `
      <h3>${lesson.title}</h3>
      <p>${lesson.desc}</p>
      <video controls width="100%">
        <source src="${lesson.videoData}" type="${lesson.type}">
        Your browser does not support the video tag.
      </video>
      <button class="delete-btn" data-index="${index}">🗑️ Delete</button>
    `;
    container.appendChild(lessonItem);
  }

  // Delete listener
  container.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const index = parseInt(e.target.dataset.index);
      let lessons = JSON.parse(localStorage.getItem("lessons") || "[]");
      lessons.splice(index, 1); // Remove
      localStorage.setItem("lessons", JSON.stringify(lessons));
      renderLessons(); // Refresh UI
    }
  });

  // Initial load
  renderLessons();
}




// Smart auto-name 
if (window.location.pathname.includes("student.html")) {
  const container = document.getElementById("studentLessons");

  const lessons = JSON.parse(localStorage.getItem("lessons") || "[]");

  lessons.forEach(lesson => {
    const lessonItem = document.createElement("div");
    lessonItem.className = "lesson-item";
    lessonItem.innerHTML = `
      <h3>${lesson.title}</h3>
      <p>${lesson.desc}</p>
      <video controls width="100%">
        <source src="${lesson.videoData}" type="${lesson.type}">
        Your browser does not support the video tag.
      </video>
    `;
    container.appendChild(lessonItem);
  });
}

