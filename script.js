(function () {
        var root = document.documentElement;

        /* Theme */
        try {
          var s = localStorage.getItem("theme");
          if (s) root.setAttribute("data-theme", s);
        } catch (e) {}
        document.getElementById("theme").addEventListener("click", function () {
          var cur = root.getAttribute("data-theme");
          if (!cur)
            cur = matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";
          var next = cur === "dark" ? "light" : "dark";
          root.setAttribute("data-theme", next);
          try {
            localStorage.setItem("theme", next);
          } catch (e) {}
        });

        /* Project filter */
        var chips = document.querySelectorAll(".chip");
        var cards = document.querySelectorAll("#grid .card");
        chips.forEach(function (c) {
          c.addEventListener("click", function () {
            var f = c.getAttribute("data-f");
            chips.forEach(function (x) {
              x.setAttribute("aria-pressed", x === c ? "true" : "false");
            });
            cards.forEach(function (card) {
              card.hidden = !(f === "all" || card.getAttribute("data-t") === f);
            });
          });
        });

        /* Active nav link */
        var links = document.querySelectorAll(".railnav a");
        var map = {};
        links.forEach(function (a) {
          map[a.getAttribute("href").slice(1)] = a;
        });
        var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        if ("IntersectionObserver" in window) {
          var nav = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (en) {
                if (en.isIntersecting && map[en.target.id]) {
                  links.forEach(function (a) {
                    a.classList.remove("on");
                  });
                  map[en.target.id].classList.add("on");
                }
              });
            },
            { rootMargin: "-40% 0px -55% 0px" },
          );
          document
            .querySelectorAll("main#top, section[id]")
            .forEach(function (sec) {
              nav.observe(sec);
            });

          /* Reveal: movement only, text stays readable */
          if (!reduce) {
            var rv = document.querySelectorAll(".rv");
            rv.forEach(function (el) {
              if (el.getBoundingClientRect().top > innerHeight)
                el.classList.add("pre");
            });
            var io = new IntersectionObserver(
              function (entries) {
                entries.forEach(function (en) {
                  if (en.isIntersecting) {
                    en.target.classList.remove("pre");
                    io.unobserve(en.target);
                  }
                });
              },
              { threshold: 0.08 },
            );
            rv.forEach(function (el) {
              io.observe(el);
            });
          }
        }
      })();