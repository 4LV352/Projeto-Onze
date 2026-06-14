global.window = global;

require("../data/players.js");
require("../data/opponents.js");

const PLAYERS = global.LEGENDS_PLAYERS;
const OPPONENTS = global.LEGENDS_OPPONENTS;
const ROUND_NAMES = ["Oitavas", "Quartas", "Semifinal", "Final"];

const TEAM_IDS = {
  forte: [
    "courtois-2022",
    "roberto-carlos-2002",
    "maldini-1994",
    "beckenbauer-1974",
    "cafu-2002",
    "xavi-2010",
    "modric-2018",
    "ronaldinho-2005",
    "pele-1970",
    "cristiano-2017",
    "messi-2012"
  ],
  medio: [
    "lloris-2018",
    "ashley-cole-2010",
    "pique-2015",
    "boateng-2014",
    "maicon-2010",
    "honda-2010",
    "deco-2006",
    "kaka-2014",
    "neymar-2023",
    "cristiano-2022",
    "ronaldo-2006"
  ],
  fraco: [
    "seaman-2002",
    "roberto-carlos-2007",
    "sergio-ramos-2021",
    "kuffour-1999",
    "cafu-2006",
    "honda-2010",
    "riquelme-2014",
    "lampard-2014",
    "landon-donovan-2002",
    "chicharito-2014",
    "dempsey-2014"
  ]
};

function player(id) {
  return PLAYERS.find((item) => item.id === id);
}

function lineup(label) {
  const selected = TEAM_IDS[label].map(player).filter(Boolean);
  if (selected.length === 11) return selected;

  const used = new Set(selected.map((item) => item.id));
  const fallback = [...PLAYERS]
    .filter((item) => !used.has(item.id) && !item.selectionOnly)
    .sort((a, b) => playerOverall(label === "fraco" ? a : b) - playerOverall(label === "fraco" ? b : a));
  return selected.concat(fallback).slice(0, 11);
}

function playerOverall(player) {
  return player.ovr || 78;
}

function teamStrength(players) {
  const avg = (items, key) => items.reduce((sum, item) => sum + item[key], 0) / Math.max(items.length, 1);
  const allAvg = (key) => avg(players, key);
  const ovrAvg = players.reduce((sum, item) => sum + playerOverall(item), 0) / Math.max(players.length, 1);
  const gk = players.find((item) => item.setor === "GK");
  const defenders = players.filter((item) => item.setor === "DEF");
  const mids = players.filter((item) => item.setor === "MID");
  const atts = players.filter((item) => item.setor === "ATT");
  const modifier = { offense: 2.2, defense: 0.4, creativity: 1.4 };
  const links = lineupLinkAnalysis(players);
  const elitePlayers = players.filter((item) => playerOverall(item) >= 95);
  const eliteAttackers = atts.filter((item) => playerOverall(item) >= 95);
  const eliteCreators = players.filter((item) => playerOverall(item) >= 95 && (item.setor === "MID" || item.creativity >= 88));
  const goalkeeper = clamp(gk ? gk.defense * 0.82 + playerOverall(gk) * 0.18 : allAvg("defense"), 70, 99);
  const starPower = elitePlayers.length * 1.8 + eliteAttackers.length * 1.5 + eliteCreators.length * 1.1;
  const baseOffense = clamp(avg(atts, "offense") * 0.5 + avg(mids, "creativity") * 0.16 + ovrAvg * 0.2 + allAvg("offense") * 0.07 + avg(atts, "creativity") * 0.07 + Math.min(starPower, 8) + atts.length * 0.5 + modifier.offense, 70, 99);
  const defense = clamp(avg(defenders, "defense") * 0.46 + goalkeeper * 0.2 + avg(mids, "defense") * 0.12 + ovrAvg * 0.12 + allAvg("defense") * 0.1 + defenders.length * 0.4 + modifier.defense, 70, 99);
  const baseCreativity = clamp(avg(mids, "creativity") * 0.4 + avg(atts, "creativity") * 0.2 + ovrAvg * 0.2 + allAvg("creativity") * 0.11 + avg(mids, "offense") * 0.09 + Math.min(starPower, 7) + mids.length * 0.3 + modifier.creativity, 70, 99);
  const offense = clamp(baseOffense * (1 + links.attack), 70, 99);
  const creativity = clamp(baseCreativity * (1 + links.creativity), 70, 99);
  const overall = clamp(ovrAvg * 0.45 + offense * 0.24 + defense * 0.16 + creativity * 0.15, 70, 99);
  return { offense, defense, creativity, goalkeeper, overall, ovrAvg, starPower, linkBonus: links };
}

function lineupLinkAnalysis(players) {
  const countries = new Map();
  const selections = new Map();
  players.forEach((player) => {
    if (!countries.has(player.pais)) countries.set(player.pais, []);
    countries.get(player.pais).push(player);
    (player.selectionTags || []).forEach((tag) => {
      if (!selections.has(tag)) selections.set(tag, []);
      selections.get(tag).push(player);
    });
  });
  const countryScore = Array.from(countries.values()).filter((group) => group.length >= 2).reduce((sum, group) => sum + group.length - 1, 0);
  const selectionScore = Array.from(selections.values()).filter((group) => group.length >= 3).reduce((sum, group) => sum + group.length - 2, 0);
  return {
    attack: clamp(countryScore * 0.008 + selectionScore * 0.025, 0, 0.08),
    creativity: clamp(countryScore * 0.01 + selectionScore * 0.03, 0, 0.08)
  };
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

function matchBalance(team, opponent) {
  const opponentProfile = opponentStrength(opponent);
  const attackEdge = team.offense - opponentProfile.defense;
  const creationEdge = team.creativity - opponentProfile.creativity;
  const defenseEdge = team.defense - opponentProfile.offense;
  const goalkeeperEdge = team.goalkeeper - opponentProfile.goalkeeper;
  const overallEdge = team.overall - opponentProfile.overall;
  return {
    teamLambda: clamp(1.32 + attackEdge / 24 + creationEdge / 42 + overallEdge / 32 + Math.max(0, team.starPower - opponentProfile.starPower) / 36, 0.42, 3.7),
    opponentLambda: clamp(1.04 - defenseEdge / 26 - goalkeeperEdge / 40 - overallEdge / 34 + (opponentProfile.creativity - team.creativity) / 64, 0.32, 3.9)
  };
}

function play(team, opponent, knockout = false) {
  const balance = matchBalance(team, opponent);
  const userGoals = poisson(randomizedLambda(balance.teamLambda));
  const opponentGoals = poisson(randomizedLambda(balance.opponentLambda));
  if (knockout && userGoals === opponentGoals) {
    const penaltyEdge = clamp(0.5 + (team.overall - opponentStrength(opponent).overall) / 80, 0.35, 0.72);
    return Math.random() < penaltyEdge ? "win" : "loss";
  }
  if (userGoals > opponentGoals) return "win";
  if (userGoals === opponentGoals) return "draw";
  return "loss";
}

function simulateCampaign(label) {
  const team = teamStrength(lineup(label));
  const groupOpponents = selectUserGroupOpponents();
  const group = [{ id: "user", pts: 0, gf: 0, ga: 0 }].concat(groupOpponents.map((opponent) => ({ id: opponent.id, pts: 0, gf: 0, ga: 0, opponent })));

  groupOpponents.forEach((opponent) => {
    const balance = matchBalance(team, opponent);
    const userGoals = poisson(randomizedLambda(balance.teamLambda));
    const opponentGoals = poisson(randomizedLambda(balance.opponentLambda));
    applyGroupResult(group[0], group.find((row) => row.id === opponent.id), userGoals, opponentGoals);
  });

  for (let index = 1; index < group.length; index += 1) {
    for (let other = index + 1; other < group.length; other += 1) {
      const home = group[index].opponent;
      const away = group[other].opponent;
      const homeGoals = poisson(clamp(1.1 + ((home.offense || 80) - (away.defense || 80)) / 42 + randomFloat(-0.25, 0.25), 0.1, 4));
      const awayGoals = poisson(clamp(1.1 + ((away.offense || 80) - (home.defense || 80)) / 42 + randomFloat(-0.25, 0.25), 0.1, 4));
      applyGroupResult(group[index], group[other], homeGoals, awayGoals);
    }
  }

  const standings = group
    .map((row) => ({ ...row, gd: row.gf - row.ga }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  const userRank = standings.findIndex((row) => row.id === "user") + 1;
  if (userRank > 2) return "Grupos";

  const path = createOpponentPath();
  for (let index = 0; index < path.length; index += 1) {
    const result = play(team, path[index], true);
    if (result !== "win") return ROUND_NAMES[index];
  }
  return "Campeão";
}

function applyGroupResult(home, away, homeGoals, awayGoals) {
  home.gf += homeGoals;
  home.ga += awayGoals;
  away.gf += awayGoals;
  away.ga += homeGoals;
  if (homeGoals > awayGoals) home.pts += 3;
  else if (awayGoals > homeGoals) away.pts += 3;
  else {
    home.pts += 1;
    away.pts += 1;
  }
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
  return picked;
}

function createOpponentPath() {
  const byDifficulty = (difficulty) => OPPONENTS.filter((opponent) => opponent.difficulty === difficulty);
  const medium = shuffle(byDifficulty("medium"));
  const strong = shuffle(byDifficulty("strong"));
  const elite = shuffle(byDifficulty("elite"));
  const historical = shuffle(byDifficulty("historical"));
  return [
    medium[0] || strong[0] || elite[0] || historical[0],
    strong[0] || medium[1] || elite[0] || historical[0],
    elite[0] || strong[1] || historical[0] || medium[1],
    historical[0] || elite[1] || strong[1] || medium[1]
  ].filter(Boolean);
}

function run(label, count = 100) {
  const buckets = { Grupos: 0, Oitavas: 0, Quartas: 0, Semifinal: 0, Final: 0, Campeão: 0 };
  for (let index = 0; index < count; index += 1) {
    buckets[simulateCampaign(label)] += 1;
  }
  return buckets;
}

function randomizedLambda(lambda) {
  return clamp(lambda * randomFloat(0.93, 1.07), 0.12, 5.2);
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

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

console.log("Relatório de balanceamento - 100 campanhas por perfil");
for (const label of ["forte", "medio", "fraco"]) {
  const team = teamStrength(lineup(label));
  console.log(`\nTime ${label} | OVR médio ${team.ovrAvg.toFixed(1)} | força ${team.overall.toFixed(1)} | ataque ${team.offense.toFixed(1)} | criação ${team.creativity.toFixed(1)} | defesa ${team.defense.toFixed(1)} | links +${Math.round(team.linkBonus.attack * 100)}% atk/+${Math.round(team.linkBonus.creativity * 100)}% cri`);
  console.table(run(label, 100));
}
