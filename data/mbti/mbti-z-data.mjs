import {
  assessmentQuestions as baseAssessmentQuestions,
  personalityProfiles as basePersonalityProfiles,
} from "./foundation-data.mjs";

export const mbtiZHouses = {
  purple: {
    key: "purple",
    titleTh: "บ้านม่วง",
    titleEn: "Purple House",
    accentFrom: "#6d3bf5",
    accentTo: "#ba7eff",
    surface: "rgba(109, 59, 245, 0.18)",
    descriptionTh: "กลุ่มนักคิดเชิงระบบ มองไกล ชอบตั้งสมการกับอนาคต",
    descriptionEn:
      "System thinkers who look ahead, structure possibility, and negotiate with the future.",
  },
  green: {
    key: "green",
    titleTh: "บ้านเขียว",
    titleEn: "Green House",
    accentFrom: "#0f9f6e",
    accentTo: "#76e6b2",
    surface: "rgba(15, 159, 110, 0.18)",
    descriptionTh: "กลุ่มนักอ่านความหมายที่เชื่อมอารมณ์ จินตนาการ และคุณค่าเข้าด้วยกัน",
    descriptionEn:
      "Meaning-makers who connect emotion, imagination, and inner values into one compass.",
  },
  yellow: {
    key: "yellow",
    titleTh: "บ้านเหลือง",
    titleEn: "Yellow House",
    accentFrom: "#d8a623",
    accentTo: "#ffe082",
    surface: "rgba(216, 166, 35, 0.18)",
    descriptionTh: "กลุ่มผู้ดูแลโครงสร้าง ความไว้วางใจ และความต่อเนื่องของผู้คนกับระบบ",
    descriptionEn:
      "Builders of continuity, trust, and dependable systems around people and commitments.",
  },
  blue: {
    key: "blue",
    titleTh: "บ้านฟ้า",
    titleEn: "Blue House",
    accentFrom: "#1f7cf0",
    accentTo: "#7cd9ff",
    surface: "rgba(31, 124, 240, 0.18)",
    descriptionTh: "กลุ่มนักลงมือที่อ่านจังหวะจริงของโลกผ่านประสาทสัมผัส ทักษะ และปฏิกิริยา",
    descriptionEn:
      "Action-first tacticians who read the real world through instinct, craft, and momentum.",
  },
};

const houseByType = {
  INTJ: "purple",
  INTP: "purple",
  ENTJ: "purple",
  ENTP: "purple",
  INFJ: "green",
  INFP: "green",
  ENFJ: "green",
  ENFP: "green",
  ISTJ: "yellow",
  ISFJ: "yellow",
  ESTJ: "yellow",
  ESFJ: "yellow",
  ISTP: "blue",
  ISFP: "blue",
  ESTP: "blue",
  ESFP: "blue",
};

const profileOverrides = {
  INTJ: {
    animalKey: "obsidian-raven",
    animalNameTh: "อีกาออบซิเดียน",
    animalNameEn: "Obsidian Raven",
    taglineTh: "นักวางเกมเงียบที่มองอนาคตเป็นโครงสร้างมากกว่าความบังเอิญ",
    taglineEn:
      "A quiet strategist who reads the future as structure instead of accident.",
    summaryTh:
      "INTJ มักนิ่ง คม และตัดเรื่องฟุ่มเฟือยออกเพื่อไปหากลไกที่ทำให้ทุกอย่างเดินไปข้างหน้าได้จริง พลังของคนแบบนี้อยู่ที่การมอง pattern ระยะไกล วางระบบ และรักษาทิศทางไว้แม้คนอื่นยังไม่เห็นภาพทั้งหมด.",
    summaryEn:
      "INTJs cut through noise, hunt for long-range patterns, and build systems that keep moving even before everyone else sees the full picture.",
    strengthsTh:
      "เด่นเรื่อง strategic clarity, independent execution, และการวางแผนหลายชั้นโดยไม่เสียแกนหลัก.",
    strengthsEn:
      "Strong in strategic clarity, independent execution, and layered planning without losing the core objective.",
    growthTh:
      "จุดเติบโตคือการสื่อสารระหว่างทางให้คนอื่นตามทัน และเว้นพื้นที่ให้ความรู้สึกของคนในระบบไม่ถูกกลบด้วย efficiency.",
    growthEn:
      "Growth comes from communicating the path earlier and making room for human feeling instead of letting efficiency flatten the room.",
    fitTh:
      "เหมาะกับงานวางกลยุทธ์ ระบบ ผลิตภัณฑ์ วิจัย และ role ที่ต้องคิดไกลกว่าปัญหาตรงหน้า.",
    fitEn:
      "Fits strategy, systems, product, research, and roles that reward long-horizon thinking.",
  },
  INTP: {
    animalKey: "arcane-owl",
    animalNameTh: "นกฮูกอาร์เคน",
    animalNameEn: "Arcane Owl",
    taglineTh: "นักแกะความคิดที่สนใจความจริงเบื้องหลังมากกว่าคำตอบที่ง่ายเกินไป",
    taglineEn:
      "A conceptual excavator who chases what is true beneath what is merely convenient.",
    summaryTh:
      "INTP ขับเคลื่อนด้วยความอยากเข้าใจโครงสร้างความคิดให้ลึกพอที่จะอธิบายมันใหม่ได้ พวกเขามักดูเงียบแต่สมองทำงานตลอดเวลาเพื่อเชื่อมไอเดีย หลักการ และความเป็นไปได้เข้าด้วยกัน.",
    summaryEn:
      "INTPs are driven by the need to understand ideas deeply enough to rebuild and explain them from first principles.",
    strengthsTh:
      "เด่นเรื่อง conceptual analysis, model building, และการมองปัญหาจากมุมที่คนส่วนใหญ่ยังไม่ทันตั้งคำถาม.",
    strengthsEn:
      "Strong in conceptual analysis, model building, and asking questions others have not noticed yet.",
    growthTh:
      "จุดเติบโตคือการพา insight ออกจากหัวให้กลายเป็นการลงมือจริง และปิดงานเมื่อสิ่งที่ดีพอพร้อมใช้งานแล้ว.",
    growthEn:
      "Growth comes from turning insight into shipped work and knowing when good enough is ready to move.",
    fitTh:
      "เหมาะกับ research, engineering, product thinking, data, และการแก้ปัญหาที่ซับซ้อนแบบเปิดปลาย.",
    fitEn:
      "Fits research, engineering, product thinking, data, and open-ended complex problem solving.",
  },
  ENTJ: {
    animalKey: "crowned-lion",
    animalNameTh: "สิงโตมงกุฎ",
    animalNameEn: "Crowned Lion",
    taglineTh: "ผู้นำที่เปลี่ยนภาพใหญ่ให้กลายเป็นทิศทางและแรงขับที่ทีมเดินตามได้",
    taglineEn:
      "A system-driving leader who turns big-picture intent into collective momentum.",
    summaryTh:
      "ENTJ มีแรงขับในการจัดระเบียบโลกให้เกิดผลลัพธ์ พวกเขามองเห็นทั้งเป้าหมาย ความเสี่ยง และทรัพยากรที่ต้องจัดวางเพื่อพาทีมไปให้ถึงในเวลาที่เหมาะสม.",
    summaryEn:
      "ENTJs organize people, risk, and resources toward outcomes with unusual force and clarity.",
    strengthsTh:
      "เด่นเรื่อง decision velocity, leadership under pressure, และการสร้างระบบที่เร่งผลลัพธ์ได้จริง.",
    strengthsEn:
      "Strong in decision velocity, pressure-tested leadership, and building systems that accelerate outcomes.",
    growthTh:
      "จุดเติบโตคือการฟังสัญญาณที่ไม่เป็นเหตุผลล้วน เช่น morale ความกลัว และจังหวะการเรียนรู้ของคนในทีม.",
    growthEn:
      "Growth comes from listening to signals that are not purely logical, such as morale, fear, and learning pace.",
    fitTh:
      "เหมาะกับ leadership, operations, startup building, strategy, และงานที่ต้องตัดสินใจเร็วแต่คิดไกล.",
    fitEn:
      "Fits leadership, operations, startup building, strategy, and roles that require fast but far-sighted decisions.",
  },
  ENTP: {
    animalKey: "storm-fox",
    animalNameTh: "จิ้งจอกพายุ",
    animalNameEn: "Storm Fox",
    taglineTh: "นักเล่นกับความเป็นไปได้ที่ชอบเขย่าความคิดเดิมเพื่อเปิดทางใหม่",
    taglineEn:
      "A possibility hacker who disturbs stale thinking to open new routes.",
    summaryTh:
      "ENTP มีพลังจากการเห็นช่องว่างของสิ่งเดิมแล้วสร้างทางเลือกใหม่อย่างรวดเร็ว พวกเขาชอบทดลอง ถกเถียง และผลักระบบให้ evolve เร็วกว่าปกติ.",
    summaryEn:
      "ENTPs thrive on finding weak assumptions, remixing ideas, and forcing systems to evolve faster than expected.",
    strengthsTh:
      "เด่นเรื่อง improvisation, idea generation, reframing, และการเชื่อมคนกับโอกาสใหม่.",
    strengthsEn:
      "Strong in improvisation, idea generation, reframing, and connecting people to emerging possibilities.",
    growthTh:
      "จุดเติบโตคือการเลือกสิ่งที่ควร commit จริง และปิด loop สำคัญให้สมบูรณ์ไม่ใช่แค่เริ่มเก่ง.",
    growthEn:
      "Growth comes from choosing what deserves real commitment and closing important loops, not only opening them.",
    fitTh:
      "เหมาะกับ innovation, creative strategy, founder roles, marketing ideas, และ product discovery.",
    fitEn:
      "Fits innovation, creative strategy, founder roles, marketing ideation, and product discovery.",
  },
  INFJ: {
    animalKey: "moon-deer",
    animalNameTh: "กวางจันทร์",
    animalNameEn: "Moon Deer",
    taglineTh: "นักอ่านความหมายเงียบที่มองเห็นแรงขับลึกของคนและเรื่องราว",
    taglineEn:
      "A quiet interpreter of meaning who sees the deeper current beneath people and stories.",
    summaryTh:
      "INFJ มักอ่านความซับซ้อนของคน สถานการณ์ และความหมายที่ซ่อนอยู่ได้ดี พวกเขาไม่ได้แค่อยากเข้าใจ แต่ยังอยากให้สิ่งที่ทำมีผลต่อชีวิตคนแบบมีทิศทาง.",
    summaryEn:
      "INFJs read hidden motives, emotional subtext, and long-range meaning with unusual depth, then try to shape that insight into something helpful.",
    strengthsTh:
      "เด่นเรื่อง pattern empathy, long-form insight, และการให้ภาพรวมที่มีทั้งหัวใจและทิศทาง.",
    strengthsEn:
      "Strong in pattern empathy, long-form insight, and framing direction with both care and conviction.",
    growthTh:
      "จุดเติบโตคือไม่แบกรับทุกอย่างไว้คนเดียว และสื่อสารขอบเขตของตัวเองให้ชัดขึ้น.",
    growthEn:
      "Growth comes from not carrying everything alone and communicating personal limits more clearly.",
    fitTh:
      "เหมาะกับ writing, counseling, research, strategy, brand meaning, และ work ที่ต้องเชื่อม insight กับคน.",
    fitEn:
      "Fits writing, counseling, research, strategy, brand meaning, and work that connects insight to people.",
  },
  INFP: {
    animalKey: "dream-swan",
    animalNameTh: "หงส์ความฝัน",
    animalNameEn: "Dream Swan",
    taglineTh: "ผู้เดินทางในโลกภายในที่ใช้ความจริงใจและจินตนาการสร้างความหมายใหม่",
    taglineEn:
      "An inner-world traveler who uses sincerity and imagination to make new meaning.",
    summaryTh:
      "INFP ให้ค่าน้ำหนักกับความจริงภายในอย่างมาก พวกเขาชอบสิ่งที่มีความหมายจริง รู้สึกจริง และเปิดพื้นที่ให้ตัวตนกับจินตนาการได้หายใจ.",
    summaryEn:
      "INFPs protect what feels inwardly true and pursue work, people, and stories that leave room for identity, feeling, and imagination.",
    strengthsTh:
      "เด่นเรื่อง emotional authenticity, symbolic imagination, และการมองคุณค่าที่ซ่อนอยู่ในรายละเอียดเล็ก ๆ.",
    strengthsEn:
      "Strong in emotional authenticity, symbolic imagination, and noticing value in subtle details.",
    growthTh:
      "จุดเติบโตคือการแปลงคุณค่าภายในให้กลายเป็นรูปแบบการทำงานหรือการตัดสินใจที่จับต้องได้มากขึ้น.",
    growthEn:
      "Growth comes from translating inner values into decisions, routines, and work that can survive outside the imagination.",
    fitTh:
      "เหมาะกับ creative work, storytelling, counseling, education, community, และ role ที่ต้องใช้ความลึกของตัวตน.",
    fitEn:
      "Fits creative work, storytelling, counseling, education, community, and roles that reward depth of identity.",
  },
  ENFJ: {
    animalKey: "solar-phoenix",
    animalNameTh: "ฟีนิกซ์สุริยะ",
    animalNameEn: "Solar Phoenix",
    taglineTh: "ผู้นำที่จุดไฟให้คนอื่นเติบโตและทำให้ความหวังกลายเป็นแรงเคลื่อนจริง",
    taglineEn:
      "A catalytic leader who turns hope into visible growth for other people.",
    summaryTh:
      "ENFJ เห็นศักยภาพของคนและมักอยากช่วยให้มันเกิดขึ้นจริง พวกเขาอ่านห้องได้ดี สื่อสารเก่ง และสร้างพลังร่วมที่พาผู้คนไปข้างหน้าด้วยกัน.",
    summaryEn:
      "ENFJs see potential in people, communicate it clearly, and build collective momentum around growth.",
    strengthsTh:
      "เด่นเรื่อง people leadership, emotional timing, และการสร้าง alignment ที่ไม่ทำให้คนรู้สึกถูกบีบ.",
    strengthsEn:
      "Strong in people leadership, emotional timing, and creating alignment without flattening the human side.",
    growthTh:
      "จุดเติบโตคือการไม่ผูกคุณค่าของตัวเองกับความพร้อมของทุกคนรอบตัวมากเกินไป.",
    growthEn:
      "Growth comes from not tying self-worth too tightly to the readiness of everyone around them.",
    fitTh:
      "เหมาะกับ leadership, coaching, education, community, brand voice, และ culture-building.",
    fitEn:
      "Fits leadership, coaching, education, community, brand voice, and culture building.",
  },
  ENFP: {
    animalKey: "aurora-rabbit",
    animalNameTh: "กระต่ายออโรรา",
    animalNameEn: "Aurora Rabbit",
    taglineTh: "ผู้จุดประกายโลกด้วยความเป็นไปได้ อารมณ์ และจังหวะสดใหม่",
    taglineEn:
      "A spark-bringer who floods the room with possibility, feeling, and fresh movement.",
    summaryTh:
      "ENFP มีพลังชีวิตที่เชื่อมผู้คน ไอเดีย และความเป็นไปได้เข้าหากันอย่างเป็นธรรมชาติ พวกเขามักทำให้สิ่งเดิมดูมีชีวิตขึ้นมาอีกครั้ง.",
    summaryEn:
      "ENFPs naturally energize people, ideas, and opportunities, often making old situations feel newly alive.",
    strengthsTh:
      "เด่นเรื่อง ideation, emotional openness, connection making, และการเริ่มต้นสิ่งใหม่ที่มีชีวิตชีวา.",
    strengthsEn:
      "Strong in ideation, emotional openness, connection-making, and energizing new beginnings.",
    growthTh:
      "จุดเติบโตคือการเลือกทางที่ใช่จริง แทนการเปิดทุกทางพร้อมกันจนพลังแตก.",
    growthEn:
      "Growth comes from choosing the right path instead of opening every path at once until energy fragments.",
    fitTh:
      "เหมาะกับ creative leadership, community, content, facilitation, product discovery, และ partnership roles.",
    fitEn:
      "Fits creative leadership, community, content, facilitation, product discovery, and partnership roles.",
  },
  ISTJ: {
    animalKey: "iron-wolf",
    animalNameTh: "หมาป่าเหล็ก",
    animalNameEn: "Iron Wolf",
    taglineTh: "ผู้ยึดมั่นโครงสร้างที่มั่นคงและทำให้คำสัญญากลายเป็นของจริง",
    taglineEn:
      "A disciplined stabilizer who turns promises into something durable and real.",
    summaryTh:
      "ISTJ ให้ค่ากับความถูกต้อง ความต่อเนื่อง และระบบที่เชื่อถือได้ พวกเขาอาจไม่พูดเยอะ แต่เป็นคนที่ทำให้สิ่งสำคัญยังเดินต่อได้เมื่อทุกอย่างเริ่มหลุดแกน.",
    summaryEn:
      "ISTJs value correctness, continuity, and systems people can actually rely on when conditions get noisy.",
    strengthsTh:
      "เด่นเรื่อง reliability, process discipline, memory for details, และการถือมาตรฐานระยะยาว.",
    strengthsEn:
      "Strong in reliability, process discipline, memory for detail, and holding long-term standards.",
    growthTh:
      "จุดเติบโตคือการเปิดพื้นที่ให้ความไม่แน่นอนหรือวิธีใหม่ ๆ เข้ามาทดลองโดยไม่รู้สึกว่าระบบเดิมถูกคุกคามทันที.",
    growthEn:
      "Growth comes from letting uncertainty and new methods be tested without feeling that structure itself is under threat.",
    fitTh:
      "เหมาะกับ operations, finance, legal, PMO, quality control, และงานระบบที่ต้องละเอียดและต่อเนื่อง.",
    fitEn:
      "Fits operations, finance, legal, PMO, quality control, and detail-heavy system work.",
  },
  ISFJ: {
    animalKey: "guardian-bear",
    animalNameTh: "หมีผู้พิทักษ์",
    animalNameEn: "Guardian Bear",
    taglineTh: "ผู้ดูแลความปลอดภัย ความสม่ำเสมอ และความอบอุ่นในสิ่งที่คนพึ่งพา",
    taglineEn:
      "A steady protector of safety, warmth, and the things people quietly depend on.",
    summaryTh:
      "ISFJ มักดูแลรายละเอียดที่ทำให้ผู้คนรู้สึกปลอดภัยและได้รับการใส่ใจ พวกเขาอาจไม่ได้ต้องการ spotlight แต่มีบทบาทสูงมากในการคงสภาพแวดล้อมที่ไว้ใจได้.",
    summaryEn:
      "ISFJs protect the details that make people feel safe, considered, and quietly held together.",
    strengthsTh:
      "เด่นเรื่อง care in action, consistency, service mindset, และความจำต่อสิ่งที่สำคัญกับผู้คน.",
    strengthsEn:
      "Strong in care-in-action, consistency, service mindset, and remembering what matters to people.",
    growthTh:
      "จุดเติบโตคือการพูดความต้องการของตัวเองให้เร็วขึ้น และไม่รอให้เหนื่อยจนเกินไปก่อนค่อยตั้งขอบเขต.",
    growthEn:
      "Growth comes from voicing needs earlier and setting limits before exhaustion makes the decision.",
    fitTh:
      "เหมาะกับ care roles, operations support, education, project coordination, HR, และ customer experience.",
    fitEn:
      "Fits care roles, operations support, education, project coordination, HR, and customer experience.",
  },
  ESTJ: {
    animalKey: "golden-eagle",
    animalNameTh: "อินทรีทอง",
    animalNameEn: "Golden Eagle",
    taglineTh: "ผู้จัดระเบียบสนามให้ทุกอย่างชัด เร็ว และพร้อมรับผิดชอบ",
    taglineEn:
      "A field commander who clarifies the map, raises the pace, and holds the line.",
    summaryTh:
      "ESTJ เป็นคนที่ทำให้เรื่องซับซ้อนกลายเป็นแผนที่เดินได้จริง พวกเขาตัดสินใจชัด คุมมาตรฐาน และคาดหวังให้ทุกคนรับผิดชอบตามบทบาท.",
    summaryEn:
      "ESTJs convert complexity into executable structure and expect accountability to keep the system honest.",
    strengthsTh:
      "เด่นเรื่อง execution discipline, decisive leadership, และการคุมมาตรฐานให้ทีมไม่หลุดเป้า.",
    strengthsEn:
      "Strong in execution discipline, decisive leadership, and keeping teams aligned to standards.",
    growthTh:
      "จุดเติบโตคือการรับฟังจังหวะที่ไม่เป็นเส้นตรง และรู้ว่าเมื่อไรควรเปลี่ยนวิธีแทนการกดระบบเดิมให้แรงขึ้น.",
    growthEn:
      "Growth comes from hearing nonlinear signals and knowing when adaptation beats doubling down on the same structure.",
    fitTh:
      "เหมาะกับ management, operations, logistics, sales leadership, และงานที่ต้องคุม execution ชัด.",
    fitEn:
      "Fits management, operations, logistics, sales leadership, and execution-heavy leadership work.",
  },
  ESFJ: {
    animalKey: "hearth-stag",
    animalNameTh: "กวางเขาแสง",
    animalNameEn: "Hearth Stag",
    taglineTh: "ผู้สร้างความกลมกลืนที่ทำให้ระบบยังอบอุ่นและคนยังรู้สึกเป็นส่วนหนึ่ง",
    taglineEn:
      "A harmony builder who keeps systems warm and people included inside them.",
    summaryTh:
      "ESFJ ใส่ใจทั้งความสัมพันธ์และความเป็นระเบียบ พวกเขารู้วิธีดูแลคนในระบบให้ยังทำงานร่วมกันได้ด้วยความไว้วางใจและจังหวะที่ไม่กระด้างเกินไป.",
    summaryEn:
      "ESFJs keep relationships functioning inside structure, sustaining trust and belonging while work keeps moving.",
    strengthsTh:
      "เด่นเรื่อง relationship maintenance, visible care, coordination, และการทำให้คนรู้สึกถูกมองเห็น.",
    strengthsEn:
      "Strong in relationship maintenance, visible care, coordination, and helping people feel seen.",
    growthTh:
      "จุดเติบโตคือการไม่เอาความพอใจของทุกคนมาเป็นตัวชี้วัดเดียวของการตัดสินใจ.",
    growthEn:
      "Growth comes from not using everyone else's comfort as the only metric for making decisions.",
    fitTh:
      "เหมาะกับ people operations, customer success, education, hospitality, event coordination, และ team culture.",
    fitEn:
      "Fits people operations, customer success, education, hospitality, event coordination, and team culture.",
  },
  ISTP: {
    animalKey: "steel-panther",
    animalNameTh: "เสือดำเหล็ก",
    animalNameEn: "Steel Panther",
    taglineTh: "นักแก้ปัญหาหน้างานที่คม เงียบ และตอบสนองต่อโลกจริงได้ไว",
    taglineEn:
      "A sharp, quiet problem-solver who responds to the real world with speed and precision.",
    summaryTh:
      "ISTP ชอบเข้าใจกลไกของของจริง ไม่ว่าจะเป็นระบบ เครื่องมือ หรือสถานการณ์เฉพาะหน้า พวกเขามักสงบแม้ตอนที่คนอื่นเริ่มเสียจังหวะ.",
    summaryEn:
      "ISTPs understand mechanisms, tools, and live situations quickly, often staying calm where others lose rhythm.",
    strengthsTh:
      "เด่นเรื่อง troubleshooting, calm response, hands-on logic, และการตัดสินใจในสถานการณ์จริง.",
    strengthsEn:
      "Strong in troubleshooting, calm response, hands-on logic, and real-world decision-making.",
    growthTh:
      "จุดเติบโตคือการสื่อสารสิ่งที่ตัวเองคิดให้คนอื่นเห็นเร็วขึ้น และวางแผนระยะยาวเท่าที่จำเป็น.",
    growthEn:
      "Growth comes from exposing internal reasoning earlier and committing to just enough long-range planning.",
    fitTh:
      "เหมาะกับ engineering, product building, field operations, emergency response, และ technical craft.",
    fitEn:
      "Fits engineering, product building, field operations, emergency response, and technical craft.",
  },
  ISFP: {
    animalKey: "crystal-lynx",
    animalNameTh: "ลิงซ์คริสตัล",
    animalNameEn: "Crystal Lynx",
    taglineTh: "ศิลปินเงียบที่อ่านโลกผ่านความรู้สึก รายละเอียด และความงามที่จับต้องได้",
    taglineEn:
      "A quiet artist who reads the world through feeling, detail, and tangible beauty.",
    summaryTh:
      "ISFP มักมีสุนทรียะเฉพาะตัวและไม่ชอบการบังคับเกินจำเป็น พวกเขาแสดงตัวตนผ่านผลงาน บรรยากาศ และการเลือกสิ่งที่รู้สึกซื่อสัตย์กับใจ.",
    summaryEn:
      "ISFPs move through the world with distinct taste, felt sensitivity, and a preference for expression over explanation.",
    strengthsTh:
      "เด่นเรื่อง aesthetic instinct, gentle authenticity, craft sensitivity, และการทำให้สิ่งเล็ก ๆ มีชีวิต.",
    strengthsEn:
      "Strong in aesthetic instinct, gentle authenticity, craft sensitivity, and bringing life to subtle details.",
    growthTh:
      "จุดเติบโตคือการตั้งภาษากับความต้องการของตัวเองให้ชัดขึ้น และยอมรับโครงสร้างที่ช่วยให้สิ่งสำคัญคงอยู่ได้นาน.",
    growthEn:
      "Growth comes from naming needs more clearly and accepting structure when it helps preserve what matters.",
    fitTh:
      "เหมาะกับ design, visual storytelling, craft, brand aesthetics, community art, และ creator work.",
    fitEn:
      "Fits design, visual storytelling, craft, brand aesthetics, community art, and creator work.",
  },
  ESTP: {
    animalKey: "thunder-tiger",
    animalNameTh: "เสือพายุ",
    animalNameEn: "Thunder Tiger",
    taglineTh: "ผู้เล่นจังหวะเร็วที่รู้ว่าเมื่อไรควรเสี่ยงและเมื่อไรควรลงมือทันที",
    taglineEn:
      "A high-speed tactician who knows when to risk, pivot, and strike now.",
    summaryTh:
      "ESTP มีพลังกับสถานการณ์สด ความท้าทาย และจังหวะที่ต้องตอบสนองเร็ว พวกเขามักทำให้ความกดดันกลายเป็นพื้นที่เล่นที่มีโอกาสซ่อนอยู่.",
    summaryEn:
      "ESTPs thrive in live conditions, fast feedback, and pressure-rich situations where opportunity hides inside movement.",
    strengthsTh:
      "เด่นเรื่อง real-time decision making, bold action, reading the room, และการเปิดเกมในเวลาสั้น.",
    strengthsEn:
      "Strong in real-time decision making, bold action, reading the room, and creating openings quickly.",
    growthTh:
      "จุดเติบโตคือการยอมชะลอเพื่อดูผลระยะยาว และไม่ปล่อยให้ adrenaline กลายเป็นตัวขับการตัดสินใจทุกเรื่อง.",
    growthEn:
      "Growth comes from slowing down for long-range consequences and not letting adrenaline drive every call.",
    fitTh:
      "เหมาะกับ sales, entrepreneurship, live ops, performance, negotiation, และ field-heavy execution.",
    fitEn:
      "Fits sales, entrepreneurship, live operations, performance, negotiation, and field-heavy execution.",
  },
  ESFP: {
    animalKey: "neon-peacock",
    animalNameTh: "นกยูงนีออน",
    animalNameEn: "Neon Peacock",
    taglineTh: "ผู้ปล่อยพลังให้โลกมีสี เสียง และความทรงจำที่จับต้องได้",
    taglineEn:
      "A vivid performer who turns life into color, warmth, and memorable experience.",
    summaryTh:
      "ESFP มีชีวิตชีวา เปิดรับโลกผ่านประสาทสัมผัสและความสัมพันธ์ พวกเขามักทำให้คนรอบตัวรู้สึกว่าช่วงเวลานั้นมีความหมายและน่าอยู่ขึ้น.",
    summaryEn:
      "ESFPs animate space through presence, warmth, and a natural instinct for lived experience.",
    strengthsTh:
      "เด่นเรื่อง presence, charm, emotional accessibility, และการสร้างประสบการณ์ที่คนอยากกลับมาจำ.",
    strengthsEn:
      "Strong in presence, charm, emotional accessibility, and creating experiences people remember.",
    growthTh:
      "จุดเติบโตคือการวางอนาคตระยะกลางให้ชัดขึ้น และไม่ปล่อยให้ความรู้สึกปัจจุบันกลบสิ่งที่สำคัญกว่าในระยะยาว.",
    growthEn:
      "Growth comes from building clearer mid-range plans and not letting the present mood override longer priorities.",
    fitTh:
      "เหมาะกับ community, events, media, hospitality, performance, social brand work, และ customer-facing roles.",
    fitEn:
      "Fits community, events, media, hospitality, performance, social brand work, and customer-facing roles.",
  },
};

export const mbtiZMovieProfiles = {
  mindBender: {
    key: "mindBender",
    titleTh: "Movie Profile: นักตามรอยปริศนา",
    titleEn: "Movie Profile: Mind-Bender Seeker",
    summaryTh:
      "คุณชอบหนังที่ทิ้งคำถาม เก็บเบาะแส และทำให้ต้องกลับมาคิดต่อหลังดูจบมากกว่าความตรงไปตรงมา.",
    summaryEn:
      "You gravitate toward films that leave trails, clues, and unresolved thinking rather than instant closure.",
    tagsTh: ["ปริศนา", "จิ๊กซอว์เรื่องเล่า", "ดูจบแล้วยังคิดต่อ"],
    tagsEn: ["mystery", "narrative puzzle", "lingers after credits"],
  },
  worldBuilder: {
    key: "worldBuilder",
    titleTh: "Movie Profile: นักสำรวจโลกเรื่องเล่า",
    titleEn: "Movie Profile: World-Forge Explorer",
    summaryTh:
      "คุณถูกดึงดูดด้วยจักรวาลหนัง ระบบของโลก และรายละเอียดที่ทำให้สถานที่สมมติดูมีชีวิตจริง.",
    summaryEn:
      "You are drawn to story worlds with rules, texture, and atmosphere strong enough to feel inhabitable.",
    tagsTh: ["โลกสมมติ", "บรรยากาศ", "รายละเอียดจักรวาล"],
    tagsEn: ["worldbuilding", "atmosphere", "immersive lore"],
  },
  heartLens: {
    key: "heartLens",
    titleTh: "Movie Profile: ผู้ชมผ่านอารมณ์",
    titleEn: "Movie Profile: Heart-Lens Viewer",
    summaryTh:
      "คุณจำหนังจากความรู้สึก ความสัมพันธ์ และฉากที่กระทบใจมากกว่าพล็อตที่วิ่งไวอย่างเดียว.",
    summaryEn:
      "You remember films through emotion, chemistry, and scenes that stay in the body long after the plot moves on.",
    tagsTh: ["ความสัมพันธ์", "อารมณ์", "ฉากจำฝังใจ"],
    tagsEn: ["relationships", "emotion", "memorable scenes"],
  },
  shadowReader: {
    key: "shadowReader",
    titleTh: "Movie Profile: นักอ่านเงามืด",
    titleEn: "Movie Profile: Shadow Pattern Reader",
    summaryTh:
      "คุณชอบเรื่องที่มีชั้นมืด จิตวิทยา และแรงขับที่ไม่ได้พูดตรง ๆ แต่ซ่อนอยู่ในบรรยากาศ.",
    summaryEn:
      "You lean toward darker, psychological stories where the strongest meanings live in subtext and mood.",
    tagsTh: ["จิตวิทยา", "บรรยากาศหม่น", "ความหมายใต้ผิวน้ำ"],
    tagsEn: ["psychological", "dark atmosphere", "subtext"],
  },
  pulseRider: {
    key: "pulseRider",
    titleTh: "Movie Profile: ผู้ขี่จังหวะเร่ง",
    titleEn: "Movie Profile: Pulse Rider",
    summaryTh:
      "คุณอยากให้หนังมีแรงส่ง จังหวะชัด และความรู้สึกว่าบางอย่างกำลังเคลื่อนไปข้างหน้าอยู่ตลอดเวลา.",
    summaryEn:
      "You want momentum, velocity, and the sense that the film keeps moving with purpose.",
    tagsTh: ["จังหวะเร็ว", "แรงส่ง", "ตื่นตัว"],
    tagsEn: ["fast pace", "momentum", "adrenaline"],
  },
  comfortAura: {
    key: "comfortAura",
    titleTh: "Movie Profile: ผู้ดูเพื่อโอบรับใจ",
    titleEn: "Movie Profile: Comfort Aura Rewatcher",
    summaryTh:
      "คุณให้ค่ากับหนังที่อบอุ่น กลับไปดูซ้ำได้ และทำให้ใจมีพื้นที่หายใจมากกว่าการกดดันอย่างต่อเนื่อง.",
    summaryEn:
      "You value films that feel warm, revisitable, and emotionally breathable rather than relentlessly intense.",
    tagsTh: ["อบอุ่น", "ดูซ้ำได้", "ปลอบประโลม"],
    tagsEn: ["warm", "rewatchable", "comforting"],
  },
};

const movieQuestions = [
  {
    key: "movie_opening_hook",
    dimension: "MOVIE",
    promptTh: "เปิดเรื่องแบบไหนดึงคุณเข้าไปในหนังได้เร็วที่สุด?",
    promptEn: "What kind of opening pulls you into a film fastest?",
    options: [
      {
        key: "maze",
        labelTh: "เบาะแสแปลก ๆ ที่ชวนให้ตั้งคำถามทันที",
        labelEn: "Strange clues that make me ask questions immediately",
        metaLabel: "mystery",
        movieScores: { mindBender: 2, shadowReader: 1 },
      },
      {
        key: "world",
        labelTh: "โลกหรือสถานที่ที่มีบรรยากาศชัดมากตั้งแต่วินาทีแรก",
        labelEn: "A world with strong atmosphere from the first second",
        metaLabel: "world",
        movieScores: { worldBuilder: 2, shadowReader: 1 },
      },
      {
        key: "heart",
        labelTh: "ความสัมพันธ์หรืออารมณ์ที่ทำให้รู้สึกผูกพันเร็ว",
        labelEn: "Emotion or chemistry that makes me care right away",
        metaLabel: "heart",
        movieScores: { heartLens: 2, comfortAura: 1 },
      },
      {
        key: "rush",
        labelTh: "เหตุการณ์ที่เกิดขึ้นทันทีและพาเรื่องวิ่งต่อเลย",
        labelEn: "An immediate event that launches the story forward",
        metaLabel: "pace",
        movieScores: { pulseRider: 2, worldBuilder: 1 },
      },
    ],
  },
  {
    key: "movie_rewatch_reason",
    dimension: "MOVIE",
    promptTh: "ถ้ากลับไปดูหนังซ้ำ คุณมักกลับไปเพราะอะไร?",
    promptEn: "When you rewatch a film, what usually brings you back?",
    options: [
      {
        key: "details",
        labelTh: "อยากเก็บรายละเอียดหรือ decode สิ่งที่พลาดไป",
        labelEn: "I want to decode details I missed before",
        metaLabel: "detail",
        movieScores: { mindBender: 2, worldBuilder: 1 },
      },
      {
        key: "mood",
        labelTh: "อยากกลับไปอยู่ในบรรยากาศของโลกนั้นอีกครั้ง",
        labelEn: "I want to live in that atmosphere again",
        metaLabel: "mood",
        movieScores: { worldBuilder: 2, comfortAura: 1 },
      },
      {
        key: "feeling",
        labelTh: "อยากกลับไปเจอความรู้สึกเดิมหรือฉากที่กระทบใจ",
        labelEn: "I want to feel that emotional hit again",
        metaLabel: "emotion",
        movieScores: { heartLens: 2, comfortAura: 1 },
      },
      {
        key: "energy",
        labelTh: "อยากได้จังหวะ ความมัน หรือความตื่นตัวอีกครั้ง",
        labelEn: "I want the pace, energy, or thrill again",
        metaLabel: "energy",
        movieScores: { pulseRider: 2, shadowReader: 1 },
      },
    ],
  },
  {
    key: "movie_character_draw",
    dimension: "MOVIE",
    promptTh: "ตัวละครแบบไหนมักทำให้คุณตามดูจนจบ?",
    promptEn: "What kind of character keeps you watching until the end?",
    options: [
      {
        key: "enigmatic",
        labelTh: "คนที่เหมือนมีความลับหรือแรงขับซ่อนอยู่",
        labelEn: "Someone who feels enigmatic or privately driven",
        metaLabel: "enigmatic",
        movieScores: { shadowReader: 2, mindBender: 1 },
      },
      {
        key: "visionary",
        labelTh: "คนที่พาเราเปิดโลกหรือทำให้เห็นระบบใหม่",
        labelEn: "Someone who opens a bigger world or system",
        metaLabel: "vision",
        movieScores: { worldBuilder: 2, mindBender: 1 },
      },
      {
        key: "vulnerable",
        labelTh: "คนที่มีหัวใจ มีรอยร้าว และทำให้เราเอาใจช่วย",
        labelEn: "Someone vulnerable enough to make me care deeply",
        metaLabel: "care",
        movieScores: { heartLens: 2, comfortAura: 1 },
      },
      {
        key: "fearless",
        labelTh: "คนที่กล้าตัดสินใจ ลงมือ และพาเรื่องไปข้างหน้า",
        labelEn: "Someone bold enough to move the story forward",
        metaLabel: "bold",
        movieScores: { pulseRider: 2, worldBuilder: 1 },
      },
    ],
  },
  {
    key: "movie_tone_preference",
    dimension: "MOVIE",
    promptTh: "โทนหนังแบบไหนที่คุณมักอยากอยู่กับมันนานกว่า?",
    promptEn: "Which tone do you usually want to stay with longer?",
    options: [
      {
        key: "dark",
        labelTh: "หม่น ลึก และมีอะไรไม่ถูกพูดออกมาตรง ๆ",
        labelEn: "Dark, deep, and rich with unsaid meaning",
        metaLabel: "dark",
        movieScores: { shadowReader: 2, mindBender: 1 },
      },
      {
        key: "grand",
        labelTh: "กว้าง ใหญ่ และพาไปไกลกว่าชีวิตประจำวัน",
        labelEn: "Grand and expansive, pulling me beyond daily life",
        metaLabel: "grand",
        movieScores: { worldBuilder: 2, pulseRider: 1 },
      },
      {
        key: "tender",
        labelTh: "อ่อนโยน ละมุน และอบอุ่นพอจะกลับไปหาอีก",
        labelEn: "Tender, soft, and warm enough to revisit",
        metaLabel: "warm",
        movieScores: { comfortAura: 2, heartLens: 1 },
      },
      {
        key: "intense",
        labelTh: "ตึง ชัด และมีแรงส่งจนหยุดดูไม่ได้",
        labelEn: "Tight, intense, and impossible to pause",
        metaLabel: "intense",
        movieScores: { pulseRider: 2, shadowReader: 1 },
      },
    ],
  },
  {
    key: "movie_plot_pattern",
    dimension: "MOVIE",
    promptTh: "พล็อตแบบไหนทำให้คุณรู้สึกว่าเรื่องนี้ฉลาดหรือคุ้มค่า?",
    promptEn: "What kind of plot makes a film feel especially smart or worth it to you?",
    options: [
      {
        key: "layered",
        labelTh: "พล็อตซ้อนชั้น มีจังหวะให้แกะและตีความ",
        labelEn: "Layered plotting that rewards interpretation",
        metaLabel: "layers",
        movieScores: { mindBender: 2, shadowReader: 1 },
      },
      {
        key: "ecosystem",
        labelTh: "พล็อตที่ทำให้โลกทั้งเรื่องดูมีระบบจริง",
        labelEn: "Plotting that makes the whole world feel real",
        metaLabel: "world",
        movieScores: { worldBuilder: 2, mindBender: 1 },
      },
      {
        key: "relationship",
        labelTh: "พล็อตที่ทำให้ความสัมพันธ์เปลี่ยนไปอย่างมีน้ำหนัก",
        labelEn: "Plotting that meaningfully transforms relationships",
        metaLabel: "bond",
        movieScores: { heartLens: 2, comfortAura: 1 },
      },
      {
        key: "kinetic",
        labelTh: "พล็อตที่เคลื่อนไวและทำให้ทุกฉากมีแรงผลัก",
        labelEn: "Plotting with kinetic momentum in every act",
        metaLabel: "kinetic",
        movieScores: { pulseRider: 2, worldBuilder: 1 },
      },
    ],
  },
  {
    key: "movie_ending_preference",
    dimension: "MOVIE",
    promptTh: "ตอนจบแบบไหนที่มักติดอยู่กับคุณนานที่สุด?",
    promptEn: "What kind of ending tends to stay with you the longest?",
    options: [
      {
        key: "open",
        labelTh: "ปลายเปิดพอให้กลับไปคิดต่อเอง",
        labelEn: "Open enough that I keep thinking afterward",
        metaLabel: "open",
        movieScores: { mindBender: 2, shadowReader: 1 },
      },
      {
        key: "mythic",
        labelTh: "จบแบบเหมือนปิดตำนานหรือโลกหนึ่งลงอย่างสวยงาม",
        labelEn: "An ending that closes a world or myth beautifully",
        metaLabel: "mythic",
        movieScores: { worldBuilder: 2, comfortAura: 1 },
      },
      {
        key: "catharsis",
        labelTh: "จบที่ปล่อยอารมณ์หรือทำให้หัวใจโล่งจริง",
        labelEn: "An ending with real catharsis or emotional release",
        metaLabel: "catharsis",
        movieScores: { heartLens: 2, comfortAura: 1 },
      },
      {
        key: "impact",
        labelTh: "จบที่คมและกระแทกจนจำภาพสุดท้ายได้ทันที",
        labelEn: "An ending so sharp I remember the final image instantly",
        metaLabel: "impact",
        movieScores: { pulseRider: 2, shadowReader: 1 },
      },
    ],
  },
  {
    key: "movie_scene_weight",
    dimension: "MOVIE",
    promptTh: "ฉากแบบไหนมักกลายเป็นฉากจำของคุณ?",
    promptEn: "What kind of scene most often becomes unforgettable for you?",
    options: [
      {
        key: "reveal",
        labelTh: "ฉาก reveal ที่ทำให้ทุกอย่างต่อกันได้พอดี",
        labelEn: "A reveal scene where everything finally connects",
        metaLabel: "reveal",
        movieScores: { mindBender: 2, pulseRider: 1 },
      },
      {
        key: "arrival",
        labelTh: "ฉากเปิดโลกหรือสถานที่ที่ทำให้เราหยุดมอง",
        labelEn: "An arrival scene that opens a whole world",
        metaLabel: "arrival",
        movieScores: { worldBuilder: 2, comfortAura: 1 },
      },
      {
        key: "confession",
        labelTh: "ฉากสารภาพ ความสัมพันธ์แตกหัก หรือความรู้สึกเปิดออก",
        labelEn: "A confession, rupture, or emotionally exposed scene",
        metaLabel: "heart",
        movieScores: { heartLens: 2, shadowReader: 1 },
      },
      {
        key: "chase",
        labelTh: "ฉากไล่ล่า หนีเอาตัวรอด หรือจังหวะพีคแบบเต็มแรง",
        labelEn: "A chase, survival run, or peak-intensity sequence",
        metaLabel: "rush",
        movieScores: { pulseRider: 2, worldBuilder: 1 },
      },
    ],
  },
  {
    key: "movie_evening_pick",
    dimension: "MOVIE",
    promptTh: "คืนที่คุณอยากดูอะไรสักเรื่อง หนังแบบไหนมักชนะในใจคุณ?",
    promptEn: "On a free evening, what kind of film most often wins your attention?",
    options: [
      {
        key: "puzzle-night",
        labelTh: "หนังที่ต้องตั้งใจดูและพร้อมคุยต่อหลังจบ",
        labelEn: "A film that asks for focus and invites discussion after",
        metaLabel: "focus",
        movieScores: { mindBender: 2, shadowReader: 1 },
      },
      {
        key: "immersion-night",
        labelTh: "หนังที่พาเราเข้าไปอยู่ในอีกโลกหนึ่งเต็ม ๆ",
        labelEn: "A film that fully immerses me in another world",
        metaLabel: "immerse",
        movieScores: { worldBuilder: 2, comfortAura: 1 },
      },
      {
        key: "feel-night",
        labelTh: "หนังที่ทำให้เราได้รู้สึกบางอย่างกับตัวเองหรือคนอื่น",
        labelEn: "A film that lets me feel something deeply about people",
        metaLabel: "feel",
        movieScores: { heartLens: 2, comfortAura: 1 },
      },
      {
        key: "charge-night",
        labelTh: "หนังที่เติมพลังและทำให้หัวใจเต้นแรงขึ้น",
        labelEn: "A film that energizes me and raises my pulse",
        metaLabel: "charge",
        movieScores: { pulseRider: 2, shadowReader: 1 },
      },
    ],
  },
  {
    key: "movie_soundtrack_pull",
    dimension: "MOVIE",
    promptTh: "ดนตรีหรือเสียงแบบไหนในหนังมักดึงคุณเข้าไปลึกที่สุด?",
    promptEn: "What kind of soundtrack or sound design pulls you in the deepest?",
    options: [
      {
        key: "fracture",
        labelTh: "เสียงที่หลอน น้อยชิ้น แต่ทำให้รู้สึกว่ามีอะไรซ่อนอยู่",
        labelEn: "Sparse, eerie sound that suggests hidden meaning underneath",
        metaLabel: "shadow",
        movieScores: { shadowReader: 2, mindBender: 1 },
      },
      {
        key: "swell",
        labelTh: "ดนตรีที่ค่อย ๆ ขยายจนเหมือนโลกทั้งเรื่องเปิดออก",
        labelEn: "A swelling score that makes the whole world feel wider",
        metaLabel: "scale",
        movieScores: { worldBuilder: 2, pulseRider: 1 },
      },
      {
        key: "tender-theme",
        labelTh: "ทำนองที่อ่อนโยนจนพาอารมณ์เราไปกับตัวละคร",
        labelEn: "A tender theme that carries me into the characters' feelings",
        metaLabel: "tender",
        movieScores: { heartLens: 2, comfortAura: 1 },
      },
      {
        key: "impact-rhythm",
        labelTh: "จังหวะที่ชัด หนัก และเร่งชีพจรของฉากให้ขึ้นจริง",
        labelEn: "Rhythm that hits hard and drives the scene physically",
        metaLabel: "impact",
        movieScores: { pulseRider: 2, worldBuilder: 1 },
      },
    ],
  },
  {
    key: "movie_conflict_tension",
    dimension: "MOVIE",
    promptTh: "ความตึงเครียดแบบไหนที่ทำให้คุณอยากดูต่อมากที่สุด?",
    promptEn: "What kind of tension makes you want to keep watching most?",
    options: [
      {
        key: "moral-gray",
        labelTh: "ความตึงที่ไม่มีใครถูกผิดชัด และทุกคนมีเหตุผลของตัวเอง",
        labelEn: "Moral gray tension where everyone seems justified in some way",
        metaLabel: "moral",
        movieScores: { shadowReader: 2, heartLens: 1 },
      },
      {
        key: "world-stakes",
        labelTh: "ความตึงที่ผูกกับชะตาของโลก ระบบ หรือภารกิจใหญ่",
        labelEn: "High stakes tension tied to a world, system, or major mission",
        metaLabel: "stakes",
        movieScores: { worldBuilder: 2, pulseRider: 1 },
      },
      {
        key: "relationship-ache",
        labelTh: "ความตึงในความสัมพันธ์ที่ค่อย ๆ กดใจเราตลอดเรื่อง",
        labelEn: "Relational tension that quietly aches through the story",
        metaLabel: "ache",
        movieScores: { heartLens: 2, comfortAura: 1 },
      },
      {
        key: "survival-clock",
        labelTh: "ความตึงแบบนับถอยหลัง ต้องตัดสินใจหรือเอาตัวรอดเดี๋ยวนี้",
        labelEn: "Countdown or survival tension that forces immediate action",
        metaLabel: "clock",
        movieScores: { pulseRider: 2, shadowReader: 1 },
      },
    ],
  },
  {
    key: "movie_scene_aftertaste",
    dimension: "MOVIE",
    promptTh: "หลังหนังจบ คุณชอบให้ฉากบางฉากทิ้งรสค้างแบบไหนไว้กับคุณ?",
    promptEn: "After a film ends, what kind of aftertaste do you want a scene to leave behind?",
    options: [
      {
        key: "question-mark",
        labelTh: "ความค้างคาแบบมีคำถามหรือความหมายให้คิดต่อ",
        labelEn: "A lingering question or unresolved meaning to think about",
        metaLabel: "afterthought",
        movieScores: { mindBender: 2, shadowReader: 1 },
      },
      {
        key: "vast-memory",
        labelTh: "ภาพของโลก สถานที่ หรือ scale ที่ยังติดตาอยู่",
        labelEn: "A memory of world, place, or cinematic scale that stays visible",
        metaLabel: "vast",
        movieScores: { worldBuilder: 2, comfortAura: 1 },
      },
      {
        key: "heart-warmth",
        labelTh: "ความรู้สึกอบอุ่นหรือเจ็บลึกที่ยังอยู่กับใจเรา",
        labelEn: "Warmth or ache that stays quietly inside my chest",
        metaLabel: "heart",
        movieScores: { heartLens: 2, comfortAura: 1 },
      },
      {
        key: "adrenaline",
        labelTh: "แรงค้างของความพีคที่ยังทำให้รู้สึกอยากลุกเดิน",
        labelEn: "Residual adrenaline that keeps my body alert after the scene",
        metaLabel: "adrenaline",
        movieScores: { pulseRider: 2, worldBuilder: 1 },
      },
    ],
  },
  {
    key: "movie_companion_pick",
    dimension: "MOVIE",
    promptTh: "ถ้าต้องเลือกหนังไปดูกับคนสำคัญหนึ่งคน คุณมักเลือกแบบไหน?",
    promptEn: "If you had to choose one film to watch with someone important, what would you pick?",
    options: [
      {
        key: "discuss",
        labelTh: "หนังที่ดูจบแล้วนั่งคุยตีความกันต่อได้ยาว",
        labelEn: "A film that opens a long conversation after the credits",
        metaLabel: "discuss",
        movieScores: { mindBender: 2, heartLens: 1 },
      },
      {
        key: "transport",
        labelTh: "หนังที่พาเราไปอยู่ในอีกโลกหนึ่งด้วยกันเต็ม ๆ",
        labelEn: "A film that transports both of us into another world together",
        metaLabel: "transport",
        movieScores: { worldBuilder: 2, comfortAura: 1 },
      },
      {
        key: "bond",
        labelTh: "หนังที่ทำให้เราเข้าใจกันหรือรู้สึกใกล้กันขึ้น",
        labelEn: "A film that helps us understand each other more deeply",
        metaLabel: "bond",
        movieScores: { heartLens: 2, comfortAura: 1 },
      },
      {
        key: "rush-together",
        labelTh: "หนังที่ทำให้เราร่วมลุ้นและมีพลังไปพร้อมกัน",
        labelEn: "A film that makes us share momentum and intensity together",
        metaLabel: "rush",
        movieScores: { pulseRider: 2, shadowReader: 1 },
      },
    ],
  },
];

function createImagePath(code, animalKey) {
  return `/mbti-z/animals/${code.toLowerCase()}-${animalKey}.png`;
}

export const mbtiZProfiles = basePersonalityProfiles.map(
  ([code, slug, archetypeNameTh, archetypeNameEn]) => {
    const houseKey = houseByType[code];
    const house = mbtiZHouses[houseKey];
    const override = profileOverrides[code];

    return {
      code,
      slug,
      archetypeNameTh,
      archetypeNameEn,
      houseKey,
      houseTitleTh: house.titleTh,
      houseTitleEn: house.titleEn,
      houseDescriptionTh: house.descriptionTh,
      houseDescriptionEn: house.descriptionEn,
      accentFrom: house.accentFrom,
      accentTo: house.accentTo,
      surface: house.surface,
      animalKey: override.animalKey,
      animalNameTh: override.animalNameTh,
      animalNameEn: override.animalNameEn,
      animalImagePath: createImagePath(code, override.animalKey),
      taglineTh: override.taglineTh,
      taglineEn: override.taglineEn,
      summaryTh: override.summaryTh,
      summaryEn: override.summaryEn,
      strengthsTh: override.strengthsTh,
      strengthsEn: override.strengthsEn,
      growthTh: override.growthTh,
      growthEn: override.growthEn,
      fitTh: override.fitTh,
      fitEn: override.fitEn,
    };
  }
);

export function buildMbtiZLocalizedContent(profile) {
  return [
    {
      locale: "th",
      section: "summary",
      tier: "free",
      title: `แกนหลักของ ${profile.code}`,
      body: profile.summaryTh,
      sortOrder: 0,
    },
    {
      locale: "en",
      section: "summary",
      tier: "free",
      title: `${profile.code} Core Readout`,
      body: profile.summaryEn,
      sortOrder: 0,
    },
    {
      locale: "th",
      section: "strengths",
      tier: "premium",
      title: "จุดแข็งที่ปล่อยของได้จริง",
      body: profile.strengthsTh,
      sortOrder: 1,
    },
    {
      locale: "en",
      section: "strengths",
      tier: "premium",
      title: "Where Your Strengths Land",
      body: profile.strengthsEn,
      sortOrder: 1,
    },
    {
      locale: "th",
      section: "blind_spots",
      tier: "premium",
      title: "มุมที่ควรระวัง",
      body: profile.growthTh,
      sortOrder: 2,
    },
    {
      locale: "en",
      section: "blind_spots",
      tier: "premium",
      title: "What Needs Softening",
      body: profile.growthEn,
      sortOrder: 2,
    },
    {
      locale: "th",
      section: "growth_map",
      tier: "premium",
      title: "พื้นที่ที่เหมาะกับคุณ",
      body: profile.fitTh,
      sortOrder: 3,
    },
    {
      locale: "en",
      section: "growth_map",
      tier: "premium",
      title: "Where You Usually Fit Best",
      body: profile.fitEn,
      sortOrder: 3,
    },
  ];
}

function createScaledOptions(question) {
  const [leftPole, rightPole] = question.options;
  const leftKey = leftPole.traitCode;
  const rightKey = rightPole.traitCode;

  return [
    {
      key: "A",
      labelTh: `ชัดเจนว่า ${leftPole.labelTh}`,
      labelEn: `Definitely ${leftPole.labelEn}`,
      traitCode: leftKey,
      metaLabel: `strong ${leftKey}`,
      weights: { [leftKey]: 4 },
    },
    {
      key: "A-lean",
      labelTh: `ค่อนมาทาง ${leftPole.labelTh}`,
      labelEn: `Leaning toward ${leftPole.labelEn}`,
      traitCode: leftKey,
      metaLabel: `lean ${leftKey}`,
      weights: { [leftKey]: 3 },
    },
    {
      key: "mid",
      labelTh: "อยู่กึ่งกลาง ขึ้นกับบริบท",
      labelEn: "Right in the middle, depends on context",
      traitCode: `${leftKey}/${rightKey}`,
      metaLabel: "balanced",
      weights: { [leftKey]: 2, [rightKey]: 2 },
    },
    {
      key: "B-lean",
      labelTh: `ค่อนมาทาง ${rightPole.labelTh}`,
      labelEn: `Leaning toward ${rightPole.labelEn}`,
      traitCode: rightKey,
      metaLabel: `lean ${rightKey}`,
      weights: { [rightKey]: 3 },
    },
    {
      key: "B",
      labelTh: `ชัดเจนว่า ${rightPole.labelTh}`,
      labelEn: `Definitely ${rightPole.labelEn}`,
      traitCode: rightKey,
      metaLabel: `strong ${rightKey}`,
      weights: { [rightKey]: 4 },
    },
  ];
}

export const mbtiZAssessmentQuestions = baseAssessmentQuestions.map((question, index) => ({
  key: question.key,
  kind: "mbti",
  module: "core",
  dimension: question.dimension,
  promptTh: question.promptTh,
  promptEn: question.promptEn,
  sortOrder: index + 1,
  poles: {
    left: question.options[0],
    right: question.options[1],
  },
  options: createScaledOptions(question),
}));

export const mbtiZMovieQuestions = movieQuestions.map((question, index) => ({
  ...question,
  kind: "movie",
  module: "movie",
  sortOrder: mbtiZAssessmentQuestions.length + index + 1,
}));

export const mbtiZQuestionBank = [
  ...mbtiZAssessmentQuestions,
  ...mbtiZMovieQuestions,
];
