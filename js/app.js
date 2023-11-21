const generatePDF = () => {
    let htmlElement = document.getElementById('forPDF')
    html2canvas(htmlElement).then(canvas => {
        let pdf = new jsPDF();
        pdf.text(`Price: ${document.getElementById('price').innerText} ₸`, 15, 10)
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 15);
        pdf.save("price.pdf");
    });
}
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

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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

const validateNumberInput = (input) => {
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 6) {
        input.value = input.value.slice(0, 6);
    }
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
let firstPrice, puttyPrice = 0;
const getPrice = async () => {
    if (document.getElementById('calculate-input').value) {
        try {
            const response = await fetch(`https://polaredgeback-production.up.railway.app/price/${document.getElementById('calculate-input').value}`)
            const data = await response.json();
            const price = document.getElementById('price')
            const matsPrice = document.getElementById('mats-price').querySelector('.price');
            const detailsButton = document.querySelector('.btn-details');
            const formattedPrice = formatNumber(data.result - data.putty);
            firstPrice = data.result - data.putty;
            puttyPrice = data.putty;
            price.innerText = `~${formattedPrice} ₸`;
            matsPrice.innerText = `${formatNumber(data.mats)} ₸`
            detailsButton.style.display = 'block'; // Show the button
        } catch (error) {
            console.error(error);
        }
    }
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

let lastScrollTop = 0;
const header = document.querySelector('.header-edge');
window.addEventListener('scroll', () => {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        header.classList.add('header-none');
        header.classList.remove('fixed-header');
        header.classList.remove('top-header');
    } else {
        header.classList.remove('header-none');
        header.classList.add('fixed-header');
    }
    if (scrollTop===0){
        header.classList.remove('header-none');
        header.classList.add('top-header')
    }

    lastScrollTop = scrollTop;
})
// const showAnim = gsap.from('.header-edge', {
//     yPercent: -100,
//     paused: true,
//     duration: 0.2
// }).progress(1);

// ScrollTrigger.create({
//     start: "top top",
//     end: 99999,
//     onUpdate: (self) => {
//         if (window.innerWidth > 768) {
//             const isAtTop = window.scrollY === 0;
//             window.addEventListener('scroll', () => {
//                 const container = document.querySelector('.header-edge');
//
//                 if (isAtTop) {
//                     container.classList.add('top-header')
//                 }
//             });
//
//             const container = document.querySelector('.header-edge');
//             if (self.direction === -1) {
//                 showAnim.play();
//                 container.classList.add('fixed-header');
//             } else {
//                 showAnim.reverse();
//                 container.classList.remove('fixed-header');
//                 container.classList.remove('top-header')
//             }
//         } else {
//             const container = document.querySelector('.header-edge');
//             container.classList.remove('fixed-header');
//         }
//     }
// });
let hotWaterCheckboxChecked = false;
let puttyCheckboxChecked = false;
let machinePrice = parseInt(document.getElementById('ice-machine-price')?.innerText.replace(/[^0-9]/g, ''), 10)
document.getElementById('hot-water')?.addEventListener('change', (event) => {
    if (event.target.checked) {
        hotWaterCheckboxChecked = true
        if (puttyCheckboxChecked) {
            document.getElementById('price').innerText = `~${formatNumber(Math.floor((firstPrice - machinePrice) + machinePrice * 1.45 + puttyPrice))} ₸`
        } else {
            document.getElementById('price').innerText = `~${formatNumber(Math.floor((firstPrice - machinePrice) + machinePrice * 1.45))} ₸`
        }
    } else {
        hotWaterCheckboxChecked = false;
        if (puttyCheckboxChecked) {
            document.getElementById('price').innerText = `~${formatNumber(Math.floor(firstPrice + puttyPrice))} ₸`
        } else {
            document.getElementById('price').innerText = `~${formatNumber(firstPrice)} ₸`
        }
    }
})

document.getElementById('putty')?.addEventListener('change', (event) => {
    if (event.target.checked) {
        puttyCheckboxChecked = true;
        if (hotWaterCheckboxChecked) {
            document.getElementById('price').innerText = `~${formatNumber(Math.floor((firstPrice - machinePrice) + machinePrice * 1.45 + 400000))} ₸`
        } else {
            document.getElementById('price').innerText = `~${formatNumber(Math.floor(firstPrice + puttyPrice))} ₸`
        }
    } else {
        puttyCheckboxChecked = false;
        if (hotWaterCheckboxChecked) {
            document.getElementById('price').innerText = `~${formatNumber(Math.floor((firstPrice - machinePrice) + machinePrice * 1.45))} ₸`
        } else {
            document.getElementById('price').innerText = `~${formatNumber(firstPrice)} ₸`
        }
    }
})
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
        scrub: 1,
        pin: true,
        end: "+=1500",

    }
});
tl.to(".slider-progress-1", {
    autoAlpha: 0,
    pin: true

})

tl.from(".slider-progress-2", {
    autoAlpha: 0,
    y: 50,
})
tl.to(".slider-progress-2", {
    autoAlpha: 0,

})
tl.from(".slider-progress-3", {
    autoAlpha: 0,
    y: 50,

});


// FAQs JS Alim
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


// Swiper JS Alim
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

$(document).ready(function () {
    $("#phone").on("input", function () {
        var currentInput = $(this).val();
        if (!currentInput.startsWith("+7")) {
            $(this).val("+7 " + currentInput);
        }
    });
});

const navigationBtn = document.querySelector('.nav-btn');
const body = document.querySelector('.app');
navigationBtn.addEventListener("click", () => {
    navigationBtn.classList.toggle('active');
    header.classList.toggle('active');
    body.classList.toggle('open');
})
document.getElementById('calculate-btn')?.addEventListener('click', () => {
    getPrice();
})

document.querySelector('.btn-details')?.addEventListener('click', () => {
    document.querySelector('.more-details').classList.toggle('active')
    const isActive = document.querySelector('.more-details').classList.contains('active');
    document.querySelector('.btn-details').innerText = isActive ? "Скрыть детали" : "Раскрыть детали"
})


// Video JS Alim
const videos = gsap.utils.toArray('.video-main')

videos?.forEach(function (video, i) {

    ScrollTrigger.create({
        trigger: ".appVideos",
        scroller: video,
        start: 'top center',
        end: 'bottom center',
        markers: true,
        onEnter: () => video.play(),
        onEnterBack: () => video.play(),
        onLeave: () => video.pause(),
        onLeaveBack: () => video.pause(),
    });

})

// Video JS Alim
$(".bore-card .btn-bore").click(function () {
    $(".bore-card .btn-bore").removeClass("active").eq($(this).index()).addClass("active");
    $(".card-info").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");

