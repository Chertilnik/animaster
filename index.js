addListeners();

function addListeners() {
    let heartBeatingAnimation = null;
    let moveAndHideAnimation = null;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 1000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideAnimation = animaster().moveAndHide(block, 1000);
            moveAndHideAnimation.play();
        });
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            if (moveAndHideAnimation) {
                moveAndHideAnimation.stop();
            }
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingAnimation = animaster().heartBeating(block);
            heartBeatingAnimation.play();
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
           if (heartBeatingAnimation) {
               heartBeatingAnimation.stop();
           }
        });

}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */

function animaster() {
    return {
        resetfadeIn(element) {
            element.classList.remove('show');
            element.style.transitionDuration = null;
        },

        resetfadeOut(element) {
            element.classList.remove('hide');
            element.style.transitionDuration = null;
        },
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        },
        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide(element, duration) {
            const animasterblablablabla = this;
            return {
                play() {
                    element.style.transitionDuration = `${duration * 0.4}ms`;
                    element.style.transform = getTransform({x: 100, y: -20})
                    animasterblablablabla.fadeOut(element, duration * 0.6);
                },
                stop() {
                    animasterblablablabla.resetMoveAndScale(element);
                    animasterblablablabla.resetfadeOut(element);
                }
            }

        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration * 1 / 3);
            setTimeout(() => {
                this.fadeOut(element, duration * 1.3);
            }, duration * 1 / 3);
        },

        heartBeating(element) {
            const animasterblablabla = this;
            return { intervalId: null,
                    play() {
                    this.intervalId = setInterval(() => {
                        animasterblablabla.scale(element, 500, 1.4);
                        setTimeout(() => {
                            animasterblablabla.scale(element, 500, 1);
                        }, 500);

                    }, 1500)
                },
                stop() {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
            }


        }
    }
}


function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
