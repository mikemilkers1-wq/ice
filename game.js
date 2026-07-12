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
      clues: [],
      log: [],
      unlockedQuestions: new Set(["where", "doing", "thoughts"]),
      selectedTalkTarget: null,
      dog: { name: "Norwegian Dog", location: "kennel", alive: true, assimilated: false, revealed: false },
      gameOver: false,
      roundEvents: 0
    };
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
    addLog(`${characterById[playerId].name} takes stock of Outpost 31.`);
    notice("Day 1 is quiet. Learn the rooms, the routes, and who stands near whom.", "good");
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
      nodeLayer.appendChild(node);
    });
  }

  function renderGame() {
    if (!state) return;
    renderMeters();
    renderBoardState();
    renderScene();
    renderOccupants();
    renderDialogue();
    renderPlayerCard();
    renderRoster();
    renderJournal();
    renderInventory();
    renderAccuseTargets();
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
    token.innerHTML = `<img src="${asset(ch.portrait)}" alt="${ch.name}">`;
    layer.appendChild(token);
  }

  function addDogToken(layer, loc, dx, dy) {
    const token = document.createElement("div");
    token.className = `map-token ${state.dog.revealed ? "infected-glimpse" : ""}`;
    token.style.left = `calc(${loc.x}% + ${dx}px)`;
    token.style.top = `calc(${loc.y}% + ${dy}px)`;
    token.title = state.dog.assimilated ? "Dog?" : "Dog";
    token.innerHTML = `<img src="${asset(state.dog.revealed ? "thing-dog-berserk.png" : "dog.png")}" alt="Dog">`;
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
    $("locationActions").innerHTML = actionButtons.join("");
    $("locationActions").querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => handleAction(button.dataset.action));
    });
  }

  function renderOccupants() {
    const people = occupantsAt(state.currentLocation, false);
    const dogHere = state.dog.alive && state.dog.location === state.currentLocation;
    const rows = people.map((chState) => {
      const ch = characterById[chState.id];
      const rel = chState.enemy ? "enemy" : chState.friendship > 35 ? "friend" : chState.friendship < -20 ? "cold" : "uneasy";
      return `
        <button class="occupant-row" type="button" data-talk="${ch.id}">
          <img src="${asset(ch.portrait)}" alt="${ch.name}">
          <span><strong>${ch.name}</strong><span>${ch.role} - ${rel}</span></span>
        </button>
      `;
    });

    if (dogHere) {
      rows.push(`
        <div class="occupant-row">
          <img src="${asset(state.dog.revealed ? "thing-dog-berserk.png" : "dog.png")}" alt="Dog">
          <span><strong>${state.dog.revealed ? "The Dog-Thing" : "Norwegian Dog"}</strong><span>${state.dog.assimilated ? "too still" : "watching"}</span></span>
        </div>
      `);
    }

    $("occupantsList").innerHTML = rows.length ? rows.join("") : `<div class="journal-entry">No one else is here.</div>`;
    $("occupantsList").querySelectorAll("[data-talk]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedTalkTarget = button.dataset.talk;
        lastAnswer = "";
        renderDialogue();
      });
    });
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

  function askQuestion(targetId, question) {
    const chState = state.characters[targetId];
    const ch = characterById[targetId];
    let answer = "";
    const lying = chState.assimilated && roll(0.68);

    if (question === "where") {
      const place = locationById[lying ? pick(locations).id : chState.previousLocation].name;
      answer = lying
        ? `${ch.name} blinks once too slowly. "I was in ${place}. That should be enough."`
        : `"${ch.voice.alibi}" Last place I remember before here was ${place}.`;
      chState.friendship += lying ? -1 : 2;
    } else if (question === "doing") {
      answer = `"${ch.voice.doing}"`;
      chState.friendship += 1;
    } else if (question === "thoughts") {
      answer = `"${ch.voice.thoughts}"`;
      chState.friendship += chState.stress > 70 ? -1 : 2;
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
    renderGame();
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
      maybeThingEvent();
      maybeStressEvent();
      maybeRandomNoise();
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
      if (roll(0.46)) {
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
      if (nearDog.length && roll(0.16)) {
        assimilate(pick(nearDog).id, "the dog");
        return;
      }
      if (roll(0.035)) {
        assimilate(pick(livingNpcs()).id, "an unseen kennel incident");
      }
      return;
    }

    const infected = infectedHumans();
    infected.forEach((source) => {
      const room = occupantsAt(source.location, false).filter((ch) => ch.id !== source.id && !ch.assimilated);
      const isolated = room.length === 1 && occupantsAt(source.location).length <= 2;
      if (room.length && roll(isolated ? 0.18 : 0.045)) {
        assimilate(pick(room).id, characterById[source.id].name);
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
    addLog(`Something happened out of sight near ${locationById[victim.location].name}.`);

    const playerLoc = state.currentLocation;
    const close = playerLoc === victim.location || locationById[playerLoc].exits.includes(victim.location);
    if (close || roll(0.5)) {
      addClue(`A private moment near ${locationById[victim.location].name} does not line up with later alibis.`, "alibi", "danger");
      notice("Someone's story just became harder to believe.", "danger");
    }
    if (source) addLog(`The infection may have spread from ${source}.`);
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

  function bloodTest() {
    const people = occupantsAt(state.currentLocation, false);
    if (!people.length) {
      notice("No one else is here to test.", "social");
      return;
    }
    if (!state.inventory.includes("Blood kit") && !["copper", "fuchs", "blair"].includes(state.playerId)) {
      notice("You need a blood kit or a medical hand for this.", "cold");
      return;
    }
    const target = pick(people);
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

  function startNight() {
    const alive = livingCharacters().length;
    const sleepers = alive >= 7;
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

  function accuseTarget() {
    const targetId = $("accuseTarget").value;
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

  function burnTarget() {
    const targetId = $("accuseTarget").value;
    const target = state.characters[targetId];
    const ch = characterById[targetId];
    if (!target || !target.alive) return;
    if (target.location !== state.currentLocation) {
      notice(`${ch.name} is not close enough.`, "cold");
      return;
    }
    const hasFire = state.inventory.some((item) => ["Flamethrower", "Blowtorch", "Torch", "Flares", "Fuel can"].includes(item));
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
      if (infectedHumans().length === 0 && !state.dog.alive) {
        winGame();
      }
    } else {
      target.alive = false;
      state.publicRep = clamp(state.publicRep - 45, 0, 100);
      increaseStationStress(18);
      addLog(`${ch.name} dies by your hand. The station will remember it.`);
      notice(`${ch.name} was human. Trust collapses.`, "danger");
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

  function winGame() {
    state.gameOver = true;
    showModal({
      image: asset("base-exterior.png"),
      title: "Contained",
      text: "No exposed Thing remains alive. In this prototype, containment is enough to call it a win.",
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
      const text = fire ? "Can help destroy an exposed Thing." : item === "Parka" || item === "Spare parka" ? "Reduces frost exposure outside." : "Useful in station actions.";
      return `<div class="inventory-item"><strong>${item}</strong><br>${text}</div>`;
    }).join("");
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
    $("newRunButton").addEventListener("click", () => window.location.reload());
    $("accuseButton").addEventListener("click", accuseTarget);
    $("burnButton").addEventListener("click", burnTarget);
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
