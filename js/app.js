// ScrollSmoother.create({
//     wrapper: '.smoother-wrapper',
//     content: '.smoother-content',
//     smooth: 1.5,
//     effects: true
// })

const formValidate = (form) => {
    let error = 0;
    let formReq = document.querySelectorAll("._req")
    formReq.forEach((el) => {
        const input = el;
        formRemoveError(input)
        if (input.id === 'name') {
            if (!validateName(input)) {
                formAddError(input)
                error++
            }
        } else if (input.id === "phone") {
            if (!validatePhone(input)) {
                formAddError(input)
                error++
            }
        }
    })
    return error
}

const formAddError = (input) => {
    input.previousElementSibling.classList.add('error')
    input.classList.add('error')
}

const formRemoveError = (input) => {
    input.previousElementSibling.classList.remove('error')
    input.classList.remove('error')
}
const validateName = (input) => {
    return /^[a-zA-Zа-яА-ЯёЁ\s'\-]+$/u.test(input.value);
}

const validatePhone = (input) => {
    return /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}/.test(input.value)
}
const extractBaseURL = (url) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    return `${anchor.protocol}//${anchor.host}/`;
}

const changeURL = (url) => {
    window.location.href = window.location.href.includes("localhost") ? extractBaseURL(window.location.href) + "polaredge/" + url : "https://shoqqan.github.io/polaredge-fixed/" + url;
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
    }).then(() => {
        document.getElementById("formButton").style.backgroundColor = "green"
        document.getElementById("formButton").innerText = "Ваша заявка принята!"
        document.getElementById("application_form").reset()
        setTimeout(() => {
            document.getElementById("formButton").style.backgroundColor = "#118DF0"
            document.getElementById("formButton").innerText = "Оставить заявку!"
        }, 3000)

    });
    return response.json();
}
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);


const showAnim = gsap.from('.header-edge', {
    yPercent: -100,
    paused: true,
    duration: 0.2
}).progress(1);

ScrollTrigger.create({
    start: "top top",
    end: 99999,
    onUpdate: (self) => {
        const container = document.querySelector('.header-edge');
        if (self.direction === -1) {
            showAnim.play();
            container.classList.add('fixed-header');  // добавить класс при прокрутке вверх
        } else {
            showAnim.reverse();
            container.classList.remove('fixed-header');
            container.classList.remove('top-header')
            // удалить класс при прокрутке вниз
        }
    }
});
window.addEventListener('scroll', () => {
    const container = document.querySelector('.header-edge');
    const isAtTop = window.scrollY === 0;

    if (isAtTop) {
        container.classList.add('top-header')
    }
});


const blocks = document?.querySelectorAll(".card-item");
const panelsContainer = document.querySelector(".card-swipe");

blocks.forEach((block, index) => {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: panelsContainer,
            start: "top bottom",
            end: "top top",
            snap: 0.5,
            scrub: true,
        },
    });

    timeline.fromTo(
        panelsContainer,
        {
            opacity: 0.5,
            scale: 1.08,
        },
        {
            opacity: 1,
            scale: 1,
        }
    );

    timeline.to(blocks[index - 1], {
        // filter: "blur(24px)",
        scrollTrigger: {
            trigger: block,
            start: "top 200px",
            end: "top top",
            scrub: true,
        },
    });
});


let tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".how-it-work",
        toggleActions: "restart complete reverse resume",
        start: "top top",
        scrub: 0.2,
        pin: true,
        end: "+=1600",
    }
});
tl.to(".slider-progress-1", {
    autoAlpha: 0,
    // y:50
    // y:-50
    // delay:2
})
tl.from(".slider-progress-2", {
    autoAlpha: 0,
    y: 50,
    // yPercent: 100


})
tl.to(".slider-progress-2", {
    autoAlpha: 0,
})
tl.from(".slider-progress-3", {
    autoAlpha: 0,
    y: 50,
})


// FAQs

const accordionBtns = document.querySelectorAll(".faq-collapse");

accordionBtns.forEach((accordion) => {
    accordion.onclick = function () {
        this.classList.toggle("is-open");

        let content = this.nextElementSibling;
        console.log(content);

        if (content.style.maxHeight) {
            //this is if the accordion is open
            content.style.maxHeight = null;
        } else {
            //if the accordion is currently closed
            content.style.maxHeight = content.scrollHeight + "px";
            console.log(content.style.maxHeight);
        }
    };
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

const mapOverlay = document.getElementById("mapOverlay");
mapOverlay.addEventListener("click", function () {
    mapOverlay.style.display = "none"
});


if (document.getElementById('application_form')) {
    const formElement = document.getElementById('application_form');
    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        let error = formValidate(formElement)
        if (error === 0) {
            const formData = new FormData(formElement);
            const name = formData.get('name');
            const select = formData.get('select');
            const phone = formData.get('phone');
            const comments = formData.get('comments');
            postData("https://polaredgeback-production.up.railway.app/mail", {name, select, phone, comments})
        }

    });
}

$(".bore-card .btn-bore").click(function () {
    $(".bore-card .btn-bore").removeClass("active").eq($(this).index()).addClass("active");
    $(".card-info").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");

const navigationBtn = document.querySelector('.nav-btn');
const header = document.querySelector('.header-edge');
const body = document.querySelector('.app');
navigationBtn.addEventListener("click", () => {
    navigationBtn.classList.toggle('active');
    header.classList.toggle('active');
    body.classList.toggle('open');
})