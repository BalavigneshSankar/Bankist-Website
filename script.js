'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling

btnScrollTo.addEventListener('click', function (e) {
  //   const s1coords = section1.getBoundingClientRect();
  //   console.log(s1coords);
  //   console.log(e.target.getBoundingClientRect());
  //   console.log(window.pageXOffset, window.pageYOffset);
  //   console.log(
  //     document.documentElement.clientWidth,
  //     document.documentElement.clientHeight
  //   );

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Event delegation

// 1. Add event listener to common parent element
// 2. What element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // 3. Matching
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

// tabs.forEach(tab => tab.addEventListener('click', () => console.log('TAB')));
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Remove active class
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const image = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    image.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

nav.addEventListener('mouseover', handleHover.bind('0.5'));

nav.addEventListener('mouseout', handleHover.bind('1'));

///////////////////////////////////////
// Sticky navigation
// const section1Coords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > section1Coords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

// Sticky navigation: Intersection observer API
// const obsCallback = function (entries) {
//   console.log(entries);
// entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   threshold: [0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);

// observer.observe(section1);
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const header = document.querySelector('.header');

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
});

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy loading images
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => {
  imgObserver.observe(img);
});

//  Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  // Functions
  // Dots creation
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeEnd',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const goToSlide = function (slide) {
    slides.forEach(function (s, i) {
      s.style.transform = `translateX(${100 * i - 100 * slide}%)`;
    });
  };

  // Dot activation
  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(function (dot) {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Next slide
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    // To move to slide 1: -100%, 0%, 100%, 200% => -100% => -(100 * 1)
    goToSlide(curSlide);
    // To move to slide 2: -200%, -100%, 0%, 100% => -200% => -(100 * 2)
    // To move to slide 3: -300%, -200%, -100%, 0% => -300% => -(100 * 3)

    activateDot(curSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);

    activateDot(curSlide);
  };

  const init = function () {
    // When at slide 0: 0%, 100%, 200%, 300%
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);

      activateDot(slide);
    }
  });
};
slider();
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
// Lectures

// Creating and inserting elements

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// console.log(message);
// const header = document.querySelector('.header');
// header.prepend(message);
// header.before(message.cloneNode(true));
// header.append(message);
// header.after(message);
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
// });

// message.style.backgroundColor = '#37383d';
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
// console.log(message.style.height);
// console.log(getComputedStyle(message).height);

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// console.log(document.querySelector('.btn--show-modal').href);
// console.log(document.querySelector('.btn--show-modal').getAttribute('href'));

// const h1 = document.querySelector('h1');

// const alertH1 = function () {
//   alert('test1');
//   h1.removeEventListener('click', alertH1);
// };

// h1.addEventListener('click', alertH1);

// setTimeout(() => h1.removeEventListener('click', alertH1), 3000);

// h1.addEventListener('click', function () {
//   alert('test2');
// });

// rgb(255,255,255)

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = function () {
//   return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// };

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// });
// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log(e.target, e.currentTarget);
//   },
//   true
// );

// const h1 = document.querySelector('h1');

// Going downwards: child elements
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'red';
// h1.lastElementChild.style.color = 'red';

// Going upwards: parent element
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// const htmlElement = document.documentElement;
// console.log(htmlElement.parentNode);
// console.log(htmlElement.parentElement);
// h1.closest('.header').style.background = 'rgb(10, 150, 55)';

// Going sideways: sibling elements
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function (el) {
//   if (el != h1) el.style.transform = 'scale(0.5)';
// });

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML document parsed. DOM built.', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('complete webpage loaded', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.returnValue = '';
// });
