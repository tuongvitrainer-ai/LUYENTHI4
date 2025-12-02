import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RefreshCcw, 
  Lightbulb,
  Award,
  Target
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Progress, 
  Tabs, 
  Tag, 
  Modal, 
  ConfigProvider, 
  Radio, 
  Statistic,
  message 
} from 'antd';

// --- DATA SOURCE (Copied and adapted from original HTML) ---
const QUESTION_BANK = {
  english: [
    // EASY
    { q: "Yesterday, I _____ to the park.", options: ["go", "went", "goes", "going"], answer: 1, difficulty: "easy", hint: "Look for 'yesterday' → past tense: go → went" },
    { q: "Last week, she _____ a beautiful butterfly.", options: ["see", "saw", "seed", "sees"], answer: 1, difficulty: "easy", hint: "Look for 'last week' → irregular verb: see → saw" },
    { q: "They _____ pizza for dinner last night.", options: ["eat", "eats", "ate", "eating"], answer: 2, difficulty: "easy", hint: "Look for 'last night' → eat → ate" },
    { q: "He _____ his homework last night.", options: ["do", "does", "did", "doing"], answer: 2, difficulty: "easy", hint: "Look for 'last night' → do → did" },
    { q: "We _____ TV yesterday.", options: ["watch", "watched", "watches", "watching"], answer: 1, difficulty: "easy", hint: "Look for 'yesterday' → regular verb: add -ed" },
    { q: "Yesterday, the cat _____ all the milk.", options: ["drink", "drank", "drinks", "drinking"], answer: 1, difficulty: "easy", hint: "Look for 'yesterday' → drink → drank" },
    { q: "I _____ my friend yesterday.", options: ["meet", "met", "meets", "meeting"], answer: 1, difficulty: "easy", hint: "Look for 'yesterday' → meet → met" },
    { q: "Last Saturday, she _____ a nice dress.", options: ["wear", "wears", "wore", "wearing"], answer: 2, difficulty: "easy", hint: "Look for 'last Saturday' → wear → wore" },
    { q: "They _____ soccer last week.", options: ["play", "played", "plays", "playing"], answer: 1, difficulty: "easy", hint: "Look for 'last week' → add -ed" },
    { q: "This morning, the bird _____ away.", options: ["fly", "flies", "flew", "flying"], answer: 2, difficulty: "easy", hint: "Look for 'this morning' → fly → flew" },
    { q: "I _____ my teeth this morning.", options: ["brush", "brushed", "brushes", "brushing"], answer: 1, difficulty: "easy", hint: "Look for 'this morning' → add -ed" },
    { q: "Yesterday, he _____ a big fish.", options: ["catch", "catches", "caught", "catching"], answer: 2, difficulty: "easy", hint: "Look for 'yesterday' → catch → caught" },
    { q: "Last night, we _____ at the funny movie.", options: ["laugh", "laughed", "laughs", "laughing"], answer: 1, difficulty: "easy", hint: "Look for 'last night' → regular verb + -ed" },
    { q: "Last Monday, she _____ a letter to her friend.", options: ["write", "writes", "wrote", "writing"], answer: 2, difficulty: "easy", hint: "Look for 'last Monday' → write → wrote" },
    { q: "Yesterday, the dog _____ very fast.", options: ["run", "runs", "ran", "running"], answer: 2, difficulty: "easy", hint: "Look for 'yesterday' → run → ran" },
    { q: "This morning, I _____ orange juice for breakfast.", options: ["drink", "drank", "drinks", "drinking"], answer: 1, difficulty: "easy", hint: "Look for 'this morning' → drink → drank" },
    { q: "Last weekend, they _____ to music.", options: ["listen", "listened", "listens", "listening"], answer: 1, difficulty: "easy", hint: "Look for 'last weekend' → add -ed" },
    { q: "Last month, he _____ a new book.", options: ["buy", "buys", "bought", "buying"], answer: 2, difficulty: "easy", hint: "Look for 'last month' → buy → bought" },
    { q: "Yesterday, we _____ in the pool.", options: ["swim", "swims", "swam", "swimming"], answer: 2, difficulty: "easy", hint: "Look for 'yesterday' → swim → swam" },
    { q: "Last night, she _____ loudly.", options: ["sing", "sings", "sang", "singing"], answer: 2, difficulty: "easy", hint: "Look for 'last night' → sing → sang" },
    // MEDIUM
    { q: "Did she _____ to school yesterday?", options: ["go", "went", "goes", "going"], answer: 0, difficulty: "medium", hint: "After 'Did' ALWAYS use base form" },
    { q: "Last year, the astronaut _____ many stars in space.", options: ["see", "saw", "sees", "seeing"], answer: 1, difficulty: "medium", hint: "Look for 'last year' → saw" },
    { q: "They _____ their grandparents last weekend.", options: ["visit", "visited", "visits", "visiting"], answer: 1, difficulty: "medium", hint: "Look for 'last weekend' → add -ed" },
    { q: "Choose the correct question: '_____ he do his homework yesterday?'", options: ["Did", "Does", "Do", "Done"], answer: 0, difficulty: "medium", hint: "Use 'Did' for past questions" },
    { q: "The spaceship was big _____ it was slow.", options: ["and", "but", "or", "because"], answer: 1, difficulty: "medium", hint: "Contrasting ideas → 'but'" },
    { q: "She came home early _____ she was tired.", options: ["and", "but", "or", "because"], answer: 3, difficulty: "medium", hint: "Explaining reason → 'because'" },
    { q: "I _____ my keys this morning.", options: ["lose", "lost", "loses", "losing"], answer: 1, difficulty: "medium", hint: "lose → lost" },
    { q: "Last year, they _____ English at school.", options: ["learn", "learned", "learns", "learning"], answer: 1, difficulty: "medium", hint: "regular verb + -ed" },
    { q: "Yesterday, he _____ the ball very far.", options: ["throw", "throws", "threw", "throwing"], answer: 2, difficulty: "medium", hint: "throw → threw" },
    { q: "We _____ our room yesterday.", options: ["clean", "cleaned", "cleans", "cleaning"], answer: 1, difficulty: "medium", hint: "add -ed" },
    { q: "Last summer, the sun _____ brightly every day.", options: ["shine", "shines", "shone", "shining"], answer: 2, difficulty: "medium", hint: "shine → shone" },
    { q: "What does 'astronaut' mean?", options: ["A space car", "A person who travels in space", "A planet", "A star"], answer: 1, difficulty: "medium", hint: "Space traveler" },
    { q: "What is 'gravity'?", options: ["A planet", "A force that pulls things down", "A spaceship", "The moon"], answer: 1, difficulty: "medium", hint: "Pulling force" },
    { q: "Dragons have sharp _____ on their feet.", options: ["scales", "claws", "horns", "wings"], answer: 1, difficulty: "medium", hint: "Sharp nails on feet" },
    { q: "The word 'fierce' means:", options: ["Kind and gentle", "Scary and aggressive", "Small and cute", "Slow and lazy"], answer: 1, difficulty: "medium", hint: "Scary, aggressive" },
    { q: "'Launch' means to _____ a spaceship.", options: ["land", "send into space", "repair", "build"], answer: 1, difficulty: "medium", hint: "Send up" },
    { q: "Last Sunday, she _____ her bicycle to school.", options: ["ride", "rides", "rode", "riding"], answer: 2, difficulty: "medium", hint: "ride → rode" },
    { q: "They _____ a cake for mom's birthday last week.", options: ["make", "makes", "made", "making"], answer: 2, difficulty: "medium", hint: "make → made" },
    { q: "I _____ cold yesterday evening.", options: ["feel", "feels", "felt", "feeling"], answer: 2, difficulty: "medium", hint: "feel → felt" },
    { q: "He _____ me his name last Monday.", options: ["tell", "tells", "told", "telling"], answer: 2, difficulty: "medium", hint: "tell → told" },
    // HARD
    { q: "Which sentence uses Direct Speech correctly?", options: ["I am hungry, said Anna.", "\"I am hungry,\" said Anna.", "\"I am hungry, said Anna.\"", "I am hungry said Anna."], answer: 1, difficulty: "hard", hint: "Quotation marks \" \"" },
    { q: "Complete: 'Did you _____ the movie last night?' 'Yes, I _____.'", options: ["saw / did", "see / did", "saw / do", "see / do"], answer: 1, difficulty: "hard", hint: "Did + base form" },
    { q: "Choose the IRREGULAR verb in past tense:", options: ["walked", "jumped", "flew", "played"], answer: 2, difficulty: "hard", hint: "Not ending in -ed" },
    { q: "Which conjunction fits? 'He was tired _____ he kept working.'", options: ["and", "but", "or", "so"], answer: 1, difficulty: "hard", hint: "Contrast → 'but'" },
    { q: "Past tense of 'bring' is:", options: ["bringed", "brought", "brang", "brung"], answer: 1, difficulty: "hard", hint: "bring → brought" },
    { q: "Past tense of 'spend' is:", options: ["spended", "spent", "spend", "spending"], answer: 1, difficulty: "hard", hint: "spend → spent" },
    { q: "Choose the correct NEGATIVE sentence in past tense:", options: ["She didn't went.", "She didn't go.", "She doesn't went.", "She don't go."], answer: 1, difficulty: "hard", hint: "Didn't + base form" },
    { q: "Complete: 'Last night, the dragon _____ fire _____ it was angry.'", options: ["breathe / and", "breathed / because", "breathes / but", "breathing / or"], answer: 1, difficulty: "hard", hint: "Past tense + reason" },
    { q: "Which word means 'the outer layer of a dragon's body'?", options: ["claws", "scales", "horns", "wings"], answer: 1, difficulty: "hard", hint: "Protective layer" },
    { q: "Rewrite in past tense: 'I know the answer.'", options: ["I knowed the answer", "I knew the answer", "I know the answer", "I known the answer"], answer: 1, difficulty: "hard", hint: "know → knew" },
  ],
  math: [
    // EASY
    { q: "15 + 8 = ?", options: ["21", "22", "23", "24"], answer: 2, difficulty: "easy", hint: "Count up from 15" },
    { q: "30 - 12 = ?", options: ["16", "17", "18", "19"], answer: 2, difficulty: "easy", hint: "Subtract 10 then 2" },
    { q: "Double of 7 is:", options: ["12", "13", "14", "15"], answer: 2, difficulty: "easy", hint: "7 + 7" },
    { q: "3 × 5 = ?", options: ["13", "14", "15", "16"], answer: 2, difficulty: "easy", hint: "5 + 5 + 5" },
    { q: "20 ÷ 4 = ?", options: ["4", "5", "6", "7"], answer: 1, difficulty: "easy", hint: "How many 4s in 20?" },
    { q: "Half of 16 is:", options: ["6", "7", "8", "9"], answer: 2, difficulty: "easy", hint: "8 + 8 = 16" },
    { q: "4 × 3 = ?", options: ["10", "11", "12", "13"], answer: 2, difficulty: "easy", hint: "4 + 4 + 4" },
    { q: "25 + 15 = ?", options: ["38", "39", "40", "41"], answer: 2, difficulty: "easy", hint: "20+10 and 5+5" },
    { q: "50 - 20 = ?", options: ["28", "29", "30", "31"], answer: 2, difficulty: "easy", hint: "5 - 2 = 3" },
    { q: "Double of 12 is:", options: ["22", "23", "24", "25"], answer: 2, difficulty: "easy", hint: "12 + 12" },
    { q: "6 × 2 = ?", options: ["10", "11", "12", "13"], answer: 2, difficulty: "easy", hint: "6 + 6" },
    { q: "18 ÷ 3 = ?", options: ["5", "6", "7", "8"], answer: 1, difficulty: "easy", hint: "6 + 6 + 6 = 18" },
    { q: "10 + 10 + 10 = ?", options: ["28", "29", "30", "31"], answer: 2, difficulty: "easy", hint: "Count by 10s" },
    { q: "Half of 20 is:", options: ["8", "9", "10", "11"], answer: 2, difficulty: "easy", hint: "10 + 10 = 20" },
    { q: "5 × 4 = ?", options: ["18", "19", "20", "21"], answer: 2, difficulty: "easy", hint: "Count by 5s" },
    { q: "100 - 50 = ?", options: ["48", "49", "50", "51"], answer: 2, difficulty: "easy", hint: "Half of 100" },
    { q: "7 × 3 = ?", options: ["19", "20", "21", "22"], answer: 2, difficulty: "easy", hint: "7 + 7 + 7" },
    { q: "45 + 5 = ?", options: ["48", "49", "50", "51"], answer: 2, difficulty: "easy", hint: "Next ten" },
    { q: "36 ÷ 4 = ?", options: ["7", "8", "9", "10"], answer: 2, difficulty: "easy", hint: "9 × 4 = 36" },
    { q: "Double of 25 is:", options: ["48", "49", "50", "51"], answer: 2, difficulty: "easy", hint: "Two quarters" },
    // MEDIUM
    { q: "245 + 138 = ?", options: ["373", "383", "393", "403"], answer: 1, difficulty: "medium", hint: "Column addition" },
    { q: "567 - 239 = ?", options: ["318", "328", "338", "348"], answer: 1, difficulty: "medium", hint: "Borrow from tens" },
    { q: "8 × 7 = ?", options: ["54", "55", "56", "57"], answer: 2, difficulty: "medium", hint: "56" },
    { q: "72 ÷ 8 = ?", options: ["7", "8", "9", "10"], answer: 2, difficulty: "medium", hint: "9" },
    { q: "345 + 267 = ?", options: ["602", "612", "622", "632"], answer: 1, difficulty: "medium", hint: "Watch the carry" },
    { q: "9 × 6 = ?", options: ["52", "53", "54", "55"], answer: 2, difficulty: "medium", hint: "54" },
    { q: "Half of 150 is:", options: ["73", "74", "75", "76"], answer: 2, difficulty: "medium", hint: "75 + 75 = 150" },
    { q: "12 × 4 = ?", options: ["46", "47", "48", "49"], answer: 2, difficulty: "medium", hint: "48" },
    { q: "456 - 178 = ?", options: ["276", "277", "278", "279"], answer: 2, difficulty: "medium", hint: "Check units digit" },
    { q: "15 × 3 = ?", options: ["43", "44", "45", "46"], answer: 2, difficulty: "medium", hint: "45" },
    { q: "A table is 150 cm long and 80 cm wide. Difference?", options: ["60", "70", "80", "90"], answer: 1, difficulty: "medium", hint: "150 - 80" },
    { q: "5 cm = _____ mm", options: ["5", "50", "500", "5000"], answer: 1, difficulty: "medium", hint: "x 10" },
    { q: "200 cm = _____ m", options: ["0.2", "2", "20", "200"], answer: 1, difficulty: "medium", hint: "÷ 100" },
    { q: "What time is 'quarter past 3'?", options: ["2:45", "3:15", "3:30", "3:45"], answer: 1, difficulty: "medium", hint: "15 mins after 3" },
    { q: "What time is 'half past 7'?", options: ["6:30", "7:00", "7:30", "8:00"], answer: 2, difficulty: "medium", hint: "30 mins after 7" },
    { q: "A pentagon has _____ sides.", options: ["4", "5", "6", "8"], answer: 1, difficulty: "medium", hint: "Penta = 5" },
    { q: "A hexagon has _____ sides.", options: ["4", "5", "6", "7"], answer: 2, difficulty: "medium", hint: "Hexa = 6" },
    { q: "A right angle measures _____ degrees.", options: ["45", "90", "180", "360"], answer: 1, difficulty: "medium", hint: "Corner of a square" },
    { q: "Double of 45 is:", options: ["80", "85", "90", "95"], answer: 2, difficulty: "medium", hint: "90" },
    { q: "Half of 88 is:", options: ["42", "43", "44", "45"], answer: 2, difficulty: "medium", hint: "44" },
    // HARD
    { q: "12 astronauts need 4 bottles each. Total bottles?", options: ["44", "46", "48", "50"], answer: 2, difficulty: "hard", hint: "12 × 4" },
    { q: "Travels 345 km and 278 km. Total?", options: ["613", "623", "633", "643"], answer: 1, difficulty: "hard", hint: "Addition" },
    { q: "600 food packets. Half eaten. Left?", options: ["250", "300", "350", "400"], answer: 1, difficulty: "hard", hint: "600 ÷ 2" },
    { q: "7 × 100 = ?", options: ["70", "700", "7000", "70000"], answer: 1, difficulty: "hard", hint: "Add two zeros" },
    { q: "854 - 367 = ?", options: ["477", "487", "497", "507"], answer: 1, difficulty: "hard", hint: "Borrowing" },
    { q: "What time is 'quarter to 11'?", options: ["10:15", "10:30", "10:45", "11:15"], answer: 2, difficulty: "hard", hint: "15 mins before 11" },
    { q: "A quadrilateral has _____ sides.", options: ["3", "4", "5", "6"], answer: 1, difficulty: "hard", hint: "Quad = 4" },
    { q: "150 mm = _____ cm", options: ["1.5", "15", "150", "1500"], answer: 1, difficulty: "hard", hint: "÷ 10" },
    { q: "3 × 3 × 3 = ?", options: ["9", "18", "27", "36"], answer: 2, difficulty: "hard", hint: "27" },
    { q: "If a pattern is +5 each time, what comes after 23?", options: ["26", "27", "28", "29"], answer: 2, difficulty: "hard", hint: "23 + 5" },
  ],
  science: [
    // EASY
    { q: "Which part of a plant takes water from soil?", options: ["Leaves", "Roots", "Flower", "Stem"], answer: 1, difficulty: "easy", hint: "Underground part" },
    { q: "What do leaves do?", options: ["Absorb water", "Make food using sunlight", "Hold the plant", "Make seeds"], answer: 1, difficulty: "easy", hint: "Photosynthesis" },
    { q: "Animals that eat ONLY plants are called:", options: ["Carnivores", "Herbivores", "Omnivores", "Predators"], answer: 1, difficulty: "easy", hint: "Herb = plants" },
    { q: "Animals that eat ONLY meat are called:", options: ["Herbivores", "Carnivores", "Omnivores", "Prey"], answer: 1, difficulty: "easy", hint: "Carn = meat" },
    { q: "Hot rock INSIDE a volcano is called:", options: ["Lava", "Magma", "Ash", "Crater"], answer: 1, difficulty: "easy", hint: "Inside = Magma" },
    { q: "Hot rock that flows OUT of a volcano is:", options: ["Magma", "Lava", "Ash", "Smoke"], answer: 1, difficulty: "easy", hint: "Outside = Lava" },
    { q: "The opening at the top of a volcano is:", options: ["Magma", "Lava", "Crater", "Ash"], answer: 2, difficulty: "easy", hint: "Bowl shape" },
    { q: "Which animal is a herbivore?", options: ["Lion", "Rabbit", "Tiger", "Shark"], answer: 1, difficulty: "easy", hint: "Eats carrots/grass" },
    { q: "Which animal is a carnivore?", options: ["Cow", "Sheep", "Lion", "Rabbit"], answer: 2, difficulty: "easy", hint: "King of jungle" },
    { q: "Bears eat plants AND meat. They are:", options: ["Herbivores", "Carnivores", "Omnivores", "Producers"], answer: 2, difficulty: "easy", hint: "Omni = all" },
    { q: "The stem of a plant:", options: ["Makes food", "Absorbs water", "Supports the plant", "Makes seeds"], answer: 2, difficulty: "easy", hint: "Backbone of plant" },
    { q: "Flowers help plants to:", options: ["Absorb water", "Make seeds", "Get sunlight", "Stand tall"], answer: 1, difficulty: "easy", hint: "Reproduction" },
    { q: "What is ash from a volcano?", options: ["Hot water", "Powder from explosion", "Hard rock", "Cold air"], answer: 1, difficulty: "easy", hint: "Dust" },
    { q: "Plants need _____ to make food.", options: ["Darkness", "Sunlight", "Rain only", "Animals"], answer: 1, difficulty: "easy", hint: "Solar power" },
    { q: "Which is NOT a part of a plant?", options: ["Root", "Leaf", "Fur", "Stem"], answer: 2, difficulty: "easy", hint: "Animals have fur" },
    { q: "Humans are:", options: ["Herbivores", "Carnivores", "Omnivores", "Plants"], answer: 2, difficulty: "easy", hint: "We eat salad and steak" },
    { q: "Which animal has sharp teeth for meat?", options: ["Cow", "Tiger", "Sheep", "Horse"], answer: 1, difficulty: "easy", hint: "Big cat" },
    { q: "Cows have flat teeth to:", options: ["Tear meat", "Grind plants", "Catch fish", "Drink water"], answer: 1, difficulty: "easy", hint: "Chew grass" },
    { q: "What do plants release into the air?", options: ["Carbon dioxide", "Oxygen", "Smoke", "Ash"], answer: 1, difficulty: "easy", hint: "We breathe it" },
    { q: "A volcano that can still erupt is:", options: ["Dead", "Active", "Frozen", "Broken"], answer: 1, difficulty: "easy", hint: "Not sleeping" },
    // MEDIUM
    { q: "The process where plants make food is called:", options: ["Respiration", "Photosynthesis", "Digestion", "Evaporation"], answer: 1, difficulty: "medium", hint: "Photo + synthesis" },
    { q: "Sharp canine teeth are found in:", options: ["Herbivores", "Carnivores", "Plants", "Insects"], answer: 1, difficulty: "medium", hint: "Meat eaters" },
    { q: "Flat molar teeth are found in:", options: ["Carnivores", "Herbivores", "Fish", "Birds"], answer: 1, difficulty: "medium", hint: "Plant eaters" },
    { q: "Polar bears have thick fur because:", options: ["Hot places", "Cold places", "Swimming", "White color"], answer: 1, difficulty: "medium", hint: "Arctic is cold" },
    { q: "Camels store water and fat in their:", options: ["Legs", "Tail", "Hump", "Ears"], answer: 2, difficulty: "medium", hint: "Back bump" },
    { q: "An adaptation helps animals to:", options: ["Change color", "Survive in habitat", "Fly faster", "Grow bigger"], answer: 1, difficulty: "medium", hint: "Survival skill" },
    { q: "Roots absorb _____ from the soil.", options: ["Sunlight", "Water and nutrients", "Air", "Heat"], answer: 1, difficulty: "medium", hint: "H2O" },
    { q: "Leaves are usually _____ to catch sunlight.", options: ["Round", "Flat and wide", "Thick", "Small"], answer: 1, difficulty: "medium", hint: "Surface area" },
    { q: "A food chain starts with:", options: ["Carnivores", "Herbivores", "Plants (Producers)", "Humans"], answer: 2, difficulty: "medium", hint: "Sunlight user" },
    { q: "In a desert, animals adapt by:", options: ["Growing thick fur", "Storing water", "Flying high", "Living in groups"], answer: 1, difficulty: "medium", hint: "Scarcity of water" },
    { q: "Monkeys have long tails to:", options: ["Keep warm", "Climb and balance", "Swim faster", "Dig holes"], answer: 1, difficulty: "medium", hint: "Trees" },
    { q: "Fish have gills to:", options: ["Fly", "Breathe underwater", "Walk", "See"], answer: 1, difficulty: "medium", hint: "Underwater lungs" },
    { q: "Birds have hollow bones to:", options: ["Store food", "Be lighter for flying", "Dig nests", "Swim better"], answer: 1, difficulty: "medium", hint: "Weight reduction" },
    { q: "Volcanoes are formed when:", options: ["Rains a lot", "Tectonic plates move", "Animals dig", "Trees grow"], answer: 1, difficulty: "medium", hint: "Earth's crust" },
    { q: "Lava cools down and becomes:", options: ["Water", "Air", "Rock", "Ash"], answer: 2, difficulty: "medium", hint: "Hard stone" },
    { q: "What gas do plants need for photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], answer: 1, difficulty: "medium", hint: "CO2" },
    { q: "Stems transport _____ from roots to leaves.", options: ["Sunlight", "Water and nutrients", "Animals", "Soil"], answer: 1, difficulty: "medium", hint: "Elevator for water" },
    { q: "Sheep are herbivores, they eat:", options: ["Meat", "Grass", "Fish", "Insects"], answer: 1, difficulty: "medium", hint: "Meadow food" },
    { q: "Eagles are carnivores, they eat:", options: ["Grass", "Small animals", "Leaves", "Fruit"], answer: 1, difficulty: "medium", hint: "Prey" },
    { q: "Volcanic ash can:", options: ["Help plants grow", "Block sunlight", "Both A and B", "Make it rain"], answer: 2, difficulty: "medium", hint: "Both effects" },
    // HARD
    { q: "Which is NOT an adaptation?", options: ["Thicker fur in winter", "Migrating", "Painting homes", "Camouflage"], answer: 2, difficulty: "hard", hint: "Human activity" },
    { q: "Grass → Rabbit → Fox. The fox is a:", options: ["Producer", "Primary consumer", "Secondary consumer", "Decomposer"], answer: 2, difficulty: "hard", hint: "Eats the herbivore" },
    { q: "Photosynthesis produces:", options: ["Oxygen only", "Food only", "Both oxygen and food", "Carbon dioxide"], answer: 2, difficulty: "hard", hint: "Sugar + Air" },
    { q: "Why do some volcanoes explode violently?", options: ["Too much water", "Thick magma traps gas", "Too cold", "Animals inside"], answer: 1, difficulty: "hard", hint: "Pressure buildup" },
    { q: "Arctic foxes turn white in winter for:", options: ["Beauty", "Warmth", "Camouflage", "Food"], answer: 2, difficulty: "hard", hint: "Hiding in snow" },
    { q: "What do decomposers do?", options: ["Eat plants", "Hunt animals", "Break down dead things", "Make sunlight"], answer: 2, difficulty: "hard", hint: "Recycle nutrients" },
    { q: "Cacti have thick stems to:", options: ["Look nice", "Store water", "Catch animals", "Fly away"], answer: 1, difficulty: "hard", hint: "Desert survival" },
    { q: "Why are rainforests important?", options: ["Oxygen", "Homes for animals", "Rain", "All of the above"], answer: 3, difficulty: "hard", hint: "Everything" },
    { q: "A snake sheds its skin to:", options: ["Look new", "Grow bigger", "Escape", "Swim"], answer: 1, difficulty: "hard", hint: "Room to grow" },
    { q: "Underwater volcano eruption creates:", options: ["Nothing", "New islands", "Disappears", "Mountain"], answer: 1, difficulty: "hard", hint: "Land from sea" },
  ]
};

// --- COMPONENTS ---

// 1. Difficulty Badge
const DifficultyBadge = ({ level }) => {
  const colors = {
    easy: "green",
    medium: "orange",
    hard: "red",
    all: "blue"
  };
  const icons = {
    easy: "😊",
    medium: "🤔",
    hard: "🔥",
    all: "🌟"
  };
  return (
    <Tag color={colors[level]} className="uppercase font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 border-0 shadow-sm">
      <span>{icons[level]}</span> {level}
    </Tag>
  );
};

// 2. Question Card
const QuestionCard = ({ question, index, subject, onAnswer, answeredData }) => {
  const [showHint, setShowHint] = useState(false);
  
  // Reset hint when question changes (if reused) or reset completely
  useEffect(() => {
    setShowHint(false);
  }, [question]);

  const isAnswered = answeredData !== undefined;
  const isCorrect = isAnswered && answeredData === question.answer;
  const isWrong = isAnswered && answeredData !== question.answer;

  const getOptionStyle = (optIndex) => {
    if (!isAnswered) return "hover:border-blue-400 hover:bg-blue-50 cursor-pointer border-gray-200";
    
    if (optIndex === question.answer) return "bg-green-100 border-green-500 text-green-700 font-semibold ring-2 ring-green-200";
    if (optIndex === answeredData) return "bg-red-100 border-red-500 text-red-700 ring-2 ring-red-200 opacity-80";
    
    return "opacity-50 border-gray-200";
  };

  const getCardGradient = () => {
     if (question.difficulty === 'easy') return 'from-green-50 to-emerald-50';
     if (question.difficulty === 'medium') return 'from-amber-50 to-orange-50';
     if (question.difficulty === 'hard') return 'from-red-50 to-rose-50';
     return 'from-white to-gray-50';
  };

  return (
    <div className={`relative bg-gradient-to-br ${getCardGradient()} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 mb-6`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
            {index}
          </div>
          <span className="text-gray-500 text-sm font-semibold tracking-wider uppercase">{subject}</span>
        </div>
        <DifficultyBadge level={question.difficulty} />
      </div>

      {/* Question Text */}
      <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
        {question.q}
      </h3>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {question.options.map((opt, i) => (
          <div 
            key={i}
            onClick={() => !isAnswered && onAnswer(i)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200 flex items-center
              ${getOptionStyle(i)}
            `}
          >
            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${isAnswered && i === question.answer ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}>
              {isAnswered && i === question.answer && <CheckCircle2 size={12} />}
              {isAnswered && i === answeredData && i !== question.answer && <XCircle size={12} />}
            </div>
            <span>{opt}</span>
          </div>
        ))}
      </div>

      {/* Footer / Feedback */}
      <div className="flex justify-between items-center mt-4 h-12">
        {!showHint && !isAnswered && (
          <Button 
            type="dashed" 
            icon={<Lightbulb size={16} />} 
            onClick={() => setShowHint(true)}
            className="text-amber-600 border-amber-300 hover:text-amber-700 hover:border-amber-400 bg-amber-50"
          >
            Show Hint
          </Button>
        )}
        
        {showHint && !isAnswered && (
          <div className="flex items-center gap-2 text-amber-700 bg-amber-100 px-4 py-2 rounded-lg text-sm w-full animate-fade-in border border-amber-200">
            <Lightbulb size={16} className="shrink-0" />
            <span>{question.hint}</span>
          </div>
        )}

        {isCorrect && (
          <div className="flex items-center gap-2 text-green-700 bg-green-100 px-4 py-2 rounded-lg font-bold w-full animate-bounce-short border border-green-200">
            <CheckCircle2 size={20} /> Correct! Well done!
          </div>
        )}
        
        {isWrong && (
          <div className="flex items-center gap-2 text-red-700 bg-red-100 px-4 py-2 rounded-lg font-bold w-full animate-shake border border-red-200">
            <XCircle size={20} /> Oops! The correct answer is highlighted.
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function App() {
  // State
  const [activeSubject, setActiveSubject] = useState('english');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [answers, setAnswers] = useState({}); // { "english-0": 1, "math-5": 2 }
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Derived Statistics
  const stats = useMemo(() => {
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalScore = 0;
    let diffStats = { easy: 0, medium: 0, hard: 0 };
    
    // Total possible questions count based on loaded bank
    const totalQuestions = Object.values(QUESTION_BANK).flat().length;

    Object.entries(answers).forEach(([key, userAns]) => {
      const [subj, idxStr] = key.split('-');
      const idx = parseInt(idxStr);
      const question = QUESTION_BANK[subj][idx];
      
      if (question) {
        if (question.answer === userAns) {
          totalCorrect++;
          diffStats[question.difficulty]++;
          // Points
          if (question.difficulty === 'easy') totalScore += 5;
          if (question.difficulty === 'medium') totalScore += 10;
          if (question.difficulty === 'hard') totalScore += 15;
        } else {
          totalWrong++;
        }
      }
    });

    return { 
      correct: totalCorrect, 
      wrong: totalWrong, 
      score: totalScore, 
      diffBreakdown: diffStats,
      progress: Math.round((Object.keys(answers).length / totalQuestions) * 100),
      answeredCount: Object.keys(answers).length,
      totalQuestions
    };
  }, [answers]);

  // Handlers
  const handleAnswer = (subject, index, optionIndex) => {
    const key = `${subject}-${index}`;
    if (answers[key] !== undefined) return; // Prevent changing answer

    setAnswers(prev => ({ ...prev, [key]: optionIndex }));
    
    // Play subtle sound or just UI feedback (UI feedback handled in Card)
    const question = QUESTION_BANK[subject][index];
    if (question.answer === optionIndex) {
      // success feedback logic if needed globally
    }
  };

  const handleReset = () => {
    setAnswers({});
    setIsResultModalOpen(false);
    setActiveSubject('english');
    setActiveDifficulty('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    message.success("Quiz reset successfully!");
  };

  const filteredQuestions = useMemo(() => {
    return QUESTION_BANK[activeSubject].map((q, i) => ({...q, originalIndex: i}))
      .filter(q => activeDifficulty === 'all' || q.difficulty === activeDifficulty);
  }, [activeSubject, activeDifficulty]);

  // Ant Design Tab Items
  const tabItems = [
    {
      key: 'english',
      label: (
        <span className="flex items-center gap-2 text-base px-2">
          <BookOpen size={18} /> English
        </span>
      ),
    },
    {
      key: 'math',
      label: (
        <span className="flex items-center gap-2 text-base px-2">
          <Calculator size={18} /> Maths
        </span>
      ),
    },
    {
      key: 'science',
      label: (
        <span className="flex items-center gap-2 text-base px-2">
          <FlaskConical size={18} /> Science
        </span>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3b82f6', // blue-500
          fontFamily: "'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif",
          borderRadius: 12,
        },
        components: {
          Card: {
            headerBg: '#f8fafc',
          },
          Button: {
            fontWeight: 600,
          }
        }
      }}
    >
      <div className="min-h-screen bg-blue-50/50 pb-20 font-sans selection:bg-blue-200">
        
        {/* HERO HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl rounded-b-[40px] overflow-hidden relative">
           {/* Decorative circles */}
           <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-10 -translate-y-10"></div>
           <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-10 translate-y-10"></div>
           
           <div className="max-w-5xl mx-auto px-6 py-10 relative z-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-md flex items-center justify-center gap-3">
                  <Star className="text-yellow-300 fill-yellow-300 animate-pulse" /> 
                  REVIEW EMG GRADE 3 
                  <Star className="text-yellow-300 fill-yellow-300 animate-pulse" />
                </h1>
                <p className="text-blue-100 text-lg font-medium opacity-90">
                  150+ Questions • 3 Subjects • Fun Learning
                </p>
              </div>

              {/* STATS BOARD */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-center border-r border-white/20 last:border-0">
                  <span className="block text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">Total Score</span>
                  <span className="text-3xl font-black text-white drop-shadow-sm">{stats.score}</span>
                </div>
                <div className="text-center border-r border-white/20 last:border-0">
                  <span className="block text-green-200 text-sm font-bold uppercase tracking-wider mb-1">Correct</span>
                  <span className="text-3xl font-black text-green-300 drop-shadow-sm">{stats.correct}</span>
                </div>
                <div className="text-center border-r border-white/20 last:border-0">
                   <span className="block text-red-200 text-sm font-bold uppercase tracking-wider mb-1">Wrong</span>
                   <span className="text-3xl font-black text-red-300 drop-shadow-sm">{stats.wrong}</span>
                </div>
                <div className="text-center flex flex-col items-center justify-center">
                   <span className="block text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Progress</span>
                   <Progress 
                      percent={stats.progress} 
                      size="small" 
                      strokeColor={{ '0%': '#87d068', '100%': '#108ee9' }} 
                      trailColor="rgba(255,255,255,0.2)"
                      format={percent => <span style={{color:'white', fontWeight:'bold'}}>{percent}%</span>}
                   />
                </div>
              </div>
           </div>
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20">
          
          {/* CONTROL BAR */}
          <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-blue-100">
             <div className="w-full md:w-auto overflow-x-auto">
               <Tabs 
                  activeKey={activeSubject} 
                  onChange={setActiveSubject} 
                  items={tabItems} 
                  type="card"
                  className="custom-tabs"
                  size="large"
               />
             </div>
             
             <div className="flex gap-2 p-2 bg-slate-50 rounded-xl overflow-x-auto w-full md:w-auto">
                {['all', 'easy', 'medium', 'hard'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveDifficulty(lvl)}
                    className={`
                      px-4 py-2 rounded-lg font-bold text-sm capitalize transition-all whitespace-nowrap
                      ${activeDifficulty === lvl 
                        ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                        : 'text-gray-500 hover:bg-gray-200'}
                    `}
                  >
                    {lvl}
                  </button>
                ))}
             </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="space-y-6">
            <div className="flex justify-between items-center text-gray-500 font-medium px-2">
               <span>Showing {filteredQuestions.length} questions</span>
               <span className="uppercase text-xs tracking-widest">{activeSubject} / {activeDifficulty}</span>
            </div>

            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q) => (
                <QuestionCard 
                  key={`${activeSubject}-${q.originalIndex}`}
                  question={q}
                  index={q.originalIndex + 1}
                  subject={activeSubject}
                  answeredData={answers[`${activeSubject}-${q.originalIndex}`]}
                  onAnswer={(optIdx) => handleAnswer(activeSubject, q.originalIndex, optIdx)}
                />
              ))
            ) : (
               <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                 <div className="text-6xl mb-4">🏜️</div>
                 <p className="text-gray-500 text-lg">No questions found for this filter.</p>
                 <Button type="link" onClick={() => setActiveDifficulty('all')}>Show All</Button>
               </div>
            )}
          </div>

          {/* CHECK RESULTS BUTTON */}
          <div className="sticky bottom-6 flex justify-center mt-10">
            <Button 
              type="primary" 
              size="large" 
              shape="round"
              icon={<Target />}
              className="h-14 px-8 text-xl shadow-xl shadow-blue-500/30 hover:scale-105 transition-transform"
              onClick={() => setIsResultModalOpen(true)}
            >
              Check My Results
            </Button>
          </div>
        </div>

        {/* RESULTS MODAL */}
        <Modal
          open={isResultModalOpen}
          onCancel={() => setIsResultModalOpen(false)}
          footer={null}
          centered
          width={500}
          className="rounded-[30px] overflow-hidden"
        >
          <div className="text-center py-6">
            <div className="text-6xl mb-4 animate-bounce">
              {stats.progress >= 90 ? '🏆' : stats.progress >= 50 ? '🎉' : '💪'}
            </div>
            
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {stats.progress >= 90 ? 'Excellent!' : stats.progress >= 50 ? 'Great Job!' : 'Keep Trying!'}
            </h2>
            
            <p className="text-gray-500 mb-8 text-lg">
              You scored <span className="text-blue-600 font-bold text-2xl">{stats.correct}</span> out of {stats.answeredCount} attempted.
            </p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 grid grid-cols-3 gap-4 border border-slate-100">
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Easy</div>
                <div className="text-xl font-bold text-green-500">{stats.diffBreakdown.easy}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Medium</div>
                <div className="text-xl font-bold text-orange-500">{stats.diffBreakdown.medium}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Hard</div>
                <div className="text-xl font-bold text-red-500">{stats.diffBreakdown.hard}</div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button size="large" onClick={() => setIsResultModalOpen(false)}>
                Keep Reviewing
              </Button>
              <Button 
                type="primary" 
                danger 
                size="large" 
                icon={<RefreshCcw size={18} />} 
                onClick={handleReset}
              >
                Reset Quiz
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </ConfigProvider>
  );
}

// Styling for inline animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
  
  @keyframes bounce-short { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
  .animate-bounce-short { animation: bounce-short 0.3s ease-out; }
  
  @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
  .animate-shake { animation: shake 0.4s ease-in-out; }

  .custom-tabs .ant-tabs-nav { margin-bottom: 0 !important; }
  .custom-tabs .ant-tabs-tab { border: none !important; background: transparent !important; }
  .custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #2563eb !important; text-shadow: 0 0 1px currentColor; }
  .custom-tabs .ant-tabs-ink-bar { background: #2563eb !important; height: 4px !important; border-radius: 4px 4px 0 0; }
`;
document.head.appendChild(style);