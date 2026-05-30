// Mock in-memory data store — mirrors the C# Db.I service
import { v4 as uuid } from './uuid';

const store = {
  users: [
    { id: 'user-1', email: 'demo@example.com', passwordHash: 'demo123', displayName: 'Demo User', fullName: 'Demo User', createdAt: new Date().toISOString() },
    { id: 'user-2', email: 'anna@example.com', passwordHash: 'anna123', displayName: 'AnnaNova', fullName: 'Anna Kowalska', createdAt: new Date().toISOString() },
    { id: 'user-3', email: 'piotr@example.com', passwordHash: 'piotr123', displayName: 'PiotrGamer', fullName: 'Piotr Nowak', createdAt: new Date().toISOString() },
  ],
  boardGames: [
    { id: uuid(), title: 'Catan', description: 'Klasyczna gra strategiczna.', minPlayers: 2, maxPlayers: 4, durationMin: 90, complexity: 'Medium', status: 'Available', coverColor: '#6C3483', owner: 'user-1' },
    { id: uuid(), title: 'Wsiąść do Pociągu', description: 'Buduj trasy kolejowe przez całą Europę.', minPlayers: 2, maxPlayers: 5, durationMin: 60, complexity: 'Easy', status: 'Available', coverColor: '#1A5276', owner: 'user-1' },
    { id: uuid(), title: 'Dominion', description: 'Gra karciana z budowaniem talii.', minPlayers: 2, maxPlayers: 4, durationMin: 45, complexity: 'Medium', status: 'In Use', coverColor: '#7D6608', owner: 'user-1' },
    { id: uuid(), title: 'Catan', description: 'Klasyczna gra strategiczna.', minPlayers: 2, maxPlayers: 4, durationMin: 90, complexity: 'Medium', status: 'Available', coverColor: '#6C3483', owner: 'user-2' },
    { id: uuid(), title: 'Pandemic', description: 'Kooperacyjna gra o ratowaniu świata.', minPlayers: 2, maxPlayers: 4, durationMin: 60, complexity: 'Medium', status: 'Available', coverColor: '#1B4F72', owner: 'user-2' },
    { id: uuid(), title: 'Scythe', description: 'Gra strategiczna w alternatywnej Europie.', minPlayers: 1, maxPlayers: 5, durationMin: 120, complexity: 'Hard', status: 'Available', coverColor: '#145A32', owner: 'user-3' },
  ],
  tournaments: [],
  events: [],
  players: [
    { id: uuid(), nickname: 'KingPawn', fullName: 'Krzysztof Wiśniewski', ownedGames: ['Catan', 'Dominion'], favoriteGames: ['Catan'], creatorId: 'user-1', stats: { gamesPlayed: 5, tournamentsWon: 1, eventsAttended: 3 }, avatarInitials: 'K' },
    { id: uuid(), nickname: 'QueenBee', fullName: 'Magdalena Zając', ownedGames: ['Pandemic', 'Scythe'], favoriteGames: ['Pandemic'], creatorId: 'user-1', stats: { gamesPlayed: 8, tournamentsWon: 2, eventsAttended: 4 }, avatarInitials: 'Q' },
    { id: uuid(), nickname: 'AnnaNova', fullName: 'Anna Kowalska', ownedGames: ['Catan', 'Wsiąść do Pociągu'], favoriteGames: ['Catan'], creatorId: 'user-2', stats: { gamesPlayed: 3, tournamentsWon: 0, eventsAttended: 2 }, avatarInitials: 'A' },
    { id: uuid(), nickname: 'PiotrGamer', fullName: 'Piotr Nowak', ownedGames: ['Scythe', 'Dominion'], favoriteGames: ['Scythe'], creatorId: 'user-3', stats: { gamesPlayed: 10, tournamentsWon: 3, eventsAttended: 6 }, avatarInitials: 'P' },
  ],
  friends: [],
  friendRequests: [],
  exchanges: [],
};

// ─── Auth ────────────────────────────────────
export async function loginAsync(email, password) {
  await delay(300);
  const user = store.users.find(u => u.email === email && u.passwordHash === password);
  return user || null;
}

export async function registerAsync(email, password, displayName, fullName) {
  await delay(300);
  if (store.users.find(u => u.email === email)) return { user: null, error: 'Email już jest używany.' };
  const user = { id: uuid(), email, passwordHash: password, displayName, fullName: fullName || displayName, createdAt: new Date().toISOString() };
  store.users.push(user);
  return { user, error: null };
}

// ─── Tournaments ─────────────────────────────
export async function getTournamentsAsync(userId) {
  await delay(100);
  return store.tournaments.filter(t => t.creatorId === userId || (t.invitedUsers || []).includes(userId));
}

export async function createTournamentAsync(userId, name, gameTitles, type, players, creatorName, mode) {
  await delay(200);
  const playerArray = Array.isArray(players)
    ? players
    : players.split(',').map(s => s.trim()).filter(Boolean);
  const titlesArray = Array.isArray(gameTitles) ? gameTitles : (gameTitles ? [gameTitles] : []);
  const t = {
    id: uuid(), name,
    gameTitle: titlesArray[0] || '',
    gameTitles: titlesArray,
    type,
    mode: 'bracket',   // will be set to 'rotational' by generateBracket when >1 game
    status: 'Planned', creatorId: userId,
    players: playerArray.map(p => typeof p === 'string' ? { name: p } : p),
    matches: [], standings: [],
    gameResults: [],
    rounds: [],
    points: {},
    gameWinners: {},
    createdAt: new Date().toISOString(),
  };
  store.tournaments.push(t);
  return t;
}

export async function deleteTournamentAsync(id, userId) {
  await delay(100);
  store.tournaments = store.tournaments.filter(t => !(t.id === id && t.creatorId === userId));
}

export async function finishTournamentAsync(tournamentId, userId) {
  await delay(100);
  const t = store.tournaments.find(t => t.id === tournamentId);
  if (!t) return;
  t.status = 'Completed';
  t.finishedAt = new Date().toISOString();

  // Determine winner
  let winner = null;
  if (t.type === 'Cup') {
    const lastRound = Math.max(...(t.matches.map(m => m.round)));
    const final = t.matches.find(m => m.round === lastRound && m.isCompleted);
    if (final) winner = final.winner;
  } else if (t.mode === 'rotational') {
    const sorted = Object.entries(t.points || {}).sort((a, b) => b[1] - a[1]);
    if (sorted[0]) winner = sorted[0][0];
  } else {
    const sorted = (t.standings || []).slice().sort((a, b) => (b.wins * 3 + b.draws) - (a.wins * 3 + a.draws));
    if (sorted[0]) winner = sorted[0].playerName;
  }
  t.winner = winner;

  // Save stats to player profiles
  t.players.forEach(p => {
    // community players
    const profile = store.players.find(pl => pl.id === p.id || pl.nickname === p.name);
    if (profile) {
      if (!profile.stats) profile.stats = { gamesPlayed: 0, tournamentsWon: 0, eventsAttended: 0 };
      profile.stats.gamesPlayed = (profile.stats.gamesPlayed || 0) + (t.matches.filter(m => m.isCompleted && (m.player1 === p.name || m.player2 === p.name)).length);
      if (winner && winner === p.name) profile.stats.tournamentsWon = (profile.stats.tournamentsWon || 0) + 1;
    }
    // registered users (by linkedUserId)
    if (p.userId) {
      const userProfile = store.users.find(u => u.id === p.userId);
      if (userProfile) {
        if (!userProfile.stats) userProfile.stats = { gamesPlayed: 0, tournamentsWon: 0, eventsAttended: 0 };
        userProfile.stats.gamesPlayed = (userProfile.stats.gamesPlayed || 0) + (t.matches.filter(m => m.isCompleted && (m.player1 === p.name || m.player2 === p.name)).length);
        if (winner && winner === p.name) userProfile.stats.tournamentsWon = (userProfile.stats.tournamentsWon || 0) + 1;
      }
    }
  });

  return t;
}

export async function addGameResultAsync(tournamentId, playerName, gameTitle, score) {
  await delay(100);
  const t = store.tournaments.find(t => t.id === tournamentId);
  if (!t) return;
  if (!t.gameResults) t.gameResults = [];
  // remove previous result for same player+game
  t.gameResults = t.gameResults.filter(r => !(r.playerName === playerName && r.gameTitle === gameTitle));
  t.gameResults.push({ playerName, gameTitle, score: Number(score) });
  // recalculate standings for allgames mode
  if (t.mode === 'allgames') {
    const players = t.players.map(p => p.name);
    t.standings = players.map(playerName => {
      const results = t.gameResults.filter(r => r.playerName === playerName);
      const total = results.reduce((s, r) => s + r.score, 0);
      const gamesPlayed = results.length;
      return { playerName, played: gamesPlayed, wins: 0, draws: 0, losses: 0, goalsFor: total, goalsAgainst: 0, totalScore: total };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }
}

export async function generateBracketAsync(tournamentId) {
  await delay(200);
  const t = store.tournaments.find(t => t.id === tournamentId);
  if (!t) return;
  const players = [...t.players.map(p => p.name)];
  t.matches = [];
  t.rounds = [];
  t.points = {};
  t.gameWinners = {};
  t.status = 'InProgress';

  players.forEach(n => { t.points[n] = 0; });

  const gameTitles = t.gameTitles && t.gameTitles.length > 0 ? t.gameTitles : [];

  // ── ROTATIONAL MODE: >1 game selected ─────────────────────────────────────
  if (gameTitles.length > 1) {
    t.mode = 'rotational';

    // Build game info map
    const gameInfoMap = {};
    gameTitles.forEach(title => {
      const g = store.boardGames.find(g => g.title === title && g.owner === t.creatorId)
              || store.boardGames.find(g => g.title === title);
      gameInfoMap[title] = {
        maxPlayers: g ? (Number(g.maxPlayers) || players.length) : players.length,
        minPlayers: g ? (Number(g.minPlayers) || 2) : 2,
      };
    });
    t.gameInfoMap = gameInfoMap;

    // Create one round per game (order = original selection order)
    gameTitles.forEach((gameTitle, idx) => {
      const maxPlayers = gameInfoMap[gameTitle].maxPlayers;
      const roundNumber = idx + 1;

      // Determine wait candidates: winner of this game in previous occurrence
      const prevWinnerKey = 'winner_' + gameTitle;
      const prevWinner = t.gameWinners[prevWinnerKey] || null;

      let mainPlayers, waitingPlayers;
      if (players.length <= maxPlayers) {
        mainPlayers = [...players];
        waitingPlayers = [];
      } else {
        // Sort players by how many rounds they've already sat out (ascending = waited less = sit now)
        const waitCounts = {};
        players.forEach(n => { waitCounts[n] = 0; });
        t.rounds.forEach(r => r.waitingPlayers.forEach(n => { waitCounts[n] = (waitCounts[n] || 0) + 1; }));

        let pool = [...players];
        // prevWinner of this game must wait first
        if (prevWinner && pool.includes(prevWinner)) {
          pool = [prevWinner, ...pool.filter(n => n !== prevWinner)];
        } else {
          // sort by least wait time so rotation is fair (those who waited least wait now)
          pool.sort((a, b) => waitCounts[a] - waitCounts[b]);
        }
        const overflow = players.length - maxPlayers;
        waitingPlayers = pool.slice(0, overflow);
        mainPlayers = pool.slice(overflow);
      }

      t.rounds.push({
        id: uuid(),
        roundNumber,
        gameTitle,
        maxPlayers,
        mainPlayers,
        waitingPlayers,
        mainResult: null,
        miniResult: null,
        finished: false,
        pointsAwarded: false,
      });
    });

    return t;
  }

  // ── STANDARD BRACKET (1 game) ───────────────────────────────────────────
  t.mode = 'bracket';

  const gameInfoMap = {};
  gameTitles.forEach(title => {
    const g = store.boardGames.find(g => g.title === title && g.owner === t.creatorId)
            || store.boardGames.find(g => g.title === title);
    if (g) gameInfoMap[title] = { maxPlayers: Number(g.maxPlayers) || 2, minPlayers: Number(g.minPlayers) || 2 };
  });

  const allMaxPlayers = Object.values(gameInfoMap).map(g => g.maxPlayers).filter(n => n >= 2);
  let matchSize = allMaxPlayers.length > 0 ? Math.max(...allMaxPlayers) : 2;
  matchSize = Math.max(2, matchSize);
  t.matchSize = matchSize;
  t.gameInfoMap = gameInfoMap;

  const drawGame = () => gameTitles.length > 0 ? gameTitles[Math.floor(Math.random() * gameTitles.length)] : null;

  if (t.type === 'Cup') {
    let matchNum = 1;
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const groupPlayers = (playerList) => {
      const groups = [];
      let i = 0;
      while (i < playerList.length) {
        const remaining = playerList.length - i;
        if (remaining >= matchSize) { groups.push(playerList.slice(i, i + matchSize)); i += matchSize; }
        else if (remaining >= 2) { groups.push(playerList.slice(i)); i = playerList.length; }
        else { groups.push([playerList[i]]); i++; }
      }
      return groups;
    };
    const round1Groups = groupPlayers(shuffled);
    round1Groups.forEach((group) => {
      const isBye = group.length === 1;
      const allP = isBye ? [group[0], 'BYE'] : group;
      t.matches.push({
        id: uuid(), round: 1, matchNumber: matchNum++,
        players: allP, player1: allP[0], player2: allP[1] || 'BYE',
        scores: Object.fromEntries(group.map(p => [p, 0])),
        scorePlayer1: 0, scorePlayer2: 0,
        isCompleted: isBye, isBye,
        gameTitle: drawGame(),
        winner: isBye ? group[0] : null,
      });
    });
    let prevAdvancers = round1Groups.length;
    let round = 2;
    while (prevAdvancers > 1) {
      const matchesThisRound = Math.ceil(prevAdvancers / matchSize);
      for (let j = 0; j < matchesThisRound; j++) {
        const slotsInMatch = Math.min(matchSize, prevAdvancers - j * matchSize);
        t.matches.push({
          id: uuid(), round, matchNumber: matchNum++,
          players: Array(Math.max(2, slotsInMatch)).fill('TBD'),
          player1: 'TBD', player2: 'TBD',
          scores: {}, scorePlayer1: 0, scorePlayer2: 0,
          isCompleted: false, isBye: false, winner: null,
          gameTitle: drawGame(),
        });
      }
      prevAdvancers = matchesThisRound;
      round++;
    }
    t.matches.filter(m => m.round === 1 && m.isBye).forEach(m => {
      const roundMatches = t.matches.filter(x => x.round === 1).sort((a, b) => a.matchNumber - b.matchNumber);
      const matchIdx = roundMatches.findIndex(x => x.id === m.id);
      const nextRoundMatches = t.matches.filter(x => x.round === 2).sort((a, b) => a.matchNumber - b.matchNumber);
      if (nextRoundMatches.length > 0) {
        const nextMatch = nextRoundMatches[Math.floor(matchIdx / matchSize)];
        const slotIdx = matchIdx % matchSize;
        if (nextMatch) {
          while (nextMatch.players.length <= slotIdx) nextMatch.players.push('TBD');
          nextMatch.players[slotIdx] = m.winner;
          nextMatch.player1 = nextMatch.players[0] || 'TBD';
          nextMatch.player2 = nextMatch.players[1] || 'TBD';
        }
      }
    });
  } else {
    // League: round robin
    let matchNum = 1;
    let round = 1;
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        t.matches.push({
          id: uuid(), round, matchNumber: matchNum++,
          players: [players[i], players[j]],
          player1: players[i], player2: players[j],
          scores: { [players[i]]: 0, [players[j]]: 0 },
          scorePlayer1: 0, scorePlayer2: 0, isCompleted: false,
        });
        if (matchNum % 3 === 0) round++;
      }
    }
    t.standings = players.map(p => ({ playerName: p, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }));
  }
  return t;
}

// ─── Rotational round result ──────────────────
// type: 'main' | 'mini'   scores: { playerName: score }
export async function saveRotationalResultAsync(tournamentId, roundId, type, scores) {
  await delay(100);
  const t = store.tournaments.find(t => t.id === tournamentId);
  if (!t) return null;
  const round = (t.rounds || []).find(r => r.id === roundId);
  if (!round) return null;

  const sortedEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const winner = sortedEntries.length > 0 ? sortedEntries[0][0] : null;

  if (type === 'main') {
    round.mainResult = { scores, winner, finished: true };
    if (!t.gameWinners) t.gameWinners = {};
    t.gameWinners['winner_' + round.gameTitle] = winner;
  } else {
    round.miniResult = { scores, winner, finished: true };
  }

  // Award points once both results are ready
  const needsMini = round.waitingPlayers.length >= 2;
  const mainDone = round.mainResult && round.mainResult.finished;
  const miniDone = !needsMini || (round.miniResult && round.miniResult.finished);

  if (mainDone && miniDone && !round.pointsAwarded) {
    round.pointsAwarded = true;
    round.finished = true;

    // Main game: 1st=3, 2nd=2, rest=1
    const ranked = Object.entries(round.mainResult.scores).sort((a, b) => b[1] - a[1]);
    ranked.forEach(([name], idx) => {
      t.points[name] = (t.points[name] || 0) + (idx === 0 ? 3 : idx === 1 ? 2 : 1);
    });
    // Waiting: 1 pt each
    round.waitingPlayers.forEach(name => {
      t.points[name] = (t.points[name] || 0) + 1;
    });
    // Mini-game: winner=2, others=1
    if (round.miniResult) {
      const miniRanked = Object.entries(round.miniResult.scores).sort((a, b) => b[1] - a[1]);
      miniRanked.forEach(([name], idx) => {
        t.points[name] = (t.points[name] || 0) + (idx === 0 ? 2 : 1);
      });
    }

    // Check if all rounds finished → auto complete tournament
    if (t.rounds.every(r => r.finished)) {
      t.status = 'Completed';
      const sorted = Object.entries(t.points).sort((a, b) => b[1] - a[1]);
      t.winner = sorted.length > 0 ? sorted[0][0] : null;
    }
  }

  return t;
}

export async function completeMatchAsync(tournamentId, matchId, score1, score2, scoresMap) {
  await delay(100);
  const t = store.tournaments.find(t => t.id === tournamentId);
  if (!t) return;
  const m = t.matches.find(m => m.id === matchId);
  if (!m) return;

  // Support both 2-player legacy and multi-player (scoresMap: { playerName: score })
  const matchSize = t.matchSize || 2;
  const activePlayers = (m.players || [m.player1, m.player2]).filter(p => p !== 'BYE' && p !== 'TBD');

  if (scoresMap && typeof scoresMap === 'object') {
    m.scores = scoresMap;
  } else {
    m.scores = {};
    if (activePlayers[0]) m.scores[activePlayers[0]] = Number(score1) || 0;
    if (activePlayers[1]) m.scores[activePlayers[1]] = Number(score2) || 0;
  }
  m.scorePlayer1 = m.scores[m.player1] || 0;
  m.scorePlayer2 = m.scores[m.player2] || 0;
  m.isCompleted = true;

  // Winner = player with highest score
  let winner = null;
  let maxScore = -1;
  let tie = false;
  activePlayers.forEach(p => {
    const s = m.scores[p] ?? 0;
    if (s > maxScore) { maxScore = s; winner = p; tie = false; }
    else if (s === maxScore) { tie = true; }
  });
  m.winner = tie ? 'Remis' : (winner || activePlayers[0]);

  // Cup: advance winner to next round
  if (t.type === 'Cup' && m.winner !== 'Remis' && m.winner) {
    const advWinner = m.winner;
    const roundMatches = t.matches.filter(x => x.round === m.round).sort((a, b) => a.matchNumber - b.matchNumber);
    const matchIdx = roundMatches.findIndex(x => x.id === m.id);
    const nextRound = m.round + 1;
    const nextRoundMatches = t.matches.filter(x => x.round === nextRound).sort((a, b) => a.matchNumber - b.matchNumber);
    const ms = matchSize;
    if (nextRoundMatches.length > 0) {
      const nextMatchIdx = Math.floor(matchIdx / ms);
      const slotIdx = matchIdx % ms;
      const nextMatch = nextRoundMatches[nextMatchIdx];
      if (nextMatch) {
        while (nextMatch.players.length <= slotIdx) nextMatch.players.push('TBD');
        nextMatch.players[slotIdx] = advWinner;
        nextMatch.player1 = nextMatch.players[0] || 'TBD';
        nextMatch.player2 = nextMatch.players[1] || 'TBD';
      }
    }
    // Auto-finish if final done
    const lastRound = Math.max(...t.matches.map(x => x.round));
    const finalMatches = t.matches.filter(x => x.round === lastRound);
    if (finalMatches.length > 0 && finalMatches.every(x => x.isCompleted)) {
      t.status = 'Completed';
      t.winner = finalMatches[finalMatches.length - 1].winner;
    }
  }

  // Update league standings
  if (t.type === 'League') {
    activePlayers.forEach(p => {
      const ps = t.standings.find(s => s.playerName === p);
      if (!ps) return;
      ps.played++;
      const myScore = m.scores[p] ?? 0;
      ps.goalsFor = (ps.goalsFor || 0) + myScore;
      const others = activePlayers.filter(x => x !== p);
      const maxOther = Math.max(...others.map(x => m.scores[x] ?? 0));
      ps.goalsAgainst = (ps.goalsAgainst || 0) + maxOther;
      if (m.winner === p) ps.wins++;
      else if (m.winner === 'Remis') ps.draws++;
      else ps.losses++;
    });
  }
}

// ─── Events ──────────────────────────────────
export async function getEventsAsync(userId) {
  await delay(100);
  return store.events.filter(e => e.creatorId === userId);
}

export async function createEventAsync(userId, name, description, location, eventDate, startTime, endTime, plannedGames) {
  await delay(200);
  const evt = {
    id: uuid(), name, description, location,
    eventDate: new Date(eventDate).toISOString(),
    startTime, endTime, plannedGames, status: 'Planned',
    creatorId: userId, attendees: [], createdAt: new Date().toISOString(),
  };
  store.events.push(evt);
  return evt;
}

export async function deleteEventAsync(id, userId) {
  await delay(100);
  store.events = store.events.filter(e => !(e.id === id && e.creatorId === userId));
}

export async function updateEventStatusAsync(id, status) {
  await delay(100);
  const e = store.events.find(e => e.id === id);
  if (e) e.status = status;
}

export async function addAttendeeAsync(eventId, name, linkedUserId) {
  await delay(100);
  const e = store.events.find(ev => ev.id === eventId);
  if (!e) return;
  let ownedGames = [];
  if (linkedUserId) {
    ownedGames = store.boardGames.filter(g => g.owner === linkedUserId).map(g => g.title);
  }
  e.attendees.push({ id: uuid(), name, linkedUserId: linkedUserId || null, ownedGames, status: 'Pending', respondedAt: new Date().toISOString() });
}

export async function updateAttendeeStatusAsync(eventId, attendeeId, status) {
  await delay(100);
  const e = store.events.find(e => e.id === eventId);
  if (e) {
    const a = e.attendees.find(a => a.id === attendeeId);
    if (a) a.status = status;
  }
}

// ─── Community / Players ─────────────────────
export async function getPlayersAsync(userId) {
  await delay(100);
  const players = store.players.filter(p => p.creatorId === userId);
  // Auto-refresh owned games for players linked to a registered user account
  players.forEach(p => {
    if (p.linkedUserId) {
      p.ownedGames = store.boardGames.filter(g => g.owner === p.linkedUserId).map(g => g.title);
    }
  });
  return players;
}

export async function addPlayerAsync(userId, nickname, fullName, ownedGames, favoriteGames) {
  await delay(200);
  const player = {
    id: uuid(), nickname, fullName,
    ownedGames: ownedGames.split(',').map(s => s.trim()).filter(Boolean),
    favoriteGames: favoriteGames.split(',').map(s => s.trim()).filter(Boolean),
    creatorId: userId,
    stats: { gamesPlayed: 0, tournamentsWon: 0, eventsAttended: 0 },
    avatarInitials: (nickname[0] || '?').toUpperCase(),
  };
  store.players.push(player);
  return player;
}

export async function deletePlayerAsync(id, userId) {
  await delay(100);
  store.players = store.players.filter(p => !(p.id === id && p.creatorId === userId));
}

export async function getAllExchangeOffersAsync(userId) {
  await delay(100);
  return store.exchanges.filter(e => e.creatorId === userId);
}

export async function createExchangeAsync(userId, playerId, gameOffered, gameWanted) {
  await delay(100);
  const ex = { id: uuid(), playerId, gameOffered, gameWanted, creatorId: userId };
  store.exchanges.push(ex);
  return ex;
}

export async function searchUsersAsync(query, currentUserId) {
  await delay(200);
  return store.users.filter(u => u.id !== currentUserId && (
    u.displayName.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  ));
}

// ─── Global player search ────────────────────
export async function searchPlayersGlobalAsync(query) {
  await delay(100);
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  // Search community players (by nickname or fullName)
  const communityMatches = store.players.filter(p =>
    p.nickname.toLowerCase().includes(q) ||
    (p.fullName && p.fullName.toLowerCase().includes(q))
  );
  // Also search registered users (by displayName) and return them as pseudo-players
  const userMatches = store.users
    .filter(u => u.displayName && u.displayName.toLowerCase().includes(q))
    .filter(u => !communityMatches.find(p => p.creatorId === u.id)) // avoid duplicates
    .map(u => ({
      id: 'user-' + u.id,
      nickname: u.displayName,
      fullName: u.fullName || u.email,
      ownedGames: store.boardGames.filter(g => g.owner === u.id).map(g => g.title),
      favoriteGames: [],
      avatarInitials: (u.displayName[0] || '?').toUpperCase(),
      creatorId: u.id,
      isUser: true,
      stats: { gamesPlayed: 0, tournamentsWon: 0, eventsAttended: 0 },
    }));
  return [...communityMatches, ...userMatches];
}

// ─── Pooled games for tournament players ─────
export async function getPooledGamesAsync(playerIdsOrObjects) {
  await delay(100);
  const gameCount = {};
  playerIdsOrObjects.forEach(item => {
    let games = [];
    if (typeof item === 'string') {
      // it's an id
      const player = store.players.find(p => p.id === item);
      if (player) {
        // auto-refresh if linked
        if (player.linkedUserId) {
          player.ownedGames = store.boardGames.filter(g => g.owner === player.linkedUserId).map(g => g.title);
        }
        games = player.ownedGames || [];
      }
    } else if (item && Array.isArray(item.ownedGames)) {
      // player object passed directly
      games = item.ownedGames;
    }
    games.forEach(title => {
      gameCount[title] = (gameCount[title] || 0) + 1;
    });
  });
  return Object.entries(gameCount)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count);
}

// helper
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ��� Board Games ������������������������������
export async function getBoardGamesAsync(userId) {
  await delay(100);
  return store.boardGames.filter(g => g.owner === userId);
}

export async function addBoardGameAsync(userId, title, description, minPlayers, maxPlayers, durationMin, complexity, status, coverColor) {
  await delay(200);
  const game = {
    id: uuid(), title, description,
    minPlayers: Number(minPlayers) || 2,
    maxPlayers: Number(maxPlayers) || 4,
    durationMin: Number(durationMin) || 60,
    complexity: complexity || 'Medium',
    status: status || 'Available',
    coverColor: coverColor || '#6C3483',
    owner: userId,
  };
  store.boardGames.push(game);
  return game;
}

export async function updateBoardGameAsync(id, title, description, minPlayers, maxPlayers, durationMin, complexity, status, coverColor) {
  await delay(200);
  const g = store.boardGames.find(g => g.id === id);
  if (g) {
    g.title = title; g.description = description;
    g.minPlayers = Number(minPlayers) || g.minPlayers;
    g.maxPlayers = Number(maxPlayers) || g.maxPlayers;
    g.durationMin = Number(durationMin) || g.durationMin;
    g.complexity = complexity || g.complexity;
    g.status = status || g.status;
    if (coverColor) g.coverColor = coverColor;
  }
  return g;
}

export async function deleteBoardGameAsync(id) {
  await delay(100);
  store.boardGames = store.boardGames.filter(g => g.id !== id);
}

// ─── Friends ─────────────────────────────────
export async function sendFriendRequestAsync(fromUserId, toUserId) {
  await delay(100);
  if (fromUserId === toUserId) return { error: 'Nie możesz dodać siebie.' };
  const already = store.friendRequests.find(r =>
    (r.from === fromUserId && r.to === toUserId) ||
    (r.from === toUserId && r.to === fromUserId)
  );
  if (already) return { error: 'Zaproszenie już zostało wysłane.' };
  const isFriend = store.friends.find(f =>
    (f.user1 === fromUserId && f.user2 === toUserId) ||
    (f.user1 === toUserId && f.user2 === fromUserId)
  );
  if (isFriend) return { error: 'Jesteście już znajomymi.' };
  store.friendRequests.push({ id: uuid(), from: fromUserId, to: toUserId, createdAt: new Date().toISOString() });
  return { error: null };
}

export async function getFriendRequestsAsync(userId) {
  await delay(100);
  return store.friendRequests.filter(r => r.to === userId).map(r => {
    const fromUser = store.users.find(u => u.id === r.from);
    return { ...r, fromDisplayName: fromUser?.displayName || r.from };
  });
}

export async function acceptFriendRequestAsync(requestId, userId) {
  await delay(100);
  const req = store.friendRequests.find(r => r.id === requestId && r.to === userId);
  if (!req) return { error: 'Nie znaleziono zaproszenia.' };
  store.friendRequests = store.friendRequests.filter(r => r.id !== requestId);
  store.friends.push({ id: uuid(), user1: req.from, user2: req.to });
  return { error: null };
}

export async function rejectFriendRequestAsync(requestId, userId) {
  await delay(100);
  store.friendRequests = store.friendRequests.filter(r => !(r.id === requestId && r.to === userId));
  return { error: null };
}

export async function getFriendsAsync(userId) {
  await delay(100);
  return store.friends
    .filter(f => f.user1 === userId || f.user2 === userId)
    .map(f => {
      const otherId = f.user1 === userId ? f.user2 : f.user1;
      const other = store.users.find(u => u.id === otherId);
      return { friendshipId: f.id, userId: otherId, displayName: other?.displayName || otherId };
    });
}

export async function getFriendshipStatusAsync(fromUserId, toUserId) {
  await delay(50);
  const isFriend = store.friends.find(f =>
    (f.user1 === fromUserId && f.user2 === toUserId) ||
    (f.user1 === toUserId && f.user2 === fromUserId)
  );
  if (isFriend) return 'friends';
  const pending = store.friendRequests.find(r =>
    (r.from === fromUserId && r.to === toUserId)
  );
  if (pending) return 'pending_sent';
  const incoming = store.friendRequests.find(r =>
    (r.from === toUserId && r.to === fromUserId)
  );
  if (incoming) return 'pending_received';
  return 'none';
}

// Add a registered user (friend) as a community player for the current user
export async function addPlayerFromUserAsync(currentUserId, targetUserId) {
  await delay(100);
  const target = store.users.find(u => u.id === targetUserId);
  if (!target) return { error: 'Nie znaleziono użytkownika.' };
  const alreadyExists = store.players.find(p => p.creatorId === currentUserId && p.linkedUserId === targetUserId);
  if (alreadyExists) return { error: 'Ten gracz jest już na Twojej liście.', player: alreadyExists };
  const games = store.boardGames.filter(g => g.owner === targetUserId).map(g => g.title);
  const player = {
    id: uuid(),
    nickname: target.displayName,
    fullName: target.fullName || target.displayName,
    ownedGames: games,
    favoriteGames: [],
    avatarInitials: (target.displayName[0] || '?').toUpperCase(),
    creatorId: currentUserId,
    linkedUserId: targetUserId,
    stats: { gamesPlayed: 0, tournamentsWon: 0, eventsAttended: 0 },
  };
  store.players.push(player);
  return { error: null, player };
}

// ��� Drawing ����������������������������������
export async function createDrawingAsync(userId, numberOfPlayers, weighting) {
  await delay(200);
  let available = store.boardGames.filter(g => g.owner === userId && g.status === 'Available' && g.maxPlayers >= numberOfPlayers);
  if (weighting === 'Favor Quick Games' || weighting === 'Preferuj krótkie') available.sort((a, b) => a.durationMin - b.durationMin);
  else if (weighting === 'Favor Long Games' || weighting === 'Preferuj długie') available.sort((a, b) => b.durationMin - a.durationMin);
  else available = [...available].sort(() => Math.random() - 0.5);
  return available.map((g, i) => ({
    number: i + 1,
    title: g.title,
    description: g.description || '',
    duration: g.durationMin,
    minPlayers: g.minPlayers,
    maxPlayers: g.maxPlayers,
    complexity: g.complexity,
    coverColor: g.coverColor || '#6C3483',
  }));
}
