
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const whatsappNumber = "966545953908";
    const products = Array.isArray(window.products) ? window.products : [];

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));

    const product = products.find(item => Number(item.id) === productId);

    const menuToggle = $("#alfDetailMenuToggle");
    const nav = $("#alfDetailNav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", String(isOpen));

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
                menuToggle.setAttribute("aria-expanded", "false");

                const icon = $("i", menuToggle);

                if (icon) {
                    icon.className = "fas fa-bars";
                }
            });
        });
    }

    const year = $("#alfDetailYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    function setText(selector, value) {
        const element = $(selector);

        if (element) {
            element.textContent = value;
        }
    }

    function formatPrice(value) {
        return Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function getImageUrl(path) {
        try {
            return new URL(path, window.location.href).href;
        } catch {
            return path || "";
        }
    }

    function showNotFound() {
        document.title = "المنتج غير موجود | شركة الفنان";

        setText("#alfBreadcrumbTitle", "المنتج غير موجود");
        setText("#alfBreadcrumbCurrent", "المنتج غير موجود");

        const section = $(".alf-detail-product-section");

        if (section) {
            section.innerHTML = `
                <div class="container text-center py-5">
                    <div style="font-size:65px;color:#8e7052;margin-bottom:20px">
                        <i class="fas fa-box-open"></i>
                    </div>

                    <h2 style="font-weight:900;margin-bottom:15px">
                        المنتج المطلوب غير موجود
                    </h2>

                    <p style="color:#73716c;margin-bottom:25px">
                        يمكنك العودة إلى صفحة المنتجات واختيار منتج آخر.
                    </p>

                    <a
                        href="products.html"
                        class="btn px-4 py-3"
                        style="background:#8e7052;color:white;border-radius:10px"
                    >
                        عرض جميع المنتجات
                    </a>
                </div>
            `;
        }

        $(".alf-detail-tabs-section")?.remove();
        $(".alf-detail-related-section")?.remove();
    }

    if (!product) {
        showNotFound();
        return;
    }

    const images = [
        ...new Set(
            (
                Array.isArray(product.images) && product.images.length
                    ? product.images
                    : [product.image]
            ).filter(src => typeof src === "string" && src.trim())
        )
    ];

    if (!images.length && product.image) {
        images.push(product.image);
    }

    let activeImageIndex = 0;
    let touchStartX = 0;

    const mainImage = $("#alfDetailMainImage");
    const thumbnailsContainer = $("#alfDetailThumbnails");
    const lightboxElement = $("#alfDetailLightbox");
    const lightboxImage = $("#alfDetailLightboxImage");

    function fillProductDetails() {
        document.title =
            `${product.name} | شركة الفنان للدعاية والإعلان`;

        setText("#alfBreadcrumbTitle", product.name);
        setText("#alfBreadcrumbCurrent", product.name);

        setText("#alfDetailCategory", product.categoryName);
        setText("#alfDetailCode", `SKU: ${product.sku || product.id}`);

        setText("#alfDetailTitle", product.name);
        setText("#alfDetailShortDescription", product.description);

        const priceElement = $("#alfDetailPrice");

        if (priceElement) {
            priceElement.innerHTML = `
                ${formatPrice(product.price)}
                <small>ر.س</small>
            `;
        }

        setText("#alfDetailMetaCategory", product.categoryName);
        setText("#alfDetailMetaSku", product.sku || String(product.id));

        setText("#alfDetailFullDescription", product.description);

        setText("#alfSpecName", product.name);
        setText("#alfSpecCategory", product.categoryName);
        setText("#alfSpecSku", product.sku || String(product.id));

        if (mainImage) {
            mainImage.alt = product.name;
        }

        const metaDescription = $('meta[name="description"]');

        if (metaDescription) {
            metaDescription.content = product.description || "";
        }
    }

    function updateLightboxImage() {
        if (!lightboxImage || !images.length) return;

        lightboxImage.src = images[activeImageIndex];
        lightboxImage.alt =
            `${product.name} - صورة ${activeImageIndex + 1}`;
    }

    function showImage(index) {
        if (!images.length) return;

        activeImageIndex =
            ((index % images.length) + images.length) % images.length;

        if (mainImage) {
            mainImage.src = images[activeImageIndex];
            mainImage.alt =
                `${product.name} - صورة ${activeImageIndex + 1}`;
        }

        setText(
            "#alfDetailCurrentImage",
            String(activeImageIndex + 1).padStart(2, "0")
        );

        setText(
            "#alfDetailTotalImages",
            String(images.length).padStart(2, "0")
        );

        $$("#alfDetailThumbnails button").forEach((button, index) => {
            const isActive = index === activeImageIndex;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));

            if (isActive) {
                button.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "nearest"
                });
            }
        });

        if (lightboxElement?.classList.contains("show")) {
            updateLightboxImage();
        }
    }

    function renderThumbnails() {
        if (!thumbnailsContainer) {
            showImage(0);
            return;
        }

        thumbnailsContainer.replaceChildren();

        images.forEach((src, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "alf-detail-thumbnail";

            button.setAttribute(
                "aria-label",
                `عرض صورة ${index + 1} من ${images.length}`
            );

            button.setAttribute("aria-pressed", "false");

            const image = document.createElement("img");
            image.src = src;
            image.alt = `${product.name} - صورة مصغرة ${index + 1}`;
            image.loading = index === 0 ? "eager" : "lazy";

            button.appendChild(image);

            button.addEventListener("click", () => {
                showImage(index);
            });

            thumbnailsContainer.appendChild(button);
        });

        showImage(0);
    }

    function nextImage() {
        showImage(activeImageIndex + 1);
    }

    function previousImage() {
        showImage(activeImageIndex - 1);
    }

    $("#alfDetailPrev")?.addEventListener("click", previousImage);

    $("#alfDetailNext")?.addEventListener("click", nextImage);

    $("#alfDetailZoom")?.addEventListener("click", () => {
        if (
            !lightboxElement ||
            !lightboxImage ||
            typeof bootstrap === "undefined" ||
            !images.length
        ) {
            return;
        }

        updateLightboxImage();

        bootstrap.Modal
            .getOrCreateInstance(lightboxElement)
            .show();
    });

    if (mainImage) {
        mainImage.addEventListener("touchstart", event => {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        mainImage.addEventListener("touchend", event => {
            const touchEndX = event.changedTouches[0].screenX;
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) < 50) return;

            if (difference > 0) {
                nextImage();
            } else {
                previousImage();
            }
        }, { passive: true });
    }

    document.addEventListener("keydown", event => {
        const target = event.target;

        if (
            target instanceof HTMLElement &&
            target.closest("input, textarea, select, [contenteditable='true']")
        ) {
            return;
        }

        if (event.key === "ArrowRight") {
            previousImage();
        }

        if (event.key === "ArrowLeft") {
            nextImage();
        }
    });

    const widthInput = $("#alfDetailWidth");
    const heightInput = $("#alfDetailHeight");
    const areaElement = $("#alfDetailArea");
    const quantityInput = $("#alfDetailQuantity");
    const notesInput = $("#alfDetailNotes");
    const whatsappButton = $("#alfDetailWhatsapp");

    function validDimension(input) {
        if (!input) return false;

        const value = Number(input.value);

        return (
            input.value.trim() !== "" &&
            Number.isFinite(value) &&
            value >= 0.01 &&
            value <= 10000
        );
    }

    function getDimensions() {
        const width = Number(widthInput?.value);
        const height = Number(heightInput?.value);

        const valid =
            validDimension(widthInput) &&
            validDimension(heightInput);

        return {
            width,
            height,
            valid,
            area: valid ? width * height : 0
        };
    }

    function updateArea() {
        if (!areaElement) return;

        const dimensions = getDimensions();

        areaElement.textContent = dimensions.valid
            ? `${dimensions.area.toFixed(2)} م²`
            : "— م²";
    }

    widthInput?.addEventListener("input", () => {
        widthInput.setCustomValidity("");
        updateArea();
    });

    heightInput?.addEventListener("input", () => {
        heightInput.setCustomValidity("");
        updateArea();
    });

    function validateDimensions() {
        if (!widthInput || !heightInput) return false;

        widthInput.setCustomValidity("");
        heightInput.setCustomValidity("");

        if (!validDimension(widthInput)) {
            widthInput.setCustomValidity(
                "يرجى إدخال عرض صحيح بالمتر"
            );

            widthInput.reportValidity();
            widthInput.focus();

            return false;
        }

        if (!validDimension(heightInput)) {
            heightInput.setCustomValidity(
                "يرجى إدخال ارتفاع صحيح بالمتر"
            );

            heightInput.reportValidity();
            heightInput.focus();

            return false;
        }

        return true;
    }

    function getQuantity() {
        if (!quantityInput) return 1;

        const quantity = Number(quantityInput.value);

        if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 9999
        ) {
            return null;
        }

        return quantity;
    }

    $("#alfDetailMinus")?.addEventListener("click", () => {
        if (!quantityInput) return;

        const current = getQuantity() || 1;

        quantityInput.value = Math.max(1, current - 1);
    });

    $("#alfDetailPlus")?.addEventListener("click", () => {
        if (!quantityInput) return;

        const current = getQuantity() || 1;

        quantityInput.value = Math.min(9999, current + 1);
    });

    quantityInput?.addEventListener("input", () => {
        quantityInput.setCustomValidity("");
    });

    quantityInput?.addEventListener("change", () => {
        if (!getQuantity()) {
            quantityInput.value = 1;
        }
    });

    function buildWhatsappMessage() {
        const dimensions = getDimensions();
        const quantity = getQuantity();
        const notes = notesInput?.value.trim() || "";

        return [
            "مرحباً شركة الفنان للدعاية والإعلان 👋",
            "",
            "أرغب في طلب المنتج التالي:",
            "",
            `📦 اسم المنتج: ${product.name}`,
            `🏷️ رقم المنتج: ${product.sku || product.id}`,
            `📂 القسم: ${product.categoryName}`,
            "",
            "📏 المقاسات المطلوبة:",
            `العرض: ${dimensions.width} متر`,
            `الارتفاع: ${dimensions.height} متر`,
            `المساحة الإجمالية: ${dimensions.area.toFixed(2)} م²`,
            "",
            `🔢 الكمية: ${quantity}`,
            `💰 السعر المعروض: ${formatPrice(product.price)} ر.س`,
            "",
            notes ? `📝 ملاحظات:\n${notes}` : "",
            `🖼️ صورة المنتج: ${getImageUrl(images[activeImageIndex] || product.image)}`,
            "",
            "أرجو تأكيد السعر النهائي حسب المقاسات والكمية.",
            "وأرجو توضيح مدة التنفيذ والتوفر.",
            "",
            "شكراً لكم."
        ].filter(Boolean).join("\n");
    }

    whatsappButton?.addEventListener("click", event => {
        event.preventDefault();

        if (!validateDimensions()) return;

        const quantity = getQuantity();

        if (!quantity) {
            if (quantityInput) {
                quantityInput.setCustomValidity(
                    "يرجى إدخال كمية صحيحة من 1 إلى 9999"
                );

                quantityInput.reportValidity();
                quantityInput.focus();
            }

            return;
        }

        const message = buildWhatsappMessage();

        const url =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    });

    $$(".alf-detail-tabs button").forEach(button => {
        button.addEventListener("click", () => {
            const tab = button.dataset.tab;

            $$(".alf-detail-tabs button").forEach(item => {
                const active = item === button;

                item.classList.toggle("active", active);
                item.setAttribute("aria-selected", String(active));
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
            .filter(item => Number(item.id) !== Number(product.id))
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
            imageLink.href = `product-detail.html?id=${item.id}`;
            imageLink.setAttribute(
                "aria-label",
                `عرض تفاصيل ${item.name}`
            );

            const image = document.createElement("img");
            image.src = item.image;
            image.alt = item.name;
            image.loading = "lazy";

            imageLink.appendChild(image);
            imageWrap.appendChild(imageLink);

            const content = document.createElement("div");
            content.className = "alf-detail-related-content";

            const category = document.createElement("span");
            category.textContent = item.categoryName;

            const title = document.createElement("h3");
            title.textContent = item.name;

            const price = document.createElement("strong");
            price.textContent = `${formatPrice(item.price)} ر.س`;

            const link = document.createElement("a");
            link.href = `product-detail.html?id=${item.id}`;

            link.innerHTML = `
                <span>عرض التفاصيل</span>
                <i class="fas fa-arrow-left"></i>
            `;

            content.append(category, title, price, link);
            card.append(imageWrap, content);
            col.appendChild(card);
            container.appendChild(col);
        });
    }

    fillProductDetails();
    renderThumbnails();
    renderRelatedProducts();
    updateArea();
});
