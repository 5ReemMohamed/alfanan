
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    const whatsappNumber = "966545953908";

    const mobileToggle = $("#mobileToggle");
    const mainNav = $("#mainNav");
    const dropdowns = $$(".nav-dropdown");
    const dropdownTriggers = $$(".dropdown-trigger");

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

    let currentSlide = 0;
    let heroTimer = null;
    let touchStartX = 0;

    const heroInterval = 4000;

    function closeDropdowns(except = null) {
        dropdowns.forEach(dropdown => {
            if (dropdown === except) return;

            dropdown.classList.remove("is-open");

            const trigger = $(".dropdown-trigger", dropdown);

            if (trigger) {
                trigger.setAttribute("aria-expanded", "false");
            }
        });
    }

    function closeMobileMenu() {
        if (!mainNav || !mobileToggle) return;

        mainNav.classList.remove("is-open");
        mobileToggle.classList.remove("is-active");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.setAttribute("aria-label", "فتح القائمة");

        document.body.classList.remove("menu-open");

        closeDropdowns();
    }

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");

            mobileToggle.classList.toggle("is-active", isOpen);
            mobileToggle.setAttribute("aria-expanded", String(isOpen));
            mobileToggle.setAttribute(
                "aria-label",
                isOpen ? "إغلاق القائمة" : "فتح القائمة"
            );

            document.body.classList.toggle("menu-open", isOpen);

            if (!isOpen) closeDropdowns();
        });
    }

    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener("click", event => {
            event.stopPropagation();

            const dropdown = trigger.closest(".nav-dropdown");

            if (!dropdown) return;

            const isOpen = dropdown.classList.contains("is-open");

            closeDropdowns(dropdown);

            dropdown.classList.toggle("is-open", !isOpen);
            trigger.setAttribute("aria-expanded", String(!isOpen));
        });
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

    if (mainNav) {
        $$("a", mainNav).forEach(link => {
            link.addEventListener("click", () => {
                if (window.innerWidth < 1200) {
                    closeMobileMenu();
                }
            });
        });
    }

    if (searchToggle && searchPanel) {
        searchToggle.addEventListener("click", event => {
            event.stopPropagation();

            const isVisible = searchPanel.classList.toggle("is-visible");

            if (isVisible && searchInput) {
                searchInput.focus();
            }
        });

        searchPanel.addEventListener("click", event => {
            event.stopPropagation();
        });
    }

    if (searchPanel && searchInput) {
        searchPanel.addEventListener("submit", event => {
            event.preventDefault();

            const query = searchInput.value.trim().toLocaleLowerCase("ar");

            if (!query) {
                searchInput.focus();
                return;
            }

            const items = $$(".service-card, .mega-menu-content a");

            const match = items.find(item =>
                item.textContent.toLocaleLowerCase("ar").includes(query)
            );

            if (!match) {
                searchInput.setCustomValidity("لم يتم العثور على الخدمة المطلوبة");
                searchInput.reportValidity();
                searchInput.setCustomValidity("");
                return;
            }

            searchPanel.classList.remove("is-visible");

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

        currentSlide = (index + heroSlides.length) % heroSlides.length;

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

        if (currentSlideNumber) {
            currentSlideNumber.textContent = String(currentSlide + 1).padStart(2, "0");
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
            const difference = touchStartX - event.changedTouches[0].screenX;

            if (Math.abs(difference) > 60) {
                goToSlide(currentSlide + (difference > 0 ? 1 : -1));
            }
        }, { passive: true });
    }

    if (heroSlides.length > 0) {
        showSlide(0);
        startHeroTimer();
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMobileMenu();
            searchPanel?.classList.remove("is-visible");
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 1200) {
            closeMobileMenu();
        }
    });

    const categoryDescriptions = {
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
    };

    const grid = $("#productsGrid");
    const count = $("#productsVisibleCount");
    const search = $("#sidebarSearch");
    const sort = $("#productsSort");
    const pagination = $("#productsPagination");
    const empty = $("#productsEmpty");
    const categoryTitle = $("#productsCategoryTitle");
    const categoryDescription = $("#productsCategoryDescription");

    const products = Array.isArray(window.products) ? window.products : [];

    let activeCategory = "all";
    let activeView = "grid";
    let currentPage = 1;

    const perPage = 9;

    function formatPrice(price) {
        return Number(price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function getImageUrl(image) {
        return new URL(image, window.location.href).href;
    }

    function isValidDimension(value) {
        const number = Number(value);

        return (
            value !== "" &&
            Number.isFinite(number) &&
            number >= 0.01 &&
            number <= 10000
        );
    }

    function whatsappLink(product, width = null, height = null) {
        const hasDimensions =
            width !== null &&
            height !== null &&
            isValidDimension(String(width)) &&
            isValidDimension(String(height));

        const message = [
            "مرحباً شركة الفنان للدعاية والإعلان 👋",
            "",
            "أرغب في طلب المنتج التالي:",
            "",
            `📦 اسم المنتج: ${product.name}`,
            `🏷️ القسم: ${product.categoryName}`,
            "",
            hasDimensions ? "📏 المقاسات المطلوبة:" : "",
            hasDimensions ? `العرض: ${width} متر` : "",
            hasDimensions ? `الارتفاع: ${height} متر` : "",
            hasDimensions
                ? `المساحة الإجمالية: ${(width * height).toFixed(2)} م²`
                : "",
            "",
            `💰 السعر المعروض: ${formatPrice(product.price)} ر.س`,
            `🖼️ صورة المنتج: ${getImageUrl(product.image)}`,
            "",
            "أرجو تأكيد السعر النهائي حسب المقاسات والمواصفات المطلوبة.",
            "وأرجو توضيح مدة التنفيذ والتوفر.",
            "",
            "شكراً لكم."
        ].filter(Boolean).join("\n");

        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    }

    function getFilteredProducts() {
        const query = (search?.value || "").trim().toLocaleLowerCase("ar");

        let result = products.filter(product => {
            const matchesCategory =
                activeCategory === "all" ||
                product.category === activeCategory;

            const matchesSearch =
                product.name.toLocaleLowerCase("ar").includes(query) ||
                product.categoryName.toLocaleLowerCase("ar").includes(query) ||
                product.description.toLocaleLowerCase("ar").includes(query);

            return matchesCategory && matchesSearch;
        });

        const sorting = sort?.value || "default";

        if (sorting === "price-low") {
            result.sort((a, b) => a.price - b.price);
        }

        if (sorting === "price-high") {
            result.sort((a, b) => b.price - a.price);
        }

        if (sorting === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name, "ar"));
        }

        return result;
    }

    function createDimensions(product, onChange = null) {
        const dimensions = document.createElement("div");
        dimensions.className = "product-card-dimensions";

        dimensions.innerHTML = `
            <label class="product-dimensions-label">
                <i class="fas fa-ruler-combined"></i>
                المقاس المطلوب بالمتر
            </label>

            <div class="product-dimensions-fields">
                <div class="product-dimension-field">
                    <span>العرض</span>
                    <div class="product-dimension-input">
                        <input
                            type="number"
                            class="product-width"
                            min="0.01"
                            max="10000"
                            step="any"
                            placeholder="1.00"
                            inputmode="decimal"
                            aria-label="عرض المنتج بالمتر"
                        >
                        <span>م</span>
                    </div>
                </div>

                <span class="product-dimensions-x">×</span>

                <div class="product-dimension-field">
                    <span>الارتفاع</span>
                    <div class="product-dimension-input">
                        <input
                            type="number"
                            class="product-height"
                            min="0.01"
                            max="10000"
                            step="any"
                            placeholder="2.00"
                            inputmode="decimal"
                            aria-label="ارتفاع المنتج بالمتر"
                        >
                        <span>م</span>
                    </div>
                </div>
            </div>

            <div class="product-dimensions-area">
                <span>المساحة الإجمالية</span>
                <strong class="product-area-value">— م²</strong>
            </div>
        `;

        const widthInput = $(".product-width", dimensions);
        const heightInput = $(".product-height", dimensions);
        const areaValue = $(".product-area-value", dimensions);

        function getValues() {
            const width = Number(widthInput.value);
            const height = Number(heightInput.value);

            const valid =
                isValidDimension(widthInput.value) &&
                isValidDimension(heightInput.value);

            return {
                width,
                height,
                area: valid ? width * height : 0,
                valid
            };
        }

        function updateArea() {
            const values = getValues();

            areaValue.textContent = values.valid
                ? `${values.area.toFixed(2)} م²`
                : "— م²";

            if (typeof onChange === "function") {
                onChange(values);
            }
        }

        widthInput.addEventListener("input", updateArea);
        heightInput.addEventListener("input", updateArea);

        function validate() {
            if (!isValidDimension(widthInput.value)) {
                widthInput.setCustomValidity("أدخل عرضاً صحيحاً بالمتر أكبر من صفر");
                widthInput.reportValidity();
                widthInput.focus();
                widthInput.addEventListener("input", () => {
                    widthInput.setCustomValidity("");
                }, { once: true });
                return false;
            }

            if (!isValidDimension(heightInput.value)) {
                heightInput.setCustomValidity("أدخل ارتفاعاً صحيحاً بالمتر أكبر من صفر");
                heightInput.reportValidity();
                heightInput.focus();
                heightInput.addEventListener("input", () => {
                    heightInput.setCustomValidity("");
                }, { once: true });
                return false;
            }

            return true;
        }

        return {
            element: dimensions,
            getValues,
            validate,
            widthInput,
            heightInput
        };
    }

    function createCard(product) {
        const card = document.createElement("article");
        card.className = "product-card";

        const detailsUrl = `product-detail.html?id=${product.id}`;

        card.style.cursor = "pointer";

        card.addEventListener("click", event => {
            if (event.target.closest("a, button, input, select, textarea, label")) {
                return;
            }

            window.location.href = detailsUrl;
        });

        const imageWrap = document.createElement("div");
        imageWrap.className = "product-card-image";

        const imageLink = document.createElement("a");
        imageLink.href = detailsUrl;
        imageLink.className = "product-card-image-link";
        imageLink.setAttribute("aria-label", `عرض تفاصيل ${product.name}`);

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.onerror = () => {
            image.onerror = null;
            image.src = "assets/images/product-placeholder.jpg";
        };

        imageLink.appendChild(image);
        imageWrap.appendChild(imageLink);

        if (product.badge) {
            const badge = document.createElement("span");
            badge.className = "product-card-badge";
            badge.textContent = product.badge;
            imageWrap.appendChild(badge);
        }

        const quick = document.createElement("a");
        quick.className = "product-card-quick";
        quick.href = detailsUrl;
        quick.setAttribute("aria-label", `تفاصيل ${product.name}`);
        quick.innerHTML = '<i class="fas fa-eye"></i>';

        imageWrap.appendChild(quick);

        const content = document.createElement("div");
        content.className = "product-card-content";

        const category = document.createElement("div");
        category.className = "product-card-category";
        category.textContent = product.categoryName;

        const title = document.createElement("h3");
        title.className = "product-card-title";

        const titleLink = document.createElement("a");
        titleLink.href = detailsUrl;
        titleLink.textContent = product.name;
        titleLink.style.color = "inherit";
        titleLink.style.textDecoration = "none";

        title.appendChild(titleLink);

        const description = document.createElement("p");
        description.className = "product-card-description";
        description.textContent = product.description;

        const priceRow = document.createElement("div");
        priceRow.className = "product-card-price-row";

        const priceLabel = document.createElement("span");
        priceLabel.className = "product-card-price-label";
        priceLabel.textContent = "السعر يبدأ من";

        const price = document.createElement("strong");
        price.className = "product-card-price";
        price.textContent = `${formatPrice(product.price)} ر.س`;

        priceRow.append(priceLabel, price);

 
        const whatsapp = document.createElement("a");
        whatsapp.className = "product-card-whatsapp";
        whatsapp.href = whatsappLink(product);
        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";

        whatsapp.innerHTML = `
            <i class="fa-brands fa-whatsapp"></i>
            <span>اطلب عبر واتساب</span>
            <i class="fas fa-arrow-up-left"></i>
        `;

        whatsapp.addEventListener("click", event => {
          

 
            whatsapp.href = whatsappLink(product, width, height);
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

    function renderProducts() {
        if (!grid) return;

        const filtered = getFilteredProducts();
        const totalPages = Math.ceil(filtered.length / perPage);

        if (currentPage > totalPages) {
            currentPage = Math.max(1, totalPages);
        }

        const start = (currentPage - 1) * perPage;
        const visible = filtered.slice(start, start + perPage);

        grid.replaceChildren();

        visible.forEach(product => {
            grid.appendChild(createCard(product));
        });

        grid.classList.toggle("list-view", activeView === "list");

        if (count) {
            count.textContent = filtered.length;
        }

        if (empty) {
            empty.hidden = filtered.length !== 0;
        }

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        if (!pagination) return;

        pagination.replaceChildren();

        if (totalPages <= 1) return;

        function addButton(label, page, disabled = false, active = false) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.disabled = disabled;
            button.classList.toggle("active", active);

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

        addButton("السابق", currentPage - 1, currentPage === 1);

        for (let i = 1; i <= totalPages; i++) {
            addButton(String(i), i, false, currentPage === i);
        }

        addButton("التالي", currentPage + 1, currentPage === totalPages);
    }

    function updateCategory(category) {
        if (!categoryDescriptions[category]) {
            category = "all";
        }

        activeCategory = category;
        currentPage = 1;

        const data = categoryDescriptions[category];

        if (categoryTitle) {
            categoryTitle.textContent = data.title;
        }

        if (categoryDescription) {
            categoryDescription.textContent = data.description;
        }

        $$("#productsCategories button").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.category === category
            );
        });

        $("#productsSidebar")?.classList.remove("mobile-open");

        renderProducts();
    }

    function openProductModal(product) {
        const modalElement = $("#productDetailsModal");

        if (!modalElement || typeof bootstrap === "undefined") {
            return;
        }

        const modalImage = $("#productModalImage");
        const modalCategory = $("#productModalCategory");
        const modalTitle = $("#productModalTitle");
        const modalDescription = $("#productModalDescription");
        const modalPrice = $("#productModalPrice");
        const modalWhatsapp = $("#productModalWhatsapp");

        if (modalImage) {
            modalImage.src = product.image;
            modalImage.alt = product.name;
        }

        if (modalCategory) {
            modalCategory.textContent = product.categoryName;
        }

        if (modalTitle) {
            modalTitle.textContent = product.name;
        }

        if (modalDescription) {
            modalDescription.textContent = product.description;
        }

        if (modalPrice) {
            modalPrice.textContent = `${formatPrice(product.price)} ر.س`;
        }

        const modalInfo = $(".products-modal-info", modalElement);

        if (modalInfo) {
            $(".product-card-dimensions", modalInfo)?.remove();

            const dimensions = createDimensions(product);

            if (modalWhatsapp) {
                modalWhatsapp.before(dimensions.element);
                modalWhatsapp.href = whatsappLink(product);

                modalWhatsapp.onclick = event => {
                    if (!dimensions.validate()) {
                        event.preventDefault();
                        return;
                    }

                    const { width, height } = dimensions.getValues();

                    modalWhatsapp.href = whatsappLink(product, width, height);
                };
            }
        }

        bootstrap.Modal.getOrCreateInstance(modalElement).show();
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
                item.classList.toggle("active", item === button);
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

        const isOpen = sidebar.classList.toggle("mobile-open");

        if (isOpen) {
            sidebar.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });

    $("#productsMobileToggle")?.addEventListener("click", () => {
        $(".products-header-nav")?.classList.toggle("active");
    });

    const allCategoryCount = $("#allCategoryCount");

    if (allCategoryCount) {
        allCategoryCount.textContent = products.length;
    }

    const productsYear = $("#productsYear");

    if (productsYear) {
        productsYear.textContent = new Date().getFullYear();
    }

    const currentYear = $("#currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    const initialCategory = new URLSearchParams(window.location.search).get("category");

    if (grid) {
        if (initialCategory && categoryDescriptions[initialCategory]) {
            updateCategory(initialCategory);
        } else {
            renderProducts();
        }
    }

    const contactForm = document.getElementById("contactForm");
    const contactFormStatus = document.getElementById("contactFormStatus");

    const contactWhatsAppNumber = "966545953908";

    if (contactForm && !contactForm.dataset.whatsappBound) {
        contactForm.dataset.whatsappBound = "true";

        contactForm.addEventListener("submit", event => {
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

    const yearElement = document.getElementById("alfFooterYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

const backToTop = document.getElementById("backToTop");

if (backToTop) {
    const toggleBackToTop = () => {
        backToTop.classList.toggle("show", window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleBackToTop, { passive: true });

    toggleBackToTop();

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            easing: "ease-out-cubic",
            once: true,
            offset: 80
        });
    }
});
