import { Scene } from './types';

export const STORY_DATA: Record<string, Scene> = {
  intro: {
    id: 'intro',
    narration: "Rain hits the streets of Neon City. It never stops. Another body, another night. You zip your coat and stare at the flashing lights. Someone calls it a 'glitch' again. You know it's murder.",
    imageUrl: './assets/intro.mp4',
    choices: [
      { text: "Inspect the body", next: "inspect_body", effect: { logic: 1 } },
      { text: "Talk to the officer", next: "talk_officer", effect: { charisma: 1 } },
      { text: "Check the dark alley", next: "check_alleyway", effect: { intuition: 1 } }
    ],
    checkpoint: true
  },
signs_struggle: {
  id: 'signs_struggle',
  narration:
    "You scan the wet pavement under the flashing police lights. There are drag marks in the dirt — someone fought hard here. A broken lens from a cyber-eye lies nearby, still glowing faint blue. The marks lead to a nearby dumpster, and you spot a torn piece of a synthetic jacket. Whoever did this left in a hurry.",
  imageUrl: './assets/signs_struggle.mp4',
  choices: [
    { text: "Check the dumpster", next: "dumpster_search", effect: { logic: 1 } },
    { text: "Collect the broken lens", next: "collect_lens", effect: { intuition: 1 } },
    { text: "Report findings to the officer", next: "talk_officer", effect: { charisma: 1 } }
  ]
},
  inspect_body: {
    id: 'inspect_body',
    narration: "You kneel beside the victim. A young man, maybe twenty. His neural chip is burnt out. You find a matchbook in his coat pocket — 'The Neon Lotus'.",
    imageUrl: './assets/inspect-body.mp4',
    choices: [
      { text: "Take the neural chip", next: "extract_chip", requirement: { stat: 'logic', value: 1 }, effect: { logic: 1 } },
      { text: "Search for clues", next: "signs_struggle", effect: { intuition: 1 } },
      { text: "Go to The Neon Lotus", next: "neon_lotus_entry" }
    ]
  },

  talk_officer: {
    id: 'talk_officer',
    narration: "Officer Vance chews a stim-stick. 'No ID. Looks like another tech burnout.' He avoids your eyes. He knows more than he’s saying.",
    imageUrl: './assets/talk-officer.mp4',
    choices: [
      { text: "Ask for details", next: "pressure_officer", effect: { charisma: 1 } },
      { text: "Offer a bribe", next: "bribe_officer", effect: { reputation: -1 } },
      { text: "Ask about similar cases", next: "similar_cases", effect: { intuition: 1 } }
    ]
  },

  check_alleyway: {
    id: 'check_alleyway',
    narration: "The alley smells like rust and rain. You hear a metal sound. A shadow moves — eyes glowing faint amber.",
    imageUrl: './assets/intro.mp4',
    choices: [
      { text: "Call out", next: "identify_self", effect: { charisma: 1 } },
      { text: "Pull your weapon", next: "draw_weapon", effect: { reputation: -1 } },
      { text: "Sneak closer", next: "sneak_closer", requirement: { stat: 'intuition', value: 1 } }
    ]
  },

  extract_chip: {
    id: 'extract_chip',
    narration: "You pull the burnt chip from his neck. It’s military tech. A woman steps from the dark. Long coat. Gun ready. 'Looking for this?' she says.",
    imageUrl: './assets/extract-chip.mp4',
    choices: [
      { text: "Talk calmly", next: "talk_to_mystery_woman", effect: { charisma: 1 } },
      { text: "Hand over the chip", next: "hand_over_chip", effect: { reputation: -2 } },
      { text: "Run away", next: "chase_sequence" }
    ]
  },

  talk_to_mystery_woman: {
    id: 'talk_to_mystery_woman',
    narration: "She lowers her weapon slightly. 'You have no idea what you're holding, detective. Walk away before it kills you too.'",
    imageUrl: './assets/intro.mp4',
    choices: [
      { text: "Ask who she is", next: "woman_identity", effect: { charisma: 1 } },
      { text: "Ignore her and keep the chip", next: "chase_sequence", effect: { reputation: -1 } }
    ]
  },

  woman_identity: {
    id: 'woman_identity',
    narration: "She sighs. 'Name’s Nyx. Used to work for NC Corp. That chip holds their darkest secret.' She vanishes before you can ask more.",
    imageUrl: './assets/intro.mp4',
    choices: [
      { text: "Go to HQ to analyze chip", next: "hq_lab", effect: { logic: 1 } },
      { text: "Head to The Neon Lotus", next: "neon_lotus_entry" }
    ]
  },

  neon_lotus_entry: {
    id: 'neon_lotus_entry',
    narration: "The Neon Lotus glows pink and gold. A bouncer blocks your way. 'Invites only, detective. You don’t look rich enough.'",
    imageUrl: './assets/neon_lotus_entry.mp4',
    choices: [
      { text: "Flash your badge", next: "lotus_inside", requirement: { stat: 'reputation', value: 1 } },
      { text: "Bribe your way in", next: "lotus_inside", effect: { reputation: -1 } },
      { text: "Find the back door", next: "lotus_backdoor", effect: { intuition: 1 } }
    ]
  },

  lotus_inside: {
    id: 'lotus_inside',
    narration: "Inside, lights shimmer. Rich people laugh over fake drinks. You spot Marcus Vane — NC Corp’s CEO — in a private booth.",
    imageUrl: './assets/intro.mp4',
    choices: [
      { text: "Talk to Vane", next: "confront_vane", requirement: { stat: 'charisma', value: 2 } },
      { text: "Spy on him", next: "observe_vane", effect: { intuition: 1 } },
      { text: "Hack his terminal", next: "vane_terminal", requirement: { stat: 'logic', value: 2 } }
    ]
  },

  lotus_backdoor: {
    id: 'lotus_backdoor',
    narration: "The alley behind the club is quiet. You spot a vent leading inside. A security drone floats nearby.",
    imageUrl: './assets/intro.mp4',
    choices: [
      { text: "Hack the drone", next: "vane_terminal", requirement: { stat: 'logic', value: 1 } },
      { text: "Sneak past it", next: "lotus_inside", effect: { intuition: 1 } }
    ]
  },

  chase_sequence: {
    id: 'chase_sequence',
    narration: "You run. Footsteps follow. You duck under a neon sign and slide into an air vent. 'You can’t hide forever, detective!' echoes behind you.",
    imageUrl: './assets/intro.mp4',
    choices: [
      { text: "Stay hidden", next: "stay_hidden", effect: { intuition: 1 } },
      { text: "Attack from ambush", next: "surprise_attack", effect: { logic: 1 } },
      { text: "Call for help", next: "call_backup", requirement: { stat: 'reputation', value: 2 } }
    ]
  },

  stay_hidden: {
    id: 'stay_hidden',
    narration: "They leave. Silence returns. You still have the chip — and more questions than answers.",
    imageUrl: './assets/intro.mp4',
    choices: [
      { text: "Go to a black-market hacker", next: "meet_decker", effect: { logic: 1 } },
      { text: "Try decrypting it yourself", next: "decrypt_failure" }
    ]
  },

  meet_decker: {
    id: 'meet_decker',
    narration: "Sparky’s workshop hums with old tech. He plugs in the chip. 'This thing can shut down the whole city,' he whispers. Then — a crash. SWAT breaks in.",
    imageUrl: './assets/intro.mp4',
    choices: [
      { text: "Fight back", next: "bad_ending_framed" },
      { text: "Surrender", next: "bad_ending_framed" },
      { text: "Upload the data online", next: "good_ending_solved", requirement: { stat: 'logic', value: 3 } }
    ]
  },

  hq_lab: {
    id: 'hq_lab',
    narration: "At HQ, the tech team scans the chip. The screen flickers — 'PROJECT MIRROR'. It’s encrypted deep. Someone powerful is hiding something.",
    imageUrl: './assets/intro.mp4',
    choices: [
      { text: "Decrypt the chip", next: "decrypt_failure", effect: { logic: 1 } },
      { text: "Call Nyx for help", next: "meet_decker", effect: { intuition: 1 } }
    ]
  },

  decrypt_failure: {
    id: 'decrypt_failure',
    narration: "Your console sparks and dies. The trace is active. Sirens outside. You have to move now.",
    imageUrl: './assets/.mp4decrypt-fail/1200/600',
    choices: [
      { text: "Escape to alley", next: "chase_sequence" }
    ]
  },

  bad_ending_framed: {
    id: 'bad_ending_framed',
    narration: "💀 ENDING: FRAMED FOR MURDER\nThey pinned it on you. The system wins again. Neon City forgets you by morning.",
    imageUrl: './assets/.mp4framed-ending/1200/600',
    choices: [
      { text: "Restart Game", next: "intro" }
    ]
  },

  good_ending_solved: {
    id: 'good_ending_solved',
    narration: "🏆 ENDING: CASE SOLVED\nYou leak the files before they reach you. The truth spreads. The city wakes up. For now, the lights stay on.",
    imageUrl: './assets/.mp4good-ending/1200/600',
    choices: [
      { text: "Play Again", next: "intro" }
    ]
  },
  dumpster_search: {
  id: 'dumpster_search',
  narration:
    "You push the heavy lid open. The smell hits first — chemicals and oil. Under a pile of rags, you find a small black drone with one propeller missing. It looks like a camera drone, but its memory core has been ripped out.",
  imageUrl: 'https://picsum.photos/seed/neon-dumpster/1200/600',
  choices: [
    { text: "Take the drone shell", next: "meet_decker", effect: { logic: 1 } },
    { text: "Leave it and return to the scene", next: "inspect_body" }
  ]
},

collect_lens: {
  id: 'collect_lens',
  narration:
    "You pick up the lens. It flickers, projecting a glitchy feed — someone’s last moments. You see a shadow strike, a flash of blue light, then static. The lens dies in your hand. Someone didn’t want witnesses.",
  imageUrl: 'https://picsum.photos/seed/neon-lens/1200/600',
  choices: [
    { text: "Take it to a tech expert", next: "meet_decker", effect: { logic: 1 } },
    { text: "Keep it as evidence", next: "neon_lotus_entry", effect: { intuition: 1 } }
  ]
},

};
