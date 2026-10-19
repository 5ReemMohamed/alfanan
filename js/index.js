(() => {
    "use strict";

    const init = () => {
        const $ = (selector, parent = document) =>
            parent.querySelector(selector);

        const $$ = (selector, parent = document) =>
            [...parent.querySelectorAll(selector)];

        const formatPrice = (price) =>
            `${Number(price).toLocaleString("ar-EG")} جنيه`;

        const whatsappNumber = "+966545953908";

        const brandingData = [
            {
                title: "تصميم شعار",
                description: "نصمم شعارًا مميزًا يعكس شخصية علامتك التجارية ويمنحها حضورًا واضحًا.",
                price: 1500,
                icon: "fa-pen-nib"
            },
            {
                title: "تصميم لوجو",
                description: "أفكار بصرية مبتكرة وتنفيذ احترافي لشعار يناسب نشاطك.",
                price: 1200,
                icon: "fa-palette"
            },
            {
                title: "هوية بصرية",
                description: "هوية بصرية متكاملة تشمل الألوان والخطوط والتطبيقات الأساسية.",
                price: 3500,
                icon: "fa-swatchbook"
            },
            {
                title: "طباعة الكروت الشخصية",
                description: "كروت شخصية أنيقة بخامات وتشطيبات عالية الجودة.",
                price: 500,
                icon: "fa-id-card"
            },
            {
                title: "تصميم وطباعة بروفايل",
                description: "بروفايل تعريفي يعرض خدمات شركتك ومميزاتها بصورة احترافية.",
                price: 2000,
                icon: "fa-book-open"
            },
            {
                title: "طباعة ورق المراسلات",
                description: "أوراق مراسلات رسمية تحمل هويتك التجارية.",
                price: 750,
                icon: "fa-file-lines"
            },
            {
                title: "طباعة الأظرف",
                description: "أظرف مطبوعة بهوية شركتك بتنسيق أنيق.",
                price: 600,
                icon: "fa-envelope"
            },
            {
                title: "سندات قبض وصرف",
                description: "نماذج مالية مطبوعة بوضوح للاستخدام اليومي.",
                price: 450,
                icon: "fa-file-invoice"
            },
            {
                title: "تنفيذ الأختام",
                description: "أختام عملية بتفاصيل واضحة للاستخدام المكتبي والرسمي.",
                price: 300,
                icon: "fa-stamp"
            }
        ];

        const extraGalleries = {
            gifts: {
                title: "الهدايا والدروع",
                tabs: "giftsTabs",
                track: "giftsTrack",
                items: [
                    ["درع فاخر صندوق أكريليك", "درع فاخر مناسب للتكريم والمناسبات الرسمية.", "images/category-1.jpg", 1800],
                    ["مجسم سيف مع درع", "مجسم تذكاري يجمع بين السيف والدرع.", "images/category-1.jpg", 2200],
                    ["مجسم حصان نحاس", "مجسم حصان نحاسي بطابع فاخر.", "images/category-1.jpg", 2500],
                    ["مجسم علم مع درع", "درع تذكاري للمؤسسات والفعاليات.", "images/category-1.jpg", 1600],
                    ["درع نحاس", "درع نحاسي بتشطيب أنيق قابل للتخصيص.", "images/category-1.jpg", 1400],
                    ["أوسمة تذكارية", "أوسمة للتكريم والاحتفالات الرسمية.", "images/category-1.jpg", 250],
                    ["درع كريستال مع خشب", "مزيج أنيق من الكريستال والخشب.", "images/category-1.jpg", 1200],
                    ["درع كريستال", "درع كريستالي لتكريم الموظفين والشخصيات المميزة.", "images/category-1.jpg", 900],
                    ["دروع أكريليك تصنيع", "دروع أكريليك بتصاميم ومقاسات حسب الطلب.", "images/category-1.jpg", 650],
                    ["دروع جلد", "دروع بلمسات جلدية أنيقة للمناسبات الرسمية.", "images/category-1.jpg", 1100]
                ]
            },

            banners: {
                title: "البنرات والاستيكرات",
                tabs: "bannersTabs",
                track: "bannersTrack",
                items: [
                    ["طباعة البنرات والاستيكرات", "طباعة إعلانية بمقاسات وخامات متنوعة.", "images/category-1.jpg", 180],
                    ["طباعة UV على المنتجات", "طباعة UV وفق الخامة والتصميم.", "images/category-1.jpg", 350],
                    ["استيكر على السيارات", "استيكرات سيارات لإبراز الهوية التجارية.", "images/category-1.jpg", 1200],
                    ["ستاند بوب أب", "ستاندات مناسبة للمعارض والفعاليات.", "images/category-1.jpg", 2800],
                    ["ستاند رول أب", "ستاند عملي وسهل النقل للاستخدامات الإعلانية.", "images/category-1.jpg", 1200],
                    ["قص استيكرات", "قص الاستيكرات حسب المقاسات المطلوبة.", "images/category-1.jpg", 150],
                    ["استيكر الجدران", "استيكرات جدارية للديكورات والمساحات التجارية.", "images/category-1.jpg", 250],
                    ["ستاند عرض طاولة", "ستاندات صغيرة لعرض المنتجات والمطبوعات.", "images/category-1.jpg", 450],
                    ["استاندات أعلام ريش", "أعلام ريش إعلانية للواجهات والفعاليات.", "images/category-1.jpg", 950],
                    ["أعلام مكتبية", "أعلام مكتبية مطبوعة للشركات والمؤسسات.", "images/category-1.jpg", 180]
                ]
            },

            signage: {
                title: "اللوحات والحروف البارزة",
                tabs: "signageTabs",
                track: "signageTrack",
                items: [
                    ["حروف زنكور مع أكريليك", "حروف بارزة تجمع بين الزنكور والأكريليك.", "images/category-1.jpg", 1800],
                    ["حروف استانلس مضيئة", "حروف استانلس بإضاءة للواجهات التجارية.", "images/category-1.jpg", 3500],
                    ["حروف استيل فضي مضيئة", "حروف استيل فضية مضيئة بمظهر عصري.", "images/category-1.jpg", 3200],
                    ["حروف أكريليك مع بلاستيك", "حروف من الأكريليك والبلاستيك بتصاميم متنوعة.", "images/category-1.jpg", 1400],
                    ["حروف استيل ذهبي بإضاءة خلفية", "حروف ذهبية بإضاءة خلفية لمظهر فاخر.", "images/category-1.jpg", 4200],
                    ["حروف استيل في استيل", "حروف استيل بتشطيب متناسق للواجهات.", "images/category-1.jpg", 2500],
                    ["تنفيذ واجهات كلادينج", "تصميم وتنفيذ واجهات كلادينج للمحلات والمباني.", "images/category-1.jpg", 5500]
                ]
            },

            cnc: {
                title: "قص وتصنيع CNC",
                tabs: "cncTabs",
                track: "cncTrack",
                items: [
                    ["تنفيذ وقص بروشات", "تصنيع وقص بروشات بتصاميم مخصصة.", "images/category-1.jpg", 250],
                    ["تنفيذ أكريليك", "تشكيل منتجات أكريليك وفق المقاسات المطلوبة.", "images/category-1.jpg", 450],
                    ["ستاند مكتبي", "ستاندات مكتبية عملية للتعريف والعرض.", "images/category-1.jpg", 350],
                    ["قص أكريليك بمسامير", "قص ألواح الأكريليك مع تجهيزات تثبيت مناسبة.", "images/category-1.jpg", 550],
                    ["أكريليك أرقام الغرف", "أرقام غرف أكريليك للمكاتب والمنشآت.", "images/category-1.jpg", 180],
                    ["لوحات أكريليك بمسامير", "لوحات أكريليك بتثبيت أنيق.", "images/category-1.jpg", 600],
                    ["دروع خشب تصنيع", "دروع خشبية حسب التصميم والمقاس.", "images/category-1.jpg", 750]
                ]
            },

            hajj: {
                title: "تجهيزات الحج والعمرة",
                tabs: "hajjTabs",
                track: "hajjTrack",
                items: [
                    ["تغليف الباصات بالكامل", "تجهيز وطباعة ملصقات الباصات وفق الهوية المطلوبة.", "images/category-1.jpg", 8500],
                    ["شنطة الظهر", "شنط ظهر مناسبة للتوزيع والتجهيزات الموسمية.", "images/category-1.jpg", 180],
                    ["طباعة الشماسي", "شماسي مطبوعة بشعار الشركة أو الحملة.", "images/category-1.jpg", 220],
                    ["طباعة وتطريز اليونيفورم", "ملابس عمل مطبوعة أو مطرزة بهوية المؤسسة.", "images/category-1.jpg", 350],
                    ["هدايا الحجاج", "هدايا وتجهيزات قابلة للتخصيص للحجاج.", "images/category-1.jpg", 120],
                    ["بروفايل الشركات", "بروفايل تعريفي لشركات الحج والعمرة.", "images/category-1.jpg", 1800],
                    ["بنرات التوعية للحاج", "بنرات إرشادية وتوعوية لموسم الحج.", "images/category-1.jpg", 250],
                    ["اللوحات الإرشادية للمكاتب", "لوحات لتوجيه الزوار وتنظيم المكاتب.", "images/category-1.jpg", 450],
                    ["تركيب استيكرات المخيمات", "استيكرات تعريفية وإرشادية للمخيمات.", "images/category-1.jpg", 650],
                    ["لوحات المخيمات والمداخل", "لوحات تعريفية لمداخل المخيمات ومرافقها.", "images/category-1.jpg", 1200]
                ]
            }
        };

        /* أيقونات قسم الهوية والطباعة */
        const galleryIcons = [
            "fa-pen-nib",
            "fa-palette",
            "fa-swatchbook",
            "fa-address-card",
            "fa-book-open",
            "fa-file-lines",
            "fa-envelope-open-text",
            "fa-file-invoice",
            "fa-stamp"
        ];

        /* أيقونات قسم الهدايا والدروع */
        const extraGalleryIcons = {
            gifts: [
                "fa-award",
                "fa-khanda",
                "fa-horse",
                "fa-flag",
                "fa-shield-halved",
                "fa-medal",
                "fa-gem",
                "fa-diamond",
                "fa-layer-group",
                "fa-bookmark"
            ],

            /* أيقونات البنرات والاستيكرات */
            banners: [
                "fa-panorama",
                "fa-print",
                "fa-car-side",
                "fa-store",
                "fa-scroll",
                "fa-scissors",
                "fa-image",
                "fa-display",
                "fa-flag",
                "fa-flag-checkered"
            ],

            /* أيقونات اللوحات والحروف البارزة */
            signage: [
                "fa-font",
                "fa-lightbulb",
                "fa-star",
                "fa-shapes",
                "fa-sun",
                "fa-building",
                "fa-city"
            ],

            /* أيقونات قص وتصنيع CNC */
            cnc: [
                "fa-scissors",
                "fa-cubes",
                "fa-desktop",
                "fa-screwdriver-wrench",
                "fa-door-open",
                "fa-sign-hanging",
                "fa-tree"
            ],

            /* أيقونات تجهيزات الحج والعمرة */
            hajj: [
                "fa-bus",
                "fa-bag-shopping",
                "fa-umbrella",
                "fa-shirt",
                "fa-gift",
                "fa-book-open",
                "fa-person",
                "fa-signs-post",
                "fa-campground",
                "fa-kaaba"
            ]
        };

        const siteHeader = $(".site-header") || $("header");
        const backToTop = $("#backToTop");
        const year = $("#year");

        if (year) {
            year.textContent = new Date().getFullYear();
        }

        /* ==============================
           HEADER SCROLL
        ============================== */

        const updateHeader = () => {
            const scrolled = window.scrollY > 40;

            siteHeader?.classList.toggle("scrolled", scrolled);
            backToTop?.classList.toggle("show", window.scrollY > 350);
        };

        window.addEventListener("scroll", updateHeader, { passive: true });
        updateHeader();

        backToTop?.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth"
            });
        });

        /* ==============================
           NAVIGATION
        ============================== */

        const mainNav = $("#mainNav");

        $$(".navbar-nav .nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                if (mainNav?.classList.contains("show") && window.bootstrap) {
                    const instance =
                        bootstrap.Collapse.getInstance(mainNav);

                    instance?.hide();
                }
            });
        });

        /* ==============================
           HERO SLIDER
        ============================== */

        const heroSlides = $$(".hero-slide");
        const heroDots = $$(".hero-dot");
        const slideProgress = $(".slide-progress");

        let currentSlide = 0;
        let heroTimer = null;

        const showSlide = (index) => {
            if (!heroSlides.length) return;

            currentSlide =
                (index + heroSlides.length) % heroSlides.length;

            heroSlides.forEach((slide, i) => {
                const active = i === currentSlide;

                slide.classList.toggle("active", active);
                slide.setAttribute("aria-hidden", String(!active));
            });

            heroDots.forEach((dot, i) => {
                const active = i === currentSlide;

                dot.classList.toggle("active", active);
                dot.setAttribute("aria-current", active ? "true" : "false");
            });

            if (slideProgress) {
                slideProgress.style.width =
                    `${((currentSlide + 1) / heroSlides.length) * 100}%`;
            }
        };

        const startHeroTimer = () => {
            clearInterval(heroTimer);

            if (
                heroSlides.length > 1 &&
                !window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ) {
                heroTimer = setInterval(() => {
                    showSlide(currentSlide + 1);
                }, 6000);
            }
        };

        $("#nextSlide")?.addEventListener("click", () => {
            showSlide(currentSlide + 1);
            startHeroTimer();
        });

        $("#prevSlide")?.addEventListener("click", () => {
            showSlide(currentSlide - 1);
            startHeroTimer();
        });

        heroDots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showSlide(index);
                startHeroTimer();
            });
        });

        if (heroSlides.length) {
            showSlide(0);
            startHeroTimer();
        }

        /* ==============================
           GENERATE GALLERY MARKUP
        ============================== */

        const createGalleryCard = (item, index) => {
            const card = document.createElement("article");

            card.className = "gallery-card";
            card.dataset.index = index;
            card.setAttribute("tabindex", "0");
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `عرض ${item.title}`);

            const image = document.createElement("img");

            image.src = item.image || "images/category-1.jpg";
            image.alt = item.title;
            image.loading = "lazy";

            const content = document.createElement("div");
            content.className = "gallery-card-content";

            const title = document.createElement("h3");

            title.className = "gallery-card-title";
            title.textContent = item.title;

            const description = document.createElement("p");

            description.className = "gallery-card-description";
            description.textContent = item.description;

            const price = document.createElement("div");

            price.className = "gallery-card-price";
            price.textContent = `يبدأ من ${formatPrice(item.price)}`;

            const icon = document.createElement("i");

            icon.className = "fa-solid fa-arrow-up-left-from-circle";
            icon.setAttribute("aria-hidden", "true");

            content.append(title, description, price);
            card.append(image, content, icon);

            return card;
        };

        const createGalleryTab = (item, index, iconClass) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "service-tab";
            button.dataset.index = index;
            button.setAttribute("aria-selected", "false");

            const icon = document.createElement("i");

            icon.className = `fa-solid ${iconClass || "fa-star"}`;
            icon.setAttribute("aria-hidden", "true");

            const label = document.createElement("span");

            label.textContent = item.title;

            button.append(icon, label);

            return button;
        };

        const renderGallery = (track, tabs, items, iconList = []) => {
            if (track && !track.dataset.generated) {
                track.replaceChildren();

                items.forEach((item, index) => {
                    track.appendChild(createGalleryCard(item, index));
                });

                track.dataset.generated = "true";
            }

            if (tabs && !tabs.dataset.generated) {
                tabs.replaceChildren();

                items.forEach((item, index) => {
                    const iconClass = iconList.length
                        ? iconList[index % iconList.length]
                        : "fa-star";

                    tabs.appendChild(
                        createGalleryTab(item, index, iconClass)
                    );
                });

                tabs.dataset.generated = "true";
            }
        };

        const brandingSection =
            $("#branding") || $(".branding-section");

        const brandingTrack = $("#galleryTrack");

        const brandingTabs =
            $("#brandingTabs") ||
            $(".branding-section .service-tabs");

        if (brandingTrack) {
            renderGallery(
                brandingTrack,
                brandingTabs,
                brandingData,
                galleryIcons
            );
        }

        Object.entries(extraGalleries).forEach(([key, config]) => {
            const section = $(`#${key}`);

            if (!section) return;

            const track =
                $(`#${config.track}`) ||
                $(".gallery-track", section);

            const tabs =
                $(`#${config.tabs}`) ||
                $(".service-tabs", section);

            const items = config.items.map(
                ([title, description, image, price]) => ({
                    title,
                    description,
                    image,
                    price
                })
            );

            config.data = items;
            config.section = section;
            config.galleryTrack = track;
            config.galleryTabs = tabs;

            renderGallery(
                track,
                tabs,
                items,
                extraGalleryIcons[key] || []
            );
        });

        /* ==============================
           MODAL ELEMENTS
        ============================== */

        const modal = $("#imageModal");
        const modalImg = $("#modalImg");
        const modalTitle = $("#modalTitle");
        const modalDesc = $("#modalDesc");
        const modalPrice = $("#modalPrice");
        const modalCount = $("#modalCount");
        const modalWhatsapp = $("#modalWhatsapp");
        const closeModalButton = $("#close");
        const modalPrev = $("#modalPrev");
        const modalNext = $("#modalNext");

        let activeGallery = null;
        let modalIndex = 0;
        let previousFocus = null;

        const getModalPriceElement = () => {
            if (!modalPrice || !modal) return null;

            let element = modalPrice;

            if (element.tagName === "INPUT") {
                element = element.parentElement;
            }

            return element;
        };

        const updateModal = () => {
            if (!activeGallery) return;

            const items = activeGallery.data;
            const item = items[modalIndex];

            if (!item) return;

            const card = activeGallery.cards[modalIndex];
            const image = card ? $("img", card) : null;

            if (modalImg) {
                modalImg.src =
                    image?.src ||
                    item.image ||
                    "images/category-1.jpg";

                modalImg.alt = item.title;
            }

            if (modalTitle) {
                modalTitle.textContent = item.title;
            }

            if (modalDesc) {
                modalDesc.textContent = item.description;
            }

            const priceElement = getModalPriceElement();

            if (priceElement) {
                priceElement.textContent =
                    `يبدأ من ${formatPrice(item.price)}`;

                priceElement.hidden = false;
            }

            if (modalCount) {
                modalCount.textContent =
                    `${String(modalIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
            }

            activeGallery.cards.forEach((galleryCard, index) => {
                galleryCard.classList.toggle(
                    "active",
                    index === modalIndex
                );
            });

            activeGallery.tabs.forEach((tab, index) => {
                const selected = index === modalIndex;

                tab.classList.toggle("active", selected);
                tab.setAttribute("aria-selected", String(selected));
            });

            if (activeGallery.current) {
                activeGallery.current.textContent =
                    String(modalIndex + 1).padStart(2, "0");
            }

            if (activeGallery.progress) {
                activeGallery.progress.style.width =
                    `${((modalIndex + 1) / items.length) * 100}%`;
            }

            if (modalWhatsapp) {
                const message = [
                    "مرحبًا، أريد الاستفسار عن المنتج التالي:",
                    `المنتج: ${item.title}`,
                    `السعر المبدئي: ${formatPrice(item.price)}`,
                    `التفاصيل: ${item.description}`
                ].join("\n");

                modalWhatsapp.href =
                    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

                modalWhatsapp.target = "_blank";
                modalWhatsapp.rel = "noopener noreferrer";
            }
        };

        const openModal = (gallery, index) => {
            if (!modal || !gallery?.data?.length) return;

            activeGallery = gallery;

            modalIndex = Math.max(
                0,
                Math.min(index, gallery.data.length - 1)
            );

            previousFocus = document.activeElement;

            updateModal();

            modal.classList.add("open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");

            closeModalButton?.focus();

            if (window.gsap) {
                window.gsap.fromTo(
                    $(".modal-content", modal) || modal,
                    {
                        opacity: 0,
                        y: 20,
                        scale: 0.98
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    }
                );
            }
        };

        const closeModal = () => {
            if (!modal) return;

            modal.classList.remove("open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");

            if (
                previousFocus &&
                typeof previousFocus.focus === "function"
            ) {
                previousFocus.focus();
            }
        };

        const moveModal = (direction) => {
            if (!activeGallery?.data?.length) return;

            modalIndex =
                (
                    modalIndex +
                    direction +
                    activeGallery.data.length
                ) % activeGallery.data.length;

            updateModal();
        };

        closeModalButton?.addEventListener("click", closeModal);

        modalPrev?.addEventListener("click", () => {
            moveModal(-1);
        });

        modalNext?.addEventListener("click", () => {
            moveModal(1);
        });

        $$("[data-close]", modal || document).forEach((element) => {
            element.addEventListener("click", (event) => {
                if (
                    event.target === element ||
                    event.target.closest("[data-close]")
                ) {
                    closeModal();
                }
            });
        });

        modal?.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (!modal?.classList.contains("open")) return;

            if (event.key === "Escape") {
                closeModal();
            }

            if (event.key === "ArrowLeft") {
                moveModal(1);
            }

            if (event.key === "ArrowRight") {
                moveModal(-1);
            }

            if (event.key === "Tab") {
                const focusable = $$(
                    'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
                    modal
                ).filter((element) => element.offsetParent !== null);

                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (
                    event.shiftKey &&
                    document.activeElement === first
                ) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });

        /* ==============================
           GALLERY ENGINE
        ============================== */

        const galleries = [];

        const setupGallery = (config) => {
            const section = config.section;

            if (!section) return null;

            const track =
                config.track ||
                $(config.trackSelector, section);

            const viewport =
                config.viewport ||
                $(config.viewportSelector, section);

            if (!track || !viewport) return null;

            const cards = $$(".gallery-card", track);

            const tabsContainer =
                config.tabsContainer ||
                $(config.tabsSelector, section);

            const tabs = tabsContainer
                ? $$(".service-tab", tabsContainer)
                : [];

            if (!cards.length) return null;

            const data = config.data || cards.map((card, index) => {
                const title =
                    $(".gallery-card-title", card) ||
                    $("h3", card);

                const description =
                    $(".gallery-card-description", card) ||
                    $("p", card);

                return {
                    title:
                        title?.textContent.trim() ||
                        `منتج ${index + 1}`,

                    description:
                        description?.textContent.trim() || "",

                    image:
                        $("img", card)?.getAttribute("src") ||
                        "images/category-1.jpg",

                    price: 0
                };
            });

            cards.forEach((card, index) => {
                card.dataset.index = index;
            });

            tabs.forEach((tab, index) => {
                tab.dataset.index = index;
            });

            const previous =
                config.previous ||
                $(config.previousSelector, section);

            const next =
                config.next ||
                $(config.nextSelector, section);

            const current =
                config.current ||
                $(config.currentSelector, section);

            const progress =
                config.progress ||
                $(config.progressSelector, section);

            const gallery = {
                section,
                track,
                viewport,
                cards,
                tabs,
                data,
                current,
                progress,
                index: 0,
                visibleCards: 1,
                choose: null,
                update: null
            };

            const getVisibleCards = () => {
                const width = window.innerWidth;

                if (width <= 420) return 1;
                if (width <= 767) return 2;
                if (width <= 991) return 3;
                if (width <= 1199) return 4;

                return 5;
            };

            gallery.update = () => {
                gallery.visibleCards = Math.min(
                    getVisibleCards(),
                    cards.length
                );

                const maxStart = Math.max(
                    0,
                    cards.length - gallery.visibleCards
                );

                gallery.index = Math.max(
                    0,
                    Math.min(gallery.index, maxStart)
                );

                const cardWidth =
                    cards[0]?.getBoundingClientRect().width || 0;

                const trackStyle = window.getComputedStyle(track);

                const gap =
                    parseFloat(trackStyle.columnGap) ||
                    parseFloat(trackStyle.gap) ||
                    0;

                const distance =
                    gallery.index * (cardWidth + gap);

                const rtl =
                    window.getComputedStyle(track).direction === "rtl";

                track.style.transform = rtl
                    ? `translateX(${distance}px)`
                    : `translateX(${-distance}px)`;

                if (current) {
                    current.textContent =
                        String(gallery.index + 1).padStart(2, "0");
                }

                if (progress) {
                    const denominator = Math.max(1, maxStart);

                    progress.style.width =
                        `${(gallery.index / denominator) * 100}%`;
                }

                if (previous) {
                    previous.disabled = gallery.index <= 0;
                }

                if (next) {
                    next.disabled = gallery.index >= maxStart;
                }
            };

            gallery.choose = (index, openDetails = false) => {
                gallery.index = Math.max(
                    0,
                    Math.min(
                        index,
                        Math.max(
                            0,
                            cards.length - gallery.visibleCards
                        )
                    )
                );

                gallery.update();

                if (openDetails) {
                    openModal(gallery, index);
                }
            };

            cards.forEach((card, index) => {
                card.addEventListener("click", () => {
                    openModal(gallery, index);
                });

                card.addEventListener("keydown", (event) => {
                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {
                        event.preventDefault();
                        openModal(gallery, index);
                    }
                });
            });

            tabs.forEach((tab, index) => {
                tab.addEventListener("click", () => {
                    gallery.index = Math.min(
                        index,
                        Math.max(
                            0,
                            cards.length - gallery.visibleCards
                        )
                    );

                    gallery.update();
                    openModal(gallery, index);
                });
            });

            previous?.addEventListener("click", () => {
                gallery.index--;
                gallery.update();
            });

            next?.addEventListener("click", () => {
                gallery.index++;
                gallery.update();
            });

            let touchStartX = 0;
            let touchEndX = 0;

            viewport.addEventListener("touchstart", (event) => {
                touchStartX = event.changedTouches[0].screenX;
            }, { passive: true });

            viewport.addEventListener("touchend", (event) => {
                touchEndX = event.changedTouches[0].screenX;

                const delta = touchEndX - touchStartX;

                if (Math.abs(delta) > 45) {
                    const rtl =
                        window.getComputedStyle(track).direction === "rtl";

                    const forward = rtl
                        ? delta > 0
                        : delta < 0;

                    gallery.index += forward ? 1 : -1;

                    gallery.update();
                }
            }, { passive: true });

            gallery.update();
            galleries.push(gallery);

            return gallery;
        };

        /* ==============================
           BRANDING GALLERY
        ============================== */

        if (brandingSection && brandingTrack) {
            setupGallery({
                section: brandingSection,
                track: brandingTrack,

                viewport:
                    $("#galleryViewport", brandingSection) ||
                    $(".gallery-viewport", brandingSection) ||
                    brandingTrack.parentElement,

                tabsContainer: brandingTabs,
                data: brandingData,

                previous: $("#prev", brandingSection),
                next: $("#next", brandingSection),
                current: $("#current", brandingSection),
                progress: $("#progress", brandingSection)
            });
        }

        /* ==============================
           EXTRA GALLERIES
        ============================== */

        Object.entries(extraGalleries).forEach(([key, config]) => {
            const section = config.section;

            if (!section) return;

            const currentSelector = `#${key}Current`;
            const progressSelector = `#${key}Progress`;

            let current = $(currentSelector, section);

            if (!current) {
                const footer = $(".gallery-foot", section);

                if (footer) {
                    current = document.createElement("b");
                    current.id = `${key}Current`;
                    current.textContent = "01";

                    const counter = document.createElement("span");

                    counter.append(
                        current,
                        document.createTextNode(
                            ` / ${String(config.data.length).padStart(2, "0")}`
                        )
                    );

                    footer.replaceChildren(counter);
                }
            }

            setupGallery({
                section,
                track: config.galleryTrack,

                viewport:
                    $(".gallery-viewport", section) ||
                    config.galleryTrack?.parentElement,

                tabsContainer: config.galleryTabs,
                data: config.data,

                previous: $(`[data-gallery-prev="${key}"]`, section),
                next: $(`[data-gallery-next="${key}"]`, section),
                current,
                progress: $(progressSelector, section)
            });
        });

        /* ==============================
           WHATSAPP LINKS
        ============================== */

        $$('a[href*="wa.me"], .whatsapp-link').forEach((link) => {
            if (link.dataset.whatsappBound) return;

            link.dataset.whatsappBound = "true";

            link.addEventListener("click", (event) => {
                if (whatsappNumber.includes("X")) {
                    event.preventDefault();

                    alert(
                        "يرجى إضافة رقم واتساب الحقيقي في ملف JavaScript أولًا."
                    );
                }
            });
        });

const contactForm = document.getElementById("contactForm");
const contactFormStatus = document.getElementById("contactFormStatus");

const contactWhatsAppNumber = "966545953908";

if (contactForm && !contactForm.dataset.whatsappBound) {
    contactForm.dataset.whatsappBound = "true";

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const name = document.getElementById("contactName")?.value.trim() || "";
        const phone = document.getElementById("contactPhone")?.value.trim() || "";
         const service = document.getElementById("contactService")?.value || "";
        const details = document.getElementById("contactMessage")?.value.trim() || "";

        const message = [
            "السلام عليكم، أريد التواصل مع شركة الفنان للدعاية والإعلان.",
            "",
            "الاسم: " + name,
            "رقم الجوال: " + phone,
             "الخدمة المطلوبة: " + service,
            "",
            "تفاصيل الطلب:",
            details
        ].join("\n");

      

        const whatsappUrl =
            "https://wa.me/" +
            contactWhatsAppNumber +
            "?text=" +
            encodeURIComponent(message);

        const whatsappWindow = window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
        );

        if (whatsappWindow) {
            contactForm.reset();

            if (contactFormStatus) {
                contactFormStatus.textContent =
                    "تم فتح واتساب وتجهيز رسالتك. اضغط إرسال داخل واتساب لإتمام العملية.";
            }
        } else {
            if (contactFormStatus) {
                contactFormStatus.textContent =
                    "سيتم فتح واتساب في الصفحة الحالية. أكمل إرسال رسالتك هناك.";
            }

            contactForm.reset();
         }
    });
}

        /* ==============================
           GSAP ANIMATIONS
        ============================== */

        if (window.gsap) {
            const gsap = window.gsap;

            if (window.ScrollTrigger) {
                gsap.registerPlugin(window.ScrollTrigger);
            }

            if (window.ScrollTrigger) {
                gsap.utils.toArray(
                    ".about-copy > *, .about-photo, .about-visual, .feature-item, .service-card"
                ).forEach((element) => {
                    gsap.from(element, {
                        y: 25,
                        opacity: 0,
                        duration: 0.7,
                        ease: "power2.out",

                        scrollTrigger: {
                            trigger: element,
                            start: "top 88%",
                            once: true
                        }
                    });
                });

                gsap.utils.toArray(
                    ".services-preview, .contact-strip"
                ).forEach((element) => {
                    gsap.from(element, {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,

                        scrollTrigger: {
                            trigger: element,
                            start: "top 85%",
                            once: true
                        }
                    });
                });

              
            }

        
        }

        /* ==============================
           AOS
        ============================== */

        if (window.AOS) {
            window.AOS.init({
                duration: 800,
                easing: "ease-out-cubic",
                once: true,
                offset: 70
            });
        }

        
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, {
            once: true
        });
    } else {
        init();
    }
})();
