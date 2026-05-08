async function loadProjects() {
  const response = await fetch('projects.json');
  const projects = await response.json();

  const mainContent = document.querySelector('.main-content');

  for (const project of projects) {
    const mobileNavLink = document.createElement('a');
    mobileNavLink.className = 'nav-link mobile-nav-link';
    mobileNavLink.setAttribute('data-section', project.id);
    mobileNavLink.textContent = project.id.replace(/-/g, ' ').toUpperCase();

    const section = document.createElement('section');
    section.id = project.id;
    section.className = 'project-section';
    section.dataset.section = project.id;

    const gallery = document.createElement('div');
    gallery.className = 'project-gallery';

    // Add only image slides from the gallery
    project.gallery.forEach((item) => {
      if (!item.src) return;
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      slide.style.width = '100%';
      slide.style.height = '100%';
      slide.style.display = 'flex';
      slide.style.flexDirection = 'column';
      slide.style.justifyContent = 'center';
      slide.style.alignItems = 'center';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || '';
      img.className = 'project-image';
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.style.maxHeight = '60vh';
      img.style.maxWidth = '100%';
      slide.appendChild(img);

      gallery.appendChild(slide);
    });

    // Fetch and parse the .txt file for this project
    try {
      const textResponse = await fetch(`images/${project.id}/text.txt`);
      if (textResponse.ok) {
        const textContent = await textResponse.text();
        
        // Validate that we got actual text, not HTML (check if response starts with HTML tags)
        if (textContent.trim().startsWith('<') || textContent.includes('<!DOCTYPE')) {
          console.warn(`Project ${project.id}: fetch returned HTML instead of text, skipping.`);
        } else {
          // Split by double newline to separate title from body text
          const blocks = textContent.split(/\n\s*\n/).map(block => block.trim()).filter(block => block);
          
          if (blocks.length > 0) {
            const titleLine = blocks[0];
            const bodyText = blocks.slice(1).join('\n\n'); // Rejoin remaining blocks with blank lines

            // Create the text slide (added AFTER all image slides)
            const descSlide = document.createElement('div');
            descSlide.className = 'gallery-slide';
            descSlide.style.width = '100%';
            descSlide.style.height = '100%';
            descSlide.style.display = 'flex';
            descSlide.style.flexDirection = 'column';
            descSlide.style.justifyContent = 'center';
            descSlide.style.alignItems = 'center';
            descSlide.style.padding = '2rem';

            const descInner = document.createElement('div');
            descInner.className = 'gallery-description';

            // Add title
            const title = document.createElement('div');
            title.className = 'gallery-text-title';
            title.textContent = titleLine;
            descInner.appendChild(title);

            // Add body text as a single paragraph
            const p = document.createElement('p');
            p.className = 'gallery-text';
            p.textContent = bodyText;
            descInner.appendChild(p);

            descSlide.appendChild(descInner);
            gallery.appendChild(descSlide); // Appended last, so text slide is at the end
          }
        }
      }
    } catch (error) {
      console.warn(`Could not load text.txt for project ${project.id}:`, error);
    }

    section.style.height = '100vh';
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.justifyContent = 'center';
    section.style.alignItems = 'center';

    mainContent.appendChild(mobileNavLink);

    // Cycle through slides — left half goes back, right half goes forward
    let currentIndex = 0;
    section.addEventListener('click', (event) => {
      const slides = gallery.querySelectorAll('.gallery-slide');
      slides.forEach(slide => slide.classList.remove('active'));

      // Check if click is in left or right half of the section
      const sectionRect = section.getBoundingClientRect();
      const clickX = event.clientX;
      const midpoint = sectionRect.left + sectionRect.width / 2;

      if (clickX < midpoint) {
        // Left half — go back
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      } else {
        // Right half — go forward
        currentIndex = (currentIndex + 1) % slides.length;
      }

      slides[currentIndex].classList.add('active');
    });

    if (gallery.firstChild) {
      gallery.firstChild.classList.add('active');
    }

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
  }
}

loadProjects();
