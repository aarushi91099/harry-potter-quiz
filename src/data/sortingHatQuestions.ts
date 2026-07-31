import type { SortingQuestion } from './types';

/** Personality question bank for the Sorting Hat Quiz: 5 are drawn at random per session. */
export const sortingHatQuestions: SortingQuestion[] = [
  {
    id: 'sq-late-night-choice',
    prompt: "It's midnight and you can't sleep. What are you most likely doing?",
    options: [
      { id: 'a', text: 'Sneaking out to explore somewhere off-limits', house: 'Gryffindor' },
      { id: 'b', text: 'Reading until the idea keeping you up makes sense', house: 'Ravenclaw' },
      { id: 'c', text: 'Checking in on a friend who seemed off today', house: 'Hufflepuff' },
      { id: 'd', text: 'Planning your next move for tomorrow', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-prized-possession',
    prompt: 'Which would you be most reluctant to give up?',
    options: [
      { id: 'a', text: 'Your nerve', house: 'Gryffindor' },
      { id: 'b', text: 'Your curiosity', house: 'Ravenclaw' },
      { id: 'c', text: 'Your loyalty to your friends', house: 'Hufflepuff' },
      { id: 'd', text: 'Your ambition', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-friend-conflict',
    prompt: 'A close friend does something you strongly disagree with. What do you do?',
    options: [
      { id: 'a', text: 'Confront them about it immediately, face to face', house: 'Gryffindor' },
      { id: 'b', text: 'Try to understand their reasoning before judging', house: 'Ravenclaw' },
      { id: 'c', text: 'Give them space, but stand by them regardless', house: 'Hufflepuff' },
      { id: 'd', text: 'Quietly decide how it changes what you can rely on them for', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-graduation-legacy',
    prompt: "What would you most want people to say about you after you're gone?",
    options: [
      { id: 'a', text: '"They were never afraid of anything."', house: 'Gryffindor' },
      { id: 'b', text: '"They understood things no one else could figure out."', house: 'Ravenclaw' },
      { id: 'c', text: '"They were always there when it mattered."', house: 'Hufflepuff' },
      { id: 'd', text: '"They got exactly what they set out to get."', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-first-day',
    prompt: "It's your first day somewhere completely new. What do you do?",
    options: [
      { id: 'a', text: 'Jump into the first interesting thing that happens', house: 'Gryffindor' },
      { id: 'b', text: 'Quietly map out how everything works before acting', house: 'Ravenclaw' },
      { id: 'c', text: 'Look for someone who seems like they need a friend', house: 'Hufflepuff' },
      { id: 'd', text: 'Figure out who matters and introduce yourself to them', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-hidden-door',
    prompt: 'You find a locked door that clearly shouldn\'t be locked. What do you do?',
    options: [
      { id: 'a', text: 'Force it open and deal with the consequences later', house: 'Gryffindor' },
      { id: 'b', text: 'Study the lock until you understand exactly how it works', house: 'Ravenclaw' },
      { id: 'c', text: 'Leave it alone unless someone actually needs you to open it', house: 'Hufflepuff' },
      { id: 'd', text: 'Find out who has the key and what they want for it', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-under-pressure',
    prompt: 'Something goes wrong at the worst possible moment. How do you react?',
    options: [
      { id: 'a', text: 'Act first, worry about the plan later', house: 'Gryffindor' },
      { id: 'b', text: 'Pause and think through every option before moving', house: 'Ravenclaw' },
      { id: 'c', text: 'Make sure everyone around you is okay first', house: 'Hufflepuff' },
      { id: 'd', text: 'Calmly look for the option that costs you the least', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-ideal-weekend',
    prompt: 'Your ideal free weekend looks like:',
    options: [
      { id: 'a', text: 'Doing something a little reckless, just for the thrill', house: 'Gryffindor' },
      { id: 'b', text: 'Going deep on a topic that fascinates you', house: 'Ravenclaw' },
      { id: 'c', text: 'Spending unhurried time with people you love', house: 'Hufflepuff' },
      { id: 'd', text: 'Working on a plan that gets you closer to a big goal', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-unfair-rule',
    prompt: 'You realize a rule everyone follows is actually unfair. What do you do?',
    options: [
      { id: 'a', text: 'Break it openly to prove a point', house: 'Gryffindor' },
      { id: 'b', text: 'Research exactly why it exists before deciding what to do', house: 'Ravenclaw' },
      { id: 'c', text: "Quietly help anyone it's hurting the most", house: 'Hufflepuff' },
      { id: 'd', text: 'Work out how to change it through the people who can', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-biggest-fear',
    prompt: 'Which of these would bother you most?',
    options: [
      { id: 'a', text: 'Being too afraid to act when it counted', house: 'Gryffindor' },
      { id: 'b', text: 'Never understanding something you desperately wanted to know', house: 'Ravenclaw' },
      { id: 'c', text: 'Letting someone you care about down', house: 'Hufflepuff' },
      { id: 'd', text: 'Wasting your potential', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-group-role',
    prompt: 'In a group project, you naturally end up:',
    options: [
      { id: 'a', text: 'Volunteering for the riskiest, hardest part', house: 'Gryffindor' },
      { id: 'b', text: 'Fact-checking and refining everyone else\'s ideas', house: 'Ravenclaw' },
      { id: 'c', text: 'Making sure nobody gets left out or overworked', house: 'Hufflepuff' },
      { id: 'd', text: 'Steering the group toward the strongest possible outcome', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-magical-object',
    prompt: 'If you could have one magical object, you\'d pick:',
    options: [
      { id: 'a', text: 'A sword that never loses a fight worth fighting', house: 'Gryffindor' },
      { id: 'b', text: 'A book that answers any question truthfully', house: 'Ravenclaw' },
      { id: 'c', text: 'A mirror that shows you how to help the people you love', house: 'Hufflepuff' },
      { id: 'd', text: 'A ring that opens any door you need opened', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-after-failure',
    prompt: 'You just failed at something you really cared about. What happens next?',
    options: [
      { id: 'a', text: 'You try again immediately, louder and bolder than before', house: 'Gryffindor' },
      { id: 'b', text: 'You analyze exactly what went wrong before trying again', house: 'Ravenclaw' },
      { id: 'c', text: 'You lean on the people close to you to get back up', house: 'Hufflepuff' },
      { id: 'd', text: 'You quietly rebuild a smarter plan for next time', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-what-motivates',
    prompt: 'What gets you out of bed to work hard on something?',
    options: [
      { id: 'a', text: 'A cause worth being brave for', house: 'Gryffindor' },
      { id: 'b', text: 'A question you can\'t stop thinking about', house: 'Ravenclaw' },
      { id: 'c', text: 'People who are counting on you', house: 'Hufflepuff' },
      { id: 'd', text: 'A goal you\'re determined to reach', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-stranger-help',
    prompt: 'A stranger asks you for help with something risky. What do you do?',
    options: [
      { id: 'a', text: 'Say yes before you\'ve even heard the full story', house: 'Gryffindor' },
      { id: 'b', text: 'Ask enough questions to understand what you\'re getting into', house: 'Ravenclaw' },
      { id: 'c', text: 'Help because they clearly need it, no questions asked', house: 'Hufflepuff' },
      { id: 'd', text: 'Weigh what it costs you against what you\'d get in return', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-animal-companion',
    prompt: 'Which companion would you choose to have by your side?',
    options: [
      { id: 'a', text: 'A lion, fierce and fearless', house: 'Gryffindor' },
      { id: 'b', text: 'An eagle, sharp-eyed and wise', house: 'Ravenclaw' },
      { id: 'c', text: 'A badger, steady and unshakably loyal', house: 'Hufflepuff' },
      { id: 'd', text: 'A snake, clever and impossible to corner', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-locked-puzzle',
    prompt: 'You\'re stuck on a puzzle that\'s taken you hours. What do you do?',
    options: [
      { id: 'a', text: 'Try something drastic that might just work', house: 'Gryffindor' },
      { id: 'b', text: 'Keep at it methodically until the answer clicks', house: 'Ravenclaw' },
      { id: 'c', text: 'Ask a friend to work through it with you', house: 'Hufflepuff' },
      { id: 'd', text: 'Look for a shortcut nobody else has thought of', house: 'Slytherin' },
    ],
  },
  {
    id: 'sq-define-success',
    prompt: 'You\'d consider your life a success if:',
    options: [
      { id: 'a', text: 'You never backed down from something that mattered', house: 'Gryffindor' },
      { id: 'b', text: 'You genuinely understood the world a little better than most', house: 'Ravenclaw' },
      { id: 'c', text: 'The people around you were better off for knowing you', house: 'Hufflepuff' },
      { id: 'd', text: 'You became exactly who you set out to become', house: 'Slytherin' },
    ],
  },
];
