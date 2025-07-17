async function loadProjects() {
  const response = await fetch('projects.json');
  const projects = await response.json();

  const mainContent = document.querySelector('.main-content');

  projects.forEach(project => {
    const section = document.createElement('section');
    section.id = project.id;
    section.className = 'project-section';
    section.dataset.section = project.id;

    const gallery = document.createElement('div');
    gallery.className = 'project-gallery';

    project.gallery.forEach((item, index) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      slide.style.width = '100%';
      slide.style.height = '100%';
      slide.style.display = 'flex';
      slide.style.justifyContent = 'center';
      slide.style.alignItems = 'center';

      if (item.src) {
        // Handle image
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        img.className = 'project-image';
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.maxHeight = '60vh';
        img.style.maxWidth = '100%';
        slide.appendChild(img);
      } else if (item.text) {
        // Handle text annotation
        const paragraph = document.createElement('p');
        paragraph.textContent = item.text;
        paragraph.className = 'gallery-text';
        paragraph.style.fontSize = '1.2rem';
        paragraph.style.textAlign = 'center';
        paragraph.style.margin = '20px 0';
        slide.appendChild(paragraph);
      }

      gallery.appendChild(slide);
    });

    // Ensure each section occupies 100% of the viewport
    section.style.height = '100vh';
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.justifyContent = 'center';
    section.style.alignItems = 'center';

    // Add click functionality to cycle through gallery items
    let currentIndex = 0;
    section.addEventListener('click', () => {
      const slides = gallery.querySelectorAll('.gallery-slide');
      slides.forEach(slide => slide.classList.remove('active'));

      currentIndex = (currentIndex + 1) % project.gallery.length;
      slides[currentIndex].classList.add('active');
    });

    // Set the first item as active
    if (gallery.firstChild) {
      gallery.firstChild.classList.add('active');
    }

    // Remove any CSS transitions or animations for immediate effect
    const style = document.createElement('style');
    style.textContent = `
      .gallery-slide {
        transition: none !important;
        animation: none !important;
      }
    `;
    document.head.appendChild(style);

    section.appendChild(gallery);

    mainContent.appendChild(section);
  });
}

loadProjects();
