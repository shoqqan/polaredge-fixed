function extractBaseURL(url) {
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
    });
    return response.json();
}

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

gsap.registerPlugin(ScrollTrigger);

const blocks = document?.querySelectorAll(".card-item");
const panelsContainer = document.querySelector(".card-swipe");

blocks.forEach((block, index) => {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: panelsContainer,
            start: "top bottom",
            end: "top top",
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
const wallOptions = { isStatic: true };
const ground = Matter.Bodies.rectangle(containerWidth / 2, containerHeight, containerWidth, 10, wallOptions);
const roof = Matter.Bodies.rectangle(containerWidth / 2, 0, containerWidth, 10, wallOptions);
const leftWall = Matter.Bodies.rectangle(0, containerHeight / 2, 10, containerHeight, wallOptions);
const rightWall = Matter.Bodies.rectangle(containerWidth, containerHeight / 2, 10, containerHeight, wallOptions);
Matter.World.add(world, [ground, roof, leftWall, rightWall]);

tags.forEach(tag => {
    const { width, height } = tag.getBoundingClientRect();

    // Создание тела для каждого тега
    const body = Matter.Bodies.rectangle(
        tag.offsetLeft + width / 2,
        -height,
        width,
        height,
        { restitution: 0.7 }
    );

    Matter.World.add(world, [body]);

    // Обновление позиции DOM-элемента на основе физической модели
    Matter.Events.on(engine, 'afterUpdate', function() {
        tag.style.transform = `translate(${body.position.x - width / 2}px, ${body.position.y - height / 2}px)`;
    });

    tag.addEventListener('mouseenter', () => {
        Matter.Body.applyForce(body, { x: 0, y: 0 }, { x: 0, y: -0.15 });
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
