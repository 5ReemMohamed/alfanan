
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    const whatsappNumber = "966545953908";
    const getLang = () => document.documentElement.lang === "en" ? "en" : "ar";
    const isEnglish = () => getLang() === "en";
    const translate = (ar, en) => isEnglish() ? en : ar;

    const mobileToggle = $("#mobileToggle");
    const mainNav = $("#mainNav");
    const searchToggle = $(".search-toggle");
    const searchPanel = $("#searchPanel");
    const searchInput = $("#searchInput");

    const hero = $(".hero");
    const heroSlides = $$(".hero-slide");
    const heroDots = $$(".hero-dot");
    const prevButton = $("#prevSlide");
    const nextButton = $("#nextSlide");
    const currentSlideNumber = $("#currentSlide");
    const slideProgress = $("#slideProgress");

    const grid = $("#productsGrid");
    const count = $("#productsVisibleCount");
    const search = $("#sidebarSearch");
    const sort = $("#productsSort");
    const pagination = $("#productsPagination");
    const empty = $("#productsEmpty");
    const categoryTitle = $("#productsCategoryTitle");
    const categoryDescription = $("#productsCategoryDescription");

    const getProducts = () =>
        Array.isArray(window.products) ? window.products : [];

    let currentSlide = 0;
    let heroTimer = null;
    let touchStartX = 0;
    let activeCategory = "all";
    let activeView = "grid";
    let currentPage = 1;
    let lastProductsLanguage = getLang();
    let currentModalProduct = null;

    const heroInterval = 4000;
    const perPage = 9;

    const escapeHTML = value =>
        String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);

    const categories = [
        {
            key: "gifts",
            title: "الهدايا الدعائية",
            columns: [
                [
                    ["awards", "دروع تذكارية", "fa-award"],
                    ["nameBadge", "بروش اسم", "fa-id-badge"],
                    ["deskNameplate", "لوحة اسم مكتبية", "fa-address-card"],
                    ["mugPrinting", "طباعة أكواب", "fa-mug-hot"],
                    ["penPrinting", "طباعة أقلام", "fa-pen"],
                    ["usbPrinting", "طباعة فلاش", "fa-usb"],
                    ["calendar", "تقويم", "fa-calendar-days"]
                ],
                [
                    ["carSunshade", "شماسة سيارة", "fa-car-side"],
                    ["candles", "شموع", "fa-fire-flame-curved"],
                    ["plotterPrinting", "طباعة ورق بلوت", "fa-scroll"],
                    ["sashPrinting", "طباعة وشاح", "fa-ribbon"],
                    ["puzzlePrinting", "طباعة بازل", "fa-puzzle-piece"],
                    ["notepad", "مذكرة", "fa-book-open"],
                    ["carFreshener", "طباعة معطر سيارة", "fa-spray-can"],
                    ["mousePad", "ماوس باد", "fa-computer-mouse"]
                ]
            ]
        },
        {
            key: "printing",
            title: "المطبوعات الورقية",
            columns: [
                [
                    ["certificate", "شهادة شكر وتقدير", "fa-certificate"],
                    ["books", "كتب", "fa-book"],
                    ["businessCards", "كروت شخصية", "fa-address-card"],
                    ["restaurantMenu", "منيو المطاعم", "fa-utensils"],
                    ["brochures", "بروشورات", "fa-book-open"],
                    ["invoices", "فواتير", "fa-file-invoice"],
                    ["notebook", "نوت بوك", "fa-book-bookmark"]
                ],
                [
                    ["letterhead", "ورق مراسلات", "fa-file-lines"],
                    ["envelopes", "الأظرف", "fa-envelope"],
                    ["vouchers", "سندات", "fa-receipt"],
                    ["leaflets", "مطويات", "fa-file"],
                    ["contracts", "عقود", "fa-file-signature"],
                    ["greetingCards", "كروت التهنئة والزواج", "fa-heart"]
                ],
                [
                    ["calendar", "تقويم", "fa-calendar-days"],
                    ["folders", "فولدر", "fa-folder-open"],
                    ["placemats", "ورق سفرة", "fa-plate-wheat"],
                    ["bookmarks", "فواصل كتب", "fa-bookmark"],
                    ["companyProfile", "البروفايل", "fa-id-card"]
                ]
            ]
        },
        {
            key: "identity",
            title: "مطبوعات الهوية",
            columns: [
                [
                    ["stickers", "استكرات لاصقة", "fa-note-sticky"],
                    ["businessCard", "بطاقة العمل", "fa-address-card"],
                    ["curtainPrinting", "طباعة ستائر", "fa-window-maximize"],
                    ["stamps", "أختام", "fa-stamp"],
                    ["tshirtPrinting", "طباعة تيشرتات", "fa-shirt"]
                ],
                [
                    ["capEmbroidery", "تطريز كاب", "fa-hat-cowboy"],
                    ["sweatshirtPrinting", "طباعة بلوفرات", "fa-shirt"],
                    ["balloonPrinting", "طباعة على البالونات", "fa-gift"],
                    ["fabricLabels", "ليبل قماش", "fa-tag"],
                    ["fabricBags", "شنط قماش", "fa-bag-shopping"]
                ],
                [
                    ["safetyVest", "سترة سلامة", "fa-vest"],
                    ["waistcoats", "سديريات", "fa-vest-patches"],
                    ["aprons", "مريلة", "fa-user-tie"],
                    ["file", "ملف", "fa-folder-open"],
                    ["tags", "تاقات", "fa-tags"]
                ]
            ]
        },
        {
            key: "packaging",
            title: "التغليف",
            columns: [
                [
                    ["plasticCups", "أكواب بلاستيك", "fa-glass-water"],
                    ["paperCups", "أكواب ورقية", "fa-mug-hot"],
                    ["paperBags", "أكياس ورقية", "fa-bag-shopping"]
                ],
                [
                    ["shippingBags", "طباعة أكياس شحن", "fa-box"],
                    ["ribbonPrinting", "طباعة شرائط", "fa-ribbon"],
                    ["tissuePrinting", "طباعة مناديل", "fa-box-tissue"]
                ]
            ]
        },
        {
            key: "exhibitions",
            title: "تنظيم المعارض",
            columns: [
                [
                    ["stands", "ستاند", "fa-display"],
                    ["popupDisplays", "بوب أب", "fa-panorama"],
                    ["flags", "أعلام", "fa-flag"]
                ],
                [
                    ["tickets", "تذاكر", "fa-ticket"],
                    ["tableCards", "كرت طاولة", "fa-table"],
                    ["wristbands", "أساور", "fa-id-badge"]
                ]
            ]
        },
        {
            key: "occasions",
            title: "عروض المناسبات",
            columns: [
                [
                    ["eidGifts", "توزيعات العيد", "fa-gift"],
                    ["newbornGifts", "توزيعات المواليد", "fa-baby"],
                    ["nationalDay", "اليوم الوطني", "fa-flag"]
                ],
                [
                    ["foundingDay", "يوم التأسيس", "fa-landmark"],
                    ["ramadanGifts", "توزيعات رمضان", "fa-moon"],
                    ["engagementGifts", "توزيعات ملكة", "fa-ring"],
                    ["schoolGifts", "توزيعات العودة للمدارس", "fa-school"]
                ],
                [
                    ["graduationGifts", "توزيعات التخرج", "fa-graduation-cap"]
                ]
            ]
        },
        {
            key: "signage",
            title: "اللوحات الإعلانية",
            columns: [
                [
                    ["banners", "بنر", "fa-scroll"],
                    ["posters", "بوستر", "fa-image"],
                    ["raisedLetters", "حروف بارزة", "fa-font"],
                    ["acrylicSigns", "لوحة أكريليك", "fa-sign-hanging"]
                ],
                [
                    ["pvcShelfTags", "تعليقة رفوف PVC", "fa-tags"],
                    ["foamPrinting", "طباعة على فلين", "fa-layer-group"],
                    ["forexSigns", "لوحة فوركس", "fa-table-cells-large"]
                ]
            ]
        },
        {
            key: "design",
            title: "التصميم",
            columns: [
                [
                    ["adDesign", "تصميم إعلان", "fa-rectangle-ad"],
                    ["brochureDesign", "تصميم البروشورات", "fa-book-open"],
                    ["cvDesign", "تصميم سيرة ذاتية", "fa-file-lines"]
                ],
                [
                    ["logoDesign", "تصميم شعار", "fa-pen-nib"],
                    ["businessCardDesign", "تصميم كروت شخصية", "fa-address-card"],
                    ["brandIdentityDesign", "تصميم هوية تجارية", "fa-palette"]
                ],
                [
                    ["greetingCardDesign", "تصميم كروت التهنئة والزواج", "fa-heart"],
                    ["schoolFolderDesign", "تصميم ملفات مدرسية", "fa-folder-open"],
                    ["menuDesign", "تصميم منيو", "fa-utensils"]
                ]
            ]
        }
    ];

    const megaMenuContainer = $("#navCategories");

    const translationCache = {
        ar: null,
        en: null
    };

    let currentTranslations = null;
    let translationRequest = 0;
    let lastObservedLanguage = getLang();

    function getTranslation(key, fallback = "") {
        const value = key.split(".").reduce(
            (result, part) => result?.[part],
            currentTranslations
        );

        return typeof value === "string" ? value : fallback;
    }

    function translatedCategories() {
        return categories.map(category => ({
            ...category,
            title: getTranslation(
                `megaMenu.categories.${category.key}.title`,
                category.title
            ),
            columns: category.columns.map(column =>
                column.map(([key, title, icon]) => [
                    key,
                    getTranslation(`megaMenu.items.${key}`, title),
                    icon
                ])
            )
        }));
    }

    function createMegaProduct([key, title, icon]) {
        const viewProducts = getTranslation(
            "nav.viewProducts",
            translate("عرض المنتجات", "View Products")
        );

      
        return `
            <div class="nav-dropdown mega-sub-dropdown">
                <button
                    class="mega-sub-trigger dropdown-trigger"
                    type="button"
                    aria-expanded="false"
                >
                    <i class="fa-solid ${escapeHTML(icon)}"></i>
                    <span>${escapeHTML(title)}</span>
                    <i class="fa-solid fa-chevron-down mega-sub-arrow"></i>
                </button>

                <div class="mega-menu mega-sub-menu">
                    <div class="mega-menu-content">
                        <a href="products.html">
                            <i class="fa-solid fa-box-open"></i>
                            <span>${escapeHTML(viewProducts)}</span>
                        </a>
                      
                    </div>
                </div>
            </div>
        `;
    }

    function renderMegaMenu() {
        if (!megaMenuContainer) return;

        megaMenuContainer.innerHTML = translatedCategories()
            .map(category => `
                <div class="nav-dropdown">
                    <button
                        class="nav-link dropdown-trigger"
                        type="button"
                        aria-expanded="false"
                    >
                        <span>${escapeHTML(category.title)}</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>

                    <div class="mega-menu">
                        ${category.columns.map((column, index) => `
                            <div class="mega-menu-content">
                                ${index === 0 ? `
                                    <span class="mega-label">
                                        ${escapeHTML(category.title)}
                                    </span>
                                ` : ""}

                                ${column.map(createMegaProduct).join("")}
                            </div>
                        `).join("")}
                    </div>
                </div>
            `).join("");
    }

    async function updateMegaMenuTranslations(lang, data = null) {
        const requestId = ++translationRequest;

        try {
            if (data) {
                translationCache[lang] = data;
            }

            if (!translationCache[lang]) {
                const response = await fetch(`lang/${lang}.json`);

                if (!response.ok) {
                    throw new Error(`Cannot load lang/${lang}.json`);
                }

                translationCache[lang] = await response.json();
            }

            if (requestId !== translationRequest) return;
            if (getLang() !== lang) return;

            currentTranslations = translationCache[lang];
            renderMegaMenu();
        } catch (error) {
            console.error("Mega Menu translation error:", error);

            if (requestId === translationRequest) {
                currentTranslations = null;
                renderMegaMenu();
            }
        }
    }

    function setDropdownOpen(dropdown, open) {
        if (!dropdown) return;

        dropdown.classList.toggle("is-open", open);

        const trigger = dropdown.querySelector(
            ":scope > .dropdown-trigger"
        );

        trigger?.setAttribute("aria-expanded", String(open));

        if (!open) {
            dropdown.querySelectorAll(
                ".nav-dropdown.is-open"
            ).forEach(child => {
                child.classList.remove("is-open");

                child.querySelector(
                    ":scope > .dropdown-trigger"
                )?.setAttribute("aria-expanded", "false");
            });
        }
    }

    function closeDropdowns(except = null) {
        if (!mainNav) return;

        $$(".nav-dropdown.is-open", mainNav).forEach(dropdown => {
            if (
                dropdown === except ||
                (except && dropdown.contains(except))
            ) {
                return;
            }

            setDropdownOpen(dropdown, false);
        });
    }

    function closeSiblingDropdowns(dropdown) {
        if (!dropdown?.parentElement) return;

        [...dropdown.parentElement.children].forEach(sibling => {
            if (
                sibling !== dropdown &&
                sibling.classList.contains("nav-dropdown")
            ) {
                setDropdownOpen(sibling, false);
            }
        });
    }

    if (mainNav) {
        mainNav.addEventListener("click", event => {
            const trigger = event.target.closest(
                ".dropdown-trigger"
            );

            if (!trigger || !mainNav.contains(trigger)) return;

            event.preventDefault();
            event.stopPropagation();

            const dropdown = trigger.closest(".nav-dropdown");

            if (!dropdown) return;

            const shouldOpen = !dropdown.classList.contains(
                "is-open"
            );

            closeSiblingDropdowns(dropdown);
            setDropdownOpen(dropdown, shouldOpen);
        });

        mainNav.addEventListener("pointerover", event => {
            if (!window.matchMedia(
                "(min-width: 1200px) and (hover: hover)"
            ).matches) return;

            const dropdown = event.target.closest(
                ".nav-dropdown"
            );

            if (!dropdown || !mainNav.contains(dropdown)) return;

            if (
                event.relatedTarget &&
                dropdown.contains(event.relatedTarget)
            ) {
                return;
            }

            closeSiblingDropdowns(dropdown);
            setDropdownOpen(dropdown, true);
        });

        mainNav.addEventListener("pointerout", event => {
            if (!window.matchMedia(
                "(min-width: 1200px) and (hover: hover)"
            ).matches) return;

            const dropdown = event.target.closest(
                ".nav-dropdown"
            );

            if (!dropdown || !mainNav.contains(dropdown)) return;

            if (
                event.relatedTarget &&
                dropdown.contains(event.relatedTarget)
            ) {
                return;
            }

            setDropdownOpen(dropdown, false);
        });

        mainNav.addEventListener("click", event => {
            const link = event.target.closest("a");

            if (!link) return;

            if (window.innerWidth < 1200) {
                closeMobileMenu();
            }
        });
    }

    function closeMobileMenu() {
        if (!mainNav || !mobileToggle) return;

        mainNav.classList.remove("is-open");
        mobileToggle.classList.remove("is-active");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.setAttribute(
            "aria-label",
            translate("فتح القائمة", "Open menu")
        );

        document.body.classList.remove("menu-open");
        closeDropdowns();
    }

    mobileToggle?.addEventListener("click", () => {
        if (!mainNav) return;

        const isOpen = mainNav.classList.toggle("is-open");

        mobileToggle.classList.toggle("is-active", isOpen);
        mobileToggle.setAttribute("aria-expanded", String(isOpen));

        mobileToggle.setAttribute(
            "aria-label",
            isOpen
                ? translate("إغلاق القائمة", "Close menu")
                : translate("فتح القائمة", "Open menu")
        );

        document.body.classList.toggle("menu-open", isOpen);

        if (!isOpen) closeDropdowns();
    });

    document.addEventListener("click", event => {
        if (!event.target.closest(".nav-dropdown")) {
            closeDropdowns();
        }

        if (
            searchPanel &&
            !event.target.closest(".search-panel") &&
            !event.target.closest(".search-toggle")
        ) {
            searchPanel.classList.remove("is-visible");
        }

        if (
            mainNav &&
            mobileToggle &&
            window.innerWidth < 1200 &&
            mainNav.classList.contains("is-open") &&
            !event.target.closest(".main-nav") &&
            !event.target.closest(".mobile-toggle")
        ) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeDropdowns();
            closeMobileMenu();
            searchPanel?.classList.remove("is-visible");
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 1200) {
            closeMobileMenu();
        }
    });

    if (searchToggle && searchPanel) {
        searchToggle.addEventListener("click", event => {
            event.stopPropagation();

            const isVisible = searchPanel.classList.toggle(
                "is-visible"
            );

            if (isVisible) {
                searchInput?.focus();
            }
        });

        searchPanel.addEventListener("click", event => {
            event.stopPropagation();
        });
    }

    if (searchPanel && searchInput) {
        searchPanel.addEventListener("submit", event => {
            event.preventDefault();

            const query = searchInput.value
                .trim()
                .toLocaleLowerCase();

            if (!query) {
                searchInput.focus();
                return;
            }

            const items = $$(
                ".service-card, .mega-menu-content a"
            );

            const match = items.find(item =>
                item.textContent
                    .toLocaleLowerCase()
                    .includes(query)
            );

            if (!match) {
                searchInput.setCustomValidity(
                    translate(
                        "لم يتم العثور على الخدمة المطلوبة",
                        "The requested service was not found"
                    )
                );

                searchInput.reportValidity();
                searchInput.setCustomValidity("");
                return;
            }

            searchPanel.classList.remove("is-visible");

            const parentDropdown = match.closest(
                ".nav-dropdown"
            );

            if (parentDropdown) {
                let current = parentDropdown;

                while (current && mainNav?.contains(current)) {
                    setDropdownOpen(current, true);

                    current = current.parentElement?.closest(
                        ".nav-dropdown"
                    );
                }
            }

            match.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            if (typeof match.animate === "function") {
                match.animate(
                    [
                        { outline: "0 solid rgba(233,184,111,0)" },
                        { outline: "3px solid rgba(233,184,111,.8)" },
                        { outline: "0 solid rgba(233,184,111,0)" }
                    ],
                    {
                        duration: 1200,
                        easing: "ease-out"
                    }
                );
            }
        });
    }

    function showSlide(index) {
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
            dot.setAttribute(
                "aria-current",
                active ? "true" : "false"
            );
        });

        if (currentSlideNumber) {
            currentSlideNumber.textContent =
                String(currentSlide + 1).padStart(2, "0");
        }

        if (slideProgress) {
            slideProgress.style.width =
                `${((currentSlide + 1) / heroSlides.length) * 100}%`;
        }
    }

    function stopHeroTimer() {
        if (heroTimer !== null) {
            clearInterval(heroTimer);
            heroTimer = null;
        }
    }

    function startHeroTimer() {
        stopHeroTimer();

        if (heroSlides.length <= 1) return;

        heroTimer = setInterval(() => {
            showSlide(currentSlide + 1);
        }, heroInterval);
    }

    function goToSlide(index) {
        showSlide(index);
        startHeroTimer();
    }

    prevButton?.addEventListener("click", () => {
        goToSlide(currentSlide - 1);
    });

    nextButton?.addEventListener("click", () => {
        goToSlide(currentSlide + 1);
    });

    heroDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
        });
    });

    if (hero) {
        hero.addEventListener("touchstart", event => {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        hero.addEventListener("touchend", event => {
            const difference =
                touchStartX - event.changedTouches[0].screenX;

            if (Math.abs(difference) > 60) {
                goToSlide(
                    currentSlide + (difference > 0 ? 1 : -1)
                );
            }
        }, { passive: true });
    }

    if (heroSlides.length) {
        showSlide(0);
        startHeroTimer();
    }

    const categoryDescriptions = {
        ar: {
            all: {
                title: "جميع منتجاتنا",
                description: "اكتشف مجموعتنا المتنوعة من الدروع التذكارية والهدايا الدعائية والمطبوعات التي تجمع بين جودة التنفيذ وجمال التصميم."
            },
            shields: {
                title: "دروع تذكارية",
                description: "دروع تذكارية بتصاميم فاخرة تناسب حفلات التكريم والمناسبات الرسمية."
            },
            brooch: {
                title: "بروش اسم",
                description: "بروشات أسماء بتصاميم أنيقة ومناسبة للموظفين والفعاليات."
            },
            desk: {
                title: "لوحات اسم مكتبية",
                description: "لوحات مكتبية احترافية بتصاميم تناسب المكاتب والإدارات."
            },
            cups: {
                title: "طباعة أكواب",
                description: "أكواب دعائية مخصصة بطباعة شعارات الشركات والتصاميم المختلفة."
            },
            pens: {
                title: "طباعة أقلام",
                description: "أقلام دعائية مميزة تناسب الشركات والمعارض والفعاليات."
            },
            shirts: {
                title: "طباعة ملابس",
                description: "طباعة احترافية على الملابس والتيشيرتات بمختلف التصاميم."
            },
            calendar: {
                title: "تقويم",
                description: "تقويمات مكتبية وجدارية بتصاميم مخصصة لهوية علامتك التجارية."
            },
            car: {
                title: "شماسات سيارة",
                description: "منتجات دعائية للسيارات مع إمكانية تخصيص التصميم والشعار."
            },
            bags: {
                title: "شنط دعائية",
                description: "شنط دعائية بتصاميم أنيقة تناسب الشركات والفعاليات والهدايا."
            },
            printing: {
                title: "مطبوعات دعائية",
                description: "حلول الطباعة الإعلانية للمعارض والمناسبات والأنشطة التجارية."
            }
        },
        en: {
            all: {
                title: "All Products",
                description: "Explore our diverse collection of awards, promotional gifts, and printed products combining quality craftsmanship with beautiful design."
            },
            shields: {
                title: "Commemorative Awards",
                description: "Premium awards for recognition ceremonies and official events."
            },
            brooch: {
                title: "Name Badges",
                description: "Elegant personalized name badges for employees and events."
            },
            desk: {
                title: "Desk Nameplates",
                description: "Professional desk nameplates for offices and businesses."
            },
            cups: {
                title: "Custom Printed Mugs",
                description: "Personalized promotional mugs with company logos and custom designs."
            },
            pens: {
                title: "Custom Printed Pens",
                description: "Branded promotional pens for companies, exhibitions, and events."
            },
            shirts: {
                title: "Clothing Printing",
                description: "Professional printing on clothing and T-shirts with custom designs."
            },
            calendar: {
                title: "Calendars",
                description: "Customized desk and wall calendars featuring your brand identity."
            },
            car: {
                title: "Car Sunshades",
                description: "Custom promotional car accessories featuring your logo and design."
            },
            bags: {
                title: "Promotional Bags",
                description: "Stylish branded bags for businesses, events, and gifts."
            },
            printing: {
                title: "Promotional Printing",
                description: "Advertising printing solutions for exhibitions, events, and businesses."
            }
        }
    };

    const productTranslations = {
        "درع كريستال فاخر": {
            name: "Premium Crystal Award",
            description: "An elegant premium crystal award with a distinctive design, perfect for recognition ceremonies and official events."
        },
        "درع خشبي فاخر": {
            name: "Premium Wooden Award",
            description: "An elegant wooden award with luxurious details and customizable name and logo."
        },
        "درع خشبي نحاس": {
            name: "Wooden and Brass Award",
            description: "A distinctive recognition award combining elegant wood and brass craftsmanship."
        }
    };

    const categoryNamesEn = {
        shields: "Commemorative Awards",
        brooch: "Name Badges",
        desk: "Desk Nameplates",
        cups: "Custom Printed Mugs",
        pens: "Custom Printed Pens",
        shirts: "Clothing Printing",
        calendar: "Calendars",
        car: "Car Sunshades",
        bags: "Promotional Bags",
        printing: "Promotional Printing"
    };

    const badgeTranslations = {
        "الأكثر طلباً": "Best Seller",
        "الأكثر طلبًا": "Best Seller",
        "مميز": "Featured",
        "جديد": "New",
        "عرض خاص": "Special Offer"
    };

    function productText(product, field) {
        if (!product) return "";

        const original = String(product[field] || "");

        if (!isEnglish()) return original;

        const englishField = `${field}En`;

        if (
            typeof product[englishField] === "string" &&
            product[englishField].trim()
        ) {
            return product[englishField];
        }

        if (field === "categoryName") {
            return categoryNamesEn[product.category] || original;
        }

        if (field === "badge") {
            return badgeTranslations[original] || original;
        }

        const translation = productTranslations[product.name];

        if (translation && translation[field]) {
            return translation[field];
        }

        return original;
    }

    function formatPrice(price) {
        return Number(price || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function getImageUrl(image) {
        try {
            return new URL(image, window.location.href).href;
        } catch {
            return String(image || "");
        }
    }

    function whatsappLink(product) {
        const name = productText(product, "name");
        const category = productText(product, "categoryName");
        const sku = product.sku || product.id;

        const message = isEnglish()
            ? [
                "Hello Al Fannan Advertising 👋",
                "",
                "I would like to order the following product:",
                "",
                `📦 Product: ${name}`,
                `🏷️ Product ID: ${sku}`,
                `📂 Category: ${category}`,
                "",
                `💰 Listed Price: ${formatPrice(product.price)} SAR`,
                `🖼️ Product Image: ${getImageUrl(product.image)}`,
                "",
                "Please confirm the final product price.",
                "Please also confirm availability and production time.",
                "",
                "Thank you."
            ]
            : [
                "مرحباً شركة الفنان للدعاية والإعلان 👋",
                "",
                "أرغب في طلب المنتج التالي:",
                "",
                `📦 اسم المنتج: ${name}`,
                `🏷️ رقم المنتج: ${sku}`,
                `📂 القسم: ${category}`,
                "",
                `💰 السعر المعروض: ${formatPrice(product.price)} ر.س`,
                `🖼️ صورة المنتج: ${getImageUrl(product.image)}`,
                "",
                "أرجو تأكيد السعر النهائي للمنتج.",
                "وأرجو توضيح مدة التنفيذ والتوفر.",
                "",
                "شكراً لكم."
            ];

        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message.join("\n"))}`;
    }

    function getFilteredProducts() {
        const query = (search?.value || "")
            .trim()
            .toLocaleLowerCase();

        let result = getProducts().filter(product => {
            const matchesCategory =
                activeCategory === "all" ||
                product.category === activeCategory;

            const searchFields = [
                product.name,
                product.nameEn,
                product.categoryName,
                product.categoryNameEn,
                product.description,
                product.descriptionEn,
                productText(product, "name"),
                productText(product, "categoryName"),
                productText(product, "description"),
                categoryNamesEn[product.category],
                productTranslations[product.name]?.name,
                productTranslations[product.name]?.description
            ];

            const matchesSearch = searchFields.some(value =>
                String(value || "")
                    .toLocaleLowerCase()
                    .includes(query)
            );

            return matchesCategory && matchesSearch;
        });

        const sorting = sort?.value || "default";

        if (sorting === "price-low") {
            result.sort(
                (a, b) => Number(a.price) - Number(b.price)
            );
        }

        if (sorting === "price-high") {
            result.sort(
                (a, b) => Number(b.price) - Number(a.price)
            );
        }

        if (sorting === "name") {
            result.sort((a, b) =>
                productText(a, "name").localeCompare(
                    productText(b, "name"),
                    getLang()
                )
            );
        }

        return result;
    }

    function createCard(product) {
        const card = document.createElement("article");
        card.className = "product-card";

        const name = productText(product, "name");
        const categoryName = productText(product, "categoryName");
        const descriptionText = productText(product, "description");
        const badgeText = productText(product, "badge");

        const detailsUrl =
            `product-detail.html?id=${encodeURIComponent(product.id)}`;

        card.style.cursor = "pointer";
        card.setAttribute("dir", isEnglish() ? "ltr" : "rtl");

        card.addEventListener("click", event => {
            if (
                event.target.closest(
                    "a, button, input, select, textarea, label"
                )
            ) {
                return;
            }

            window.location.href = detailsUrl;
        });

        const imageWrap = document.createElement("div");
        imageWrap.className = "product-card-image";

        const imageLink = document.createElement("a");
        imageLink.href = detailsUrl;
        imageLink.className = "product-card-image-link";
        imageLink.setAttribute(
            "aria-label",
            translate(
                `عرض تفاصيل ${name}`,
                `View details of ${name}`
            )
        );

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = name;
        image.loading = "lazy";

        image.onerror = () => {
            image.onerror = null;
            image.src = "assets/images/product-placeholder.jpg";
        };

        imageLink.appendChild(image);
        imageWrap.appendChild(imageLink);

        if (badgeText) {
            const badge = document.createElement("span");
            badge.className = "product-card-badge";
            badge.textContent = badgeText;
            imageWrap.appendChild(badge);
        }

        const quick = document.createElement("a");
        quick.className = "product-card-quick";
        quick.href = detailsUrl;
        quick.setAttribute(
            "aria-label",
            translate(`تفاصيل ${name}`, `Details of ${name}`)
        );
        quick.innerHTML = '<i class="fas fa-eye"></i>';

        imageWrap.appendChild(quick);

        const content = document.createElement("div");
        content.className = "product-card-content";

        const category = document.createElement("div");
        category.className = "product-card-category";
        category.textContent = categoryName;

        const title = document.createElement("h3");
        title.className = "product-card-title";

        const titleLink = document.createElement("a");
        titleLink.href = detailsUrl;
        titleLink.textContent = name;
        titleLink.style.color = "inherit";
        titleLink.style.textDecoration = "none";

        title.appendChild(titleLink);

        const description = document.createElement("p");
        description.className = "product-card-description";
        description.textContent = descriptionText;

        const priceRow = document.createElement("div");
        priceRow.className = "product-card-price-row";

        const priceLabel = document.createElement("span");
        priceLabel.className = "product-card-price-label";
        priceLabel.textContent = translate(
            "السعر يبدأ من",
            "Price Starts From"
        );

        const price = document.createElement("strong");
        price.className = "product-card-price";
        price.textContent =
            `${formatPrice(product.price)} ${translate("ر.س", "SAR")}`;

        priceRow.append(priceLabel, price);

        const whatsapp = document.createElement("a");
        whatsapp.className = "product-card-whatsapp";
        whatsapp.href = whatsappLink(product);
        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";

        whatsapp.innerHTML = `
            <i class="fa-brands fa-whatsapp"></i>
            <span>${translate("اطلب عبر واتساب", "Order via WhatsApp")}</span>
            <i class="fas fa-arrow-up-left"></i>
        `;

        whatsapp.addEventListener("click", () => {
            whatsapp.href = whatsappLink(product);
        });

        content.append(
            category,
            title,
            description,
            priceRow,
            whatsapp
        );

        card.append(imageWrap, content);

        return card;
    }

    function renderPagination(totalPages) {
        if (!pagination) return;

        pagination.replaceChildren();

        if (totalPages <= 1) return;

        function addButton(
            label,
            page,
            disabled = false,
            active = false
        ) {
            const button = document.createElement("button");

            button.type = "button";
            button.textContent = label;
            button.disabled = disabled;
            button.classList.toggle("active", active);

            if (active) {
                button.setAttribute("aria-current", "page");
            }

            button.addEventListener("click", () => {
                currentPage = page;
                renderProducts();

                $("#products")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            pagination.appendChild(button);
        }

        addButton(
            translate("السابق", "Previous"),
            currentPage - 1,
            currentPage === 1
        );

        for (let i = 1; i <= totalPages; i++) {
            addButton(
                String(i),
                i,
                false,
                currentPage === i
            );
        }

        addButton(
            translate("التالي", "Next"),
            currentPage + 1,
            currentPage === totalPages
        );
    }

    function renderProducts() {
        if (!grid) return;

        const filtered = getFilteredProducts();
        const totalPages = Math.ceil(filtered.length / perPage);

        if (currentPage > totalPages) {
            currentPage = Math.max(1, totalPages);
        }

        const start = (currentPage - 1) * perPage;
        const visible = filtered.slice(
            start,
            start + perPage
        );

        grid.replaceChildren();

        visible.forEach(product => {
            grid.appendChild(createCard(product));
        });

        grid.classList.toggle(
            "list-view",
            activeView === "list"
        );

        if (count) {
            count.textContent = filtered.length;
        }

        if (empty) {
            empty.hidden = filtered.length !== 0;
        }

        const allCategoryCount = $("#allCategoryCount");

        if (allCategoryCount) {
            allCategoryCount.textContent = getProducts().length;
        }

        renderPagination(totalPages);
    }

    function updateCategory(category, resetPage = true) {
        if (!categoryDescriptions.ar[category]) {
            category = "all";
        }

        activeCategory = category;

        if (resetPage) {
            currentPage = 1;
        }

        const data =
            categoryDescriptions[getLang()][category];

        if (categoryTitle) {
            categoryTitle.textContent = data.title;
        }

        if (categoryDescription) {
            categoryDescription.textContent = data.description;
        }

        $$("#productsCategories button").forEach(button => {
            const active =
                button.dataset.category === category;

            button.classList.toggle("active", active);
            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        });

        $("#productsSidebar")?.classList.remove(
            "mobile-open"
        );

        renderProducts();
    }

    function openProductModal(product) {
        const modalElement = $("#productDetailsModal");

        if (
            !modalElement ||
            typeof bootstrap === "undefined"
        ) {
            return;
        }

        currentModalProduct = product;

        const modalImage = $("#productModalImage");
        const modalCategory = $("#productModalCategory");
        const modalTitle = $("#productModalTitle");
        const modalDescription = $("#productModalDescription");
        const modalPrice = $("#productModalPrice");
        const modalWhatsapp = $("#productModalWhatsapp");

        if (modalImage) {
            modalImage.src = product.image;
            modalImage.alt = productText(product, "name");
        }

        if (modalCategory) {
            modalCategory.textContent =
                productText(product, "categoryName");
        }

        if (modalTitle) {
            modalTitle.textContent =
                productText(product, "name");
        }

        if (modalDescription) {
            modalDescription.textContent =
                productText(product, "description");
        }

        if (modalPrice) {
            modalPrice.textContent =
                `${formatPrice(product.price)} ${translate("ر.س", "SAR")}`;
        }

        const modalInfo = $(
            ".products-modal-info",
            modalElement
        );

        if (modalInfo) {
            $$(".product-card-dimensions", modalInfo)
                .forEach(element => element.remove());
        }

        if (modalWhatsapp) {
            modalWhatsapp.href = whatsappLink(product);
            modalWhatsapp.target = "_blank";
            modalWhatsapp.rel = "noopener noreferrer";

            modalWhatsapp.onclick = () => {
                modalWhatsapp.href = whatsappLink(product);
            };
        }

        bootstrap.Modal
            .getOrCreateInstance(modalElement)
            .show();
    }

    $$("#productsCategories button").forEach(button => {
        button.addEventListener("click", () => {
            updateCategory(button.dataset.category);
        });
    });

    $$(".products-view-buttons button").forEach(button => {
        button.addEventListener("click", () => {
            activeView = button.dataset.view;

            $$(".products-view-buttons button").forEach(item => {
                item.classList.toggle(
                    "active",
                    item === button
                );
            });

            renderProducts();
        });
    });

    search?.addEventListener("input", () => {
        currentPage = 1;
        renderProducts();
    });

    sort?.addEventListener("change", () => {
        currentPage = 1;
        renderProducts();
    });

    $("#productsReset")?.addEventListener("click", () => {
        if (search) search.value = "";
        if (sort) sort.value = "default";

        updateCategory("all");
    });

    $("#productsFilterToggle")?.addEventListener("click", () => {
        const sidebar = $("#productsSidebar");

        if (!sidebar) return;

        const isOpen = sidebar.classList.toggle(
            "mobile-open"
        );

        if (isOpen) {
            sidebar.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });

    $("#productsMobileToggle")?.addEventListener("click", () => {
        $(".products-header-nav")?.classList.toggle(
            "active"
        );
    });

    function updateProductsLanguage() {
        if (!grid) return;

        lastProductsLanguage = getLang();
        updateCategory(activeCategory, false);

        if (currentModalProduct) {
            const modalElement = $("#productDetailsModal");

            if (modalElement?.classList.contains("show")) {
                const product = currentModalProduct;

                const modalImage = $("#productModalImage");
                const modalCategory = $("#productModalCategory");
                const modalTitle = $("#productModalTitle");
                const modalDescription = $("#productModalDescription");
                const modalPrice = $("#productModalPrice");
                const modalWhatsapp = $("#productModalWhatsapp");

                if (modalImage) {
                    modalImage.alt = productText(product, "name");
                }

                if (modalCategory) {
                    modalCategory.textContent =
                        productText(product, "categoryName");
                }

                if (modalTitle) {
                    modalTitle.textContent =
                        productText(product, "name");
                }

                if (modalDescription) {
                    modalDescription.textContent =
                        productText(product, "description");
                }

                if (modalPrice) {
                    modalPrice.textContent =
                        `${formatPrice(product.price)} ${translate("ر.س", "SAR")}`;
                }

                if (modalWhatsapp) {
                    modalWhatsapp.href = whatsappLink(product);
                }
            }
        }
    }

    const initialCategory = new URLSearchParams(
        window.location.search
    ).get("category");

    if (grid) {
        updateCategory(
            initialCategory &&
            categoryDescriptions.ar[initialCategory]
                ? initialCategory
                : "all"
        );

        window.addEventListener(
            "pageshow",
            updateProductsLanguage
        );
    }

    const contactForm = $("#contactForm");
    const contactFormStatus = $("#contactFormStatus");

    const contactServiceTranslations = {
        "تصميم وطباعة الهويات البصرية": "Visual Identity Design & Printing",
        "البنرات والملصقات": "Banners & Stickers",
        "اللوحات الإعلانية والكلادينج": "Advertising Signs & Cladding",
        "الدروع والهدايا": "Awards & Promotional Gifts",
        "القص والحفر بالليزر": "Laser Cutting & Engraving",
        "خدمات الحج والعمرة": "Hajj & Umrah Services",
        "خدمة أخرى": "Other Service"
    };

    if (contactForm && !contactForm.dataset.whatsappBound) {
        contactForm.dataset.whatsappBound = "true";

        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!contactForm.reportValidity()) return;

            const name =
                $("#contactName")?.value.trim() || "";

            const phone =
                $("#contactPhone")?.value.trim() || "";

            const service =
                $("#contactService")?.value || "";

            const details =
                $("#contactMessage")?.value.trim() || "";

            const serviceLabel = isEnglish()
                ? contactServiceTranslations[service] || service
                : service;

            const message = isEnglish()
                ? [
                    "Hello Al Fannan Advertising 👋",
                    "",
                    "I would like to request a service:",
                    "",
                    `Name: ${name}`,
                    `Mobile: ${phone}`,
                    `Service: ${serviceLabel}`,
                    "",
                    "Request Details:",
                    details
                ].join("\n")
                : [
                    "السلام عليكم، أريد التواصل مع شركة الفنان للدعاية والإعلان.",
                    "",
                    `الاسم: ${name}`,
                    `رقم الجوال: ${phone}`,
                    `الخدمة المطلوبة: ${serviceLabel}`,
                    "",
                    "تفاصيل الطلب:",
                    details
                ].join("\n");

            const whatsappUrl =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            const whatsappWindow = window.open(
                whatsappUrl,
                "_blank"
            );

            if (whatsappWindow) {
                whatsappWindow.opener = null;
                contactForm.reset();

                if (contactFormStatus) {
                    contactFormStatus.textContent = translate(
                        "تم فتح واتساب وتجهيز رسالتك. اضغط إرسال داخل واتساب لإتمام العملية.",
                        "WhatsApp is open. Please press Send to complete your request."
                    );
                }
            } else if (contactFormStatus) {
                contactFormStatus.textContent = translate(
                    "يرجى السماح بالنوافذ المنبثقة لفتح واتساب، ثم المحاولة مرة أخرى.",
                    "Please allow pop-ups to open WhatsApp, then try again."
                );
            }
        });
    }

    function updateCustomWhatsapp() {
        const whatsappButton = $("#alfSvCustomWhatsapp");

        if (!whatsappButton) return;

        const message = translate(
            "مرحباً، أرغب في طلب خدمة مخصصة",
            "Hello, I would like to request a custom service."
        );

        whatsappButton.href =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        whatsappButton.target = "_blank";
        whatsappButton.rel = "noopener noreferrer";
    }

    function updateProductWhatsappButtons() {
        const helpButton = $("#productsHelpWhatsapp");
        const quoteButton = $("#productsQuoteWhatsapp");

        if (helpButton) {
            const message = translate(
                "مرحباً، أرغب في طلب تصميم خاص",
                "Hello, I would like to request a custom design."
            );

            helpButton.href =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            helpButton.target = "_blank";
            helpButton.rel = "noopener noreferrer";
        }

        if (quoteButton) {
            const message = translate(
                "مرحباً، أرغب في طلب عرض سعر للمنتجات",
                "Hello, I would like to request a quotation for your products."
            );

            quoteButton.href =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            quoteButton.target = "_blank";
            quoteButton.rel = "noopener noreferrer";
        }
    }

    function updateProductAriaLabels() {
        const searchField = $("#sidebarSearch");

        if (searchField) {
            searchField.setAttribute(
                "aria-label",
                translate("البحث عن منتج", "Search Products")
            );
        }

        const gridButton = $(
            '.products-view-buttons button[data-view="grid"]'
        );

        const listButton = $(
            '.products-view-buttons button[data-view="list"]'
        );

        if (gridButton) {
            gridButton.setAttribute(
                "aria-label",
                translate("عرض شبكي", "Grid View")
            );
        }

        if (listButton) {
            listButton.setAttribute(
                "aria-label",
                translate("عرض قائمة", "List View")
            );
        }
    }

const productsCategories = document.getElementById("productsCategories");

if (productsCategories) {
    productsCategories.querySelectorAll(
        ".products-category-submenu"
    ).forEach(submenu => {
        if (submenu.querySelector(".products-category-submenu-inner")) return;

        const inner = document.createElement("div");
        inner.className = "products-category-submenu-inner";

        while (submenu.firstChild) {
            inner.appendChild(submenu.firstChild);
        }

        submenu.appendChild(inner);
    });

    productsCategories.addEventListener("click", event => {
        const trigger = event.target.closest(
            ".products-category-trigger"
        );

        if (trigger) {
            const dropdown = trigger.closest(
                ".products-category-dropdown"
            );

            const shouldOpen = !dropdown.classList.contains(
                "is-open"
            );

            productsCategories.querySelectorAll(
                ".products-category-dropdown.is-open"
            ).forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove("is-open");

                    item.querySelector(
                        ".products-category-trigger"
                    )?.setAttribute("aria-expanded", "false");
                }
            });

            dropdown.classList.toggle("is-open", shouldOpen);
            trigger.setAttribute(
                "aria-expanded",
                String(shouldOpen)
            );

            return;
        }

        const sublink = event.target.closest(
            ".products-category-submenu a"
        );

        if (sublink) {
            event.preventDefault();

            const dropdown = sublink.closest(
                ".products-category-dropdown"
            );

            const category = dropdown.querySelector(
                ".products-category-trigger"
            )?.dataset.category;

            const item = sublink.dataset.productKey;

            productsCategories.querySelectorAll(
                ".products-category-submenu a.active"
            ).forEach(link => link.classList.remove("active"));

            sublink.classList.add("active");

            const url = new URL(window.location.href);

            url.searchParams.set("category", category);
            url.searchParams.set("item", item);

            window.history.replaceState({}, "", url);

            updateCategory(category);

            return;
        }

        const allButton = event.target.closest(
            'button[data-category="all"]'
        );

        if (allButton) {
            productsCategories.querySelectorAll(
                ".products-category-dropdown.is-open"
            ).forEach(dropdown => {
                dropdown.classList.remove("is-open");

                dropdown.querySelector(
                    ".products-category-trigger"
                )?.setAttribute("aria-expanded", "false");
            });

            productsCategories.querySelectorAll(
                ".products-category-submenu a.active"
            ).forEach(link => link.classList.remove("active"));

            const url = new URL(window.location.href);

            url.searchParams.delete("category");
            url.searchParams.delete("item");

            window.history.replaceState({}, "", url);

            updateCategory("all");
        }
    });

    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get("category");
    const initialItem = params.get("item");

    if (initialCategory) {
        const trigger = [...productsCategories.querySelectorAll(
            ".products-category-trigger"
        )].find(button =>
            button.dataset.category === initialCategory
        );

        if (trigger) {
            const dropdown = trigger.closest(
                ".products-category-dropdown"
            );

            dropdown.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");

            if (initialItem) {
                const link = [...dropdown.querySelectorAll(
                    ".products-category-submenu a"
                )].find(item =>
                    item.dataset.productKey === initialItem
                );

                link?.classList.add("active");
            }
        }
    }
}

    function updateServicesResults() {
        const servicesGrid = $("#alfSvGrid");
        const resultsText = $("#alfSvResultsText");
        const totalElement = $("#alfSvTotal");

        if (!servicesGrid || !resultsText) return;

        const items = $$(".alf-sv-item", servicesGrid);

        const visibleCount = items.filter(item =>
            !item.hidden &&
            getComputedStyle(item).display !== "none"
        ).length;

        resultsText.textContent = translate(
            `يتم عرض ${visibleCount} خدمات`,
            `Showing ${visibleCount} Services`
        );

        if (totalElement) {
            totalElement.textContent = items.length;
        }
    }

    [
        "#productsYear",
        "#currentYear",
        "#alfFooterYear"
    ].forEach(selector => {
        const element = $(selector);

        if (element) {
            element.textContent = new Date().getFullYear();
        }
    });

    const backToTop = $("#backToTop");

    if (backToTop) {
        const toggleBackToTop = () => {
            backToTop.classList.toggle(
                "show",
                window.scrollY > 300
            );
        };

        window.addEventListener(
            "scroll",
            toggleBackToTop,
            { passive: true }
        );

        toggleBackToTop();

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    function updateDirections() {
        const direction = isEnglish() ? "ltr" : "rtl";

        document.querySelectorAll(
            ".alf-vm-section, .alf-services-section, .alf-why-section, .contact-section, .alf-footer, .alf-sv-hero, .alf-sv-services, .alf-sv-custom, .products-hero, .products-page"
        ).forEach(section => {
            section.setAttribute("dir", direction);
        });
    }

    function updateLanguage() {
        updateDirections();
        updateCustomWhatsapp();
        updateProductWhatsappButtons();
        updateProductAriaLabels();
        updateServicesResults();
        updateProductsLanguage();

        if (mobileToggle) {
            const isOpen = mainNav?.classList.contains(
                "is-open"
            );

            mobileToggle.setAttribute(
                "aria-label",
                isOpen
                    ? translate("إغلاق القائمة", "Close menu")
                    : translate("فتح القائمة", "Open menu")
            );
        }
    }

    function handleLanguageChanged(event) {
        const lang = getLang();

        lastObservedLanguage = lang;

        updateMegaMenuTranslations(
            lang,
            event.detail?.translations || null
        );

        updateLanguage();
    }

    document.addEventListener(
        "languageChanged",
        handleLanguageChanged
    );

    window.addEventListener(
        "languageChanged",
        handleLanguageChanged
    );

    const languageObserver = new MutationObserver(() => {
        const lang = getLang();

        if (lang === lastObservedLanguage) return;

        lastObservedLanguage = lang;

        updateMegaMenuTranslations(lang);
        updateLanguage();
    });

    languageObserver.observe(
        document.documentElement,
        {
            attributes: true,
            attributeFilter: ["lang"]
        }
    );

    renderMegaMenu();
    updateMegaMenuTranslations(getLang());
    updateLanguage();

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            easing: "ease-out-cubic",
            once: true,
            offset: 80
        });
    }
});
