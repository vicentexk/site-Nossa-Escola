/* ------------------ FADE-IN INICIAL ------------------ */
const body = document.querySelector('body');
window.addEventListener('load', () => {
  body.classList.add('fade-ready');
});

/* ------------------ CARROSSEL (CROSSFADE) ------------------ */
const imagens = [
  "paragrafo_1_banner.jpg",
  "banner 2026.jpeg",
  "banner zoado 2026.jpeg"
];
const bannerImg = document.querySelector(".banner1 img");
let idx = 0;
let intervalo = null;
const TEMPO = 3500;

function trocaImagem() {
  if (!bannerImg) return;
  bannerImg.classList.add("fading");

  function aoTerminar() {
    bannerImg.removeEventListener("transitionend", aoTerminar);
    idx = (idx + 1) % imagens.length;
    bannerImg.src = imagens[idx];
    void bannerImg.offsetWidth; // força reflow
    bannerImg.classList.remove("fading");
  }

  bannerImg.addEventListener("transitionend", aoTerminar);
}

function iniciaCarrossel() {
  if (intervalo) clearInterval(intervalo);
  intervalo = setInterval(trocaImagem, TEMPO);
}

if (bannerImg) {
  iniciaCarrossel();
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
  sec.innerHTML = `
    <h2>📅 Próximos Eventos</h2>
    <ul class="lista-eventos">
      ${proximos.map(ev => `<li><strong>${ev.data}</strong> — ${ev.titulo}</li>`).join("")}
    </ul>
  `;
  const footer = document.querySelector("footer");
  footer.parentNode.insertBefore(sec, footer);
}

montaEventos();

/* ------------------ BUSCA INTERNA COM RESULTADOS ------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  if (!header) return;

  // Input da busca
  const busca = document.createElement("input");
  busca.type = "search";
  busca.placeholder = "🔎 Buscar aluno por nome...";
  busca.className = "busca-animada";
  header.appendChild(busca);

  // Div resultados
  const resultadosDiv = document.createElement("div");
  resultadosDiv.className = "resultados-busca";
  header.appendChild(resultadosDiv);

  busca.addEventListener("input", () => {
    const termo = busca.value.trim().toLowerCase();
    const cards = document.querySelectorAll(".estudante-div");
    resultadosDiv.innerHTML = "";

    if (termo) {
      const encontrados = [...cards].filter(card => {
        const nomeEl = card.querySelector(".estudante-nome");
        return nomeEl && nomeEl.textContent.toLowerCase().includes(termo);
      });

      encontrados.forEach(card => {
        const nomeEl = card.querySelector(".estudante-nome");
        const imgEl = card.querySelector(".estudante-imagem");
        const item = document.createElement("div");
        item.className = "resultado-item";
        item.innerHTML = `
          <img src="${imgEl ? imgEl.src : ''}" alt="${nomeEl.textContent}">
          <span>${nomeEl.textContent}</span>
        `;
        item.addEventListener("click", () => {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          resultadosDiv.style.display = "none";
          busca.value = "";
        });
        resultadosDiv.appendChild(item);
      });

      resultadosDiv.style.display = encontrados.length ? "block" : "none";
    } else {
      resultadosDiv.style.display = "none";
    }
  });
});

/* ------------------ LOGIN / CRIAR CONTA ------------------ */
const btnLogin = document.createElement("button");
btnLogin.className = "abrir-login";
btnLogin.textContent = "Área Restrita";
const header = document.querySelector("header");
if (header) header.appendChild(btnLogin);

const modalHTML = `
  <div class="modal-overlay" id="modalLogin" aria-hidden="true">
    <div class="modal-card" role="dialog" aria-modal="true">
      <button class="modal-fechar" aria-label="Fechar">✕</button>
      <h3>Área Restrita - Professores</h3>
      <input id="loginUser" placeholder="Usuário">
      <input id="loginPass" placeholder="Senha" type="password">
      <div style="display:flex;gap:8px;margin-top:6px;justify-content:flex-end;">
        <button id="btnLoginConfirm">Entrar</button>
        <button id="btnCriarConta">Criar Conta</button>
      </div>
      <p class="modal-msg" id="modalMsg"></p>
    </div>
  </div>
`;

document.body.insertAdjacentHTML("beforeend", modalHTML);

const overlay = document.getElementById("modalLogin");
const btnFechar = overlay.querySelector(".modal-fechar");
const btnConfirm = document.getElementById("btnLoginConfirm");
const btnCriarConta = document.getElementById("btnCriarConta");
const msg = document.getElementById("modalMsg");

// Funções abrir/fechar modal com scroll travado
function abrirModal() {
  overlay.classList.add("ativo");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-aberto"); // trava scroll
}

function fecharModal() {
  overlay.classList.remove("ativo");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-aberto"); // libera scroll
  msg.textContent = "";
  document.getElementById("loginUser").value = "";
  document.getElementById("loginPass").value = "";
}

btnLogin.addEventListener("click", abrirModal);
btnFechar.addEventListener("click", fecharModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) fecharModal();
});

// ------------------ CSS ADICIONAL PARA TRAVAR SCROLL ------------------
const style = document.createElement('style');
style.textContent = `
  body.modal-aberto {
    overflow: hidden;
  }
`;
document.head.appendChild(style);

// Login persistente
if (localStorage.getItem("logado") === "true") loginSucesso();

// Login
btnConfirm.addEventListener("click", () => {
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value.trim();
  const contas = JSON.parse(localStorage.getItem("contas") || "{}");

  if (contas[u] && contas[u] === p) {
    localStorage.setItem("logado", "true");
    loginSucesso();
    fecharModal();
  } else {
    msg.textContent = "Usuário/senha incorretos.";
    msg.className = "modal-msg erro";
  }
});

// Criar conta
btnCriarConta.addEventListener("click", () => {
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value.trim();

  if (!u || !p) {
    msg.textContent = "Preencha usuário e senha!";
    msg.className = "modal-msg erro";
    return;
  }

  const contas = JSON.parse(localStorage.getItem("contas") || "{}");
  if (contas[u]) {
    msg.textContent = "Usuário já existe!";
    msg.className = "modal-msg erro";
    return;
  }

  contas[u] = p;
  localStorage.setItem("contas", JSON.stringify(contas));
  msg.textContent = "Conta criada com sucesso!";
  msg.className = "modal-msg sucesso";
});

// Login bem-sucedido
function loginSucesso() {
  btnLogin.textContent = "Sair";
  btnLogin.classList.add("logado");
  btnLogin.onclick = () => {
    localStorage.removeItem("logado");
    btnLogin.textContent = "Área Restrita";
    btnLogin.classList.remove("logado");
    alert("Você saiu da área restrita!");
    btnLogin.onclick = abrirModal;
  };
}

/* ------------------ MODO ESCURO / CLARO ------------------ */
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

btnTopo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
