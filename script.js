// JavaScript to manage book clubs and search functionality
document.addEventListener('DOMContentLoaded', () => {
  const clubForm = document.getElementById('club-form');
  const clubNameInput = document.getElementById('club-name');
  const clubDescriptionInput = document.getElementById('club-description');
  const clubsList = document.getElementById('clubs-list');
  const noClubsMessage = document.getElementById('no-clubs-message');
  const bookSearchInput = document.getElementById('book-search');
  const searchButton = document.getElementById('search-btn');
  const bookResults = document.getElementById('book-results');

  // Array to hold clubs
  let clubs = [];

  // Function to render clubs
  function renderClubs() {
    clubsList.innerHTML = ''; // Clear previous list
    if (clubs.length === 0) {
      noClubsMessage.style.display = 'block';
    } else {
      noClubsMessage.style.display = 'none';
      clubs.forEach((club, index) => {
        const clubDiv = document.createElement('div');
        clubDiv.classList.add('club-item');
        clubDiv.innerHTML = `
          <h3>${club.name}</h3>
          <p>${club.description}</p>
          <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        clubsList.appendChild(clubDiv);
      });
    }
  }

  // Event listener for creating a new club
  clubForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page refresh on form submission
    const newClub = {
      name: clubNameInput.value,
      description: clubDescriptionInput.value,
    };
    clubs.push(newClub); // Add the new club to the clubs array
    renderClubs(); // Re-render the list of clubs
    clubNameInput.value = '';
    clubDescriptionInput.value = '';
  });

  // Event listener for deleting a club
  clubsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const index = event.target.getAttribute('data-index');
      clubs.splice(index, 1); // Remove the club from the clubs array
      renderClubs(); // Re-render the list of clubs after deletion
    }
  });

  // Book search functionality
  searchButton.addEventListener('click', async () => {
    const query = bookSearchInput.value;
    if (query === '') return; // Don't search if the input is empty
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await response.json();
      displayBooks(data.items); // Display search results
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  });

  // Function to display books in the search results
  function displayBooks(books) {
    bookResults.innerHTML = ''; // Clear previous search results
    books.forEach((book) => {
      const bookDiv = document.createElement('div');
      bookDiv.classList.add('book-item');
      bookDiv.innerHTML = `
        <img src="${book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x200'}" alt="${book.volumeInfo.title}">
        <h3>${book.volumeInfo.title}</h3>
        <p>${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}</p>
      `;
      bookResults.appendChild(bookDiv);
    });
  }

  // Initial render of clubs (if any)
  renderClubs();
});



   