
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const whatsappNumber = "966545953908";
    const products = Array.isArray(window.products) ? window.products : [];

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const product = products.find(item => String(item.id) === productId);

    const getLang = () =>
        document.documentElement.lang === "en" ? "en" : "ar";

    const isEnglish = () => getLang() === "en";

    const translations = {
        ar: null,
        en: null
    };

    let currentTranslations = null;
    let languageRequestId = 0;

    function getTranslation(key, fallback = "") {
        const value = key.split(".").reduce(
            (result, part) => result?.[part],
            currentTranslations
        );

        return typeof value === "string" ? value : fallback;
    }

    function productText(item, key) {
        const englishKey = `${key}En`;

        if (
            isEnglish() &&
            typeof item[englishKey] === "string" &&
            item[englishKey].trim()
        ) {
            return item[englishKey];
        }

        return item[key] || "";
    }

    function setText(selector, value) {
        const element = $(selector);

        if (element) {
            element.textContent = value;
        }
    }

    function formatPrice(value) {
        return Number(value || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function getImageUrl(path) {
        if (!path) return "";

        try {
            return new URL(path, window.location.href).href;
        } catch {
            return path;
        }
    }

    function getCurrency() {
        return getTranslation(
            "productDetail.currency",
            isEnglish() ? "SAR" : "ر.س"
        );
    }

    async function loadDetailTranslations(lang) {
        if (translations[lang]) {
            return translations[lang];
        }

        const response = await fetch(`lang/${lang}.json`);

        if (!response.ok) {
            throw new Error(`Unable to load lang/${lang}.json`);
        }

        const data = await response.json();

        translations[lang] = data;

        return data;
    }

    function updateAccessibleLabels() {
        const labels = [
            ["#alfDetailZoom", "productDetail.gallery.zoom"],
            ["#alfDetailPrev", "productDetail.gallery.previous"],
            ["#alfDetailNext", "productDetail.gallery.next"],
            [".alf-detail-lightbox-close", "productDetail.gallery.close"]
        ];

        labels.forEach(([selector, key]) => {
            const element = $(selector);
            const label = getTranslation(key);

            if (element && label) {
                element.setAttribute("aria-label", label);
                element.setAttribute("title", label);
            }
        });
    }

    const menuToggle = $("#alfDetailMenuToggle");
    const nav = $("#alfDetailNav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            const icon = $("i", menuToggle);

            if (icon) {
                icon.className = isOpen
                    ? "fas fa-xmark"
                    : "fas fa-bars";
            }
        });

        $$("a", nav).forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                const icon = $("i", menuToggle);

                if (icon) {
                    icon.className = "fas fa-bars";
                }
            });
        });
    }

    setText("#alfDetailYear", new Date().getFullYear());

    function showNotFound() {
        const title = getTranslation(
            "productDetail.notFound.title",
            isEnglish()
                ? "Product Not Found"
                : "المنتج غير موجود"
        );

        const companyName = getTranslation(
            "productDetail.companyName",
            isEnglish()
                ? "Al Fannan Advertising"
                : "شركة الفنان للدعاية والإعلان"
        );

        document.title = `${title} | ${companyName}`;

        setText("#alfBreadcrumbTitle", title);
        setText("#alfBreadcrumbCurrent", title);

        const section = $(".alf-detail-product-section");

        if (section) {
            let heading = $("#alfNotFoundHeading");

            if (!heading) {
                section.innerHTML = `
                    <div class="container text-center py-5">
                        <div style="font-size:65px;color:#8e7052;margin-bottom:20px">
                            <i class="fas fa-box-open"></i>
                        </div>
                        <h2 id="alfNotFoundHeading" style="font-weight:900;margin-bottom:15px"></h2>
                        <p id="alfNotFoundDescription" style="color:#73716c;margin-bottom:25px"></p>
                        <a href="products.html" id="alfNotFoundLink" class="btn px-4 py-3" style="background:#8e7052;color:white;border-radius:10px"></a>
                    </div>
                `;
            }

            setText(
                "#alfNotFoundHeading",
                getTranslation(
                    "productDetail.notFound.heading",
                    title
                )
            );

            setText(
                "#alfNotFoundDescription",
                getTranslation(
                    "productDetail.notFound.description",
                    isEnglish()
                        ? "Return to the products page to choose another product."
                        : "يمكنك العودة إلى صفحة المنتجات واختيار منتج آخر."
                )
            );

            setText(
                "#alfNotFoundLink",
                getTranslation(
                    "productDetail.related.viewAll",
                    isEnglish()
                        ? "View All Products"
                        : "عرض جميع المنتجات"
                )
            );
        }

        $(".alf-detail-tabs-section")?.remove();
        $(".alf-detail-related-section")?.remove();
    }

    if (!product) {
        async function updateNotFound(data = null) {
            const lang = getLang();
            const requestId = ++languageRequestId;

            try {
                const loaded =
                    data || await loadDetailTranslations(lang);

                if (requestId !== languageRequestId) return;
                if (lang !== getLang()) return;

                currentTranslations = loaded;
                translations[lang] = loaded;
            } catch (error) {
                console.error(error);
            }

            showNotFound();
        }

        window.addEventListener("languageChanged", event => {
            updateNotFound(event.detail?.translations || null);
        });

        document.addEventListener("languageChanged", event => {
            updateNotFound(event.detail?.translations || null);
        });

        updateNotFound();

        return;
    }

    const images = [
        ...new Set(
            (
                Array.isArray(product.images) &&
                product.images.length
                    ? product.images
                    : [product.image]
            ).filter(
                src =>
                    typeof src === "string" &&
                    src.trim()
            )
        )
    ];

    let activeImageIndex = 0;
    let touchStartX = 0;

    const mainImage = $("#alfDetailMainImage");
    const thumbnailsContainer = $("#alfDetailThumbnails");
    const lightboxElement = $("#alfDetailLightbox");
    const lightboxImage = $("#alfDetailLightboxImage");

    function fillProductDetails() {
        const name = productText(product, "name");
        const category = productText(product, "categoryName");
        const description = productText(product, "description");
        const sku = product.sku || String(product.id);

        const companyName = getTranslation(
            "productDetail.companyName",
            isEnglish()
                ? "Al Fannan Advertising"
                : "شركة الفنان للدعاية والإعلان"
        );

        document.title = `${name} | ${companyName}`;

        setText("#alfBreadcrumbTitle", name);
        setText("#alfBreadcrumbCurrent", name);
        setText("#alfDetailCategory", category);
        setText("#alfDetailCode", `SKU: ${sku}`);
        setText("#alfDetailTitle", name);
        setText("#alfDetailShortDescription", description);
        setText("#alfDetailMetaCategory", category);
        setText("#alfDetailMetaSku", sku);
        setText("#alfDetailFullDescription", description);
        setText("#alfSpecName", name);
        setText("#alfSpecCategory", category);
        setText("#alfSpecSku", sku);

        const priceElement = $("#alfDetailPrice");

        if (priceElement) {
            priceElement.replaceChildren(
                document.createTextNode(
                    `${formatPrice(product.price)} `
                )
            );

            const currency = document.createElement("small");

            currency.textContent = getCurrency();

            priceElement.appendChild(currency);
        }

        if (mainImage) {
            mainImage.alt = name;
        }

        const metaDescription = $('meta[name="description"]');

        if (metaDescription) {
            metaDescription.content = description;
        }
    }

    function getImageAlt(index) {
        const imageLabel = getTranslation(
            "productDetail.gallery.image",
            isEnglish() ? "Image" : "صورة"
        );

        return `${productText(product, "name")} - ${imageLabel} ${index + 1}`;
    }

    function updateLightboxImage() {
        if (!lightboxImage || !images.length) return;

        lightboxImage.src = images[activeImageIndex];
        lightboxImage.alt = getImageAlt(activeImageIndex);
    }

    function showImage(index) {
        if (!images.length) return;

        activeImageIndex =
            ((index % images.length) + images.length) %
            images.length;

        if (mainImage) {
            mainImage.src = images[activeImageIndex];
            mainImage.alt = getImageAlt(activeImageIndex);
        }

        setText(
            "#alfDetailCurrentImage",
            String(activeImageIndex + 1).padStart(2, "0")
        );

        setText(
            "#alfDetailTotalImages",
            String(images.length).padStart(2, "0")
        );

        $$("#alfDetailThumbnails button").forEach(
            (button, index) => {
                const isActive = index === activeImageIndex;

                button.classList.toggle(
                    "active",
                    isActive
                );

                button.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            }
        );

        if (lightboxElement?.classList.contains("show")) {
            updateLightboxImage();
        }
    }

    function renderThumbnails() {
        if (!thumbnailsContainer) {
            showImage(activeImageIndex);
            return;
        }

        thumbnailsContainer.replaceChildren();

        images.forEach((src, index) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "alf-detail-thumbnail";

            const viewImageText = getTranslation(
                "productDetail.gallery.viewImage",
                isEnglish() ? "View Image" : "عرض صورة"
            );

            button.setAttribute(
                "aria-label",
                `${viewImageText} ${index + 1} / ${images.length}`
            );

            button.setAttribute("aria-pressed", "false");

            const image = document.createElement("img");

            image.src = src;
            image.alt = getImageAlt(index);
            image.loading = index === 0 ? "eager" : "lazy";

            button.appendChild(image);

            button.addEventListener("click", () => {
                showImage(index);
            });

            thumbnailsContainer.appendChild(button);
        });

        showImage(activeImageIndex);
    }

    function nextImage() {
        showImage(activeImageIndex + 1);
    }

    function previousImage() {
        showImage(activeImageIndex - 1);
    }

    $("#alfDetailPrev")?.addEventListener(
        "click",
        previousImage
    );

    $("#alfDetailNext")?.addEventListener(
        "click",
        nextImage
    );

    $("#alfDetailZoom")?.addEventListener("click", () => {
        if (
            !lightboxElement ||
            !lightboxImage ||
            !images.length ||
            typeof bootstrap === "undefined"
        ) {
            return;
        }

        updateLightboxImage();

        bootstrap.Modal
            .getOrCreateInstance(lightboxElement)
            .show();
    });

    mainImage?.addEventListener(
        "touchstart",
        event => {
            touchStartX =
                event.changedTouches[0].screenX;
        },
        { passive: true }
    );

    mainImage?.addEventListener(
        "touchend",
        event => {
            const difference =
                touchStartX -
                event.changedTouches[0].screenX;

            if (Math.abs(difference) < 50) return;

            if (difference > 0) {
                nextImage();
            } else {
                previousImage();
            }
        },
        { passive: true }
    );

    document.addEventListener("keydown", event => {
        const target = event.target;

        if (
            target instanceof HTMLElement &&
            target.closest(
                "input, textarea, select, [contenteditable='true']"
            )
        ) {
            return;
        }

        if (event.key === "ArrowRight") {
            isEnglish()
                ? nextImage()
                : previousImage();
        }

        if (event.key === "ArrowLeft") {
            isEnglish()
                ? previousImage()
                : nextImage();
        }
    });

    const notesInput = $("#alfDetailNotes");
    const whatsappButton = $("#alfDetailWhatsapp");

    function buildWhatsappMessage() {
        const notes = notesInput?.value.trim() || "";

        const imageUrl = getImageUrl(
            images[activeImageIndex] || product.image
        );

        const name = productText(product, "name");
        const category = productText(product, "categoryName");
        const sku = product.sku || product.id;

        const lines = [
            getTranslation(
                "productDetail.whatsappMessage.greeting",
                isEnglish()
                    ? "Hello Al Fannan Advertising 👋"
                    : "مرحباً شركة الفنان للدعاية والإعلان 👋"
            ),
            "",
            getTranslation(
                "productDetail.whatsappMessage.intro",
                isEnglish()
                    ? "I would like to order the following product:"
                    : "أرغب في طلب المنتج التالي:"
            ),
            "",
            `📦 ${getTranslation(
                "productDetail.whatsappMessage.product",
                isEnglish() ? "Product Name" : "اسم المنتج"
            )}: ${name}`,
            `🏷️ ${getTranslation(
                "productDetail.whatsappMessage.sku",
                isEnglish() ? "Product ID" : "رقم المنتج"
            )}: ${sku}`,
            `📂 ${getTranslation(
                "productDetail.whatsappMessage.category",
                isEnglish() ? "Category" : "القسم"
            )}: ${category}`,
            "",
            `💰 ${getTranslation(
                "productDetail.whatsappMessage.price",
                isEnglish() ? "Listed Price" : "السعر المعروض"
            )}: ${formatPrice(product.price)} ${getCurrency()}`,
            "",
            notes
                ? `📝 ${getTranslation(
                    "productDetail.whatsappMessage.notes",
                    isEnglish() ? "Notes" : "ملاحظات"
                )}:\n${notes}`
                : "",
            imageUrl
                ? `🖼️ ${getTranslation(
                    "productDetail.whatsappMessage.image",
                    isEnglish() ? "Product Image" : "صورة المنتج"
                )}: ${imageUrl}`
                : "",
            "",
            getTranslation(
                "productDetail.whatsappMessage.confirm",
                isEnglish()
                    ? "Please confirm the final product price."
                    : "أرجو تأكيد السعر النهائي للمنتج."
            ),
            getTranslation(
                "productDetail.whatsappMessage.delivery",
                isEnglish()
                    ? "Please also confirm availability and production time."
                    : "وأرجو توضيح مدة التنفيذ والتوفر."
            ),
            "",
            getTranslation(
                "productDetail.whatsappMessage.thanks",
                isEnglish() ? "Thank you." : "شكراً لكم."
            )
        ];

        return lines.filter(Boolean).join("\n");
    }

    whatsappButton?.addEventListener("click", event => {
        event.preventDefault();

        const message = buildWhatsappMessage();

        const url =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    });

    $$(".alf-detail-tabs button").forEach(button => {
        button.addEventListener("click", () => {
            const tab = button.dataset.tab;

            $$(".alf-detail-tabs button").forEach(item => {
                const active = item === button;

                item.classList.toggle(
                    "active",
                    active
                );

                item.setAttribute(
                    "aria-selected",
                    String(active)
                );
            });

            $$(".alf-detail-tab-content").forEach(panel => {
                panel.classList.toggle(
                    "active",
                    panel.id === `alfTab-${tab}`
                );
            });
        });
    });

    function renderRelatedProducts() {
        const container = $("#alfDetailRelatedProducts");

        if (!container) return;

        const related = products
            .filter(
                item =>
                    String(item.id) !== String(product.id)
            )
            .sort((a, b) => {
                const aMatch =
                    a.category === product.category ? 0 : 1;

                const bMatch =
                    b.category === product.category ? 0 : 1;

                return aMatch - bMatch;
            })
            .slice(0, 4);

        container.replaceChildren();

        related.forEach(item => {
            const col = document.createElement("div");

            col.className = "col-md-6 col-lg-3";

            const card = document.createElement("article");

            card.className = "alf-detail-related-card";

            const imageWrap = document.createElement("div");

            imageWrap.className = "alf-detail-related-image";

            const imageLink = document.createElement("a");

            imageLink.href =
                `product-detail.html?id=${encodeURIComponent(item.id)}`;

            imageLink.setAttribute(
                "aria-label",
                `${getTranslation(
                    "productDetail.related.viewDetails",
                    isEnglish()
                        ? "View Details"
                        : "عرض التفاصيل"
                )} ${productText(item, "name")}`
            );

            const image = document.createElement("img");

            image.src = item.image;
            image.alt = productText(item, "name");
            image.loading = "lazy";

            imageLink.appendChild(image);
            imageWrap.appendChild(imageLink);

            const content = document.createElement("div");

            content.className = "alf-detail-related-content";

            const category = document.createElement("span");

            category.textContent =
                productText(item, "categoryName");

            const title = document.createElement("h3");

            title.textContent = productText(item, "name");

            const price = document.createElement("strong");

            price.textContent =
                `${formatPrice(item.price)} ${getCurrency()}`;

            const link = document.createElement("a");

            link.href = imageLink.href;

            const linkText = document.createElement("span");

            linkText.textContent = getTranslation(
                "productDetail.related.viewDetails",
                isEnglish()
                    ? "View Details"
                    : "عرض التفاصيل"
            );

            const icon = document.createElement("i");

            icon.className = isEnglish()
                ? "fas fa-arrow-right"
                : "fas fa-arrow-left";

            link.append(linkText, icon);

            content.append(
                category,
                title,
                price,
                link
            );

            card.append(
                imageWrap,
                content
            );

            col.appendChild(card);
            container.appendChild(col);
        });
    }

    function renderProductVideo() {
        const section = $("#alfProductVideo");
        const frame = $("#alfProductVideoFrame");
        const link = $("#alfProductVideoLink");

        if (!section || !frame || !link) return;

        section.hidden = true;

        frame.replaceChildren();
        frame.classList.remove("is-tiktok");

        const videoUrl = product.videoUrl?.trim();

        if (!videoUrl) return;

        let url;

        try {
            url = new URL(videoUrl);
        } catch {
            return;
        }

        if (url.protocol !== "https:") return;

        const host = url.hostname.toLowerCase();

        let embedUrl = "";

        if (
            host === "youtube.com" ||
            host === "www.youtube.com" ||
            host === "m.youtube.com" ||
            host === "youtu.be"
        ) {
            let videoId = "";

            if (host === "youtu.be") {
                videoId = url.pathname.split("/")[1];
            } else if (url.pathname === "/watch") {
                videoId = url.searchParams.get("v");
            } else {
                videoId = url.pathname.match(
                    /^\/(?:shorts|embed|live)\/([a-zA-Z0-9_-]{11})/
                )?.[1] || "";
            }

            if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
                embedUrl =
                    `https://www.youtube-nocookie.com/embed/${videoId}`;
            }
        }

        if (
            host === "tiktok.com" ||
            host === "www.tiktok.com" ||
            host === "m.tiktok.com"
        ) {
            const videoId = url.pathname.match(
                /\/video\/(\d+)/
            )?.[1];

            if (videoId) {
                embedUrl =
                    `https://www.tiktok.com/player/v1/${videoId}`;

                frame.classList.add("is-tiktok");
            }
        }

        if (!embedUrl) return;

        const iframe = document.createElement("iframe");

        iframe.src = embedUrl;

        iframe.title =
            `${getTranslation(
                "productDetail.video.iframeTitle",
                isEnglish() ? "Video of" : "فيديو"
            )} ${productText(product, "name")}`;

        iframe.loading = "lazy";

        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

        iframe.allowFullscreen = true;

        iframe.referrerPolicy =
            "strict-origin-when-cross-origin";

        frame.appendChild(iframe);

        link.href = videoUrl;

        section.hidden = false;
    }

    function refreshProductLanguage() {
        fillProductDetails();
        renderThumbnails();
        renderRelatedProducts();
        updateAccessibleLabels();

        const iframe = $("#alfProductVideoFrame iframe");

        if (iframe) {
            iframe.title =
                `${getTranslation(
                    "productDetail.video.iframeTitle",
                    isEnglish() ? "Video of" : "فيديو"
                )} ${productText(product, "name")}`;
        }
    }

    async function applyLanguage(lang, data = null) {
        const requestId = ++languageRequestId;

        try {
            const loaded =
                data || await loadDetailTranslations(lang);

            if (requestId !== languageRequestId) return;
            if (lang !== getLang()) return;

            currentTranslations = loaded;
            translations[lang] = loaded;

            refreshProductLanguage();
        } catch (error) {
            console.error(
                "Product detail translation error:",
                error
            );
        }
    }

    const handleLanguageChanged = event => {
        const lang = event.detail?.lang || getLang();
        const data = event.detail?.translations || null;

        applyLanguage(lang, data);
    };

    window.addEventListener(
        "languageChanged",
        handleLanguageChanged
    );

    document.addEventListener(
        "languageChanged",
        handleLanguageChanged
    );

    let lastObservedLanguage = getLang();

    const languageObserver = new MutationObserver(() => {
        const lang = getLang();

        if (lang === lastObservedLanguage) return;

        lastObservedLanguage = lang;

        applyLanguage(lang);
    });

    languageObserver.observe(
        document.documentElement,
        {
            attributes: true,
            attributeFilter: ["lang"]
        }
    );

    fillProductDetails();
    renderThumbnails();
    renderRelatedProducts();
    renderProductVideo();

    applyLanguage(getLang());
});
