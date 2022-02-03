# Guessing game
An implementation of a party game in which players stick post-its with a name of some character (real or not) on each other's foreheads and then take turns trying to guess who they are by asking simple yes/no questions.

The following features are expected to be implemented for an MVP:
1. ✅ User creates a game with an unique URL which can be joined by other players by just pasting it to their address bar
2. The creator of the game sets the settings of the game:
  - (❌ To be removed and set to a constant, rational value, like 10) Max number of players able to join the game
  - When should the game finish:
    - when a first player wins
    - when all but last player win (so positions are known)
    - when all players finish
  - Whether players should be able to see the history of their questions and their vote results
  - Whether the game is public or not. Public games would then appear at some page under "join a public game" menu button. Public games would need an obligatory topic description (e.g. "American politicians", "Marvel movie characters" etc.) so that others can decide whether to join the game. No enforcement of whether a character matches the category is made though.
3. ✅ Players set their names after joining the game. The game can be started by any of them after there are min. 2 players, all of whom have set their name
4. ✅ After the game is started, the order of players is randomized and they assign a character to a player next to them (for example, if there are 4 players, the order of assignment is 1→2, 2→3, 3→4, 4→1)
5. ✅ Optionally along with a character a player can provide a link to a webpage describing this character, so that every player can know more about it. If it is provided, then the name of the character appears as a link during the game
6. ✅ The game starts when all the players assign a character
7. ✅ Players take turns. Each turn means either asking a question which brings a player closer to the guess or making a guess if the player believes they know the character
8. ✅ After a question/guess is made, voting phase begins with all other players being able to choose among Yes/No/Don't know/Needs discussion options as their vote
9. Only the yes/no options are available when voting on a guess
10. After all players vote, the results are displayed:
  - If there is at least one "needs discussion" vote or the vote is not unanimous, the player who asked the question is prompted to either accept the majority option as the answer or discuss it in a simple chat
  - Otherwise if the vote is unanimous, the voted option is automatically considered as the answer to the question
  - For the purpose of the two rules above, voting is considered "unanimous" without taking "Don't know" votes into account. For example, if there are two "yes" and three "don't know" votes, the voting is unanimous for "yes". On the other hand, if everyone votes "Don't know", then it's automatically considered as an answer and the game proceeds to the next turn
11. When the player makes a guess and it is equal to their character, the voting is skipped and the game is finished for this player. On the other hand, if it's not, the voting takes place anyway (considering for example that the player's character may be a singer known under a nickname but player answers with their full name, the other players may still vote to accept this answer)
12. For the voting on a guess to succeed, the "Yes" option must have a clear majority over "No" votes. So 3-2 result passes but 3-3 does not
13. The game continues until the condition for finishing the game selected during its setup is met
14. After the game is finished a summary screen is displayed. It shows players with their characters and standings, including number of turns needed for them come to a guess
15. As convenient, old games can be either removed automatically by a cron-like process or manually
