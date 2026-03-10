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
            if (heartBeatingAnimation) {
                heartBeatingAnimation.stop();
            }
        });
    document.getElementById('abobaPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('abobaBlock');

            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);

            customAnimation.play(block);
        });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */

function animaster() {
    const _steps = [];

    const animasterInstance = {
        _steps: _steps,

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

        addMove(duration, translation) {
            this._steps.push({
                name: 'move',
                duration: duration,
                params: {translation: translation},
            });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration: duration,
                params: {ratio: ratio},
            });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({
                name: 'fadeIn',
                duration: duration,
                params: {}
            });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({
                name: 'fadeOut',
                duration: duration,
                params: {}
            });
            return this;
        },

        play(element, cycled = false) {
            const steps = [...this._steps];
            const timers = [];
            const animasterInstance = this;
            let isStopped = false;

            const executeStep = (stepIndex, delay) => {
                if (isStopped) return;

                const timer = setTimeout(() => {
                    if (isStopped) return;

                    const step = steps[stepIndex];

                    switch (step.name) {
                        case 'move':
                            animasterInstance.move(element, step.duration, step.params.translation);
                            break;
                        case 'scale':
                            animasterInstance.scale(element, step.duration, step.params.ratio);
                            break;
                        case 'fadeIn':
                            animasterInstance.fadeIn(element, step.duration);
                            break;
                        case 'fadeOut':
                            animasterInstance.fadeOut(element, step.duration);
                            break;
                        case 'delay':
                            break;
                    }

                    if (!isStopped) {
                        if (stepIndex < steps.length - 1) {
                            executeStep(stepIndex + 1, delay + step.duration);
                        } else if (cycled) {
                            // Сбрасываем только transform, но не удаляем классы show/hide
                            element.style.transform = null;
                            executeStep(0, delay + step.duration);
                        }
                    }
                }, delay);

                timers.push(timer);
            };

            executeStep(0, 0);

            if (!cycled) {
                this._steps = [];
            }

            return {
                stop: () => {
                    isStopped = true;
                    timers.forEach(timer => clearTimeout(timer));
                    timers.length = 0;
                    animasterInstance.resetAnimation(element);
                }
            };
        },

        resetAnimation(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
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
                    const animation = animasterblablablabla.
                        addMove(duration * 0.4, {x: 100, y: -20})
                        .addFadeOut(duration * 0.6);

                    animation.play(element);

                },
                stop() {
                    animasterblablablabla.resetMoveAndScale(element);
                    animasterblablablabla.resetfadeOut(element);
                }
            }

        },

        showAndHide(element, duration) {
            const animation = this.
            addFadeIn(duration * 1/3)
                .addDelay(duration * 1/3)
                .addFadeOut(duration * 1/3);

            animation.play(element);
        },

        heartBeating(element) {
            const animasterblablabla = this;
            let currentAnimation = null;

            return {
                intervalId: null,
                play() {
                    const animation = animasterblablabla
                        .addScale(500, 1.4)
                        .addScale(500, 1);

                    currentAnimation = animation.play(element, true);
                },
                stop() {
                    if (currentAnimation && currentAnimation.stop) {
                        currentAnimation.stop();
                    }
                    animasterblablabla.resetMoveAndScale(element);
                }
            }
        },

        addDelay(duration) {
            this._steps.push({
                name: 'delay',
                duration: duration,
                params: {}
            });
            return this;
        }
    }

    return animasterInstance;
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
