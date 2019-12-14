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
    db.collection('cafes')
    // .where('city', '==', 'Faiyum')
    // .orderBy('name')
    .get()
    .then((snapshot) => {
      model.cafes = snapshot.docs;
      cafeList.init();
    });
  },
  getCafes() {
    return model.cafes;
  },
  addCafe(cafe) {
    db.collection('cafes')
    .add({
      name: cafe.name,
      city: cafe.city
    })
  },
  deleteCafe(cafeId) {
    db.collection('cafes').doc(cafeId)
    .delete();
  },
  init() {
    form.init();

    // Real-time listener
    db.collection('cafes').onSnapshot(() => {
      this.setCafes();
    });
  }
}

/* =======================================
  Views
========================================== */

/* Cafe List --- */
const cafeList = {
  init() {
    this.cafeList = document.querySelector('.cafeList');
    this.cafeList.addEventListener('click', (event) => {
      const { target } = event;
      const removeBtnClicked = target.className === 'cafe__remove';
      if (removeBtnClicked) {
        const cafeId = target.parentElement.getAttribute('data-id');
        octopus.deleteCafe(cafeId);
      }
    })

    cafeList.render();
  },
  createListItem(cafeId, cafeData) {
    const li = document.createElement('li');
    li.setAttribute('data-id', cafeId);
    li.innerHTML = 
    `
      <span class="cafe__name">${cafeData.name}</span>
      <span class="cafe__city">${cafeData.city}</span>
      <div class="cafe__remove">x</div>
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

/* form --- */
const form = {
  init() {
    this.form = document.querySelector('.addCafeForm');
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = this.form.name.value;
      const city = this.form.city.value;
      octopus.addCafe({ name, city });
      this.form.reset();
    })
  }
}

// Start
octopus.init();