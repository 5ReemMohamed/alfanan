
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const switcher = document.getElementById("languageSwitcher");
    const toggle = document.getElementById("languageSwitcherBtn");
    const flag = document.getElementById("currentLangFlag");
    const code = document.getElementById("currentLangCode");
    const options = document.querySelectorAll(".language-option");

    const languages = {
        ar: {
            flag: "🇸🇦",
            code: "AR",
            dir: "rtl"
        },
        en: {
            flag: "🇺🇸",
            code: "EN",
            dir: "ltr"
        }
    };

    const translations = {};

    const savedLang = localStorage.getItem("siteLanguage");
    const urlLang = new URLSearchParams(window.location.search).get("lang");

    let currentLang = languages[urlLang]
        ? urlLang
        : languages[savedLang]
            ? savedLang
            : "ar";

    let requestId = 0;

    function getTranslation(data, key) {
        return key.split(".").reduce(
            (value, part) => value?.[part],
            data
        );
    }

    async function loadTranslations(lang) {
        if (translations[lang]) {
            return translations[lang];
        }

        const response = await fetch(`lang/${lang}.json`);

        if (!response.ok) {
            throw new Error(`Failed to load ${lang}.json`);
        }

        const data = await response.json();

        translations[lang] = data;

        return data;
    }

    function translatePage(data) {
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const value = getTranslation(data, element.dataset.i18n);

            if (typeof value === "string") {
                element.textContent = value;
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
            const value = getTranslation(
                data,
                element.dataset.i18nPlaceholder
            );

            if (typeof value === "string") {
                element.placeholder = value;
            }
        });

        document.querySelectorAll("[data-i18n-title]").forEach(element => {
            const value = getTranslation(
                data,
                element.dataset.i18nTitle
            );

            if (typeof value === "string") {
                element.title = value;
            }
        });

        const title = getTranslation(data, "meta.title");
        const description = getTranslation(data, "meta.description");

        if (typeof title === "string") {
            document.title = title;
        }

        const meta = document.querySelector('meta[name="description"]');

        if (meta && typeof description === "string") {
            meta.setAttribute("content", description);
        }
    }

    function updateSwitcher(lang) {
        if (flag) {
            flag.textContent = languages[lang].flag;
        }

        if (code) {
            code.textContent = languages[lang].code;
        }

        options.forEach(option => {
            const active = option.dataset.lang === lang;

            option.classList.toggle("active", active);
            option.setAttribute("aria-pressed", String(active));
        });

        switcher?.classList.remove("open");

        toggle?.setAttribute("aria-expanded", "false");
    }

    function updateDocumentLanguage(lang) {
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("dir", languages[lang].dir);

        document.body.classList.toggle("lang-en", lang === "en");
        document.body.classList.toggle("lang-ar", lang === "ar");
    }

    function updateLanguageStorage(lang) {
        localStorage.setItem("siteLanguage", lang);

        const url = new URL(window.location.href);

        url.searchParams.set("lang", lang);

        window.history.replaceState(null, "", url);
    }

    function notifyLanguageChanged(lang, data) {
        window.dispatchEvent(
            new CustomEvent("languageChanged", {
                detail: {
                    lang,
                    translations: data
                }
            })
        );

        document.dispatchEvent(
            new CustomEvent("languageChanged", {
                detail: {
                    lang,
                    translations: data
                }
            })
        );
    }

    async function setLanguage(lang) {
        if (!languages[lang]) {
            return;
        }

        const id = ++requestId;

        try {
            const data = await loadTranslations(lang);

            if (id !== requestId) {
                return;
            }

            currentLang = lang;

            updateDocumentLanguage(lang);

            translatePage(data);

            updateSwitcher(lang);

            updateLanguageStorage(lang);

            notifyLanguageChanged(lang, data);

        } catch (error) {
            console.error("Language loading error:", error);
        }
    }

    toggle?.addEventListener("click", event => {
        event.stopPropagation();

        if (!switcher) {
            return;
        }

        const isOpen = switcher.classList.toggle("open");

        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    options.forEach(option => {
        option.addEventListener("click", event => {
            event.preventDefault();

            const selectedLanguage = option.dataset.lang;

            if (!languages[selectedLanguage]) {
                return;
            }

            setLanguage(selectedLanguage);
        });
    });

    document.addEventListener("click", event => {
        if (!switcher?.contains(event.target)) {
            switcher?.classList.remove("open");
            toggle?.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            switcher?.classList.remove("open");
            toggle?.setAttribute("aria-expanded", "false");
        }
    });

    window.setSiteLanguage = setLanguage;

    window.getSiteLanguage = () => currentLang;

    setLanguage(currentLang);
});
