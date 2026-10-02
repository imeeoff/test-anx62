// Тема (светлая/тёмная)
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("anh-theme");
  if (saved) root.setAttribute("data-theme", saved);

  window.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("anh-theme", next);
      });
    }

    // Мобильное меню
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".main-nav");
    if (burger && nav) {
      burger.addEventListener("click", () => nav.classList.toggle("open"));
      nav.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => nav.classList.remove("open"))
      );
    }

    // Модальные окна ("Оставить заявку", "Заказать звонок")
    const modals = document.querySelectorAll(".modal-overlay");
    if (modals.length) {
      const closeAll = () => {
        modals.forEach((m) => m.classList.remove("open"));
        document.body.classList.remove("modal-open");
      };

      modals.forEach((modal) => {
        const openBtns = document.querySelectorAll(`[data-open-modal="${modal.id}"]`);
        const closeBtns = modal.querySelectorAll("[data-close-modal]");

        openBtns.forEach((btn) =>
          btn.addEventListener("click", () => {
            closeAll();
            modal.classList.add("open");
            document.body.classList.add("modal-open");
          })
        );

        closeBtns.forEach((btn) => btn.addEventListener("click", closeAll));

        // Закрытие по клику на затемнённый фон
        modal.addEventListener("click", (e) => {
          if (e.target === modal) closeAll();
        });
      });

      // Закрытие по Esc
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeAll();
      });
    }

    // Подсветка активного пункта меню
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a[data-page]").forEach((a) => {
      if (a.getAttribute("data-page") === path) a.classList.add("active");
    });

    // Лайтбокс для увеличения сканов писем / фото
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
      const lightboxImg = document.getElementById("lightboxImg");
      const triggers = document.querySelectorAll(".lightbox-trigger");

      const openLightbox = (src, alt) => {
        lightboxImg.src = src;
        lightboxImg.alt = alt || "";
        lightbox.classList.add("open");
        document.body.classList.add("modal-open");
      };
      const closeLightbox = () => {
        lightbox.classList.remove("open");
        document.body.classList.remove("modal-open");
      };

      triggers.forEach((img) => {
        img.addEventListener("click", () => {
          openLightbox(img.getAttribute("data-full") || img.src, img.alt);
        });
      });

      lightbox.querySelectorAll("[data-close-lightbox]").forEach((btn) =>
        btn.addEventListener("click", closeLightbox)
      );

      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
      });
    }

    // Аккордеон карточек продукции
    const accordion = document.getElementById("productsAccordion");
    if (accordion) {
      const items = accordion.querySelectorAll(".acc-item");
      items.forEach((item) => {
        const head = item.querySelector(".acc-head");
        head.addEventListener("click", () => {
          const wasOpen = item.classList.contains("open");
          items.forEach((i) => i.classList.remove("open"));
          if (!wasOpen) {
            item.classList.add("open");
            setTimeout(() => {
              item.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 120);
          }
        });
      });
    }

    // Русский текст всплывающих подсказок валидации форм
    document.querySelectorAll("form").forEach((form) => {
      form.querySelectorAll("input, textarea").forEach((field) => {
        const setMessage = () => {
          if (field.validity.valueMissing) {
            field.setCustomValidity("Пожалуйста, заполните это поле.");
          } else if (field.validity.typeMismatch && field.type === "email") {
            field.setCustomValidity("Пожалуйста, введите корректный email в формате example@mail.ru.");
          } else {
            field.setCustomValidity("");
          }
        };
        field.addEventListener("invalid", setMessage);
        field.addEventListener("input", () => field.setCustomValidity(""));
      });
    });
  });
})();
