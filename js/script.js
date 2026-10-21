
document.addEventListener("DOMContentLoaded", () => {
    const album = document.getElementById("book");

    const botaoAnterior = document.getElementById("prevButton");
    const botaoProximo = document.getElementById("nextButton");
    const indicador = document.getElementById("pageIndicator");

    const botaoAbrir = document.getElementById("openAlbum");
    const botaoReiniciar = document.getElementById("restartAlbum");

    const musica = document.getElementById("loveSong");

    let pageFlip = null;

    if (!album) {
        console.error("Não encontrei o elemento #book.");
        return;
    }

    if (typeof St === "undefined" || !St.PageFlip) {
        console.error("A biblioteca PageFlip não foi carregada.");
        if (indicador) {
            indicador.textContent = "Erro ao carregar o álbum.";
        }
        return;
    }

    pageFlip = new St.PageFlip(album, {
        width: 460,
        height: 620,
        size: "stretch",
        minWidth: 280,
        maxWidth: 600,
        minHeight: 380,
        maxHeight: 760,
        showCover: true,
        usePortrait: true,
        flippingTime: 800,
        drawShadow: true,
        maxShadowOpacity: 0.35,
        mobileScrollSupport: false,
        useMouseEvents: true,
        autoSize: true
    });

    const paginas = album.querySelectorAll(".page");
    pageFlip.loadFromHTML(paginas);

    function atualizarControles() {
        const atual = pageFlip.getCurrentPageIndex();
        const total = pageFlip.getPageCount();

        if (indicador) {
            indicador.textContent =
                atual === 0
                    ? "Capa"
                    : atual === total - 1
                        ? "Contracapa"
                        : `Página ${atual} de ${total - 2}`;
        }

        if (botaoAnterior) {
            botaoAnterior.disabled = atual === 0;
        }

        if (botaoProximo) {
            botaoProximo.disabled = atual === total - 1;
        }
    }

    if (botaoAnterior) {
        botaoAnterior.addEventListener("click", () => {
            pageFlip.flipPrev();
        });
    }

    if (botaoProximo) {
        botaoProximo.addEventListener("click", () => {
            pageFlip.flipNext();
        });
    }

    if (botaoAbrir) {
        botaoAbrir.addEventListener("click", () => {
            pageFlip.flipNext();
        });
    }

    if (botaoReiniciar) {
        botaoReiniciar.addEventListener("click", () => {
            pageFlip.turnToPage(0);
        });
    }

    pageFlip.on("flip", atualizarControles);
    pageFlip.on("init", atualizarControles);

    atualizarControles();

    // Música: o navegador pode exigir uma ação do usuário
    if (musica) {
        musica.addEventListener("error", () => {
            console.error(
                "Não foi possível carregar musica.mp3. Confira o caminho do arquivo."
            );
        });
    }

    // Avisar no console se alguma foto não for encontrada
    document.querySelectorAll(".photo-frame img").forEach((foto) => {
        foto.addEventListener("error", () => {
            console.error("Foto não encontrada:", foto.getAttribute("src"));
        });
    });
});

// ===== TENTAR INICIAR A MÚSICA AUTOMATICAMENTE =====


function configurarReproducaoAutomatica() {
    const audio = document.getElementById("loveSong");

    if (!audio) return;

    audio.volume = 0.7;
    audio.preload = "auto";

    // Começa aos 50 segundos, se ainda estiver no início.
    function ajustarInicio() {
        if (audio.currentTime < 1 && audio.duration > 50) {
            audio.currentTime = 50;
        }
    }

    audio.addEventListener("loadedmetadata", ajustarInicio, {
        once: true
    });

    if (audio.readyState >= 1) {
        ajustarInicio();
    }

    // Tenta tocar automaticamente.
    audio.play().catch(() => {
        console.log("Aguardando o primeiro toque na tela.");
    });

    // No celular, o primeiro toque pode liberar a reprodução.
    function iniciarNoToque() {
        if (audio.paused) {
            ajustarInicio();

            audio.play().catch((erro) => {
                console.log("Não foi possível iniciar o áudio:", erro);
            });
        }
    }

    document.addEventListener("pointerdown", iniciarNoToque, {
        once: true
    });

    document.addEventListener("touchstart", iniciarNoToque, {
        once: true,
        passive: true
    });
}

configurarReproducaoAutomatica();
