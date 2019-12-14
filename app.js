const db = firebase.firestore();

/* Helper functions --- */

// Remove All children
Node.prototype.removeAll = function () {
  while (this.firstChild) { this.removeChild(this.firstChild); }
  return this;
};

/* =======================================
  Model
========================================== */
const model = {
  cafes: []
}

/* =======================================
  Controller
========================================== */
const octopus = {
  setCafes() {
    db.collection('cafes').get().then((snapshot) => {
      model.cafes = snapshot.docs;
      cafeList.init();
    });
  },
  getCafes() {
    return model.cafes;
  },
  init() {
    this.setCafes();
  }
}

/* =======================================
  Views
========================================== */
const cafeList = {
  init() {
    this.cafeList = document.querySelector('.cafeList');
    cafeList.render();
  },
  createListItem(cafeId, cafeData) {
    const li = document.createElement('li');
    li.setAttribute('data-id', cafeId);
    li.innerHTML = 
    `
      <span class="cafe__name">${cafeData.name}</span>
      <span class="cafe__city">${cafeData.city}</span>
    `
    return li;
  },
  render() {
    const cafes = octopus.getCafes();
    const fragment = document.createDocumentFragment();
    cafes.forEach((cafe) => {
      const li = this.createListItem(cafe.id, cafe.data());
      fragment.appendChild(li);
    })
    this.cafeList.removeAll();
    this.cafeList.appendChild(fragment);
  }
}

// Start
octopus.init();