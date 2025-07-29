// Load misc.json and randomly place images in misc-section


export async function loadMiscImages() {
  const section = document.getElementById('misc-section');
  if (!section) return;

  // Ensure the section is positioned relative for absolute children
  section.style.position = 'relative';

  try {
    const response = await fetch('misc.json');
    if (!response.ok) return;
    const groups = await response.json();

    section.innerHTML = ''; // Clear previous

    // Get section dimensions for random placement
    const sectionW = section.offsetWidth || 1200;
    const sectionH = section.offsetHeight || 800;

    groups.forEach((group) => {
      // Container for each mini-gallery
      const galleryDiv = document.createElement('div');
      galleryDiv.className = 'misc-mini-gallery';
      galleryDiv.style.position = 'absolute';

      // Random horizontal and vertical position (with padding)
      const padX = 40;
      const padY = 40;
      const galleryW = 240; // match your CSS width
      const galleryH = 320; // estimate max height
      galleryDiv.style.left = Math.floor(Math.random() * (sectionW - galleryW - padX)) + 'px';
      galleryDiv.style.top = Math.floor(Math.random() * (sectionH - galleryH - padY)) + 'px';

      let currentIndex = 0;
      let intervalId = null;

      // Create image and caption elements once
      const img = document.createElement('img');
      img.className = 'misc-gallery-img';
      galleryDiv.appendChild(img);

      if (group.caption) {
        const caption = document.createElement('div');
        caption.className = 'misc-image-caption';
        caption.textContent = group.caption;
        galleryDiv.appendChild(caption);
      }

      // Function to update only the image src/alt
      function renderImage(idx) {
        const imgData = group.images[idx];
        img.src = imgData.src;
        img.alt = group.caption || '';
      }

      renderImage(currentIndex);

      // Start auto-cycling every 4 seconds
      if (group.images.length > 1) {
        intervalId = setInterval(() => {
          currentIndex = (currentIndex + 1) % group.images.length;
          renderImage(currentIndex);
        }, 4000);
      }

      section.appendChild(galleryDiv);
    });
  } catch (e) {
    console.error('Could not load misc images:', e);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', loadMiscImages);
}
