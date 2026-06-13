global.window = {};
require("../data/players.js");

const PLAYERS = window.LEGENDS_PLAYERS || [];

const SELECTIONS = [
  ["costa-rica-2014", "alternative"],
  ["grecia-2004", "alternative"],
  ["senegal-2002", "alternative"],
  ["paraguai-2010", "alternative"],
  ["gana-2010", "alternative"],
  ["marrocos-2022", "alternative"],
  ["mexico-1986", "strong"],
  ["suecia-1994", "strong"],
  ["coreia-2002", "strong"],
  ["japao-2010", "strong"],
  ["chile-2015", "strong"],
  ["colombia-2014", "strong"],
  ["dinamarca-1992", "strong"],
  ["alemanha-2002", "very-strong"],
  ["argentina-2014", "very-strong"],
  ["portugal-2006", "very-strong"],
  ["inglaterra-2006", "very-strong"],
  ["croacia-2018", "very-strong"],
  ["belgica-2018", "very-strong"],
  ["uruguai-2010", "very-strong"],
  ["holanda-2014", "very-strong"],
  ["brasil-1994", "finalist"],
  ["brasil-2002", "finalist"],
  ["franca-1998", "finalist"],
  ["italia-2006", "finalist"],
  ["espanha-2010", "finalist"],
  ["alemanha-2014", "finalist"],
  ["argentina-2022", "finalist"],
  ["franca-2018", "finalist"],
  ["holanda-2010", "finalist"],
  ["franca-2006", "finalist"],
  ["brasil-1958", "absolute"],
  ["brasil-1962", "absolute"],
  ["brasil-1970", "absolute"],
  ["argentina-1986", "absolute"],
  ["alemanha-1974", "absolute"],
  ["italia-1982", "absolute"],
  ["holanda-1974", "absolute"],
  ["brasil-1982", "absolute"]
].map(([id, level]) => ({ id, level }));

const POSITIONS = {
  GOL: ["GOL"],
  LE: ["LE", "ALA"],
  LD: ["LD", "ALA"],
  ZAG: ["ZAG", "LIB", "LÍB"],
  VOL: ["VOL", "MC"],
  MC: ["MC", "VOL", "MEI"],
  MEI: ["MEI", "MC", "SA"],
  PE: ["PE", "SA", "ATA"],
  PD: ["PD", "SA", "ATA"],
  SA: ["SA", "ATA", "MEI"],
  CA: ["CA", "ATA"]
};

const LEVELS = ["alternative", "strong", "very-strong", "finalist", "absolute"];

const fallbackLevels = {
  alternative: ["alternative", "strong", "very-strong", "finalist", "absolute"],
  strong: ["strong", "very-strong", "alternative", "finalist", "absolute"],
  "very-strong": ["very-strong", "finalist", "strong", "absolute", "alternative"],
  finalist: ["finalist", "absolute", "very-strong", "strong", "alternative"],
  absolute: ["absolute", "finalist", "very-strong", "strong", "alternative"]
};

const errors = [];

const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

const compatiblePlayers = (selectionId, accepts) => {
  const accepted = new Set(accepts.map(normalize));
  return PLAYERS.filter((player) => {
    const tags = Array.isArray(player.selectionTags) ? player.selectionTags : [];
    return tags.includes(selectionId) && player.posicoes.some((position) => accepted.has(normalize(position)));
  });
};

const optionsFor = (level, position) => {
  const selected = [];
  const seen = new Set();
  for (const candidateLevel of fallbackLevels[level]) {
    const candidates = SELECTIONS.filter((selection) => selection.level === candidateLevel && compatiblePlayers(selection.id, POSITIONS[position]).length >= 2);
    for (const selection of candidates) {
      if (seen.has(selection.id)) continue;
      seen.add(selection.id);
      selected.push(selection);
      if (selected.length === 4) return selected;
    }
  }
  return selected;
};

for (const level of LEVELS) {
  const count = SELECTIONS.filter((selection) => selection.level === level).length;
  console.log(`${level}: ${count} seleções`);
  if (count < 4) errors.push(`${level} tem menos de 4 seleções cadastradas`);
}

for (const selection of SELECTIONS) {
  const roster = PLAYERS.filter((player) => (player.selectionTags || []).includes(selection.id));
  const counts = {
    total: roster.length,
    gk: compatiblePlayers(selection.id, ["GOL"]).length,
    fullbacks: compatiblePlayers(selection.id, ["LE", "LD", "ALA"]).length,
    centerBacks: compatiblePlayers(selection.id, ["ZAG", "LIB", "LÍB"]).length,
    midfielders: roster.filter((player) => player.setor === "MID" || player.posicoes.some((position) => ["VOL", "MC", "MEI"].includes(normalize(position)))).length,
    attackers: roster.filter((player) => player.setor === "ATT" || player.posicoes.some((position) => ["PE", "PD", "SA", "CA", "ATA"].includes(normalize(position)))).length
  };
  console.log(`${selection.id}: ${counts.total} jogadores | GOL ${counts.gk} | LAT ${counts.fullbacks} | ZAG ${counts.centerBacks} | MEI ${counts.midfielders} | ATA ${counts.attackers}`);
  if (counts.gk < 2 || counts.fullbacks < 2 || counts.centerBacks < 2 || counts.midfielders < 3 || counts.attackers < 3) {
    errors.push(`${selection.id} está incompleta`);
  }
  for (const position of Object.keys(POSITIONS)) {
    const count = compatiblePlayers(selection.id, POSITIONS[position]).length;
    if (count < 2) errors.push(`${selection.id} tem só ${count} jogador(es) para ${position}`);
  }
}

for (const level of LEVELS) {
  for (const position of Object.keys(POSITIONS)) {
    const options = optionsFor(level, position);
    console.log(`${level}/${position}: ${options.map((selection) => selection.id).join(", ")}`);
    if (options.length !== 4) errors.push(`${level}/${position} retornou ${options.length} seleções`);
  }
}

const brazil2002Defenders = compatiblePlayers("brasil-2002", ["ZAG", "LIB", "LÍB"]);
if (brazil2002Defenders.length < 2) errors.push("brasil-2002 precisa ter mais de um zagueiro/defensor central");

if (optionsFor("finalist", "ZAG").length <= 2) errors.push("D20 18/finalist para ZAG ainda tem 2 ou menos seleções");
if (SELECTIONS.filter((selection) => selection.level === "absolute").length < 8) errors.push("D20 20 tem poucas seleções absolutas");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Validação do Draft por Seleções concluída.");
