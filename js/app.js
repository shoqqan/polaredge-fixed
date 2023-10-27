const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}
// if (ScrollTrigger.isTouch !== 1) {
//   gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
//   ScrollSmoother.create({
//     wrapper: '.wrapper',
//     content: '.content',
//     smooth: 1.5,
//     effects: true
//   })
//   //scrolltrigger for advantages   
//   const cards = gsap.utils.toArray('.advantage__card');
//   ScrollTrigger.create({
//     pin: ".advantages"

//   })
//   cards.forEach((card, index) => {
//     gsap.to(card, {
//       yPercent: -100 * index,
//       ease: 'none',
//       scrollTrigger: {
//         trigger: card,
//         start: 'bottom bottom',
//         end: 'center center',
//         scrub: 1, 
//       },
//     });
//   });
// }

document.addEventListener('DOMContentLoaded', function () {
  const questions = document.querySelectorAll('.question');

  questions.forEach((question) => {
    const button = question.querySelector('.question__button');

    button.addEventListener('click', function () {
      question.classList.toggle('question__active');
    });
  });
});


const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

const formElement = document.getElementById('application_form'); // извлекаем элемент формы
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(formElement); // создаём объект FormData, передаём в него элемент формы
  // теперь можно извлечь данные
  const name = formData.get('name'); // 'John'
  const select = formData.get('select'); // 'Smith'
  const phone = formData.get('phone');
  const comments = formData.get('comments');
  postData("http://localhost:3000/mail", { name, select, phone, comments })
});