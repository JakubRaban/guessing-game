export const CLIENT_SENT_EVENTS = {
  JOIN_GAME: 'join game',
  SET_NAME: 'set name',
  START_GAME: 'start game',
  GAME_START_GET_ORDERED_PLAYERS: 'get ordered players',
  ASSIGN_PUZZLE: 'assign puzzle',
  TAKE_TURN: 'take turn',
  CAST_VOTE: 'cast vote',
  DETERMINE_TENTATIVE_VOTE_RESULT: 'determine tentative vote result',
}

export const SERVER_SENT_EVENTS = {
  ERROR_JOINING_GAME: 'error joining game',
  PLAYER_LIST_UPDATED: 'player list updated',
  GAME_STARTED: 'game started',
  GAME_START_PLAYERS_ORDERED: 'players ordered',
  PUZZLE_ASSIGNED: 'puzzle assigned',
  PUZZLE_SELF_ASSIGNED: 'puzzle self assigned',
  TURN_TAKEN: 'turn taken',
  VOTE_CAST: 'vote cast',
  VOTING_COMPLETED: 'voting completed',
  TENTATIVE_VOTE_RESULT_DETERMINED: 'tentative vote result determined',
}
