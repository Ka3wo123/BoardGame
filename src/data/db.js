// Mock in-memory data store — mirrors the C# Db.I service
import { v4 as uuid } from './uuid';

const store = {
  users: [
    { id: 'user-1', email: 'demo@example.com', passwordHash: 'demo123', displayName: 'Demo User', createdAt: new Date().toISOString() }
  ],
  tournaments: [],
  events: [],
  players: [],
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

export async function registerAsync(email, password, displayName) {
  await delay(300);
  if (store.users.find(u => u.email === email)) return { user: null, error: 'Email już jest używany.' };
  const user = { id: uuid(), email, passwordHash: password, displayName, createdAt: new Date().toISOString() };
  store.users.push(user);
  return { user, error: null };
}

// ─── Tournaments ─────────────────────────────
export async function getTournamentsAsync(userId) {
  await delay(100);
  return store.tournaments.filter(t => t.creatorId === userId);
}

export async function createTournamentAsync(userId, name, gameTitle, type, players, creatorName) {
  await delay(200);
  const playerArray = Array.isArray(players)
    ? players
    : players.split(',').map(s => s.trim()).filter(Boolean);
  const t = {
    id: uuid(), name, gameTitle, type,
    status: 'Planned', creatorId: userId,
    players: playerArray.map(p => ({ name: p })),
    matches: [], standings: [],
    createdAt: new Date().toISOString(),
  };
  store.tournaments.push(t);
  return t;
}

export async function deleteTournamentAsync(id, userId) {
  await delay(100);
  store.tournaments = store.tournaments.filter(t => !(t.id === id && t.creatorId === userId));
}

export async function generateBracketAsync(tournamentId) {
  await delay(200);
  const t = store.tournaments.find(t => t.id === tournamentId);
  if (!t) return;
  const players = [...t.players.map(p => p.name)];
  t.matches = [];
  t.status = 'InProgress';

  if (t.type === 'Cup') {
    let matchNum = 1;
    for (let i = 0; i < players.length - 1; i += 2) {
      t.matches.push({
        id: uuid(), round: 1, matchNumber: matchNum++,
        player1: players[i], player2: players[i + 1] || 'BYE',
        scorePlayer1: 0, scorePlayer2: 0, isCompleted: false,
      });
    }
  } else {
    // League: round robin
    let matchNum = 1;
    let round = 1;
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        t.matches.push({
          id: uuid(), round, matchNumber: matchNum++,
          player1: players[i], player2: players[j],
          scorePlayer1: 0, scorePlayer2: 0, isCompleted: false,
        });
        if (matchNum % 3 === 0) round++;
      }
    }
    // Init standings
    t.standings = players.map(p => ({ playerName: p, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 }));
  }
  return t;
}

export async function completeMatchAsync(tournamentId, matchId, score1, score2) {
  await delay(100);
  const t = store.tournaments.find(t => t.id === tournamentId);
  if (!t) return;
  const m = t.matches.find(m => m.id === matchId);
  if (!m) return;
  m.scorePlayer1 = score1;
  m.scorePlayer2 = score2;
  m.isCompleted = true;
  m.winner = score1 > score2 ? m.player1 : score2 > score1 ? m.player2 : 'Remis';

  // Update league standings
  if (t.type === 'League') {
    const s1 = t.standings.find(s => s.playerName === m.player1);
    const s2 = t.standings.find(s => s.playerName === m.player2);
    if (s1 && s2) {
      s1.played++; s2.played++;
      s1.goalsFor += score1; s1.goalsAgainst += score2;
      s2.goalsFor += score2; s2.goalsAgainst += score1;
      if (score1 > score2) { s1.wins++; s2.losses++; }
      else if (score2 > score1) { s2.wins++; s1.losses++; }
      else { s1.draws++; s2.draws++; }
    }
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

export async function addAttendeeAsync(eventId, name) {
  await delay(100);
  const e = store.events.find(e => e.id === eventId);
  if (e) e.attendees.push({ id: uuid(), name, status: 'Pending', respondedAt: new Date().toISOString() });
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
  return store.players.filter(p => p.creatorId === userId);
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

// ─── Friends ─────────────────────────────────
export async function getFriendsAsync(userId) {
  await delay(100);
  return store.friends.filter(f => f.userId === userId && f.status === 'Accepted');
}

export async function getPendingRequestsAsync(userId) {
  await delay(100);
  return store.friendRequests.filter(r => r.addresseeId === userId && r.status === 'Pending');
}

export async function sendFriendRequestAsync(userId, email, displayName) {
  await delay(200);
  const target = store.users.find(u => u.email === email);
  if (!target) return 'Nie znaleziono użytkownika o tym adresie e-mail.';
  if (target.id === userId) return 'Nie możesz zaprosić samego siebie.';
  store.friendRequests.push({ id: uuid(), requesterId: userId, addresseeId: target.id, requesterName: displayName, status: 'Pending' });
  return null;
}

export async function respondToFriendRequestAsync(requesterId, addresseeId, accept) {
  await delay(100);
  const req = store.friendRequests.find(r => r.requesterId === requesterId && r.addresseeId === addresseeId);
  if (req) {
    req.status = accept ? 'Accepted' : 'Declined';
    if (accept) {
      store.friends.push({ id: uuid(), userId: addresseeId, friendId: requesterId, friendName: req.requesterName, status: 'Accepted' });
    }
  }
}

export async function removeFriendAsync(userId, friendId) {
  await delay(100);
  store.friends = store.friends.filter(f => !(f.userId === userId && f.friendId === friendId));
}

export async function searchUsersAsync(query, currentUserId) {
  await delay(200);
  return store.users.filter(u => u.id !== currentUserId && (
    u.displayName.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  ));
}

// helper
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
