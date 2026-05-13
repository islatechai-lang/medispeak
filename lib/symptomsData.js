export const SYMPTOM_CATEGORIES = [
  { id: 'pain', name: 'Pain Location', icon: '🫁', color: '#EF4444' },
  { id: 'painscale', name: 'Pain Level', icon: '📊', color: '#F59E0B' },
  { id: 'fever', name: 'Fever / Temperature', icon: '🌡️', color: '#F97316' },
  { id: 'breathing', name: 'Breathing', icon: '💨', color: '#06B6D4' },
  { id: 'digestive', name: 'Nausea / Vomiting', icon: '🤢', color: '#84CC16' },
  { id: 'emotional', name: 'Emotional State', icon: '😟', color: '#8B5CF6' },
  { id: 'basic', name: 'Basic Needs', icon: '🙋', color: '#EC4899' },
];

export const SYMPTOMS = {
  pain: [
    { id: 'head', icon: '🤕', en: 'Headache', tl: 'Sakit ng ulo', ceb: 'Sakit sa ulo', ilo: 'Sakit ti ulo', war: 'Sakit han ulo' },
    { id: 'chest', icon: '💔', en: 'Chest pain', tl: 'Sakit ng dibdib', ceb: 'Sakit sa dughan', ilo: 'Sakit ti barukong', war: 'Sakit han dughan' },
    { id: 'stomach', icon: '🤢', en: 'Stomach pain', tl: 'Sakit ng tiyan', ceb: 'Sakit sa tiyan', ilo: 'Sakit ti tian', war: 'Sakit han tiyan' },
    { id: 'back', icon: '🔙', en: 'Back pain', tl: 'Sakit ng likod', ceb: 'Sakit sa likod', ilo: 'Sakit ti likod', war: 'Sakit han likod' },
    { id: 'joints', icon: '🦵', en: 'Joint pain', tl: 'Sakit ng kasukasuan', ceb: 'Sakit sa lutahan', ilo: 'Sakit ti palpallugadan', war: 'Sakit han mga lutahan' },
    { id: 'throat', icon: '🗣️', en: 'Sore throat', tl: 'Sakit ng lalamunan', ceb: 'Sakit sa tutonlan', ilo: 'Sakit ti karabukob', war: 'Sakit han tutonlan' },
  ],
  painscale: [
    { id: 'p0', icon: '😊', en: 'No pain (0)', tl: 'Walang sakit (0)', ceb: 'Walay sakit (0)', ilo: 'Awan sakit (0)', war: 'Waray sakit (0)' },
    { id: 'p2', icon: '🙂', en: 'Mild pain (2)', tl: 'Bahagyang masakit (2)', ceb: 'Gamay nga sakit (2)', ilo: 'Bassit a sakit (2)', war: 'Gutiay nga sakit (2)' },
    { id: 'p4', icon: '😐', en: 'Moderate pain (4)', tl: 'Katamtamang sakit (4)', ceb: 'Kasarangan nga sakit (4)', ilo: 'Katamtaman a sakit (4)', war: 'Katamtaman nga sakit (4)' },
    { id: 'p6', icon: '😟', en: 'Severe pain (6)', tl: 'Matinding sakit (6)', ceb: 'Grabe nga sakit (6)', ilo: 'Nasakit unay (6)', war: 'Grabe nga sakit (6)' },
    { id: 'p8', icon: '😣', en: 'Very severe (8)', tl: 'Napakasaking sakit (8)', ceb: 'Grabe kaayo nga sakit (8)', ilo: 'Nasakit unay unay (8)', war: 'Grabe gud nga sakit (8)' },
    { id: 'p10', icon: '😭', en: 'Worst pain (10)', tl: 'Pinakamatinding sakit (10)', ceb: 'Pinakagrabeng sakit (10)', ilo: 'Kasakitan (10)', war: 'Pinakagrabeng sakit (10)' },
  ],
  fever: [
    { id: 'hot', icon: '🥵', en: 'I feel hot', tl: 'Mainit ang pakiramdam ko', ceb: 'Init akong gibati', ilo: 'Napudot ti riknak', war: 'Mainit an akon pagbati' },
    { id: 'cold', icon: '🥶', en: 'I feel cold', tl: 'Ginginaw ako', ceb: 'Gibugnaw ko', ilo: 'Nalamiis ak', war: 'Gintutugnaw ako' },
    { id: 'sweat', icon: '💦', en: 'I am sweating', tl: 'Pinagpapawisan ako', ceb: 'Nagsingot ko', ilo: 'Aglingling ak', war: 'Nabalhas ako' },
    { id: 'feverish', icon: '🌡️', en: 'I have a fever', tl: 'May lagnat ako', ceb: 'Naa koy hilanat', ilo: 'Adda gurigorko', war: 'May hilanat ako' },
  ],
  breathing: [
    { id: 'shortness', icon: '😤', en: 'Difficulty breathing', tl: 'Hirap huminga', ceb: 'Lisod mogininhawa', ilo: 'Narigat ti anganges', war: 'Masakit humangos' },
    { id: 'cough', icon: '🤧', en: 'Coughing', tl: 'Umuubo', ceb: 'Nag-ubo', ilo: 'Agubo', war: 'Nag-uubo' },
    { id: 'wheeze', icon: '🫁', en: 'Wheezing', tl: 'Humihilik ang hininga', ceb: 'Nagahiyok ang gininhawa', ilo: 'Agsiyyek ti anges', war: 'Naghihiyok an hangos' },
    { id: 'choking', icon: '😰', en: 'Choking', tl: 'Nababalunan', ceb: 'Nalumos', ilo: 'Mabukbukel', war: 'Nalulumos' },
  ],
  digestive: [
    { id: 'nausea', icon: '🤢', en: 'Nauseous', tl: 'Nahihilo ako', ceb: 'Nasuka ko', ilo: 'Agsuksukak', war: 'Nasusuka ako' },
    { id: 'vomiting', icon: '🤮', en: 'Vomiting', tl: 'Nagsusuka ako', ceb: 'Nagsuka ko', ilo: 'Agsukak', war: 'Nagsusuka ako' },
    { id: 'diarrhea', icon: '🚽', en: 'Diarrhea', tl: 'May diarrhea ako', ceb: 'Naa koy kalibanga', ilo: 'Agpurpurak', war: 'May pagkalibang ako' },
    { id: 'noappetite', icon: '🍽️', en: 'No appetite', tl: 'Walang gana kumain', ceb: 'Walay gana mokaon', ilo: 'Awan ganask a mangan', war: 'Waray gana kumaon' },
  ],
  emotional: [
    { id: 'scared', icon: '😨', en: 'I am scared', tl: 'Takot ako', ceb: 'Nahadlok ko', ilo: 'Maabutnak', war: 'Nahadlok ako' },
    { id: 'sad', icon: '😢', en: 'I am sad', tl: 'Malungkot ako', ceb: 'Naguol ko', ilo: 'Naladingitak', war: 'Masulob-on ako' },
    { id: 'anxious', icon: '😰', en: 'I feel anxious', tl: 'Kinakabahan ako', ceb: 'Nabalaka ko', ilo: 'Madanaganak', war: 'Nababaraka ako' },
    { id: 'happy', icon: '😊', en: 'Feeling better', tl: 'Bumubuti na', ceb: 'Nagayo na', ilo: 'Bumumbuti', war: 'Naaupay na' },
  ],
  basic: [
    { id: 'water', icon: '💧', en: 'I need water', tl: 'Kailangan ko ng tubig', ceb: 'Kinahanglan nako og tubig', ilo: 'Kasapulak iti danum', war: 'Kinahanglan ko hin tubig' },
    { id: 'food', icon: '🍚', en: 'I am hungry', tl: 'Gutom ako', ceb: 'Gutom ko', ilo: 'Mabisinek', war: 'Gutom ako' },
    { id: 'bathroom', icon: '🚻', en: 'Need the bathroom', tl: 'Kailangan kong pumunta sa banyo', ceb: 'Kinahanglan nako moadto sa banyo', ilo: 'Masapulak nga mapan iti banio', war: 'Kinahanglan ko kumadto ha banyo' },
    { id: 'help', icon: '🆘', en: 'I need help', tl: 'Kailangan ko ng tulong', ceb: 'Kinahanglan nako og tabang', ilo: 'Kasapulak iti tulong', war: 'Kinahanglan ko hin bulig' },
    { id: 'sleep', icon: '😴', en: 'I want to sleep', tl: 'Gusto kong matulog', ceb: 'Gusto nako matulog', ilo: 'Kayatko ti maturog', war: 'Gusto ko maturog' },
    { id: 'family', icon: '👨‍👩‍👧', en: 'I want to see my family', tl: 'Gusto kong makita ang pamilya ko', ceb: 'Gusto nako makita ang akong pamilya', ilo: 'Kayatko a makita ti pamiliak', war: 'Gusto ko makita an akon pamilya' },
  ],
};
