async function loadProjects() {
  const response = await fetch('projects.json');
  const projects = await response.json();

  const mainContent = document.querySelector('.main-content');

  projects.forEach(project => {
    // Create a nav link above each project section for mobile
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

    project.gallery.forEach((item, index) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      slide.style.width = '100%';
      slide.style.height = '100%';
      slide.style.display = 'flex';
      slide.style.flexDirection = 'column';
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
        // Handle text annotation with optional firstWord as a title
        if (item.firstWord) {
          const title = document.createElement('div');
          title.className = 'gallery-text-title';
          title.textContent = item.firstWord;
          slide.appendChild(title);
        }
        // Render multi-paragraph text (array or string), no commas, keep styles
        if (Array.isArray(item.text)) {
          // Check if any paragraph contains a line break
          const hasLineBreak = item.text.some(str => typeof str === 'string' && str.includes('\n'));
          if (hasLineBreak) {
            // Render each (sub)paragraph as its own <p>
            item.text.forEach(paragraph => {
              if (typeof paragraph === 'string' && paragraph.includes('\n')) {
                paragraph.split(/\n{2,}|\n/).forEach(subParagraph => {
                  const clean = subParagraph.trim();
                  if (clean) {
                    const p = document.createElement('p');
                    p.className = 'gallery-text';
                    p.style.fontSize = '1.2rem';
                    p.style.textAlign = 'center';
                    p.style.margin = '20px 0';
                    p.textContent = clean;
                    slide.appendChild(p);
                  }
                });
              } else {
                const clean = paragraph.trim();
                if (clean) {
                  const p = document.createElement('p');
                  p.className = 'gallery-text';
                  p.style.fontSize = '1.2rem';
                  p.style.textAlign = 'center';
                  p.style.margin = '20px 0';
                  p.textContent = clean;
                  slide.appendChild(p);
                }
              }
            });
          } else {
            // No line breaks: join all strings as continuous text in one <p>
            const joined = item.text.map(str => str.trim()).join(' ');
            if (joined) {
              const p = document.createElement('p');
              p.className = 'gallery-text';
              p.style.fontSize = '1.2rem';
              p.style.textAlign = 'center';
              p.style.margin = '20px 0';
              p.textContent = joined;
              slide.appendChild(p);
            }
          }
        } else if (typeof item.text === 'string') {
          // If the string contains \n, split and render each as a paragraph
          if (item.text.includes('\n')) {
            item.text.split(/\n{2,}|\n/).forEach(paragraph => {
              const clean = paragraph.trim();
              if (clean) {
                const p = document.createElement('p');
                p.className = 'gallery-text';
                p.style.fontSize = '1.2rem';
                p.style.textAlign = 'center';
                p.style.margin = '20px 0';
                p.textContent = clean;
                slide.appendChild(p);
              }
            });
          } else {
            // No \n, render as a single paragraph
            const clean = item.text.trim();
            if (clean) {
              const p = document.createElement('p');
              p.className = 'gallery-text';
              p.style.fontSize = '1.2rem';
              p.style.textAlign = 'center';
              p.style.margin = '20px 0';
              p.textContent = clean;
              slide.appendChild(p);
            }
          }
        }
      }

      gallery.appendChild(slide);
    });

    // Ensure each section occupies 100% of the viewport
    section.style.height = '100vh';
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.justifyContent = 'center';
    section.style.alignItems = 'center';

    // Insert the nav link above the section
    mainContent.appendChild(mobileNavLink);

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
