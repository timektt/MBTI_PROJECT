export const personalityProfiles = [
  ["INTJ", "architect", "สถาปนิกเชิงกลยุทธ์", "Strategic Architect"],
  ["INTP", "analyst", "นักวิเคราะห์เชิงแนวคิด", "Conceptual Analyst"],
  ["ENTJ", "commander", "ผู้นำเชิงระบบ", "Systems Commander"],
  ["ENTP", "visionary", "นักสร้างสรรค์เชิงทดลอง", "Experimental Visionary"],
  ["INFJ", "advocate", "นักออกแบบความหมาย", "Purposeful Advocate"],
  ["INFP", "mediator", "นักสำรวจโลกภายใน", "Reflective Mediator"],
  ["ENFJ", "mentor", "ผู้นำเชิงพัฒนา", "Development Mentor"],
  ["ENFP", "catalyst", "ผู้จุดประกายโอกาส", "Opportunity Catalyst"],
  ["ISTJ", "guardian", "ผู้จัดการความมั่นคง", "Structured Guardian"],
  ["ISFJ", "caretaker", "ผู้ดูแลด้วยความละเอียด", "Detail Caretaker"],
  ["ESTJ", "executive", "ผู้ขับเคลื่อนการตัดสินใจ", "Execution Executive"],
  ["ESFJ", "connector", "ผู้สร้างความกลมกลืน", "Relational Connector"],
  ["ISTP", "craftsman", "นักแก้ปัญหาเฉพาะหน้า", "Adaptive Craftsman"],
  ["ISFP", "artist", "นักสร้างสรรค์อย่างอ่อนโยน", "Quiet Artist"],
  ["ESTP", "operator", "นักลงมือเชิงจังหวะ", "Tactical Operator"],
  ["ESFP", "performer", "ผู้ส่งพลังให้ผู้คน", "Expressive Performer"],
];

function createQuestion(
  {
    key,
    dimension,
    promptTh,
    promptEn,
    optionA,
    optionB,
  },
  sortOrder
) {
  return {
    key,
    dimension,
    promptTh,
    promptEn,
    sortOrder,
    options: [
      {
        key: "A",
        labelTh: optionA.labelTh,
        labelEn: optionA.labelEn,
        traitCode: optionA.traitCode,
      },
      {
        key: "B",
        labelTh: optionB.labelTh,
        labelEn: optionB.labelEn,
        traitCode: optionB.traitCode,
      },
    ],
  };
}

const energyQuestions = [
  {
    key: "energy_social_recharge",
    dimension: "E/I",
    promptTh:
      "หลังจากสัปดาห์ที่หนัก คุณมักได้พลังกลับมาจากการออกไปเจอคนหรืออยู่กับตัวเอง?",
    promptEn:
      "After an intense week, do you recharge more by being around people or by being alone?",
    optionA: {
      labelTh: "ออกไปเจอคนหรือคุยกับคนที่ไว้ใจ",
      labelEn: "Being around people or talking with trusted friends",
      traitCode: "E",
    },
    optionB: {
      labelTh: "อยู่เงียบ ๆ กับตัวเองก่อน",
      labelEn: "Being alone and resetting quietly first",
      traitCode: "I",
    },
  },
  {
    key: "energy_group_expression",
    dimension: "E/I",
    promptTh:
      "ในห้องที่มีคนใหม่จำนวนมาก คุณมักเริ่มจากการพูดคุยก่อนหรือสังเกตภาพรวมก่อน?",
    promptEn:
      "In a room full of new people, do you usually start conversations first or observe the room first?",
    optionA: {
      labelTh: "เริ่มชวนคุยและสร้างบรรยากาศ",
      labelEn: "Start conversations and create energy",
      traitCode: "E",
    },
    optionB: {
      labelTh: "สังเกตคนและจังหวะก่อนเข้าร่วม",
      labelEn: "Observe the dynamics before joining in",
      traitCode: "I",
    },
  },
  {
    key: "energy_brainstorm_mode",
    dimension: "E/I",
    promptTh:
      "เวลาได้ไอเดียใหม่ คุณชอบคิดออกเสียงกับคนอื่นหรือเก็บไปตกผลึกคนเดียวก่อน?",
    promptEn:
      "When a new idea appears, do you prefer thinking out loud with others or refining it alone first?",
    optionA: {
      labelTh: "คุยไปคิดไปกับคนอื่น",
      labelEn: "Think out loud with other people",
      traitCode: "E",
    },
    optionB: {
      labelTh: "เก็บไปตกผลึกเองก่อน",
      labelEn: "Refine it privately before sharing",
      traitCode: "I",
    },
  },
  {
    key: "energy_free_time",
    dimension: "E/I",
    promptTh:
      "ถ้ามีช่วงว่างแบบไม่ได้นัด คุณมักชวนใครสักคนทำอะไรหรือมีความสุขกับเวลาส่วนตัวมากกว่า?",
    promptEn:
      "When unexpected free time opens up, do you tend to invite someone out or enjoy private time more?",
    optionA: {
      labelTh: "ชวนคนไปทำอะไรด้วยกัน",
      labelEn: "Invite someone and make something happen",
      traitCode: "E",
    },
    optionB: {
      labelTh: "เก็บไว้เป็นเวลาส่วนตัว",
      labelEn: "Keep it as personal recharge time",
      traitCode: "I",
    },
  },
  {
    key: "energy_event_afterglow",
    dimension: "E/I",
    promptTh:
      "หลังจบงานหรือกิจกรรมใหญ่ คุณมักอยากต่อบทสนทนาหรืออยากกลับไปรีเซ็ตเงียบ ๆ มากกว่า?",
    promptEn:
      "After a big event, do you want to keep the conversations going or retreat and reset quietly?",
    optionA: {
      labelTh: "ต่อบทสนทนาอีกหน่อย",
      labelEn: "Keep the momentum and stay social a bit longer",
      traitCode: "E",
    },
    optionB: {
      labelTh: "กลับไปรีเซ็ตเงียบ ๆ",
      labelEn: "Head back and reset in quiet",
      traitCode: "I",
    },
  },
  {
    key: "energy_problem_processing",
    dimension: "E/I",
    promptTh:
      "เมื่อมีเรื่องกดดัน คุณมักโทรหาคนที่ไว้ใจเพื่อคิดไปด้วยกันหรือใช้เวลาเรียบเรียงเองก่อน?",
    promptEn:
      "When something is stressful, do you call someone you trust to process it or sort it out privately first?",
    optionA: {
      labelTh: "โทรหรือคุยเพื่อช่วยคิด",
      labelEn: "Talk it through with someone I trust",
      traitCode: "E",
    },
    optionB: {
      labelTh: "ขอจัดระเบียบความคิดเองก่อน",
      labelEn: "Organize my thoughts alone first",
      traitCode: "I",
    },
  },
  {
    key: "energy_travel_attention",
    dimension: "E/I",
    promptTh:
      "เวลาไปที่ใหม่ คุณมักสนใจคนและบรรยากาศรอบตัวก่อนหรือค่อย ๆ ซึมซับโลกนั้นเงียบ ๆ มากกว่า?",
    promptEn:
      "In a new place, do you notice people and shared energy first or quietly absorb the place on your own?",
    optionA: {
      labelTh: "สนใจคนและพลังของที่นั้นก่อน",
      labelEn: "Notice the people and social energy first",
      traitCode: "E",
    },
    optionB: {
      labelTh: "ค่อย ๆ ซึมซับเองก่อน",
      labelEn: "Quietly absorb the place before engaging",
      traitCode: "I",
    },
  },
  {
    key: "energy_collaboration_length",
    dimension: "E/I",
    promptTh:
      "ประชุมหรือทำงานกลุ่มยาว ๆ ทำให้คุณคึกขึ้นหรือหมดพลังเร็วขึ้น?",
    promptEn:
      "Do long collaborative sessions usually energize you or drain you faster?",
    optionA: {
      labelTh: "ยิ่งคุยยิ่งคึก",
      labelEn: "They tend to energize me",
      traitCode: "E",
    },
    optionB: {
      labelTh: "ใช้พลังค่อนข้างมาก",
      labelEn: "They drain me after a while",
      traitCode: "I",
    },
  },
  {
    key: "energy_leadership_presence",
    dimension: "E/I",
    promptTh:
      "เวลาต้องนำทีม คุณชอบนำจากการคุยและสร้างพลังร่วมกัน หรือชอบนำจากการเตรียม structure ไว้ก่อน?",
    promptEn:
      "When leading a team, do you prefer leading through visible energy or through prepared structure first?",
    optionA: {
      labelTh: "นำผ่านการคุยและสร้าง momentum",
      labelEn: "Lead through visible energy and momentum",
      traitCode: "E",
    },
    optionB: {
      labelTh: "นำผ่านการเตรียม structure",
      labelEn: "Lead through preparation and structure",
      traitCode: "I",
    },
  },
  {
    key: "energy_small_talk",
    dimension: "E/I",
    promptTh:
      "กับคนที่เพิ่งรู้จัก คุณมักเริ่ม small talk ได้ง่ายหรือชอบให้บทสนทนาเกิดขึ้นเองตามธรรมชาติ?",
    promptEn:
      "With new people, do you start small talk easily or prefer letting conversation happen naturally?",
    optionA: {
      labelTh: "เริ่มคุยได้ค่อนข้างง่าย",
      labelEn: "I usually start the conversation easily",
      traitCode: "E",
    },
    optionB: {
      labelTh: "ชอบให้บทสนทนาไหลมาเอง",
      labelEn: "I prefer letting it develop naturally",
      traitCode: "I",
    },
  },
  {
    key: "energy_post_idea_sharing",
    dimension: "E/I",
    promptTh:
      "ถ้าคิดอะไรเจ๋ง ๆ ออก คุณอยากแชร์ทันทีเพื่อดู reaction หรืออยากขัดเกลาให้คมก่อน?",
    promptEn:
      "When you come up with something exciting, do you share it immediately to see reactions or sharpen it first?",
    optionA: {
      labelTh: "แชร์ทันทีเพื่อดู reaction",
      labelEn: "Share it right away and read the room",
      traitCode: "E",
    },
    optionB: {
      labelTh: "ขัดเกลาก่อนค่อยแชร์",
      labelEn: "Sharpen it first, then share",
      traitCode: "I",
    },
  },
  {
    key: "energy_social_recovery_window",
    dimension: "E/I",
    promptTh:
      "ถ้าวันนี้เจอคนทั้งวัน พรุ่งนี้คุณมักอยากนัดต่อเลยหรือเว้นระยะให้ตัวเองก่อน?",
    promptEn:
      "If you spend a full day with people, do you usually want to meet more the next day or keep space for yourself?",
    optionA: {
      labelTh: "ยังพร้อมนัดต่อได้",
      labelEn: "I could keep going socially",
      traitCode: "E",
    },
    optionB: {
      labelTh: "ขอเว้นระยะให้ตัวเองก่อน",
      labelEn: "I need some space to recharge",
      traitCode: "I",
    },
  },
];

const informationQuestions = [
  {
    key: "information_detail_focus",
    dimension: "S/N",
    promptTh:
      "เวลารับโจทย์ใหม่ คุณโฟกัสรายละเอียดที่จับต้องได้ก่อนหรือภาพความเป็นไปได้ก่อน?",
    promptEn:
      "When facing a new challenge, do you focus first on concrete details or on possible future patterns?",
    optionA: {
      labelTh: "รายละเอียดจริงที่เช็กได้",
      labelEn: "Concrete facts I can verify",
      traitCode: "S",
    },
    optionB: {
      labelTh: "แนวโน้มและความเป็นไปได้ระยะต่อไป",
      labelEn: "Patterns and future possibilities",
      traitCode: "N",
    },
  },
  {
    key: "information_learning_style",
    dimension: "S/N",
    promptTh:
      "เวลาเรียนอะไรใหม่ คุณชอบตัวอย่างจริงหรือชอบมองหลักการเบื้องหลังมากกว่า?",
    promptEn:
      "When learning something new, do you prefer real examples or the underlying concept first?",
    optionA: {
      labelTh: "ตัวอย่างจริงและวิธีทำทีละขั้น",
      labelEn: "Real examples and step-by-step execution",
      traitCode: "S",
    },
    optionB: {
      labelTh: "หลักการและกรอบคิดเบื้องหลัง",
      labelEn: "Principles and the mental model behind it",
      traitCode: "N",
    },
  },
  {
    key: "information_pattern_detection",
    dimension: "S/N",
    promptTh:
      "เวลาฟังเรื่องยาว ๆ คุณมักจับข้อเท็จจริงสำคัญหรือเชื่อมโยง pattern ที่ซ่อนอยู่ก่อน?",
    promptEn:
      "When listening to a long story, do you latch onto key facts or hidden patterns first?",
    optionA: {
      labelTh: "ข้อเท็จจริงสำคัญที่ยืนยันได้",
      labelEn: "Key facts I can anchor on",
      traitCode: "S",
    },
    optionB: {
      labelTh: "pattern ที่ซ่อนอยู่",
      labelEn: "The hidden pattern behind it",
      traitCode: "N",
    },
  },
  {
    key: "information_instruction_style",
    dimension: "S/N",
    promptTh:
      "ถ้าต้องอธิบายงานให้คนอื่น คุณมักเริ่มจากขั้นตอนชัด ๆ หรือเริ่มจากภาพรวมและแนวคิดก่อน?",
    promptEn:
      "When explaining work to someone else, do you start with clear steps or with the big picture first?",
    optionA: {
      labelTh: "เริ่มจากขั้นตอนที่ทำตามได้",
      labelEn: "Start with steps they can follow",
      traitCode: "S",
    },
    optionB: {
      labelTh: "เริ่มจากภาพรวมและแนวคิด",
      labelEn: "Start with the big picture and concept",
      traitCode: "N",
    },
  },
  {
    key: "information_future_vs_present",
    dimension: "S/N",
    promptTh:
      "เวลามองโปรเจกต์ คุณชอบดูสภาพจริงตอนนี้หรือชอบมองว่ามันจะพัฒนาไปได้แค่ไหน?",
    promptEn:
      "When evaluating a project, do you focus more on the present reality or on how far it could evolve?",
    optionA: {
      labelTh: "สภาพจริงตอนนี้",
      labelEn: "The present reality and current constraints",
      traitCode: "S",
    },
    optionB: {
      labelTh: "ศักยภาพที่จะต่อยอด",
      labelEn: "Its future potential and expansion path",
      traitCode: "N",
    },
  },
  {
    key: "information_memory",
    dimension: "S/N",
    promptTh:
      "คุณจำเรื่องได้ดีจากรายละเอียดที่เกิดขึ้นจริง หรือจากภาพรวมและความหมายที่เชื่อมกัน?",
    promptEn:
      "Do you remember things better through concrete details or through the connected meaning behind them?",
    optionA: {
      labelTh: "จำจากรายละเอียดจริง",
      labelEn: "I remember the concrete details",
      traitCode: "S",
    },
    optionB: {
      labelTh: "จำจากภาพรวมและความหมาย",
      labelEn: "I remember the bigger meaning and connections",
      traitCode: "N",
    },
  },
  {
    key: "information_problem_entry",
    dimension: "S/N",
    promptTh:
      "เวลาเจอปัญหา คุณเริ่มจากสิ่งที่พิสูจน์ได้ก่อนหรือสมมติฐานที่เป็นไปได้ก่อน?",
    promptEn:
      "When solving a problem, do you start from what is proven or from the most likely possibilities?",
    optionA: {
      labelTh: "สิ่งที่พิสูจน์ได้ก่อน",
      labelEn: "What can already be proven",
      traitCode: "S",
    },
    optionB: {
      labelTh: "สมมติฐานที่เป็นไปได้",
      labelEn: "The possibilities worth exploring",
      traitCode: "N",
    },
  },
  {
    key: "information_conversation_bias",
    dimension: "S/N",
    promptTh:
      "บทสนทนาที่คุณอินมักเป็นเรื่องประสบการณ์จริงหรือไอเดีย/ความเป็นไปได้ใหม่ ๆ มากกว่า?",
    promptEn:
      "The conversations that pull you in most are usually about real experiences or new ideas and possibilities?",
    optionA: {
      labelTh: "เรื่องจริงที่จับต้องได้",
      labelEn: "Real experiences and tangible details",
      traitCode: "S",
    },
    optionB: {
      labelTh: "ไอเดียและความเป็นไปได้ใหม่",
      labelEn: "New ideas and future possibilities",
      traitCode: "N",
    },
  },
  {
    key: "information_change_signal",
    dimension: "S/N",
    promptTh:
      "เวลาอะไรบางอย่างเริ่มเปลี่ยน คุณมักสังเกตสัญญาณเล็ก ๆ ที่เกิดขึ้นจริงหรือรู้สึกถึงแนวโน้มก่อนคนอื่น?",
    promptEn:
      "When something starts changing, do you notice concrete signals first or sense the shift before it is obvious?",
    optionA: {
      labelTh: "สังเกตสัญญาณจริงที่เกิดขึ้น",
      labelEn: "Notice the concrete signals that appear",
      traitCode: "S",
    },
    optionB: {
      labelTh: "รู้สึกถึงแนวโน้มก่อนชัดเจน",
      labelEn: "Sense the pattern before it becomes obvious",
      traitCode: "N",
    },
  },
  {
    key: "information_creative_prompt",
    dimension: "S/N",
    promptTh:
      "ถ้ามีโจทย์เปิด คุณชอบเริ่มจาก reference ที่ใช้งานได้จริงหรือชอบแตก branching idea ก่อน?",
    promptEn:
      "With an open-ended brief, do you prefer starting from practical references or branching into ideas first?",
    optionA: {
      labelTh: "reference ที่ใช้งานได้จริง",
      labelEn: "Practical references that already work",
      traitCode: "S",
    },
    optionB: {
      labelTh: "แตกไอเดียออกหลายทางก่อน",
      labelEn: "Branch out into multiple ideas first",
      traitCode: "N",
    },
  },
  {
    key: "information_feedback_preference",
    dimension: "S/N",
    promptTh:
      "เวลาขอ feedback คุณชอบได้คำแนะนำที่เฉพาะเจาะจงหรือ insight ที่ชวนคิดต่อมากกว่า?",
    promptEn:
      "When asking for feedback, do you prefer specific adjustments or insight that expands your thinking?",
    optionA: {
      labelTh: "คำแนะนำเฉพาะเจาะจง",
      labelEn: "Specific practical adjustments",
      traitCode: "S",
    },
    optionB: {
      labelTh: "insight ที่ชวนคิดต่อ",
      labelEn: "Insight that opens new perspective",
      traitCode: "N",
    },
  },
  {
    key: "information_definition_of_clear",
    dimension: "S/N",
    promptTh:
      "สำหรับคุณ คำว่า “ชัดเจน” มักหมายถึงข้อมูลที่แน่นหรือทิศทางที่มองเห็นภาพต่อได้?",
    promptEn:
      "For you, does “clarity” usually mean solid data or a direction that reveals what comes next?",
    optionA: {
      labelTh: "ข้อมูลที่แน่นและตรวจสอบได้",
      labelEn: "Solid data that can be verified",
      traitCode: "S",
    },
    optionB: {
      labelTh: "ทิศทางที่ต่อภาพอนาคตได้",
      labelEn: "A direction that opens the future picture",
      traitCode: "N",
    },
  },
];

const decisionQuestions = [
  {
    key: "decision_logic_vs_people",
    dimension: "T/F",
    promptTh:
      "เมื่อต้องตัดสินใจยาก คุณให้น้ำหนักกับเหตุผลที่ยุติธรรมหรือผลกระทบต่อความรู้สึกคนมากกว่า?",
    promptEn:
      "When making a hard decision, do you weigh objective fairness or emotional impact more heavily?",
    optionA: {
      labelTh: "เหตุผลที่เป็นธรรมและสม่ำเสมอ",
      labelEn: "What is logically fair and consistent",
      traitCode: "T",
    },
    optionB: {
      labelTh: "ผลกระทบต่อความรู้สึกและความสัมพันธ์",
      labelEn: "The impact on feelings and relationships",
      traitCode: "F",
    },
  },
  {
    key: "feedback_style",
    dimension: "T/F",
    promptTh:
      "เวลาต้องให้ feedback คุณมักตรงประเด็นก่อนหรือระวังบริบทความรู้สึกก่อน?",
    promptEn:
      "When giving feedback, do you usually lead with direct clarity or with emotional context?",
    optionA: {
      labelTh: "ตรงประเด็นเพื่อให้แก้ได้ชัด",
      labelEn: "Direct clarity so the issue is easier to fix",
      traitCode: "T",
    },
    optionB: {
      labelTh: "ระวังจังหวะและภาวะของอีกฝ่ายก่อน",
      labelEn: "Careful timing and empathy for the other person",
      traitCode: "F",
    },
  },
  {
    key: "decision_conflict_instinct",
    dimension: "T/F",
    promptTh:
      "เวลาคนในทีมเห็นต่างกัน คุณอยากหาข้อสรุปที่มีเหตุผลหรืออยากรักษาบรรยากาศให้ปลอดภัยก่อน?",
    promptEn:
      "When teammates disagree, do you instinctively pursue the most rational resolution or protect emotional safety first?",
    optionA: {
      labelTh: "หาข้อสรุปที่มีเหตุผลก่อน",
      labelEn: "Find the most rational conclusion first",
      traitCode: "T",
    },
    optionB: {
      labelTh: "รักษาความปลอดภัยทางใจไว้ก่อน",
      labelEn: "Protect emotional safety first",
      traitCode: "F",
    },
  },
  {
    key: "decision_praise_filter",
    dimension: "T/F",
    promptTh:
      "ถ้าต้องเลือกชมใครสักคน คุณชอบชม competence ที่ชัดเจนหรือชมสิ่งที่เขาส่งผลดีต่อคนรอบตัว?",
    promptEn:
      "When praising someone, are you more likely to praise clear competence or the positive effect they have on people?",
    optionA: {
      labelTh: "ชม competence ที่เห็นชัด",
      labelEn: "Praise the competence that stands out",
      traitCode: "T",
    },
    optionB: {
      labelTh: "ชมผลกระทบที่ดีต่อคนรอบตัว",
      labelEn: "Praise the good they create around others",
      traitCode: "F",
    },
  },
  {
    key: "decision_priority",
    dimension: "T/F",
    promptTh:
      "เวลาเวลาจำกัด คุณมัก prioritize สิ่งที่มีเหตุผลที่สุดหรือสิ่งที่คนได้รับผลกระทบมากที่สุด?",
    promptEn:
      "When time is limited, do you prioritize what is most rational or what affects people the most?",
    optionA: {
      labelTh: "สิ่งที่มีเหตุผลและ impact ชัด",
      labelEn: "What is most rational and defensible",
      traitCode: "T",
    },
    optionB: {
      labelTh: "สิ่งที่กระทบความรู้สึกคนมากสุด",
      labelEn: "What affects people most emotionally",
      traitCode: "F",
    },
  },
  {
    key: "decision_fairness_definition",
    dimension: "T/F",
    promptTh:
      "สำหรับคุณ ความยุติธรรมคือการใช้เกณฑ์เดียวกันกับทุกคน หรือปรับตามบริบทของแต่ละคน?",
    promptEn:
      "To you, is fairness applying the same standard to everyone or adapting to each person's context?",
    optionA: {
      labelTh: "ใช้เกณฑ์เดียวกันเป็นหลัก",
      labelEn: "Apply the same standard as the baseline",
      traitCode: "T",
    },
    optionB: {
      labelTh: "ปรับตามบริบทของแต่ละคน",
      labelEn: "Adjust to each person's context",
      traitCode: "F",
    },
  },
  {
    key: "decision_reaction_to_news",
    dimension: "T/F",
    promptTh:
      "เมื่อได้ข่าวสำคัญ คุณมักถามว่า “จริงแค่ไหน” หรือ “คนที่เกี่ยวข้องจะรู้สึกยังไง” ก่อน?",
    promptEn:
      "When hearing important news, do you first ask “How true is it?” or “How will this affect people emotionally?”",
    optionA: {
      labelTh: "จริงแค่ไหนก่อน",
      labelEn: "How true and solid is this?",
      traitCode: "T",
    },
    optionB: {
      labelTh: "คนที่เกี่ยวข้องจะรู้สึกยังไง",
      labelEn: "How will this land emotionally for people?",
      traitCode: "F",
    },
  },
  {
    key: "decision_critique_style",
    dimension: "T/F",
    promptTh:
      "เวลาวิจารณ์งาน คุณให้ค่ากับความตรงไปตรงมาหรือความอ่อนโยนที่ช่วยให้รับฟังได้มากกว่า?",
    promptEn:
      "When critiquing work, do you value blunt clarity or gentle delivery that makes it easier to receive?",
    optionA: {
      labelTh: "ความตรงไปตรงมาที่ชัดเจน",
      labelEn: "Blunt clarity when it helps the work",
      traitCode: "T",
    },
    optionB: {
      labelTh: "ความอ่อนโยนที่รับฟังได้",
      labelEn: "Gentle delivery that keeps people open",
      traitCode: "F",
    },
  },
  {
    key: "decision_motivation_reading",
    dimension: "T/F",
    promptTh:
      "คุณมักอ่านคนจาก logic ที่เขาใช้หรือจากน้ำเสียงและความตั้งใจที่เขาส่งออกมา?",
    promptEn:
      "Do you usually read people through the logic they use or through the emotional tone and intent they radiate?",
    optionA: {
      labelTh: "อ่านจาก logic ที่เขาใช้",
      labelEn: "Read them through the logic they use",
      traitCode: "T",
    },
    optionB: {
      labelTh: "อ่านจากน้ำเสียงและความตั้งใจ",
      labelEn: "Read them through tone and intent",
      traitCode: "F",
    },
  },
  {
    key: "decision_definition_of_good_work",
    dimension: "T/F",
    promptTh:
      "คำว่า “งานที่ดี” สำหรับคุณคือแม่นและคม หรือทำให้คนได้รับประสบการณ์ที่ดีขึ้น?",
    promptEn:
      "Does “good work” mean precise and sharp, or does it mean people experience something better?",
    optionA: {
      labelTh: "แม่นและคมเป็นหลัก",
      labelEn: "Precise, sharp, and structurally strong",
      traitCode: "T",
    },
    optionB: {
      labelTh: "ทำให้คนรู้สึกและใช้งานดีขึ้น",
      labelEn: "Makes people feel and function better",
      traitCode: "F",
    },
  },
  {
    key: "decision_stress_response",
    dimension: "T/F",
    promptTh:
      "ตอนตึงมาก ๆ คุณมักนิ่งกับ facts มากขึ้นหรือรับรู้อารมณ์ของคนรอบตัวแรงขึ้น?",
    promptEn:
      "Under intense stress, do you become more anchored in facts or more aware of other people's emotions?",
    optionA: {
      labelTh: "นิ่งกับ facts มากขึ้น",
      labelEn: "Anchor myself even harder in the facts",
      traitCode: "T",
    },
    optionB: {
      labelTh: "รับรู้อารมณ์คนรอบตัวแรงขึ้น",
      labelEn: "Become more sensitive to surrounding emotion",
      traitCode: "F",
    },
  },
  {
    key: "decision_team_value",
    dimension: "T/F",
    promptTh:
      "คนที่คุณอยากร่วมงานด้วยมากที่สุดคือคนที่คิดคมมากหรือคนที่ทำให้ทุกคนทำงานร่วมกันง่ายขึ้น?",
    promptEn:
      "The people you most want to work with are usually those who think sharply or those who make collaboration feel easier?",
    optionA: {
      labelTh: "คนที่คิดคมและตัดสินใจแม่น",
      labelEn: "People who think sharply and decide cleanly",
      traitCode: "T",
    },
    optionB: {
      labelTh: "คนที่ทำให้ทีมไหลลื่นขึ้น",
      labelEn: "People who make the team flow better",
      traitCode: "F",
    },
  },
];

const structureQuestions = [
  {
    key: "structure_planning_preference",
    dimension: "J/P",
    promptTh:
      "ในโปรเจกต์สำคัญ คุณสบายใจกับแผนที่ชัดเจนหรือพื้นที่ให้ปรับระหว่างทางมากกว่า?",
    promptEn:
      "In an important project, do you feel better with a clear plan or more room to adapt as you go?",
    optionA: {
      labelTh: "มีแผนและกรอบเวลาชัดเจน",
      labelEn: "A clear plan and timeline",
      traitCode: "J",
    },
    optionB: {
      labelTh: "มีพื้นที่ปรับตามข้อมูลใหม่",
      labelEn: "Room to adapt based on new information",
      traitCode: "P",
    },
  },
  {
    key: "structure_deadline_behavior",
    dimension: "J/P",
    promptTh:
      "เมื่อใกล้ deadline คุณมักปิดงานล่วงหน้าหรือเร่งสร้างทางเลือกในช่วงท้าย?",
    promptEn:
      "As a deadline approaches, do you prefer finishing early or exploring possibilities until late?",
    optionA: {
      labelTh: "ปิดงานให้เร็วเพื่อคุมความเสี่ยง",
      labelEn: "Finish early to reduce risk",
      traitCode: "J",
    },
    optionB: {
      labelTh: "เก็บทางเลือกไว้ให้นานที่สุด",
      labelEn: "Keep options open for as long as possible",
      traitCode: "P",
    },
  },
  {
    key: "structure_calendar_style",
    dimension: "J/P",
    promptTh:
      "ปฏิทินที่ดีสำหรับคุณคือมีแผนครบล่วงหน้า หรือมีที่ว่างพอให้รับสิ่งใหม่ได้เสมอ?",
    promptEn:
      "For you, is the best calendar fully mapped ahead or open enough to receive new things freely?",
    optionA: {
      labelTh: "วางล่วงหน้าให้เห็นภาพครบ",
      labelEn: "Mapped ahead so I can see the whole structure",
      traitCode: "J",
    },
    optionB: {
      labelTh: "เว้นที่ว่างให้สิ่งใหม่เข้าได้",
      labelEn: "Open enough to flex with new input",
      traitCode: "P",
    },
  },
  {
    key: "structure_task_start",
    dimension: "J/P",
    promptTh:
      "เวลาเริ่มงาน คุณอยากนิยาม deliverable ชัดก่อนหรืออยากลองขยับแล้วค่อยเห็นรูปงาน?",
    promptEn:
      "When starting work, do you want the deliverable defined first or prefer to move and discover the shape along the way?",
    optionA: {
      labelTh: "นิยาม deliverable ให้ชัดก่อน",
      labelEn: "Define the deliverable clearly first",
      traitCode: "J",
    },
    optionB: {
      labelTh: "ลองขยับแล้วค่อยเห็นรูป",
      labelEn: "Move first and let the shape emerge",
      traitCode: "P",
    },
  },
  {
    key: "structure_trip_preference",
    dimension: "J/P",
    promptTh:
      "เวลาเดินทาง คุณชอบรู้คร่าว ๆ ว่าจะไปไหนเมื่อไร หรือชอบปล่อยให้ทริปพาไปมากกว่า?",
    promptEn:
      "When traveling, do you like knowing the rough plan or prefer letting the trip unfold more freely?",
    optionA: {
      labelTh: "มีกรอบคร่าว ๆ ไว้ก่อน",
      labelEn: "Have a rough structure ahead of time",
      traitCode: "J",
    },
    optionB: {
      labelTh: "ปล่อยให้ทริปพาไป",
      labelEn: "Let the trip reveal itself as it goes",
      traitCode: "P",
    },
  },
  {
    key: "structure_clean_finish",
    dimension: "J/P",
    promptTh:
      "คุณสบายใจกับงานที่ “ปิดจบ” หรือชอบรู้สึกว่ายังมี room ให้ปรับได้อีก?",
    promptEn:
      "Do you feel better when work is clearly closed out or when it still has room to evolve?",
    optionA: {
      labelTh: "ชอบความรู้สึกว่าปิดจบแล้ว",
      labelEn: "I like the feeling of clear closure",
      traitCode: "J",
    },
    optionB: {
      labelTh: "ชอบให้ยังมี room ปรับได้",
      labelEn: "I like leaving room for evolution",
      traitCode: "P",
    },
  },
  {
    key: "structure_change_response",
    dimension: "J/P",
    promptTh:
      "เมื่อมีการเปลี่ยนแผนกะทันหัน คุณมักอยากจัดระเบียบใหม่ทันทีหรือค่อย ๆ ไหลไปกับสถานการณ์ก่อน?",
    promptEn:
      "When plans suddenly change, do you want to re-structure immediately or flow with the situation first?",
    optionA: {
      labelTh: "จัดระเบียบใหม่ทันที",
      labelEn: "Re-structure things right away",
      traitCode: "J",
    },
    optionB: {
      labelTh: "ไหลไปกับสถานการณ์ก่อน",
      labelEn: "Flow with the change first",
      traitCode: "P",
    },
  },
  {
    key: "structure_workspace",
    dimension: "J/P",
    promptTh:
      "พื้นที่ทำงานที่ทำให้คุณลื่นที่สุดคือแบบเป็นระเบียบชัด หรือแบบมีของให้หยิบคิดต่อได้ตลอด?",
    promptEn:
      "What kind of workspace helps you flow more: one that is clearly organized or one that stays open and idea-ready?",
    optionA: {
      labelTh: "เป็นระเบียบชัดเจน",
      labelEn: "Clearly organized and intentional",
      traitCode: "J",
    },
    optionB: {
      labelTh: "เปิดไว้ให้ขยับคิดต่อได้",
      labelEn: "Open and ready for evolving ideas",
      traitCode: "P",
    },
  },
  {
    key: "structure_decision_lock",
    dimension: "J/P",
    promptTh:
      "คุณชอบล็อกการตัดสินใจเร็วพอสมควร หรือชอบรอดูข้อมูลเพิ่มก่อน commit?",
    promptEn:
      "Do you prefer locking decisions fairly early or waiting for more information before committing?",
    optionA: {
      labelTh: "ล็อกให้ชัดเมื่อพอข้อมูลแล้ว",
      labelEn: "Lock it once there is enough information",
      traitCode: "J",
    },
    optionB: {
      labelTh: "รอดูข้อมูลเพิ่มก่อน commit",
      labelEn: "Hold it open until more data arrives",
      traitCode: "P",
    },
  },
  {
    key: "structure_energy_from_checklists",
    dimension: "J/P",
    promptTh:
      "checklist ทำให้คุณโล่งและมั่นคง หรือรู้สึกจำกัดและชอบใช้เท่าที่จำเป็น?",
    promptEn:
      "Do checklists make you feel settled and strong, or do they feel limiting unless truly needed?",
    optionA: {
      labelTh: "โล่งและมั่นคงขึ้น",
      labelEn: "They make me feel settled and in control",
      traitCode: "J",
    },
    optionB: {
      labelTh: "ใช้เท่าที่จำเป็นพอ",
      labelEn: "Useful, but only when really necessary",
      traitCode: "P",
    },
  },
  {
    key: "structure_definition_of_freedom",
    dimension: "J/P",
    promptTh:
      "สำหรับคุณ “อิสระ” คือมีระบบที่พึ่งได้ หรือคือการไม่ถูกล็อกไว้กับแผนเดียว?",
    promptEn:
      "For you, does freedom mean having a dependable system or not being locked into one plan?",
    optionA: {
      labelTh: "มีระบบที่พึ่งได้",
      labelEn: "Having a dependable system",
      traitCode: "J",
    },
    optionB: {
      labelTh: "ไม่ถูกล็อกกับแผนเดียว",
      labelEn: "Not being locked into a single plan",
      traitCode: "P",
    },
  },
  {
    key: "structure_work_rhythm",
    dimension: "J/P",
    promptTh:
      "จังหวะทำงานที่ดีที่สุดของคุณคือค่อย ๆ ปิดทีละส่วนหรือกระโดดไปมาจนทุกอย่างมาบรรจบกัน?",
    promptEn:
      "Is your best working rhythm closing things one by one or jumping between threads until they converge?",
    optionA: {
      labelTh: "ปิดทีละส่วนอย่างเป็นลำดับ",
      labelEn: "Close things one piece at a time",
      traitCode: "J",
    },
    optionB: {
      labelTh: "กระโดดไปมาจนมันมาบรรจบกัน",
      labelEn: "Jump between threads until they converge",
      traitCode: "P",
    },
  },
];

export const assessmentQuestions = [
  ...energyQuestions,
  ...informationQuestions,
  ...decisionQuestions,
  ...structureQuestions,
].map((question, index) => createQuestion(question, index + 1));

export function buildLocalizedContent(profile) {
  return [
    {
      locale: "th",
      section: "summary",
      tier: "free",
      title: "ภาพรวมบุคลิก",
      body: profile.summaryTh,
      sortOrder: 0,
    },
    {
      locale: "en",
      section: "summary",
      tier: "free",
      title: "Personality Summary",
      body: profile.summaryEn,
      sortOrder: 0,
    },
    {
      locale: "th",
      section: "strengths",
      tier: "premium",
      title: "จุดแข็งหลัก",
      body: `${profile.archetypeNameTh} มักโดดเด่นเมื่อมีกรอบเป้าหมายที่ชัด มี autonomy ที่พอดี และได้ใช้จุดแข็งแบบ ${profile.code} อย่างมีวินัย.`,
      sortOrder: 1,
    },
    {
      locale: "en",
      section: "strengths",
      tier: "premium",
      title: "Core Strengths",
      body: `${profile.archetypeNameEn} tends to perform best when the mission is clear, autonomy is respected, and the natural ${profile.code} pattern is used intentionally.`,
      sortOrder: 1,
    },
    {
      locale: "th",
      section: "blind_spots",
      tier: "premium",
      title: "จุดที่ควรระวัง",
      body: `ภายใต้ความกดดัน ${profile.archetypeNameTh} อาจใช้จุดแข็งเดิมมากเกินไปจนกลายเป็น blind spot ได้ จึงควรมี feedback loop ที่ตรงและปลอดภัย.`,
      sortOrder: 2,
    },
    {
      locale: "en",
      section: "blind_spots",
      tier: "premium",
      title: "Blind Spots",
      body: `Under pressure, ${profile.archetypeNameEn} can overuse familiar strengths until they become blind spots, so a clear and trusted feedback loop matters.`,
      sortOrder: 2,
    },
    {
      locale: "th",
      section: "growth_map",
      tier: "premium",
      title: "แนวทางเติบโต",
      body: `growth map ของ ${profile.archetypeNameTh} ควรเน้นการขยายด้านตรงข้ามอย่างค่อยเป็นค่อยไป ไม่ใช่เปลี่ยนตัวเองแบบหักดิบ.`,
      sortOrder: 3,
    },
    {
      locale: "en",
      section: "growth_map",
      tier: "premium",
      title: "Growth Map",
      body: `The strongest growth path for ${profile.archetypeNameEn} is gradual expansion into the opposite preference, not a forced personality rewrite.`,
      sortOrder: 3,
    },
  ];
}
