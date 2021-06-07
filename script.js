const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal, Focus on Input
const showModal = () => {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
};

// Close Modal
const closeModal = () => {
    modal.classList.remove('show-modal');
};

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', closeModal);
window.addEventListener('click', (e) => (e.target === modal ? closeModal() : false));

// Validate Form
const validateForm = (nameValue, urlValue) => {
    const expression =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if (!nameValue || !urlValue) {
        alert('Please submit values for both field');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }

    // Valid
    return true;
};

// Build Bookmarks DOM
const buildBookmars = () => {
    bookmarksContainer.innerHTML = '';
    // Build Items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon/Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute(
            'src',
            `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`,
        );
        favicon.setAttribute('alt', 'Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to Bookmarks Container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
};

// Fetch Bookmars
const fetchBookmars = () => {
    // Get Bookmarks from localStorage if Available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage
        bookmarks = [
            {
                name: 'Filipe Silva',
                url: 'https://github.com/filipeqs',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmars();
};

// Handle Data from Form
const storeBookmark = (e) => {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`;
    }

    if (!validateForm(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmars();

    bookmarkForm.reset();
    websiteNameEl.focus();
};

// Event Listeners
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load
fetchBookmars();
