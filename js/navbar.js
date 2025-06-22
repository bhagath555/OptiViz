// Split the current path into list 
const pathParts = window.location.pathname.split('/');
// Access the last part of the path
const currentPage = pathParts[pathParts.length - 1];
// Check if the current page is in the 'html' folder
const isInHtmlFolder = pathParts.includes('html');
// Check if the current page is in the 'html' folder. accordingly set the prefix
const prefix = isInHtmlFolder ? '../' : '';

// Define the list of tabs to show in the navbar.
// Each tab includes:
// - `text`: label to display
// - `href`: destination URL (adjusted with prefix)
// - `page`: filename to match with `currentPage` for highlighting
const tabs = [
	{ text: 'Home', href: prefix + 'index.html', page: 'index.html' },
	{ text: 'Steepest Descent', href: prefix + 'html/1_steepest.html', page: '1_steepest.html' },
	{ text: 'Conjugate Gradient', href: prefix + 'html/2_conjugate.html', page: '2_conjugate.html' },
	{ text: 'Newton Method', href: prefix + 'html/3_newton.html', page: '3_newton.html' },
	{ text: 'LMM', href: prefix + 'html/4_lmm.html', page: '4_lmm.html' },
	{ text: 'Golden Cut', href: prefix + 'html/5_golden.html', page: '5_golden.html' },
	{ text: 'Powell', href: prefix + 'html/6_powell.html', page: '6_powell.html' },
	{ text: 'Nelder Mead', href: prefix + 'html/7_nelder.html', page: '7_nelder.html' }
];

console.log('tabs', tabs);

function initBootstrapNavbar() {

	// Get the navbar container
	const container = document.getElementById('navbar-container');

	// Inject static HTML for the navbar
	container.innerHTML =
		`<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#">OptiViz</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNavbar">
                <!-- Left-side navigation tabs -->
                <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="navbar-links"></ul>

            </div>
        </div>
     </nav>`;


	const navbarList = document.getElementById('navbar-links');
	if (!navbarList) return;

    // Loop over each tab in the tabs array
	tabs.forEach(tab => {

		const li = document.createElement('li');
		li.className = 'nav-item';

		const a = document.createElement('a');
		a.className = 'nav-link';
		a.textContent = tab.text; // tab label

        // Check if the tab has a valid href
		if (tab.href) {
			a.href = tab.href;
			// Mark current page as active
			if (tab.page === currentPage) {
				a.classList.add('active');
				a.setAttribute('aria-current', 'page');
			}
		}
		// If not valid, disable the tab visually
		else {
			// Disabled tab
			a.classList.add('disabled');
			a.href = '#';
			a.tabIndex = -1;
			a.setAttribute('aria-disabled', 'true');
		}

		li.appendChild(a);
		navbarList.appendChild(li);
	});

    // Insert spacer to push the next item (Contact) to the far right
    const spacer = document.createElement('li');
    spacer.className = 'nav-item ms-auto'; // pushes next item to right
    navbarList.appendChild(spacer);

	// ----- Create the blogs tab
	const blogsLi = document.createElement('li');
	blogsLi.className = 'nav-item';

	const blogsA = document.createElement('a');
	blogsA.className = 'nav-link';
	blogsA.textContent = 'Blogs';
	blogsA.href = prefix + 'html/blogs.html'; 

	 if (currentPage === 'blogs.html') {
		blogsA.classList.add('active');
		blogsA.setAttribute('aria-current', 'page');
	  }
	blogsLi.appendChild(blogsA);

	// Append Blogs tab to the navbar
	navbarList.appendChild(blogsLi);

    // ----- Create Contact tab
    const contactLi = document.createElement('li');
    contactLi.className = 'nav-item';

    const contactA = document.createElement('a');
    contactA.className = 'nav-link';
    contactA.textContent = 'Contact';
    contactA.href = prefix + 'contact.html'; 

    if (currentPage === 'contact.html') {
        contactA.classList.add('active');
        contactA.setAttribute('aria-current', 'page');
    }

    contactLi.appendChild(contactA);

	// Append Contact tab to the navbar
    navbarList.appendChild(contactLi);
}

// Run on page load
if (document.readyState === 'loading') {
    // If still loading, wait for DOMContentLoaded
	document.addEventListener('DOMContentLoaded', initBootstrapNavbar);
} else {
    // If already loaded, run the function immediately
	initBootstrapNavbar();
}


