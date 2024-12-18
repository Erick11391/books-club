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

  
  function renderClubs() {
    clubsList.innerHTML = ''; 
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
          <button class="share-btn" data-index="${index}">Share</button>
          <button class="view-comments-btn" data-index="${index}">Comments & Reviews</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
          <div class="comments-section" id="comments-${index}" style="display: none;">
            <textarea class="comment-input" placeholder="Add a comment..."></textarea>
            <button class="add-comment-btn" data-index="${index}">Add Comment</button>
            <ul class="comments-list"></ul>
          </div>
        `;
        clubsList.appendChild(clubDiv);
      });
    }
  }

  
  clubForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newClub = {
      name: clubNameInput.value,
      description: clubDescriptionInput.value,
      id: Date.now(), 
      comments: [],
    };
    clubs.push(newClub);
    renderClubs();
    clubNameInput.value = '';
    clubDescriptionInput.value = '';
  });

  
  clubsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const index = event.target.getAttribute('data-index');
      clubs.splice(index, 1);
      renderClubs();
    }
  });

  
  clubsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('share-btn')) {
      const index = event.target.getAttribute('data-index');
      const club = clubs[index];
      const shareLink = `${window.location.href}?clubId=${club.id}`;
      alert(`Share this link: ${shareLink}`);
    }
  });

  
  clubsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('view-comments-btn')) {
      const index = event.target.getAttribute('data-index');
      const commentsSection = document.getElementById(`comments-${index}`);
      commentsSection.style.display =
        commentsSection.style.display === 'none' ? 'block' : 'none';
    }
  });

  
  clubsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-comment-btn')) {
      const index = event.target.getAttribute('data-index');
      const commentInput = document.querySelector(`#comments-${index} .comment-input`);
      const commentText = commentInput.value;
      if (commentText) {
        clubs[index].comments.push(commentText);
        const commentsList = document.querySelector(`#comments-${index} .comments-list`);
        const commentItem = document.createElement('li');
        commentItem.textContent = commentText;
        commentsList.appendChild(commentItem);
        commentInput.value = ''; 
      }
    }
  });

  
  searchButton.addEventListener('click', async () => {
    const query = bookSearchInput.value;
    if (query === '') return;
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await response.json();
      displayBooks(data.items);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  });

  
  function displayBooks(books) {
    bookResults.innerHTML = '';
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

  
  renderClubs();
});



   