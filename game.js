(function () {
  "use strict";

  const asset = (name) => `assets/${name}`;
  const $ = (id) => document.getElementById(id);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const roll = (chance) => Math.random() < chance;
  const pick = (items) => items[Math.floor(Math.random() * items.length)];
  const uniq = (items) => Array.from(new Set(items));

  const characterTemplates = [
    {
      id: "mcready",
      name: "MacReady",
      role: "Helicopter pilot",
      portrait: "mcready.png",
      start: "mcready-shack",
      stats: { nerve: 88, warmth: 86, mechanical: 64, medical: 24, social: 46 },
      tools: ["Flamethrower", "Tape recorder"],
      perks: ["Fire discipline", "Moves through outdoor points faster"],
      style: "dry, suspicious, and hard to impress",
      voice: {
        doing: "Keeping the engines and the exits in mind. People forget exits when they panic.",
        thoughts: "Nobody here is clean just because they sound scared.",
        alibi: "I was out by my shack, then the Rec Room. Ask around if you need a choir."
      }
    },
    {
      id: "gary",
      name: "Garry",
      role: "Station commander",
      portrait: "gary.png",
      start: "manager-office",
      stats: { nerve: 64, warmth: 70, mechanical: 36, medical: 26, social: 72 },
      tools: ["Keys", "Service pistol"],
      perks: ["Public orders land harder", "Starts with higher reputation"],
      style: "formal, defensive, command-minded",
      voice: {
        doing: "Trying to keep a chain of responsibility while everyone saws through it.",
        thoughts: "This place needs order before it needs theories.",
        alibi: "Office, corridor, radio check. I do not intend to apologize for doing my job."
      }
    },
    {
      id: "norris",
      name: "Norris",
      role: "Geologist",
      portrait: "norris.png",
      start: "geology-lab",
      stats: { nerve: 42, warmth: 58, mechanical: 48, medical: 34, social: 50 },
      tools: ["Sample labels"],
      perks: ["Reads geology and snow tracks well"],
      style: "soft-spoken, evasive, always measuring the room",
      voice: {
        doing: "Checking specimen notes. Little things get missed when people shout.",
        thoughts: "I think we are all tired enough to make bad evidence look good.",
        alibi: "Geology Lab mostly. I stepped out once, but not long."
      }
    },
    {
      id: "bennings",
      name: "Bennings",
      role: "Meteorologist",
      portrait: "bennings.png",
      start: "common-office",
      stats: { nerve: 54, warmth: 76, mechanical: 42, medical: 22, social: 54 },
      tools: ["Weather log"],
      perks: ["Weather warnings are more accurate"],
      style: "weary, practical, annoyed by nonsense",
      voice: {
        doing: "Watching the pressure drop and pretending that is our main problem.",
        thoughts: "The weather is simple. People are the bad instrument readings.",
        alibi: "Common Office, then the yard for readings. Cold enough to make a man honest."
      }
    },
    {
      id: "knauls",
      name: "Nauls",
      role: "Cook",
      portrait: "knauls.png",
      start: "kitchen",
      stats: { nerve: 70, warmth: 68, mechanical: 44, medical: 20, social: 74 },
      tools: ["Kitchen knife", "Food stores"],
      perks: ["Calms groups in the Kitchen and Mess Hall"],
      style: "quick, stylish, funny until he is not",
      voice: {
        doing: "Trying to feed people who keep accusing the menu of murder.",
        thoughts: "If somebody is acting strange, they better not do it near my knives.",
        alibi: "Kitchen. Mess. Kitchen again. Food does not cook itself."
      }
    },
    {
      id: "childs",
      name: "Childs",
      role: "Mechanic",
      portrait: "childs.png",
      start: "vehicle-building",
      stats: { nerve: 82, warmth: 78, mechanical: 86, medical: 18, social: 36 },
      tools: ["Blowtorch", "Wrench"],
      perks: ["Repairs faster", "Hard to intimidate"],
      style: "blunt, angry, direct",
      voice: {
        doing: "Making sure the machines do not die before we do.",
        thoughts: "Everybody wants answers. I want distance from fools.",
        alibi: "Vehicle Building. If I moved, I moved to get a tool."
      }
    },
    {
      id: "windows",
      name: "Windows",
      role: "Radio operator",
      portrait: "windows.png",
      start: "radio-room",
      stats: { nerve: 38, warmth: 62, mechanical: 58, medical: 20, social: 58 },
      tools: ["Headset", "Radio log"],
      perks: ["Can catch distant noises from the Radio Room"],
      style: "nervous, fast, honest in bursts",
      voice: {
        doing: "Trying to make dead air sound useful.",
        thoughts: "I keep hearing stuff in the walls. Maybe pipes. Maybe not pipes.",
        alibi: "Radio Room. I left when the signal went bad, then came straight back."
      }
    },
    {
      id: "clark",
      name: "Clark",
      role: "Dog handler",
      portrait: "clark.png",
      start: "kennel",
      stats: { nerve: 68, warmth: 82, mechanical: 44, medical: 28, social: 28 },
      tools: ["Dog lead"],
      perks: ["Reads dog behavior", "Less frost exposure near Kennel"],
      style: "quiet, defensive, loyal to the dogs first",
      voice: {
        doing: "Checking the dogs. They know when people are wrong.",
        thoughts: "You want to understand this place, watch what the dogs avoid.",
        alibi: "Kennel. Yard. Kennel. That is not a mystery."
      }
    },
    {
      id: "palmer",
      name: "Palmer",
      role: "Assistant mechanic",
      portrait: "palmer.png",
      start: "vehicle-building",
      stats: { nerve: 60, warmth: 58, mechanical: 72, medical: 16, social: 62 },
      tools: ["Spark plug"],
      perks: ["Finds improvised parts in storage"],
      style: "loose, needling, slippery",
      voice: {
        doing: "Staying useful, man. Useful people get suspected slower.",
        thoughts: "The scary part is how much everybody wants a target.",
        alibi: "Garage, then Rec Room. Maybe Kitchen. Hard to keep a diary in this weather."
      }
    },
    {
      id: "copper",
      name: "Copper",
      role: "Physician",
      portrait: "copper.png",
      start: "infirmary",
      stats: { nerve: 58, warmth: 54, mechanical: 24, medical: 90, social: 60 },
      tools: ["Medical kit"],
      perks: ["Treats frostbite and shock", "Blood tests are safer"],
      style: "clinical, tired, trying to sound rational",
      voice: {
        doing: "Taking inventory of sedatives, bandages, and bad decisions.",
        thoughts: "Fear changes pulse and skin temperature. It also changes testimony.",
        alibi: "Infirmary and Specimen Lab. I was not alone the whole time."
      }
    },
    {
      id: "blair",
      name: "Blair",
      role: "Biologist",
      portrait: "blair.png",
      start: "specimen-lab",
      stats: { nerve: 34, warmth: 48, mechanical: 54, medical: 82, social: 32 },
      tools: ["Microscope notes"],
      perks: ["Understands samples first", "Stress rises fast after discoveries"],
      style: "brilliant, intense, already halfway into the math",
      voice: {
        doing: "Counting probabilities. None of them are kind.",
        thoughts: "If it reaches people, it reaches the world. That is the only thought.",
        alibi: "Specimen Lab. The numbers kept me there longer than was healthy."
      }
    },
    {
      id: "fuchs",
      name: "Fuchs",
      role: "Assistant biologist",
      portrait: "fuchs.png",
      start: "laboratory",
      stats: { nerve: 52, warmth: 56, mechanical: 38, medical: 74, social: 44 },
      tools: ["Research notes"],
      perks: ["Unlocks extra specimen questions earlier"],
      style: "careful, moral, quietly terrified",
      voice: {
        doing: "Cross-checking Blair's notes. I would like them to be wrong.",
        thoughts: "Assume contamination. Assume isolation. Then assume we failed both.",
        alibi: "Lab, Infirmary, back to the Lab. I wrote it down because I knew this would happen."
      }
    }
  ];

  const locations = [
    { id: "vehicle-building", name: "Vehicle Building", type: "indoor", x: 12, y: 12, scene: "base-exterior.png", desc: "Cold metal, snowcat oil, and a few tools that can still save a life.", tags: ["tools", "vehicle"] },
    { id: "shed", name: "Shed", type: "indoor", x: 28, y: 7, scene: "base-exterior.png", desc: "A small outbuilding packed with rope, fuel tins, and reasons to worry.", tags: ["tools", "fuel"] },
    { id: "kennel", name: "Kennel", type: "indoor", x: 11, y: 34, scene: "dog-area.png", desc: "The dogs watch everyone with better instincts than most men.", tags: ["dog", "cold"] },
    { id: "manager-office", name: "Manager's Office", type: "indoor", x: 10, y: 55, scene: "hallway.png", desc: "Keys, rosters, clipped orders, and a desk that suddenly feels too public.", tags: ["records"] },
    { id: "supply-room-1", name: "Supply Room 1", type: "indoor", x: 10, y: 77, scene: "hallway-mirrored.png", desc: "Parka hooks, crates, rope, and canned heat line the shelves.", tags: ["supply", "coat"] },
    { id: "common-office", name: "Common Office", type: "indoor", x: 31, y: 43, scene: "hallway.png", desc: "Paperwork and stale coffee gather under humming lights.", tags: ["records"] },
    { id: "rec-room", name: "Rec Room", type: "indoor", x: 30, y: 70, scene: "recreation-room.png", desc: "The ping-pong table waits under tired lamps while everyone pretends to relax.", tags: ["social"] },
    { id: "kitchen", name: "Kitchen", type: "indoor", x: 45, y: 70, scene: "kitchen.png", desc: "Steam, knives, music, and a door that never stays quiet for long.", tags: ["food", "knife"] },
    { id: "mess-hall", name: "Mess Hall", type: "indoor", x: 55, y: 70, scene: "recreation-room.png", desc: "Long tables make every silence feel like a vote.", tags: ["social"] },
    { id: "sleeping-quarters", name: "Sleeping Quarters", type: "indoor", x: 49, y: 50, scene: "hallway.png", desc: "Bunks and lockers, too many private corners for a public crisis.", tags: ["sleep"] },
    { id: "bathroom", name: "Bathroom", type: "indoor", x: 60, y: 50, scene: "hallway-mirrored.png", desc: "Drains, mirrors, wet tile, and the kind of quiet that makes people hurry.", tags: ["water"] },
    { id: "geology-lab", name: "Geology Lab", type: "indoor", x: 72, y: 50, scene: "laboratory.png", desc: "Core samples and specimen labels make the room feel older than the station.", tags: ["lab", "records"] },
    { id: "infirmary", name: "Infirmary", type: "indoor", x: 65, y: 70, scene: "medical-bay.png", desc: "The medical bay smells like antiseptic, blood, and plastic sheeting.", tags: ["medical", "blood"] },
    { id: "specimen-lab", name: "Specimen Lab", type: "indoor", x: 75, y: 70, scene: "laboratory.png", desc: "Samples wait under lamps. Nothing here feels dead enough.", tags: ["lab", "blood", "test"] },
    { id: "radio-room", name: "Radio Room", type: "indoor", x: 88, y: 48, scene: "radio-room.png", desc: "Dead channels hiss in a room full of switches and bad news.", tags: ["radio", "noise"] },
    { id: "map-room", name: "Map Room", type: "indoor", x: 87, y: 67, scene: "hallway.png", desc: "Maps of white distances make escape look almost mathematical.", tags: ["records", "route"] },
    { id: "supply-room-2", name: "Supply Room 2", type: "indoor", x: 88, y: 85, scene: "hallway-mirrored.png", desc: "Crates and emergency gear are stacked with military neatness.", tags: ["supply", "fuel"] },
    { id: "greenhouse", name: "Greenhouse", type: "indoor", x: 84, y: 28, scene: "hallway.png", desc: "Moist air and living green make the station feel briefly impossible.", tags: ["water", "quiet"] },
    { id: "laundry-room", name: "Laundry Room", type: "indoor", x: 84, y: 9, scene: "hallway-mirrored.png", desc: "Warm pipes rattle behind hanging coats and wet canvas.", tags: ["coat", "water"] },
    { id: "laboratory", name: "Laboratory", type: "indoor", x: 69, y: 82, scene: "laboratory.png", desc: "Microscopes, notebooks, and heat lamps wait for someone brave enough to look.", tags: ["lab", "test"] },
    { id: "main-yard", name: "Main Yard", type: "outdoor", x: 50, y: 91, scene: "base-exterior.png", desc: "Open snow between buildings. Every step is visible until the wind rises.", tags: ["outside"] },
    { id: "helicopter-pad", name: "Helicopter Pad", type: "outdoor", x: 70, y: 88, scene: "base-exterior.png", desc: "The chopper sits half-buried in drift, looking less like escape every hour.", tags: ["outside", "escape"] },
    { id: "mcready-shack", name: "MacReady's Shack", type: "outdoor", x: 94, y: 16, scene: "mcready-shack-exterior.png", desc: "A raised shack with a light that seems too far away from the rest of the base.", tags: ["outside", "shack"] },
    { id: "shack-inside", name: "Inside MacReady's Shack", type: "indoor", x: 96, y: 21, scene: "mcready-shack-inside.png", desc: "A chess computer, a bottle, and one man's private weather system.", tags: ["social", "records"] },
    { id: "tool-shed", name: "Tool Shed", type: "outdoor", x: 26, y: 19, scene: "base-exterior.png", desc: "A short walk from the main building. Too useful to leave unattended.", tags: ["outside", "tools", "fuel"] },
    { id: "kennel-yard", name: "Kennel Yard", type: "outdoor", x: 6, y: 36, scene: "dog-area.png", desc: "The dog run is half shadow, half blowing snow.", tags: ["outside", "dog"] },
    { id: "vehicle-yard", name: "Vehicle Yard", type: "outdoor", x: 4, y: 13, scene: "base-exterior.png", desc: "Snowcats and tracks vanish into the flat white.", tags: ["outside", "vehicle"] },
    { id: "generator-bank", name: "Generator Bank", type: "outdoor", x: 27, y: 25, scene: "base-exterior.png", desc: "The generators throb through the snow like a second heartbeat.", tags: ["outside", "noise", "tools"] },
    { id: "fuel-cache", name: "Fuel Cache", type: "outdoor", x: 7, y: 91, scene: "base-exterior.png", desc: "Drums of fuel sit under snow crust and torn canvas.", tags: ["outside", "fuel"] },
    { id: "radio-tower", name: "Radio Tower", type: "outdoor", x: 96, y: 43, scene: "base-exterior.png", desc: "Cables hum overhead. If the station can shout, this is its throat.", tags: ["outside", "radio"] },
    { id: "snowcat-track", name: "Snowcat Track", type: "outdoor", x: 40, y: 94, scene: "snow.png", desc: "Old tracks scrape away into weather and doubt.", tags: ["outside", "track"] },
    { id: "perimeter-fence", name: "Perimeter Fence", type: "outdoor", x: 18, y: 94, scene: "snow.png", desc: "Rope, posts, and a line that only means something while people obey it.", tags: ["outside", "track"] },
    { id: "burn-pit", name: "Burn Pit", type: "outdoor", x: 61, y: 92, scene: "base-exterior.png", desc: "Blackened snow and old ash. Fire is the only honest answer out here.", tags: ["outside", "fire", "fuel"] }
  ];

  const locationById = Object.fromEntries(locations.map((loc) => [loc.id, { ...loc, exits: [] }]));
  const characterById = Object.fromEntries(characterTemplates.map((ch) => [ch.id, ch]));

  const links = [
    ["vehicle-building", "vehicle-yard"], ["vehicle-building", "common-office"], ["vehicle-building", "shed"],
    ["shed", "tool-shed"], ["shed", "common-office"], ["tool-shed", "generator-bank"],
    ["kennel", "kennel-yard"], ["kennel", "manager-office"], ["kennel-yard", "vehicle-yard"],
    ["manager-office", "common-office"], ["manager-office", "supply-room-1"], ["supply-room-1", "rec-room"],
    ["common-office", "sleeping-quarters"], ["common-office", "rec-room"], ["rec-room", "kitchen"],
    ["kitchen", "mess-hall"], ["mess-hall", "infirmary"], ["infirmary", "specimen-lab"], ["infirmary", "bathroom"],
    ["specimen-lab", "geology-lab"], ["specimen-lab", "laboratory"], ["sleeping-quarters", "bathroom"],
    ["bathroom", "geology-lab"], ["geology-lab", "greenhouse"], ["geology-lab", "radio-room"],
    ["greenhouse", "laundry-room"], ["greenhouse", "radio-room"], ["radio-room", "map-room"],
    ["map-room", "supply-room-2"], ["map-room", "specimen-lab"], ["supply-room-2", "main-yard"],
    ["main-yard", "rec-room"], ["main-yard", "mess-hall"], ["main-yard", "helicopter-pad"],
    ["main-yard", "snowcat-track"], ["main-yard", "burn-pit"], ["main-yard", "fuel-cache"],
    ["main-yard", "generator-bank"], ["main-yard", "perimeter-fence"], ["main-yard", "kennel-yard"],
    ["helicopter-pad", "radio-tower"], ["radio-tower", "radio-room"], ["radio-tower", "mcready-shack"],
    ["mcready-shack", "shack-inside"], ["mcready-shack", "helicopter-pad"], ["fuel-cache", "burn-pit"],
    ["perimeter-fence", "snowcat-track"], ["vehicle-yard", "generator-bank"]
  ];

  links.forEach(([a, b]) => {
    locationById[a].exits.push(b);
    locationById[b].exits.push(a);
  });

  const weatherTable = [
    { name: "Clear", exposure: 1, noise: 0.02 },
    { name: "Wind", exposure: 2, noise: 0.05 },
    { name: "Whiteout", exposure: 4, noise: 0.1 },
    { name: "Hard Freeze", exposure: 3, noise: 0.04 }
  ];

  const cluePool = [
    { tag: "dog", text: "A dog refuses to cross a doorway, hackles raised.", question: "dog", type: "clue" },
    { tag: "blood", text: "A tiny dark smear has been wiped too clean.", question: "blood", type: "danger" },
    { tag: "noise", text: "Something knocks once behind the wall, then stops.", question: "noise", type: "clue" },
    { tag: "lab", text: "A sample label has been moved since the last inspection.", question: "sample", type: "clue" },
    { tag: "track", text: "A boot trail doubles back where nobody had reason to turn.", question: "tracks", type: "cold" },
    { tag: "records", text: "The room log has a gap where a name should be.", question: "alibi", type: "clue" },
    { tag: "fuel", text: "Fuel has been taken without being signed out.", question: "fuel", type: "danger" },
    { tag: "water", text: "There is condensation on a surface that should be cold.", question: "heat", type: "clue" }
  ];

  const dialogueBank = {
    mcready: {
      day1: ["Just learning the corners. Don't make it a ceremony.", "Ask me after coffee. Or don't."],
      doing: ["Checking exits. Funny how few there are.", "Keeping the chopper in my head, even if the weather says no."],
      thoughts: ["Somebody starts acting too calm, I notice.", "This place is a box. Boxes make men weird."],
      alibi: ["Shack, yard, Rec Room. I did not sneak. I walked.", "I was outside long enough to hate it."],
      recent: ["I heard the same thing. Short scrape, then boots.", "People remember doors wrong when they're scared."]
    },
    gary: {
      day1: ["We keep the station running. That is the job.", "No speeches. Just sign the logs and stay visible."],
      doing: ["Trying to keep order with half the room testing me.", "Checking keys, rosters, and who keeps wandering."],
      thoughts: ["A bad accusation can do as much damage as whatever is out there.", "If people split up, we lose the station first."],
      alibi: ["Office, radio corridor, back to the office.", "Ask Windows. I was around the radio room earlier."],
      recent: ["I heard about it. I want names, not panic.", "Someone moved without signing out. That matters."]
    },
    norris: {
      day1: ["I'm looking at samples. Rocks don't argue back.", "Quiet day, so far. I like quiet days."],
      doing: ["Sorting labels. One is missing, unless I miscounted.", "Trying not to be in anyone's way."],
      thoughts: ["People are fitting facts to fear. That's how bad maps get drawn.", "The station feels smaller today."],
      alibi: ["Geology Lab. Bathroom once. Not much else.", "I was near the lab wing. Somebody saw me."],
      recent: ["There was a gap in the hall noise. Then a door.", "I saw wet boots where the floor should've been dry."]
    },
    bennings: {
      day1: ["Barometer's dropping. That's the bad news I understand.", "If anyone needs me, I'm with the weather sheets."],
      doing: ["Logging pressure. Wind's turning mean.", "Checking the yard readings before they freeze over."],
      thoughts: ["A storm makes liars look honest. Everyone stays inside.", "Weather closes choices. Remember that."],
      alibi: ["Common Office, yard, Common Office. Cold enough to count as a witness.", "I took readings. Check the book."],
      recent: ["I heard a bang under the wind. Not metal.", "Someone opened an outside door too long."]
    },
    knauls: {
      day1: ["Kitchen's open. Don't ask for miracles.", "I got food, music, and twelve bad moods."],
      doing: ["Counting cans. People get real honest when dinner gets ugly.", "Keeping knives where I can see them."],
      thoughts: ["Nobody eats from open pots if this gets worse.", "I don't like quiet men in my kitchen."],
      alibi: ["Kitchen. Mess. Kitchen again. Same song.", "Food was on. I was not roaming."],
      recent: ["I heard somebody running, then trying not to sound like running.", "One can crate moved. Not by me."]
    },
    childs: {
      day1: ["Machines need work. People can wait.", "If it breaks, I fix it. If it lies, that's your department."],
      doing: ["Keeping the snowcat alive.", "Checking fuel and tools before some fool loses both."],
      thoughts: ["Trust is cheap until the lights go out.", "I don't scare easy. I do get tired of stupid."],
      alibi: ["Vehicle Building. Toolshed if I moved.", "I was where the engines are. That simple."],
      recent: ["Fuel's lighter than it should be.", "I heard a tool drop, then nobody cussing. That's wrong."]
    },
    windows: {
      day1: ["Radio's mostly hiss. I can make that sound official.", "I'm around if anyone needs the dead air translated."],
      doing: ["Trying the band again. Same static.", "Writing down every weird burst, even the dumb ones."],
      thoughts: ["I don't like how sound moves in here.", "If someone screams, I might hear it before you do."],
      alibi: ["Radio Room. Hallway for maybe a minute.", "I left, I came back. That's it."],
      recent: ["There was a click on station band. Not weather.", "I heard two voices stop when I moved."]
    },
    clark: {
      day1: ["Dogs are fine if nobody bothers them.", "You want gossip, ask a human."],
      doing: ["Watching the dogs watch us.", "Checking latches. Kennel doors don't close themselves."],
      thoughts: ["Dogs know wrong before we name it.", "If they go still, that's worse than barking."],
      alibi: ["Kennel. Yard. Kennel.", "I was with the dogs. Like usual."],
      recent: ["One dog stopped sniffing. Just stared.", "Something made them back up without barking."]
    },
    palmer: {
      day1: ["Just vibing with the end of the world, man.", "Garage smells better than the mood in here."],
      doing: ["Finding parts before Childs says I lost them.", "Looking busy. Underrated survival skill."],
      thoughts: ["Everybody wants the monster to be obvious. That's funny.", "Fear makes people pointy."],
      alibi: ["Garage, Rec Room, maybe Kitchen. I move around.", "I was not hiding. Hiding's quieter."],
      recent: ["Somebody cut through the hall fast.", "I saw a door move after nobody touched it. Enjoy that."]
    },
    copper: {
      day1: ["I would like one day without a wound, if that's allowed.", "Medical stores are low, morale lower."],
      doing: ["Counting sedatives. Not enough for the mood.", "Checking who looks frostbitten and who says they aren't."],
      thoughts: ["Panic presents like fever if you want it to.", "We need samples, not theater."],
      alibi: ["Infirmary, Specimen Lab, Infirmary.", "I had witnesses part of the time."],
      recent: ["There was a smear wiped with the wrong solvent.", "Someone moved medical tape. Petty, unless it isn't."]
    },
    blair: {
      day1: ["The numbers are ugly before anything happens.", "Leave the samples where they are."],
      doing: ["Running the same conclusion until it changes. It won't.", "Reading tissue like a death notice."],
      thoughts: ["If it imitates, isolation is already late.", "The question is not who. It is how far."],
      alibi: ["Specimen Lab. I did not need company.", "Lab wing. Ask Fuchs."],
      recent: ["A sample was warmer than the room.", "One label moved. I know where I left it."]
    },
    fuchs: {
      day1: ["I'm checking Blair's math. I hope it's wrong.", "Please don't touch the samples."],
      doing: ["Copying notes because the originals keep walking away.", "Keeping records in two places now."],
      thoughts: ["Assume contamination. Then act less brave.", "Nobody should be alone with tissue."],
      alibi: ["Lab, Infirmary, Lab. I wrote it down.", "I stayed where the notes were."],
      recent: ["I smelled hot copper near the lab door.", "Someone looked at the samples and left too quickly."]
    }
  };

  const itemCatalog = {
    "Parka": { kind: "wear", text: "Cuts frostbite risk outside." },
    "Spare parka": { kind: "wear", text: "Warm enough for one bad walk." },
    "Flamethrower": { kind: "fire", text: "Ends an exposed Thing. Also ends trust if you're wrong." },
    "Blowtorch": { kind: "fire", text: "Short reach, real heat." },
    "Torch": { kind: "fire", text: "Crude fire. Better than courage." },
    "Flares": { kind: "fire", text: "Light, signal, threat." },
    "Fuel can": { kind: "fuel", text: "Feeds fire. Tempts idiots." },
    "Keys": { kind: "key", text: "Garry's keys. Doors, cabinets, trouble." },
    "Service pistol": { kind: "weapon", text: "Loud. Final. Not enough for the Thing." },
    "Kitchen knife": { kind: "weapon", text: "Close work only." },
    "Food stores": { kind: "supply", text: "Useful if the group switches to cans." },
    "Weather log": { kind: "record", text: "Tracks wind shifts." },
    "Radio log": { kind: "record", text: "Useful against bad alibis." },
    "Headset": { kind: "tool", text: "Catches weak station noise." },
    "Dog lead": { kind: "tool", text: "Clark trusts it more than men." },
    "Sample labels": { kind: "record", text: "Good for catching lab lies." },
    "Medical kit": { kind: "medical", text: "Treats shock and cold." },
    "Microscope notes": { kind: "record", text: "Blair's math in cramped ink." },
    "Research notes": { kind: "record", text: "Fuchs keeps copies." },
    "Blood kit": { kind: "test", text: "For blood tests in lab or infirmary." },
    "Crowbar": { kind: "tool", text: "Opens locked storage with noise." },
    "Wire": { kind: "tool", text: "Repairs or sabotage." },
    "Rope": { kind: "tool", text: "Useful for restraint." },
    "Canned food": { kind: "supply", text: "Sealed food for paranoid meals." },
    "Sedatives": { kind: "medical", text: "Keeps a breaking man still." },
    "Generator fuse": { kind: "tool", text: "Keeps the lights honest." }
  };

  const roomLootTable = {
    "manager-office": ["Keys", "Radio log"],
    "supply-room-1": ["Spare parka", "Rope", "Canned food"],
    "supply-room-2": ["Fuel can", "Flares", "Blood kit"],
    "vehicle-building": ["Crowbar", "Generator fuse", "Wire"],
    "tool-shed": ["Torch", "Fuel can", "Wire"],
    "kitchen": ["Canned food", "Kitchen knife"],
    "infirmary": ["Blood kit", "Sedatives", "Medical kit"],
    "specimen-lab": ["Blood kit", "Sample labels"],
    "laboratory": ["Research notes", "Blood kit"],
    "radio-room": ["Headset", "Radio log"],
    "laundry-room": ["Spare parka"],
    "fuel-cache": ["Fuel can", "Flares"]
  };

  const taskTemplates = {
    mcready: { label: "Check the chopper and shack radio", loc: "helicopter-pad", skill: "nerve" },
    gary: { label: "Verify keys and room log", loc: "manager-office", skill: "social" },
    norris: { label: "Log the geology samples", loc: "geology-lab", skill: "mechanical" },
    bennings: { label: "Read weather and warn the base", loc: "common-office", skill: "warmth" },
    knauls: { label: "Prepare sealed meals", loc: "kitchen", skill: "social" },
    childs: { label: "Keep generator and vehicles running", loc: "vehicle-building", skill: "mechanical" },
    windows: { label: "Sweep the radio band", loc: "radio-room", skill: "mechanical" },
    clark: { label: "Check kennel latches", loc: "kennel", skill: "warmth" },
    palmer: { label: "Find parts without losing fuel", loc: "vehicle-building", skill: "mechanical" },
    copper: { label: "Inventory medical supplies", loc: "infirmary", skill: "medical" },
    blair: { label: "Secure specimen notes", loc: "specimen-lab", skill: "medical" },
    fuchs: { label: "Copy research logs", loc: "laboratory", skill: "medical" }
  };

  const orderTemplates = [
    { id: "cans", label: "Eat from sealed cans", minRep: 70, effect: "food" },
    { id: "pairs", label: "Nobody walks alone", minRep: 74, effect: "pairs" },
    { id: "keys", label: "Keys stay public", minRep: 78, effect: "keys" },
    { id: "bloodwatch", label: "Guard blood supplies", minRep: 82, effect: "blood" }
  ];

  let state = null;
  let selectedCharacterId = "mcready";
  let lastAnswer = "";

  function initialCharacterState(template, selectedId) {
    return {
      id: template.id,
      alive: true,
      assimilated: false,
      exposed: false,
      location: template.start,
      previousLocation: template.start,
      suspicion: template.id === selectedId ? 0 : Math.floor(8 + Math.random() * 16),
      friendship: template.id === selectedId ? 100 : Math.floor(-4 + Math.random() * 16),
      stress: template.id === "blair" ? 34 : Math.floor(14 + Math.random() * 18),
      enemy: false,
      breakdown: false,
      alarmed: false,
      items: template.id === selectedId ? [] : [...template.tools],
      taskDone: false,
      lastSeenDay: 1,
      lastSeenTime: 480
    };
  }

  function createState(playerId) {
    const player = characterById[playerId];
    const characterStates = {};
    characterTemplates.forEach((template) => {
      characterStates[template.id] = initialCharacterState(template, playerId);
    });

    return {
      playerId,
      currentLocation: player.start,
      day: 1,
      minute: 8 * 60,
      weather: pick(weatherTable),
      publicRep: playerId === "gary" ? 62 : 50,
      exposure: 0,
      inventory: uniq(["Parka", ...player.tools]),
      characters: characterStates,
      roomLoot: generateRoomLoot(),
      tasks: createTasks(),
      recentEvents: [],
      activeOrders: [],
      alarm: null,
      wheelTarget: null,
      clues: [],
      log: [],
      unlockedQuestions: new Set(["where", "doing", "thoughts", "recent"]),
      selectedTalkTarget: null,
      dog: { name: "Norwegian Dog", location: "kennel", alive: true, assimilated: false, revealed: false },
      gameOver: false,
      roundEvents: 0
    };
  }

  function generateRoomLoot() {
    const loot = {};
    locations.forEach((loc) => {
      const table = roomLootTable[loc.id] || [];
      loot[loc.id] = table.filter(() => roll(0.65));
      if (!loot[loc.id].length && table.length && roll(0.28)) loot[loc.id].push(pick(table));
    });
    return loot;
  }

  function createTasks() {
    return Object.fromEntries(characterTemplates.map((ch) => {
      const template = taskTemplates[ch.id];
      return [ch.id, { ...template, done: false, failed: false }];
    }));
  }

  function resetDailyTasks() {
    Object.values(state.tasks).forEach((task) => {
      task.done = false;
      task.failed = false;
    });
    Object.values(state.characters).forEach((ch) => {
      ch.taskDone = false;
    });
  }

  function rememberEvent(text, locationId, involved = [], type = "event") {
    state.recentEvents.unshift({
      day: state.day,
      time: timeLabel(),
      text,
      locationId,
      involved,
      type
    });
    state.recentEvents = state.recentEvents.slice(0, 12);
  }

  function timeLabel(minutes = state.minute) {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  function livingCharacters() {
    return Object.values(state.characters).filter((ch) => ch.alive);
  }

  function livingNpcs() {
    return livingCharacters().filter((ch) => ch.id !== state.playerId);
  }

  function infectedHumans() {
    return livingCharacters().filter((ch) => ch.assimilated);
  }

  function occupantsAt(locationId, includePlayer = true) {
    return Object.values(state.characters).filter((ch) => ch.alive && ch.location === locationId && (includePlayer || ch.id !== state.playerId));
  }

  function canEnter(locationId) {
    const loc = locationById[locationId];
    if (!loc || loc.type !== "indoor") return true;
    return occupantsAt(locationId).length < 12;
  }

  function addLog(text) {
    state.log.unshift({ day: state.day, time: timeLabel(), text });
    state.log = state.log.slice(0, 22);
  }

  function addClue(text, question, type = "clue") {
    if (!state.clues.some((clue) => clue.text === text)) {
      state.clues.unshift({ day: state.day, time: timeLabel(), text, type });
      state.clues = state.clues.slice(0, 24);
    }
    if (question) state.unlockedQuestions.add(question);
  }

  function cleanLine(text) {
    return text
      .replace(/\u2014/g, ", ")
      .replace(/\b(significant|crucial|vital|delve|underscore|tapestry|realm|moreover)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function voiceLine(characterId, key) {
    const bank = dialogueBank[characterId] || {};
    const lines = bank[key] || bank.thoughts || ["Nothing useful."];
    return cleanLine(pick(lines));
  }

  function recentEventFor(characterId) {
    return state.recentEvents.find((event) => {
      return event.involved.includes(characterId) || state.characters[characterId].location === event.locationId;
    }) || state.recentEvents[0];
  }

  function notice(text, type = "clue") {
    const symbols = { cold: "*", danger: "!", clue: "?", social: "+", good: "✓" };
    const stack = $("notificationStack");
    const item = document.createElement("div");
    item.className = `notice ${type}`;
    item.innerHTML = `<span class="symbol">${symbols[type] || "?"}</span><p>${text}</p>`;
    stack.appendChild(item);
    window.setTimeout(() => item.remove(), 5200);
  }

  function renderSelection() {
    const host = $("characterSelect");
    host.innerHTML = characterTemplates.map((ch) => {
      const active = ch.id === selectedCharacterId ? " active" : "";
      return `
        <button class="character-option${active}" type="button" data-character="${ch.id}">
          <img src="${asset(ch.portrait)}" alt="${ch.name}">
          <span class="card-copy">
            <h3>${ch.name}</h3>
            <p>${ch.role}</p>
            <span class="stat-chips">
              <span>Nerve ${ch.stats.nerve}</span>
              <span>Warmth ${ch.stats.warmth}</span>
              <span>Trust ${ch.stats.social}</span>
            </span>
          </span>
        </button>
      `;
    }).join("");

    host.querySelectorAll("[data-character]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedCharacterId = button.dataset.character;
        renderSelection();
      });
    });

    renderSelectionDetails();
  }

  function renderSelectionDetails() {
    const ch = characterById[selectedCharacterId];
    $("selectionDetails").innerHTML = `
      <img src="${asset(ch.portrait)}" alt="${ch.name}">
      <h2>${ch.name}</h2>
      <p>${ch.role}. ${ch.style}.</p>
      <div class="detail-row"><span>Tools</span><strong>${ch.tools.join(", ")}</strong></div>
      <div class="detail-row"><span>Perks</span><strong>${ch.perks.join("; ")}</strong></div>
      <div class="detail-row"><span>Start</span><strong>${locationById[ch.start].name}</strong></div>
      <button id="startGameButton" type="button">Start as ${ch.name}</button>
    `;
    $("startGameButton").addEventListener("click", () => startGame(ch.id));
  }

  function startGame(playerId) {
    state = createState(playerId);
    state.characters[playerId].location = state.currentLocation;
    state.publicRep = playerId === "gary" ? 62 : state.publicRep;
    $("selectionScreen").classList.add("hidden");
    $("gameApp").classList.remove("hidden");
    addLog(`${characterById[playerId].name} checks the station map.`);
    rememberEvent("First rounds through the station. No one is worried yet.", state.currentLocation, [playerId], "quiet");
    notice("Quiet morning. Learn the routes.", "good");
    drawBoard();
    renderGame();
  }

  function drawBoard() {
    const nodeLayer = $("nodeLayer");
    const routeLayer = $("routeLayer");
    nodeLayer.innerHTML = "";
    routeLayer.innerHTML = "";

    links.forEach(([a, b]) => {
      const la = locationById[a];
      const lb = locationById[b];
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", la.x);
      line.setAttribute("y1", la.y);
      line.setAttribute("x2", lb.x);
      line.setAttribute("y2", lb.y);
      line.dataset.route = `${a}|${b}`;
      routeLayer.appendChild(line);
    });

    locations.forEach((loc) => {
      const node = document.createElement("button");
      node.type = "button";
      node.className = `map-node ${loc.type === "outdoor" ? "outdoor" : ""}`;
      node.style.left = `${loc.x}%`;
      node.style.top = `${loc.y}%`;
      node.dataset.location = loc.id;
      node.title = loc.name;
      node.innerHTML = `<span class="node-label">${loc.name}</span>`;
      node.addEventListener("click", () => moveTo(loc.id));
      node.addEventListener("dragover", allowToolDrop);
      node.addEventListener("drop", (event) => handleToolDrop(event, "location", loc.id));
      nodeLayer.appendChild(node);
    });
  }

  function renderGame() {
    if (!state) return;
    renderMeters();
    renderBoardState();
    renderScene();
    renderOccupants();
    renderPlayerCard();
    renderRoster();
    renderJournal();
    renderInventory();
    renderRoomLoot();
    renderTasks();
    renderOrders();
  }

  function renderMeters() {
    $("dayMeter").textContent = String(state.day);
    $("timeMeter").textContent = timeLabel();
    $("weatherMeter").textContent = state.weather.name;
    $("repMeter").textContent = String(Math.round(state.publicRep));
  }

  function renderBoardState() {
    const current = state.currentLocation;
    const exits = new Set(locationById[current].exits);

    document.querySelectorAll(".map-node").forEach((node) => {
      const id = node.dataset.location;
      node.classList.toggle("current", id === current);
      node.classList.toggle("reachable", exits.has(id));
    });

    document.querySelectorAll(".route-layer line").forEach((line) => {
      const [a, b] = line.dataset.route.split("|");
      line.classList.toggle("reachable", a === current || b === current);
    });

    const tokenLayer = $("tokenLayer");
    tokenLayer.innerHTML = "";
    locations.forEach((loc) => {
      const people = occupantsAt(loc.id);
      if (people.length === 0 && !(state.dog.alive && state.dog.location === loc.id)) return;
      const playerHere = people.some((ch) => ch.id === state.playerId);
      if (playerHere) {
        addToken(tokenLayer, loc, state.playerId, -10, -10, true);
      }
      const others = people.filter((ch) => ch.id !== state.playerId);
      if (others.length === 1) {
        const exposed = others[0].exposed ? " infected-glimpse" : "";
        addToken(tokenLayer, loc, others[0].id, 9, 4, false, exposed);
      } else if (others.length > 1) {
        addCountToken(tokenLayer, loc, others.length, 9, 4);
      }
      if (state.dog.alive && state.dog.location === loc.id) {
        addDogToken(tokenLayer, loc, others.length > 0 ? 18 : 8, -13);
      }
    });

    const outdoor = locations.filter((loc) => loc.type === "outdoor");
    $("outsideStrip").innerHTML = outdoor.map((loc) => {
      const reachable = locationById[state.currentLocation].exits.includes(loc.id);
      const currentClass = state.currentLocation === loc.id ? " current" : "";
      return `<button type="button" class="${currentClass}" data-outside="${loc.id}" ${reachable || state.currentLocation === loc.id ? "" : ""}>${loc.name}</button>`;
    }).join("");
    $("outsideStrip").querySelectorAll("[data-outside]").forEach((button) => {
      button.addEventListener("click", () => moveTo(button.dataset.outside));
    });
  }

  function addToken(layer, loc, characterId, dx, dy, player, extraClass = "") {
    const token = document.createElement("div");
    const ch = characterById[characterId];
    token.className = `map-token ${player ? "player-token" : ""}${extraClass}`;
    token.style.left = `calc(${loc.x}% + ${dx}px)`;
    token.style.top = `calc(${loc.y}% + ${dy}px)`;
    token.title = ch.name;
    token.dataset.character = characterId;
    token.innerHTML = `<img src="${asset(ch.portrait)}" alt="${ch.name}">`;
    if (!player) {
      token.addEventListener("click", () => {
        if (state.characters[characterId].location === state.currentLocation) openActionWheel(characterId);
        else notice(`${ch.name} is not close enough.`, "cold");
      });
      token.addEventListener("dragover", allowToolDrop);
      token.addEventListener("drop", (event) => handleToolDrop(event, "character", characterId));
    }
    layer.appendChild(token);
  }

  function addDogToken(layer, loc, dx, dy) {
    const token = document.createElement("div");
    token.className = `map-token ${state.dog.revealed ? "infected-glimpse" : ""}`;
    token.style.left = `calc(${loc.x}% + ${dx}px)`;
    token.style.top = `calc(${loc.y}% + ${dy}px)`;
    token.title = state.dog.assimilated ? "Dog?" : "Dog";
    token.dataset.dog = "true";
    token.innerHTML = `<img src="${asset(state.dog.revealed ? "thing-dog-berserk.png" : "dog.png")}" alt="Dog">`;
    token.addEventListener("dragover", allowToolDrop);
    token.addEventListener("drop", (event) => handleToolDrop(event, "dog", "dog"));
    layer.appendChild(token);
  }

  function addCountToken(layer, loc, count, dx, dy) {
    const token = document.createElement("div");
    token.className = "map-token count-token";
    token.style.left = `calc(${loc.x}% + ${dx}px)`;
    token.style.top = `calc(${loc.y}% + ${dy}px)`;
    token.textContent = `+${count}`;
    token.title = `${count} people`;
    layer.appendChild(token);
  }

  function renderScene() {
    const loc = locationById[state.currentLocation];
    const count = occupantsAt(loc.id).length + (state.dog.alive && state.dog.location === loc.id ? 1 : 0);
    $("locationTitle").textContent = loc.name;
    $("occupancyPill").textContent = `${count}/12`;
    $("sceneType").textContent = loc.type === "outdoor" ? "Outside" : "Inside";
    $("sceneName").textContent = loc.name;
    $("sceneDescription").textContent = loc.desc;
    $("sceneImage").src = asset(loc.scene);
    $("sceneImage").alt = loc.name;
    $("sceneOverlay").style.background = loc.type === "outdoor"
      ? "linear-gradient(180deg, rgba(5, 6, 6, 0.05), rgba(5, 6, 6, 0.62))"
      : "linear-gradient(180deg, rgba(5, 6, 6, 0), rgba(5, 6, 6, 0.5))";

    $("exitButtons").innerHTML = locationById[loc.id].exits.map((id) => {
      return `<button type="button" data-exit="${id}">${locationById[id].name}</button>`;
    }).join("");
    $("exitButtons").querySelectorAll("[data-exit]").forEach((button) => {
      button.addEventListener("click", () => moveTo(button.dataset.exit));
    });

    const actionButtons = [
      `<button type="button" data-action="inspect">Inspect</button>`,
      `<button type="button" data-action="listen">Listen</button>`,
      `<button type="button" data-action="wait">Wait</button>`
    ];
    if (loc.tags.includes("supply") || loc.tags.includes("tools") || loc.tags.includes("fuel") || loc.tags.includes("coat")) {
      actionButtons.push(`<button type="button" data-action="scavenge">Scavenge</button>`);
    }
    if (loc.tags.includes("lab") || loc.tags.includes("medical") || loc.tags.includes("test")) {
      actionButtons.push(`<button type="button" data-action="test">Blood Test</button>`);
    }
    if (loc.tags.includes("radio")) {
      actionButtons.push(`<button type="button" data-action="radio">Radio</button>`);
    }
    if (loc.type === "indoor") {
      actionButtons.push(`<button type="button" data-action="warm">Warm Up</button>`);
    }
    const playerTask = state.tasks[state.playerId];
    if (playerTask && !playerTask.done && playerTask.loc === loc.id) {
      actionButtons.push(`<button type="button" data-action="task">Do Job</button>`);
    }
    $("locationActions").innerHTML = actionButtons.join("");
    $("locationActions").querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => handleAction(button.dataset.action));
    });
  }

  function renderOccupants() {
    const people = occupantsAt(state.currentLocation, false);
    const dogHere = state.dog.alive && state.dog.location === state.currentLocation;
    const stripRows = people.map((chState) => {
      const ch = characterById[chState.id];
      const rel = chState.enemy ? "enemy" : chState.friendship > 35 ? "friend" : chState.friendship < -20 ? "cold" : "uneasy";
      return `
        <button class="same-room-token" type="button" data-talk="${ch.id}">
          <img src="${asset(ch.portrait)}" alt="${ch.name}">
          <strong>${ch.name}</strong>
          <span>${rel}</span>
        </button>
      `;
    });

    if (dogHere) {
      stripRows.push(`
        <button class="same-room-token" type="button" data-dog-talk="true">
          <img src="${asset(state.dog.revealed ? "thing-dog-berserk.png" : "dog.png")}" alt="Dog">
          <strong>${state.dog.revealed ? "Dog-Thing" : "Dog"}</strong>
          <span>${state.dog.assimilated ? "too still" : "watching"}</span>
        </button>
      `);
    }

    $("sameRoomStrip").innerHTML = stripRows.join("");
    $("sameRoomStrip").querySelectorAll("[data-talk]").forEach((button) => {
      button.addEventListener("click", () => {
        openActionWheel(button.dataset.talk);
      });
    });
    $("sameRoomStrip").querySelectorAll("[data-dog-talk]").forEach((button) => {
      button.addEventListener("click", () => inspectDog());
    });
    $("occupantsList").innerHTML = "";
  }

  function renderDialogue() {
    const targetId = state.selectedTalkTarget;
    const targetState = targetId ? state.characters[targetId] : null;
    if (!targetState || !targetState.alive || targetState.location !== state.currentLocation) {
      state.selectedTalkTarget = null;
      $("dialoguePanel").innerHTML = `
        <div class="answer-box">Select someone in the room, or use Listen to catch nearby conversations through walls and vents.</div>
      `;
      return;
    }

    const ch = characterById[targetId];
    const questions = [
      ["where", "Where were you?"],
      ["doing", "What are you doing?"],
      ["thoughts", "Thoughts?"],
      ["recent", "Recent event?"],
      ["dog", "The dog?"],
      ["noise", "That noise?"],
      ["blood", "Blood trace?"],
      ["sample", "Specimen notes?"],
      ["fuel", "Missing fuel?"]
    ].filter(([id]) => state.unlockedQuestions.has(id));

    $("dialoguePanel").innerHTML = `
      <div class="speaker">
        <img src="${asset(ch.portrait)}" alt="${ch.name}">
        <span><h4>${ch.name}</h4><p>${ch.style}</p></span>
      </div>
      <div class="question-grid">
        ${questions.map(([id, label]) => `<button type="button" data-question="${id}">${label}</button>`).join("")}
      </div>
      ${lastAnswer ? `<div class="answer-box">${lastAnswer}</div>` : ""}
    `;
    $("dialoguePanel").querySelectorAll("[data-question]").forEach((button) => {
      button.addEventListener("click", () => askQuestion(targetId, button.dataset.question));
    });
  }

  function openActionWheel(targetId) {
    const target = state.characters[targetId];
    if (!target || !target.alive || target.location !== state.currentLocation) return;
    state.wheelTarget = targetId;
    const ch = characterById[targetId];
    const host = $("actionWheelHost");
    const hasFire = state.inventory.some(isFireItem);
    const hasBlood = state.inventory.includes("Blood kit") || ["copper", "fuchs", "blair"].includes(state.playerId);
    const actions = [
      ["where", "Alibi"],
      ["doing", state.day === 1 ? "Small Talk" : "Now"],
      ["recent", "Recent"],
      ["thoughts", "Read Him"],
      ["shadow", "Shadow"],
      ["accuse", "Accuse"]
    ];
    if (state.day >= 2) actions.push(["threaten", "Threaten"]);
    if (hasBlood) actions.push(["blood", "Blood"]);
    if (hasFire) actions.push(["burn", "Fire"]);

    const step = 360 / actions.length;
    host.classList.remove("hidden");
    $("boardMap").classList.add("wheel-open");
    host.innerHTML = `
      <div class="action-wheel">
        <button class="wheel-close" type="button" data-wheel-close>X</button>
        <div class="wheel-center">
          <img src="${asset(ch.portrait)}" alt="${ch.name}">
          <h3>${ch.name}</h3>
          <p>${target.enemy ? "enemy" : target.friendship > 35 ? "friend" : "uneasy"} · suspicion ${Math.round(target.suspicion)}</p>
        </div>
        ${actions.map(([id, label], index) => `<button class="wheel-option" style="--angle:${index * step}deg" type="button" data-wheel-action="${id}">${label}</button>`).join("")}
        <div class="wheel-result">${state.day === 1 ? voiceLine(targetId, "day1") : "What do you ask?"}</div>
      </div>
    `;
    host.querySelector("[data-wheel-close]").addEventListener("click", closeActionWheel);
    host.querySelectorAll("[data-wheel-action]").forEach((button) => {
      button.addEventListener("click", () => handleWheelAction(targetId, button.dataset.wheelAction));
    });
    host.addEventListener("click", closeWheelFromBackdrop);
  }

  function closeWheelFromBackdrop(event) {
    if (event.target === $("actionWheelHost")) closeActionWheel();
  }

  function closeActionWheel() {
    state.wheelTarget = null;
    $("actionWheelHost").classList.add("hidden");
    $("actionWheelHost").innerHTML = "";
    $("boardMap").classList.remove("wheel-open");
    $("actionWheelHost").removeEventListener("click", closeWheelFromBackdrop);
  }

  function setWheelResult(text) {
    const result = document.querySelector(".wheel-result");
    if (result) result.textContent = cleanLine(text);
  }

  function handleWheelAction(targetId, action) {
    if (["where", "doing", "thoughts", "recent"].includes(action)) {
      askQuestion(targetId, action);
      return;
    }
    if (action === "shadow") {
      shadowCharacter(targetId);
      return;
    }
    if (action === "accuse") {
      accuseTarget(targetId);
      setWheelResult(`${characterById[targetId].name} hears the accusation. The room hears it too.`);
      return;
    }
    if (action === "threaten") {
      threatenCharacter(targetId);
      return;
    }
    if (action === "blood") {
      bloodTest(targetId);
      setWheelResult(`The blood test is no longer private.`);
      return;
    }
    if (action === "burn") {
      burnCharacter(targetId, state.inventory.find(isFireItem));
      return;
    }
  }

  function shadowCharacter(targetId) {
    const target = state.characters[targetId];
    const ch = characterById[targetId];
    if (!target || !target.alive) return;
    passTime(26, true);
    const suspicious = target.assimilated || roll(target.suspicion / 130);
    if (suspicious) {
      target.suspicion = clamp(target.suspicion + 8, 0, 100);
      addClue(`${ch.name} takes a route that does not match his last answer.`, "recent", "clue");
      rememberEvent(`${ch.name} took a strange route.`, target.location, [targetId], "shadow");
      setWheelResult(`${ch.name} cuts through ${locationById[target.location].name} and checks behind him twice.`);
    } else {
      target.friendship = clamp(target.friendship - 3, -100, 100);
      setWheelResult(`${ch.name} notices you tailing him. "You done?"`);
    }
    renderGame();
  }

  function threatenCharacter(targetId) {
    const target = state.characters[targetId];
    const ch = characterById[targetId];
    if (!target || !target.alive) return;
    const player = characterById[state.playerId];
    const control = player.stats.nerve + player.stats.social + state.publicRep;
    target.friendship = clamp(target.friendship - 18, -100, 100);
    target.stress = clamp(target.stress + 14, 0, 100);
    target.enemy = target.friendship < -35;
    if (roll(control / 280)) {
      state.publicRep = clamp(state.publicRep + 5, 0, 100);
      target.suspicion = clamp(target.suspicion + (target.assimilated ? 10 : 3), 0, 100);
      setWheelResult(`${ch.name} backs down. Nobody mistakes it for trust.`);
      notice("Control rises. Trust does not.", "social");
    } else {
      state.publicRep = clamp(state.publicRep - 8, 0, 100);
      setWheelResult(`${ch.name} does not blink. The room notices.`);
      notice("That landed badly.", "danger");
    }
    rememberEvent(`${characterById[state.playerId].name} threatened ${ch.name}.`, state.currentLocation, [state.playerId, targetId], "threat");
    passTime(8, true);
    renderGame();
  }

  function inspectDog() {
    if (!state.dog.alive || state.dog.location !== state.currentLocation) return;
    passTime(8, true);
    if (state.dog.assimilated) {
      addClue("The dog sits too still. No panting. No sniffing. Just watching.", "dog", "danger");
      notice("The dog is too still.", "danger");
      if (roll(0.35)) {
        state.dog.revealed = true;
        showModal({
          image: asset("thing-dog-berserk.png"),
          title: "Kennel Noise",
          text: "The dog shape shudders once. Then the station hears it.",
          actions: [{ label: "Move", handler: closeModal }]
        });
      }
    } else {
      notice("The dog is nervous, but normal.", "good");
    }
    renderGame();
  }

  function askQuestion(targetId, question) {
    const chState = state.characters[targetId];
    const ch = characterById[targetId];
    let answer = "";
    const lying = chState.assimilated && roll(0.68);

    if (state.day === 1 && ["doing", "thoughts"].includes(question)) {
      answer = `"${voiceLine(targetId, "day1")}"`;
      chState.friendship += 1;
    } else if (question === "where") {
      const place = locationById[lying ? pick(locations).id : chState.previousLocation].name;
      answer = lying
        ? `${ch.name} looks past you. "I was in ${place}. Ask someone else."`
        : `"${voiceLine(targetId, "alibi")}" Last place before here was ${place}.`;
      chState.friendship += lying ? -1 : 2;
    } else if (question === "doing") {
      answer = `"${voiceLine(targetId, "doing")}"`;
      chState.friendship += 1;
    } else if (question === "thoughts") {
      answer = `"${voiceLine(targetId, "thoughts")}"`;
      chState.friendship += chState.stress > 70 ? -1 : 2;
    } else if (question === "recent") {
      const event = recentEventFor(targetId);
      if (!event) {
        answer = `"Nothing I can swear to. Just bad pipes and worse faces."`;
      } else if (lying) {
        answer = `"Didn't see it. Didn't hear it. That's my answer."`;
        chState.suspicion += 7;
      } else {
        answer = `"${voiceLine(targetId, "recent")}" About ${event.time}, near ${locationById[event.locationId]?.name || "the station"}.`;
      }
    } else if (question === "dog") {
      answer = ch.id === "clark"
        ? `"Dog's wrong if it stops wanting anything. Watch for that. Not teeth. Stillness."`
        : `"I do not like how quiet it got around the Kennel."`;
      chState.suspicion += chState.assimilated ? 5 : 0;
    } else if (question === "noise") {
      answer = lying
        ? `"Pipes. Wind. Pick one. This station talks all night."`
        : `"I heard it too. Short, wet, then someone moving fast."`;
      chState.suspicion += lying ? 6 : 1;
    } else if (question === "blood") {
      answer = lying
        ? `"Everybody bleeds. That is not a case."`
        : `"Find Copper or Fuchs. If it reacts to heat, we have our answer."`;
      chState.suspicion += lying ? 8 : 0;
    } else if (question === "sample") {
      answer = ch.id === "blair" || ch.id === "fuchs"
        ? `"Cellular imitation is not disguise. It is replacement. That distinction matters."`
        : `"Ask the lab men. I just know nothing in there should still be moving."`;
    } else if (question === "fuel") {
      answer = ch.id === "childs" || ch.id === "palmer"
        ? `"Fuel goes missing when people start thinking fire is a plan instead of a tool."`
        : `"If fuel is gone, somebody is preparing for either escape or cleanup."`;
    }

    if (roll(0.1 + chState.stress / 700)) {
      chState.friendship -= 3;
      answer += ` ${ch.name} watches your face for a little too long.`;
    }

    chState.friendship = clamp(chState.friendship, -100, 100);
    chState.suspicion = clamp(chState.suspicion, 0, 100);
    lastAnswer = answer;
    passTime(8, false);
    setWheelResult(answer);
    renderGame();
    return answer;
  }

  function handleAction(action) {
    if (state.gameOver) return;
    if (action === "inspect") inspectLocation();
    if (action === "listen") listenNearby();
    if (action === "wait") passTime(30, true);
    if (action === "scavenge") scavenge();
    if (action === "test") bloodTest();
    if (action === "radio") useRadio();
    if (action === "warm") warmUp();
    if (action === "task") doPlayerTask();
    renderGame();
  }

  function moveTo(locationId) {
    if (!state || state.gameOver) return;
    if (locationId === state.currentLocation) return;

    const current = locationById[state.currentLocation];
    const destination = locationById[locationId];
    if (!destination) return;
    if (!current.exits.includes(locationId)) {
      notice("That route is not directly connected from here.", "cold");
      return;
    }
    if (!canEnter(locationId)) {
      notice(`${destination.name} is too crowded. No more than twelve can fit there.`, "social");
      return;
    }

    const playerState = state.characters[state.playerId];
    playerState.previousLocation = state.currentLocation;
    playerState.location = locationId;
    playerState.lastSeenDay = state.day;
    playerState.lastSeenTime = state.minute;
    state.currentLocation = locationId;
    state.selectedTalkTarget = null;
    lastAnswer = "";

    const minutes = current.type === "outdoor" || destination.type === "outdoor"
      ? characterById[state.playerId].id === "mcready" ? 24 : 35
      : 18;
    passTime(minutes, true);
    addLog(`Moved to ${destination.name}.`);
    renderGame();
  }

  function passTime(minutes, runEvents) {
    state.minute += minutes;
    if (state.minute >= 22 * 60) {
      startNight();
      return;
    }

    if (state.minute >= 18 * 60 && roll(0.12)) {
      state.weather = pick(weatherTable);
      notice(`Weather shifts: ${state.weather.name}.`, state.weather.exposure > 2 ? "cold" : "clue");
    }

    if (locationById[state.currentLocation].type === "outdoor") {
      applyExposure(minutes);
    } else if (state.exposure > 0) {
      state.exposure = Math.max(0, state.exposure - Math.ceil(minutes / 12));
    }

    if (runEvents) {
      updateNpcRoutines();
      updateNpcTasks(minutes);
      maybeThingEvent();
      maybeStressEvent();
      maybeRandomNoise();
      checkEndings();
    }
  }

  function applyExposure(minutes) {
    const hasParka = state.inventory.includes("Parka") || state.inventory.includes("Spare parka");
    const warmth = characterById[state.playerId].stats.warmth;
    const exposureGain = Math.ceil((minutes / 16) * state.weather.exposure * (hasParka ? 0.55 : 1.35) * (100 - warmth + 45) / 100);
    state.exposure += exposureGain;
    if (state.exposure > 10 && roll(0.35)) notice("Your fingers ache inside the gloves.", "cold");
    if (state.exposure > 20) notice("You feel like you are getting frostbite.", "cold");
    if (state.exposure > 32) {
      state.publicRep = clamp(state.publicRep - 2, 0, 100);
      notice("The cold is making your decisions worse.", "danger");
    }
  }

  function updateNpcRoutines() {
    livingNpcs().forEach((chState) => {
      npcItemBehavior(chState);
      const pairOrder = state.activeOrders.includes("pairs") && !chState.assimilated;
      if (roll(pairOrder ? 0.28 : 0.46)) {
        const current = locationById[chState.location];
        const exits = current.exits.filter((id) => canEnter(id));
        if (!exits.length) return;
        let options = exits;
        if (chState.assimilated) {
          options = exits.filter((id) => occupantsAt(id, false).length <= 1);
          if (!options.length) options = exits;
        } else if (chState.stress > 72) {
          options = exits.filter((id) => locationById[id].type === "outdoor" || locationById[id].tags.includes("quiet"));
          if (!options.length) options = exits;
        }
        chState.previousLocation = chState.location;
        chState.location = pick(options);
      }
      if (roll(0.18)) chState.stress = clamp(chState.stress + 1, 0, 100);
    });

    if (state.dog.alive && roll(state.dog.assimilated ? 0.52 : 0.22)) {
      const dogLoc = locationById[state.dog.location];
      const dogExits = dogLoc.exits.filter((id) => locationById[id].tags.includes("dog") || locationById[id].type === "outdoor" || id === "kennel");
      if (dogExits.length) state.dog.location = pick(dogExits);
    }
  }

  function npcItemBehavior(chState) {
    const loot = state.roomLoot[chState.location] || [];
    const wantsBadItem = (item) => ["Keys", "Blood kit", "Fuel can", "Flares"].includes(item);
    const takeChance = chState.assimilated ? 0.2 : 0.07;
    if (loot.length && roll(takeChance)) {
      const item = chState.assimilated && loot.some(wantsBadItem)
        ? loot.find(wantsBadItem)
        : pick(loot);
      state.roomLoot[chState.location] = loot.filter((entry) => entry !== item);
      chState.items.push(item);
      const ch = characterById[chState.id];
      rememberEvent(`${ch.name} took ${item}.`, chState.location, [chState.id], "item");
      if (chState.assimilated || wantsBadItem(item)) {
        addClue(`${locationById[chState.location].name}: ${item} is missing from where it was last seen.`, item === "Keys" ? "alibi" : "fuel", "clue");
      }
    }

    if (chState.items.length && roll(chState.assimilated ? 0.06 : 0.035)) {
      const item = pick(chState.items);
      chState.items = chState.items.filter((entry) => entry !== item);
      state.roomLoot[chState.location] = uniq([...(state.roomLoot[chState.location] || []), item]);
      rememberEvent(`${characterById[chState.id].name} left ${item}.`, chState.location, [chState.id], "item");
    }
  }

  function maybeRandomNoise() {
    const base = state.weather.noise + (infectedHumans().length * 0.025) + (state.dog.assimilated ? 0.03 : 0);
    if (!roll(base)) return;
    const loc = locationById[state.currentLocation];
    addClue("You hear something move where no one admits to being.", "noise", "clue");
    notice(loc.type === "outdoor" ? "The wind carries a hard, wet sound." : "You hear something behind the wall.", "clue");
  }

  function maybeThingEvent() {
    if (state.day < 2 || (!state.dog.assimilated && infectedHumans().length === 0)) return;

    if (state.dog.assimilated && infectedHumans().length === 0) {
      const nearDog = livingNpcs().filter((ch) => ch.location === state.dog.location);
      const dogChance = state.activeOrders.includes("pairs") ? 0.09 : 0.16;
      if (nearDog.length && roll(dogChance)) {
        assimilate(pick(nearDog).id, "the dog");
        return;
      }
      if (roll(state.activeOrders.includes("pairs") ? 0.018 : 0.035)) {
        assimilate(pick(livingNpcs()).id, "an unseen kennel incident");
      }
      return;
    }

    const infected = infectedHumans();
    infected.forEach((source) => {
      const room = occupantsAt(source.location, false).filter((ch) => ch.id !== source.id && !ch.assimilated);
      const isolated = room.length === 1 && occupantsAt(source.location).length <= 2;
      const orderCut = (state.activeOrders.includes("pairs") ? 0.05 : 0) + (state.activeOrders.includes("cans") ? 0.015 : 0);
      if (room.length && roll(Math.max(0.01, (isolated ? 0.18 : 0.045) - orderCut))) {
        assimilate(pick(room).id, source.id);
      }
    });
  }

  function assimilate(victimId, source) {
    if (victimId === state.playerId) return;
    const victim = state.characters[victimId];
    if (!victim || !victim.alive || victim.assimilated) return;
    victim.assimilated = true;
    victim.suspicion = clamp(victim.suspicion + 18 + Math.floor(Math.random() * 18), 0, 100);
    victim.stress = clamp(victim.stress - 10, 0, 100);
    state.publicRep = clamp(state.publicRep - 1, 0, 100);
    const locName = locationById[victim.location].name;
    addLog(`Something went wrong near ${locName}.`);
    rememberEvent(`Something went wrong near ${locName}.`, victim.location, [victimId], "assimilation");
    addClue(`${locName}: a small sign does not fit the room anymore.`, "recent", "clue");

    const playerLoc = state.currentLocation;
    const close = playerLoc === victim.location || locationById[playerLoc].exits.includes(victim.location);
    if (close || roll(0.5)) {
      addClue(`${locName}: a private moment no longer matches later alibis.`, "alibi", "danger");
      notice("A story just cracked.", "danger");
    }
    maybeWitnessAlarm(victimId, source);
    if (source) addLog(`The infection may have spread from ${characterById[source]?.name || source}.`);
  }

  function maybeWitnessAlarm(victimId, source) {
    const victim = state.characters[victimId];
    const witnesses = occupantsAt(victim.location, false).filter((person) => {
      return person.id !== victimId && !person.assimilated && person.alive;
    });
    if (!witnesses.length) return;
    const witness = pick(witnesses);
    const chance = 0.28 + (characterById[witness.id].stats.nerve / 300);
    if (!roll(chance)) return;
    witness.alarmed = true;
    witness.stress = clamp(witness.stress + 18, 0, 100);
    state.alarm = { day: state.day, time: timeLabel(), locationId: victim.location, witnessId: witness.id, victimId };
    state.publicRep = clamp(state.publicRep + (state.playerId === witness.id ? 8 : 3), 0, 100);
    addClue(`${characterById[witness.id].name} saw enough near ${locationById[victim.location].name} to raise hell.`, "recent", "danger");
    addLog(`${characterById[witness.id].name} raises the alarm.`);
    rememberEvent(`${characterById[witness.id].name} raised the alarm.`, victim.location, [witness.id, victimId, source].filter(Boolean), "alarm");
    notice("Alarm. Someone saw something.", "danger");
  }

  function maybeStressEvent() {
    livingNpcs().forEach((chState) => {
      const ch = characterById[chState.id];
      if (chState.assimilated) return;
      const stressChance = (chState.stress - 72) / 500;
      if (chState.stress > 72 && roll(stressChance)) {
        if (ch.id === "blair" && !chState.breakdown) {
          chState.breakdown = true;
          chState.location = "tool-shed";
          chState.friendship -= 20;
          chState.suspicion += 8;
          addLog("Blair has barricaded himself near the Tool Shed after a breakdown.");
          notice("Blair has gone off alone with too many conclusions.", "danger");
          return;
        }
        if (chState.stress > 94 && roll(0.12)) {
          chState.alive = false;
          chState.location = "burn-pit";
          addLog(`${ch.name} is found dead after a private collapse.`);
          notice(`${ch.name} did not survive the pressure.`, "danger");
          increaseStationStress(8);
        } else {
          chState.enemy = true;
          chState.friendship = clamp(chState.friendship - 16, -100, 100);
          addLog(`${ch.name} snaps at the room and stops cooperating.`);
          notice(`${ch.name} is close to breaking.`, "social");
        }
      }
    });
  }

  function increaseStationStress(amount) {
    Object.values(state.characters).forEach((ch) => {
      if (ch.alive && !ch.assimilated) ch.stress = clamp(ch.stress + amount, 0, 100);
    });
  }

  function inspectLocation() {
    const loc = locationById[state.currentLocation];
    let possible = cluePool.filter((clue) => loc.tags.includes(clue.tag));
    if (state.day < 2) possible = possible.filter((clue) => !["blood", "dog"].includes(clue.tag));
    if (!possible.length) {
      possible = [{ text: "You learn the route, the door noise, and where someone could hide for a few seconds.", question: "alibi", type: "clue" }];
    }
    const clue = pick(possible);
    addClue(`${loc.name}: ${clue.text}`, clue.question, clue.type);
    notice(clue.text, clue.type);
    passTime(18, true);
  }

  function listenNearby() {
    const loc = locationById[state.currentLocation];
    const rooms = [loc.id, ...loc.exits];
    const candidates = rooms.flatMap((id) => {
      const people = occupantsAt(id, false);
      return people.length >= 2 ? [{ id, people }] : [];
    });

    if (!candidates.length) {
      addClue("No voices nearby, just the station settling in the cold.", "noise", "cold");
      notice("No voices. Just pipes and wind.", "cold");
      passTime(12, true);
      return;
    }

    const scene = pick(candidates);
    const [a, b] = scene.people.sort(() => Math.random() - 0.5);
    const line = makeConversation(a.id, b.id, scene.id);
    addClue(line.clue, line.question, line.type);
    notice(line.notice, line.type);
    passTime(14, true);
  }

  function makeConversation(aId, bId, roomId) {
    const a = characterById[aId];
    const b = characterById[bId];
    const infectedInTalk = [state.characters[aId], state.characters[bId]].some((ch) => ch.assimilated);
    if (infectedInTalk && roll(0.45)) {
      return {
        clue: `${locationById[roomId].name}: ${a.name} and ${b.name} stop talking the instant footsteps pass.`,
        question: "noise",
        type: "danger",
        notice: "A conversation dies too quickly."
      };
    }
    const topics = [
      `${a.name} tells ${b.name} to stop moving alone after dark.`,
      `${a.name} asks ${b.name} whether anyone checked the generator log.`,
      `${a.name} and ${b.name} argue about who last saw the dog.`,
      `${a.name} says somebody has been leaving doors unlatched.`
    ];
    const text = `${locationById[roomId].name}: ${pick(topics)}`;
    return {
      clue: text,
      question: roll(0.5) ? "alibi" : "dog",
      type: "clue",
      notice: "You catch a useful piece of a low conversation."
    };
  }

  function scavenge() {
    const loc = locationById[state.currentLocation];
    const roomItems = state.roomLoot[loc.id] || [];
    if (roomItems.length) {
      pickUpLoot(roomItems[0]);
      passTime(10, true);
      return;
    }
    const finds = [];
    if (loc.tags.includes("coat")) finds.push("Spare parka");
    if (loc.tags.includes("fuel")) finds.push("Fuel can", "Flares");
    if (loc.tags.includes("tools")) finds.push("Torch", "Wire", "Crowbar");
    if (loc.tags.includes("supply")) finds.push("Rope", "Flares", "Blood kit");
    const item = finds.find((name) => !state.inventory.includes(name)) || pick(finds.length ? finds : ["Rag"]);
    if (!state.inventory.includes(item)) state.inventory.push(item);
    addLog(`Found ${item} in ${loc.name}.`);
    notice(`Found ${item}.`, item.includes("Flare") || item.includes("Fuel") || item.includes("Torch") ? "good" : "clue");
    passTime(16, true);
  }

  function renderRoomLoot() {
    const host = $("roomLootList");
    if (!host) return;
    const items = state.roomLoot[state.currentLocation] || [];
    host.innerHTML = items.map((item) => `<button type="button" class="loot-pill" data-loot="${item}">${item}</button>`).join("");
    host.querySelectorAll("[data-loot]").forEach((button) => {
      button.addEventListener("click", () => {
        pickUpLoot(button.dataset.loot);
        renderGame();
      });
    });
  }

  function pickUpLoot(item) {
    const loc = state.currentLocation;
    const items = state.roomLoot[loc] || [];
    if (!items.includes(item)) return;
    state.roomLoot[loc] = items.filter((entry) => entry !== item);
    state.inventory = uniq([...state.inventory, item]);
    addLog(`Picked up ${item} in ${locationById[loc].name}.`);
    rememberEvent(`${characterById[state.playerId].name} picked up ${item}.`, loc, [state.playerId], "item");
    notice(`${item} taken.`, "good");
  }

  function dropInventoryItem(item, locationId = state.currentLocation) {
    if (!state.inventory.includes(item)) return false;
    state.inventory = state.inventory.filter((entry) => entry !== item);
    state.roomLoot[locationId] = uniq([...(state.roomLoot[locationId] || []), item]);
    addLog(`Dropped ${item} in ${locationById[locationId].name}.`);
    rememberEvent(`${characterById[state.playerId].name} left ${item}.`, locationId, [state.playerId], "item");
    notice(`${item} left in ${locationById[locationId].name}.`, "clue");
    return true;
  }

  function bloodTest(targetId = null) {
    const people = occupantsAt(state.currentLocation, false);
    if (!people.length) {
      notice("No one else is here to test.", "social");
      return;
    }
    if (!state.inventory.includes("Blood kit") && !["copper", "fuchs", "blair"].includes(state.playerId)) {
      notice("You need a blood kit or a medical hand for this.", "cold");
      return;
    }
    const target = targetId ? state.characters[targetId] : pick(people);
    if (!target || target.location !== state.currentLocation || !target.alive || target.id === state.playerId) {
      notice("No clean test target.", "cold");
      return;
    }
    const ch = characterById[target.id];
    addLog(`Blood test attempted on ${ch.name}.`);
    passTime(22, true);
    if (target.assimilated) {
      target.exposed = true;
      state.publicRep = clamp(state.publicRep + 14, 0, 100);
      addClue(`${ch.name}'s blood reacts wrong to heat.`, "blood", "danger");
      notice(`${ch.name}'s sample reacts.`, "danger");
      showThingModal(ch.name, "The room understands before anyone speaks. Fire is the only way to end this.");
    } else {
      target.suspicion = clamp(target.suspicion - 18, 0, 100);
      target.friendship = clamp(target.friendship + 10, -100, 100);
      state.publicRep = clamp(state.publicRep + 3, 0, 100);
      notice(`${ch.name}'s blood stays ordinary. For now, that means something.`, "good");
    }
  }

  function useRadio() {
    if (!locationById[state.currentLocation].tags.includes("radio")) return;
    passTime(24, true);
    if (state.day < 2) {
      addClue("The radio gives only dead air and weather chatter.", "noise", "cold");
      notice("Dead air. Nothing useful yet.", "cold");
      return;
    }
    if (roll(0.35)) {
      addClue("A burst of static masks a short transmission inside the station band.", "noise", "clue");
      notice("A station-band burst cuts through the static.", "clue");
    } else {
      notice("No rescue signal. No clean channel.", "cold");
    }
  }

  function warmUp() {
    state.exposure = Math.max(0, state.exposure - 12);
    const player = state.characters[state.playerId];
    player.stress = Math.max(0, player.stress - 3);
    notice("The heat comes back slowly and painfully.", "good");
    passTime(20, true);
  }

  function doPlayerTask() {
    const task = state.tasks[state.playerId];
    if (!task || task.done) return;
    if (task.loc !== state.currentLocation) {
      notice(`Your job is at ${locationById[task.loc].name}.`, "cold");
      return;
    }
    const ch = characterById[state.playerId];
    const score = ch.stats[task.skill] || 50;
    const good = roll(0.45 + score / 180);
    task.done = true;
    state.characters[state.playerId].taskDone = true;
    state.publicRep = clamp(state.publicRep + (good ? 6 : 2), 0, 100);
    addLog(`${ch.name} finishes daily work: ${task.label}.`);
    rememberEvent(`${ch.name} handled ${task.label.toLowerCase()}.`, state.currentLocation, [state.playerId], "task");
    notice(good ? "Job done clean." : "Job done, barely.", good ? "good" : "clue");
    passTime(40, true);
  }

  function updateNpcTasks(minutes) {
    livingNpcs().forEach((chState) => {
      const task = state.tasks[chState.id];
      if (!task || task.done || task.failed) return;
      if (chState.location === task.loc && roll((minutes / 180) + (chState.assimilated ? 0.03 : 0.18))) {
        task.done = true;
        chState.taskDone = true;
        if (!chState.assimilated) state.publicRep = clamp(state.publicRep + 1, 0, 100);
        rememberEvent(`${characterById[chState.id].name} finished ${task.label.toLowerCase()}.`, task.loc, [chState.id], "task");
      }
    });
  }

  function failOpenTasks() {
    Object.entries(state.tasks).forEach(([id, task]) => {
      if (task.done || task.failed) return;
      task.failed = true;
      const ch = characterById[id];
      const penalty = id === state.playerId ? 8 : 2;
      state.publicRep = clamp(state.publicRep - penalty, 0, 100);
      addLog(`${ch.name} missed daily work: ${task.label}.`);
      rememberEvent(`${ch.name} missed ${task.label.toLowerCase()}.`, task.loc, [id], "task");
    });
  }

  function renderTasks() {
    const host = $("taskList");
    if (!host) return;
    host.innerHTML = characterTemplates.map((ch) => {
      const task = state.tasks[ch.id];
      const mark = task.done ? "done" : task.failed ? "missed" : locationById[task.loc].name;
      return `<div class="journal-entry"><strong>${ch.name}</strong><br>${task.label}<br>${mark}</div>`;
    }).join("");
  }

  function renderOrders() {
    const host = $("ordersPanel");
    if (!host) return;
    const roomCount = occupantsAt(state.currentLocation, false).length + 1;
    if (roomCount < 3 || state.publicRep < 70) {
      host.innerHTML = "";
      return;
    }
    const available = orderTemplates.filter((order) => state.publicRep >= order.minRep && !state.activeOrders.includes(order.id));
    host.innerHTML = available.map((order) => `<button type="button" class="order-pill" data-order="${order.id}">${order.label}</button>`).join("");
    host.querySelectorAll("[data-order]").forEach((button) => {
      button.addEventListener("click", () => issueOrder(button.dataset.order));
    });
  }

  function issueOrder(orderId) {
    const order = orderTemplates.find((item) => item.id === orderId);
    if (!order || state.activeOrders.includes(orderId)) return;
    state.activeOrders.push(orderId);
    state.publicRep = clamp(state.publicRep - 4, 0, 100);
    addLog(`${characterById[state.playerId].name} gives an order: ${order.label}.`);
    rememberEvent(`Group order: ${order.label}.`, state.currentLocation, [state.playerId], "order");
    notice(order.label, "good");
    renderGame();
  }

  function startNight() {
    const alive = livingCharacters().length;
    const sleepers = alive >= 7;
    failOpenTasks();
    state.minute = 8 * 60;
    state.day += 1;
    state.weather = pick(weatherTable);
    state.exposure = 0;
    state.selectedTalkTarget = null;
    lastAnswer = "";

    if (sleepers) {
      livingCharacters().forEach((ch) => {
        if (roll(ch.id === state.playerId ? 0.9 : 0.82)) {
          ch.previousLocation = ch.location;
          ch.location = "sleeping-quarters";
        }
      });
      if (state.characters[state.playerId].location === "sleeping-quarters") {
        state.currentLocation = "sleeping-quarters";
      }
      addLog("The living settle into sleep in shifts.");
    } else {
      addLog("Too few are left for normal sleep. People stay scattered.");
    }

    const humanAssimilated = infectedHumans().length;
    let nightChance = 0;
    if (state.day > 2 && sleepers && humanAssimilated < 3 && (state.dog.assimilated || humanAssimilated > 0)) {
      nightChance = humanAssimilated === 0 ? 0.07 : humanAssimilated === 1 ? 0.09 : 0.04;
    }
    if (nightChance > 0 && roll(nightChance)) {
      const victimPool = livingNpcs().filter((ch) => !ch.assimilated);
      if (victimPool.length) assimilate(pick(victimPool).id, "the night watch");
    } else if (nightChance > 0) {
      addLog("Night passes with only bad dreams and worse breathing.");
    }

    if (state.day === 2 && !state.dog.assimilated) {
      infectDog();
    } else {
      notice(`Day ${state.day}. ${state.weather.name}. Count who is still breathing.`, "cold");
    }

    increaseStationStress(state.day > 2 ? 5 : 2);
    resetDailyTasks();
    checkEndings();
    renderGame();
  }

  function infectDog() {
    state.dog.assimilated = true;
    state.dog.location = "kennel";
    addLog("Day 2 begins with the dog incident in the Kennel.");
    addClue("The dog is alive, but the room feels wrong around it.", "dog", "danger");
    notice("The dog incident begins. The rules have changed.", "danger");
    showModal({
      image: asset("dog.png"),
      title: "Day 2: Kennel Incident",
      text: "One of the dogs is infected. From here, the station can change in any order. No man is scripted to be the Thing.",
      actions: [{ label: "Keep moving", handler: closeModal }]
    });
  }

  function accuseTarget(targetId = null) {
    targetId = targetId || ($("accuseTarget") ? $("accuseTarget").value : null);
    if (!targetId) return;
    const target = state.characters[targetId];
    const ch = characterById[targetId];
    if (!target.alive) return;
    if (target.location !== state.currentLocation) {
      notice(`${ch.name} is not in this room. Accusations need witnesses.`, "social");
      return;
    }

    passTime(10, true);
    if (target.assimilated) {
      target.exposed = true;
      target.suspicion = 100;
      state.publicRep = clamp(state.publicRep + 12, 0, 100);
      addLog(`${ch.name} is accused and the room turns against him.`);
      notice(`${ch.name} is cornered. Fire, or this gets worse.`, "danger");
      if (roll(0.65) || state.publicRep > 54 || target.friendship > -10) {
        berserk(targetId);
      }
    } else {
      target.friendship = clamp(target.friendship - 28, -100, 100);
      target.enemy = target.friendship < -35;
      state.publicRep = clamp(state.publicRep - 18, 0, 100);
      target.stress = clamp(target.stress + 12, 0, 100);
      addLog(`A false accusation against ${ch.name} damages your standing.`);
      notice(`${ch.name} is human, and everyone saw you push too hard.`, "social");
    }
    renderGame();
  }

  function burnTarget(targetId = null) {
    targetId = targetId || ($("accuseTarget") ? $("accuseTarget").value : null);
    if (!targetId) return;
    burnCharacter(targetId, state.inventory.find(isFireItem));
  }

  function burnCharacter(targetId, item = null) {
    const target = state.characters[targetId];
    const ch = characterById[targetId];
    if (!target || !target.alive) return;
    if (target.location !== state.currentLocation) {
      notice(`${ch.name} is not close enough.`, "cold");
      return;
    }
    const hasFire = item ? isFireItem(item) : state.inventory.some(isFireItem);
    if (!hasFire) {
      notice("You need fire. Nothing else truly ends it.", "danger");
      return;
    }
    passTime(12, true);
    if (target.assimilated) {
      target.alive = false;
      target.exposed = true;
      state.publicRep = clamp(state.publicRep + 18, 0, 100);
      addLog(`${ch.name} is destroyed with fire.`);
      notice(`${ch.name} burns. This one is truly dead.`, "good");
      rememberEvent(`${ch.name} burned in ${locationById[state.currentLocation].name}.`, state.currentLocation, [targetId, state.playerId], "fire");
      checkEndings();
    } else {
      target.alive = false;
      state.publicRep = clamp(state.publicRep - 45, 0, 100);
      increaseStationStress(18);
      addLog(`${ch.name} dies by your hand. The station will remember it.`);
      notice(`${ch.name} was human. Trust collapses.`, "danger");
      rememberEvent(`${ch.name} was killed by fire. Human.`, state.currentLocation, [targetId, state.playerId], "fire");
      checkEndings();
    }
    renderGame();
  }

  function berserk(targetId) {
    const target = state.characters[targetId];
    const ch = characterById[targetId];
    target.exposed = true;
    target.location = state.currentLocation;
    state.publicRep = clamp(state.publicRep + 5, 0, 100);
    increaseStationStress(10);
    const casualties = occupantsAt(state.currentLocation, false).filter((person) => person.id !== targetId && !person.assimilated);
    if (casualties.length && roll(0.32)) {
      const casualty = pick(casualties);
      casualty.alive = false;
      addLog(`${characterById[casualty.id].name} is killed in ${ch.name}'s rampage.`);
    }
    showThingModal(ch.name, `${ch.name} has no quiet option left and tears into the room. Fire is the only answer.`);
  }

  function showThingModal(name, text) {
    const images = ["thing-berserk-1.png", "thing-berserk-2.png", "thing-berserk-3.png"];
    showModal({
      image: asset(pick(images)),
      title: `${name} Is Not Human`,
      text,
      actions: [{ label: "Back away", handler: closeModal }]
    });
  }

  function checkEndings() {
    if (!state || state.gameOver) return;
    const threats = infectedHumans().length + (state.dog.alive && state.dog.assimilated ? 1 : 0);
    const living = livingCharacters();
    const others = living.filter((ch) => ch.id !== state.playerId);
    const livingHumanOthers = others.filter((ch) => !ch.assimilated);
    const livingInfectedOthers = others.filter((ch) => ch.assimilated);

    if (state.publicRep <= 3) {
      ending("ousted", "Ousted", "They take your tools and push you out of command. The station keeps moving without you.", "base-exterior.png");
      return;
    }

    if (state.day >= 2 && threats === 0 && state.dog.assimilated) {
      winGame();
      return;
    }

    if (state.day >= 2 && others.length === 1 && livingInfectedOthers.length === 1) {
      ending("movie", "Last Fire", "Only you and one other man remain. The wind takes the proof. You sit, watch, and wait.", "base-exterior.png");
      return;
    }

    if (state.day >= 2 && livingHumanOthers.length === 0 && livingInfectedOthers.length > 1) {
      ending("overrun", "Too Late", "Everyone left with you is wearing a borrowed face. The station goes quiet before the weather does.", "thing-berserk-3.png");
    }
  }

  function ending(kind, title, text, imageName) {
    state.gameOver = true;
    addLog(`Ending: ${kind}.`);
    showModal({
      image: asset(imageName),
      title,
      text,
      actions: [{ label: "Start over", handler: () => window.location.reload() }]
    });
  }

  function winGame() {
    state.gameOver = true;
    showModal({
      image: asset("base-exterior.png"),
      title: "Contained",
      text: "Every known infection is ash after day 2. No proof reaches the world. That has to be enough.",
      actions: [{ label: "Start over", handler: () => window.location.reload() }]
    });
  }

  function renderPlayerCard() {
    const ch = characterById[state.playerId];
    const st = state.characters[state.playerId];
    $("playerCard").innerHTML = `
      <img src="${asset(ch.portrait)}" alt="${ch.name}">
      <div>
        <h3>${ch.name}</h3>
        <p>${ch.role}</p>
        <div class="stat-bars">
          ${statBar("Nerve", ch.stats.nerve)}
          ${statBar("Warm", ch.stats.warmth)}
          ${statBar("Social", ch.stats.social)}
          ${statBar("Stress", st.stress)}
        </div>
      </div>
    `;
  }

  function statBar(label, value) {
    return `<div class="bar"><span>${label}</span><span style="--value:${clamp(value, 0, 100)}%"></span><span>${Math.round(value)}</span></div>`;
  }

  function renderRoster() {
    $("rosterList").innerHTML = characterTemplates.map((ch) => {
      const st = state.characters[ch.id];
      const dead = st.alive ? "" : " dead";
      const status = !st.alive ? "dead" : st.exposed ? "exposed" : st.enemy ? "enemy" : st.friendship > 35 ? "friend" : "alive";
      return `
        <div class="roster-row${dead}">
          <img src="${asset(ch.portrait)}" alt="${ch.name}">
          <span>
            <strong>${ch.name}</strong>
            <span>${locationById[st.location]?.name || "Unknown"} - ${status}</span>
            <span class="tagline"><em>Friend ${Math.round(st.friendship)}</em><em>Stress ${Math.round(st.stress)}</em></span>
          </span>
          <span class="suspicion">${Math.round(st.suspicion)}</span>
        </div>
      `;
    }).join("");
  }

  function renderJournal() {
    $("clueList").innerHTML = state.clues.length
      ? state.clues.map((clue) => `<div class="journal-entry"><strong>D${clue.day} ${clue.time}</strong><br>${clue.text}</div>`).join("")
      : `<div class="journal-entry">No clues yet. Inspect rooms, listen through walls, and ask specific questions.</div>`;
    $("eventLog").innerHTML = state.log.length
      ? state.log.map((event) => `<div class="journal-entry"><strong>D${event.day} ${event.time}</strong><br>${event.text}</div>`).join("")
      : `<div class="journal-entry">No incidents logged.</div>`;
  }

  function renderInventory() {
    $("inventoryList").innerHTML = state.inventory.map((item) => {
      const fire = ["Flamethrower", "Blowtorch", "Torch", "Flares", "Fuel can"].includes(item);
      const text = itemCatalog[item]?.text || (fire ? "Real heat." : "Useful if used in the right place.");
      return `<div class="inventory-item" draggable="true" data-item="${item}"><strong>${item}</strong><br>${text}</div>`;
    }).join("");
    $("inventoryList").querySelectorAll("[data-item]").forEach((item) => {
      item.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", item.dataset.item);
        $("boardDropHint").classList.remove("hidden");
      });
      item.addEventListener("dragend", () => $("boardDropHint").classList.add("hidden"));
    });
  }

  function allowToolDrop(event) {
    event.preventDefault();
  }

  function handleToolDrop(event, targetType, targetId) {
    event.preventDefault();
    $("boardDropHint").classList.add("hidden");
    const item = event.dataTransfer.getData("text/plain");
    if (!item || !state.inventory.includes(item)) return;
    useItemOnTarget(item, targetType, targetId);
    renderGame();
  }

  function isFireItem(item) {
    return ["Flamethrower", "Blowtorch", "Torch", "Flares", "Fuel can"].includes(item);
  }

  function useItemOnTarget(item, targetType, targetId) {
    if (targetType === "location") {
      if (item === "Keys" && ["manager-office", "specimen-lab", "supply-room-2"].includes(targetId)) {
        addClue(`${locationById[targetId].name}: a locked drawer gives up a useful check.`, "alibi", "clue");
        state.publicRep = clamp(state.publicRep + 2, 0, 100);
        notice("Unlocked.", "good");
        passTime(10, true);
        return;
      }
      dropInventoryItem(item, targetId);
      passTime(4, true);
      return;
    }

    if (targetType === "dog") {
      if (isFireItem(item) && state.dog.assimilated) {
        state.dog.alive = false;
        state.dog.revealed = true;
        addLog("The dog-thing burns.");
        rememberEvent("The dog burned in front of witnesses.", state.currentLocation, [state.playerId], "fire");
        notice("The dog burns. That smell stays.", "danger");
        passTime(12, true);
        checkEndings();
      } else {
        notice("The dog backs away.", "cold");
      }
      return;
    }

    const target = state.characters[targetId];
    if (!target || !target.alive || target.location !== state.currentLocation) {
      notice("Too far away.", "cold");
      return;
    }

    if (isFireItem(item)) {
      burnCharacter(targetId, item);
      return;
    }

    if (item === "Blood kit") {
      bloodTest(targetId);
      return;
    }

    if (item === "Rope") {
      target.friendship = clamp(target.friendship - 18, -100, 100);
      target.stress = clamp(target.stress + 10, 0, 100);
      target.enemy = target.friendship < -35;
      state.publicRep = clamp(state.publicRep - (target.assimilated ? 1 : 8), 0, 100);
      addLog(`${characterById[targetId].name} is restrained.`);
      rememberEvent(`${characterById[targetId].name} was tied down.`, state.currentLocation, [targetId, state.playerId], "restraint");
      notice(`${characterById[targetId].name} is restrained. Nobody likes it.`, "social");
      passTime(14, true);
      return;
    }

    if (["Medical kit", "Sedatives"].includes(item)) {
      target.stress = clamp(target.stress - 22, 0, 100);
      target.friendship = clamp(target.friendship + 8, -100, 100);
      addLog(`${characterById[state.playerId].name} treats ${characterById[targetId].name}.`);
      notice(`${characterById[targetId].name} steadies a little.`, "good");
      passTime(16, true);
      return;
    }

    state.inventory = state.inventory.filter((entry) => entry !== item);
    target.items.push(item);
    target.friendship = clamp(target.friendship + 4, -100, 100);
    rememberEvent(`${characterById[state.playerId].name} gave ${item} to ${characterById[targetId].name}.`, state.currentLocation, [state.playerId, targetId], "item");
    notice(`${item} handed over.`, "social");
  }

  function renderAccuseTargets() {
    const options = livingNpcs().map((ch) => `<option value="${ch.id}">${characterById[ch.id].name}</option>`);
    $("accuseTarget").innerHTML = options.join("");
  }

  function showModal({ image, title, text, actions }) {
    const host = $("modalHost");
    host.classList.remove("hidden");
    host.innerHTML = `
      <div class="modal">
        ${image ? `<img src="${image}" alt="">` : ""}
        <div class="modal-copy">
          <h3>${title}</h3>
          <p>${text}</p>
        </div>
        <div class="modal-actions">
          ${actions.map((action, index) => `<button type="button" data-modal-action="${index}">${action.label}</button>`).join("")}
        </div>
      </div>
    `;
    host.querySelectorAll("[data-modal-action]").forEach((button) => {
      button.addEventListener("click", () => actions[Number(button.dataset.modalAction)].handler());
    });
  }

  function closeModal() {
    $("modalHost").classList.add("hidden");
    $("modalHost").innerHTML = "";
    renderGame();
  }

  function showFatalError(error) {
    const message = error && error.message ? error.message : String(error);
    const host = $("selectionDetails");
    if (host) {
      host.innerHTML = `
        <h2>Startup Error</h2>
        <p>The page loaded, but the game script hit an error.</p>
        <div class="detail-row"><span>Error</span><strong>${message}</strong></div>
      `;
    }
    const select = $("characterSelect");
    if (select) {
      select.innerHTML = `<div class="journal-entry">Check that <strong>game.js</strong> is uploaded beside <strong>index.html</strong>, and that the browser console has no missing-file errors.</div>`;
    }
  }

  function wireStaticEvents() {
    $("waitButton").addEventListener("click", () => {
      passTime(30, true);
      renderGame();
    });
    $("sleepButton").addEventListener("click", () => startNight());
    $("journalToggle").addEventListener("click", () => $("intelPanel").classList.toggle("open"));
    $("inventoryToggle").addEventListener("click", () => $("inventoryDrawer").classList.toggle("open"));
    $("newRunButton").addEventListener("click", () => window.location.reload());
    if ($("accuseButton")) $("accuseButton").addEventListener("click", () => accuseTarget());
    if ($("burnButton")) $("burnButton").addEventListener("click", () => burnTarget());
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach((item) => item.classList.remove("active"));
        tab.classList.add("active");
        $(`tab-${tab.dataset.tab}`).classList.add("active");
      });
    });
  }

  function init() {
    renderSelection();
    wireStaticEvents();
  }

  window.addEventListener("error", (event) => showFatalError(event.error || event.message));
  document.addEventListener("DOMContentLoaded", () => {
    try {
      init();
    } catch (error) {
      showFatalError(error);
      throw error;
    }
  });
})();
