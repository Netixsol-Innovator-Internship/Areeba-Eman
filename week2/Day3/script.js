function renderMenu(jsonFile, containerId) {
  fetch(jsonFile)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById(containerId);

      data.forEach(item => {
        const box = document.createElement('div');
        box.className = 'burger-box';

        box.innerHTML = `
          <div class="left">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <h3>${item.price}</h3>
          </div>
          <div class="right">
            <img src="${item.image}" alt="${item.title}">
            <div class="plus-cont">
              <img src="${item.plusIcon}" alt="Plus Icon">
            </div>
          </div>
        `;

        container.appendChild(box);
      });
    })
    .catch(err => console.error(`Error loading ${jsonFile}`, err));
}

renderMenu('burgers.json', 'burgerContainer');
renderMenu('fries.json', 'friesContainer');
renderMenu('drinks.json', 'drinksContainer');


// Restarunts
const restaurants = [
  "images/Group 16.png",
  "images/Group 17.png",
  "images/Group 18.png",
  "images/Group 19.png",
  "images/Group 20.png",
  "images/Group 21.png"
];
const container = document.getElementById('resturents-container');

restaurants.map(src => {
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Restaurant';
  container.appendChild(img);
});


// Reviews
fetch('reviews.json')
  .then(response => response.json())
  .then(data => {
    const reviewContainer = document.querySelector('.reviews');
    reviewContainer.innerHTML = '';

    // Original reviews
    data.forEach(review => {
      const reviewBox = document.createElement('div');
      reviewBox.classList.add('review-box');
      reviewBox.innerHTML = `
        <div class="top">
          <div class="top-right">
            <img src="${review.image}" alt="">
            <hr>
            <p>${review.name} <br><span>${review.location}</span></p>
          </div>
          <div class="top-left">
            <img src="${review.stars}" alt="">
            <div class="time-info">
              <span class="material-symbols-outlined">nest_clock_farsight_analog</span>
              <span>${review.date}</span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <p>${review.text}</p>
        </div>
      `;
      reviewContainer.appendChild(reviewBox);
    });

    // ✅ Duplicate the same 3 reviews for seamless loop
    data.forEach(review => {
      const cloneBox = document.createElement('div');
      cloneBox.classList.add('review-box');
      cloneBox.innerHTML = `
        <div class="top">
          <div class="top-right">
            <img src="${review.image}" alt="">
            <hr>
            <p>${review.name} <br><span>${review.location}</span></p>
          </div>
          <div class="top-left">
            <img src="${review.stars}" alt="">
            <div class="time-info">
              <span class="material-symbols-outlined">nest_clock_farsight_analog</span>
              <span>${review.date}</span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <p>${review.text}</p>
        </div>
      `;
      reviewContainer.appendChild(cloneBox);
    });
  })
  .catch(error => {
    console.error('Error loading reviews:', error);
  });

