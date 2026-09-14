document.addEventListener("DOMContentLoaded", function () {

    const nav = document.getElementById("nav");
    const menuButton = document.getElementById("menuButton");

    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    const year = document.getElementById("year");

    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");


    /* ---------- Footer Year ---------- */

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* ---------- Mobile Menu ---------- */

    function closeMenu() {

        if (!nav) {
            return;
        }

        nav.classList.remove("open");

        if (menuButton) {
            menuButton.setAttribute("aria-expanded", "false");
        }
    }


    if (menuButton && nav) {

        menuButton.addEventListener("click", function () {

            const isOpen = nav.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });

    }


    /* ---------- Smooth Navigation ---------- */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const href = link.getAttribute("href");

            if (!href || href === "#") {
                return;
            }

            const target = document.querySelector(href);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            closeMenu();

        });

    });


    /* ---------- Close Mobile Menu ---------- */

    document.addEventListener("click", function (event) {

        if (!nav || !menuButton) {
            return;
        }

        if (!nav.classList.contains("open")) {
            return;
        }

        if (
            nav.contains(event.target) ||
            menuButton.contains(event.target)
        ) {
            return;
        }

        closeMenu();

    });


    /* ---------- Active Navigation Link ---------- */

    if (navLinks.length && sections.length) {

        window.addEventListener("scroll", function () {

            let currentId = sections[0].id;

            const offset = window.scrollY + 120;

            sections.forEach(function (section) {

                if (section.offsetTop <= offset) {
                    currentId = section.id;
                }

            });

            navLinks.forEach(function (link) {

                const isCurrent =
                    link.getAttribute("href") === "#" + currentId;

                link.classList.toggle(
                    "is-active",
                    isCurrent
                );

            });

        });

    }


    /* ---------- Contact Form ---------- */

    if (form && formMessage) {

        const nameField = document.getElementById("name");
        const phoneField = document.getElementById("phone");
        const messageField = document.getElementById("message");


        function clearInvalid() {

            [nameField, phoneField, messageField].forEach(
                function (field) {

                    if (field) {
                        field.classList.remove("invalid");
                    }

                }
            );

        }


        form.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!nameField || !phoneField || !messageField) {
                return;
            }

            clearInvalid();

            const name = nameField.value.trim();
            const phone = phoneField.value.trim();
            const message = messageField.value.trim();


            if (!name) {

                nameField.classList.add("invalid");

                formMessage.textContent =
                    "Please enter your name.";

                nameField.focus();

                return;
            }


            const digits = phone.replace(/\D/g, "");


            if (digits.length < 10) {

                phoneField.classList.add("invalid");

                formMessage.textContent =
                    "Please enter a valid contact number with at least 10 digits.";

                phoneField.focus();

                return;
            }


            if (message.length < 5) {

                messageField.classList.add("invalid");

                formMessage.textContent =
                    "Please write a short message.";

                messageField.focus();

                return;
            }


            formMessage.textContent =
                "Thank you, " + name +
                ". Your message has been recorded. " +
                "We will get back to you soon.";

            form.reset();

        });


        [nameField, phoneField, messageField].forEach(
            function (field) {

                if (field) {

                    field.addEventListener(
                        "input",
                        function () {

                            field.classList.remove("invalid");

                        }
                    );

                }

            }
        );

    }


    /* =====================================================
       CONTINUOUS CUSTOMER REVIEW SCROLLING
       ===================================================== */

    const reviewsWrapper =
        document.querySelector(".reviews-wrapper");

    const reviewsGrid =
        document.querySelector(".reviews-grid");


    if (reviewsWrapper && reviewsGrid) {

        let isPaused = false;
        let position = 0;
        let lastTime = performance.now();

        /* Scrolling speed in pixels per second */
        const speed = 35;


        function scrollReviews(currentTime) {

            const elapsed =
                (currentTime - lastTime) / 1000;

            lastTime = currentTime;


            if (!isPaused) {

                position += speed * elapsed;


                const maxScroll =
                    reviewsWrapper.scrollWidth -
                    reviewsWrapper.clientWidth;


                if (maxScroll > 0) {

                    if (position >= maxScroll) {
                        position = 0;
                    }

                    reviewsWrapper.scrollLeft =
                        Math.round(position);

                }

            }


            requestAnimationFrame(scrollReviews);

        }


        /* Start continuous scrolling */

        requestAnimationFrame(scrollReviews);


        /* Stop when cursor is over the review cards */

        reviewsWrapper.addEventListener(
            "mouseenter",
            function () {

                isPaused = true;

            }
        );


        /* Continue when cursor leaves */

        reviewsWrapper.addEventListener(
            "mouseleave",
            function () {

                isPaused = false;

                position =
                    reviewsWrapper.scrollLeft;

                lastTime =
                    performance.now();

            }
        );

    }

});
