document.addEventListener('DOMContentLoaded', function () {
	// Calculate and set navbar height first
	const navbar = document.querySelector('.navbar');
	const navbarHeight = navbar.offsetHeight;
	document.documentElement.style.setProperty(
		'--navbar-height',
		`${navbarHeight}px`
	);

	// Initialize all image rows
	initImageRow('.top-row .image-track', [
		{ src: 'images/bg1.jpg', link: 'pages/about.html#about-section1' },
		{ src: 'images/bg3.jpg', link: 'pages/about.html#about-section3' },
		{ src: 'images/bg5.jpg', link: 'pages/about.html#about-section5' },
		{ src: 'images/bg7.jpg', link: 'pages/about.html#about-section7' },
		{ src: 'images/bg9.jpg', link: 'pages/about.html#about-section9' },
	]);

	initImageRow('.middle-row .image-track', [
		{ src: 'images/bg1.jpg', link: 'pages/about.html#about-section1' },
		{ src: 'images/bg3.jpg', link: 'pages/about.html#about-section3' },
		{ src: 'images/bg5.jpg', link: 'pages/about.html#about-section5' },
		{ src: 'images/bg7.jpg', link: 'pages/about.html#about-section7' },
		{ src: 'images/bg9.jpg', link: 'pages/about.html#about-section9' },
	]);

	initImageRow('.bottom-row .image-track', [
		{ src: 'images/bg2.jpg', link: 'pages/about.html#about-section2' },
		{ src: 'images/bg4.jpg', link: 'pages/about.html#about-section4' },
		{ src: 'images/bg6.jpg', link: 'pages/about.html#about-section6' },
		{ src: 'images/bg8.jpg', link: 'pages/about.html#about-section8' },
		{ src: 'images/bg10.jpg', link: 'pages/about.html#about-section10' },
	]);

	// Mobile menu toggle
	document
		.querySelector('.mobile-menu-btn')
		.addEventListener('click', function () {
			document.querySelector('.nav-links').classList.toggle('active');
		});

	// Smooth scrolling for anchor links
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			document.querySelector('.nav-links').classList.remove('active');
			document.querySelector(this.getAttribute('href')).scrollIntoView({
				behavior: 'smooth',
			});
		});
	});

	// Dropdown functionality
	document.querySelectorAll('.dropdown').forEach((dropdown) => {
		if (window.innerWidth <= 768) {
			const dropbtn = dropdown.querySelector('.dropbtn');
			dropbtn.addEventListener('click', function (e) {
				e.preventDefault();
				dropdown.classList.toggle('active');
			});
		}
	});

	// Close dropdown when clicking outside
	document.addEventListener('click', function (e) {
		if (!e.target.closest('.dropdown')) {
			document.querySelectorAll('.dropdown').forEach((dropdown) => {
				dropdown.classList.remove('active');
			});
		}
	});
});

function initImageRow(selector, images) {
	const track = document.querySelector(selector);
	if (!track) return;

	// Clear existing content
	track.innerHTML = '';

	// Create and load images
	images.forEach((imgData) => {
		const link = document.createElement('a');
		link.href = imgData.link;
		link.className = 'bg-image';

		const img = new Image();
		img.onload = function () {
			link.style.backgroundImage = `url('${imgData.src}')`;
			const aspectRatio = this.naturalWidth / this.naturalHeight;
			link.dataset.aspectRatio = aspectRatio;
			updateImageDimensions(track);
		};
		img.onerror = function () {
			console.error('Failed to load image:', imgData.src);
			link.style.backgroundColor = '#ccc'; // Fallback color
			link.dataset.aspectRatio = 16 / 9; // Default aspect ratio
			updateImageDimensions(track);
		};
		img.src = imgData.src;

		track.appendChild(link);
	});

	// Setup resize observer
	const resizeObserver = new ResizeObserver(() => {
		updateImageDimensions(track);
	});
	resizeObserver.observe(track);
}

function updateImageDimensions(track) {
	const images = track.querySelectorAll('.bg-image');
	if (images.length === 0) return;

	const rowHeight = track.parentElement.offsetHeight;
	const imageHeight = rowHeight * 0.9;
	let totalWidth = 0;

	// Set dimensions for all images
	images.forEach((img) => {
		const aspectRatio = parseFloat(img.dataset.aspectRatio || 16 / 9);
		const width = imageHeight * aspectRatio;

		img.style.height = `${imageHeight}px`;
		img.style.width = `${width}px`;
		totalWidth += width + (parseInt(getComputedStyle(track).gap) || 0);
	});

	// Clone images for seamless looping (only if not already cloned)
	if (!track.dataset.clonesCreated) {
		const clones = Array.from(images).map((img) => img.cloneNode(true));
		clones.forEach((clone) => track.appendChild(clone));
		track.dataset.clonesCreated = true;

		// Add the width of clones to total width
		clones.forEach((clone) => {
			totalWidth +=
				parseFloat(clone.style.width) +
				(parseInt(getComputedStyle(track).gap) || 0);
		});
	}

	// Set animation duration
	const viewportWidth = window.innerWidth;
	const speedFactor = totalWidth / viewportWidth;
	track.style.animationDuration = `${60 * speedFactor}s`;
	track.style.animationName = 'slideLeft';
}
