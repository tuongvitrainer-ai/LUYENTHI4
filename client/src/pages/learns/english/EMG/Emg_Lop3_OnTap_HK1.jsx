import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Trophy, 
  Star, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Lightbulb, 
  Music, 
  Volume2, 
  Medal,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Progress, 
  Tag, 
  Modal, 
  Tabs, 
  Layout, 
  Typography, 
  Row, 
  Col, 
  Radio, 
  Badge,
  ConfigProvider,
  message,
  Space
} from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

// ==========================================
// UTILS: RANDOMIZATION
// ==========================================
// Fisher-Yates Shuffle Algorithm for better randomization
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// ==========================================
// DATA: QUESTION BANK (Preserved from Original)
// ==========================================
const questionBank = {
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
    { q: "Did she _____ to school yesterday?", options: ["go", "went", "goes", "going"], answer: 0, difficulty: "medium", hint: "After 'Did' ALWAYS use base form (not conjugated)" },
    { q: "Last year, the astronaut _____ many stars in space.", options: ["see", "saw", "sees", "seeing"], answer: 1, difficulty: "medium", hint: "Look for 'last year' → affirmative past tense: saw" },
    { q: "They _____ their grandparents last weekend.", options: ["visit", "visited", "visits", "visiting"], answer: 1, difficulty: "medium", hint: "Look for 'last weekend' → add -ed" },
    { q: "Choose the correct question: '_____ he do his homework yesterday?'", options: ["Did", "Does", "Do", "Done"], answer: 0, difficulty: "medium", hint: "Look for 'yesterday' → use 'Did' for questions" },
    { q: "The spaceship was big _____ it was slow.", options: ["and", "but", "or", "because"], answer: 1, difficulty: "medium", hint: "Big BUT slow = contrasting ideas → 'but'" },
    { q: "She came home early _____ she was tired.", options: ["and", "but", "or", "because"], answer: 3, difficulty: "medium", hint: "Explaining reason → 'because' (why)" },
    { q: "I _____ my keys this morning.", options: ["lose", "lost", "loses", "losing"], answer: 1, difficulty: "medium", hint: "Look for 'this morning' → lose → lost" },
    { q: "Last year, they _____ English at school.", options: ["learn", "learned", "learns", "learning"], answer: 1, difficulty: "medium", hint: "Look for 'last year' → regular verb + -ed" },
    { q: "Yesterday, he _____ the ball very far.", options: ["throw", "throws", "threw", "throwing"], answer: 2, difficulty: "medium", hint: "Look for 'yesterday' → throw → threw" },
    { q: "We _____ our room yesterday.", options: ["clean", "cleaned", "cleans", "cleaning"], answer: 1, difficulty: "medium", hint: "Look for 'yesterday' → add -ed" },
    { q: "Last summer, the sun _____ brightly every day.", options: ["shine", "shines", "shone", "shining"], answer: 2, difficulty: "medium", hint: "Look for 'last summer' → shine → shone" },
    { q: "What does 'astronaut' mean?", options: ["A space car", "A person who travels in space", "A planet", "A star"], answer: 1, difficulty: "medium", hint: "Astronaut = space traveler" },
    { q: "What is 'gravity'?", options: ["A planet", "A force that pulls things down", "A spaceship", "The moon"], answer: 1, difficulty: "medium", hint: "Gravity = pulling force (downward)" },
    { q: "Dragons have sharp _____ on their feet.", options: ["scales", "claws", "horns", "wings"], answer: 1, difficulty: "medium", hint: "Claws = sharp nails on feet" },
    { q: "The word 'fierce' means:", options: ["Kind and gentle", "Scary and aggressive", "Small and cute", "Slow and lazy"], answer: 1, difficulty: "medium", hint: "Fierce = scary, aggressive" },
    { q: "'Launch' means to _____ a spaceship.", options: ["land", "send into space", "repair", "build"], answer: 1, difficulty: "medium", hint: "Launch = send up into space" },
    { q: "Last Sunday, she _____ her bicycle to school.", options: ["ride", "rides", "rode", "riding"], answer: 2, difficulty: "medium", hint: "Look for 'last Sunday' → ride → rode" },
    { q: "They _____ a cake for mom's birthday last week.", options: ["make", "makes", "made", "making"], answer: 2, difficulty: "medium", hint: "Look for 'last week' → make → made" },
    { q: "I _____ cold yesterday evening.", options: ["feel", "feels", "felt", "feeling"], answer: 2, difficulty: "medium", hint: "Look for 'yesterday evening' → feel → felt" },
    { q: "He _____ me his name last Monday.", options: ["tell", "tells", "told", "telling"], answer: 2, difficulty: "medium", hint: "Look for 'last Monday' → tell → told" },
    // HARD
    { q: "Which sentence uses Direct Speech correctly?", options: ["I am hungry, said Anna.", "\"I am hungry,\" said Anna.", "\"I am hungry, said Anna.\"", "I am hungry said Anna."], answer: 1, difficulty: "hard", hint: "Quotation marks \" \" around speech, comma before 'said'" },
    { q: "Complete: 'Did you _____ the movie last night?' 'Yes, I _____.'", options: ["saw / did", "see / did", "saw / do", "see / do"], answer: 1, difficulty: "hard", hint: "After Did + base form / Answer: Yes, I did" },
    { q: "Choose the IRREGULAR verb in past tense:", options: ["walked", "jumped", "flew", "played"], answer: 2, difficulty: "hard", hint: "Verb NOT ending in -ed: fly → flew" },
    { q: "Which conjunction fits? 'He was tired _____ he kept working.'", options: ["and", "but", "or", "so"], answer: 1, difficulty: "hard", hint: "Tired BUT kept working = contrast → 'but'" },
    { q: "Past tense of 'bring' is:", options: ["bringed", "brought", "brang", "brung"], answer: 1, difficulty: "hard", hint: "Special irregular verb: bring → brought" },
    { q: "Past tense of 'spend' is:", options: ["spended", "spent", "spend", "spending"], answer: 1, difficulty: "hard", hint: "Irregular verb: spend → spent" },
    { q: "Choose the correct NEGATIVE sentence in past tense:", options: ["She didn't went.", "She didn't go.", "She doesn't went.", "She don't go."], answer: 1, difficulty: "hard", hint: "Didn't + base form (not conjugated)" },
    { q: "Complete: 'Last night, the dragon _____ fire _____ it was angry.'", options: ["breathe / and", "breathed / because", "breathes / but", "breathing / or"], answer: 1, difficulty: "hard", hint: "Look for 'last night' → past tense + explaining reason 'because'" },
    { q: "Which word means 'the outer layer of a dragon's body'?", options: ["claws", "scales", "horns", "wings"], answer: 1, difficulty: "hard", hint: "Scales = outer protective layer" },
    { q: "Rewrite in past tense: 'I know the answer.'", options: ["I knowed the answer", "I knew the answer", "I know the answer", "I known the answer"], answer: 1, difficulty: "hard", hint: "Irregular verb: know → knew" },
  ],
  math: [
    // EASY
    { q: "15 + 8 = ?", options: ["21", "22", "23", "24"], answer: 2, difficulty: "easy", hint: "Use column addition" },
    { q: "30 - 12 = ?", options: ["16", "17", "18", "19"], answer: 2, difficulty: "easy", hint: "Subtract each place value" },
    { q: "Double of 7 is:", options: ["12", "13", "14", "15"], answer: 2, difficulty: "easy", hint: "7 × 2" },
    { q: "3 × 5 = ?", options: ["13", "14", "15", "16"], answer: 2, difficulty: "easy", hint: "Basic multiplication" },
    { q: "20 ÷ 4 = ?", options: ["4", "5", "6", "7"], answer: 1, difficulty: "easy", hint: "Divide equally" },
    { q: "Half of 16 is:", options: ["6", "7", "8", "9"], answer: 2, difficulty: "easy", hint: "16 ÷ 2" },
    { q: "4 × 3 = ?", options: ["10", "11", "12", "13"], answer: 2, difficulty: "easy", hint: "Times table 4" },
    { q: "25 + 15 = ?", options: ["38", "39", "40", "41"], answer: 2, difficulty: "easy", hint: "Add tens to tens" },
    { q: "50 - 20 = ?", options: ["28", "29", "30", "31"], answer: 2, difficulty: "easy", hint: "Subtract round numbers" },
    { q: "Double of 12 is:", options: ["22", "23", "24", "25"], answer: 2, difficulty: "easy", hint: "12 + 12" },
    { q: "6 × 2 = ?", options: ["10", "11", "12", "13"], answer: 2, difficulty: "easy", hint: "Times table 2" },
    { q: "18 ÷ 3 = ?", options: ["5", "6", "7", "8"], answer: 1, difficulty: "easy", hint: "18 divided by 3" },
    { q: "10 + 10 + 10 = ?", options: ["28", "29", "30", "31"], answer: 2, difficulty: "easy", hint: "Add three 10s" },
    { q: "Half of 20 is:", options: ["8", "9", "10", "11"], answer: 2, difficulty: "easy", hint: "20 ÷ 2" },
    { q: "5 × 4 = ?", options: ["18", "19", "20", "21"], answer: 2, difficulty: "easy", hint: "Times table 5" },
    { q: "100 - 50 = ?", options: ["48", "49", "50", "51"], answer: 2, difficulty: "easy", hint: "Subtract round hundreds" },
    { q: "7 × 3 = ?", options: ["19", "20", "21", "22"], answer: 2, difficulty: "easy", hint: "Times table 7" },
    { q: "45 + 5 = ?", options: ["48", "49", "50", "51"], answer: 2, difficulty: "easy", hint: "Add 5" },
    { q: "36 ÷ 4 = ?", options: ["7", "8", "9", "10"], answer: 2, difficulty: "easy", hint: "36 divided by 4" },
    { q: "Double of 25 is:", options: ["48", "49", "50", "51"], answer: 2, difficulty: "easy", hint: "25 × 2" },
    // MEDIUM
    { q: "245 + 138 = ?", options: ["373", "383", "393", "403"], answer: 1, difficulty: "medium", hint: "Use column method, carry over" },
    { q: "567 - 239 = ?", options: ["318", "328", "338", "348"], answer: 1, difficulty: "medium", hint: "Borrow when subtracting" },
    { q: "8 × 7 = ?", options: ["54", "55", "56", "57"], answer: 2, difficulty: "medium", hint: "Times table 8" },
    { q: "72 ÷ 8 = ?", options: ["7", "8", "9", "10"], answer: 2, difficulty: "medium", hint: "72 divided by 8" },
    { q: "345 + 267 = ?", options: ["602", "612", "622", "632"], answer: 1, difficulty: "medium", hint: "Add each place value" },
    { q: "9 × 6 = ?", options: ["52", "53", "54", "55"], answer: 2, difficulty: "medium", hint: "Times table 9" },
    { q: "Half of 150 is:", options: ["73", "74", "75", "76"], answer: 2, difficulty: "medium", hint: "150 ÷ 2" },
    { q: "12 × 4 = ?", options: ["46", "47", "48", "49"], answer: 2, difficulty: "medium", hint: "12 × 4" },
    { q: "456 - 178 = ?", options: ["276", "277", "278", "279"], answer: 2, difficulty: "medium", hint: "Subtract with borrowing" },
    { q: "15 × 3 = ?", options: ["43", "44", "45", "46"], answer: 2, difficulty: "medium", hint: "15 × 3" },
    { q: "A table is 150 cm long and 80 cm wide. The length is _____ cm more than width.", options: ["60", "70", "80", "90"], answer: 1, difficulty: "medium", hint: "150 - 80" },
    { q: "5 cm = _____ mm", options: ["5", "50", "500", "5000"], answer: 1, difficulty: "medium", hint: "1 cm = 10 mm" },
    { q: "200 cm = _____ m", options: ["0.2", "2", "20", "200"], answer: 1, difficulty: "medium", hint: "100 cm = 1 m" },
    { q: "What time is 'quarter past 3'?", options: ["2:45", "3:15", "3:30", "3:45"], answer: 1, difficulty: "medium", hint: "Quarter = 15 minutes" },
    { q: "What time is 'half past 7'?", options: ["6:30", "7:00", "7:30", "8:00"], answer: 2, difficulty: "medium", hint: "Half = 30 minutes" },
    { q: "A pentagon has _____ sides.", options: ["4", "5", "6", "8"], answer: 1, difficulty: "medium", hint: "Penta = 5" },
    { q: "A hexagon has _____ sides.", options: ["4", "5", "6", "7"], answer: 2, difficulty: "medium", hint: "Hexa = 6" },
    { q: "A right angle measures _____ degrees.", options: ["45", "90", "180", "360"], answer: 1, difficulty: "medium", hint: "Right angle = 90°" },
    { q: "Double of 45 is:", options: ["80", "85", "90", "95"], answer: 2, difficulty: "medium", hint: "45 × 2" },
    { q: "Half of 88 is:", options: ["42", "43", "44", "45"], answer: 2, difficulty: "medium", hint: "88 ÷ 2" },
    // HARD
    { q: "12 astronauts need 4 bottles each. Total bottles = ?", options: ["44", "46", "48", "50"], answer: 2, difficulty: "hard", hint: "12 × 4" },
    { q: "A spaceship travels 345 km on Monday and 278 km on Tuesday. Total = ?", options: ["613", "623", "633", "643"], answer: 1, difficulty: "hard", hint: "Add two large numbers" },
    { q: "600 food packets. Half eaten. How many left?", options: ["250", "300", "350", "400"], answer: 1, difficulty: "hard", hint: "600 ÷ 2" },
    { q: "7 × 100 = ?", options: ["70", "700", "7000", "70000"], answer: 1, difficulty: "hard", hint: "Multiply by 100" },
    { q: "854 - 367 = ?", options: ["477", "487", "497", "507"], answer: 1, difficulty: "hard", hint: "Subtract with multiple borrowing" },
    { q: "What time is 'quarter to 11'?", options: ["10:15", "10:30", "10:45", "11:15"], answer: 2, difficulty: "hard", hint: "Quarter to = 15 minutes before" },
    { q: "A quadrilateral has _____ sides.", options: ["3", "4", "5", "6"], answer: 1, difficulty: "hard", hint: "Quad = 4" },
    { q: "150 mm = _____ cm", options: ["1.5", "15", "150", "1500"], answer: 1, difficulty: "hard", hint: "Divide by 10" },
    { q: "3 × 3 × 3 = ?", options: ["9", "18", "27", "36"], answer: 2, difficulty: "hard", hint: "3 cubed (3³)" },
    { q: "If a pattern is +5 each time, what comes after 23?", options: ["26", "27", "28", "29"], answer: 2, difficulty: "hard", hint: "23 + 5" },
  ],
  science: [
    // EASY
    { q: "Which part of a plant takes water from soil?", options: ["Leaves", "Roots", "Flower", "Stem"], answer: 1, difficulty: "easy", hint: "Part underground" },
    { q: "What do leaves do?", options: ["Absorb water", "Make food using sunlight", "Hold the plant", "Make seeds"], answer: 1, difficulty: "easy", hint: "Photosynthesis" },
    { q: "Animals that eat ONLY plants are called:", options: ["Carnivores", "Herbivores", "Omnivores", "Predators"], answer: 1, difficulty: "easy", hint: "Herb = grass/plants" },
    { q: "Animals that eat ONLY meat are called:", options: ["Herbivores", "Carnivores", "Omnivores", "Prey"], answer: 1, difficulty: "easy", hint: "Carn = meat" },
    { q: "Hot rock INSIDE a volcano is called:", options: ["Lava", "Magma", "Ash", "Crater"], answer: 1, difficulty: "easy", hint: "Inside the volcano" },
    { q: "Hot rock that flows OUT of a volcano is:", options: ["Magma", "Lava", "Ash", "Smoke"], answer: 1, difficulty: "easy", hint: "Flows out/outside" },
    { q: "The opening at the top of a volcano is:", options: ["Magma", "Lava", "Crater", "Ash"], answer: 2, difficulty: "easy", hint: "Mouth of volcano" },
    { q: "Which animal is a herbivore?", options: ["Lion", "Rabbit", "Tiger", "Shark"], answer: 1, difficulty: "easy", hint: "Eats grass/plants" },
    { q: "Which animal is a carnivore?", options: ["Cow", "Sheep", "Lion", "Rabbit"], answer: 2, difficulty: "easy", hint: "Eats meat" },
    { q: "Bears eat plants AND meat. They are:", options: ["Herbivores", "Carnivores", "Omnivores", "Producers"], answer: 2, difficulty: "easy", hint: "Omni = all/both" },
    { q: "The stem of a plant:", options: ["Makes food", "Absorbs water", "Supports the plant", "Makes seeds"], answer: 2, difficulty: "easy", hint: "Holds plant up" },
    { q: "Flowers help plants to:", options: ["Absorb water", "Make seeds", "Get sunlight", "Stand tall"], answer: 1, difficulty: "easy", hint: "Creates seeds" },
    { q: "What is ash from a volcano?", options: ["Hot water", "Powder from explosion", "Hard rock", "Cold air"], answer: 1, difficulty: "easy", hint: "Volcanic dust/powder" },
    { q: "Plants need _____ to make food.", options: ["Darkness", "Sunlight", "Rain only", "Animals"], answer: 1, difficulty: "easy", hint: "Light from the sun" },
    { q: "Which is NOT a part of a plant?", options: ["Root", "Leaf", "Fur", "Stem"], answer: 2, difficulty: "easy", hint: "Fur is on animals" },
    { q: "Humans are:", options: ["Herbivores", "Carnivores", "Omnivores", "Plants"], answer: 2, difficulty: "easy", hint: "We eat both meat and plants" },
    { q: "Which animal has sharp teeth for meat?", options: ["Cow", "Tiger", "Sheep", "Horse"], answer: 1, difficulty: "easy", hint: "Meat-eating animal" },
    { q: "Cows have flat teeth to:", options: ["Tear meat", "Grind plants", "Catch fish", "Drink water"], answer: 1, difficulty: "easy", hint: "Flat molars grind grass" },
    { q: "What do plants release into the air?", options: ["Carbon dioxide", "Oxygen", "Smoke", "Ash"], answer: 1, difficulty: "easy", hint: "Plants give off oxygen" },
    { q: "A volcano that can still erupt is:", options: ["Dead", "Active", "Frozen", "Broken"], answer: 1, difficulty: "easy", hint: "Still working/active" },
    // MEDIUM
    { q: "The process where plants make food is called:", options: ["Respiration", "Photosynthesis", "Digestion", "Evaporation"], answer: 1, difficulty: "medium", hint: "Photo = light, synthesis = making" },
    { q: "Sharp canine teeth are found in:", options: ["Herbivores", "Carnivores", "Plants", "Insects"], answer: 1, difficulty: "medium", hint: "Meat-eating animals" },
    { q: "Flat molar teeth are found in:", options: ["Carnivores", "Herbivores", "Fish", "Birds"], answer: 1, difficulty: "medium", hint: "Plant-eating animals" },
    { q: "Polar bears have thick fur because:", options: ["They live in hot places", "They live in cold places", "They like swimming", "They are white"], answer: 1, difficulty: "medium", hint: "Adaptation to cold environment" },
    { q: "Camels store water and fat in their:", options: ["Legs", "Tail", "Hump", "Ears"], answer: 2, difficulty: "medium", hint: "Camel's bump" },
    { q: "An adaptation helps animals to:", options: ["Change color", "Survive in their habitat", "Fly faster", "Grow bigger"], answer: 1, difficulty: "medium", hint: "Survive in environment" },
    { q: "Roots absorb _____ from the soil.", options: ["Sunlight", "Water and nutrients", "Air", "Heat"], answer: 1, difficulty: "medium", hint: "Water and nutrients" },
    { q: "Leaves are usually _____ to catch sunlight.", options: ["Round", "Flat and wide", "Thick", "Small"], answer: 1, difficulty: "medium", hint: "Wide to catch light" },
    { q: "A food chain starts with:", options: ["Carnivores", "Herbivores", "Plants (Producers)", "Humans"], answer: 2, difficulty: "medium", hint: "Green plants make food" },
    { q: "In a desert, animals adapt by:", options: ["Growing thick fur", "Storing water", "Flying high", "Living in groups"], answer: 1, difficulty: "medium", hint: "Store water" },
    { q: "Monkeys have long tails to:", options: ["Keep warm", "Climb and balance", "Swim faster", "Dig holes"], answer: 1, difficulty: "medium", hint: "Climbing and balance" },
    { q: "Fish have gills to:", options: ["Fly", "Breathe underwater", "Walk", "See"], answer: 1, difficulty: "medium", hint: "Breathe underwater" },
    { q: "Birds have hollow bones to:", options: ["Store food", "Be lighter for flying", "Dig nests", "Swim better"], answer: 1, difficulty: "medium", hint: "Light weight for flying" },
    { q: "Volcanoes are formed when:", options: ["It rains a lot", "Tectonic plates move", "Animals dig", "Trees grow"], answer: 1, difficulty: "medium", hint: "Tectonic plates move" },
    { q: "Lava cools down and becomes:", options: ["Water", "Air", "Rock", "Ash"], answer: 2, difficulty: "medium", hint: "Cools into rock" },
    { q: "What gas do plants need for photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], answer: 1, difficulty: "medium", hint: "CO2" },
    { q: "Stems transport _____ from roots to leaves.", options: ["Sunlight", "Water and nutrients", "Animals", "Soil"], answer: 1, difficulty: "medium", hint: "Transport water" },
    { q: "Sheep are herbivores, they eat:", options: ["Meat", "Grass", "Fish", "Insects"], answer: 1, difficulty: "medium", hint: "Eat grass" },
    { q: "Eagles are carnivores, they eat:", options: ["Grass", "Small animals", "Leaves", "Fruit"], answer: 1, difficulty: "medium", hint: "Eat small animals" },
    { q: "Volcanic ash can:", options: ["Help plants grow", "Block sunlight", "Both A and B", "Make it rain"], answer: 2, difficulty: "medium", hint: "Both are true" },
    // HARD
    { q: "Which is NOT an adaptation? Animals:", options: ["Growing thicker fur in winter", "Migrating to warmer places", "Painting their homes", "Changing color for camouflage"], answer: 2, difficulty: "hard", hint: "Humans paint, not animals" },
    { q: "In a food chain: Grass → Rabbit → Fox. The fox is a:", options: ["Producer", "Primary consumer", "Secondary consumer", "Decomposer"], answer: 2, difficulty: "hard", hint: "Eats the rabbit (2nd consumer)" },
    { q: "Plants need carbon dioxide, water, and sunlight for photosynthesis. They produce:", options: ["Oxygen only", "Food only", "Both oxygen and food", "Carbon dioxide"], answer: 2, difficulty: "hard", hint: "Make food AND release oxygen" },
    { q: "Why do some volcanoes explode violently?", options: ["Too much water", "Thick, sticky magma traps gas", "It's too cold", "Animals live inside"], answer: 1, difficulty: "hard", hint: "Thick magma traps gas" },
    { q: "Arctic foxes turn white in winter for:", options: ["Beauty", "Warmth", "Camouflage in snow", "Finding food"], answer: 2, difficulty: "hard", hint: "Hide in snow" },
    { q: "What do decomposers do in nature?", options: ["Eat plants", "Hunt animals", "Break down dead things", "Make sunlight"], answer: 2, difficulty: "hard", hint: "Break down dead material" },
    { q: "Cacti have thick stems to:", options: ["Look nice", "Store water in deserts", "Catch animals", "Fly away"], answer: 1, difficulty: "hard", hint: "Store water in desert" },
    { q: "Why are rainforests important?", options: ["They produce oxygen", "They provide homes for animals", "They help make rain", "All of the above"], answer: 3, difficulty: "hard", hint: "All are true" },
    { q: "A snake sheds its skin to:", options: ["Look new", "Grow bigger", "Escape danger", "Swim faster"], answer: 1, difficulty: "hard", hint: "Shed to grow bigger" },
    { q: "What happens if a volcano erupts underwater?", options: ["Nothing", "It creates new islands", "It disappears", "It becomes a mountain"], answer: 1, difficulty: "hard", hint: "Creates new islands" },
  ]
};

// ==========================================
// UTILS: SOUND & EFFECTS
// ==========================================

// Sound Logic Hooks
const useAudio = () => {
  const audioContextRef = useRef(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playCorrectSound = () => {
    initAudio();
    try {
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 523.25; // C5
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 659.25; // E5
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.2, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.5);
    } catch (e) { console.error(e); }
  };

  const playWrongSound = () => {
    initAudio();
    try {
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 200;
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) { console.error(e); }
  };

  const playBadgeSound = () => {
    initAudio();
    try {
      const ctx = audioContextRef.current;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const startTime = ctx.currentTime + (index * 0.1);
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);
        osc.start(startTime);
        osc.stop(startTime + 0.8);
      });
    } catch (e) { console.error(e); }
  };

  return { playCorrectSound, playWrongSound, playBadgeSound };
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const DifficultyBadge = ({ level }) => {
  const colors = {
    easy: 'green',
    medium: 'orange',
    hard: 'red',
  };
  const icons = {
    easy: '😊',
    medium: '🤔',
    hard: '🔥'
  };
  return (
    <Tag color={colors[level]} className="uppercase font-bold px-3 py-1 rounded-full text-xs">
      {icons[level]} {level}
    </Tag>
  );
};

const Confetti = ({ active }) => {
  if (!active) return null;
  // Simple CSS Confetti simulation using array
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-2 h-2 rounded-full animate-confetti-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][Math.floor(Math.random() * 5)],
            animationDuration: `${Math.random() * 2 + 2}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

const QuestionCard = ({ question, index, total, onAnswer, answeredData, showHint }) => {
  const isAnswered = answeredData !== undefined;
  const isCorrect = isAnswered && answeredData.isCorrect;
  const selectedOptionIndex = isAnswered ? answeredData.selectedOptionIndex : null; // Index in the shuffled options array

  // question.options is now the shuffled array
  // question.answer is the index in the SHUFFLED array

  return (
    <Card 
      className={`mb-6 hover:shadow-lg transition-transform duration-300 border-2 
        ${isAnswered ? (isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'border-blue-100 bg-white'}`}
      styles={{ body: { padding: '24px' } }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-sky-400 text-white min-w-[40px] h-10 px-2 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
            {index + 1}
          </div>
          <DifficultyBadge level={question.difficulty} />
        </div>
        <div className="text-slate-400 text-sm font-semibold">
          Question {index + 1} of {total}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-700 mb-6 leading-relaxed">
        {question.q}
      </h3>

      <div className="grid gap-3">
        {question.options.map((opt, i) => {
          let btnType = "default";
          let btnClass = "h-auto py-3 text-lg justify-start text-left whitespace-normal border-2 hover:border-sky-300";
          
          if (isAnswered) {
             // i is the current index in this rendered list
             // question.answer is the correct index in this rendered list
             
             if (i === question.answer) {
                // This is the correct option
                btnType = "primary";
                btnClass += " bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600";
             } else if (i === selectedOptionIndex && !isCorrect) {
                // This was selected but wrong
                btnType = "primary";
                btnClass += " bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600";
             } else {
                btnClass += " opacity-50";
             }
          }

          return (
            <Button
              key={i}
              block
              size="large"
              onClick={() => !isAnswered && onAnswer(i)}
              className={btnClass}
              type={btnType}
              icon={isAnswered && i === question.answer ? <CheckCircle size={20}/> : (isAnswered && i === selectedOptionIndex && !isCorrect ? <XCircle size={20} /> : <div className="w-5 h-5 border-2 rounded-full border-gray-300 mr-2" />)}
            >
              <span className="ml-2">{opt}</span>
            </Button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2">
         {!isAnswered && (
             <Button 
                type="dashed" 
                icon={<Lightbulb size={16} />} 
                onClick={() => showHint(question.hint)}
                className="self-start text-yellow-600 border-yellow-400 hover:text-yellow-700 hover:border-yellow-500 bg-yellow-50"
             >
                Show Hint
             </Button>
         )}
         
         {isAnswered && (
             <div className={`p-4 rounded-xl mt-2 animate-fade-in flex items-center gap-3 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                 {isCorrect ? <Trophy size={24} className="text-green-600" /> : <RotateCcw size={24} className="text-red-600" />}
                 <div>
                     <div className="font-bold text-lg">{isCorrect ? "Correct! Well done!" : "Not quite!"}</div>
                     {!isCorrect && <div className="text-sm">The correct answer is highlighted in green.</div>}
                 </div>
             </div>
         )}
      </div>
    </Card>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================

const App = () => {
  // State
  const [activeSubject, setActiveSubject] = useState('english');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  
  // State for randomized questions
  const [currentQuestions, setCurrentQuestions] = useState([]);
  
  // Answers map now keyed by the Unique ID generated during shuffle
  const [answers, setAnswers] = useState({}); // { "uniqueID": { selectedOptionIndex: number, isCorrect: boolean, difficulty: string } }
  
  const [showResultModal, setShowResultModal] = useState(false);
  const [celebration, setCelebration] = useState({ show: false, badge: null });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Stats
  const { playCorrectSound, playWrongSound, playBadgeSound } = useAudio();

  // Initialize and Shuffle Questions
  useEffect(() => {
    // 1. Get raw questions
    const rawQuestions = questionBank[activeSubject];
    
    // 2. Filter
    const filtered = rawQuestions.filter(q => difficultyFilter === 'all' || q.difficulty === difficultyFilter);

    // 3. Process: Randomize Options & Assign Unique ID
    const processed = filtered.map((q) => {
        // Generate a stable-ish ID based on content to track it (or just random if we want fresh session)
        // Let's use a combination of subject + original index if possible, OR just generate a random ID for this session
        // Since we reshuffle on filter change, a random ID for this specific instance is fine.
        const id = Math.random().toString(36).substr(2, 9);

        // Prepare options with their original index to track correctness
        const optionsWithStatus = q.options.map((opt, i) => ({
            text: opt,
            isOriginalCorrect: i === q.answer
        }));
        
        // Shuffle options
        const shuffledOptionsWithStatus = shuffleArray(optionsWithStatus);
        
        // Find new correct index
        const newAnswerIndex = shuffledOptionsWithStatus.findIndex(o => o.isOriginalCorrect);

        return {
            ...q,
            id: id,
            options: shuffledOptionsWithStatus.map(o => o.text), // flattened text array
            answer: newAnswerIndex // new index in the shuffled array
        };
    });

    // 4. Shuffle the questions themselves
    const finalQuestions = shuffleArray(processed);
    
    setCurrentQuestions(finalQuestions);
    setCurrentQuestionIndex(0);
    // Optional: Keep previous answers? Usually changing filter resets view. 
    // If we want to strictly follow "Review" mode, maybe reset answers.
    setAnswers({}); 

  }, [activeSubject, difficultyFilter]);

  // Derived Stats
  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let totalScore = 0;
    const diffStats = { easy: 0, medium: 0, hard: 0 };
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = Object.values(questionBank).reduce((acc, subj) => acc + subj.length, 0); // Total database size

    Object.values(answers).forEach(ans => {
      if (ans.isCorrect) {
        correct++;
        const points = { easy: 5, medium: 10, hard: 15 };
        totalScore += points[ans.difficulty];
        diffStats[ans.difficulty]++;
      } else {
        wrong++;
      }
    });

    return { correct, wrong, totalScore, answeredCount, totalQuestions, diffStats };
  }, [answers]);

  // Handle answering
  const handleAnswer = (uniqueId, selectedOptionIndex) => {
    // Find question in current shuffled list
    const question = currentQuestions.find(q => q.id === uniqueId);
    if (!question) return;

    const isCorrect = selectedOptionIndex === question.answer;

    // Play sound
    if (isCorrect) playCorrectSound();
    else playWrongSound();

    // Update state
    setAnswers(prev => {
        const newState = { ...prev, [uniqueId]: { 
            selectedOptionIndex, 
            isCorrect, 
            difficulty: question.difficulty 
        }};
        return newState;
    });
  };

  const resetQuiz = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
        setAnswers({});
        setShowResultModal(false);
        // Reshuffle by triggering the effect? We can just force a reload or re-run the shuffle logic.
        // Simplest way is to toggle a dummy state or just re-run the logic in useEffect via a trigger.
        // For now, setting answers to {} clears the UI. The useEffect will naturally re-run if we change tabs, 
        // but if we want to re-shuffle same tab, we might need a trigger.
        // Let's just reload the current filter logic
        const raw = questionBank[activeSubject].filter(q => difficultyFilter === 'all' || q.difficulty === difficultyFilter);
        // ... (reuse shuffle logic if extracted, or just rely on state reset)
        // For simplicity in this demo, we'll force a re-mount logic by quickly toggling filter or just rely on manual re-shuffle if needed.
        // Actually, let's just re-shuffle manually here to be safe.
        window.location.reload(); // Simplest hard reset
    }
  };

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, currentQuestions.length]);

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Keyboard Event Listener for "Enter"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext]); // Re-bind when handleNext changes (which depends on index)

  // Theme Config (Blue Pastel)
  const themeToken = {
    token: {
      colorPrimary: '#7dd3fc', // Sky Blue 300
      colorLink: '#38bdf8',
      borderRadius: 16,
      fontFamily: `'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif`,
    },
  };

  const currentQuestionData = currentQuestions[currentQuestionIndex];

  return (
    <ConfigProvider theme={themeToken}>
      <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
        <Confetti active={celebration.show} />

        {/* Navbar */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-white/50 shadow-sm mb-4">
            <div className="max-w-3xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center text-sky-600 mb-2">
                    <div className="flex items-center gap-2">
                        <Star className="fill-yellow-400 text-yellow-400 animate-pulse" />
                        <h1 className="text-xl md:text-2xl font-bold drop-shadow-sm">EMG GRADE 3 REVIEW</h1>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold leading-none text-sky-600">{stats.totalScore} pts</div>
                        <div className="text-xs opacity-80 text-slate-500">Total Score</div>
                    </div>
                </div>
                
                {/* Stats Bar */}
                <div className="grid grid-cols-4 gap-2 bg-white/50 p-2 rounded-xl text-center text-slate-600 text-sm font-bold border border-white/60">
                    <div>
                        <span className="block text-lg text-green-500">{stats.correct}</span>
                        <span className="text-xs opacity-75">Correct</span>
                    </div>
                    <div>
                        <span className="block text-lg text-red-500">{stats.wrong}</span>
                        <span className="text-xs opacity-75">Wrong</span>
                    </div>
                     <div>
                        <span className="block text-lg text-blue-500">
                           {currentQuestions.length > 0 ? Math.round((stats.answeredCount / currentQuestions.length) * 100) : 0}%
                        </span>
                        <span className="text-xs opacity-75">Session</span>
                    </div>
                    <div className="flex items-center justify-center">
                        <Button size="small" shape="circle" icon={<RotateCcw size={14} />} onClick={resetQuiz} danger ghost className="border-red-200 text-red-400 hover:text-red-500" />
                    </div>
                </div>
                
                <Progress 
                    percent={currentQuestions.length > 0 ? Math.round((stats.answeredCount / currentQuestions.length) * 100) : 0} 
                    strokeColor={{ '0%': '#87d068', '100%': '#38bdf8' }} 
                    showInfo={false} 
                    size="small"
                    className="mt-2 mb-0" 
                    trailColor="rgba(200,200,255,0.3)"
                />
            </div>
        </div>

        <Content className="p-4 md:p-6 max-w-2xl mx-auto w-full">
            
            {/* Subject Tabs */}
            <Card className="mb-6 shadow-md border-0 rounded-3xl overflow-hidden" styles={{ body: { padding: 0 } }}>
                <div className="flex flex-col md:flex-row bg-slate-50">
                    {[
                        { id: 'english', icon: <BookOpen />, label: 'ENGLISH', sub: 'Space Adventure', color: 'text-blue-500' },
                        { id: 'math', icon: <Calculator />, label: 'MATHS', sub: 'Math Missions', color: 'text-red-400' },
                        { id: 'science', icon: <FlaskConical />, label: 'SCIENCE', sub: 'Explorers', color: 'text-green-500' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubject(tab.id)}
                            className={`flex-1 p-3 md:p-4 flex flex-col items-center justify-center transition-all duration-300 border-b-4 
                                ${activeSubject === tab.id 
                                    ? 'bg-white border-sky-300 shadow-sm' 
                                    : 'bg-slate-50 border-transparent hover:bg-white opacity-60 hover:opacity-100'}`}
                        >
                            <div className={`mb-1 ${activeSubject === tab.id ? tab.color : 'text-slate-400'}`}>
                                {React.cloneElement(tab.icon, { size: 24 })}
                            </div>
                            <span className={`font-bold text-sm ${activeSubject === tab.id ? 'text-slate-700' : 'text-slate-500'}`}>
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Filters */}
            <div className="flex justify-center mb-6">
                <div className="bg-white/60 backdrop-blur-sm p-1.5 rounded-full shadow-sm inline-flex gap-1 border border-white">
                    {[
                        { id: 'all', label: 'All', color: 'blue' },
                        { id: 'easy', label: 'Easy', color: 'green' },
                        { id: 'medium', label: 'Medium', color: 'orange' },
                        { id: 'hard', label: 'Hard', color: 'red' }
                    ].map(f => (
                        <Button
                            key={f.id}
                            type={difficultyFilter === f.id ? 'primary' : 'text'}
                            shape="round"
                            size="middle"
                            onClick={() => setDifficultyFilter(f.id)}
                            className={difficultyFilter === f.id ? `bg-${f.color}-400 font-bold shadow-sm` : 'text-slate-500 font-medium hover:bg-white/50'}
                        >
                            {f.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Questions List (Single Question View) */}
            <div className="min-h-[400px]">
                {currentQuestionData ? (
                    <div className="animate-fade-in">
                        <QuestionCard 
                            key={currentQuestionData.id} // Important: Use random ID to key component
                            index={currentQuestionIndex}
                            total={currentQuestions.length}
                            question={currentQuestionData}
                            answeredData={answers[currentQuestionData.id]}
                            onAnswer={(optIdx) => handleAnswer(currentQuestionData.id, optIdx)}
                            showHint={(h) => {
                                message.info({ content: h, icon: <Lightbulb className="text-yellow-500"/>, duration: 4 });
                            }}
                        />
                        
                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-6 px-2">
                            <Button 
                                onClick={handlePrev} 
                                disabled={currentQuestionIndex === 0}
                                icon={<ChevronLeft size={20} />}
                                size="large"
                                className="w-32 bg-white border-blue-100 text-slate-600 hover:text-blue-500 hover:border-blue-300 shadow-sm"
                            >
                                Previous
                            </Button>
                            
                            <div className="text-slate-400 font-medium text-sm">
                                Use <Tag className="mx-1 bg-slate-100 border-slate-300">Enter ↵</Tag> to Next
                            </div>

                            <Button 
                                onClick={handleNext} 
                                disabled={currentQuestionIndex === currentQuestions.length - 1}
                                size="large"
                                className="w-32 bg-sky-400 text-white hover:bg-sky-500 border-none shadow-md shadow-sky-200"
                            >
                                Next <ChevronRight size={20} className="ml-1" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p>No questions found for this filter.</p>
                        <Button type="link" onClick={() => setDifficultyFilter('all')}>View All</Button>
                    </div>
                )}
            </div>

            {/* Check Results Action */}
            <div className="flex justify-center mt-12 mb-20">
                <Button 
                    type="default" 
                    size="large" 
                    shape="round"
                    className="h-14 px-8 text-lg font-bold bg-white text-sky-500 border-2 border-sky-100 hover:border-sky-300 hover:text-sky-600 shadow-sm"
                    onClick={() => setShowResultModal(true)}
                    icon={<Award size={24} />}
                >
                    View Summary
                </Button>
            </div>

        </Content>

        {/* Modals */}
        <Modal
            open={showResultModal}
            onCancel={() => setShowResultModal(false)}
            footer={null}
            centered
            width={400}
            className="text-center"
        >
            <div className="flex flex-col items-center py-4">
                <div className="text-5xl mb-3 animate-bounce">
                    {stats.correct / (stats.answeredCount || 1) > 0.8 ? '🏆' : (stats.correct / (stats.answeredCount || 1) > 0.5 ? '🌟' : '💪')}
                </div>
                <h2 className="text-2xl font-bold text-slate-700 mb-1">
                    {stats.correct / (stats.answeredCount || 1) > 0.8 ? 'Excellent!' : 'Good Effort!'}
                </h2>
                <p className="text-slate-400 mb-6">You scored {stats.correct} out of {stats.answeredCount} answered questions!</p>
                
                <div className="w-full bg-slate-50 rounded-xl p-4 grid grid-cols-3 gap-2 mb-6 border border-slate-100">
                    <div className="text-center">
                        <div className="text-xs font-bold text-slate-400 uppercase">Easy</div>
                        <div className="text-xl font-black text-green-500">{stats.diffStats.easy}</div>
                    </div>
                    <div className="text-center border-x border-slate-200">
                        <div className="text-xs font-bold text-slate-400 uppercase">Med</div>
                        <div className="text-xl font-black text-orange-500">{stats.diffStats.medium}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs font-bold text-slate-400 uppercase">Hard</div>
                        <div className="text-xl font-black text-red-500">{stats.diffStats.hard}</div>
                    </div>
                </div>

                <div className="flex gap-3 w-full">
                    <Button block onClick={() => setShowResultModal(false)}>
                        Keep Going
                    </Button>
                    <Button block type="primary" onClick={resetQuiz} danger ghost>
                        Restart
                    </Button>
                </div>
            </div>
        </Modal>

        {/* Celebration Overlay */}
        {celebration.show && (
            <div className="fixed inset-0 bg-sky-900/80 z-50 flex flex-col items-center justify-center animate-fade-in text-white backdrop-blur-sm">
                <Medal size={100} className="text-yellow-300 mb-6 animate-bounce drop-shadow-lg" />
                <h2 className="text-4xl font-bold mb-3 text-center">Badge Unlocked!</h2>
                <p className="text-xl opacity-90">{celebration.badge}</p>
                <Button 
                    className="mt-8 bg-white text-sky-600 border-none font-bold px-8 h-12" 
                    size="large" 
                    shape="round"
                    onClick={() => setCelebration({ show: false, badge: null })}
                >
                    Awesome!
                </Button>
            </div>
        )}

      </Layout>
    </ConfigProvider>
  );
};

// Styles for simple animations that Tailwind doesn't include by default
const style = document.createElement('style');
style.textContent = `
  @keyframes confetti-fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  .animate-confetti-fall {
    animation-name: confetti-fall;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

export default App;