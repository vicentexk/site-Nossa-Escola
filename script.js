// script.js - explicação detalhada abaixo (carrossel, eventos, busca, login, tema, topo, fade-in)

/* ------------------ Fade-in inicial ------------------ */
// 1️⃣ Seleciona o body da página
const body = document.querySelector('body');

// 2️⃣ Adiciona a classe 'fade-ready' quando a página carregar
window.addEventListener('load', () => {
  // Aqui estamos esperando a página carregar totalmente
  body.classList.add('fade-ready');
});


/* ------------------ CARROSSEL (crossfade) ------------------ */
// lista de imagens (coloque os nomes que existem na sua pasta)
const imagens = [
  "paragrafo_1_banner.jpg",
  "banner_evento.jpg",
  "banner_escola2.jpg"
];

// elemento <img> dentro da .banner1 (já existe no seu HTML)
const bannerImg = document.querySelector(".banner1 img");
let idx = 0;
let intervalo = null;
const TEMPO = 3500; // ms

function trocaImagem() {
  if (!bannerImg) return;
  // adiciona classe que reduz opacidade
  bannerImg.classList.add("fading");
  // quando terminar a transição CSS (opacity), trocamos a src
  function aoTerminar() {
    bannerImg.removeEventListener("transitionend", aoTerminar);
    idx = (idx + 1) % imagens.length;
    bannerImg.src = imagens[idx];
    // força um reflow pra garantir que a remoção da classe fará o fade-in
    void bannerImg.offsetWidth;
    bannerImg.classList.remove("fading");
  }
  bannerImg.addEventListener("transitionend", aoTerminar);
}

function iniciaCarrossel() {
  if (intervalo) clearInterval(intervalo);
  intervalo = setInterval(trocaImagem, TEMPO);
}
if (bannerImg) {
  // inicia autoplay
  iniciaCarrossel();
  // pausa ao passar o mouse
  bannerImg.addEventListener("mouseenter", () => clearInterval(intervalo));
  bannerImg.addEventListener("mouseleave", iniciaCarrossel);
}

/* ------------------ CALENDÁRIO / EVENTOS ------------------ */
const eventos = [
  { data: "2025-10-20", titulo: "Feira de Ciências" },
  { data: "2025-11-05", titulo: "Semana Cultural" },
  { data: "2025-12-15", titulo: "Encerramento do Ano Letivo" }
];

function montaEventos() {
  const hoje = new Date().toISOString().split("T")[0];
  const proximos = eventos.filter(e => e.data >= hoje);
  const sec = document.createElement("section");
  sec.className = "eventos-wrapper";
  sec.innerHTML = `<h2>📅 Próximos Eventos</h2>
    <ul class="lista-eventos">
      ${proximos.map(ev => `<li><strong>${ev.data}</strong> — ${ev.titulo}</li>`).join("")}
    </ul>`;
  // inserir antes do footer
  const footer = document.querySelector("footer");
  footer.parentNode.insertBefore(sec, footer);
}
montaEventos();

/* ------------------ BUSCA INTERNA (filtra .estudante-div) ------------------ */
// cria input e adiciona no header
const header = document.querySelector("header");
const busca = document.createElement("input");
busca.type = "search";
busca.placeholder = "🔎 Buscar aluno por nome...";
busca.className = "busca-animada";
if (header) header.appendChild(busca);

// evento que filtra conforme o usuário digita
busca.addEventListener("input", () => {
  const termo = busca.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".estudante-div");
  cards.forEach(card => {
    const nomeEl = card.querySelector(".estudante-nome");
    const nome = nomeEl ? nomeEl.textContent.toLowerCase() : "";
    if (!termo || nome.includes(termo)) {
      // mostrar com animação suave (garantir display)
      card.style.display = "";
      card.classList.remove("diminuindo");
    } else {
      // adicionar classe de "desaparecer" e depois esconder
      card.classList.add("diminuindo");
      setTimeout(() => { card.style.display = "none"; }, 280);
    }
  });
});

/* ------------------ LOGIN SIMPLES (modal) ------------------ */
// botão abrir login no header
const btnLogin = document.createElement("button");
btnLogin.className = "abrir-login";
btnLogin.textContent = "Área Restrita";
if (header) header.appendChild(btnLogin);

// HTML do modal
const modalHTML = `
  <div class="modal-overlay" id="modalLogin" aria-hidden="true">
    <div class="modal-card" role="dialog" aria-modal="true">
      <button class="modal-fechar" aria-label="Fechar">✕</button>
      <h3>Login - Professores</h3>
      <input id="loginUser" placeholder="Usuário">
      <input id="loginPass" placeholder="Senha" type="password">
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:6px;">
        <button id="btnLoginConfirm">Entrar</button>
      </div>
      <p class="modal-msg" id="modalMsg"></p>
    </div>
  </div>
`;
document.body.insertAdjacentHTML("beforeend", modalHTML);

const overlay = document.getElementById("modalLogin");
const btnFechar = overlay.querySelector(".modal-fechar");
const btnConfirm = document.getElementById("btnLoginConfirm");
const msg = document.getElementById("modalMsg");

function abrirModal() {
  overlay.classList.add("ativo");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function fecharModal() {
  overlay.classList.remove("ativo");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  msg.textContent = "";
  document.getElementById("loginUser").value = "";
  document.getElementById("loginPass").value = "";
}
btnLogin.addEventListener("click", abrirModal);
btnFechar.addEventListener("click", fecharModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) fecharModal(); });

// verificação simples (EXEMPLO) - não seguro para produção
btnConfirm.addEventListener("click", () => {
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value.trim();
  if (u === "professor" && p === "1234") {
    msg.textContent = "Login ok. (Exemplo)";
    msg.className = "modal-msg sucesso";
    setTimeout(() => { fecharModal(); alert("Acesso concedido (exemplo)."); }, 600);
  } else {
    msg.textContent = "Usuário/senha incorretos.";
    msg.className = "modal-msg erro";
  }
});

/* ------------------ MODO ESCURO / CLARO (persistente) ------------------ */
const btnTema = document.createElement("button");
btnTema.className = "botao-tema";
if (header) header.appendChild(btnTema);

function atualizaTextoTema() {
  btnTema.textContent = document.body.classList.contains("dark") ? "☀️ Modo Claro" : "🌙 Modo Escuro";
}
btnTema.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("tema", document.body.classList.contains("dark") ? "dark" : "light");
  atualizaTextoTema();
});
// aplicar tema salvo (persistência)
if (localStorage.getItem("tema") === "dark") document.body.classList.add("dark");
atualizaTextoTema();

/* ------------------ BOTÃO VOLTAR AO TOPO ------------------ */
const btnTopo = document.createElement("button");
btnTopo.className = "topo";
btnTopo.textContent = "⬆ Topo";
document.body.appendChild(btnTopo);

window.addEventListener("scroll", () => {
  if (window.scrollY > 220) btnTopo.classList.add("mostra");
  else btnTopo.classList.remove("mostra");
});

// smooth scroll pro topo
btnTopo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

