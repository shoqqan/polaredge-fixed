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
gsap.registerPlugin(ScrollTrigger,ScrollSmoother);


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
            container.classList.remove('fixed-header');  // удалить класс при прокрутке вниз
        }
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
        filter: "blur(24px)",
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


// Создание движка
const engine = Matter.Engine.create();
const world = engine.world;

const tags = document.querySelectorAll('.tag');
const container = document.querySelector('.what-in');
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;

// Создание границ (стен) контейнера
const wallOptions = {isStatic: true};
// const ground = Matter.Bodies.rectangle(0, 0, 0, 0, wallOptions);
const ground = Matter.Bodies.rectangle(containerWidth, 0, containerWidth*2, 1, wallOptions);
const leftWall = Matter.Bodies.rectangle(0, 0, 20, 160, wallOptions);
const roof = Matter.Bodies.rectangle(containerWidth, 0, containerWidth*2, 1, wallOptions);
Matter.World.add(world, [ground,leftWall,roof]);

tags.forEach(tag => {
    const {width, height} = tag.getBoundingClientRect();

    // Создание тела для каждого тега
    const body = Matter.Bodies.rectangle(
        width / 2,
        height*-1,
        width,
        height,
        {restitution: 0.8}
    );

    Matter.World.add(world, [body]);
    Matter.World.add(world, [ground, leftWall]);

    // Обновление позиции DOM-элемента на основе физической модели
    Matter.Events.on(engine, 'afterUpdate', function () {
        tag.style.transform = `translate(${body.position.x - width / 2}px, ${body.position.y - height / 2}px)`;
    });

    tag.addEventListener('mouseenter', () => {
        Matter.Body.applyForce(body, {x: 0, y: 0}, {x: 0, y: -0.15});
    });
});

// Запуск движка
Matter.Engine.run(engine);

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
