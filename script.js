(function () {
  const APP_NAME = "PROJETO ONZE";
  const STORAGE_KEY = "legendsDraftSimulator.v1";
  const PLAYERS = window.LEGENDS_PLAYERS || [];
  const OPPONENTS = window.LEGENDS_OPPONENTS || [];

  const ROSTER_TARGETS = { GK: 3, DEF: 8, MID: 7, ATT: 5 };
  const SECTOR_ORDER = ["GK", "DEF", "MID", "ATT"];
  const DRAFT_RARITIES = [
    { minRoll: 1, maxRoll: 4, minOvr: 70, maxOvr: 79, label: "Azar extremo", key: "alt" },
    { minRoll: 5, maxRoll: 9, minOvr: 80, maxOvr: 87, label: "Boa carta", key: "forte" },
    { minRoll: 10, maxRoll: 14, minOvr: 88, maxOvr: 93, label: "Carta forte", key: "craque" },
    { minRoll: 15, maxRoll: 19, minOvr: 94, maxOvr: 98, label: "Elite histórica", key: "elite" },
    { minRoll: 20, maxRoll: 20, minOvr: 99, maxOvr: 99, label: "Lendário absoluto", key: "absolute" }
  ];
  const SELECTION_RARITIES = [
    { minRoll: 1, maxRoll: 4, level: "alternative", label: "Seleções alternativas", key: "alt" },
    { minRoll: 5, maxRoll: 9, level: "strong", label: "Seleções fortes", key: "forte" },
    { minRoll: 10, maxRoll: 14, level: "very-strong", label: "Seleções muito fortes", key: "craque" },
    { minRoll: 15, maxRoll: 19, level: "finalist", label: "Campeãs ou quase campeãs", key: "elite" },
    { minRoll: 20, maxRoll: 20, level: "absolute", label: "Históricas absolutas", key: "absolute" }
  ];

  const FORMATIONS = {
    "4-3-3": { GK: 1, DEF: 4, MID: 3, ATT: 3 },
    "4-4-2": { GK: 1, DEF: 4, MID: 4, ATT: 2 },
    "4-2-3-1": { GK: 1, DEF: 4, MID: 5, ATT: 1 },
    "3-5-2": { GK: 1, DEF: 3, MID: 5, ATT: 2 },
    "3-4-3": { GK: 1, DEF: 3, MID: 4, ATT: 3 },
    "5-3-2": { GK: 1, DEF: 5, MID: 3, ATT: 2 }
  };

  const FORMATION_SLOTS = {
    "4-3-3": [
      slot("GOL", "GK", ["GOL"]),
      slot("LE", "DEF", ["LE", "ALA"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("LD", "DEF", ["LD", "ALA"]),
      slot("VOL", "MID", ["VOL", "MC"]),
      slot("MC", "MID", ["MC", "VOL", "MEI"]),
      slot("MEI", "MID", ["MEI", "MC", "SA"]),
      slot("PE", "ATT", ["PE", "SA", "ATA"]),
      slot("CA", "ATT", ["CA", "ATA"]),
      slot("PD", "ATT", ["PD", "SA", "ATA"])
    ],
    "4-4-2": [
      slot("GOL", "GK", ["GOL"]),
      slot("LE", "DEF", ["LE", "ALA"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("LD", "DEF", ["LD", "ALA"]),
      slot("ME", "MID", ["ME", "PE", "MC", "ALA"]),
      slot("VOL", "MID", ["VOL", "MC"]),
      slot("MC", "MID", ["MC", "VOL", "MEI"]),
      slot("MD", "MID", ["MD", "PD", "MC", "ALA"]),
      slot("SA", "ATT", ["SA", "ATA", "MEI"]),
      slot("CA", "ATT", ["CA", "ATA"])
    ],
    "4-2-3-1": [
      slot("GOL", "GK", ["GOL"]),
      slot("LE", "DEF", ["LE", "ALA"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("LD", "DEF", ["LD", "ALA"]),
      slot("VOL", "MID", ["VOL", "MC"]),
      slot("VOL", "MID", ["VOL", "MC"]),
      slot("PE", "ATT", ["PE", "SA", "ATA"]),
      slot("MEI", "MID", ["MEI", "MC", "SA"]),
      slot("PD", "ATT", ["PD", "SA", "ATA"]),
      slot("CA", "ATT", ["CA", "ATA"])
    ],
    "3-5-2": [
      slot("GOL", "GK", ["GOL"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("ALA", "DEF", ["ALA", "LE", "LD", "ME", "MD", "PE", "PD"]),
      slot("VOL", "MID", ["VOL", "MC"]),
      slot("MC", "MID", ["MC", "VOL", "MEI"]),
      slot("MEI", "MID", ["MEI", "MC", "SA"]),
      slot("ALA", "DEF", ["ALA", "LE", "LD", "ME", "MD", "PE", "PD"]),
      slot("SA", "ATT", ["SA", "ATA", "MEI"]),
      slot("CA", "ATT", ["CA", "ATA"])
    ],
    "3-4-3": [
      slot("GOL", "GK", ["GOL"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("ALA", "DEF", ["ALA", "LE", "LD", "ME", "MD", "PE", "PD"]),
      slot("MC", "MID", ["MC", "VOL", "MEI"]),
      slot("MC", "MID", ["MC", "VOL", "MEI"]),
      slot("ALA", "DEF", ["ALA", "LE", "LD", "ME", "MD", "PE", "PD"]),
      slot("PE", "ATT", ["PE", "SA", "ATA"]),
      slot("CA", "ATT", ["CA", "ATA"]),
      slot("PD", "ATT", ["PD", "SA", "ATA"])
    ],
    "5-3-2": [
      slot("GOL", "GK", ["GOL"]),
      slot("LE", "DEF", ["LE", "ALA"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("ZAG", "DEF", ["ZAG", "LÍB"]),
      slot("LD", "DEF", ["LD", "ALA"]),
      slot("VOL", "MID", ["VOL", "MC"]),
      slot("MC", "MID", ["MC", "VOL", "MEI"]),
      slot("MEI", "MID", ["MEI", "MC", "SA"]),
      slot("SA", "ATT", ["SA", "ATA", "MEI"]),
      slot("CA", "ATT", ["CA", "ATA"])
    ]
  };

  const ROUND_NAMES = ["Oitavas", "Quartas", "Semifinal", "Final"];
  const GROUP_NAMES = ["Grupo A", "Grupo B", "Grupo C", "Grupo D", "Grupo E", "Grupo F", "Grupo G", "Grupo H"];
  const SIMULATION_SPEEDS = {
    slow: { label: "Lenta", delay: 2000 },
    normal: { label: "Normal", delay: 1200 },
    fast: { label: "Rápida", delay: 700 },
    turbo: { label: "Turbo", delay: 300 },
    instant: { label: "Instantânea", delay: 0 }
  };
  const DEBUG_BALANCE = false;
  const DEFAULT_TEAM_NAME = "Meu Time";
  const SUBSTITUTION_PAUSES = [45];
  const SUBSTITUTION_SUGGESTION_MINUTES = [60, 75];
  const MAX_SUBSTITUTIONS = 5;
  const SUBSTITUTION_COMPATIBILITY = {
    GOL: ["GOL"],
    ZAG: ["ZAG", "LIB"],
    LE: ["LE", "ALA"],
    LD: ["LD", "ALA"],
    ALA: ["ALA", "LE", "LD"],
    VOL: ["VOL", "MC"],
    MC: ["MC", "VOL", "MEI"],
    MEI: ["MEI", "MC", "SA"],
    PE: ["PE", "PD", "SA"],
    PD: ["PD", "PE", "SA"],
    SA: ["SA", "CA", "ATA", "MEI"],
    CA: ["CA", "ATA", "SA"]
  };
  const SECTOR_LABELS = { GK: "Goleiros", DEF: "Defensores", MID: "Meias", ATT: "Atacantes" };
  const HISTORIC_SELECTIONS = [
    selection("costa-rica-2014", "Costa Rica 2014", "alternative"),
    selection("grecia-2004", "Grécia 2004", "alternative"),
    selection("senegal-2002", "Senegal 2002", "alternative"),
    selection("paraguai-2010", "Paraguai 2010", "alternative"),
    selection("gana-2010", "Gana 2010", "alternative"),
    selection("marrocos-2022", "Marrocos 2022", "alternative"),
    selection("mexico-1986", "México 1986", "strong"),
    selection("suecia-1994", "Suécia 1994", "strong"),
    selection("coreia-2002", "Coreia do Sul 2002", "strong"),
    selection("japao-2010", "Japão 2010", "strong"),
    selection("chile-2015", "Chile 2015", "strong"),
    selection("colombia-2014", "Colômbia 2014", "strong"),
    selection("dinamarca-1992", "Dinamarca 1992", "strong"),
    selection("argentina-1990", "Argentina 1990", "strong"),
    selection("portugal-2022", "Portugal 2022", "strong"),
    selection("nigeria-1994", "Nigéria 1994", "strong"),
    selection("alemanha-2002", "Alemanha 2002", "very-strong"),
    selection("argentina-2014", "Argentina 2014", "very-strong"),
    selection("portugal-2006", "Portugal 2006", "very-strong"),
    selection("inglaterra-2006", "Inglaterra 2006", "very-strong"),
    selection("croacia-2018", "Croácia 2018", "very-strong"),
    selection("belgica-2018", "Bélgica 2018", "very-strong"),
    selection("uruguai-2010", "Uruguai 2010", "very-strong"),
    selection("holanda-2014", "Holanda 2014", "very-strong"),
    selection("brasil-2014", "Brasil 2014", "very-strong"),
    selection("brasil-1994", "Brasil 1994", "finalist"),
    selection("brasil-2002", "Brasil 2002", "finalist"),
    selection("franca-1998", "França 1998", "finalist"),
    selection("italia-2006", "Itália 2006", "finalist"),
    selection("espanha-2010", "Espanha 2010", "finalist"),
    selection("alemanha-2014", "Alemanha 2014", "finalist"),
    selection("argentina-2022", "Argentina 2022", "finalist"),
    selection("franca-2018", "França 2018", "finalist"),
    selection("holanda-2010", "Holanda 2010", "finalist"),
    selection("franca-2006", "França 2006", "finalist"),
    selection("alemanha-1990", "Alemanha 1990", "finalist"),
    selection("italia-1994", "Itália 1994", "finalist"),
    selection("espanha-2008", "Espanha 2008", "finalist"),
    selection("brasil-1958", "Brasil 1958", "absolute"),
    selection("brasil-1962", "Brasil 1962", "absolute"),
    selection("brasil-1970", "Brasil 1970", "absolute"),
    selection("argentina-1978", "Argentina 1978", "absolute"),
    selection("argentina-1986", "Argentina 1986", "absolute"),
    selection("alemanha-1974", "Alemanha 1974", "absolute"),
    selection("italia-1982", "Itália 1982", "absolute"),
    selection("holanda-1974", "Holanda 1974", "absolute"),
    selection("brasil-1982", "Brasil 1982", "absolute"),
    selection("franca-1984", "França 1984", "absolute"),
    selection("holanda-1988", "Holanda 1988", "absolute")
  ];
  const app = document.getElementById("app");

  let store = loadStore();
  let expandedHistoryMatches = new Set();
  let campaignSummaryExpanded = false;
  let activeFormationSlotId = null;
  let pendingLineupPlayerId = null;
  let formationNotice = "";
  let activeMatchSimulation = null;
  let activeSubstitutionOutSlotId = null;
  let activeSubstitutionInId = null;
  let substitutionNotice = "";
  let d20IntervalId = null;
  let d20TimeoutId = null;
  let matchTimeoutId = null;

  document.getElementById("appTitle").textContent = APP_NAME;
  document.getElementById("homeButton").addEventListener("click", () => {
    clearDraftRollTimers();
    clearMatchTimer();
    renderHome();
  });
  app.addEventListener("click", handleClick);
  app.addEventListener("change", handleChange);

  renderHome();

  // Persistência simples: a campanha atual e o histórico ficam no localStorage.
  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return normalizeStore(raw ? JSON.parse(raw) : {});
    } catch (error) {
      return normalizeStore({});
    }
  }

  function normalizeStore(value) {
    const settings = {
      teamName: DEFAULT_TEAM_NAME,
      simulationSpeed: "normal",
      ...(value.settings || {})
    };
    if (!SIMULATION_SPEEDS[settings.simulationSpeed]) settings.simulationSpeed = "normal";
    return {
      archive: [],
      current: null,
      ...value,
      settings
    };
  }

  function saveStore() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function clearDraftRollTimers() {
    if (d20IntervalId) clearInterval(d20IntervalId);
    if (d20TimeoutId) clearTimeout(d20TimeoutId);
    d20IntervalId = null;
    d20TimeoutId = null;
  }

  function clearMatchTimer() {
    if (matchTimeoutId) clearTimeout(matchTimeoutId);
    matchTimeoutId = null;
    activeMatchSimulation = null;
    activeSubstitutionOutSlotId = null;
    activeSubstitutionInId = null;
    substitutionNotice = "";
  }

  function handleClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    event.preventDefault();
    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === "new-campaign") startNewCampaign("classic");
    if (action === "new-selection-campaign") startNewCampaign("selection");
    if (action === "formation-select") selectStartingFormation(id);
    if (action === "continue") routeCurrentCampaign();
    if (action === "home") renderHome();
    if (action === "history") renderHistory();
    if (action === "hall") renderHallOfFame();
    if (action === "focus-modes") document.getElementById("gameModes")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (action === "selection-pick") selectHistoricSelection(id);
    if (action === "draft-select") toggleDraftPick(id);
    if (action === "draft-confirm") confirmDraftStage();
    if (action === "roster") renderRoster();
    if (action === "formation") renderFormation();
    if (action === "campaign") renderCampaign();
    if (action === "match") renderMatch();
    if (action === "save-lineup") saveLineup();
    if (action === "simulate") simulateMatch();
    if (action === "lineup-slot") openLineupSlot(id);
    if (action === "lineup-pick") pickLineupPlayer(button.dataset.slot, id);
    if (action === "lineup-clear") clearLineupSlot(id);
    if (action === "lineup-player") chooseLineupPlayer(id);
    if (action === "lineup-place") placeLineupPlayer(button.dataset.slot, id);
    if (action === "substitution-open") renderSubstitutionManager();
    if (action === "substitution-open-live") pauseLiveMatch("substitution");
    if (action === "substitution-continue") continuePausedSimulation();
    if (action === "substitution-out") selectSubstitutionOut(id);
    if (action === "substitution-in") selectSubstitutionIn(id);
    if (action === "substitution-confirm") confirmSubstitution();
    if (action === "pause-match") pauseLiveMatch("manual");
    if (action === "pause-stats") renderMatchPausePanel(true);
    if (action === "manual") renderManual();
    if (action === "feedback") openFeedback();
    if (action === "clear-current") clearCurrentCampaign();
    if (action === "history-toggle") toggleHistoryMatch(id);
    if (action === "campaign-summary") toggleCampaignSummary();
    if (action === "new-current-mode") startNewCampaign((store.current && store.current.draftMode) || "classic");
  }

  function handleChange(event) {
    const target = event.target;
    if (target.id === "teamNameInput") {
      const value = cleanTeamName(target.value);
      store.settings.teamName = value;
      if (store.current && store.current.status === "setup") {
        store.current.teamName = value;
      }
      saveStore();
    }

    if (target.id === "simulationSpeedSelect") {
      if (SIMULATION_SPEEDS[target.value]) {
        store.settings.simulationSpeed = target.value;
        saveStore();
      }
    }

    if (target.id === "formationSelect") {
      const campaign = currentCampaign();
      campaign.formation = target.value;
      campaign.lineup = {};
      campaign.draftPack = null;
      activeFormationSlotId = null;
      saveStore();
      if (campaign.status === "setup") renderDraft();
      else renderFormation();
    }

    if (target.dataset.slot) {
      const campaign = currentCampaign();
      const slot = formationSlots(campaign.formation).find((item) => item.id === target.dataset.slot);
      const player = findPlayer(target.value);
      if (!target.value) {
        delete campaign.lineup[target.dataset.slot];
      } else if (slot && player && isPlayerCompatibleWithSlot(player, slot)) {
        campaign.lineup[target.dataset.slot] = target.value;
      }
      saveStore();
      renderFormation();
    }
  }

  function renderHome() {
    const current = store.current;
    const canContinue = current && !["champion", "eliminated"].includes(current.status);
    const currentSummary = current && ["champion", "eliminated"].includes(current.status) ? (current.summary || buildCampaignSummary(current)) : null;
    const stats = homeStats();
    app.innerHTML = `
      <article class="card hero-card home-hero">
        <p class="eyebrow">Futebol impossível · 1950-2026</p>
        <div class="home-title-row">
          <h2>PROJETO ONZE</h2>
          <span class="beta-badge">Beta pública</span>
        </div>
        <p class="hero-lead">Monte o time que nunca existiu.</p>
        <p class="muted">Pelé, Messi, Cristiano Ronaldo, Maradona, Neymar e centenas de outras lendas podem jogar juntos.</p>
        <div class="home-lineup" aria-label="Exemplo de escalação lendária">
          ${[
            ["1", "Yashin"],
            ["2", "Cafu"],
            ["3", "Beckenbauer"],
            ["4", "Maldini"],
            ["5", "R. Carlos"],
            ["6", "Xavi"],
            ["8", "Zidane"],
            ["10", "Pelé"],
            ["10", "Maradona"],
            ["9", "Ronaldo"],
            ["7", "Messi"]
          ].map(([number, name]) => `<span><strong>${number}</strong>${escapeHtml(name)}</span>`).join("")}
        </div>
        <div class="actions">
          <button class="primary-button big-cta" data-action="focus-modes" type="button">JOGAR AGORA</button>
          <button class="secondary-button" data-action="continue" type="button" ${canContinue ? "" : "disabled"}>Continuar campanha</button>
          <button class="ghost-button" data-action="manual" type="button">Como jogar</button>
          <button class="ghost-button" data-action="history" type="button">Histórico</button>
          <button class="ghost-button" data-action="hall" type="button">Hall da fama</button>
        </div>
      </article>
      <section class="home-dashboard">
        <article class="soft-card quick-help-card">
          <span>Como funciona?</span>
          <strong>Da rolagem do D20 até a Copa</strong>
          <ol class="quick-steps">
            <li>Role o D20.</li>
            <li>Monte seu elenco.</li>
            <li>Escolha sua escalação.</li>
            <li>Supere a fase de grupos.</li>
            <li>Conquiste a Copa do Mundo.</li>
          </ol>
          <button class="primary-button" data-action="manual" type="button">Ver Manual</button>
        </article>
        <article class="soft-card feedback-card">
          <span>Ajude a melhorar o Projeto Onze</span>
          <strong>Este jogo está em versão beta.</strong>
          <p class="muted">Se encontrar bugs, resultados estranhos ou tiver sugestões, envie seu feedback.</p>
          <button class="secondary-button" data-action="feedback" type="button">Enviar Feedback</button>
        </article>
      </section>
      <section class="mode-panel" id="gameModes">
        <article class="soft-card mode-card">
          <span>Modo principal</span>
          <strong>Draft Clássico</strong>
          <p class="muted">O D20 sorteia faixas de OVR e você monta um elenco de 23 lendas.</p>
          <button class="primary-button" data-action="new-campaign" type="button">Jogar Draft Clássico</button>
        </article>
        <article class="soft-card mode-card featured">
          <span>Modo V2</span>
          <strong>Draft por Seleções</strong>
          <p class="muted">O D20 sorteia seleções históricas completas. Escolha um jogador daquela geração.</p>
          <button class="primary-button" data-action="new-selection-campaign" type="button">Jogar Draft por Seleções</button>
        </article>
      </section>
      <section class="how-grid">
        <article class="soft-card step-card">
          <span>⚽</span>
          <strong>${stats.players} Jogadores Históricos</strong>
          <p class="muted">Craques de 1950 a 2026 em cartas com OVR visual e atributos internos.</p>
        </article>
        <article class="soft-card step-card">
          <span>🏆</span>
          <strong>Seleções Históricas</strong>
          <p class="muted">Elencos por geração, sem misturar jogadores de anos diferentes.</p>
        </article>
        <article class="soft-card step-card">
          <span>🎲</span>
          <strong>Sistema D20</strong>
          <p class="muted">A rolagem define a raridade das cartas ou seleções disponíveis.</p>
        </article>
        <article class="soft-card step-card">
          <span>🌍</span>
          <strong>Copa do Mundo</strong>
          <p class="muted">Fase de grupos, mata-mata e final em uma campanha completa.</p>
        </article>
        <article class="soft-card step-card">
          <span>⭐</span>
          <strong>Hall da Fama</strong>
          <p class="muted">Artilheiros, assistentes e campanhas campeãs ficam registrados.</p>
        </article>
      </section>
      <div class="home-stats">
        <span>${stats.players} jogadores históricos</span>
        <span>${stats.selections} seleções históricas</span>
        <span>${stats.groups} grupos da Copa</span>
        <span>${stats.d20Bands} faixas D20</span>
      </div>
      ${current && ["champion", "eliminated"].includes(current.status) ? `
        <article class="soft-card">
          <strong>Última campanha:</strong> ${escapeHtml(current.teamName || DEFAULT_TEAM_NAME)} - ${escapeHtml(currentSummary.statusLabel)}
          <p class="muted">${(current.results || []).length} partida(s), elenco com ${(current.squad || []).length} jogadores.</p>
        </article>
      ` : ""}
    `;
  }

  function homeStats() {
    return {
      players: PLAYERS.length,
      selections: HISTORIC_SELECTIONS.length,
      groups: GROUP_NAMES.length,
      d20Bands: DRAFT_RARITIES.length
    };
  }

  function renderManual() {
    clearDraftRollTimers();
    clearMatchTimer();
    app.innerHTML = `
      <article class="card manual-hero">
        <p class="eyebrow">Manual para testadores</p>
        <div class="home-title-row">
          <h2>Como jogar Projeto Onze</h2>
          <span class="beta-badge">Beta v0.9</span>
        </div>
        <p class="hero-lead">Projeto Onze é um simulador onde você monta um time impossível com lendas de diferentes épocas.</p>
        <div class="actions">
          <button class="primary-button" data-action="home" type="button">Ver modos de jogo</button>
          <button class="secondary-button" data-action="feedback" type="button">Enviar Feedback</button>
          <button class="ghost-button" data-action="home" type="button">Voltar à home</button>
        </div>
      </article>
      <section class="manual-grid">
        ${manualTopic("O que é o D20?", "Cada escolha começa com uma rolagem de dado. Quanto maior o número, melhores são as opções disponíveis.")}
        ${manualTopic("Faixas do D20", "1-4: alternativas. 5-9: fortes. 10-14: muito fortes. 15-19: campeãs ou elite. 20: históricas absolutas.")}
        ${manualTopic("OVR", "OVR é a força geral da carta. Ele ajuda a entender a qualidade visual do jogador no draft.")}
        ${manualTopic("Draft Clássico", "Você escolhe jogadores diretamente. O D20 define a faixa de OVR das opções exibidas.")}
        ${manualTopic("Draft por Seleções", "Você escolhe uma seleção histórica sorteada pelo D20 e depois escolhe um jogador daquela seleção.")}
        ${manualTopic("Formação", "Depois do draft, escolha os 11 titulares em posições compatíveis. Só os titulares entram na simulação.")}
        ${manualTopic("Copa", "A campanha tem fase de grupos e mata-mata até a final. O objetivo é ser campeão da Copa do Mundo.")}
        ${manualTopic("Fase de grupos", "Você joga três rodadas no grupo. Os dois melhores avançam para o mata-mata.")}
        ${manualTopic("Mata-mata", "Depois dos grupos, cada derrota elimina a campanha. O caminho passa por oitavas, quartas, semifinal e final.")}
        ${manualTopic("Empates", "Na fase de grupos o empate vale ponto. No mata-mata, empate é decidido nos pênaltis.")}
        ${manualTopic("Hall da Fama", "Registra destaques acumulados, como gols, assistências e campanhas campeãs.")}
        ${manualTopic("Histórico", "Guarda campanhas finalizadas para você revisar resultados, placares e estatísticas.")}
      </section>
      <article class="card feedback-card">
        <p class="eyebrow">Feedback beta</p>
        <h3>Ajude a melhorar o Projeto Onze</h3>
        <p class="muted">Se encontrar bugs, resultados estranhos ou tiver sugestões, envie seu feedback.</p>
        <button class="primary-button" data-action="feedback" type="button">Enviar Feedback</button>
      </article>
    `;
  }

  function manualTopic(title, text) {
    return `
      <article class="soft-card manual-card">
        <span>${escapeHtml(title)}</span>
        <p>${escapeHtml(text)}</p>
      </article>
    `;
  }

  function openFeedback() {
    const url = "https://wa.me/5511977993017";
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
  }

  function startNewCampaign(draftMode = "classic") {
    const active = store.current && !["champion", "eliminated"].includes(store.current.status);
    if (active && !confirm("Existe uma campanha em andamento. Iniciar uma nova campanha vai substituir o progresso atual. Continuar?")) {
      return;
    }

    store.current = {
      id: `camp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      teamName: cleanTeamName(store.settings.teamName),
      draftMode: draftMode === "selection" ? "selection" : "classic",
      status: "setup",
      squad: [],
      draftStage: 0,
      draftPack: null,
      formation: null,
      lineup: {},
      bench: [],
      matchIndex: 0,
      opponents: createOpponentPath(),
      worldCup: null,
      results: [],
      playerStats: {}
    };
    saveStore();
    renderFormationSetup();
  }

  function clearCurrentCampaign() {
    if (!confirm("Remover a campanha atual da tela inicial? O histórico salvo não será apagado.")) return;
    store.current = null;
    saveStore();
    renderHome();
  }

  function routeCurrentCampaign() {
    const campaign = currentCampaign(false);
    if (!campaign) {
      renderHome();
      return;
    }
    if (campaign.status === "setup" || !campaign.formation) renderFormationSetup();
    else if (campaign.squad.length < 23 || campaign.draftStage < draftStages(campaign).length) renderDraft();
    else if (!isLineupComplete(campaign)) renderFormation();
    else renderCampaign();
  }

  function currentCampaign(required = true) {
    if (!store.current && required) {
      startNewCampaign();
    }
    return store.current;
  }

  function renderFormationSetup() {
    clearDraftRollTimers();
    const campaign = currentCampaign(false);
    if (!campaign) return renderHome();
    campaign.status = "setup";
    saveStore();

    app.innerHTML = `
      <article class="card">
        <p class="eyebrow">Nova campanha</p>
        <h2>Escolha a formação inicial</h2>
        <p class="muted">${campaign.draftMode === "selection" ? "Modo Draft por Seleções: o D20 sorteia seleções históricas e você escolhe um jogador compatível." : "Modo Draft Clássico: o D20 sorteia faixas de cartas."} Depois do draft completo, você escala os titulares compatíveis.</p>
        <span class="pill">${campaign.draftMode === "selection" ? "Draft por Seleções" : "Draft Clássico"}</span>
        <div class="setup-grid">
          <label class="field-control" for="teamNameInput">
            <span>Nome do seu time</span>
            <input class="text-input" id="teamNameInput" maxlength="36" type="text" value="${escapeHtml(campaign.teamName || store.settings.teamName || DEFAULT_TEAM_NAME)}" placeholder="Brasil das Lendas">
          </label>
          <label class="field-control" for="simulationSpeedSelect">
            <span>Velocidade da simulação</span>
            <select class="select" id="simulationSpeedSelect">
              ${Object.entries(SIMULATION_SPEEDS).map(([key, speed]) => `<option value="${key}" ${store.settings.simulationSpeed === key ? "selected" : ""}>${speed.label}</option>`).join("")}
            </select>
          </label>
        </div>
      </article>
      <section class="formation-grid">
        ${Object.keys(FORMATIONS).map((name) => `
          <button class="formation-card" data-action="formation-select" data-id="${name}" type="button">
            <strong>${name}</strong>
            <span>${formationSummary(name)}</span>
          </button>
        `).join("")}
      </section>
      <article class="card">
        ${lineupBoard({ ...campaign, formation: campaign.formation || "4-3-3", lineup: {} }, [], "Campo vazio")}
      </article>
    `;
  }

  function selectStartingFormation(name) {
    if (!FORMATIONS[name]) return;
    const campaign = currentCampaign();
    const teamInput = document.getElementById("teamNameInput");
    if (teamInput && String(teamInput.value || "").trim()) store.settings.teamName = cleanTeamName(teamInput.value);
    campaign.teamName = cleanTeamName(store.settings.teamName);
    campaign.formation = name;
    campaign.lineup = {};
    campaign.bench = [];
    campaign.draftPack = null;
    campaign.draftStage = 0;
    campaign.status = "draft";
    saveStore();
    renderDraft();
  }

  // Draft: o D20 escolhe a faixa de OVR visual das opções.
  function renderDraft() {
    clearDraftRollTimers();
    const campaign = currentCampaign();
    if (!campaign.formation) {
      renderFormationSetup();
      return;
    }
    campaign.status = "draft";
    const stages = draftStages(campaign);

    if (campaign.squad.length >= 23 || campaign.draftStage >= stages.length) {
      campaign.draftPack = null;
      saveStore();
      renderRoster();
      return;
    }

    if (!campaign.draftPack) {
      campaign.draftPack = createDraftPack(campaign);
      saveStore();
    }

    const stage = stages[campaign.draftStage];
    const pack = campaign.draftPack;

    if (!pack.revealed) {
      renderDraftRoll(stage, pack);
      return;
    }

    const selected = new Set(pack.picks);
    const selectedCards = pack.options.filter((player) => selected.has(player.id));
    if (campaign.draftMode === "selection") {
      renderSelectionDraft(campaign, stage, pack, selectedCards);
      return;
    }
    const band = draftBand(pack.roll);

    app.innerHTML = `
      <article class="card">
        <div class="stage-strip">
          <div>
            <p class="eyebrow">Draft ${campaign.draftStage + 1}/${stages.length}</p>
            <h2>${escapeHtml(stage.title)}</h2>
            <p class="muted">Escolha cartas para montar o elenco. A escalação dos titulares acontece depois do draft.</p>
          </div>
          <div class="d20 roll ${pack.roll === 20 ? "natural-20" : ""}" aria-label="Resultado do D20">${pack.roll}</div>
        </div>
        <div class="row">
          <span class="pill rarity-${band.key}">${escapeHtml(band.label)}</span>
          <span class="pill">OVR ${band.minOvr}${band.minOvr === band.maxOvr ? "" : `-${band.maxOvr}`}</span>
          <span class="pill">${Math.max(0, stage.qty - selected.size)} escolha(s) restante(s)</span>
          <span class="pill">${campaign.formation}</span>
        </div>
        <div class="chosen-strip">
          <strong>Escolhidos nesta etapa</strong>
          <div class="chosen-list">
            ${selectedCards.length ? selectedCards.map((player) => `<span class="pill">${escapeHtml(cardLabel(player))}</span>`).join("") : `<span class="pill">Nenhum jogador escolhido</span>`}
          </div>
        </div>
      </article>

      <section class="draft-layout">
        ${draftRosterPanel(campaign, selectedCards)}
        <section class="grid card-grid">
        ${pack.options.map((player) => playerCard(player, selected.has(player.id), "draft-select")).join("")}
        </section>
      </section>

      <article class="card">
        <button class="primary-button" data-action="draft-confirm" type="button" ${selected.size === stage.qty ? "" : "disabled"}>
          Confirmar escolhas
        </button>
      </article>
      ${draftConfirmBar(campaign, selectedCards, selected.size === stage.qty, "Confirmar Convocados")}
    `;
  }

  function renderDraftRoll(stage, pack) {
    const stages = draftStages(store.current);
    const selectionMode = pack.mode === "selection";
    app.innerHTML = `
      <article class="card roll-card">
        <p class="eyebrow">Draft ${store.current.draftStage + 1}/${stages.length}</p>
        <h2>${escapeHtml(stage.title)}</h2>
        <p class="muted">Rolando o D20 para definir ${selectionMode ? "a categoria de seleções históricas" : "a faixa de OVR das cartas"}...</p>
        <div class="roll-arena">
          <div class="d20-shell">
            <div class="d20 d20-big rolling" id="rollValue" aria-label="D20 rolando">?</div>
          </div>
          <strong class="roll-category" id="rollCategory">Rolando...</strong>
          <span class="pill" id="rollOvr">Aguardando faixa</span>
        </div>
      </article>
    `;

    let ticks = 0;
    d20IntervalId = setInterval(() => {
      const value = document.getElementById("rollValue");
      if (!value) return;
      ticks += 1;
      value.textContent = randomInt(1, 20);
      value.style.transform = `rotate(${ticks % 2 ? 7 : -7}deg) scale(${ticks % 3 === 0 ? 1.04 : 1})`;
    }, 65);

    d20TimeoutId = setTimeout(() => {
      clearInterval(d20IntervalId);
      d20IntervalId = null;

      const value = document.getElementById("rollValue");
      const category = document.getElementById("rollCategory");
      const ovr = document.getElementById("rollOvr");
      const band = selectionMode ? selectionBand(pack.roll) : draftBand(pack.roll);
      if (value) {
        value.textContent = pack.roll;
        value.removeAttribute("style");
        value.classList.remove("rolling");
        value.classList.add("settled");
        if (pack.roll === 20) value.classList.add("natural-20");
        if (pack.roll === 1) value.classList.add("critical-1");
        if (pack.roll >= 15 && pack.roll <= 19) value.classList.add("great-roll");
        if (pack.roll >= 1 && pack.roll <= 4) value.classList.add("difficult-roll");
      }
      if (category) {
        category.textContent = `${rollFeedback(pack.roll)} · ${band.label}`;
        category.classList.add(band.key);
      }
      if (ovr) {
        ovr.textContent = selectionMode ? "Escolha uma seleção" : `OVR ${band.minOvr}${band.minOvr === band.maxOvr ? "" : `-${band.maxOvr}`}`;
        ovr.classList.add(`rarity-${band.key}`);
      }

      pack.revealed = true;
      saveStore();
      d20TimeoutId = setTimeout(renderDraft, 760);
    }, 1450);
  }

  function createDraftPack(campaign) {
    const stage = draftStages(campaign)[campaign.draftStage];
    if (campaign.draftMode === "selection") return createSelectionDraftPack(campaign, stage);
    const roll = randomInt(1, 20);
    const band = draftBand(roll);
    const selectedIds = new Set(campaign.squad.map((player) => player.id));
    const listSize = Math.max(stage.qty + 4, 6);

    let options = uniqueNames(
      shuffle(PLAYERS.filter((player) => {
        const ovr = playerOverall(player);
        return !player.selectionOnly && playerMatchesDraftStage(player, stage) && ovr >= band.minOvr && ovr <= band.maxOvr && !selectedIds.has(player.id);
      })),
      listSize
    );

    if (options.length < stage.qty) {
      const usedNames = new Set(options.map((player) => player.nome));
      const fallback = shuffle(PLAYERS.filter((player) => {
        const ovr = playerOverall(player);
        return !player.selectionOnly && playerMatchesDraftStage(player, stage) && ovr >= band.minOvr && ovr <= band.maxOvr && !selectedIds.has(player.id) && !usedNames.has(player.nome);
      }));
      options = options.concat(uniqueNames(fallback, listSize - options.length));
    }

    return { roll, rarity: band.key, options, picks: [], revealed: false };
  }

  function createSelectionDraftPack(campaign, stage) {
    const roll = randomInt(1, 20);
    const band = selectionBand(roll);
    const draftedKeys = draftedPlayerKeys(campaign);
    const availableSelections = selectionOptionsForStage(band.level, stage, draftedKeys);
    return {
      mode: "selection",
      roll,
      rarity: band.key,
      selectionLevel: band.level,
      selectionOptions: availableSelections,
      selectedSelectionId: null,
      options: [],
      picks: [],
      revealed: false
    };
  }

  function selectionOptionsForStage(level, stage, draftedKeys) {
    const result = [];
    const seen = new Set();
    const minCompatible = minimumSelectionPlayers(stage);

    for (const candidateLevel of selectionFallbackLevels(level)) {
      const candidates = shuffle(HISTORIC_SELECTIONS.filter((selectionItem) => {
        return selectionItem.level === candidateLevel && isSelectionComplete(selectionItem.id) && selectionPlayers(selectionItem, stage, draftedKeys).length >= minCompatible;
      }));
      for (const selectionItem of candidates) {
        if (seen.has(selectionItem.id)) continue;
        seen.add(selectionItem.id);
        result.push(selectionItem);
        if (result.length === 4) return result;
      }
    }

    if (result.length < 4) {
      const relaxed = shuffle(HISTORIC_SELECTIONS.filter((selectionItem) => {
        return !seen.has(selectionItem.id) && isSelectionComplete(selectionItem.id) && selectionPlayers(selectionItem, stage, draftedKeys).length > 0;
      }));
      for (const selectionItem of relaxed) {
        seen.add(selectionItem.id);
        result.push(selectionItem);
        if (result.length === 4) return result;
      }
    }

    return result;
  }

  function uniqueNames(players, limit) {
    const names = new Set();
    const result = [];
    for (const player of players) {
      if (names.has(player.nome)) continue;
      names.add(player.nome);
      result.push(player);
      if (result.length >= limit) break;
    }
    return result;
  }

  function renderSelectionDraft(campaign, stage, pack, selectedCards) {
    const stages = draftStages(campaign);
    const band = selectionBand(pack.roll);
    const selectedSelection = HISTORIC_SELECTIONS.find((item) => item.id === pack.selectedSelectionId);
    app.innerHTML = `
      <article class="card">
        <div class="stage-strip">
          <div>
            <p class="eyebrow">Draft por Seleções ${campaign.draftStage + 1}/${stages.length}</p>
            <h2>${escapeHtml(stage.title)}</h2>
            <p class="muted">O D20 sorteou uma categoria de seleções. Escolha uma seleção e depois um jogador compatível.</p>
          </div>
          <div class="d20 roll ${pack.roll === 20 ? "natural-20" : ""}" aria-label="Resultado do D20">${pack.roll}</div>
        </div>
        <div class="row">
          <span class="pill rarity-${band.key}">${escapeHtml(band.label)}</span>
          <span class="pill">Posição: ${escapeHtml(stage.title)}</span>
          <span class="pill">${selectedCards.length ? "Jogador escolhido" : "Escolha 1 jogador"}</span>
        </div>
      </article>

      <section class="draft-layout">
        <article class="card team-preview">
          <h3>Seleções sorteadas</h3>
          <div class="selection-grid">
            ${pack.selectionOptions.length ? pack.selectionOptions.map((selectionItem) => selectionCard(selectionItem, pack.selectedSelectionId === selectionItem.id)).join("") : `<p class="empty">Nenhuma seleção compatível nesta faixa.</p>`}
          </div>
        </article>
        <article class="card">
          <h3>${selectedSelection ? `Jogadores de ${escapeHtml(selectedSelection.nome)}` : "Escolha uma seleção"}</h3>
          ${selectedSelection ? `
            <section class="grid card-grid">
              ${pack.options.map((player) => selectionDraftPlayerCard(campaign, player, pack.picks.includes(player.id))).join("")}
            </section>
          ` : `<p class="empty">Selecione uma das seleções sorteadas para ver jogadores compatíveis.</p>`}
        </article>
        ${draftRosterPanel(campaign, selectedCards)}
      </section>

      <article class="card">
        <button class="primary-button" data-action="draft-confirm" type="button" ${pack.picks.length === 1 ? "" : "disabled"}>
          Confirmar jogador
        </button>
      </article>
      ${draftConfirmBar(campaign, selectedCards, pack.picks.length === 1, "Confirmar Convocado")}
    `;
  }

  function selectionCard(selectionItem, selected) {
    return `
      <button class="selection-card ${selected ? "selected" : ""}" data-action="selection-pick" data-id="${selectionItem.id}" type="button">
        <strong>${escapeHtml(selectionItem.nome)}</strong>
        <span>${escapeHtml(selectionLevelLabel(selectionItem.level))}</span>
      </button>
    `;
  }

  function draftConfirmBar(campaign, selectedCards, canConfirm, label) {
    const selectedIds = new Set(campaign.squad.map((player) => player.id));
    const total = campaign.squad.length + selectedCards.filter((player) => !selectedIds.has(player.id)).length;
    const complete = total >= 23;
    return `
      <div class="draft-confirm-bar ${canConfirm ? "ready" : ""} ${complete ? "complete" : ""}">
        <div>
          <strong>Convocados: ${total}/23</strong>
          <small>${complete ? "Elenco completo" : (canConfirm ? "Pronto para confirmar esta escolha" : "Escolha os jogadores da etapa")}</small>
        </div>
        <button class="primary-button" data-action="draft-confirm" type="button" ${canConfirm ? "" : "disabled"}>${escapeHtml(label)}</button>
      </div>
    `;
  }

  function selectHistoricSelection(id) {
    const campaign = currentCampaign();
    const pack = campaign.draftPack;
    if (!pack || pack.mode !== "selection" || !pack.selectionOptions.some((item) => item.id === id)) return;
    const stage = draftStages(campaign)[campaign.draftStage];
    const draftedKeys = draftedPlayerKeys(campaign);
    const selectionItem = HISTORIC_SELECTIONS.find((item) => item.id === id);
    pack.selectedSelectionId = id;
    pack.options = selectionPlayers(selectionItem, stage, draftedKeys, true);
    pack.picks = [];
    saveStore();
    renderDraft();
  }

  function toggleDraftPick(id) {
    const campaign = currentCampaign();
    const stage = draftStages(campaign)[campaign.draftStage];
    const pack = campaign.draftPack;
    const exists = pack.options.some((player) => player.id === id);
    if (!exists) return;

    if (pack.mode === "selection") {
      const player = findPlayer(id);
      if (player && draftedPlayerKeys(campaign).has(playerSourceKey(player))) return;
      pack.picks = pack.picks.includes(id) ? [] : [id];
    } else if (pack.picks.includes(id)) {
      pack.picks = pack.picks.filter((pick) => pick !== id);
    } else if (pack.picks.length < stage.qty) {
      pack.picks.push(id);
    }

    saveStore();
    renderDraft();
  }

  function confirmDraftStage() {
    const campaign = currentCampaign();
    const stage = draftStages(campaign)[campaign.draftStage];
    const pack = campaign.draftPack;
    if (!pack || pack.picks.length !== stage.qty) return;

    const chosen = pack.picks.map((id, index) => {
      const player = findPlayer(id);
      return pack.mode === "selection" && player ? copySelectionPlayer(player, campaign, pack, index) : player;
    }).filter(Boolean);
    const existingIds = new Set(campaign.squad.map((player) => player.id));
    const confirmedIds = [];
    chosen.forEach((player) => {
      if (!existingIds.has(player.id)) {
        campaign.squad.push(player);
        campaign.playerStats[player.id] = campaign.playerStats[player.id] || basePlayerStat(player);
        confirmedIds.push(player.id);
      }
    });
    campaign.bench = Array.from(new Set([...(campaign.bench || []), ...confirmedIds]));

    campaign.draftStage += 1;
    campaign.draftPack = null;
    saveStore();
    renderDraft();
  }

  function copySelectionPlayer(player, campaign, pack, index) {
    return {
      ...player,
      id: `${player.id}__${campaign.id}__${campaign.draftStage}__${index}`,
      sourcePlayerId: player.sourcePlayerId || player.id,
      sourceSelectionId: pack.selectedSelectionId || null,
      selectionCopy: true
    };
  }

  function playerSourceKey(player) {
    return player?.sourcePlayerId || player?.id || "";
  }

  function draftedPlayerKeys(campaign) {
    return new Set((campaign?.squad || []).map(playerSourceKey).filter(Boolean));
  }

  function draftStages(campaign) {
    const starterSlots = formationSlots(campaign.formation || "4-3-3");
    const grouped = [];
    starterSlots.forEach((slotItem) => {
      const key = `${slotItem.sector}:${slotItem.label}:${slotItem.accepts.join("/")}`;
      const existing = grouped.find((stage) => stage.key === key);
      if (existing) {
        existing.qty += 1;
      } else {
        grouped.push({
          key,
          title: slotItem.label,
          sector: slotItem.sector,
          accepts: slotItem.accepts,
          qty: 1,
          reserve: false,
          slotIds: []
        });
      }
    });

    const starterCounts = starterSlots.reduce((counts, slotItem) => {
      counts[slotItem.sector] = (counts[slotItem.sector] || 0) + 1;
      return counts;
    }, {});
    const reserveStages = SECTOR_ORDER.map((sector) => ({
      title: `${SECTOR_LABELS[sector]} reservas`,
      sector,
      qty: Math.max(0, ROSTER_TARGETS[sector] - (starterCounts[sector] || 0)),
      reserve: true,
      slotIds: []
    })).filter((stage) => stage.qty > 0);

    const stages = grouped.concat(reserveStages);
    if (campaign.draftMode !== "selection") return stages;

    return stages.flatMap((stage) => {
      return Array.from({ length: stage.qty }, (_, index) => ({
        ...stage,
        title: stage.qty > 1 ? `${stage.title} ${index + 1}` : stage.title,
        qty: 1
      }));
    });
  }

  function formationSummary(name) {
    const formation = FORMATIONS[name];
    return `${formation.GK} GOL, ${formation.DEF} DEF, ${formation.MID} MEI, ${formation.ATT} ATA`;
  }

  function slot(label, sector, accepts) {
    return { label, sector, accepts };
  }

  function selection(id, nome, level) {
    return { id, nome, level };
  }

  function lineupBoard(campaign, previewPlayers, title, interactive = false) {
    const slots = formationSlots(campaign.formation || "4-3-3");
    const previewById = new Map(previewPlayers.map((player) => [player.id, player]));
    const rows = formationFieldRows(campaign.formation || "4-3-3", slots);
    const lineupPlayers = slots.map((slot) => {
      const playerId = campaign.lineup?.[slot.id];
      return playerId ? (previewById.get(playerId) || findPlayer(playerId)) : null;
    }).filter(Boolean);
    const links = lineupLinkAnalysis(lineupPlayers);
    const slotPositions = fieldSlotPositions(rows, campaign, previewById);
    const linkLines = fieldLinkLines(links, slotPositions);
    return `
      <div class="lineup-board">
        <div class="board-header">
          <h3>${escapeHtml(title)}</h3>
          <span class="pill">${escapeHtml(campaign.formation || "4-3-3")}</span>
        </div>
        <div class="football-field ${linkLines.length ? "has-link-lines" : ""} formation-${escapeHtml(String(campaign.formation || "4-3-3").replace(/[^0-9-]/g, ""))}" aria-label="Campo com escalação">
          ${fieldLinkSvg(linkLines)}
          <div class="field-mark center-circle"></div>
          <div class="field-mark halfway-line"></div>
          <div class="field-mark penalty-box top-box"></div>
          <div class="field-mark penalty-box bottom-box"></div>
          <div class="field-lines">
            ${rows.map((row) => `
              <div class="field-row row-size-${row.length}" style="--row-count: ${row.length}">
                ${row.map((slot) => fieldSlot(campaign, slot, previewById, interactive, links.playerLinks)).join("")}
              </div>
            `).join("")}
          </div>
        </div>
        ${lineupLinksSummary(links)}
      </div>
    `;
  }

  function fieldLinkSvg(lines) {
    if (!lines.length) return "";
    return `
      <svg class="field-link-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        ${lines.map((line) => `<line class="field-link-line ${line.type === "selection" ? "selection-link-line" : "country-link-line"}" x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}" />`).join("")}
      </svg>
    `;
  }

  function fieldSlotPositions(rows, campaign, previewById) {
    const positions = new Map();
    rows.forEach((row, rowIndex) => {
      const y = rows.length === 1 ? 50 : 10 + (rowIndex * 80) / Math.max(rows.length - 1, 1);
      row.forEach((slot, slotIndex) => {
        const playerId = campaign.lineup?.[slot.id];
        const player = playerId ? (previewById.get(playerId) || findPlayer(playerId)) : null;
        if (!player) return;
        const x = ((slotIndex + 1) * 100) / (row.length + 1);
        positions.set(player.id, { id: player.id, x: roundLinkCoord(x), y: roundLinkCoord(y) });
      });
    });
    return positions;
  }

  function fieldLinkLines(links, positions) {
    const lines = [];
    const seen = new Set();
    const strongPairs = new Set();
    links.selectionGroups.forEach((group) => {
      const ids = group.players.map((player) => player.id).filter((id) => positions.has(id));
      ids.forEach((id, index) => {
        ids.slice(index + 1).forEach((otherId) => strongPairs.add([id, otherId].sort().join("|")));
      });
    });
    const addGroup = (group, type, maxLines) => {
      const points = group.players.map((player) => positions.get(player.id)).filter(Boolean);
      if (points.length < 2) return;
      const chain = nearestPointChain(points);
      chain.slice(1).forEach((point, index) => {
        if (lines.length >= maxLines) return;
        const previous = chain[index];
        const key = [previous.id, point.id].sort().join("|");
        if (type === "country" && strongPairs.has(key)) return;
        if (seen.has(key)) return;
        seen.add(key);
        lines.push({ type, x1: previous.x, y1: previous.y, x2: point.x, y2: point.y });
      });
    };

    links.selectionGroups.forEach((group) => addGroup(group, "selection", 8));
    links.countryGroups.forEach((group) => addGroup(group, "country", 12));
    return lines.slice(0, 12);
  }

  function nearestPointChain(points) {
    const remaining = [...points].sort((a, b) => a.y - b.y || a.x - b.x);
    const chain = remaining.length ? [remaining.shift()] : [];
    while (remaining.length) {
      const current = chain[chain.length - 1];
      let bestIndex = 0;
      let bestDistance = Infinity;
      remaining.forEach((point, index) => {
        const distance = ((point.x - current.x) ** 2) + ((point.y - current.y) ** 2);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      chain.push(remaining.splice(bestIndex, 1)[0]);
    }
    return chain;
  }

  function roundLinkCoord(value) {
    return Math.round(value * 10) / 10;
  }

  function lineupLinksSummary(links) {
    if (!links.countryGroups.length && !links.selectionGroups.length) {
      return `<div class="link-summary muted">Links ativos: nenhum por enquanto.</div>`;
    }
    const countryRows = links.countryGroups.map((group) => `<span class="link-chip country-link-chip">${escapeHtml(group.label)}: ${group.count} jogadores</span>`);
    const selectionRows = links.selectionGroups.map((group) => `<span class="link-chip selection-link-chip">${escapeHtml(group.label)}: ${group.count} jogadores</span>`);
    return `
      <div class="link-summary">
        <strong>Links ativos</strong>
        <div class="link-chip-list">${countryRows.concat(selectionRows).join("")}</div>
        <small class="muted">Bônus leve: +${Math.round(links.bonus.attack * 100)}% ataque · +${Math.round(links.bonus.creativity * 100)}% criação</small>
      </div>
    `;
  }

  function formationFieldRows(name, slots) {
    const byId = new Map(slots.map((slot) => [slot.id, slot]));
    const rowIds = {
      "4-3-3": [["PE", "CA", "PD"], ["VOL", "MC", "MEI"], ["LE", "ZAG", "ZAG-2", "LD"], ["GOL"]],
      "4-4-2": [["SA", "CA"], ["ME", "VOL", "MC", "MD"], ["LE", "ZAG", "ZAG-2", "LD"], ["GOL"]],
      "4-2-3-1": [["CA"], ["PE", "MEI", "PD"], ["VOL", "VOL-2"], ["LE", "ZAG", "ZAG-2", "LD"], ["GOL"]],
      "3-5-2": [["SA", "CA"], ["ALA", "VOL", "MC", "MEI", "ALA-2"], ["ZAG", "ZAG-2", "ZAG-3"], ["GOL"]],
      "3-4-3": [["PE", "CA", "PD"], ["ALA", "MC", "MC-2", "ALA-2"], ["ZAG", "ZAG-2", "ZAG-3"], ["GOL"]],
      "5-3-2": [["SA", "CA"], ["VOL", "MC", "MEI"], ["LE", "ZAG", "ZAG-2", "ZAG-3", "LD"], ["GOL"]]
    };
    const rows = rowIds[name] || rowIds["4-3-3"];
    return rows.map((row) => row.map((id) => byId.get(id)).filter(Boolean)).filter((row) => row.length);
  }

  function fieldSlot(campaign, slot, previewById, interactive = false, playerLinks = new Map()) {
    const playerId = campaign.lineup?.[slot.id];
    const player = playerId ? (previewById.get(playerId) || findPlayer(playerId)) : null;
    const ovr = player ? playerOverall(player) : 0;
    const active = activeFormationSlotId === slot.id;
    const tag = interactive ? "button" : "div";
    const action = interactive ? (player ? "lineup-clear" : "lineup-slot") : "";
    const actionAttrs = interactive ? `data-action="${action}" data-id="${escapeHtml(slot.id)}" type="button"` : "";
    const link = player ? playerLinks.get(player.id) : null;
    const linkClass = link?.selection ? "link-selection" : (link?.country ? "link-country" : "");
    return `
      <${tag} class="field-slot sector-${slot.sector.toLowerCase()} ${player ? `filled ovr-${overallBand(ovr).key}` : ""} ${linkClass} ${active ? "active" : ""}" ${actionAttrs}>
        <span class="slot-label">${escapeHtml(slot.label)}</span>
        ${player ? `
          <strong>${escapeHtml(cardLabel(player))}</strong>
          <small>${escapeHtml(slot.label)}</small>
          <span class="mini-ovr">OVR ${ovr}</span>
        ` : `
          <em>Escolher</em>
          <span class="mini-ovr empty-ovr">Vazio</span>
        `}
      </${tag}>
    `;
  }

  function lineupLinkAnalysis(players) {
    const countryMap = new Map();
    const selectionMap = new Map();
    players.filter(Boolean).forEach((player) => {
      const country = player.pais || "Sem país";
      if (!countryMap.has(country)) countryMap.set(country, []);
      countryMap.get(country).push(player);
      (player.selectionTags || []).forEach((tag) => {
        if (!selectionMap.has(tag)) selectionMap.set(tag, []);
        selectionMap.get(tag).push(player);
      });
    });

    const countryGroups = Array.from(countryMap.entries())
      .filter(([, group]) => group.length >= 2)
      .map(([label, group]) => ({ key: label, label, count: group.length, players: group }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    const selectionGroups = Array.from(selectionMap.entries())
      .filter(([, group]) => group.length >= 3)
      .map(([key, group]) => ({ key, label: selectionNameById(key), count: group.length, players: group }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

    const playerLinks = new Map();
    countryGroups.forEach((group) => {
      group.players.forEach((player) => {
        playerLinks.set(player.id, { ...(playerLinks.get(player.id) || {}), country: group.key });
      });
    });
    selectionGroups.forEach((group) => {
      group.players.forEach((player) => {
        playerLinks.set(player.id, { ...(playerLinks.get(player.id) || {}), selection: group.key });
      });
    });

    const countryScore = countryGroups.reduce((sum, group) => sum + Math.max(0, group.count - 1), 0);
    const selectionScore = selectionGroups.reduce((sum, group) => sum + Math.max(0, group.count - 2), 0);
    const attack = clamp(countryScore * 0.008 + selectionScore * 0.025, 0, 0.08);
    const creativity = clamp(countryScore * 0.01 + selectionScore * 0.03, 0, 0.08);

    return { countryGroups, selectionGroups, playerLinks, bonus: { attack, creativity } };
  }

  function selectionNameById(id) {
    const selectionItem = HISTORIC_SELECTIONS.find((item) => item.id === id);
    return selectionItem ? selectionItem.nome : id.replace(/-/g, " ");
  }

  function benchBoard(campaign, previewPlayers) {
    const selectedIds = new Set(Object.values(campaign.lineup || {}).filter(Boolean));
    const confirmedBench = (campaign.squad || []).filter((player) => !selectedIds.has(player.id));
    const previewIds = new Set(previewPlayers.map((player) => player.id));
    const bench = confirmedBench.concat(previewPlayers.filter((player) => !selectedIds.has(player.id) && !confirmedBench.some((item) => item.id === player.id)));
    return `
      <div class="bench-board">
        <div class="board-header">
          <h3>Banco de reservas</h3>
          <span class="pill">${bench.length}/12</span>
        </div>
        <div class="bench-list">
          ${bench.length ? bench.map((player) => `
            <span class="bench-chip ${previewIds.has(player.id) ? "preview" : ""}">
              ${escapeHtml(cardLabel(player))} · OVR ${playerOverall(player)}
            </span>
          `).join("") : `<span class="bench-chip empty-chip">Banco vazio</span>`}
        </div>
      </div>
    `;
  }

  function draftRosterPanel(campaign, previewPlayers) {
    const selectedIds = new Set(campaign.squad.map((player) => player.id));
    const roster = campaign.squad.concat(previewPlayers.filter((player) => !selectedIds.has(player.id)));
    return `
      <article class="card team-preview draft-roster-panel">
        <div class="board-header">
          <div>
            <p class="eyebrow">Convocados</p>
            <h3>Elenco em montagem</h3>
          </div>
          <span class="pill">${roster.length}/23</span>
        </div>
        <div class="draft-roster-list">
          ${roster.length ? roster.map((player) => `
            <div class="draft-roster-player">
              <span>
                <strong>${escapeHtml(cardLabel(player))}</strong>
                <small>${escapeHtml(player.posicoes.join(" / "))}</small>
              </span>
              <b>OVR ${playerOverall(player)}</b>
            </div>
          `).join("") : `<p class="empty">Nenhum jogador convocado ainda.</p>`}
        </div>
      </article>
    `;
  }

  function renderRoster() {
    const campaign = currentCampaign();
    campaign.status = campaign.squad.length >= 23 ? "formation" : "draft";
    saveStore();

    app.innerHTML = `
      <article class="card">
        <p class="eyebrow">Elenco</p>
        <h2>${campaign.squad.length}/23 convocados</h2>
        <div class="actions">
          <button class="primary-button" data-action="formation" type="button" ${campaign.squad.length >= 23 ? "" : "disabled"}>Montar escalação</button>
          <button class="secondary-button" data-action="save-lineup" type="button" ${isLineupComplete(campaign) ? "" : "disabled"}>Ir para partidas</button>
          <button class="ghost-button" data-action="continue" type="button">Voltar ao fluxo</button>
        </div>
      </article>
      <article class="card">
        ${lineupBoard(campaign, [], "Campo")}
        ${benchBoard(campaign, [])}
      </article>
      <section class="grid two">
        ${["GK", "DEF", "MID", "ATT"].map((sector) => rosterGroup(campaign, sector)).join("")}
      </section>
    `;
  }

  function rosterGroup(campaign, sector) {
    const players = campaign.squad.filter((player) => player.setor === sector);
    return `
      <article class="card">
        <h3>${SECTOR_LABELS[sector]} <span class="muted">(${players.length})</span></h3>
        <div class="grid">
          ${players.map((player) => readonlyPlayer(player)).join("")}
        </div>
      </article>
    `;
  }

  function renderFormation() {
    const campaign = currentCampaign();
    if (campaign.squad.length < 23) {
      renderDraft();
      return;
    }

    campaign.status = "formation";
    const slots = formationSlots(campaign.formation);
    const selectedIds = new Set(Object.values(campaign.lineup).filter((id) => id && findPlayer(id)));
    if (activeFormationSlotId && !slots.some((slot) => slot.id === activeFormationSlotId)) activeFormationSlotId = null;
    if (!activeFormationSlotId) {
      const firstEmpty = slots.find((slot) => !campaign.lineup[slot.id]);
      activeFormationSlotId = (firstEmpty || slots[0])?.id || null;
    }
    const complete = isLineupComplete(campaign);
    saveStore();

    app.innerHTML = `
      <article class="card">
        <p class="eyebrow">Formação</p>
        <h2>Escolha titulares</h2>
        <p class="muted">Preencha os 11 espaços usando jogadores compatíveis com cada posição. Jogadores marcados com ⭐ já estão entre os titulares.</p>
        <select class="select" id="formationSelect" aria-label="Formação">
          ${Object.keys(FORMATIONS).map((name) => `<option value="${name}" ${name === campaign.formation ? "selected" : ""}>${name}</option>`).join("")}
        </select>
        ${formationNotice ? `<p class="notice">${escapeHtml(formationNotice)}</p>` : (complete ? "" : `<p class="notice">A formação ainda não foi preenchida.</p>`)}
      </article>

      <section class="formation-workbench">
        <article class="card formation-field-card">
          ${lineupBoard(campaign, [], "Seu time em campo", true)}
        </article>
        <article class="card lineup-picker-card">
          ${lineupPicker(campaign, slots, selectedIds)}
        </article>
      </section>

      <section class="formation-support-grid">
        <article class="card formation-bench-card">
          ${lineupAvailableRoster(campaign, slots, selectedIds)}
        </article>
        <article class="card">
        <h3>Disponíveis por setor</h3>
        <div class="grid two">
          ${["GK", "DEF", "MID", "ATT"].map((sector) => formationAvailability(campaign, sector, selectedIds)).join("")}
        </div>
        </article>
      </section>

      <article class="card">
        <div class="actions">
          <button class="primary-button" data-action="save-lineup" type="button" ${complete ? "" : "disabled"}>Salvar escalação</button>
          <button class="ghost-button" data-action="roster" type="button">Ver elenco</button>
        </div>
      </article>
    `;
  }

  function openLineupSlot(slotId) {
    const campaign = currentCampaign(false);
    if (!campaign) return;
    if (!formationSlots(campaign.formation).some((slot) => slot.id === slotId)) return;
    activeFormationSlotId = slotId;
    pendingLineupPlayerId = null;
    formationNotice = "";
    renderFormation();
  }

  function pickLineupPlayer(slotId, playerId) {
    const campaign = currentCampaign(false);
    if (!campaign) return;
    const slotItem = formationSlots(campaign.formation).find((slot) => slot.id === slotId);
    const player = findPlayer(playerId);
    if (!slotItem || !player || !campaign.squad.some((item) => item.id === playerId) || !isPlayerCompatibleWithSlot(player, slotItem)) return;
    const usedElsewhere = Object.entries(campaign.lineup || {}).some(([currentSlot, currentPlayer]) => currentSlot !== slotId && currentPlayer === playerId);
    if (usedElsewhere) return;
    campaign.lineup[slotId] = playerId;
    activeFormationSlotId = slotId;
    pendingLineupPlayerId = null;
    formationNotice = `${cardLabel(player)} entrou em ${slotItem.label}.`;
    saveStore();
    renderFormation();
  }

  function clearLineupSlot(slotId) {
    const campaign = currentCampaign(false);
    if (!campaign || !campaign.lineup || !formationSlots(campaign.formation).some((slot) => slot.id === slotId)) return;
    const removed = findPlayer(campaign.lineup[slotId]);
    delete campaign.lineup[slotId];
    activeFormationSlotId = slotId;
    pendingLineupPlayerId = null;
    formationNotice = removed ? `${cardLabel(removed)} voltou para Jogadores Disponíveis.` : "";
    saveStore();
    renderFormation();
  }

  function chooseLineupPlayer(playerId) {
    const campaign = currentCampaign(false);
    const player = findPlayer(playerId);
    if (!campaign || !player) return;
    const slots = formationSlots(campaign.formation);
    const currentIds = new Set(Object.values(campaign.lineup || {}).filter(Boolean));
    if (currentIds.has(playerId)) {
      formationNotice = `${cardLabel(player)} já está escalado. Clique na mini-carta no campo para removê-lo.`;
      pendingLineupPlayerId = null;
      renderFormation();
      return;
    }
    const compatibleSlots = slots.filter((slot) => isPlayerCompatibleWithSlot(player, slot));
    const emptySlots = compatibleSlots.filter((slot) => !campaign.lineup[slot.id]);
    if (emptySlots.length === 1) {
      placeLineupPlayer(emptySlots[0].id, playerId);
      return;
    }
    pendingLineupPlayerId = playerId;
    activeFormationSlotId = emptySlots[0]?.id || compatibleSlots[0]?.id || activeFormationSlotId;
    if (emptySlots.length > 1) {
      formationNotice = `Escolha a posição para ${cardLabel(player)}.`;
    } else if (compatibleSlots.length) {
      formationNotice = `Não há posição compatível vazia para ${cardLabel(player)}. Escolha quem substituir.`;
    } else {
      formationNotice = `${cardLabel(player)} não tem posição compatível nesta formação.`;
      pendingLineupPlayerId = null;
    }
    renderFormation();
  }

  function placeLineupPlayer(slotId, playerId) {
    const campaign = currentCampaign(false);
    const player = findPlayer(playerId);
    const slotItem = campaign ? formationSlots(campaign.formation).find((slot) => slot.id === slotId) : null;
    if (!campaign || !player || !campaign.squad.some((item) => item.id === playerId) || !slotItem || !isPlayerCompatibleWithSlot(player, slotItem)) return;
    const alreadyInLineup = Object.values(campaign.lineup || {}).includes(playerId);
    if (alreadyInLineup) return;
    const replaced = findPlayer(campaign.lineup?.[slotId]);
    campaign.lineup[slotId] = playerId;
    activeFormationSlotId = slotId;
    pendingLineupPlayerId = null;
    formationNotice = replaced
      ? `${cardLabel(player)} substituiu ${cardLabel(replaced)} em ${slotItem.label}.`
      : `${cardLabel(player)} entrou em ${slotItem.label}.`;
    saveStore();
    renderFormation();
  }

  function lineupAvailableRoster(campaign, slots, selectedIds) {
    const available = (campaign.squad || [])
      .filter((player) => !selectedIds.has(player.id))
      .sort((a, b) => playerOverall(b) - playerOverall(a) || cardLabel(a).localeCompare(cardLabel(b)));
    const pendingPlayer = pendingLineupPlayerId ? findPlayer(pendingLineupPlayerId) : null;
    return `
      <div class="lineup-available">
        <div class="board-header">
          <div>
            <p class="eyebrow">Elenco Convocado</p>
            <h3>Jogadores Disponíveis</h3>
          </div>
          <span class="pill">${available.length}/12</span>
        </div>
        <p class="muted">Clique em um jogador para encaixar automaticamente ou escolher uma posição compatível.</p>
        ${pendingPlayer ? lineupPlacementOptions(pendingPlayer, campaign, slots) : ""}
        <div class="lineup-available-grid">
          ${available.length ? available.map((player) => availablePlayerCard(player)).join("") : `<p class="empty">Todos os convocados estão no time titular.</p>`}
        </div>
      </div>
    `;
  }

  function availablePlayerCard(player) {
    const ovr = playerOverall(player);
    const band = overallBand(ovr);
    return `
      <button class="available-player-card ovr-${band.key}" data-action="lineup-player" data-id="${escapeHtml(player.id)}" type="button">
        <span>
          <strong>${escapeHtml(cardLabel(player))}</strong>
          <small>${escapeHtml(player.posicoes.join(" / "))}</small>
        </span>
        <b>OVR ${ovr}</b>
      </button>
    `;
  }

  function lineupPlacementOptions(player, campaign, slots) {
    const compatible = slots.filter((slot) => isPlayerCompatibleWithSlot(player, slot));
    const empty = compatible.filter((slot) => !campaign.lineup?.[slot.id]);
    const occupied = compatible.filter((slot) => campaign.lineup?.[slot.id]);
    const choices = empty.length ? empty : occupied;
    if (!choices.length) return "";
    return `
      <div class="placement-panel">
        <span>Escolha a posição</span>
        <strong>${escapeHtml(cardLabel(player))}</strong>
        <div class="placement-actions">
          ${choices.map((slot) => {
            const current = findPlayer(campaign.lineup?.[slot.id]);
            const label = current ? `${slot.label}: substituir ${cardLabel(current)}` : slot.label;
            return `<button class="ghost-button small" data-action="lineup-place" data-slot="${escapeHtml(slot.id)}" data-id="${escapeHtml(player.id)}" type="button">${escapeHtml(label)}</button>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  function lineupPicker(campaign, slots, selectedIds) {
    const slotItem = slots.find((slot) => slot.id === activeFormationSlotId) || slots[0];
    if (!slotItem) return `<p class="empty">Nenhum slot disponível.</p>`;
    const currentPlayerId = campaign.lineup?.[slotItem.id] || "";
    const usedElsewhere = new Set(Object.entries(campaign.lineup || {}).filter(([slotId]) => slotId !== slotItem.id).map(([, playerId]) => playerId).filter(Boolean));
    const compatible = campaign.squad
      .filter((player) => player.id !== currentPlayerId && isPlayerCompatibleWithSlot(player, slotItem) && !usedElsewhere.has(player.id))
      .sort((a, b) => playerOverall(b) - playerOverall(a) || cardLabel(a).localeCompare(cardLabel(b)));
    const currentPlayer = currentPlayerId ? findPlayer(currentPlayerId) : null;
    return `
      <div class="lineup-picker">
        <div class="board-header">
          <div>
            <p class="eyebrow">Escolha do slot</p>
            <h3>${escapeHtml(slotItem.label)}</h3>
          </div>
          <span class="pill">${compatible.length} opção(ões)</span>
        </div>
        ${currentPlayer ? `
          <div class="current-lineup-player">
            <span>Atual</span>
            <strong>${escapeHtml(cardLabel(currentPlayer))}</strong>
            <small class="muted">${escapeHtml(currentPlayer.posicoes.join(" / "))} · OVR ${playerOverall(currentPlayer)}</small>
            <button class="ghost-button small" data-action="lineup-clear" data-id="${escapeHtml(slotItem.id)}" type="button">Remover do slot</button>
          </div>
        ` : `<p class="muted">Slot vazio. Escolha um jogador compatível para aparecer no campo.</p>`}
        <div class="lineup-pick-list">
          ${compatible.length ? compatible.map((player) => lineupPickCard(player, slotItem, selectedIds.has(player.id) && player.id !== currentPlayerId, player.id === currentPlayerId)).join("") : `<p class="empty">Nenhum jogador compatível disponível.</p>`}
        </div>
      </div>
    `;
  }

  function lineupPickCard(player, slotItem, disabled, selected) {
    const ovr = playerOverall(player);
    const band = overallBand(ovr);
    return `
      <button class="lineup-pick-card ovr-${band.key} ${selected ? "selected" : ""}" data-action="lineup-pick" data-slot="${escapeHtml(slotItem.id)}" data-id="${escapeHtml(player.id)}" type="button" ${disabled ? "disabled" : ""}>
        <span>
          <strong>${escapeHtml(cardLabel(player))}</strong>
          <small>${escapeHtml(player.posicoes.join(" / "))}</small>
        </span>
        <b>OVR ${ovr}</b>
      </button>
    `;
  }

  function formationAvailability(campaign, sector, selectedIds) {
    const players = campaign.squad.filter((player) => player.setor === sector);
    return `
      <div class="soft-card">
        <strong>${SECTOR_LABELS[sector]}</strong>
        <p class="muted">${players.map((player) => {
          const marker = selectedIds.has(player.id) ? "⭐ " : "";
          return `${marker}${cardLabel(player)} (${player.posicoes.join(" / ")})`;
        }).map(escapeHtml).join(", ")}</p>
      </div>
    `;
  }

  function formationSlots(name) {
    const source = FORMATION_SLOTS[name] || FORMATION_SLOTS["4-3-3"];
    const counts = {};
    return source.map((slotConfig) => {
      counts[slotConfig.label] = (counts[slotConfig.label] || 0) + 1;
      const suffix = counts[slotConfig.label] > 1 ? `-${counts[slotConfig.label]}` : "";
      return {
        ...slotConfig,
        id: `${slotConfig.label}${suffix}`
      };
    });
  }

  function normalizePosition(position) {
    return position === "CA" ? "ATA" : position;
  }

  function isPlayerCompatibleWithSlot(player, slot) {
    if (!player || !slot) return false;
    const accepted = new Set(slot.accepts.map(normalizePosition));
    return player.posicoes.map(normalizePosition).some((position) => accepted.has(position));
  }

  function isSubstitutionCompatible(player, slot) {
    if (!player || !slot) return false;
    const accepted = new Set((SUBSTITUTION_COMPATIBILITY[slot.label] || slot.accepts).map(normalizePosition));
    return player.posicoes.map(normalizePosition).some((position) => accepted.has(position));
  }

  function playerMatchesDraftStage(player, stage) {
    if (!player || !stage) return false;
    if (stage.accepts) {
      const accepted = new Set(stage.accepts.map(normalizePosition));
      return player.posicoes.map(normalizePosition).some((position) => accepted.has(position));
    }
    return player.setor === stage.sector;
  }

  function selectionPlayers(selectionItem, stage, draftedKeys, includeDrafted = false) {
    if (!selectionItem) return [];
    const players = PLAYERS.filter((player) => {
      const drafted = draftedKeys.has(playerSourceKey(player));
      return playerSelectionTags(player).includes(selectionItem.id) && (includeDrafted || !drafted) && playerMatchesDraftStage(player, stage);
    });
    if (includeDrafted) {
      players.sort((a, b) => Number(draftedKeys.has(playerSourceKey(a))) - Number(draftedKeys.has(playerSourceKey(b))));
    }
    return uniqueNames(players, 8);
  }

  function minimumSelectionPlayers(stage) {
    if (!stage) return 2;
    return 2;
  }

  function isSelectionComplete(selectionId) {
    const counts = selectionRosterCounts(selectionId);
    return counts.gk >= 2 && counts.fullbacks >= 2 && counts.centerBacks >= 2 && counts.midfielders >= 3 && counts.attackers >= 3;
  }

  function selectionRosterCounts(selectionId) {
    const players = PLAYERS.filter((player) => playerSelectionTags(player).includes(selectionId));
    return players.reduce((counts, player) => {
      const positions = player.posicoes.map(normalizePosition);
      if (positions.includes("GOL")) counts.gk += 1;
      if (positions.some((position) => ["LE", "LD", "ALA"].includes(position))) counts.fullbacks += 1;
      if (positions.some((position) => ["ZAG", "LIB"].includes(position))) counts.centerBacks += 1;
      if (player.setor === "MID" || positions.some((position) => ["VOL", "MC", "MEI"].includes(position))) counts.midfielders += 1;
      if (player.setor === "ATT" || positions.some((position) => ["PE", "PD", "SA", "CA", "ATA"].includes(position))) counts.attackers += 1;
      return counts;
    }, { gk: 0, fullbacks: 0, centerBacks: 0, midfielders: 0, attackers: 0 });
  }

  function selectionFallbackLevels(level) {
    const fallback = {
      alternative: ["alternative", "strong", "very-strong", "finalist", "absolute"],
      strong: ["strong", "very-strong", "alternative", "finalist", "absolute"],
      "very-strong": ["very-strong", "finalist", "strong", "absolute", "alternative"],
      finalist: ["finalist", "absolute", "very-strong", "strong", "alternative"],
      absolute: ["absolute", "finalist", "very-strong", "strong", "alternative"]
    };
    return fallback[level] || ["strong", "very-strong", "finalist", "absolute", "alternative"];
  }

  function playerSelectionTags(player) {
    return Array.isArray(player?.selectionTags) ? player.selectionTags : [];
  }

  function lineupSlot(campaign, slot, selectedIds) {
    const currentId = campaign.lineup[slot.id] || "";
    const currentPlayer = currentId ? findPlayer(currentId) : null;
    const currentIsCompatible = currentPlayer && isPlayerCompatibleWithSlot(currentPlayer, slot);
    if (currentId && !currentIsCompatible) {
      delete campaign.lineup[slot.id];
    }
    const available = campaign.squad.filter((player) => isPlayerCompatibleWithSlot(player, slot));
    return `
      <div class="slot">
        <label for="slot-${slot.id}">${escapeHtml(slot.label)}</label>
        <small class="slot-help">Aceita: ${escapeHtml(slot.accepts.join(" / "))}</small>
        <select class="select" id="slot-${slot.id}" data-slot="${slot.id}">
          <option value="">Escolher jogador</option>
          ${available.map((player) => {
            const usedElsewhere = selectedIds.has(player.id) && player.id !== campaign.lineup[slot.id];
            return `<option value="${player.id}" ${player.id === campaign.lineup[slot.id] ? "selected" : ""} ${usedElsewhere ? "disabled" : ""}>${escapeHtml(cardLabel(player))} · ${escapeHtml(player.posicoes.join(" / "))}</option>`;
          }).join("")}
        </select>
      </div>
    `;
  }

  function saveLineup() {
    const campaign = currentCampaign();
    if (!isLineupComplete(campaign)) return;
    if (!campaign.worldCup) {
      campaign.worldCup = createWorldCup(campaign);
      campaign.matchIndex = 0;
      campaign.results = campaign.results || [];
    }
    campaign.status = campaign.worldCup.groupComplete ? "knockout" : "groups";
    saveStore();
    renderCampaign();
  }

  function isLineupComplete(campaign) {
    if (!campaign || !campaign.formation) return false;
    const slots = formationSlots(campaign.formation);
    const values = slots.map((slot) => {
      const player = findPlayer(campaign.lineup[slot.id]);
      return player && isPlayerCompatibleWithSlot(player, slot) ? player.id : "";
    }).filter(Boolean);
    return values.length === 11 && new Set(values).size === 11;
  }

  function renderCampaign() {
    const campaign = currentCampaign();
    if (!isLineupComplete(campaign)) {
      renderFormation();
      return;
    }

    const opponent = nextOpponent(campaign);
    const finished = ["champion", "eliminated"].includes(campaign.status);
    if (finished) {
      renderCampaignFinal(campaign);
      return;
    }
    const phase = currentPhaseLabel(campaign);
    app.innerHTML = `
      <section class="campaign-dashboard">
        <article class="card campaign-overview">
          <p class="eyebrow">Campanha</p>
          <h2>${escapeHtml(phase)}</h2>
          <p class="muted">Time: <strong>${escapeHtml(teamName(campaign))}</strong></p>
          ${opponent ? `<p class="muted">Próximo adversário: <strong>${escapeHtml(opponent.nome)}</strong></p>` : ""}
          <div class="row">
            <span class="pill">${campaign.results.length} jogo(s)</span>
            <span class="pill">${campaign.formation}</span>
            ${campaign.worldCup ? `<span class="pill">${escapeHtml(campaign.worldCup.groupName)}</span>` : ""}
          </div>
          <div class="actions">
            <button class="primary-button" data-action="match" type="button">Ir para partida</button>
            <button class="ghost-button" data-action="formation" type="button">Ajustar formação</button>
          </div>
        </article>
        ${campaign.worldCup ? groupStageCard(campaign) : ""}
        <article class="card campaign-results">
          <h3>Resultados</h3>
          ${campaign.results.length ? resultList(campaign.results) : `<p class="empty">Nenhuma partida simulada ainda.</p>`}
        </article>
      </section>
    `;
  }

  function renderMatch(result = null) {
    if (result) {
      app.innerHTML = matchResultCard(result);
      return;
    }

    const campaign = currentCampaign();
    const opponent = nextOpponent(campaign);
    if (!opponent) {
      renderCampaign();
      return;
    }

    app.innerHTML = `
      <article class="card">
        <p class="eyebrow">${escapeHtml(currentPhaseLabel(campaign))}</p>
        <h2>${escapeHtml(teamName(campaign))} x ${escapeHtml(opponent.nome)}</h2>
        <p class="muted">A simulação usa apenas os 11 titulares escolhidos. Banco disponível para ajustes manuais antes do jogo.</p>
        <div class="row">
          <span class="pill">${escapeHtml(SIMULATION_SPEEDS[store.settings.simulationSpeed]?.label || SIMULATION_SPEEDS.normal.label)}</span>
          ${campaign.worldCup && campaign.status === "groups" ? `<span class="pill">${escapeHtml(campaign.worldCup.groupName)}</span>` : ""}
        </div>
        ${balanceDebugPanel(campaign, opponent)}
        <button class="primary-button" data-action="simulate" type="button">Simular partida</button>
      </article>
    `;
  }

  // Simulação enxuta: calcula forças internas, gera gols e registra estatísticas.
  function simulateMatch() {
    clearMatchTimer();
    const simulation = buildMatchSimulation();
    if (!simulation) {
      renderCampaign();
      return;
    }
    const delay = simulationDelay();
    if (delay > 0) {
      const steps = simulationSteps(delay);
      activeMatchSimulation = simulation;
      simulation.liveProgress = { step: 0, steps, totalDelay: delay };
      renderMatchSimulation(simulation, 0, steps);
      runMatchSimulationProgress(simulation, 1, steps, delay);
      return;
    }
    completeMatchSimulation(simulation);
  }

  function runMatchSimulationProgress(simulation, step, steps, totalDelay) {
    const stepDelay = Math.max(25, Math.floor(totalDelay / 12));
    matchTimeoutId = setTimeout(() => {
      const minute = Math.min(90, Math.round((90 * step) / steps));
      simulation.liveProgress = { step, steps, totalDelay };
      renderMatchSimulation(simulation, step, steps);
      const pauseMinute = substitutionPauseDue(simulation, minute);
      if (pauseMinute) {
        matchTimeoutId = null;
        activeMatchSimulation = simulation;
        simulation.progress = { step, steps, totalDelay };
        simulation.activePauseMinute = pauseMinute;
        simulation.handledSubstitutionPauses.push(pauseMinute);
        renderSubstitutionPrompt(simulation, pauseMinute);
        return;
      }
      if (step >= steps) {
        simulation.liveProgress = null;
        matchTimeoutId = setTimeout(() => completeMatchSimulation(simulation), stepDelay);
        return;
      }
      runMatchSimulationProgress(simulation, step + 1, steps, totalDelay);
    }, stepDelay);
  }

  function completeMatchSimulation(simulation = null) {
    matchTimeoutId = null;
    activeMatchSimulation = null;
    activeSubstitutionOutSlotId = null;
    activeSubstitutionInId = null;
    substitutionNotice = "";
    const built = simulation || buildMatchSimulation();
    if (!built) {
      renderCampaign();
      return;
    }
    finalizePenaltyShootout(built);
    const { campaign, opponent, result } = built;

    result.events
      .filter((event) => event.team === "user")
      .forEach((event) => recordUserGoal(campaign, event.scorerId, event.assisterId));

    campaign.results.push(result);

    if (result.phase === "groups") {
      completeGroupRound(campaign, opponent, result);
    } else if (result.userWon && campaign.matchIndex === ROUND_NAMES.length - 1) {
      finishCampaign(campaign, "champion", "Final");
    } else if (result.userWon) {
      campaign.matchIndex += 1;
      campaign.status = "knockout";
    } else {
      finishCampaign(campaign, "eliminated", ROUND_NAMES[campaign.matchIndex] || "Mata-mata");
    }

    saveStore();
    renderMatch(result);
  }

  function finalizePenaltyShootout(simulation) {
    const result = simulation?.result;
    if (!result?.decidedByPenalties) return;
    const finalLineup = currentSimulationLineupPlayers(simulation);
    const penaltyLineup = finalLineup.length ? finalLineup : getLineupPlayers(simulation.campaign);
    const finalTeam = teamStrength(penaltyLineup);
    result.penalties = simulatePenaltyShootout(penaltyLineup, finalTeam, simulation.opponent);
    result.userWon = result.penalties.winner === "user";
    result.scoreText = resultScoreText(result);
  }

  function substitutionPauseDue(simulation, minute) {
    if (!simulation || simulation.result?.phase !== "groups" && simulation.result?.phase !== "knockout") return null;
    if ((simulation.substitutionsUsed || 0) >= MAX_SUBSTITUTIONS) return null;
    return SUBSTITUTION_PAUSES.find((pauseMinute) => minute >= pauseMinute && !simulation.handledSubstitutionPauses.includes(pauseMinute)) || null;
  }

  function renderSubstitutionPrompt(simulation, minute) {
    const result = simulation.result;
    const snapshot = matchSnapshot(result, minute);
    const comment = substitutionContextComment(simulation, minute);
    const substitutionsLeft = Math.max(0, MAX_SUBSTITUTIONS - (simulation.substitutionsUsed || 0));
    app.innerHTML = `
      <article class="card simulation-card">
        <p class="eyebrow">Fim do Primeiro Tempo</p>
        <div class="live-minute">${minute}'</div>
        <div class="scoreboard">
          <div class="scoreline">
            <span class="team-name">${escapeHtml(result.teamName)}</span>
            <span class="score-number">${snapshot.userGoals} x ${snapshot.opponentGoals}</span>
            <span class="team-name">${escapeHtml(result.opponentName)}</span>
          </div>
        </div>
        <p class="hero-lead">Intervalo de jogo</p>
        <p class="notice">${escapeHtml(comment)}</p>
        <p class="muted">Substituições restantes: <strong>${substitutionsLeft}</strong></p>
        <div class="actions">
          <button class="primary-button" data-action="substitution-open" type="button">Fazer Substituições</button>
          <button class="secondary-button" data-action="substitution-continue" type="button">Continuar Partida</button>
        </div>
      </article>
    `;
  }

  function pauseLiveMatch(mode = "manual") {
    const simulation = activeMatchSimulation;
    if (!simulation?.liveProgress) return;
    if (matchTimeoutId) {
      clearTimeout(matchTimeoutId);
      matchTimeoutId = null;
    }
    simulation.progress = { ...simulation.liveProgress };
    simulation.activePauseMinute = Math.min(90, Math.round((90 * simulation.progress.step) / simulation.progress.steps));
    activeSubstitutionOutSlotId = null;
    activeSubstitutionInId = null;
    substitutionNotice = "";
    if (mode === "substitution") {
      renderSubstitutionManager();
      return;
    }
    renderMatchPausePanel(false);
  }

  function renderMatchPausePanel(showStats = false) {
    const simulation = activeMatchSimulation;
    if (!simulation?.progress) return;
    const result = simulation.result;
    const minute = simulation.activePauseMinute || Math.min(90, Math.round((90 * simulation.progress.step) / simulation.progress.steps));
    const snapshot = matchSnapshot(result, minute);
    app.innerHTML = `
      <article class="card simulation-card pause-card">
        <p class="eyebrow">Partida pausada</p>
        <div class="live-minute">${minute}'</div>
        <div class="scoreboard">
          <div class="scoreline">
            <span class="team-name">${escapeHtml(result.teamName)}</span>
            <span class="score-number">${snapshot.userGoals} x ${snapshot.opponentGoals}</span>
            <span class="team-name">${escapeHtml(result.opponentName)}</span>
          </div>
        </div>
        <p class="muted">Substituições restantes: <strong>${Math.max(0, MAX_SUBSTITUTIONS - (simulation.substitutionsUsed || 0))}</strong></p>
        ${showStats ? matchStatsPanel(scaleMatchStats(result.stats, minute), `Estatísticas até ${minute}'`) : ""}
        <div class="actions">
          <button class="primary-button" data-action="substitution-continue" type="button">Continuar</button>
          <button class="secondary-button" data-action="substitution-open" type="button">Fazer Substituições</button>
          <button class="ghost-button" data-action="pause-stats" type="button">Ver Estatísticas</button>
        </div>
      </article>
    `;
  }

  function substitutionContextComment(simulation, minute) {
    if (!simulation) return "Seu time pode ajustar a partida agora.";
    simulation.substitutionComments = simulation.substitutionComments || {};
    if (simulation.substitutionComments[minute]) return simulation.substitutionComments[minute];

    const lineup = currentSimulationLineupPlayers(simulation);
    const comment = substitutionCommentFromLineup(lineup);
    simulation.substitutionComments[minute] = comment;
    return comment;
  }

  function substitutionCommentFromLineup(lineup) {
    const attackers = lineup.filter((player) => player.setor === "ATT");
    const midfielders = lineup.filter((player) => player.setor === "MID");
    const defenders = lineup.filter((player) => player.setor === "DEF");
    const comments = [];

    if (attackers.length) {
      const player = randomItem(attackers);
      comments.push(`${cardLabel(player)} teve poucas chances até agora.`);
      comments.push(`${cardLabel(player)} está sendo bem marcado.`);
    }
    if (midfielders.length) {
      const player = randomItem(midfielders);
      comments.push(`${cardLabel(player)} perdeu intensidade no meio.`);
      comments.push("Seu meio-campo perdeu controle nos últimos minutos.");
    }
    if (defenders.length) {
      const player = randomItem(defenders);
      comments.push(`${cardLabel(player)} fez cortes importantes, mas parece sobrecarregado.`);
      comments.push("O adversário está atacando muito por um dos lados.");
    }
    comments.push("A pausa pode ser um bom momento para ajustar o time.");

    return randomItem(comments);
  }

  function createInstantSubstitutionSuggestions(lineup) {
    return SUBSTITUTION_SUGGESTION_MINUTES.map((minute) => ({
      minute,
      text: substitutionCommentFromLineup(lineup)
    }));
  }

  function liveSubstitutionSuggestion(simulation, minute) {
    if (!simulation || (simulation.substitutionsUsed || 0) >= MAX_SUBSTITUTIONS) return null;
    if (!SUBSTITUTION_SUGGESTION_MINUTES.includes(minute)) return null;
    const text = substitutionContextComment(simulation, minute);
    recordSubstitutionSuggestion(simulation.result, minute, text);
    return { minute, text };
  }

  function recordSubstitutionSuggestion(result, minute, text) {
    if (!result) return;
    result.substitutionSuggestions = result.substitutionSuggestions || [];
    if (result.substitutionSuggestions.some((item) => item.minute === minute)) return;
    result.substitutionSuggestions.push({ minute, text });
  }

  function renderSubstitutionManager() {
    const simulation = activeMatchSimulation;
    if (!simulation) return;
    const minute = lastHandledSubstitutionMinute(simulation);
    const currentIds = new Set(Object.values(simulation.lineup || {}).filter(Boolean));
    const bench = (simulation.campaign.squad || [])
      .filter((player) => !currentIds.has(player.id) && !simulation.subbedOutIds.includes(player.id))
      .sort((a, b) => playerOverall(b) - playerOverall(a) || cardLabel(a).localeCompare(cardLabel(b)));
    const slots = formationSlots(simulation.campaign.formation);
    const selectedSlot = slots.find((slot) => slot.id === activeSubstitutionOutSlotId);
    const selectedPlayer = selectedSlot ? findPlayer(simulation.lineup[selectedSlot.id]) : null;
    const selectedInPlayer = activeSubstitutionInId ? findPlayer(activeSubstitutionInId) : null;
    const compatibleBench = selectedSlot ? bench.filter((player) => isSubstitutionCompatible(player, selectedSlot)) : [];
    const comment = substitutionContextComment(simulation, minute);
    app.innerHTML = `
      <article class="card substitution-card">
        <div class="board-header">
          <div>
            <p class="eyebrow">Substituições</p>
            <h2>${minute}'</h2>
          </div>
          <span class="pill">${simulation.substitutionsUsed || 0}/${MAX_SUBSTITUTIONS}</span>
        </div>
        <p class="muted">Escolha quem sai e depois quem entra. Jogador que saiu não pode voltar.</p>
        <p class="notice">${escapeHtml(substitutionNotice || comment)}</p>
        ${simulation.substitutionsUsed >= MAX_SUBSTITUTIONS ? `<p class="notice">Limite de 5 substituições atingido.</p>` : ""}
      </article>
      <section class="substitution-layout">
        <article class="card">
          <h3>Em campo</h3>
          <div class="substitution-player-grid">
            ${slots.map((slot) => substitutionOutCard(simulation, slot)).join("")}
          </div>
        </article>
        <article class="card">
          <h3>Banco disponível</h3>
          ${selectedPlayer ? `<p class="muted">Sai: <strong>${escapeHtml(cardLabel(selectedPlayer))}</strong>. Escolha um substituto compatível para ${escapeHtml(selectedSlot.label)}.</p>` : `<p class="muted">Selecione primeiro quem sai.</p>`}
          <div class="substitution-player-grid">
            ${selectedSlot
              ? (compatibleBench.length ? compatibleBench.map((player) => substitutionInCard(player, selectedSlot)).join("") : `<p class="empty">Nenhum jogador compatível disponível.</p>`)
              : (bench.length ? bench.map((player) => `<div class="substitution-card-option disabled-option"><strong>${escapeHtml(cardLabel(player))}</strong><small>${escapeHtml(player.posicoes.join(" / "))} · OVR ${playerOverall(player)}</small></div>`).join("") : `<p class="empty">Banco vazio.</p>`)}
          </div>
        </article>
      </section>
      <article class="card">
        ${substitutionTimeline(simulation.result)}
        ${selectedPlayer && selectedInPlayer ? `
          <div class="substitution-confirm">
            <span>Confirmar: <strong>${escapeHtml(cardLabel(selectedInPlayer))}</strong> entra no lugar de <strong>${escapeHtml(cardLabel(selectedPlayer))}</strong>.</span>
            <button class="primary-button" data-action="substitution-confirm" type="button">Confirmar substituição</button>
          </div>
        ` : ""}
        <div class="actions">
          <button class="primary-button" data-action="substitution-continue" type="button">Continuar partida</button>
        </div>
      </article>
    `;
  }

  function substitutionOutCard(simulation, slot) {
    const player = findPlayer(simulation.lineup?.[slot.id]);
    if (!player) return "";
    const selected = activeSubstitutionOutSlotId === slot.id;
    return `
      <button class="substitution-card-option ${selected ? "selected" : ""}" data-action="substitution-out" data-id="${escapeHtml(slot.id)}" type="button" ${simulation.substitutionsUsed >= MAX_SUBSTITUTIONS ? "disabled" : ""}>
        <span class="slot-label">${escapeHtml(slot.label)}</span>
        <strong>${escapeHtml(cardLabel(player))}</strong>
        <small>${escapeHtml(player.posicoes.join(" / "))} · OVR ${playerOverall(player)}</small>
      </button>
    `;
  }

  function substitutionInCard(player, slot) {
    const selected = activeSubstitutionInId === player.id;
    return `
      <button class="substitution-card-option ${selected ? "selected" : ""}" data-action="substitution-in" data-slot="${escapeHtml(slot.id)}" data-id="${escapeHtml(player.id)}" type="button">
        <strong>${escapeHtml(cardLabel(player))}</strong>
        <small>${escapeHtml(player.posicoes.join(" / "))} · OVR ${playerOverall(player)}</small>
      </button>
    `;
  }

  function selectSubstitutionOut(slotId) {
    const simulation = activeMatchSimulation;
    if (!simulation || simulation.substitutionsUsed >= MAX_SUBSTITUTIONS) return;
    if (!simulation.lineup?.[slotId]) return;
    activeSubstitutionOutSlotId = slotId;
    activeSubstitutionInId = null;
    substitutionNotice = "";
    renderSubstitutionManager();
  }

  function selectSubstitutionIn(playerId) {
    const simulation = activeMatchSimulation;
    const slot = formationSlots(simulation?.campaign?.formation).find((item) => item.id === activeSubstitutionOutSlotId);
    const player = findPlayer(playerId);
    if (!simulation || !slot || !player) return;
    if (!isSubstitutionCompatible(player, slot)) {
      substitutionNotice = `${cardLabel(player)} não é compatível com ${slot.label}.`;
      activeSubstitutionInId = null;
      renderSubstitutionManager();
      return;
    }
    activeSubstitutionInId = playerId;
    substitutionNotice = "";
    renderSubstitutionManager();
  }

  function confirmSubstitution() {
    if (!activeSubstitutionOutSlotId || !activeSubstitutionInId) {
      substitutionNotice = "Escolha quem sai e quem entra antes de confirmar.";
      renderSubstitutionManager();
      return;
    }
    makeSubstitution(activeSubstitutionOutSlotId, activeSubstitutionInId);
  }

  function makeSubstitution(slotId, inPlayerId) {
    const simulation = activeMatchSimulation;
    if (!simulation || simulation.substitutionsUsed >= MAX_SUBSTITUTIONS) return;
    const slot = formationSlots(simulation.campaign.formation).find((item) => item.id === slotId);
    const inPlayer = findPlayer(inPlayerId);
    const outPlayer = findPlayer(simulation.lineup?.[slotId]);
    const currentIds = new Set(Object.values(simulation.lineup || {}).filter(Boolean));
    if (!slot || !inPlayer || !simulation.campaign.squad.some((item) => item.id === inPlayerId) || !outPlayer || currentIds.has(inPlayerId) || simulation.subbedOutIds.includes(inPlayerId)) return;
    if (!isSubstitutionCompatible(inPlayer, slot)) {
      substitutionNotice = `${cardLabel(inPlayer)} não é compatível com ${slot.label}.`;
      renderSubstitutionManager();
      return;
    }

    simulation.lineup[slotId] = inPlayerId;
    simulation.subbedOutIds.push(outPlayer.id);
    simulation.substitutionsUsed += 1;
    const minute = lastHandledSubstitutionMinute(simulation);
    const substitution = {
      minute,
      slot: slot.label,
      inId: inPlayer.id,
      inName: cardLabel(inPlayer),
      outId: outPlayer.id,
      outName: cardLabel(outPlayer)
    };
    simulation.result.substitutions.push(substitution);
    simulation.currentTeamStrength = teamStrength(currentSimulationLineupPlayers(simulation));
    refreshFutureUserEvents(simulation, minute);
    activeSubstitutionOutSlotId = null;
    activeSubstitutionInId = null;
    substitutionNotice = `${cardLabel(inPlayer)} entrou. ${cardLabel(outPlayer)} saiu.`;
    renderSubstitutionManager();
  }

  function continuePausedSimulation() {
    const simulation = activeMatchSimulation;
    if (!simulation?.progress) return;
    const { step, steps, totalDelay } = simulation.progress;
    activeSubstitutionOutSlotId = null;
    activeSubstitutionInId = null;
    substitutionNotice = "";
    simulation.progress = null;
    simulation.activePauseMinute = null;
    if (matchTimeoutId) {
      clearTimeout(matchTimeoutId);
      matchTimeoutId = null;
    }
    if (step >= steps) {
      completeMatchSimulation(simulation);
      return;
    }
    runMatchSimulationProgress(simulation, step + 1, steps, totalDelay);
  }

  function lastHandledSubstitutionMinute(simulation) {
    if (simulation?.activePauseMinute) return simulation.activePauseMinute;
    return simulation.handledSubstitutionPauses[simulation.handledSubstitutionPauses.length - 1] || 45;
  }

  function buildMatchSimulation() {
    const campaign = currentCampaign();
    const opponent = nextOpponent(campaign);
    if (!opponent) {
      return null;
    }
    const lineup = getLineupPlayers(campaign);
    const team = teamStrength(lineup);
    const balance = matchBalance(team, opponent);
    const teamLambda = randomizedLambda(balance.teamLambda);
    const oppLambda = randomizedLambda(balance.opponentLambda);
    const teamGoals = poisson(teamLambda);
    const opponentGoals = poisson(oppLambda);
    const groupMatch = campaign.status === "groups";
    const decidedByPenalties = !groupMatch && teamGoals === opponentGoals;
    let userWon = teamGoals > opponentGoals;
    let penalties = null;

    if (decidedByPenalties) {
      penalties = simulatePenaltyShootout(lineup, team, opponent);
      userWon = penalties.winner === "user";
    }

    const result = {
      round: currentPhaseLabel(campaign),
      phase: groupMatch ? "groups" : "knockout",
      teamName: teamName(campaign),
      opponentId: opponent.id,
      opponentName: opponent.nome,
      userGoals: teamGoals,
      opponentGoals,
      userWon,
      userDraw: groupMatch && teamGoals === opponentGoals,
      decidedByPenalties,
      penalties,
      events: createGoalEvents(campaign, opponent, teamGoals, opponentGoals),
      substitutions: [],
      substitutionSuggestions: [],
      stats: createMatchStats(team, opponent, teamGoals, opponentGoals),
      balance: DEBUG_BALANCE ? balance : null
    };
    if (simulationDelay() === 0) {
      result.substitutionSuggestions = createInstantSubstitutionSuggestions(lineup);
    }
    result.scoreText = resultScoreText(result);

    return {
      campaign,
      opponent,
      result,
      lineup: { ...(campaign.lineup || {}) },
      substitutionsUsed: 0,
      subbedOutIds: [],
      handledSubstitutionPauses: [],
      substitutionComments: {},
      progress: null
    };
  }

  function balanceDebugPanel(campaign, opponent) {
    if (!DEBUG_BALANCE) return "";
    const team = teamStrength(getLineupPlayers(campaign));
    const balance = matchBalance(team, opponent);
    const opponentProfile = balance.opponent;
    const chances = balance.chances;
    return `
      <div class="match-stats-panel">
        <h3>Debug balanceamento</h3>
        <div class="match-stats-grid">
          ${matchStatLine("Força geral", [roundRating(team.overall), roundRating(opponentProfile.overall)])}
          ${matchStatLine("Ataque", [roundRating(team.offense), roundRating(opponentProfile.offense)])}
          ${matchStatLine("Criação", [roundRating(team.creativity), roundRating(opponentProfile.creativity)])}
          ${matchStatLine("Defesa", [roundRating(team.defense), roundRating(opponentProfile.defense)])}
          ${matchStatLine("Goleiro", [roundRating(team.goalkeeper), roundRating(opponentProfile.goalkeeper)])}
          ${matchStatLine("Diferença geral", [roundRating(balance.overallEdge), 0])}
        </div>
        <p class="muted">Chance estimada: ${Math.round(chances.win * 100)}% vitória, ${Math.round(chances.draw * 100)}% empate, ${Math.round(chances.loss * 100)}% derrota.</p>
        <p class="muted">Gols esperados: ${balance.teamLambda.toFixed(2)} x ${balance.opponentLambda.toFixed(2)}.</p>
      </div>
    `;
  }

  function matchBalance(team, opponent) {
    const opponentProfile = opponentStrength(opponent);
    const attackEdge = team.offense - opponentProfile.defense;
    const creationEdge = team.creativity - opponentProfile.creativity;
    const defenseEdge = team.defense - opponentProfile.offense;
    const goalkeeperEdge = team.goalkeeper - opponentProfile.goalkeeper;
    const overallEdge = team.overall - opponentProfile.overall;

    const teamLambda = clamp(
      1.32 + attackEdge / 24 + creationEdge / 42 + overallEdge / 32 + Math.max(0, team.starPower - opponentProfile.starPower) / 36,
      0.42,
      3.7
    );
    const opponentLambda = clamp(
      1.04 - defenseEdge / 26 - goalkeeperEdge / 40 - overallEdge / 34 + (opponentProfile.creativity - team.creativity) / 64,
      0.32,
      3.9
    );

    return {
      team,
      opponent: opponentProfile,
      attackEdge,
      creationEdge,
      defenseEdge,
      goalkeeperEdge,
      overallEdge,
      teamLambda,
      opponentLambda,
      chances: estimatedOutcomeChances(teamLambda, opponentLambda)
    };
  }

  function randomizedLambda(lambda) {
    return clamp(lambda * randomFloat(0.93, 1.07), 0.12, 5.2);
  }

  function opponentStrength(opponent) {
    const offense = opponent.offense || 80;
    const defense = opponent.defense || 80;
    const creativity = opponent.creativity || 80;
    const overall = opponent.overall || (offense * 0.35 + defense * 0.35 + creativity * 0.3);
    const goalkeeper = opponent.goalkeeper || (defense * 0.72 + overall * 0.28);
    const starPower = Math.max(0, overall - 88) + Math.max(0, offense - 90) * 0.5 + Math.max(0, creativity - 90) * 0.4;
    return { ...opponent, offense, defense, creativity, goalkeeper, overall, starPower };
  }

  function estimatedOutcomeChances(teamLambda, opponentLambda) {
    const maxGoals = 10;
    let win = 0;
    let draw = 0;
    let loss = 0;
    for (let teamGoals = 0; teamGoals <= maxGoals; teamGoals += 1) {
      for (let opponentGoals = 0; opponentGoals <= maxGoals; opponentGoals += 1) {
        const probability = poissonProbability(teamLambda, teamGoals) * poissonProbability(opponentLambda, opponentGoals);
        if (teamGoals > opponentGoals) win += probability;
        else if (teamGoals === opponentGoals) draw += probability;
        else loss += probability;
      }
    }
    const total = win + draw + loss || 1;
    return { win: win / total, draw: draw / total, loss: loss / total };
  }

  function poissonProbability(lambda, goals) {
    let factorial = 1;
    for (let index = 2; index <= goals; index += 1) factorial *= index;
    return (Math.exp(-lambda) * (lambda ** goals)) / factorial;
  }

  function roundRating(value) {
    return Math.round(value * 10) / 10;
  }

  function simulatePenaltyShootout(lineup, team, opponent) {
    const userTakers = penaltyTakers(lineup);
    const opponentTakers = opponentPenaltyTakers(opponent);
    const shots = [];
    let userGoals = 0;
    let opponentGoals = 0;

    for (let index = 0; index < 16; index += 1) {
      const forceDecision = index >= 15 && userGoals === opponentGoals;
      const userTaker = userTakers[index % userTakers.length];
      const opponentTaker = opponentTakers[index % opponentTakers.length];
      const userScored = forceDecision ? true : Math.random() < penaltyChance(userTaker, team, opponent);
      userGoals += userScored ? 1 : 0;
      shots.push({
        team: "user",
        taker: cardLabel(userTaker),
        playerId: userTaker.id,
        scored: userScored
      });

      const opponentScored = forceDecision ? false : Math.random() < opponentPenaltyChance(opponent, team);
      opponentGoals += opponentScored ? 1 : 0;
      shots.push({
        team: "opponent",
        taker: opponentTaker,
        scored: opponentScored
      });

      if (index >= 4 && userGoals !== opponentGoals) break;
    }

    return {
      userGoals,
      opponentGoals,
      winner: userGoals > opponentGoals ? "user" : "opponent",
      shots
    };
  }

  function penaltyTakers(lineup) {
    const ordered = [...lineup].sort((a, b) => {
      const scoreA = a.offense * 0.5 + a.creativity * 0.32 + playerOverall(a) * 0.18;
      const scoreB = b.offense * 0.5 + b.creativity * 0.32 + playerOverall(b) * 0.18;
      return scoreB - scoreA;
    });
    return ordered.length ? ordered : [{ id: "unknown", nome: "Titular", ano: "", offense: 78, creativity: 78, defense: 78 }];
  }

  function opponentPenaltyTakers(opponent) {
    const names = Array.from(new Set([...(opponent.scorers || []), ...(opponent.assisters || [])]));
    return names.length ? names : [opponent.nome || "Adversário"];
  }

  function penaltyChance(player, team, opponent) {
    const playerScore = player.offense * 0.42 + player.creativity * 0.26 + playerOverall(player) * 0.32;
    const edge = (team.offense + team.creativity - opponent.defense - opponent.creativity) / 420;
    return clamp(0.74 + (playerScore - 84) / 180 + edge, 0.62, 0.91);
  }

  function opponentPenaltyChance(opponent, team) {
    return clamp(0.76 + ((opponent.offense || 82) + (opponent.creativity || 82) - team.defense - team.creativity) / 430, 0.62, 0.9);
  }

  function createGoalEvents(campaign, opponent, teamGoals, opponentGoals, lineupOverride = null) {
    const lineup = lineupOverride || getLineupPlayers(campaign);
    const minutes = shuffle(Array.from({ length: teamGoals + opponentGoals + 8 }, () => randomInt(3, 90))).slice(0, teamGoals + opponentGoals).sort((a, b) => a - b);
    const events = [];

    for (let i = 0; i < teamGoals; i += 1) {
      const scorer = weightedPick(lineup, (player) => player.offense + (player.setor === "ATT" ? 30 : 0) + (player.setor === "MID" ? 10 : 0));
      const assisterPool = lineup.filter((player) => player.id !== scorer.id);
      const assister = weightedPick(assisterPool, (player) => player.creativity + (player.setor === "MID" ? 18 : 0));
      events.push({
        team: "user",
        minute: minutes.pop() || randomInt(3, 90),
        scorer: cardLabel(scorer),
        scorerId: scorer.id,
        assister: cardLabel(assister),
        assisterId: assister.id
      });
    }

    for (let i = 0; i < opponentGoals; i += 1) {
      events.push({
        team: "opponent",
        minute: minutes.pop() || randomInt(3, 90),
        scorer: randomItem(opponent.scorers),
        assister: randomItem(opponent.assisters),
        opponentName: opponent.nome
      });
    }

    return events.sort((a, b) => a.minute - b.minute);
  }

  function refreshFutureUserEvents(simulation, minute) {
    const lineup = currentSimulationLineupPlayers(simulation);
    (simulation.result.events || [])
      .filter((event) => event.team === "user" && event.minute > minute)
      .forEach((event) => {
        const scorer = weightedPick(lineup, (player) => player.offense + (player.setor === "ATT" ? 30 : 0) + (player.setor === "MID" ? 10 : 0));
        const assisterPool = lineup.filter((player) => player.id !== scorer.id);
        const assister = weightedPick(assisterPool, (player) => player.creativity + (player.setor === "MID" ? 18 : 0));
        event.scorer = cardLabel(scorer);
        event.scorerId = scorer.id;
        event.assister = cardLabel(assister);
        event.assisterId = assister.id;
      });
  }

  function currentSimulationLineupPlayers(simulation) {
    return formationSlots(simulation.campaign.formation)
      .map((slot) => findPlayer(simulation.lineup?.[slot.id]))
      .filter(Boolean);
  }

  function createMatchStats(team, opponent, teamGoals, opponentGoals) {
    const opponentProfile = opponentStrength(opponent);
    const possession = clamp(Math.round(50 + (team.creativity - opponentProfile.creativity) / 3.7 + randomInt(-4, 4)), 36, 68);
    const userShots = Math.max(teamGoals + randomInt(4, 10), Math.round(8 + (team.offense - opponentProfile.defense) / 7.5 + teamGoals * 1.55 + randomInt(-1, 4)));
    const opponentShots = Math.max(opponentGoals + randomInt(2, 8), Math.round(6 + (opponentProfile.offense - team.defense) / 8.5 + opponentGoals * 1.35 + randomInt(-1, 3)));
    const userDanger = Math.max(teamGoals, Math.round(userShots * 0.58 + (team.creativity - 80) / 18));
    const opponentDanger = Math.max(opponentGoals, Math.round(opponentShots * 0.55 + (opponentProfile.creativity - 80) / 20));
    return {
      shots: [Math.max(teamGoals, userShots), Math.max(opponentGoals, opponentShots)],
      possession: [possession, 100 - possession],
      dangerousAttacks: [Math.max(0, userDanger), Math.max(0, opponentDanger)],
      saves: [
        Math.max(0, Math.min(opponentShots - opponentGoals, randomInt(1, 5) + Math.max(0, Math.floor((team.defense - opponentProfile.offense) / 16)))),
        Math.max(0, Math.min(userShots - teamGoals, randomInt(1, 5) + Math.max(0, Math.floor((opponentProfile.defense - team.offense) / 16))))
      ]
    };
  }

  function renderMatchSimulation(simulation, step, steps) {
    const result = simulation.result;
    const minute = Math.min(90, Math.round((90 * step) / steps));
    const snapshot = matchSnapshot(result, minute);
    const speed = SIMULATION_SPEEDS[store.settings.simulationSpeed] || SIMULATION_SPEEDS.normal;
    const suggestion = liveSubstitutionSuggestion(simulation, minute);
    app.innerHTML = `
      <article class="card simulation-card">
        <p class="eyebrow">${escapeHtml(result.round)}</p>
        <div class="live-header">
          <div class="live-minute">⏱️ ${minute}'</div>
          <button class="ghost-button small live-pause-button" data-action="pause-match" type="button">⏸ Pausar Partida</button>
        </div>
        <div class="scoreboard">
          <div class="scoreline">
            <span class="team-name">${escapeHtml(result.teamName)}</span>
            <span class="score-number">${snapshot.userGoals} x ${snapshot.opponentGoals}</span>
            <span class="team-name">${escapeHtml(result.opponentName)}</span>
          </div>
        </div>
        <div class="last-event">
          <strong>Último evento</strong>
          ${snapshot.lastEvent ? goalEvent(snapshot.lastEvent) : `<p class="muted">Partida em andamento. Nenhum gol até agora.</p>`}
        </div>
        ${suggestion ? substitutionSuggestionCard(suggestion) : ""}
        ${substitutionTimeline(result, minute)}
        ${substitutionSuggestionsTimeline(result, minute)}
        ${matchStatsPanel(scaleMatchStats(result.stats, minute), "Estatísticas ao vivo")}
        <div class="simulation-footer">
          <span class="pill">${escapeHtml(speed.label)}</span>
          <span class="pill">${minute >= 90 ? "Encerrando..." : "Simulação em andamento"}</span>
        </div>
      </article>
    `;
  }

  function substitutionSuggestionCard(suggestion) {
    return `
      <div class="live-substitution-suggestion">
        <div>
          <strong>Sugestão de Substituição</strong>
          <p>${escapeHtml(suggestion.text)}</p>
        </div>
        <button class="secondary-button small" data-action="substitution-open-live" type="button">Abrir Painel de Substituições</button>
      </div>
    `;
  }

  function matchSnapshot(result, minute) {
    const visibleEvents = (result.events || []).filter((event) => event.minute <= minute);
    return {
      userGoals: visibleEvents.filter((event) => event.team === "user").length,
      opponentGoals: visibleEvents.filter((event) => event.team === "opponent").length,
      lastEvent: visibleEvents[visibleEvents.length - 1] || null
    };
  }

  function scaleMatchStats(stats, minute) {
    if (!stats) return null;
    const factor = clamp(minute / 90, 0, 1);
    return {
      shots: stats.shots.map((value) => Math.round(value * factor)),
      possession: stats.possession,
      dangerousAttacks: stats.dangerousAttacks.map((value) => Math.round(value * factor)),
      saves: stats.saves.map((value) => Math.round(value * factor))
    };
  }

  function matchStatsPanel(stats, title = "Estatísticas finais") {
    if (!stats) return "";
    return `
      <div class="match-stats-panel">
        <strong>${escapeHtml(title)}</strong>
        <div class="match-stats-grid">
          ${matchStatLine("Finalizações", stats.shots)}
          ${matchStatLine("Posse de bola", stats.possession, "%")}
          ${matchStatLine("Ataques perigosos", stats.dangerousAttacks)}
          ${matchStatLine("Defesas", stats.saves)}
        </div>
      </div>
    `;
  }

  function matchStatLine(label, values, suffix = "") {
    const left = `${values?.[0] ?? 0}${suffix}`;
    const right = `${values?.[1] ?? 0}${suffix}`;
    return `
      <div class="match-stat-row">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(left)} x ${escapeHtml(right)}</strong>
      </div>
    `;
  }

  function recordUserGoal(campaign, scorerId, assisterId) {
    const scorer = findPlayer(scorerId);
    const assister = findPlayer(assisterId);
    if (scorer) {
      campaign.playerStats[scorer.id] = campaign.playerStats[scorer.id] || basePlayerStat(scorer);
      campaign.playerStats[scorer.id].goals += 1;
    }
    if (assister) {
      campaign.playerStats[assister.id] = campaign.playerStats[assister.id] || basePlayerStat(assister);
      campaign.playerStats[assister.id].assists += 1;
    }
  }

  function finishCampaign(campaign, status, finishStage = "") {
    campaign.status = status;
    campaign.finishStage = finishStage || campaign.finishStage || "";
    campaign.finishedAt = new Date().toISOString();
    campaign.summary = buildCampaignSummary(campaign);
    if (campaign.archivedAt) return;
    campaign.archivedAt = new Date().toISOString();
    store.archive.unshift(JSON.parse(JSON.stringify(campaign)));
  }

  function teamStrength(players) {
    const avg = (items, key) => items.reduce((sum, player) => sum + player[key], 0) / Math.max(items.length, 1);
    const allAvg = (key) => avg(players, key);
    const ovrAvg = players.reduce((sum, player) => sum + playerOverall(player), 0) / Math.max(players.length, 1);
    const gk = players.find((player) => player.setor === "GK");
    const defenders = players.filter((player) => player.setor === "DEF");
    const mids = players.filter((player) => player.setor === "MID");
    const atts = players.filter((player) => player.setor === "ATT");
    const formationName = store.current?.formation || "4-3-3";
    const modifier = formationModifier(formationName);
    const links = lineupLinkAnalysis(players);
    const elitePlayers = players.filter((player) => playerOverall(player) >= 95);
    const eliteAttackers = atts.filter((player) => playerOverall(player) >= 95);
    const eliteCreators = players.filter((player) => playerOverall(player) >= 95 && (player.setor === "MID" || player.creativity >= 88));
    const goalkeeper = clamp(gk ? gk.defense * 0.82 + playerOverall(gk) * 0.18 : allAvg("defense"), 70, 99);
    const starPower = elitePlayers.length * 1.8 + eliteAttackers.length * 1.5 + eliteCreators.length * 1.1;
    const baseOffense = clamp(avg(atts, "offense") * 0.5 + avg(mids, "creativity") * 0.16 + ovrAvg * 0.2 + allAvg("offense") * 0.07 + avg(atts, "creativity") * 0.07 + Math.min(starPower, 8) + atts.length * 0.5 + modifier.offense, 70, 99);
    const defense = clamp(avg(defenders, "defense") * 0.46 + goalkeeper * 0.2 + avg(mids, "defense") * 0.12 + ovrAvg * 0.12 + allAvg("defense") * 0.1 + defenders.length * 0.4 + modifier.defense, 70, 99);
    const baseCreativity = clamp(avg(mids, "creativity") * 0.4 + avg(atts, "creativity") * 0.2 + ovrAvg * 0.2 + allAvg("creativity") * 0.11 + avg(mids, "offense") * 0.09 + Math.min(starPower, 7) + mids.length * 0.3 + modifier.creativity, 70, 99);
    const offense = clamp(baseOffense * (1 + links.bonus.attack), 70, 99);
    const creativity = clamp(baseCreativity * (1 + links.bonus.creativity), 70, 99);
    const overall = clamp(ovrAvg * 0.45 + offense * 0.24 + defense * 0.16 + creativity * 0.15, 70, 99);

    return {
      offense,
      defense,
      creativity,
      goalkeeper,
      overall,
      ovrAvg,
      starPower,
      linkBonus: links.bonus
    };
  }

  function formationModifier(name) {
    const modifiers = {
      "4-3-3": { offense: 2.2, defense: 0.4, creativity: 1.4 },
      "4-4-2": { offense: 1.2, defense: 1.3, creativity: 0.4 },
      "4-2-3-1": { offense: 0.6, defense: 1.8, creativity: 2.5 },
      "3-5-2": { offense: 1.4, defense: 0.8, creativity: 2.4 },
      "3-4-3": { offense: 3.1, defense: -0.9, creativity: 1.2 },
      "5-3-2": { offense: -0.1, defense: 3.1, creativity: 0.5 }
    };
    return modifiers[name] || modifiers["4-3-3"];
  }

  function getLineupPlayers(campaign) {
    return formationSlots(campaign.formation).map((slot) => findPlayer(campaign.lineup[slot.id])).filter(Boolean);
  }

  function nextOpponent(campaign) {
    if (campaign.status === "groups" && campaign.worldCup) {
      const match = currentGroupUserMatch(campaign);
      return match ? resolveTeam(match.awayId) : null;
    }
    return OPPONENTS.find((opponent) => opponent.id === campaign.opponents[campaign.matchIndex]);
  }

  function createOpponentPath(excludedIds = new Set()) {
    const used = new Set(excludedIds);
    const byDifficulty = (difficulty) => OPPONENTS.filter((opponent) => opponent.difficulty === difficulty);
    const pickRoundOpponent = (difficulties) => {
      const preferred = shuffle(difficulties.flatMap((difficulty) => byDifficulty(difficulty)))
        .find((opponent) => opponent && !used.has(opponent.id));
      const fallback = preferred || shuffle(OPPONENTS).find((opponent) => !used.has(opponent.id));
      if (fallback) used.add(fallback.id);
      return fallback;
    };

    return [
      pickRoundOpponent(["medium", "strong"]),
      pickRoundOpponent(["strong", "elite", "medium"]),
      pickRoundOpponent(["elite", "historical", "strong"]),
      pickRoundOpponent(["historical", "elite", "strong"])
    ].filter(Boolean).map((opponent) => opponent.id);
  }

  function createWorldCup(campaign) {
    const userGroupOpponents = selectUserGroupOpponents();
    const reservedIds = new Set(userGroupOpponents.map((opponent) => opponent.id));
    const shuffledOpponents = shuffle(OPPONENTS.filter((opponent) => !reservedIds.has(opponent.id)));
    const userGroupIndex = randomInt(0, GROUP_NAMES.length - 1);
    const groups = GROUP_NAMES.map((name) => ({ name, teams: [] }));
    let poolIndex = 0;

    groups.forEach((group, index) => {
      if (index === userGroupIndex) {
        group.teams.push({ id: "user", nome: teamName(campaign), user: true });
        userGroupOpponents.forEach((opponent) => group.teams.push({ id: opponent.id, nome: opponent.nome }));
      }
      while (group.teams.length < 4) {
        const opponent = shuffledOpponents[poolIndex % shuffledOpponents.length];
        poolIndex += 1;
        if (!group.teams.some((team) => team.id === opponent.id)) {
          group.teams.push({ id: opponent.id, nome: opponent.nome });
        }
      }
    });

    return {
      groups,
      userGroupIndex,
      groupName: groups[userGroupIndex].name,
      groupRound: 0,
      groupResults: [],
      groupComplete: false
    };
  }

  function selectUserGroupOpponents() {
    const picked = [];
    const used = new Set();
    const pickDifficulty = (difficulty) => {
      const opponent = shuffle(OPPONENTS.filter((item) => item.difficulty === difficulty && !used.has(item.id)))[0];
      if (opponent) {
        picked.push(opponent);
        used.add(opponent.id);
      }
    };

    pickDifficulty("medium");
    pickDifficulty("medium");
    pickDifficulty("strong");

    if (picked.length < 3) {
      shuffle(OPPONENTS.filter((opponent) => !used.has(opponent.id) && opponent.difficulty !== "historical" && opponent.difficulty !== "elite"))
        .slice(0, 3 - picked.length)
        .forEach((opponent) => {
          picked.push(opponent);
          used.add(opponent.id);
        });
    }

    if (picked.length < 3) {
      shuffle(OPPONENTS.filter((opponent) => !used.has(opponent.id)))
        .slice(0, 3 - picked.length)
        .forEach((opponent) => picked.push(opponent));
    }

    return picked;
  }

  function currentGroup(campaign) {
    if (!campaign.worldCup) return null;
    return campaign.worldCup.groups[campaign.worldCup.userGroupIndex];
  }

  function groupSchedule(campaign) {
    const group = currentGroup(campaign);
    if (!group) return [];
    const user = group.teams.find((team) => team.user) || group.teams[0];
    const others = group.teams.filter((team) => team.id !== user.id);
    return [
      [{ homeId: user.id, awayId: others[0].id }, { homeId: others[1].id, awayId: others[2].id }],
      [{ homeId: user.id, awayId: others[1].id }, { homeId: others[0].id, awayId: others[2].id }],
      [{ homeId: user.id, awayId: others[2].id }, { homeId: others[0].id, awayId: others[1].id }]
    ];
  }

  function currentGroupUserMatch(campaign) {
    const round = groupSchedule(campaign)[campaign.worldCup?.groupRound || 0];
    return round ? round.find((match) => match.homeId === "user" || match.awayId === "user") : null;
  }

  function completeGroupRound(campaign, opponent, result) {
    const round = groupSchedule(campaign)[campaign.worldCup.groupRound] || [];
    const userMatch = round.find((match) => match.homeId === "user" || match.awayId === "user");
    if (userMatch) {
      campaign.worldCup.groupResults.push({
        round: campaign.worldCup.groupRound + 1,
        homeId: userMatch.homeId,
        awayId: userMatch.awayId,
        homeGoals: userMatch.homeId === "user" ? result.userGoals : result.opponentGoals,
        awayGoals: userMatch.awayId === "user" ? result.userGoals : result.opponentGoals
      });
    }

    round
      .filter((match) => match !== userMatch)
      .forEach((match) => {
        campaign.worldCup.groupResults.push(simulateNeutralGroupMatch(campaign, match, campaign.worldCup.groupRound + 1));
      });

    campaign.worldCup.groupRound += 1;
    if (campaign.worldCup.groupRound >= 3) {
      campaign.worldCup.groupComplete = true;
      const standings = groupStandings(campaign);
      const userRank = standings.findIndex((row) => row.id === "user") + 1;
      if (userRank > 0 && userRank <= 2) {
        campaign.status = "knockout";
        campaign.matchIndex = 0;
        const groupOpponentIds = new Set((currentGroup(campaign)?.teams || [])
          .map((team) => team.id)
          .filter((id) => id && id !== "user"));
        campaign.opponents = createOpponentPath(groupOpponentIds);
      } else {
        finishCampaign(campaign, "eliminated", "Fase de grupos");
      }
    } else {
      campaign.status = "groups";
    }
  }

  function simulateNeutralGroupMatch(campaign, match, round) {
    const home = resolveTeam(match.homeId);
    const away = resolveTeam(match.awayId);
    const homeGoals = poisson(clamp(1.1 + ((home.offense || 80) - (away.defense || 80)) / 42 + randomFloat(-0.35, 0.35), 0.1, 4));
    const awayGoals = poisson(clamp(1.1 + ((away.offense || 80) - (home.defense || 80)) / 42 + randomFloat(-0.35, 0.35), 0.1, 4));
    return { round, homeId: match.homeId, awayId: match.awayId, homeGoals, awayGoals };
  }

  function groupStandings(campaign) {
    const group = currentGroup(campaign);
    if (!group) return [];
    const rows = group.teams.reduce((acc, team) => {
      acc[team.id] = { id: team.id, nome: teamNameById(campaign, team.id), pts: 0, gf: 0, ga: 0, gd: 0 };
      return acc;
    }, {});

    (campaign.worldCup.groupResults || []).forEach((match) => {
      const home = rows[match.homeId];
      const away = rows[match.awayId];
      if (!home || !away) return;
      home.gf += match.homeGoals;
      home.ga += match.awayGoals;
      away.gf += match.awayGoals;
      away.ga += match.homeGoals;
      if (match.homeGoals > match.awayGoals) home.pts += 3;
      else if (match.awayGoals > match.homeGoals) away.pts += 3;
      else {
        home.pts += 1;
        away.pts += 1;
      }
    });

    return Object.values(rows)
      .map((row) => ({ ...row, gd: row.gf - row.ga }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.nome.localeCompare(b.nome));
  }

  function groupStageCard(campaign) {
    const standings = groupStandings(campaign);
    const next = campaign.status === "groups" ? nextOpponent(campaign) : null;
    return `
      <article class="card">
        <div class="board-header">
          <div>
            <p class="eyebrow">Fase de Grupos</p>
            <h3>${escapeHtml(campaign.worldCup.groupName)}</h3>
          </div>
          <span class="pill">Rodada ${Math.min((campaign.worldCup.groupRound || 0) + 1, 3)}/3</span>
        </div>
        ${next ? `<p class="muted">Adversário seguinte: <strong>${escapeHtml(next.nome)}</strong></p>` : `<p class="muted">Grupo encerrado. Classificam 1º e 2º.</p>`}
        <div class="standings-table">
          <div class="standings-row standings-head">
            <span>#</span><span>Seleção</span><span>Pts</span><span>SG</span><span>GP</span>
          </div>
          ${standings.map((row, index) => `
            <div class="standings-row ${row.id === "user" ? "user-row" : ""}">
              <span>${index + 1}</span>
              <span>${escapeHtml(row.nome)}</span>
              <strong>${row.pts}</strong>
              <span>${row.gd}</span>
              <span>${row.gf}</span>
            </div>
          `).join("")}
        </div>
      </article>
    `;
  }

  function renderCampaignFinal(campaign) {
    const summary = campaign.summary || buildCampaignSummary(campaign);
    const champion = summary.statusKey === "champion";
    app.innerHTML = `
      <article class="card campaign-final ${champion ? "champion-final" : "eliminated-final"}">
        <p class="eyebrow">${champion ? "Título confirmado" : "Campanha encerrada"}</p>
        <h2>${escapeHtml(summary.statusLabel)}</h2>
        <p class="hero-lead">${escapeHtml(summary.teamName)}</p>
        <div class="final-score">
          <span>Jogo decisivo</span>
          <strong>${escapeHtml(summary.finalScore || "Sem partida registrada")}</strong>
        </div>
        <div class="summary-stat-grid">
          ${summaryStat("Jogos", summary.stats.games)}
          ${summaryStat("Vitórias", summary.stats.wins)}
          ${summaryStat("Empates", summary.stats.draws)}
          ${summaryStat("Derrotas", summary.stats.losses)}
          ${summaryStat("Gols marcados", summary.stats.goalsFor)}
          ${summaryStat("Gols sofridos", summary.stats.goalsAgainst)}
          ${summaryStat("Saldo de gols", summary.stats.goalDifference)}
        </div>
        <div class="final-leaders">
          ${summaryLeader("Artilheiro", summary.topScorer)}
          ${summaryLeader("Líder de assistências", summary.topAssister)}
          ${summaryBestMatch(summary.bestMatch)}
        </div>
        <div class="actions">
          <button class="primary-button" data-action="campaign-summary" type="button">${campaignSummaryExpanded ? "Ocultar resumo completo" : "Ver resumo completo"}</button>
          <button class="secondary-button" data-action="new-current-mode" type="button">Nova campanha</button>
          <button class="ghost-button" data-action="home" type="button">Voltar ao menu</button>
        </div>
      </article>
      ${summary.statusKey === "group" && campaign.worldCup ? groupStageCard(campaign) : ""}
      ${campaignSummaryExpanded ? fullCampaignSummary(campaign) : ""}
    `;
  }

  function toggleCampaignSummary() {
    campaignSummaryExpanded = !campaignSummaryExpanded;
    renderCampaign();
  }

  function fullCampaignSummary(campaign) {
    const results = campaign.results || [];
    const showGroupTable = campaignFinalStatus(campaign).key !== "group";
    return `
      ${campaignFinalDetails(campaign, showGroupTable)}
      <article class="card">
        <div class="board-header">
          <div>
            <p class="eyebrow">Resumo completo</p>
            <h3>Todos os jogos da campanha</h3>
          </div>
          <span class="pill">${results.length} jogo(s)</span>
        </div>
        <div class="progress-list">
          ${results.length ? results.map((result, index) => {
            const id = `campaign-final-${index}`;
            return matchSummaryCard(result, id, expandedHistoryMatches.has(id));
          }).join("") : `<p class="empty">Sem partidas registradas.</p>`}
        </div>
      </article>
    `;
  }

  function campaignFinalDetails(campaign, showGroupTable = true) {
    const lineupPlayers = getLineupPlayers(campaign);
    const starterIds = new Set(lineupPlayers.map((player) => player.id));
    const bench = (campaign.squad || []).filter((player) => !starterIds.has(player.id));
    return `
      <article class="card">
        <div class="board-header">
          <div>
            <p class="eyebrow">Elenco final</p>
            <h3>${escapeHtml(campaign.formation || "Formação não definida")}</h3>
          </div>
          <span class="pill">${lineupPlayers.length}/11 titulares</span>
        </div>
        ${lineupBoard(campaign, lineupPlayers, "Titular final")}
        <div class="final-squad-list">
          <strong>Banco final</strong>
          <div class="bench-list">
            ${bench.length ? bench.map((player) => `<span class="bench-chip">${escapeHtml(cardLabel(player))} · ${escapeHtml(player.posicoes.join(" / "))} · OVR ${playerOverall(player)}</span>`).join("") : `<span class="bench-chip empty-chip">Sem banco registrado</span>`}
          </div>
        </div>
      </article>
      ${showGroupTable && campaign.worldCup ? groupStageCard(campaign) : ""}
    `;
  }

  function buildCampaignSummary(campaign) {
    const results = campaign.results || [];
    const stats = campaignTotals(results);
    const status = campaignFinalStatus(campaign);
    const finalResult = results[results.length - 1] || null;
    return {
      teamName: teamName(campaign),
      statusKey: status.key,
      statusLabel: status.label,
      finalScore: finalResult ? resultScoreText(finalResult) : "",
      stats,
      topScorer: campaignLeader(campaign, "goals"),
      topAssister: campaignLeader(campaign, "assists"),
      bestMatch: bestCampaignMatch(results)
    };
  }

  function campaignTotals(results) {
    const totals = results.reduce((acc, result) => {
      acc.games += 1;
      acc.goalsFor += result.userGoals || 0;
      acc.goalsAgainst += result.opponentGoals || 0;
      if (result.userDraw) acc.draws += 1;
      else if (result.userWon) acc.wins += 1;
      else acc.losses += 1;
      return acc;
    }, { games: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 });
    totals.goalDifference = totals.goalsFor - totals.goalsAgainst;
    return totals;
  }

  function campaignFinalStatus(campaign) {
    if (campaign.status === "champion") return { key: "champion", label: "Campeão" };
    const stage = campaign.finishStage || inferFinishStage(campaign);
    if (stage === "Fase de grupos") return { key: "group", label: "Eliminado na fase de grupos" };
    if (stage === "Oitavas") return { key: "round-of-16", label: "Eliminado nas oitavas" };
    if (stage === "Quartas") return { key: "quarterfinal", label: "Eliminado nas quartas" };
    if (stage === "Semifinal") return { key: "semifinal", label: "Eliminado na semifinal" };
    if (stage === "Final") return { key: "runner-up", label: "Vice-campeão" };
    return { key: "eliminated", label: "Campanha encerrada" };
  }

  function inferFinishStage(campaign) {
    const last = (campaign.results || [])[Math.max(0, (campaign.results || []).length - 1)];
    if (!last) return "";
    if (last.phase === "groups") return "Fase de grupos";
    return ROUND_NAMES.find((round) => String(last.round || "").includes(round)) || "";
  }

  function campaignLeader(campaign, key) {
    const rows = Object.values(campaign.playerStats || {});
    const leader = rows.filter((row) => (row[key] || 0) > 0).sort((a, b) => (b[key] || 0) - (a[key] || 0) || String(a.label).localeCompare(String(b.label)))[0];
    return leader ? { label: leader.label, value: leader[key] || 0 } : { label: "Sem registro", value: 0 };
  }

  function bestCampaignMatch(results) {
    const candidates = [...results].sort((a, b) => {
      const marginA = (a.userGoals || 0) - (a.opponentGoals || 0);
      const marginB = (b.userGoals || 0) - (b.opponentGoals || 0);
      return Number(b.userWon) - Number(a.userWon) || marginB - marginA || (b.userGoals || 0) - (a.userGoals || 0);
    });
    const best = candidates[0];
    return best ? { label: resultScoreText(best), round: best.round || "" } : null;
  }

  function summaryStat(label, value) {
    return `
      <div class="summary-stat">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(String(value))}</strong>
      </div>
    `;
  }

  function summaryLeader(title, leader) {
    return `
      <div class="soft-card summary-leader">
        <span>${escapeHtml(title)}</span>
        <strong>${escapeHtml(leader.label)}</strong>
        <small class="muted">${leader.value} ${leader.value === 1 ? "registro" : "registros"}</small>
      </div>
    `;
  }

  function summaryBestMatch(match) {
    return `
      <div class="soft-card summary-leader">
        <span>Melhor partida</span>
        ${match ? `
          <strong>${escapeHtml(match.label)}</strong>
          <small class="muted">${escapeHtml(match.round)}</small>
        ` : `
          <strong>Sem registro</strong>
          <small class="muted">Nenhuma partida jogada.</small>
        `}
      </div>
    `;
  }

  function resolveTeam(id) {
    if (id === "user") return { id: "user", nome: DEFAULT_TEAM_NAME, offense: 82, defense: 82, creativity: 82 };
    return OPPONENTS.find((opponent) => opponent.id === id) || { id, nome: id, offense: 80, defense: 80, creativity: 80, scorers: [id], assisters: [id] };
  }

  function teamNameById(campaign, id) {
    if (id === "user") return teamName(campaign);
    return resolveTeam(id).nome;
  }

  function renderHistory() {
    const campaigns = [...store.archive];
    const activeFinished = store.current && ["champion", "eliminated"].includes(store.current.status) && !campaigns.some((campaign) => campaign.id === store.current.id);
    if (activeFinished) campaigns.unshift(store.current);

    app.innerHTML = `
      <article class="card">
        <p class="eyebrow">Histórico</p>
        <h2>Campanhas salvas</h2>
        <p class="muted">Resultados fechados ficam guardados no navegador deste dispositivo.</p>
        ${campaigns.length ? `
          <div class="progress-list">
            ${campaigns.map((campaign) => campaignHistory(campaign)).join("")}
          </div>
        ` : `<p class="empty">Nenhuma campanha concluída ainda.</p>`}
      </article>
    `;
  }

  function renderHallOfFame() {
    const hall = buildHallOfFame();
    app.innerHTML = `
      <article class="card hero-card hall-hero">
        <p class="eyebrow">Hall da fama</p>
        <h2>Conquistas e rankings</h2>
        <p class="muted">Os líderes combinam gols, assistências, títulos e campanhas decisivas.</p>
      </article>
      <section class="grid two">
        ${leaderboard("Times campeões", hall.teams, "títulos")}
        ${leaderboard("Mais gols", hall.goals, "gols")}
        ${leaderboard("Mais assistências", hall.assists, "assist.")}
        ${leaderboard("Mais títulos", hall.titles, "títulos")}
        ${leaderboard("Mais decisivos", hall.deciders, "pts")}
      </section>
    `;
  }

  function buildHallOfFame() {
    const totals = {};
    store.archive.forEach((campaign) => {
      Object.values(campaign.playerStats || {}).forEach((stat) => {
        totals[stat.id] = totals[stat.id] || { ...stat, goals: 0, assists: 0, titles: 0 };
        totals[stat.id].goals += stat.goals || 0;
        totals[stat.id].assists += stat.assists || 0;
      });

      if (campaign.status === "champion") {
        (campaign.squad || []).forEach((player) => {
          totals[player.id] = totals[player.id] || { ...basePlayerStat(player), titles: 0 };
          totals[player.id].titles += 1;
        });
      }
    });

    const rows = Object.values(totals).map((item) => ({
      ...item,
      decisive: (item.goals || 0) * 2 + (item.assists || 0) + (item.titles || 0) * 3
    }));

    return {
      teams: championTeams(),
      goals: sortTop(rows, "goals"),
      assists: sortTop(rows, "assists"),
      titles: sortTop(rows, "titles"),
      deciders: sortTop(rows, "decisive")
    };
  }

  function championTeams() {
    const totals = {};
    store.archive
      .filter((campaign) => campaign.status === "champion")
      .forEach((campaign) => {
        const name = campaign.teamName || DEFAULT_TEAM_NAME;
        totals[name] = totals[name] || { label: name, value: 0 };
        totals[name].value += 1;
      });
    return Object.values(totals).sort((a, b) => b.value - a.value).slice(0, 8);
  }

  function sortTop(rows, key) {
    return rows.filter((row) => row[key] > 0).sort((a, b) => b[key] - a[key]).slice(0, 8).map((row) => ({ ...row, value: row[key] }));
  }

  function leaderboard(title, rows, suffix) {
    return `
      <article class="card">
        <h3>${escapeHtml(title)}</h3>
        ${rows.length ? `
          <div class="progress-list">
            ${rows.map((row, index) => `
              <div class="progress-item rank-row">
                <span><span class="rank-index">${index + 1}</span>${escapeHtml(row.label)}</span>
                <strong>${row.value} ${suffix}</strong>
              </div>
            `).join("")}
          </div>
        ` : `<p class="empty">Sem registros.</p>`}
      </article>
    `;
  }

  function campaignHistory(campaign) {
    const results = campaign.results || [];
    const summary = campaign.summary || buildCampaignSummary(campaign);
    return `
      <div class="progress-item">
        <span>
          <strong>${escapeHtml(campaign.teamName || DEFAULT_TEAM_NAME)}</strong> - ${escapeHtml(summary.statusLabel || statusLabel(campaign.status))}<br>
          <small class="muted">${escapeHtml(formatDate(campaign.createdAt))}</small><br>
          <small class="muted">${results.length} partida(s), ${summary.stats.wins}V ${summary.stats.draws}E ${summary.stats.losses}D, SG ${summary.stats.goalDifference}</small>
        </span>
        <span class="pill">${results.length} jogo(s)</span>
      </div>
      <div class="history-match-list">
        ${results.map((result, index) => historyMatchCard(campaign, result, index)).join("") || `<p class="empty">Sem partidas</p>`}
      </div>
    `;
  }

  function resultList(results) {
    return `
      <div class="progress-list">
        ${results.map((result, index) => {
          const id = `campaign-${index}`;
          return matchSummaryCard(result, id, expandedHistoryMatches.has(id));
        }).join("")}
      </div>
    `;
  }

  function matchResultCard(result) {
    const outcome = result.userDraw ? "Empate" : (result.userWon ? "Vitória" : "Derrota");
    const campaign = currentCampaign(false);
    const finished = campaign && ["champion", "eliminated"].includes(campaign.status);
    const buttonLabel = finished ? "Ver campanha" : "Próxima partida";
    const events = result.events || [];
    return `
      <article class="card">
        <p class="eyebrow">${escapeHtml(outcome)}${result.decidedByPenalties ? " nos pênaltis" : ""}</p>
        <div class="scoreboard">
          <div class="scoreline">
            <span class="team-name">${escapeHtml(result.teamName || teamName(campaign))}</span>
            <span class="score-number">${result.userGoals} x ${result.opponentGoals}</span>
            <span class="team-name">${escapeHtml(result.opponentName)}</span>
          </div>
          ${result.decidedByPenalties ? `<div class="penalty-scoreline">${escapeHtml(penaltyScoreText(result))}</div>` : ""}
        </div>
        <div class="event-list">
          ${events.length ? events.map(goalEvent).join("") : `<p class="empty">Jogo sem gols.</p>`}
        </div>
        ${substitutionTimeline(result)}
        ${substitutionSuggestionsTimeline(result)}
        ${penaltyShootoutPanel(result)}
        ${matchStatsPanel(result.stats)}
        <div class="actions">
          <button class="primary-button" data-action="campaign" type="button">${buttonLabel}</button>
        </div>
      </article>
    `;
  }

  function historyMatchCard(campaign, result, index) {
    const id = `${campaign.id}-${index}`;
    const expanded = expandedHistoryMatches.has(id);
    return matchSummaryCard(result, id, expanded);
  }

  function matchSummaryCard(result, id, expanded) {
    const events = result.events || [];
    return `
      <button class="match-history-card" data-action="history-toggle" data-id="${escapeHtml(id)}" type="button">
        <span>
          <strong>${escapeHtml(resultScoreText(result))}</strong>
          <small>${escapeHtml(result.round || "")}${result.decidedByPenalties ? " - pênaltis" : ""}</small>
        </span>
        <span class="pill">${expanded ? "Fechar" : "Detalhes"}</span>
      </button>
      ${expanded ? `
        <div class="match-event-panel">
          ${events.length ? events.map(goalEvent).join("") : `<p class="empty">Jogo sem gols.</p>`}
          ${substitutionTimeline(result)}
          ${substitutionSuggestionsTimeline(result)}
          ${penaltyShootoutPanel(result)}
          ${matchStatsPanel(result.stats)}
        </div>
      ` : ""}
    `;
  }

  function toggleHistoryMatch(id) {
    if (!id) return;
    if (expandedHistoryMatches.has(id)) expandedHistoryMatches.delete(id);
    else expandedHistoryMatches.add(id);
    if (id.startsWith("campaign-")) renderCampaign();
    else renderHistory();
  }

  function resultScoreText(result) {
    if (!result) return "";
    const base = `${result.teamName || DEFAULT_TEAM_NAME} ${result.userGoals || 0} x ${result.opponentGoals || 0} ${result.opponentName || "Adversário"}`;
    return result.decidedByPenalties && result.penalties ? `${base} (${result.penalties.userGoals} x ${result.penalties.opponentGoals} nos pênaltis)` : base;
  }

  function penaltyScoreText(result) {
    return result?.penalties ? `${result.penalties.userGoals} x ${result.penalties.opponentGoals} nos pênaltis` : "";
  }

  function substitutionTimeline(result, upToMinute = null) {
    const substitutions = (result?.substitutions || []).filter((substitution) => upToMinute === null || substitution.minute <= upToMinute);
    if (!substitutions.length) return "";
    return `
      <div class="substitution-timeline">
        <strong>Substituições</strong>
        <div class="substitution-list">
          ${substitutions.map((substitution) => `
            <div class="substitution-event">
              <span>${substitution.minute}'</span>
              <strong>${escapeHtml(substitution.inName)} entrou</strong>
              <small>Saiu: ${escapeHtml(substitution.outName)}${substitution.slot ? ` · ${escapeHtml(substitution.slot)}` : ""}</small>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function substitutionSuggestionsTimeline(result, upToMinute = null) {
    const suggestions = (result?.substitutionSuggestions || []).filter((suggestion) => upToMinute === null || suggestion.minute <= upToMinute);
    if (!suggestions.length) return "";
    return `
      <div class="substitution-timeline suggestion-timeline">
        <strong>Sugestões de substituição</strong>
        <div class="substitution-list">
          ${suggestions.map((suggestion) => `
            <div class="substitution-event suggestion-event">
              <span>${suggestion.minute}'</span>
              <strong>Sugestão registrada</strong>
              <small>${escapeHtml(suggestion.text)}</small>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function penaltyShootoutPanel(result) {
    if (!result?.penalties?.shots?.length) return "";
    const userName = result.teamName || DEFAULT_TEAM_NAME;
    const opponentName = result.opponentName || "Adversário";
    const winnerName = result.penalties.winner === "user" ? userName : opponentName;
    const userShots = result.penalties.shots.filter((shot) => shot.team === "user");
    const opponentShots = result.penalties.shots.filter((shot) => shot.team === "opponent");
    return `
      <div class="penalty-panel">
        <div class="penalty-panel-header">
          <strong>Disputa de pênaltis: ${escapeHtml(winnerName)} venceu</strong>
          <span class="penalty-result">${escapeHtml(userName)} ${result.penalties.userGoals} x ${result.penalties.opponentGoals} ${escapeHtml(opponentName)}</span>
        </div>
        <div class="penalty-columns">
          <div class="penalty-team-column">
            <div class="penalty-team-header">
              <span>${escapeHtml(userName)}</span>
              <strong>${result.penalties.userGoals}</strong>
            </div>
            <div class="penalty-shot-list">
              ${userShots.map(penaltyShotRow).join("")}
            </div>
          </div>
          <div class="penalty-team-column">
            <div class="penalty-team-header">
              <span>${escapeHtml(opponentName)}</span>
              <strong>${result.penalties.opponentGoals}</strong>
            </div>
            <div class="penalty-shot-list">
              ${opponentShots.map(penaltyShotRow).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function penaltyShotRow(shot) {
    return `
      <div class="penalty-shot-row ${shot.scored ? "scored" : "missed"}">
        <span class="penalty-icon">${shot.scored ? "✅" : "❌"}</span>
        <strong>${escapeHtml(shot.taker)}</strong>
        <small>${shot.scored ? "Gol" : "Perdeu"}</small>
      </div>
    `;
  }

  function goalEvent(event) {
    const team = event.team === "opponent" ? ` <span class="muted">(${escapeHtml(event.opponentName)})</span>` : "";
    return `
      <div class="goal-event">
        <strong>⚽ ${event.minute}' ${escapeHtml(event.scorer)}${team}</strong><br>
        <span class="muted">⭐ Assistência: ${escapeHtml(event.assister)}</span>
      </div>
    `;
  }

  function playerCard(player, selected, action) {
    const ovr = playerOverall(player);
    const band = overallBand(ovr);
    return `
      <button class="player-card tier-${player.tier} ovr-${band.key} ${selected ? "selected" : ""}" data-action="${action}" data-id="${player.id}" type="button">
        ${playerCardContent(player, band, ovr)}
      </button>
    `;
  }

  function selectionDraftPlayerCard(campaign, player, selected) {
    const drafted = draftedPlayerKeys(campaign).has(playerSourceKey(player));
    if (!drafted) return playerCard(player, selected, "draft-select");
    const ovr = playerOverall(player);
    const band = overallBand(ovr);
    return `
      <button class="player-card tier-${player.tier} ovr-${band.key} drafted-card disabled" type="button" disabled>
        ${playerCardContent(player, band, ovr, "CONVOCADO")}
      </button>
    `;
  }

  function readonlyPlayer(player) {
    const ovr = playerOverall(player);
    const band = overallBand(ovr);
    return `
      <div class="player-card tier-${player.tier} ovr-${band.key} disabled">
        ${playerCardContent(player, band, ovr)}
      </div>
    `;
  }

  function playerCardContent(player, band, ovr, statusLabel = band.label) {
    return `
        <span class="player-top">
          <span class="player-name">${escapeHtml(player.nome)}</span>
          <span class="ovr-badge">OVR ${ovr}</span>
        </span>
        <span class="player-subline">${countryFlag(player.pais)} ${escapeHtml(player.pais)} · ${escapeHtml(String(player.ano))}${player.clube ? ` · ${escapeHtml(player.clube)}` : ""}${player.idade ? ` · ${escapeHtml(String(player.idade))} anos` : ""}</span>
        <span class="player-compact-meta">
          <span class="player-position-line">⚽ ${escapeHtml(player.posicoes.join(" / "))}</span>
        </span>
        <span class="tier-badge">${escapeHtml(statusLabel)}</span>
    `;
  }

  function countryFlag(country) {
    const flags = {
      "Alemanha": "🇩🇪",
      "Argentina": "🇦🇷",
      "Áustria": "🇦🇹",
      "Bélgica": "🇧🇪",
      "Brasil": "🇧🇷",
      "Camarões": "🇨🇲",
      "Canadá": "🇨🇦",
      "Chile": "🇨🇱",
      "Colômbia": "🇨🇴",
      "Coreia do Sul": "🇰🇷",
      "Costa Rica": "🇨🇷",
      "Croácia": "🇭🇷",
      "Dinamarca": "🇩🇰",
      "Equador": "🇪🇨",
      "Espanha": "🇪🇸",
      "Estados Unidos": "🇺🇸",
      "França": "🇫🇷",
      "Gana": "🇬🇭",
      "Grécia": "🇬🇷",
      "Holanda": "🇳🇱",
      "Inglaterra": "🏴",
      "Itália": "🇮🇹",
      "Japão": "🇯🇵",
      "Marrocos": "🇲🇦",
      "México": "🇲🇽",
      "Nigéria": "🇳🇬",
      "País de Gales": "🏴",
      "Paraguai": "🇵🇾",
      "Polônia": "🇵🇱",
      "Portugal": "🇵🇹",
      "República Tcheca": "🇨🇿",
      "Senegal": "🇸🇳",
      "Sérvia": "🇷🇸",
      "Suécia": "🇸🇪",
      "União Soviética": "🇷🇺",
      "Uruguai": "🇺🇾"
    };
    return flags[country] || "🏳️";
  }

  function playerOverall(player) {
    const freshPlayer = findPlayer(player.id);
    return player.ovr || (freshPlayer && freshPlayer.ovr) || derivedPlayerOverall(player);
  }

  function derivedPlayerOverall(player) {
    const bySector = {
      GK: player.defense * 0.8 + player.creativity * 0.06 + player.offense * 0.02 + 15,
      DEF: player.defense * 0.68 + player.creativity * 0.16 + player.offense * 0.06 + 14,
      MID: player.creativity * 0.52 + player.offense * 0.18 + player.defense * 0.12 + 17,
      ATT: player.offense * 0.58 + player.creativity * 0.22 + player.defense * 0.06 + 16
    };
    const lowTierBonus = { GK: -2, DEF: 5, MID: 0, ATT: 2 };
    const tierBonus = player.tier === "high" ? 6 : (lowTierBonus[player.setor] ?? 0);
    const score = Math.round((bySector[player.setor] || 78) + tierBonus);
    return clamp(score, 70, 98);
  }

  function overallBand(ovr) {
    if (ovr === 99) return { key: "absolute", label: "Lendário absoluto" };
    if (ovr >= 94) return { key: "elite", label: "Elite histórica" };
    if (ovr >= 88) return { key: "craque", label: "Craque" };
    if (ovr >= 80) return { key: "forte", label: "Forte" };
    return { key: "alt", label: "Alternativo/Veterano" };
  }

  function draftBand(roll) {
    return DRAFT_RARITIES.find((band) => roll >= band.minRoll && roll <= band.maxRoll) || DRAFT_RARITIES[0];
  }

  function rollFeedback(roll) {
    if (roll === 20) return "Rolagem lendária!";
    if (roll === 1) return "Azar crítico!";
    if (roll >= 15) return "Grande rolagem!";
    if (roll <= 4) return "Rolagem difícil.";
    return "Rolagem definida";
  }

  function selectionBand(roll) {
    return SELECTION_RARITIES.find((band) => roll >= band.minRoll && roll <= band.maxRoll) || SELECTION_RARITIES[0];
  }

  function selectionLevelLabel(level) {
    const band = SELECTION_RARITIES.find((item) => item.level === level);
    return band ? band.label : "Seleção histórica";
  }

  function basePlayerStat(player) {
    return {
      id: player.id,
      label: cardLabel(player),
      goals: 0,
      assists: 0,
      titles: 0
    };
  }

  function cardLabel(player) {
    return `${player.nome} ${player.ano}`;
  }

  function findPlayer(id) {
    return PLAYERS.find((player) => player.id === id) || store.current?.squad?.find((player) => player.id === id);
  }

  function statusLabel(status) {
    if (status === "champion") return "Campanha campeã";
    if (status === "eliminated") return "Campanha encerrada";
    if (status === "setup") return "Escolha de formação";
    if (status === "draft") return "Draft em andamento";
    if (status === "formation") return "Montagem do time";
    if (status === "groups") return "Fase de grupos";
    if (status === "knockout") return "Mata-mata";
    return "Torneio em andamento";
  }

  function currentPhaseLabel(campaign) {
    if (!campaign) return "";
    if (campaign.status === "groups" && campaign.worldCup) {
      return `${campaign.worldCup.groupName} - Rodada ${Math.min((campaign.worldCup.groupRound || 0) + 1, 3)}`;
    }
    if (campaign.status === "knockout") return ROUND_NAMES[campaign.matchIndex] || "Mata-mata";
    return statusLabel(campaign.status);
  }

  function teamName(campaign) {
    return cleanTeamName(campaign?.teamName || store.settings.teamName || DEFAULT_TEAM_NAME);
  }

  function cleanTeamName(value) {
    const cleaned = String(value || "").trim().replace(/\s+/g, " ");
    return cleaned || DEFAULT_TEAM_NAME;
  }

  function simulationDelay() {
    return (SIMULATION_SPEEDS[store.settings.simulationSpeed] || SIMULATION_SPEEDS.normal).delay;
  }

  function simulationSteps(delay) {
    return delay > 0 ? 90 : 0;
  }

  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function weightedPick(items, weightFn) {
    const weights = items.map((item) => Math.max(1, weightFn(item)));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let roll = Math.random() * total;
    for (let i = 0; i < items.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  function poisson(lambda) {
    const limit = Math.exp(-lambda);
    let count = 0;
    let product = 1;
    do {
      count += 1;
      product *= Math.random();
    } while (product > limit);
    return Math.max(0, count - 1);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}());
