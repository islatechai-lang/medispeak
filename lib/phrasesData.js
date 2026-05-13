export const PHRASE_CATEGORIES = [
  { id: 'emergency', name: 'Emergency Care', icon: '🚨', color: '#EF4444' },
  { id: 'medication', name: 'Medication', icon: '💊', color: '#8B5CF6' },
  { id: 'vitals', name: 'Vital Signs', icon: '🩺', color: '#0D9488' },
  { id: 'diet', name: 'Diet & Nutrition', icon: '🍎', color: '#F59E0B' },
  { id: 'hygiene', name: 'Hygiene', icon: '🧼', color: '#06B6D4' },
  { id: 'comfort', name: 'Comfort Care', icon: '🛌', color: '#EC4899' },
  { id: 'labor', name: 'Labor & Delivery', icon: '👶', color: '#F472B6' },
  { id: 'surgical', name: 'Surgical Care', icon: '🏥', color: '#6366F1' },
  { id: 'community', name: 'Community Health', icon: '🏘️', color: '#10B981' },
  { id: 'general', name: 'General', icon: '💬', color: '#64748B' },
];

export const PHRASES = [
  // Emergency Care
  { id: 1, category: 'emergency', en: 'Please stay calm.', tl: 'Manatili po kayong kalmado.', ceb: 'Palihug pagkalma.', ilo: 'Pangngaasi nga agkalmaka.', war: 'Palihug pagkalma.' },
  { id: 2, category: 'emergency', en: 'You need to go to the emergency room.', tl: 'Kailangan po ninyong pumunta sa emergency room.', ceb: 'Kinahanglan ka moadto sa emergency room.', ilo: 'Masapul nga mapanka iti emergency room.', war: 'Kinahanglan ka kumadto ha emergency room.' },
  { id: 3, category: 'emergency', en: 'Take a deep breath.', tl: 'Huminga po kayo nang malalim.', ceb: 'Pagginhawa og lawom.', ilo: 'Angangesem a nauneg.', war: 'Paghangos hin halarom.' },
  { id: 4, category: 'emergency', en: 'Where is the pain located?', tl: 'Saan po ang masakit?', ceb: 'Asa ang sakit?', ilo: 'Sadino ti sakit?', war: 'Diin an masakit?' },
  { id: 5, category: 'emergency', en: 'Are you allergic to any medication?', tl: 'May allergy po ba kayo sa gamot?', ceb: 'Naa ka bay allergy sa tambal?', ilo: 'Adda ka kadi alerhi iti agas?', war: 'May allergy ka ba ha bulong?' },
  { id: 6, category: 'emergency', en: 'Can you tell me what happened?', tl: 'Puwede po bang sabihin ninyo kung ano ang nangyari?', ceb: 'Mahimo bang isulti nimo unsay nahitabo?', ilo: 'Mabalinmo kadi nga ibaga no ania ti napasamak?', war: 'Mahimo ba nimo isaysay kun ano an nahinabo?' },

  // Medication
  { id: 7, category: 'medication', en: 'Please take your medicine after eating.', tl: 'Inumin po ang gamot pagkatapos kumain.', ceb: 'Palihug inom sa imong tambal pagkahuman ug kaon.', ilo: 'Pangngaasi nga inumem ti agasmo kalpasan ti mangan.', war: 'Palihug pag-inom han imo bulong katapos kumaon.' },
  { id: 8, category: 'medication', en: 'Take this medicine three times a day.', tl: 'Inumin po ito ng tatlong beses sa isang araw.', ceb: 'Imna kini tulo ka beses sa usa ka adlaw.', ilo: 'Inumem daytoy mamintlo iti maysa nga aldaw.', war: 'Imna ini tres ka beses ha usa ka adlaw.' },
  { id: 9, category: 'medication', en: 'Do not skip your medication.', tl: 'Huwag po kayong makalimot uminom ng gamot.', ceb: 'Ayaw kalimti ang imong tambal.', ilo: 'Dika liplipatan ti agasmo.', war: 'Ayaw lipati an imo bulong.' },
  { id: 10, category: 'medication', en: 'Are you currently taking any medication?', tl: 'Umiinom po ba kayo ng gamot ngayon?', ceb: 'Nag-inom ka ba og tambal karon?', ilo: 'Agininum ka kadi iti agas ita?', war: 'Nag-iinom ka ba hin bulong yana?' },
  { id: 11, category: 'medication', en: 'This medicine may cause drowsiness.', tl: 'Ang gamot na ito ay maaaring magdulot ng antok.', ceb: 'Kini nga tambal mahimong makapakatulog.', ilo: 'Daytoy nga agas mabalin a makapatured.', war: 'Ini nga bulong mahimo makapaturog.' },
  { id: 12, category: 'medication', en: 'Please drink plenty of water with your medicine.', tl: 'Uminom po kayo ng maraming tubig kasama ang gamot.', ceb: 'Palihug pag-inom og daghan tubig uban sa imong tambal.', ilo: 'Pangngaasi nga uminom ka iti adu a danum.', war: 'Palihug pag-inom hin damo nga tubig upod han imo bulong.' },

  // Vital Signs
  { id: 13, category: 'vitals', en: 'I need to check your blood pressure.', tl: 'Kailangan ko pong i-check ang blood pressure ninyo.', ceb: 'Kinahanglan nakong susihon ang imong blood pressure.', ilo: 'Masapul a kitaek ti blood pressure mo.', war: 'Kinahanglan ko susihon an imo blood pressure.' },
  { id: 14, category: 'vitals', en: 'I will take your temperature now.', tl: 'Kukunin ko po ang temperatura ninyo ngayon.', ceb: 'Kuhaon nako ang imong temperatura karon.', ilo: 'Alaek ti temperatura mo ita.', war: 'Kukuhaon ko an imo temperatura yana.' },
  { id: 15, category: 'vitals', en: 'Please relax your arm.', tl: 'I-relax po ang inyong braso.', ceb: 'Palihug i-relax ang imong bukton.', ilo: 'Pangngaasi nga i-relax mo ti takiagmo.', war: 'Palihug i-relax an imo butkon.' },
  { id: 16, category: 'vitals', en: 'Your blood pressure is normal.', tl: 'Normal po ang blood pressure ninyo.', ceb: 'Normal ang imong blood pressure.', ilo: 'Normal ti blood pressure mo.', war: 'Normal an imo blood pressure.' },
  { id: 17, category: 'vitals', en: 'I need to check your heart rate.', tl: 'Kailangan ko pong i-check ang tibok ng puso ninyo.', ceb: 'Kinahanglan nakong susihon ang imong heart rate.', ilo: 'Masapul a kitaek ti heart rate mo.', war: 'Kinahanglan ko susihon an imo heart rate.' },
  { id: 18, category: 'vitals', en: 'Please breathe normally.', tl: 'Huminga po kayo nang normal.', ceb: 'Palihug pagginhawa og normal.', ilo: 'Pangngaasi nga angangesem a normal.', war: 'Palihug paghangos hin normal.' },

  // Diet & Nutrition
  { id: 19, category: 'diet', en: 'You should eat soft foods only.', tl: 'Dapat malambot na pagkain lang po ang kainin ninyo.', ceb: 'Kinahanglan humok nga pagkaon lang ang imong kaonon.', ilo: 'Masapul a nalambek laeng a taraon ti kanen mo.', war: 'Kinahanglan mahumok la nga pagkaon an imo kaonon.' },
  { id: 20, category: 'diet', en: 'Please avoid salty foods.', tl: 'Iwasan po ang maalat na pagkain.', ceb: 'Palihug likayan ang asin nga pagkaon.', ilo: 'Pangngaasi nga liklikam ti naparat a taraon.', war: 'Palihug likayan an maasin nga pagkaon.' },
  { id: 21, category: 'diet', en: 'Drink at least 8 glasses of water daily.', tl: 'Uminom po ng hindi bababa sa 8 baso ng tubig araw-araw.', ceb: 'Inom og labing menos 8 ka baso sa tubig adlaw-adlaw.', ilo: 'Uminom ka iti saan a bababa iti 8 a baso iti danum inaldaw.', war: 'Pag-inom hin diri maubos 8 ka baso hin tubig adlaw-adlaw.' },
  { id: 22, category: 'diet', en: 'Are you able to eat?', tl: 'Nakakakain po ba kayo?', ceb: 'Makakaon ka ba?', ilo: 'Makakan ka kadi?', war: 'Nakakakaon ka ba?' },
  { id: 23, category: 'diet', en: 'You need to fast before the procedure.', tl: 'Kailangan po kayong mag-fasting bago ang procedure.', ceb: 'Kinahanglan ka mag-puasa sa dili pa ang procedure.', ilo: 'Masapul nga ag-ayunar ka sakbay ti procedure.', war: 'Kinahanglan ka mag-puasa antes han procedure.' },
  { id: 24, category: 'diet', en: 'Have you eaten today?', tl: 'Kumain na po ba kayo ngayong araw?', ceb: 'Nakakaon ka na ba karon?', ilo: 'Nakangan ka kadin ita nga aldaw?', war: 'Nakakaon ka na ba yana nga adlaw?' },

  // Hygiene
  { id: 25, category: 'hygiene', en: 'Please wash your hands.', tl: 'Maghugas po kayo ng kamay.', ceb: 'Palihug panghugas sa imong kamot.', ilo: 'Pangngaasi nga buggoam ti imam.', war: 'Palihug panhugas han imo kamot.' },
  { id: 26, category: 'hygiene', en: 'I will help you take a bath.', tl: 'Tutulungan ko po kayong maligo.', ceb: 'Tabangan tika sa pagpaligo.', ilo: 'Tulongan ka nga agdigos.', war: 'Bubuligon ko ikaw pagligo.' },
  { id: 27, category: 'hygiene', en: 'Please change into a hospital gown.', tl: 'Magpalit po kayo ng hospital gown.', ceb: 'Palihug pag-ilis og hospital gown.', ilo: 'Pangngaasi nga agsukat ka iti hospital gown.', war: 'Palihug pag-ilis hin hospital gown.' },
  { id: 28, category: 'hygiene', en: 'I need to clean your wound.', tl: 'Kailangan ko pong linisin ang sugat ninyo.', ceb: 'Kinahanglan nakong limpyohan ang imong samad.', ilo: 'Masapul a dalusan ti sugat mo.', war: 'Kinahanglan ko limpyohan an imo samad.' },
  { id: 29, category: 'hygiene', en: 'Please brush your teeth.', tl: 'Magsipilyo po kayo.', ceb: 'Palihug pagsipilyo.', ilo: 'Pangngaasi nga agsipilyo ka.', war: 'Palihug pagsipilyo.' },
  { id: 30, category: 'hygiene', en: 'Do you need to use the bathroom?', tl: 'Kailangan po ba ninyong gumamit ng banyo?', ceb: 'Kinahanglan ba nimo gamiton ang banyo?', ilo: 'Masapul mo kadi ti agbanio?', war: 'Kinahanglan mo ba gamiton an banyo?' },

  // Comfort Care
  { id: 31, category: 'comfort', en: 'Are you comfortable?', tl: 'Komportable po ba kayo?', ceb: 'Komportable ka ba?', ilo: 'Komportable ka kadi?', war: 'Komportable ka ba?' },
  { id: 32, category: 'comfort', en: 'Do you need an extra pillow?', tl: 'Kailangan po ba ninyo ng karagdagang unan?', ceb: 'Kinahanglan ba nimo og dugang unlan?', ilo: 'Masapul mo kadi ti maysa pay a punan?', war: 'Kinahanglan mo ba hin dugang nga unan?' },
  { id: 33, category: 'comfort', en: 'I will adjust your bed.', tl: 'Iaayos ko po ang kama ninyo.', ceb: 'Ayuson nako ang imong higdaanan.', ilo: 'Iurnos ko ti pagiddaam.', war: 'Aayuson ko an imo higdaan.' },
  { id: 34, category: 'comfort', en: 'Would you like the lights dimmed?', tl: 'Gusto po ba ninyong pathinain ang ilaw?', ceb: 'Gusto ba nimo nga pahinayon ang suga?', ilo: 'Kayatmo kadi nga palusoyen ti silaw?', war: 'Gusto mo ba nga pahinayon an suga?' },
  { id: 35, category: 'comfort', en: 'Try to get some rest.', tl: 'Subukan po ninyong magpahinga.', ceb: 'Sulayi nga magpahulay.', ilo: 'Padasem ti agpahuway.', war: 'Pagtios nga magpahuway.' },
  { id: 36, category: 'comfort', en: 'Do you feel cold?', tl: 'Nalalamig po ba kayo?', ceb: 'Gibugnaw ka ba?', ilo: 'Nalamiis ka kadi?', war: 'Gintutugnaw ka ba?' },

  // Labor & Delivery
  { id: 37, category: 'labor', en: 'How far apart are your contractions?', tl: 'Gaano po kalayo ang pagitan ng mga contraction?', ceb: 'Unsa ka layo ang gilay-on sa imong mga contraction?', ilo: 'Mano ti kalawa dagiti contraction mo?', war: 'Ano ka harayo an mga contraction mo?' },
  { id: 38, category: 'labor', en: 'Please breathe slowly and deeply.', tl: 'Huminga po kayo nang dahan-dahan at malalim.', ceb: 'Palihug pagginhawa og hinay ug lawom.', ilo: 'Pangngaasi nga angangesem a nainayad ken nauneg.', war: 'Palihug paghangos hin hinay ngan halarom.' },
  { id: 39, category: 'labor', en: 'Push when I tell you.', tl: 'Mag-push po kayo kapag sinabi ko.', ceb: 'Pag-push kon sultihan tika.', ilo: 'Agpush ka no ibagak.', war: 'Pag-push kun igsumat ko ha imo.' },
  { id: 40, category: 'labor', en: 'You are doing very well.', tl: 'Napakagaling po ninyo.', ceb: 'Maayo kaayo ka.', ilo: 'Naimbag unay ti ar-aramiden mo.', war: 'Maupay gud ikaw.' },
  { id: 41, category: 'labor', en: 'The baby is healthy.', tl: 'Malusog po ang sanggol.', ceb: 'Himsog ang bata.', ilo: 'Nasalun-at ti maladaga/ubing.', war: 'Maupay an bata.' },
  { id: 42, category: 'labor', en: 'Would you like to hold your baby?', tl: 'Gusto po ba ninyong kargahin ang sanggol?', ceb: 'Gusto ba nimo magkugos sa bata?', ilo: 'Kayatmo kadi a kaluban ti ubing?', war: 'Gusto mo ba kumugos han bata?' },

  // Surgical Care
  { id: 43, category: 'surgical', en: 'The surgery went well.', tl: 'Matagumpay po ang operasyon.', ceb: 'Malampuson ang operasyon.', ilo: 'Nagballigi ti operasyon.', war: 'Malampuson an operasyon.' },
  { id: 44, category: 'surgical', en: 'Do not remove the bandage.', tl: 'Huwag po ninyong tanggalin ang benda.', ceb: 'Ayaw tangtanga ang benda.', ilo: 'Dimo ikkaten ti benda.', war: 'Ayaw tangtanga an benda.' },
  { id: 45, category: 'surgical', en: 'You need to rest after the surgery.', tl: 'Kailangan po ninyong magpahinga pagkatapos ng operasyon.', ceb: 'Kinahanglan ka magpahulay human sa operasyon.', ilo: 'Masapul nga agpahuway ka kalpasan ti operasyon.', war: 'Kinahanglan ka magpahuway katapos han operasyon.' },
  { id: 46, category: 'surgical', en: 'I will check your stitches.', tl: 'Titingnan ko po ang tahi ninyo.', ceb: 'Susihon nako ang imong tahi.', ilo: 'Kitaek ti dait mo.', war: 'Susihon ko an imo tahi.' },
  { id: 47, category: 'surgical', en: 'Please do not get the wound wet.', tl: 'Huwag po ninyong pababasakin ang sugat.', ceb: 'Palihug ayaw pabasa ang samad.', ilo: 'Pangngaasi a dimo pabasan ti sugat.', war: 'Palihug ayaw pabasaa an samad.' },
  { id: 48, category: 'surgical', en: 'When did you last eat or drink?', tl: 'Kailan po kayo huling kumain o uminom?', ceb: 'Kanus-a ka naulahi nakakaon o nakainom?', ilo: 'Kaano ti naudi a nanganka wenno naginumka?', war: 'San-o ka katapusi nakakaon o nakainom?' },

  // Community Health
  { id: 49, category: 'community', en: 'Have you been vaccinated?', tl: 'Na-vaccinate na po ba kayo?', ceb: 'Na-bakuna na ba ka?', ilo: 'Nabakuna ka kadin?', war: 'Na-bakuna na ba ikaw?' },
  { id: 50, category: 'community', en: 'Please bring your child for immunization.', tl: 'Dalhin po ang anak ninyo para sa bakuna.', ceb: 'Palihug dad-a ang imong anak para sa bakuna.', ilo: 'Pangngaasi nga iyegmo ti anakmo para iti bakuna.', war: 'Palihug dad-a an imo anak para ha bakuna.' },
  { id: 51, category: 'community', en: 'Wash your hands frequently to prevent illness.', tl: 'Maghugas po lagi ng kamay para maiwasan ang sakit.', ceb: 'Kanunay panghugas sa kamot para malikayan ang sakit.', ilo: 'Kanayon nga buggoam dagiti imam tapno maliklikan ti sakit.', war: 'Pirme panhugas han kamot para malikayan an sakit.' },
  { id: 52, category: 'community', en: 'Cover your mouth when coughing.', tl: 'Takpan po ang bibig kapag umuubo.', ceb: 'Tabon-i ang imong baba kon magub-o.', ilo: 'Takoban ti ngiwat mo no aguboka.', war: 'Tabunan an imo baba kun nag-uubo.' },
  { id: 53, category: 'community', en: 'Remove stagnant water to prevent dengue.', tl: 'Alisin po ang nakatigil na tubig para maiwasan ang dengue.', ceb: 'Kuhaa ang nagpundo nga tubig aron malikayan ang dengue.', ilo: 'Ikkaten ti nataneg a danum tapno maliklikan ti dengue.', war: 'Kuhaa an nagtutupong nga tubig para malikayan an dengue.' },
  { id: 54, category: 'community', en: 'Please visit the health center regularly.', tl: 'Bumisita po kayo sa health center nang regular.', ceb: 'Palihug bisita sa health center kanunay.', ilo: 'Pangngaasi nga bisitaem ti health center a regular.', war: 'Palihug bisita ha health center pirme.' },

  // General
  { id: 55, category: 'general', en: 'How are you feeling today?', tl: 'Kumusta po ang pakiramdam ninyo ngayon?', ceb: 'Kumusta ang imong gibati karon?', ilo: 'Kumusta ti riknam ita?', war: 'Kumusta an imo pagbati yana?' },
  { id: 56, category: 'general', en: 'Do you understand me?', tl: 'Naiintindihan po ba ninyo ako?', ceb: 'Nasabtan ba nimo ako?', ilo: 'Maawatak kadi?', war: 'Nasasabtan mo ba ako?' },
  { id: 57, category: 'general', en: 'Is there anything else you need?', tl: 'May kailangan pa po ba kayo?', ceb: 'Naa pa bay imong gikinahanglan?', ilo: 'Adda pay sabali a kasapulam?', war: 'May kinahanglan pa ba ikaw?' },
  { id: 58, category: 'general', en: 'Your family is here to see you.', tl: 'Nandito po ang pamilya ninyo para bisitahin kayo.', ceb: 'Nia ang imong pamilya aron bisitahon ka.', ilo: 'Adda ditoy ti pamiliam a bumisita kenka.', war: 'Aadi an imo pamilya para bisitahon ka.' },
  { id: 59, category: 'general', en: 'I will come back to check on you.', tl: 'Babalik po ako para i-check kayo.', ceb: 'Mobalik ko aron susihon ka.', ilo: 'Agsubli ak tapno kitaen ka.', war: 'Mabalik ako para susihon ka.' },
  { id: 60, category: 'general', en: 'Please press the call button if you need help.', tl: 'Pindutin po ang call button kung kailangan ninyo ng tulong.', ceb: 'Palihug pindota ang call button kon kinahanglan nimo og tabang.', ilo: 'Pangngaasi nga idutok ti call button no kasapulam ti tulong.', war: 'Palihug pindota an call button kun kinahanglan mo hin bulig.' },
];
