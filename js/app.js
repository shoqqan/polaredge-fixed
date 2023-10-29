function extractBaseURL(url) {
    const anchor = document.createElement('a');
    anchor.href = url;
    return `${anchor.protocol}//${anchor.host}/`;
}

let URL = window.location.href.includes("localhost") ? extractBaseURL(window.location.href) : "https://shoqqan.github.io/";
const changeURL = (url) => {
    window.location.href = URL + url;
}
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
//   const cards = gsap.utils.toArray('.advantage__card');
//   ScrollTrigger.create({
//     pin: ".advantages"
//
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
            question.classList.toggle('question__active')
            button.classList.toggle('button__active')
        });
    });
});


const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: true,

    pagination: {
        el: '.swiper-pagination',
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    scrollbar: {
        el: '.swiper-scrollbar',
    },
});

if (document.getElementById('application_form')) {
    const formElement = document.getElementById('application_form');
    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formElement);
        const name = formData.get('name');
        const select = formData.get('select');
        const phone = formData.get('phone');
        const comments = formData.get('comments');
        postData("http://localhost:3000/mail", {name, select, phone, comments})
    });
}
