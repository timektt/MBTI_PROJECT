import { mbtiZProfiles } from "./mbti-z-data.mjs";

const SUPPORTED_LOCALES = ["th", "en"];

const LETTER_EXPLANATIONS = {
  th: {
    E: {
      title: "พลังงานผ่านโลกภายนอก",
      body: "มักจัดระเบียบความคิดผ่านการมีส่วนร่วม การสนทนา หรือการลงมือกับสิ่งที่อยู่ตรงหน้า โดยยังต้องการเวลาพักตามบริบทได้",
    },
    I: {
      title: "พลังงานผ่านโลกภายใน",
      body: "มักตกผลึกความคิดในพื้นที่ส่วนตัวก่อนเปิดออกสู่คนอื่น และไม่ได้หมายความว่าไม่ชอบการเข้าสังคม",
    },
    S: {
      title: "จับข้อมูลที่เป็นรูปธรรม",
      body: "มักเริ่มจากข้อเท็จจริง ประสบการณ์ตรง และรายละเอียดที่ตรวจสอบได้ ก่อนขยายไปสู่ความเป็นไปได้อื่น",
    },
    N: {
      title: "มองรูปแบบและความเป็นไปได้",
      body: "มักสนใจความเชื่อมโยง ความหมาย และภาพที่อาจเกิดขึ้น มากกว่าหยุดอยู่กับข้อมูลที่เห็นตรงหน้าเพียงอย่างเดียว",
    },
    T: {
      title: "ตัดสินใจผ่านหลักเหตุผล",
      body: "มักชั่งน้ำหนักด้วยความสอดคล้อง หลักเกณฑ์ และผลของระบบ โดยยังมีอารมณ์และคุณค่าเป็นส่วนหนึ่งของมนุษย์ตามปกติ",
    },
    F: {
      title: "ตัดสินใจผ่านคุณค่าและผลต่อคน",
      body: "มักพิจารณาสิ่งที่สำคัญต่อผู้เกี่ยวข้องและความสอดคล้องกับคุณค่าภายใน โดยไม่ได้แปลว่าขาดเหตุผล",
    },
    J: {
      title: "สร้างทิศทางและความชัดเจน",
      body: "มักสบายใจกว่าเมื่อมีข้อสรุป ลำดับ และแผนที่พอใช้เดินต่อได้ แม้ยังปรับแผนเมื่อข้อมูลเปลี่ยนได้",
    },
    P: {
      title: "รักษาพื้นที่ให้ทางเลือก",
      body: "มักตอบสนองได้ดีเมื่อมีอิสระให้สำรวจ ปรับจังหวะ และรับข้อมูลใหม่ก่อนปิดการตัดสินใจ",
    },
  },
  en: {
    E: {
      title: "Energy through the outer world",
      body: "Often organizes thought through participation, conversation, or visible action, while still needing rest depending on context.",
    },
    I: {
      title: "Energy through the inner world",
      body: "Often refines thoughts privately before sharing them and can still enjoy meaningful social contact.",
    },
    S: {
      title: "Attention to concrete information",
      body: "Often begins with facts, direct experience, and observable detail before extending toward other possibilities.",
    },
    N: {
      title: "Attention to patterns and possibility",
      body: "Often notices connections, implications, and what could emerge beyond the information immediately visible.",
    },
    T: {
      title: "Decisions through logical criteria",
      body: "Often weighs consistency, principles, and system effects while still having normal human feelings and values.",
    },
    F: {
      title: "Decisions through values and human impact",
      body: "Often considers what matters to the people involved and what aligns with inner values; this does not imply weak reasoning.",
    },
    J: {
      title: "A preference for direction and closure",
      body: "Often works best with a usable conclusion, sequence, and plan, while remaining capable of revising when evidence changes.",
    },
    P: {
      title: "A preference for keeping options open",
      body: "Often responds well to room for exploration, timing adjustments, and new information before a decision closes.",
    },
  },
};

const SHARED_COPY = {
  th: {
    disclaimer:
      "โปรไฟล์นี้ใช้เพื่อการสะท้อนตัวเองและการสนทนาเชิงการศึกษา ไม่ใช่การวินิจฉัย การรับรองความเข้ากันได้ หรือข้อสรุปว่าคุณควรทำอาชีพใด",
    tendencyNote:
      "ตัวอย่างงานและสภาพแวดล้อมเหล่านี้เป็นแนวโน้มเพื่อช่วยสำรวจ ไม่ใช่เกณฑ์คัดเลือกบุคลากรหรือข้อจำกัดด้านอาชีพ",
    movieDisclaimer:
      "Movie Profile เป็นเลนส์เชิงสร้างสรรค์สำหรับอธิบายรสนิยมการเล่าเรื่อง ไม่ได้ทำนายบุคลิกหรือคุณค่าของบุคคล",
  },
  en: {
    disclaimer:
      "This profile is for educational reflection and conversation. It is not a diagnosis, a compatibility guarantee, or a conclusion about which career you should pursue.",
    tendencyNote:
      "These role and environment examples are exploration prompts, not hiring criteria or career limits.",
    movieDisclaimer:
      "The Movie Profile is a creative lens for discussing story preferences; it does not predict personality or personal worth.",
  },
};

function strengthItems(items) {
  return items.map(([title, body, example]) => ({ title, body, example }));
}

function growthItems(items) {
  return items.map(([title, body, practice]) => ({ title, body, practice }));
}

function createLocaleDetail(code, locale, detail) {
  return {
    identitySentence: detail.identitySentence,
    introduction: detail.introduction,
    letters: [...code].map((letter) => ({ letter, ...LETTER_EXPLANATIONS[locale][letter] })),
    strengths: strengthItems(detail.strengths),
    growthEdges: growthItems(detail.growthEdges),
    decisionStyle: detail.decisionStyle,
    communicationStyle: detail.communicationStyle,
    relationships: detail.relationships,
    work: {
      individual: detail.work.individual,
      teamwork: detail.work.teamwork,
      leadership: detail.work.leadership,
      environments: detail.work.environments,
      roleExamples: detail.work.roleExamples,
      tendencyNote: SHARED_COPY[locale].tendencyNote,
    },
    stress: {
      signals: detail.stress.signals,
      recoveryPractices: detail.stress.recoveryPractices,
    },
    movieProfileLens: {
      title: detail.movieProfileLens.title,
      body: detail.movieProfileLens.body,
      disclaimer: SHARED_COPY[locale].movieDisclaimer,
    },
    disclaimer: SHARED_COPY[locale].disclaimer,
  };
}

const DETAIL_SEEDS = [
  {
    code: "INTJ",
    relatedCodes: ["INTP", "ENTJ", "INFJ"],
    th: {
      identitySentence: "นักออกแบบระบบระยะไกลที่มักเปลี่ยนภาพอนาคตให้กลายเป็นโครงสร้างที่เดินตามได้",
      introduction: [
        "INTJ มักมองสิ่งต่าง ๆ เป็นระบบที่มีเหตุและผลเชื่อมกัน พวกเขาชอบถามว่าเป้าหมายจริงคืออะไร จุดคานงัดอยู่ตรงไหน และวิธีใดจะยังใช้ได้เมื่อเงื่อนไขเปลี่ยนไป",
        "ความเป็นส่วนตัวช่วยให้ INTJ ตกผลึกภาพใหญ่ได้ลึก แต่การเปิดสมมติฐานให้คนอื่นตรวจสอบมักทำให้แผนแข็งแรงขึ้น โปรไฟล์นี้จึงควรถูกอ่านเป็นแนวโน้ม ไม่ใช่กรอบที่ทุก INTJ ต้องเหมือนกัน",
      ],
      strengths: [
        ["วางสถาปัตยกรรม", "เชื่อมเป้าหมาย ข้อจำกัด และลำดับงานเป็นระบบเดียว", "เช่น แปลงโปรเจกต์ที่กระจัดกระจายเป็น roadmap ที่มี dependency ชัดเจน"],
        ["คิดระยะยาว", "มองผลกระทบต่อเนื่องและต้นทุนที่อาจซ่อนอยู่หลังทางลัด", "เช่น เลือกโครงสร้างที่ดูช้ากว่าในวันนี้แต่ลดงานแก้ซ้ำในอนาคต"],
        ["เรียนรู้ด้วยตัวเอง", "เจาะเรื่องยากอย่างเป็นอิสระจนสร้าง mental model ของตนเองได้", "เช่น อ่านหลายแหล่งแล้วทดลองเพื่อแยกหลักการออกจากความเห็น"],
        ["ตัดสิ่งรบกวน", "รักษาโฟกัสกับโจทย์สำคัญแม้มีรายละเอียดแทรกจำนวนมาก", "เช่น ปฏิเสธ feature ที่ไม่ช่วย metric หลักของรอบงาน"],
      ],
      growthEdges: [
        ["เปิดเหตุผลให้เห็น", "ข้อสรุปที่ชัดในหัวอาจดูเหมือนข้ามขั้นสำหรับคนอื่น", "เล่าหลักฐานและทางเลือกที่ตัดทิ้งก่อนเสนอคำตอบ"],
        ["รับข้อมูลจากหน้างาน", "โมเดลที่สวยอาจพลาดข้อจำกัดของคนหรือบริบทจริง", "ทดสอบสมมติฐานกับผู้ใช้หรือผู้ปฏิบัติงานตั้งแต่ต้น"],
        ["เว้นพื้นที่ให้ความรู้สึก", "การรีบแก้ระบบอาจทำให้คนรู้สึกว่าสิ่งที่เขาเจอถูกมองข้าม", "สะท้อนสิ่งที่ได้ยินก่อนเข้าสู่โหมดแก้ปัญหา"],
      ],
      decisionStyle: "มักสร้างเกณฑ์ ตัดทางเลือกที่ไม่ตอบเป้าหมาย แล้วเลือกแนวทางที่คุ้มค่าในระยะยาว แต่ควรตรวจว่าข้อมูลจากคนหน้างานถูกนับรวมแล้ว",
      communicationStyle: "สื่อสารตรง กระชับ และเน้นสาระ มักทำงานได้ดีขึ้นเมื่อบอกบริบท เหตุผล และผลที่ต้องการแทนการให้ข้อสรุปอย่างเดียว",
      relationships: "มักลงทุนกับความสัมพันธ์ที่ไว้ใจได้และเคารพพื้นที่ส่วนตัว แสดงความใส่ใจผ่านการช่วยคิดหรือวางแผน และอาจต้องพูดความรู้สึกให้ชัดกว่าที่คิดว่าอีกฝ่ายจะรับรู้เอง",
      work: {
        individual: "เด่นเมื่อมีโจทย์ยาก อิสระในการออกแบบ และเวลาคิดลึกโดยไม่ถูกรบกวนต่อเนื่อง",
        teamwork: "ช่วยทีมด้วยภาพรวม มาตรฐาน และการเห็น dependency แต่ควรเปิดช่องให้ทีมท้าทายสมมติฐาน",
        leadership: "มีแนวโน้มนำผ่านทิศทาง ระบบ และความสามารถ มากกว่าการสร้างพลังด้วยการปรากฏตัวตลอดเวลา",
        environments: ["เป้าหมายชัดแต่เปิดวิธีทำ", "งานที่ให้เวลา deep work", "วัฒนธรรมที่โต้แย้งด้วยหลักฐาน"],
        roleExamples: ["system design", "research strategy", "product architecture", "long-range planning"],
      },
      stress: {
        signals: ["หมกกับรายละเอียดเล็กจนเสียภาพรวม", "ตัดการสื่อสารและพยายามรับทุกอย่างเอง", "หงุดหงิดกับความไม่เป็นระบบมากกว่าปกติ"],
        recoveryPractices: ["ลด input แล้วเขียนปัญหาใหม่เป็นข้อเท็จจริง", "พักผ่านกิจกรรมทางกายหรือประสาทสัมผัส", "คุยกับคนที่ไว้ใจเพื่อทดสอบสมมติฐานหนึ่งรอบ"],
      },
      movieProfileLens: { title: "โลกที่มีกฎซ่อนอยู่", body: "อาจสนุกกับเรื่องที่มีระบบภายในชัด ตัวละครต้องอ่านเกม และรายละเอียดช่วงต้นกลับมามีความหมายในตอนท้าย" },
    },
    en: {
      identitySentence: "A long-range systems designer who often turns a future vision into a structure others can follow.",
      introduction: [
        "INTJs often see situations as connected systems of causes and effects. They tend to ask what the real objective is, where the leverage sits, and which approach will still work when conditions change.",
        "Privacy can help an INTJ refine the larger model, while exposing assumptions to other people often makes the plan stronger. This profile describes tendencies rather than a template every INTJ must match.",
      ],
      strengths: [
        ["System architecture", "Connects objectives, constraints, and sequencing into a coherent model.", "For example, turning a scattered project into a roadmap with explicit dependencies."],
        ["Long-range thinking", "Notices downstream effects and costs hidden behind convenient shortcuts.", "For example, choosing a slower foundation now to reduce repeated repair later."],
        ["Independent learning", "Investigates difficult subjects until a personal mental model becomes usable.", "For example, comparing sources and experiments to separate principles from opinions."],
        ["Focused prioritization", "Protects the central problem from a high volume of distracting detail.", "For example, declining a feature that does not support the cycle's primary metric."],
      ],
      growthEdges: [
        ["Make reasoning visible", "A conclusion that feels obvious internally may look like a skipped step to others.", "Share the evidence and rejected options before presenting the answer."],
        ["Invite field evidence", "An elegant model can miss constraints carried by people and real settings.", "Test assumptions with users or operators early."],
        ["Leave room for feeling", "Moving directly to system repair can make lived experience feel ignored.", "Reflect what was heard before entering solution mode."],
      ],
      decisionStyle: "Often defines criteria, removes options that do not serve the objective, and favors durable value; the decision improves when field knowledge is explicitly included.",
      communicationStyle: "Usually direct, concise, and substance-led. Context, reasoning, and the intended outcome make the message easier to use than a conclusion alone.",
      relationships: "Often invests deeply in trusted relationships and respects autonomy. Care may appear as analysis or planning, so naming feelings directly can prevent others from having to infer them.",
      work: {
        individual: "Often thrives with difficult problems, design autonomy, and protected time for deep thought.",
        teamwork: "Contributes direction, standards, and dependency awareness while benefiting from explicit challenges to assumptions.",
        leadership: "Tends to lead through direction, systems, and competence more than continuous visible presence.",
        environments: ["clear outcomes with open methods", "protected deep-work time", "evidence-based disagreement"],
        roleExamples: ["system design", "research strategy", "product architecture", "long-range planning"],
      },
      stress: {
        signals: ["fixating on small details and losing the wider model", "withdrawing and carrying every problem alone", "becoming unusually irritated by disorder"],
        recoveryPractices: ["reduce input and rewrite the problem as facts", "reset through physical or sensory activity", "test one key assumption with a trusted person"],
      },
      movieProfileLens: { title: "Worlds with hidden rules", body: "May enjoy stories with coherent inner systems, characters who must read the game, and early details that gain new meaning near the end." },
    },
  },
  {
    code: "INTP",
    relatedCodes: ["INTJ", "ENTP", "ISTP"],
    th: {
      identitySentence: "นักสำรวจแนวคิดที่มักรื้อสมมติฐานเพื่อค้นหาคำอธิบายที่แม่นและยืดหยุ่นกว่าเดิม",
      introduction: [
        "INTP มักสนใจว่าแนวคิดหนึ่งทำงานจริงอย่างไรและมีข้อยกเว้นตรงไหน พวกเขาสามารถอยู่กับคำถามที่ยังไม่มีคำตอบได้นานเพื่อสร้างแบบจำลองที่อธิบายเรื่องซับซ้อนได้ดีขึ้น",
        "ความอยากรู้อาจพาไปหลายเส้นทางพร้อมกัน จุดแข็งจึงชัดที่สุดเมื่อมีพื้นที่ทดลองและมีจังหวะเปลี่ยน insight ให้เป็นสิ่งที่คนอื่นทดสอบหรือใช้งานได้",
      ],
      strengths: [
        ["แยกหลักการ", "มองทะลุอาการไปหาโครงสร้างหรือกฎที่อยู่ข้างใต้", "เช่น หา root cause จากหลายเหตุการณ์ที่ดูไม่เกี่ยวกัน"],
        ["ท้าทายสมมติฐาน", "ไม่รับคำอธิบายเพียงเพราะเป็นวิธีที่เคยทำมา", "เช่น ตั้งคำถามกับ metric ที่ทีมใช้จนพบว่ามันวัดผิดเป้าหมาย"],
        ["เชื่อมแนวคิด", "นำความรู้ต่างสาขามาประกอบเป็นมุมมองใหม่", "เช่น ใช้แนวคิดจากเกมมาช่วยออกแบบระบบ feedback"],
        ["ปรับโมเดลเร็ว", "ยอมแก้ความคิดเมื่อหลักฐานใหม่ขัดกับสิ่งเดิม", "เช่น เปลี่ยน hypothesis โดยไม่ยึดติดกับงานที่ลงทุนไปแล้ว"],
      ],
      growthEdges: [
        ["ปิดวงทดลอง", "การสำรวจต่ออาจเลื่อนการส่งมอบออกไปเรื่อย ๆ", "กำหนดคำถามเดียวและหลักฐานขั้นต่ำสำหรับรอบนี้"],
        ["แปลความคิดให้คนใช้", "คำอธิบายที่แม่นอาจซับซ้อนเกินผู้ฟัง", "เริ่มจากข้อสรุป ตัวอย่าง แล้วค่อยเปิดรายละเอียด"],
        ["นับต้นทุนทางอารมณ์", "ข้อโต้แย้งเชิงตรรกะอาจถูกต้องแต่เกิดผิดจังหวะ", "ถามก่อนว่าอีกฝ่ายต้องการวิเคราะห์หรือเพียงต้องการให้รับฟัง"],
      ],
      decisionStyle: "มักเปรียบเทียบแบบจำลองและหาข้อยกเว้นก่อนเลือก จึงตัดสินใจได้ดีเมื่อกำหนด deadline และเกณฑ์ว่าหลักฐานระดับใดเพียงพอ",
      communicationStyle: "ชอบบทสนทนาที่เปิดให้ตั้งคำถามและปรับนิยาม อาจกระโดดข้ามขั้นในหัว จึงควรระบุสมมติฐานและยกตัวอย่างที่จับต้องได้",
      relationships: "มักผูกพันผ่านความสนใจร่วม การสนทนาลึก และการเคารพอิสระ ความสม่ำเสมอเล็ก ๆ และการบอกความต้องการตรง ๆ ช่วยให้ความใส่ใจมองเห็นได้",
      work: {
        individual: "ทำงานได้ดีเมื่อได้แกะโจทย์คลุมเครือ ทดลองหลาย hypothesis และควบคุมวิธีคิดของตนเอง",
        teamwork: "ช่วยทีมด้วยคำถามคมและทางเลือกใหม่ แต่ควรเชื่อมข้อเสนอเข้ากับข้อจำกัดด้านเวลาและการส่งมอบ",
        leadership: "มักนำผ่านความชัดของหลักการและการเปิดพื้นที่ให้คนเก่งคิด มากกว่าควบคุมขั้นตอนละเอียด",
        environments: ["วัฒนธรรมทดลองและเรียนรู้", "มีอิสระทางปัญญา", "ยอมรับการเปลี่ยนใจตามหลักฐาน"],
        roleExamples: ["concept research", "software modeling", "data exploration", "technical problem solving"],
      },
      stress: {
        signals: ["เปิดงานใหม่เพื่อหลบงานที่ต้องปิด", "วนตรวจเหตุผลเดิมโดยไม่รับ input ใหม่", "เก็บตัวแล้วตีความปฏิกิริยาคนอื่นรุนแรงเกินจริง"],
        recoveryPractices: ["ลดโจทย์ให้เหลือ next experiment เดียว", "เขียนความคิดให้เป็นลำดับที่คนอื่นอ่านได้", "พักร่างกายและกลับมาคุยกับคนปลอดภัย"],
      },
      movieProfileLens: { title: "ปริศนาที่ชวนสร้างทฤษฎี", body: "อาจชอบเรื่องที่เปิดช่องให้ตีความ มีกฎให้ค้นพบ และไม่รีบเฉลยทุกอย่างก่อนผู้ชมได้ทดลองคิดเอง" },
    },
    en: {
      identitySentence: "A conceptual explorer who often dismantles assumptions to find a more precise and adaptable explanation.",
      introduction: [
        "INTPs often want to know how an idea actually works and where its exceptions live. They can stay with an unresolved question for a long time while building a model that explains complexity more cleanly.",
        "Curiosity may open several paths at once. Their contribution becomes most visible when exploration has room to breathe and insight is eventually turned into something other people can test or use.",
      ],
      strengths: [
        ["Principle finding", "Looks beneath symptoms for the structure or rule producing them.", "For example, finding one root cause across incidents that looked unrelated."],
        ["Assumption testing", "Does not accept an explanation merely because it is established practice.", "For example, questioning a team metric and discovering that it measures the wrong outcome."],
        ["Concept linking", "Combines knowledge from different fields into a fresh perspective.", "For example, using a game-design principle to improve a feedback system."],
        ["Model revision", "Updates an idea when new evidence conflicts with the old frame.", "For example, changing a hypothesis without defending sunk effort."],
      ],
      growthEdges: [
        ["Close the experiment", "Continued exploration can keep delivery moving into the future.", "Choose one question and define the minimum evidence needed this cycle."],
        ["Translate for use", "A precise explanation may still be too complex for its audience.", "Lead with the conclusion and an example, then reveal detail."],
        ["Count emotional cost", "A logical challenge can be valid and still arrive at the wrong moment.", "Ask whether the other person wants analysis or to be heard first."],
      ],
      decisionStyle: "Often compares models and searches for exceptions before choosing, so a deadline and an explicit evidence threshold can make decisions more practical.",
      communicationStyle: "Prefers conversations where definitions can be questioned and revised. Naming assumptions and adding a concrete example helps others follow internal leaps.",
      relationships: "Often bonds through shared interests, deep conversation, and respect for independence. Small consistency and direct statements of need can make care more visible.",
      work: {
        individual: "Often works well when unpacking ambiguous problems, testing hypotheses, and controlling the path of inquiry.",
        teamwork: "Offers sharp questions and alternative models while benefiting from linking ideas to time and delivery constraints.",
        leadership: "Tends to lead through clear principles and intellectual room rather than close control of every step.",
        environments: ["experimental learning cultures", "intellectual autonomy", "permission to revise with evidence"],
        roleExamples: ["concept research", "software modeling", "data exploration", "technical problem solving"],
      },
      stress: {
        signals: ["opening new work to avoid closing current work", "rechecking the same logic without new input", "withdrawing and overreading other people's reactions"],
        recoveryPractices: ["reduce the problem to one next experiment", "write the reasoning in a sequence others can read", "reset physically and reconnect with a trusted person"],
      },
      movieProfileLens: { title: "A puzzle that invites theories", body: "May enjoy stories that leave interpretive room, reveal discoverable rules, and allow the audience to think before every answer is supplied." },
    },
  },
  {
    code: "ENTJ",
    relatedCodes: ["INTJ", "ESTJ", "ENTP"],
    th: {
      identitySentence: "ผู้ขับเคลื่อนเชิงระบบที่มักรวมคน ทรัพยากร และการตัดสินใจไปสู่เป้าหมายที่ทะเยอทะยาน",
      introduction: [
        "ENTJ มักเห็นทั้งเป้าหมายและกลไกที่ต้องขยับเพื่อไปถึงมัน พวกเขามีแนวโน้มเปลี่ยนความคลุมเครือให้เป็นโครงสร้าง ตัดสินใจ และสร้าง momentum ให้กลุ่มเดินหน้า",
        "พลังในการผลักดันมีประโยชน์มากเมื่อจับคู่กับการฟังข้อมูลที่ยังไม่ดังที่สุด ความเร็วและมาตรฐานจึงไม่จำเป็นต้องแลกกับศักดิ์ศรีหรือจังหวะการเรียนรู้ของคนในทีม",
      ],
      strengths: [
        ["ตั้งทิศทาง", "แปลงความตั้งใจใหญ่ให้เป็นเป้าหมายและลำดับที่ชัด", "เช่น กำหนด outcome owner และ milestone ของการเปลี่ยนแปลงองค์กร"],
        ["จัดสรรทรัพยากร", "มองว่าคน เวลา และงบควรถูกใช้ตรงไหนเพื่อสร้างผลสูงสุด", "เช่น ย้ายกำลังจากงานรองไปแก้ bottleneck ที่ขวางทั้งระบบ"],
        ["ตัดสินใจภายใต้แรงกดดัน", "กล้าปิดทางเลือกเมื่อทีมต้องการทิศทาง", "เช่น เลือก scope ที่ส่งมอบได้แทนการรอข้อมูลสมบูรณ์"],
        ["ยกระดับมาตรฐาน", "เห็นศักยภาพที่ระบบหรือทีมยังไปไม่ถึง", "เช่น ปรับวิธี review ให้ความผิดพลาดเดิมไม่เกิดซ้ำ"],
      ],
      growthEdges: [
        ["แยกความเร็วจากแรงกด", "จังหวะที่เร็วของตนอาจทำให้คนหยุดเสนอข้อมูล", "ถาม objection ก่อนประกาศข้อสรุป"],
        ["รับรู้ความพยายาม", "การเห็นแต่ช่องว่างถัดไปอาจทำให้ทีมรู้สึกว่างานไม่เคยพอ", "ระบุสิ่งที่ดีขึ้นอย่างเฉพาะเจาะจงก่อนตั้งเป้าใหม่"],
        ["ยอมให้บางเรื่องสุก", "ไม่ใช่ทุกโจทย์ตอบสนองต่อการเร่งหรือเพิ่มโครงสร้าง", "กำหนดช่วงสังเกตสำหรับเรื่องคนและการทดลองที่ยังไม่ชัด"],
      ],
      decisionStyle: "มักนิยาม outcome ประเมิน leverage และเลือกทางที่ทำให้ระบบเดินได้เร็วขึ้น ควรสร้าง dissent window เพื่อรับข้อมูลที่ขัดกับมุมมองตนเอง",
      communicationStyle: "ตรง ชัด และมุ่ง action เหมาะกับการบอก decision owner และ next step แต่การเพิ่มคำถามกับการสะท้อนสิ่งที่ได้ยินช่วยลดความรู้สึกว่าบทสนทนาถูกกำหนดไว้แล้ว",
      relationships: "มักแสดงความใส่ใจผ่านการผลักดัน สนับสนุนเป้าหมาย และแก้ปัญหา การถามว่าอีกฝ่ายต้องการกำลังใจ คำแนะนำ หรือพื้นที่ จะทำให้พลังช่วยเหลือตรงจุดขึ้น",
      work: {
        individual: "เด่นกับโจทย์ที่มีผลกระทบสูง ต้องตัดสินใจ และให้สิทธิ์จัดโครงสร้างใหม่",
        teamwork: "สร้าง cadence และ ownership ได้ดี พร้อมได้ประโยชน์จากทีมที่กล้าเสนอข้อมูลตรงข้าม",
        leadership: "มักนำด้วยวิสัยทัศน์ มาตรฐาน และการจัดระบบให้คนลงมือได้จริง",
        environments: ["เป้าหมายท้าทายและวัดผลได้", "สิทธิ์ตัดสินใจชัด", "feedback ตรงแต่เคารพกัน"],
        roleExamples: ["business operations", "program leadership", "organizational design", "venture building"],
      },
      stress: {
        signals: ["เร่งทุกเรื่องพร้อมกัน", "ควบคุมรายละเอียดแทนการมอบหมาย", "มองความลังเลเป็นการต่อต้านโดยอัตโนมัติ"],
        recoveryPractices: ["จัดลำดับใหม่ว่าอะไรสำคัญจริง", "ขอข้อมูลจากคนที่ไม่เห็นด้วยโดยไม่โต้ทันที", "เว้นช่วงที่ไม่ต้อง optimize เพื่อให้ร่างกายลดแรงตึง"],
      },
      movieProfileLens: { title: "ภารกิจที่ต้องชนะด้วยการจัดเกม", body: "อาจสนุกกับเรื่องที่ตัวละครตั้งเป้าใหญ่ สร้างพันธมิตร ตัดสินใจภายใต้แรงกดดัน และรับผลจากอำนาจที่ใช้" },
    },
    en: {
      identitySentence: "A systems mobilizer who often aligns people, resources, and decisions around an ambitious objective.",
      introduction: [
        "ENTJs often notice both the objective and the mechanisms that must move to reach it. They tend to turn ambiguity into structure, make decisions, and create momentum for a group.",
        "That driving energy is most useful when paired with attention to information that has not become loud yet. Speed and standards do not have to come at the expense of dignity or learning pace.",
      ],
      strengths: [
        ["Direction setting", "Turns a large intention into explicit outcomes and sequence.", "For example, defining owners and milestones for an organizational change."],
        ["Resource alignment", "Sees where people, time, and budget can create the most leverage.", "For example, moving effort from secondary work to the system's limiting bottleneck."],
        ["Pressure decisions", "Can close options when a team needs a usable direction.", "For example, choosing a deliverable scope instead of waiting for perfect information."],
        ["Standard raising", "Recognizes capacity that a team or system has not reached yet.", "For example, redesigning review so the same class of mistake is less likely to repeat."],
      ],
      growthEdges: [
        ["Separate speed from pressure", "A fast internal pace can cause people to stop offering information.", "Invite objections before announcing the conclusion."],
        ["Recognize progress", "Seeing only the next gap can make contribution feel permanently insufficient.", "Name specific improvement before setting the next target."],
        ["Let some issues mature", "Not every problem responds to acceleration or more structure.", "Create an observation window for people issues and unclear experiments."],
      ],
      decisionStyle: "Often defines the outcome, evaluates leverage, and chooses the path that moves the system. A deliberate dissent window improves access to contradictory evidence.",
      communicationStyle: "Usually direct, clear, and action-oriented. Questions and reflection make decision ownership and next steps feel collaborative rather than predetermined.",
      relationships: "Often expresses care by advancing goals, providing support, and solving problems. Asking whether someone wants encouragement, advice, or space makes that help more accurate.",
      work: {
        individual: "Often excels with consequential problems, decision authority, and permission to redesign structure.",
        teamwork: "Creates cadence and ownership while benefiting from colleagues who can present opposing evidence directly.",
        leadership: "Tends to lead with vision, standards, and systems that make execution possible.",
        environments: ["ambitious measurable outcomes", "clear decision rights", "direct and respectful feedback"],
        roleExamples: ["business operations", "program leadership", "organizational design", "venture building"],
      },
      stress: {
        signals: ["accelerating every issue at once", "controlling details instead of delegating", "treating hesitation as automatic resistance"],
        recoveryPractices: ["reprioritize what genuinely matters", "hear a dissenting view without immediate rebuttal", "leave an unoptimized interval for physical tension to settle"],
      },
      movieProfileLens: { title: "A mission won by shaping the game", body: "May enjoy stories where characters pursue large goals, build alliances, decide under pressure, and face the consequences of power." },
    },
  },
  {
    code: "ENTP",
    relatedCodes: ["INTP", "ENTJ", "ENFP"],
    th: {
      identitySentence: "นักทดลองความเป็นไปได้ที่มักทำให้คำถามใหม่เปิดทางออกซึ่งระบบเดิมมองไม่เห็น",
      introduction: [
        "ENTP มักมีพลังเมื่อได้สำรวจทางเลือก ทดสอบข้อโต้แย้ง และเชื่อมไอเดียที่อยู่คนละมุม พวกเขาสามารถทำให้ปัญหาที่ดูตันกลับมามีพื้นที่เคลื่อนไหวอีกครั้ง",
        "การตั้งคำถามไม่ได้แปลว่าต่อต้านเสมอไป แต่อิทธิพลของ ENTP จะชัดขึ้นเมื่อเลือกไอเดียที่ควรตามต่อและรับผิดชอบช่วงเปลี่ยนจากความตื่นเต้นไปสู่การทำให้เสร็จ",
      ],
      strengths: [
        ["สร้างทางเลือก", "มองเห็นหลายเส้นทางเมื่อคนอื่นติดกับกรอบเดิม", "เช่น เสนอ business model สำรองเมื่อแผนหลักติดข้อจำกัด"],
        ["คิดสดร่วมกับคน", "ใช้บทสนทนาเพื่อยกระดับและทดสอบไอเดียอย่างรวดเร็ว", "เช่น facilitation ที่ทำให้ทีมค้นพบสมมติฐานใหม่ในห้อง"],
        ["มองช่องโหว่", "จับความไม่สอดคล้องในข้อเสนอหรือกฎได้ไว", "เช่น พบ edge case ก่อนทีมลงทุนพัฒนาระบบเต็มรูปแบบ"],
        ["ปรับตัวกับความไม่แน่นอน", "รักษาความคล่องตัวเมื่อข้อมูลหรือเงื่อนไขเปลี่ยน", "เช่น เปลี่ยน prototype ระหว่างรอบทดลองโดยไม่เสียเป้าหมายหลัก"],
      ],
      growthEdges: [
        ["เลือกเดิมพัน", "การรักษาทุกทางเลือกทำให้ทรัพยากรกระจาย", "จัดอันดับไอเดียและหยุดอย่างน้อยหนึ่งเรื่องเมื่อเริ่มเรื่องใหม่"],
        ["ดูผลของการถก", "การท้าทายเพื่อความสนุกอาจใช้พลังคนอื่นเกินจำเป็น", "บอกเจตนาและขอ consent ก่อนเข้าสู่ debate mode"],
        ["อยู่กับงานช่วงท้าย", "ความสนใจอาจลดเมื่อโจทย์ไม่ใหม่แล้ว", "แบ่งช่วง polish เป็น checkpoint สั้นและมี owner ร่วม"],
      ],
      decisionStyle: "มักสร้างและ stress-test ทางเลือกก่อนตัดสินใจ จึงได้ประโยชน์จากเกณฑ์เลือกที่ชัดและเวลาปิดวงเพื่อไม่ให้ novelty กลายเป็นตัวตัดสิน",
      communicationStyle: "รวดเร็ว มีพลัง และชอบโยนสมมติฐานให้คนช่วยกันทดสอบ การแยกให้ชัดว่าอะไรคือข้อเสนอจริงและอะไรคือ thought experiment ช่วยลดความสับสน",
      relationships: "มักเชื่อมกันผ่านอารมณ์ขัน การแลกเปลี่ยนไอเดีย และประสบการณ์ใหม่ ความน่าเชื่อถือเติบโตเมื่อกลับมาตามสิ่งที่รับปากแม้ช่วงตื่นเต้นผ่านไปแล้ว",
      work: {
        individual: "เด่นกับ zero-to-one การแก้โจทย์ไม่ชัด และงานที่เปิดให้ทดลองหลายกรอบ",
        teamwork: "เพิ่มพลังและทางเลือกให้ทีม แต่ต้องช่วยปิด decision log และ ownership หลัง brainstorm",
        leadership: "มักนำด้วยวิสัยทัศน์ การตั้งคำถาม และการเปิดพื้นที่ทดลอง มากกว่ากำกับวิธีเดียว",
        environments: ["เปลี่ยนแปลงเร็วแต่เป้าหมายชัด", "พื้นที่เสนอและทดสอบไอเดีย", "ทีมที่คุยตรงและไม่ยึดสถานะ"],
        roleExamples: ["innovation strategy", "product discovery", "creative technology", "new venture experiments"],
      },
      stress: {
        signals: ["เปิดประเด็นเพิ่มเมื่อควรตัดสินใจ", "ใช้การถกเถียงกลบความไม่แน่ใจ", "สลับงานถี่จนไม่มีเรื่องใดเดินหน้า"],
        recoveryPractices: ["เขียน commitment สามข้อที่ไม่เพิ่ม scope", "เคลื่อนไหวร่างกายแล้วกลับมาปิดงานหนึ่งชิ้น", "ขอ feedback จากคนที่ช่วยแยกไอเดียดีออกจากไอเดียใหม่"],
      },
      movieProfileLens: { title: "เกมความคิดที่พลิกกติกา", body: "อาจชอบเรื่องที่มีบทสนทนาคม การหักมุมจากกฎเดิม และตัวละครที่เอาตัวรอดด้วยการคิดทางเลือกใหม่" },
    },
    en: {
      identitySentence: "A possibility experimenter whose questions often reveal options the existing system could not see.",
      introduction: [
        "ENTPs often gain energy from exploring alternatives, testing arguments, and connecting ideas from distant corners. They can restore movement to a problem that has begun to feel closed.",
        "Questioning does not always mean opposition. Their influence becomes more durable when they select which idea deserves pursuit and remain accountable through the less novel work of completion.",
      ],
      strengths: [
        ["Option creation", "Sees multiple paths when a group is trapped inside the current frame.", "For example, proposing an alternate business model when the primary plan hits a constraint."],
        ["Live ideation", "Uses conversation to develop and test ideas quickly with other people.", "For example, facilitating a room toward assumptions the team had not named."],
        ["Gap detection", "Quickly catches inconsistencies in a proposal, rule, or model.", "For example, finding an edge case before full system investment."],
        ["Uncertainty agility", "Stays mobile when information or conditions change.", "For example, revising a prototype mid-test without losing the central objective."],
      ],
      growthEdges: [
        ["Choose the bet", "Keeping every option alive can fragment resources.", "Rank ideas and stop at least one item when starting another."],
        ["Notice debate impact", "A challenge offered for stimulation can consume unnecessary energy for others.", "State the intent and ask consent before entering debate mode."],
        ["Stay for the finish", "Interest may fall after the problem stops feeling novel.", "Break polish work into short checkpoints with shared ownership."],
      ],
      decisionStyle: "Often generates and stress-tests alternatives first. Explicit selection criteria and a closing time keep novelty from becoming the hidden decision maker.",
      communicationStyle: "Fast, energetic, and hypothesis-rich. Separating a real proposal from a thought experiment helps other people respond accurately.",
      relationships: "Often connects through humor, idea exchange, and new experiences. Trust grows when commitments are revisited after the initial excitement has passed.",
      work: {
        individual: "Often excels in zero-to-one work, ambiguous problem solving, and tasks that permit several frames to be tested.",
        teamwork: "Adds energy and options while needing to help close the decision log and assign ownership after brainstorming.",
        leadership: "Tends to lead through vision, questions, and permission to experiment more than one prescribed method.",
        environments: ["fast change with clear outcomes", "room to propose and test ideas", "direct low-status discussion"],
        roleExamples: ["innovation strategy", "product discovery", "creative technology", "new venture experiments"],
      },
      stress: {
        signals: ["opening more questions when a decision is due", "using debate to cover uncertainty", "switching tasks so often that none advances"],
        recoveryPractices: ["write three commitments that add no scope", "move physically and return to finish one item", "ask someone trusted to separate a good idea from merely a new one"],
      },
      movieProfileLens: { title: "A mind game that rewrites the rules", body: "May enjoy sharp dialogue, reversals built from old rules, and characters who survive by inventing another option." },
    },
  },
  {
    code: "INFJ",
    relatedCodes: ["INFP", "ENFJ", "INTJ"],
    th: {
      identitySentence: "นักออกแบบความหมายที่มักเชื่อมภาพอนาคตกับความเข้าใจคนอย่างละเอียดอ่อน",
      introduction: [
        "INFJ มักอ่านทั้งสิ่งที่คนพูดและแบบแผนที่อยู่ใต้คำพูด พวกเขาสนใจว่าประสบการณ์หนึ่งมีความหมายอย่างไร และจะเปลี่ยนความเข้าใจนั้นเป็นทิศทางที่ดีต่อผู้เกี่ยวข้องได้อย่างไร",
        "ความลึกและความใส่ใจอาจทำให้รับเรื่องของคนอื่นเข้ามามากเกินไป ขอบเขตที่ชัดและการตรวจสมมติฐานกับความจริงช่วยให้วิสัยทัศน์ยังอ่อนโยนโดยไม่แบกทุกอย่างไว้คนเดียว",
      ],
      strengths: [
        ["อ่านความหมายใต้ผิว", "สังเกตแรงจูงใจและความเชื่อมโยงที่ไม่ได้พูดตรง ๆ", "เช่น เห็นว่าความขัดแย้งเรื่องงานจริง ๆ มาจากคุณค่าที่ต่างกัน"],
        ["สร้างวิสัยทัศน์เพื่อคน", "เชื่อมภาพอนาคตกับผลกระทบต่อชีวิตจริง", "เช่น ออกแบบบริการจากเรื่องราวและความต้องการลึกของผู้ใช้"],
        ["สื่อสารอย่างมีเจตนา", "เลือกภาษาและจังหวะเพื่อให้สารสำคัญเข้าถึงคน", "เช่น เขียน narrative ที่รวมทีมรอบเป้าหมายร่วม"],
        ["ยืนกับคุณค่าระยะยาว", "รักษาทิศทางเมื่อแรงกดระยะสั้นชวนให้หลุดจากหลัก", "เช่น ปฏิเสธวิธีโตที่ทำลายความไว้ใจของชุมชน"],
      ],
      growthEdges: [
        ["ตรวจการตีความ", "การอ่านคนเก่งอาจทำให้มั่นใจในสิ่งที่ยังไม่ได้ถาม", "แยก observation จาก interpretation แล้วตรวจตรงกับเจ้าตัว"],
        ["ตั้งขอบเขตก่อนล้า", "การตอบสนองความต้องการทุกคนอาจสะสมจนถอนตัวทันที", "กำหนดเวลาและขอบเขตการช่วยเหลือล่วงหน้า"],
        ["ส่งงานก่อนสมบูรณ์ทางความหมาย", "การรอให้ทุกส่วนสอดคล้องอาจชะลอ feedback", "ปล่อย draft ที่บอกชัดว่าอยากเรียนรู้อะไร"],
      ],
      decisionStyle: "มักชั่งภาพระยะยาว คุณค่าภายใน และผลต่อคน ก่อนรวมเป็นทิศทางเดียว การใช้ข้อมูลที่สังเกตได้ช่วยไม่ให้ intuition ทำงานลำพัง",
      communicationStyle: "มักฟังลึกและสื่อสารเป็นชั้น เหมาะกับบทสนทนาที่มีบริบทและความไว้ใจ แต่ควรพูดข้อจำกัดหรือความไม่เห็นด้วยก่อนมันสะสม",
      relationships: "มักต้องการความสัมพันธ์ที่จริงใจ มีความหมาย และเคารพโลกภายใน สามารถเข้าใจคนอื่นมากจนลืมบอกความต้องการของตน การสื่อสารตรงอย่างอ่อนโยนช่วยรักษาสมดุล",
      work: {
        individual: "เด่นกับงานที่ต้องสังเคราะห์ข้อมูลคน ความหมาย และภาพระยะยาวในพื้นที่คิดที่สงบ",
        teamwork: "ช่วยอ่านบรรยากาศและเชื่อมมุมมอง แต่ไม่ควรถูกคาดหวังให้เป็นผู้ดูแลอารมณ์ของทุกคน",
        leadership: "มักนำด้วย purpose ความสอดคล้อง และการพัฒนาคนเป็นรายบุคคล",
        environments: ["งานมีความหมายต่อผู้ใช้", "พื้นที่คิดและสนทนาลึก", "วัฒนธรรมเคารพขอบเขต"],
        roleExamples: ["experience research", "learning design", "purpose strategy", "facilitation"],
      },
      stress: {
        signals: ["รับผิดชอบความรู้สึกของทุกคน", "ถอนตัวโดยไม่อธิบายหลังสะสมความล้า", "หมกกับภาพลบหนึ่งแบบจนไม่เห็นหลักฐานอื่น"],
        recoveryPractices: ["แยกสิ่งที่รับผิดชอบออกจากสิ่งที่เพียงรับรู้", "กลับสู่กิจวัตรทางกายและพื้นที่เงียบ", "ตรวจเรื่องเล่าในหัวกับคนที่ไว้ใจ"],
      },
      movieProfileLens: { title: "เรื่องเล่าที่เผยชั้นความหมาย", body: "อาจชอบภาพยนตร์ที่ใช้สัญลักษณ์ ความสัมพันธ์ และการตัดสินใจเงียบ ๆ เพื่อเปลี่ยนความหมายของเหตุการณ์ทั้งเรื่อง" },
    },
    en: {
      identitySentence: "A meaning designer who often connects a future vision with careful insight into people.",
      introduction: [
        "INFJs often attend to both what people say and the patterns beneath the words. They want to understand what an experience means and how that understanding could become a constructive direction for those involved.",
        "Depth and care can also pull too much of other people's experience inward. Clear boundaries and reality checks help the vision stay compassionate without requiring one person to carry everything.",
      ],
      strengths: [
        ["Meaning beneath the surface", "Notices motives and connections that have not been stated directly.", "For example, seeing that a work conflict is rooted in different values."],
        ["Human-centered vision", "Connects a future picture to its effects on lived experience.", "For example, designing a service from users' deeper needs and stories."],
        ["Intentional communication", "Chooses language and timing that help an important message land.", "For example, writing a narrative that aligns a team around shared purpose."],
        ["Long-term values", "Protects direction when short-term pressure invites a compromise of principle.", "For example, rejecting growth that would erode community trust."],
      ],
      growthEdges: [
        ["Verify interpretation", "Strong people-reading can create confidence in something that was never asked.", "Separate observation from interpretation and check it directly."],
        ["Set boundaries before fatigue", "Meeting every need can accumulate until withdrawal feels necessary.", "Define the time and limits of support in advance."],
        ["Share before perfect coherence", "Waiting for every meaning to align can delay useful feedback.", "Release a draft with the learning question made explicit."],
      ],
      decisionStyle: "Often combines long-range implications, inner values, and human effects into one direction. Observable evidence keeps intuition from working alone.",
      communicationStyle: "Usually listens deeply and communicates in layers. Context and trust help, while naming limits or disagreement early prevents silent accumulation.",
      relationships: "Often seeks sincerity, meaning, and respect for inner life. Understanding others can become easier than stating personal needs, so gentle directness supports balance.",
      work: {
        individual: "Often excels at synthesizing human information, meaning, and future direction in a calm thinking space.",
        teamwork: "Can read atmosphere and connect perspectives without becoming responsible for everyone's emotional state.",
        leadership: "Tends to lead through purpose, coherence, and individual development.",
        environments: ["meaningful user impact", "space for deep thought and dialogue", "cultures that respect boundaries"],
        roleExamples: ["experience research", "learning design", "purpose strategy", "facilitation"],
      },
      stress: {
        signals: ["assuming responsibility for everyone's feelings", "withdrawing without explanation after prolonged strain", "fixating on one negative future and filtering out other evidence"],
        recoveryPractices: ["separate responsibility from awareness", "return to physical routines and quiet space", "reality-check the internal story with someone trusted"],
      },
      movieProfileLens: { title: "Stories that reveal layers of meaning", body: "May enjoy films that use symbols, relationships, and quiet decisions to transform the meaning of the whole story." },
    },
  },
  {
    code: "INFP",
    relatedCodes: ["INFJ", "ENFP", "ISFP"],
    th: {
      identitySentence: "นักสำรวจคุณค่าภายในที่มักมองหาวิธีทำให้โลกภายนอกซื่อตรงกับสิ่งที่มีความหมาย",
      introduction: [
        "INFP มักรับรู้ความละเอียดของความรู้สึก คุณค่า และความเป็นไปได้ในตัวคน พวกเขาสนใจความจริงแท้มากกว่าภาพที่ดูถูกต้องจากภายนอก และมักสร้างพื้นที่ให้เรื่องราวที่ยังไม่มีเสียง",
        "โลกภายในที่กว้างอาจทำให้การเลือกหนึ่งทางรู้สึกเหมือนสูญเสียอีกหลายทาง การแปลงคุณค่าเป็นการกระทำเล็กที่สม่ำเสมอช่วยให้ความตั้งใจไม่คงอยู่เพียงในจินตนาการ",
      ],
      strengths: [
        ["รักษาความจริงแท้", "จับได้เมื่อการกระทำไม่สอดคล้องกับคุณค่าที่ประกาศ", "เช่น ชวนทีมทบทวนว่าประสบการณ์ผู้ใช้ตรงกับคำสัญญาของแบรนด์หรือไม่"],
        ["จินตนาการเชิงมนุษย์", "มองเห็นโลกผ่านความเป็นไปได้และประสบการณ์ของคนหลากหลาย", "เช่น สร้างตัวละครหรือ scenario ที่ทำให้ปัญหานามธรรมมีชีวิต"],
        ["รับฟังโดยไม่รีบตัดสิน", "ให้พื้นที่คนค่อย ๆ พบคำของตนเอง", "เช่น ช่วยเพื่อนร่วมทีมเล่าโจทย์จนเห็นสิ่งที่สำคัญจริง"],
        ["ยืดหยุ่นต่อความแตกต่าง", "เปิดรับเส้นทางชีวิตและวิธีคิดที่ไม่เหมือนตน", "เช่น ปรับกระบวนการให้คนหลายสไตล์มีส่วนร่วมได้"],
      ],
      growthEdges: [
        ["ทำคุณค่าให้เป็นพฤติกรรม", "ความตั้งใจที่ลึกอาจยังไม่มีรูปแบบให้ทำซ้ำ", "เลือก action เล็กหนึ่งอย่างพร้อมเวลาและตัววัดง่าย ๆ"],
        ["แยก feedback จากตัวตน", "คำวิจารณ์งานอาจกระทบความรู้สึกถึงคุณค่าของตน", "เขียนก่อนว่า feedback กล่าวถึงชิ้นงานส่วนใด ไม่ได้กล่าวถึงอะไร"],
        ["ตัดสินใจแม้ไม่มีทางสมบูรณ์", "การเห็นคุณค่าหลายด้านทำให้เลือกยาก", "กำหนดคุณค่าหลักของรอบนี้และยอมรับ trade-off ที่เหลือ"],
      ],
      decisionStyle: "มักเริ่มจากสิ่งที่สอดคล้องกับคุณค่าภายในและผลต่อความจริงแท้ของคน การเพิ่มข้อจำกัดด้านเวลาและทรัพยากรทำให้การเลือกลงสู่การปฏิบัติ",
      communicationStyle: "มักสื่อสารอย่างใคร่ครวญ อ่อนโยน และผ่านเรื่องเล่าหรือภาพเปรียบเทียบ ต้องการเวลารวบรวมคำเมื่อบทสนทนามีแรงกดสูง",
      relationships: "มักให้ความสำคัญกับการยอมรับตัวตน ความลึก และอิสระทางอารมณ์ อาจหลีกเลี่ยงความขัดแย้งเพื่อรักษาความสัมพันธ์ แต่การพูดความไม่สบายใจเร็วช่วยป้องกันระยะห่าง",
      work: {
        individual: "เด่นกับงานสร้างสรรค์ งานความหมาย และโจทย์ที่ให้ตัดสินใจตามคุณค่าโดยมี autonomy",
        teamwork: "นำ empathy และมุมมองของเสียงที่ถูกมองข้ามมาให้ทีม พร้อมต้องการกระบวนการตัดสินใจที่ไม่เร่งรัดเกินไป",
        leadership: "มักนำด้วยความจริงใจ การฟัง และการเชื่อมงานกับคุณค่าร่วม",
        environments: ["เคารพความเป็นตัวเอง", "งานเชื่อมกับคุณค่าชัด", "feedback สุภาพและเฉพาะเจาะจง"],
        roleExamples: ["editorial storytelling", "community research", "creative practice", "values-led design"],
      },
      stress: {
        signals: ["ถอยเข้าโลกความคิดและเลื่อน action", "ตีความ feedback เป็นการปฏิเสธตัวตน", "พยายามจัดทุกอย่างแข็งเกินธรรมชาติเพื่อชดเชยความไม่แน่นอน"],
        recoveryPractices: ["ทำสิ่งเล็กที่สอดคล้องกับคุณค่าหนึ่งอย่าง", "เขียนความรู้สึกโดยไม่ต้องแก้ทันที", "คุยกับคนที่รับฟังได้โดยไม่รีบกำหนดคำตอบ"],
      },
      movieProfileLens: { title: "โลกภายในที่มีเสียงของตน", body: "อาจชอบเรื่องที่ให้พื้นที่ความรู้สึก ความหวัง และตัวละครซึ่งค่อย ๆ เลือกว่าจะซื่อตรงกับตัวเองอย่างไร" },
    },
    en: {
      identitySentence: "An inner-values explorer who often looks for ways to make outward life more honest to what matters.",
      introduction: [
        "INFPs often notice subtle feeling, personal values, and unrealized possibility in people. They tend to care more about authenticity than an appearance of correctness and may create room for stories that have not been heard.",
        "A wide inner world can make choosing one path feel like losing several others. Converting a value into a small repeated action helps intention become more than imagination.",
      ],
      strengths: [
        ["Authenticity sensing", "Notices when behavior and stated values no longer align.", "For example, asking whether the user experience matches the brand's promise."],
        ["Human imagination", "Sees possibility through varied inner experiences and points of view.", "For example, creating a character or scenario that makes an abstract issue tangible."],
        ["Nonjudgmental listening", "Gives people room to discover their own language.", "For example, listening until a teammate can name the issue that matters most."],
        ["Openness to difference", "Makes room for life paths and thinking styles unlike their own.", "For example, adapting a process so several participation styles can contribute."],
      ],
      growthEdges: [
        ["Turn values into behavior", "A deep intention may still lack a repeatable form.", "Choose one small action with a time and a simple measure."],
        ["Separate feedback from identity", "Critique of work can feel like a statement about personal worth.", "Write what part of the artifact the feedback addresses and what it does not."],
        ["Choose without a perfect path", "Seeing value on many sides can make commitment difficult.", "Name the primary value for this cycle and accept the remaining trade-off."],
      ],
      decisionStyle: "Often begins with alignment to inner values and human authenticity. Time and resource constraints help translate that choice into action.",
      communicationStyle: "Usually reflective, gentle, and comfortable with story or metaphor. High-pressure conversation may require time to gather accurate words.",
      relationships: "Often values acceptance, depth, and emotional freedom. Avoiding conflict may preserve calm temporarily, while naming discomfort early can prevent distance.",
      work: {
        individual: "Often thrives in creative or meaning-led work with autonomy to make value-based choices.",
        teamwork: "Brings empathy and overlooked voices while benefiting from decision processes that allow reflection.",
        leadership: "Tends to lead through sincerity, listening, and connection to shared values.",
        environments: ["respect for individuality", "clear connection to values", "kind and specific feedback"],
        roleExamples: ["editorial storytelling", "community research", "creative practice", "values-led design"],
      },
      stress: {
        signals: ["retreating into thought and postponing action", "reading feedback as rejection of identity", "imposing unusually rigid order to compensate for uncertainty"],
        recoveryPractices: ["complete one small value-aligned action", "write feelings without immediately solving them", "speak with someone who can listen without forcing an answer"],
      },
      movieProfileLens: { title: "An inner world with its own voice", body: "May enjoy stories that give room to feeling, hope, and characters gradually choosing how to remain true to themselves." },
    },
  },
  {
    code: "ENFJ",
    relatedCodes: ["INFJ", "ENFP", "ESFJ"],
    th: {
      identitySentence: "ผู้สร้างพลังร่วมที่มักมองเห็นศักยภาพของคนและชวนให้มันเติบโตเป็นรูปธรรม",
      introduction: [
        "ENFJ มักอ่านบรรยากาศและเข้าใจว่าคำพูดแบบใดจะช่วยให้คนขยับไปด้วยกัน พวกเขาสนใจทั้งผลลัพธ์และการเติบโตของผู้คนระหว่างทาง",
        "ความสามารถในการดูแลภาพรวมทางอารมณ์อาจกลายเป็นแรงกดให้ต้องทำให้ทุกคนพอใจ การยอมให้ผู้อื่นรับผิดชอบความรู้สึกและการตัดสินใจของตนเองช่วยให้การสนับสนุนยั่งยืนขึ้น",
      ],
      strengths: [
        ["มองศักยภาพคน", "เห็นความสามารถที่ยังไม่ถูกใช้และสื่อสารให้เจ้าตัวเชื่อมถึงมัน", "เช่น มอบหมาย stretch role พร้อม support ที่เหมาะสม"],
        ["สร้าง alignment", "เชื่อมเป้าหมายกลุ่มกับแรงจูงใจของผู้เกี่ยวข้อง", "เช่น ปรับข้อความเปลี่ยนแปลงให้แต่ละทีมเห็นบทบาทของตน"],
        ["อ่านจังหวะห้อง", "สังเกตพลัง ความเงียบ และความไม่สบายใจได้ไว", "เช่น หยุด agenda เพื่อเปิดพื้นที่ให้ข้อกังวลที่ยังไม่ถูกพูด"],
        ["สื่อสารเพื่อการเคลื่อนไหว", "ทำให้ภาพอนาคตรู้สึกทั้งมีความหมายและลงมือได้", "เช่น ปิด workshop ด้วย commitment ที่เจ้าของเลือกเอง"],
      ],
      growthEdges: [
        ["ไม่รับบทเจ้าของทุกความรู้สึก", "การพยายามรักษาพลังบวกอาจบดบังความจริงที่จำเป็น", "ให้คนพูดความไม่สบายใจโดยไม่รีบปรับอารมณ์ห้อง"],
        ["แยกการช่วยจากการควบคุม", "ความหวังดีอาจกลายเป็นการกำหนดเส้นทางให้คนอื่น", "ถามว่าเขาต้องการ support แบบใดก่อนเสนอแผน"],
        ["รักษาพื้นที่ของตน", "ตารางที่เต็มด้วยความต้องการของคนอื่นทำให้สัญญาณล้าถูกมองข้าม", "จองเวลาพักและคิดก่อนรับ commitment ใหม่"],
      ],
      decisionStyle: "มักพิจารณาทิศทางร่วม ผลต่อคน และแรงสนับสนุนที่ต้องสร้าง ควรแยก consensus ที่แท้จริงออกจากการที่คนไม่กล้าขัด",
      communicationStyle: "อบอุ่น ชัด และปรับภาษาตามผู้ฟังได้ดี การบอกความต้องการส่วนตัวและข้อจำกัดตรง ๆ ช่วยให้การสื่อสารไม่กลายเป็นการดูแลฝ่ายเดียว",
      relationships: "มักลงทุนกับการเติบโตและความเป็นอยู่ของคนใกล้ตัว ต้องการความร่วมมือที่เปิดเผย การให้พื้นที่อีกฝ่ายแก้ปัญหาของตนเองช่วยรักษาความเท่าเทียม",
      work: {
        individual: "เด่นกับงานวาง narrative พัฒนาคน และเชื่อม stakeholder โดยยังต้องมีเวลาส่วนตัวเพื่อประมวลผล",
        teamwork: "สร้างความไว้ใจและความชัดร่วมได้ดี แต่ไม่ควรเป็นคนเดียวที่รับผิดชอบ cohesion",
        leadership: "มักนำด้วยวิสัยทัศน์ การสื่อสาร และการทำให้คนเห็นการเติบโตของตนในเป้าหมายร่วม",
        environments: ["งานมีผลต่อคนชัด", "วัฒนธรรม feedback และพัฒนา", "ทีมที่แบ่งความรับผิดชอบทางอารมณ์"],
        roleExamples: ["people development", "community leadership", "learning programs", "brand communication"],
      },
      stress: {
        signals: ["ตรวจอารมณ์คนอื่นตลอดจนลืมตนเอง", "รับปากมากเพื่อหลีกเลี่ยงความผิดหวัง", "ตีความความไม่เห็นด้วยว่าเป็นความล้มเหลวของความสัมพันธ์"],
        recoveryPractices: ["ปิดช่วงรับ input และกลับมารับรู้ร่างกาย", "เขียนสิ่งที่เป็นความต้องการของตนโดยไม่อ้างคนอื่น", "มอบคืนความรับผิดชอบที่ไม่ใช่ของตนอย่างสุภาพ"],
      },
      movieProfileLens: { title: "การเติบโตที่เปลี่ยนทั้งกลุ่ม", body: "อาจชอบเรื่องที่ตัวละครสร้างความหวัง เชื่อมผู้คน และต้องเรียนรู้ขอบเขตระหว่างการช่วยกับการแบกชีวิตคนอื่น" },
    },
    en: {
      identitySentence: "A collective-energy builder who often sees potential in people and helps make growth visible.",
      introduction: [
        "ENFJs often read a room and sense which message could help people move together. They tend to care about both the result and the development of those involved along the way.",
        "The ability to hold an emotional overview can become pressure to keep everyone satisfied. Allowing other people to own their feelings and choices makes support more sustainable.",
      ],
      strengths: [
        ["Potential spotting", "Sees underused capability and helps a person connect with it.", "For example, offering a stretch role with the right support."],
        ["Alignment building", "Connects a group objective to the motives of its stakeholders.", "For example, framing a change so each team understands its contribution."],
        ["Room awareness", "Quickly notices energy, silence, and unspoken discomfort.", "For example, pausing an agenda to invite a concern that has not surfaced."],
        ["Mobilizing communication", "Makes a future feel meaningful and actionable at the same time.", "For example, ending a workshop with commitments selected by their owners."],
      ],
      growthEdges: [
        ["Do not own every feeling", "Protecting positive energy can hide a truth the group needs.", "Let discomfort be voiced without immediately repairing the mood."],
        ["Separate help from control", "Good intentions can become a plan imposed on another person.", "Ask what kind of support is wanted before offering a path."],
        ["Protect personal space", "A schedule full of other people's needs can conceal fatigue.", "Reserve rest and thinking time before accepting new commitments."],
      ],
      decisionStyle: "Often considers shared direction, human impact, and the support required to move. It helps to distinguish genuine consensus from silence around disagreement.",
      communicationStyle: "Usually warm, clear, and adaptive to the audience. Naming personal needs and limits keeps communication from becoming one-way care.",
      relationships: "Often invests in the growth and well-being of close people and values open cooperation. Letting others solve their own problems supports equality.",
      work: {
        individual: "Often excels in narrative, development, and stakeholder work while still needing private processing time.",
        teamwork: "Builds trust and shared clarity without needing to become the only owner of cohesion.",
        leadership: "Tends to lead through vision, communication, and helping people see their growth inside a shared goal.",
        environments: ["visible human impact", "feedback and development cultures", "shared emotional responsibility"],
        roleExamples: ["people development", "community leadership", "learning programs", "brand communication"],
      },
      stress: {
        signals: ["monitoring others until personal needs disappear", "overcommitting to avoid disappointing people", "reading disagreement as relationship failure"],
        recoveryPractices: ["close the input window and return attention to the body", "write personal needs without referencing anyone else", "return responsibility that does not belong to you"],
      },
      movieProfileLens: { title: "Growth that changes the group", body: "May enjoy stories where a character builds hope, connects people, and learns the boundary between helping and carrying other lives." },
    },
  },
  {
    code: "ENFP",
    relatedCodes: ["INFP", "ENTP", "ENFJ"],
    th: {
      identitySentence: "ผู้จุดประกายความเป็นไปได้ที่มักเชื่อมคน ไอเดีย และความหมายให้เกิดการเริ่มต้นใหม่",
      introduction: [
        "ENFP มักมองเห็นศักยภาพที่ยังไม่ถูกเรียกใช้ในสถานการณ์และผู้คน พลังของพวกเขาเกิดจากการค้นพบ เชื่อมโยง และชวนให้คนลองทางที่มีชีวิตกว่าเดิม",
        "ความเป็นไปได้จำนวนมากอาจแย่งพลังกันเอง การเลือกสิ่งที่สอดคล้องกับคุณค่าจริงและสร้างระบบเล็ก ๆ สำหรับช่วงทำซ้ำช่วยให้ประกายกลายเป็นผลที่ต่อเนื่อง",
      ],
      strengths: [
        ["จุดประกายโอกาส", "ทำให้คนเห็นทางเลือกและพลังที่ก่อนหน้านี้มองไม่เห็น", "เช่น reframing ปัญหาทีมให้กลายเป็น prototype ที่ลองได้"],
        ["เชื่อมคนและไอเดีย", "มองเห็นว่าใครหรือความรู้ใดควรมาเจอกัน", "เช่น แนะนำสองทีมให้สร้างโครงการที่ไม่มีฝ่ายใดทำได้ลำพัง"],
        ["สื่อสารอย่างมีชีวิต", "ส่งต่อความหมายด้วยเรื่องเล่าและอารมณ์ที่เข้าถึงง่าย", "เช่น ทำให้ strategy ที่นามธรรมกลายเป็นภาพที่คนอยากมีส่วนร่วม"],
        ["ปรับตามมนุษย์", "อ่านความสนใจและเปลี่ยนวิธีเข้าหาโดยไม่ทิ้งเจตนาหลัก", "เช่น ปรับ workshop สดเมื่อเห็นว่ากลุ่มต้องการพื้นที่ทดลองมากกว่า lecture"],
      ],
      growthEdges: [
        ["เลือกก่อนพลังแตก", "การตอบรับทุกโอกาสทำให้สิ่งสำคัญไม่ได้รับความลึก", "ใช้เกณฑ์คุณค่าและ capacity ก่อนพูด yes"],
        ["สร้างจังหวะทำซ้ำ", "งาน routine อาจรู้สึกตัดพลังหลังช่วงเริ่มต้น", "จับคู่ routine กับเวลาสั้น เครื่องมือมองเห็น progress หรือ partner"],
        ["อยู่กับความไม่สบายใจ", "การมองด้านบวกเร็วเกินไปอาจข้ามความรู้สึกจริง", "สะท้อนสิ่งที่ยากก่อนเสนอความเป็นไปได้ใหม่"],
      ],
      decisionStyle: "มักสำรวจว่าทางเลือกใดมีชีวิตและสอดคล้องกับคุณค่า ก่อนเลือกจากพลัง ความหมาย และผลต่อคน การตรวจ capacity ช่วยให้คำตอบยั่งยืน",
      communicationStyle: "อบอุ่น เชื่อมโยงเร็ว และคิดออกเสียงผ่านเรื่องราว ควรสรุป commitment เป็นลายลักษณ์อักษรเพื่อแยกไอเดียที่น่าตื่นเต้นจากสิ่งที่ตกลงทำจริง",
      relationships: "มักนำความสนใจ ความสนุก และการยอมรับตัวตนมาสู่ความสัมพันธ์ ต้องการทั้งความใกล้ชิดและอิสระ การรักษาคำมั่นเล็ก ๆ ช่วยสร้างความมั่นคง",
      work: {
        individual: "เด่นกับ ideation การเล่าเรื่อง และงานที่เชื่อมกับผู้คนหรือ purpose โดยมีความหลากหลายพอเหมาะ",
        teamwork: "เพิ่มพลังและมุมมองข้ามขอบเขต พร้อมต้องมีระบบส่งต่อจาก brainstorm ไปสู่ execution",
        leadership: "มักนำด้วยแรงบันดาลใจ ความไว้ใจ และการเปิดพื้นที่ให้แต่ละคนใช้จุดแข็ง",
        environments: ["งานหลากหลายแต่มี purpose", "พื้นที่ทดลองและพบผู้คน", "โครงสร้างเบาที่ช่วยปิดงาน"],
        roleExamples: ["creative strategy", "community building", "campaign concepts", "product discovery"],
      },
      stress: {
        signals: ["กระโดดหาเรื่องใหม่เพื่อหนีข้อจำกัด", "รับ feedback ทุกชิ้นเข้ามาเป็นความสงสัยตน", "พยายามควบคุมรายละเอียดเล็กแบบไม่เป็นธรรมชาติ"],
        recoveryPractices: ["ลดรายการเหลือสิ่งที่มีความหมายสูงสุดหนึ่งเรื่อง", "กลับไปหาคนและกิจกรรมที่ไม่ต้องแสดงผลงาน", "สร้าง next step เล็กที่ปิดได้ภายในวัน"],
      },
      movieProfileLens: { title: "การเดินทางที่เปิดโลกอีกแบบ", body: "อาจชอบเรื่องที่เต็มด้วยตัวละครมีชีวิต ทางเลือกใหม่ และการค้นพบว่าความหวังต้องจับคู่กับความรับผิดชอบอย่างไร" },
    },
    en: {
      identitySentence: "A possibility catalyst who often connects people, ideas, and meaning into a fresh beginning.",
      introduction: [
        "ENFPs often see unused potential in situations and people. Their energy comes from discovery, connection, and inviting others toward a more alive option.",
        "Many possibilities can compete for the same energy. Choosing what genuinely aligns with values and building a small system for repetition helps a spark become a durable result.",
      ],
      strengths: [
        ["Opportunity ignition", "Helps people see options and energy that were previously hidden.", "For example, reframing a team problem into a prototype that can be tried."],
        ["People-idea connection", "Notices which people or knowledge should meet.", "For example, connecting two teams around work neither could create alone."],
        ["Alive communication", "Carries meaning through accessible story and emotion.", "For example, turning abstract strategy into a picture people want to join."],
        ["Human adaptability", "Reads interest and changes the approach without losing the central intent.", "For example, adapting a workshop when the group needs experimentation rather than a lecture."],
      ],
      growthEdges: [
        ["Choose before energy fragments", "Saying yes to every opportunity denies depth to the important ones.", "Check values and capacity before committing."],
        ["Build a repetition rhythm", "Routine can feel draining after the beginning is over.", "Pair routine with a short time box, visible progress, or a partner."],
        ["Stay with discomfort", "Fast optimism can pass over a real feeling.", "Reflect what is difficult before offering another possibility."],
      ],
      decisionStyle: "Often explores which option feels alive and value-aligned, then weighs meaning and human impact. A capacity check makes the answer more sustainable.",
      communicationStyle: "Usually warm, quickly connective, and comfortable thinking through stories. Written commitments separate exciting ideas from actual agreements.",
      relationships: "Often brings interest, play, and acceptance into relationships while needing both closeness and freedom. Keeping small promises adds stability.",
      work: {
        individual: "Often thrives in ideation, storytelling, and people- or purpose-connected work with healthy variety.",
        teamwork: "Adds energy and cross-boundary perspective while needing a handoff from brainstorm into execution.",
        leadership: "Tends to lead with inspiration, trust, and room for each person to use distinct strengths.",
        environments: ["varied work with purpose", "experimentation and human contact", "light structure that supports completion"],
        roleExamples: ["creative strategy", "community building", "campaign concepts", "product discovery"],
      },
      stress: {
        signals: ["jumping to novelty to escape constraints", "turning every feedback point into self-doubt", "controlling small details in an uncharacteristic way"],
        recoveryPractices: ["reduce the list to one most meaningful item", "return to people and activities that require no performance", "define a small next step that can close today"],
      },
      movieProfileLens: { title: "A journey that opens another world", body: "May enjoy lively characters, fresh possibilities, and discoveries about how hope must meet responsibility." },
    },
  },
  {
    code: "ISTJ",
    relatedCodes: ["ISFJ", "ESTJ", "ISTP"],
    th: {
      identitySentence: "ผู้รักษาความต่อเนื่องที่มักเปลี่ยนความรับผิดชอบให้เป็นระบบซึ่งคนอื่นพึ่งพาได้",
      introduction: [
        "ISTJ มักเริ่มจากข้อเท็จจริง หน้าที่ และมาตรฐานที่พิสูจน์แล้ว พวกเขาสร้างความมั่นคงด้วยการจำรายละเอียด รักษาข้อตกลง และทำให้กระบวนการคาดการณ์ได้",
        "ความน่าเชื่อถือไม่ได้แปลว่าต้องรักษาวิธีเดิมทุกครั้ง เมื่อเป้าหมายหรือหลักฐานเปลี่ยน การแยกหลักการสำคัญออกจากขั้นตอนที่แก้ได้ช่วยให้ ISTJ ปรับตัวโดยไม่เสียคุณภาพ",
      ],
      strengths: [
        ["รักษาความน่าเชื่อถือ", "ทำตามข้อตกลงและติดตามรายละเอียดจนวงงานปิด", "เช่น ตรวจ handoff ครบก่อนส่งระบบให้ทีมปฏิบัติการ"],
        ["สร้างมาตรฐานใช้งานได้", "แปลงประสบการณ์เป็นขั้นตอนที่ทำซ้ำและตรวจสอบได้", "เช่น ทำ checklist จาก incident เพื่อป้องกันข้อผิดพลาดเดิม"],
        ["จำบริบทสำคัญ", "เก็บประวัติและข้อยกเว้นที่ช่วยให้ตัดสินใจแม่นขึ้น", "เช่น ชี้ว่าข้อเสนอใหม่เคยติดข้อจำกัดใดมาก่อน"],
        ["ทำงานอย่างมีวินัย", "รักษาคุณภาพแม้งานไม่ใหม่หรือไม่ได้รับความสนใจ", "เช่น ดูแลข้อมูลหลักให้ถูกต้องต่อเนื่องหลายรอบ"],
      ],
      growthEdges: [
        ["ทบทวนว่ากฎยังรับใช้เป้าหมายหรือไม่", "ขั้นตอนที่เคยดีอาจกลายเป็นภาระเมื่อบริบทเปลี่ยน", "กำหนดวัน review และเหตุผลที่แต่ละ control ยังจำเป็น"],
        ["ส่งสัญญาณก่อนรับเกิน", "ความรับผิดชอบสูงอาจทำให้รับงานเงียบ ๆ จนล้า", "บอก capacity และ trade-off ก่อนตอบรับงานเพิ่ม"],
        ["ทดลองแบบมีขอบเขต", "ความเสี่ยงที่มองเห็นชัดอาจบดบังโอกาสเรียนรู้", "ทำ pilot เล็กที่มี rollback และเกณฑ์หยุด"],
      ],
      decisionStyle: "มักใช้หลักฐานที่ผ่านมา ความเสี่ยง และหน้าที่ที่ต้องรักษา การเพิ่มข้อมูลอนาคตและต้นทุนของการไม่เปลี่ยนช่วยให้การตัดสินใจครบขึ้น",
      communicationStyle: "ชัด เป็นลำดับ และให้รายละเอียดที่ตรวจสอบได้ มักต้องการให้การเปลี่ยนแปลงระบุเหตุผล owner และผลต่อขั้นตอนเดิม",
      relationships: "มักแสดงความใส่ใจผ่านความสม่ำเสมอ การช่วยเหลือจริง และการจำสิ่งสำคัญ อาจไม่ใช้คำอารมณ์มาก แต่การบอกความรู้สึกตรง ๆ ช่วยให้อีกฝ่ายไม่ต้องเดา",
      work: {
        individual: "เด่นกับงานที่ต้องการความถูกต้อง ความต่อเนื่อง และ ownership ชัดเจน",
        teamwork: "ทำให้คำมั่นและรายละเอียดไม่หลุด พร้อมควรได้รับข้อมูลการเปลี่ยนแปลงเร็วพอให้ปรับแผน",
        leadership: "มักนำด้วยความสม่ำเสมอ มาตรฐาน และการทำให้ความคาดหวังยุติธรรม",
        environments: ["ความรับผิดชอบชัด", "มาตรฐานมีเหตุผล", "การเปลี่ยนแปลงมีข้อมูลและแผน"],
        roleExamples: ["quality operations", "compliance coordination", "delivery planning", "records stewardship"],
      },
      stress: {
        signals: ["ตรวจซ้ำมากจนงานช้า", "ยึดขั้นตอนเมื่อเป้าหมายเปลี่ยนแล้ว", "คาดการณ์เหตุเสียหายหลายทางพร้อมกัน"],
        recoveryPractices: ["แยกข้อเท็จจริงปัจจุบันจากความเสี่ยงสมมติ", "จัดงานให้เหลือสามลำดับที่ควบคุมได้", "พักจากหน้าที่ผ่านกิจวัตรเรียบง่ายที่คุ้นเคย"],
      },
      movieProfileLens: { title: "รายละเอียดที่ทำให้ความจริงเปิดเผย", body: "อาจชอบเรื่องที่เบาะแสมีน้ำหนัก การกระทำมีผลตามมา และตัวละครพิสูจน์ตัวเองผ่านความสม่ำเสมอ" },
    },
    en: {
      identitySentence: "A continuity steward who often turns responsibility into systems other people can rely on.",
      introduction: [
        "ISTJs often begin with facts, duties, and standards that have been tested. They create stability by remembering detail, honoring agreements, and making processes predictable.",
        "Reliability does not require preserving every old method. When goals or evidence change, separating the essential principle from the editable procedure supports adaptation without losing quality.",
      ],
      strengths: [
        ["Operational reliability", "Follows agreements and details until the work loop is closed.", "For example, checking a handoff fully before operations takes ownership."],
        ["Usable standards", "Turns experience into repeatable and auditable steps.", "For example, creating an incident checklist that prevents the same failure."],
        ["Context memory", "Retains history and exceptions that improve present decisions.", "For example, identifying a constraint that blocked an earlier version of a proposal."],
        ["Disciplined execution", "Maintains quality when work is repetitive or receives little attention.", "For example, preserving the accuracy of core data over many cycles."],
      ],
      growthEdges: [
        ["Review whether a rule still serves", "A formerly useful procedure can become burden after context changes.", "Set a review date and document why each control remains necessary."],
        ["Signal before overload", "High responsibility can lead to silently absorbing too much work.", "State capacity and trade-offs before accepting more."],
        ["Use bounded experiments", "Visible risk can hide a useful learning opportunity.", "Run a small pilot with rollback and stopping criteria."],
      ],
      decisionStyle: "Often weighs prior evidence, risk, and duties that must be protected. Future data and the cost of not changing make the decision more complete.",
      communicationStyle: "Usually sequential, precise, and evidence-based. Changes are easier to absorb when rationale, ownership, and process effects are explicit.",
      relationships: "Often expresses care through consistency, practical help, and remembering what matters. Naming feelings directly keeps others from having to infer them.",
      work: {
        individual: "Often excels where accuracy, continuity, and clear ownership matter.",
        teamwork: "Protects commitments and details while needing early information when plans change.",
        leadership: "Tends to lead through consistency, standards, and fair expectations.",
        environments: ["clear accountability", "standards with rationale", "evidence-led change plans"],
        roleExamples: ["quality operations", "compliance coordination", "delivery planning", "records stewardship"],
      },
      stress: {
        signals: ["rechecking until progress slows", "holding procedure after the objective changes", "forecasting many failure paths at once"],
        recoveryPractices: ["separate present facts from hypothetical risk", "reduce work to three controllable priorities", "rest through a simple familiar routine"],
      },
      movieProfileLens: { title: "Details that reveal the truth", body: "May enjoy stories where clues carry weight, actions have consequences, and characters prove themselves through consistency." },
    },
  },
  {
    code: "ISFJ",
    relatedCodes: ["ISTJ", "ESFJ", "ISFP"],
    th: {
      identitySentence: "ผู้ดูแลความมั่นคงที่มักเปลี่ยนการสังเกตรายละเอียดเป็นความช่วยเหลือซึ่งตรงกับชีวิตจริง",
      introduction: [
        "ISFJ มักจำสิ่งที่ทำให้ผู้คนรู้สึกปลอดภัยและเห็นรายละเอียดที่คนอื่นอาจผ่านไป พวกเขาสร้างความไว้ใจด้วยความสม่ำเสมอ การเตรียมพร้อม และการดูแลที่ลงมือได้จริง",
        "การใส่ใจความต้องการรอบตัวอาจทำให้ความต้องการของตนถูกเลื่อนไปเสมอ การบอกขอบเขตก่อนหมดแรงและยอมให้คนอื่นช่วยกลับทำให้ความสัมพันธ์แข็งแรงกว่าเดิม",
      ],
      strengths: [
        ["สังเกตความต้องการจริง", "จับรายละเอียดเล็กที่มีผลต่อความสบายหรือการใช้งาน", "เช่น ปรับ onboarding จากจุดที่ผู้ใช้ใหม่ลังเลซ้ำ ๆ"],
        ["ดูแลอย่างต่อเนื่อง", "รักษาความใส่ใจหลังช่วงเริ่มต้นผ่านไป", "เช่น ตามผลกับสมาชิกใหม่จนมั่นใจว่าเข้าถึงทรัพยากรได้"],
        ["เก็บบริบทของคน", "จำความชอบ ประวัติ และข้อจำกัดที่ทำให้การช่วยเหลือเฉพาะเจาะจง", "เช่น เตรียมรูปแบบประชุมให้เหมาะกับข้อจำกัดของผู้ร่วมทีม"],
        ["ป้องกันช่องว่าง", "เห็นงานสนับสนุนที่ไม่มีใครเป็นเจ้าของก่อนเกิดปัญหา", "เช่น เติมขั้นตอนตรวจข้อมูลก่อนวันส่งมอบ"],
      ],
      growthEdges: [
        ["ขอแทนการรอให้คนเห็น", "ความต้องการส่วนตัวอาจถูกซ่อนจนกลายเป็นความน้อยใจ", "พูดคำขอที่เฉพาะเจาะจงพร้อมเวลา"],
        ["แยกความช่วยเหลือจากหน้าที่ถาวร", "สิ่งที่ทำครั้งเดียวอาจกลายเป็นความคาดหวังเงียบ", "ตกลง owner และระยะเวลาทุกครั้งที่รับงานเสริม"],
        ["ยอมให้วิธีใหม่พิสูจน์ตัว", "ความคุ้นเคยให้ความปลอดภัยแต่บางครั้งรักษางานเกินจำเป็น", "ทดลองวิธีใหม่ในขอบเขตเล็กและเทียบผลจริง"],
      ],
      decisionStyle: "มักชั่งผลกระทบต่อผู้คน ประสบการณ์ที่ผ่านมา และสิ่งที่ต้องรักษา การรวมความต้องการของตนเองเป็นข้อมูลหนึ่งช่วยให้คำตอบสมดุล",
      communicationStyle: "สุภาพ ละเอียด และมักสื่อผ่านข้อเท็จจริงกับการช่วยเหลือ อาจต้องตั้งใจพูด disagreement ให้ตรงก่อนจะตอบรับเพื่อรักษาความกลมกลืน",
      relationships: "มักสร้างความผูกพันผ่านความสม่ำเสมอ ความทรงจำร่วม และการดูแลในรายละเอียด ต้องการการเห็นคุณค่าและความมั่นใจว่าความช่วยเหลือไม่ถูกถือเป็นเรื่องอัตโนมัติ",
      work: {
        individual: "เด่นกับงานดูแลคุณภาพ ประสบการณ์ และรายละเอียดที่เชื่อมกับผู้ใช้จริง",
        teamwork: "ช่วยให้ทีมรู้สึกได้รับการรองรับและไม่ลืมผลกระทบเล็ก ๆ แต่ควรแบ่งงาน invisible work ให้ชัด",
        leadership: "มักนำด้วยการรับฟัง ความพร้อม และมาตรฐานที่ปกป้องคน",
        environments: ["ทีมไว้ใจกัน", "งานบริการมี feedback จริง", "เห็นคุณค่างานสนับสนุน"],
        roleExamples: ["service operations", "customer enablement", "care coordination", "quality support"],
      },
      stress: {
        signals: ["ตอบ yes อัตโนมัติทั้งที่ไม่มีแรง", "วนคิดถึงคำวิจารณ์หรือความผิดพลาดเก่า", "กังวลกับอนาคตหลายแบบโดยไม่มีข้อมูล"],
        recoveryPractices: ["หยุดรับ commitment ชั่วคราว", "กลับสู่งานหรือสถานที่คุ้นเคยที่ควบคุมได้", "ขอความช่วยเหลือหนึ่งเรื่องโดยไม่อธิบายเกินจำเป็น"],
      },
      movieProfileLens: { title: "ความกล้าหาญในสิ่งเล็กที่ต่อเนื่อง", body: "อาจชอบเรื่องที่ความสัมพันธ์เติบโตจากการดูแล รายละเอียดธรรมดากลายเป็นจุดสำคัญ และความภักดีถูกทดสอบอย่างมีน้ำหนัก" },
    },
    en: {
      identitySentence: "A stability caretaker who often turns close observation into support that fits real life.",
      introduction: [
        "ISFJs often remember what helps people feel secure and notice details others pass over. They build trust through consistency, preparation, and practical care.",
        "Attending to surrounding needs can repeatedly postpone personal needs. Naming limits before exhaustion and allowing care to flow back can make relationships more durable.",
      ],
      strengths: [
        ["Practical need awareness", "Catches small details that shape comfort or usability.", "For example, improving onboarding around moments where new users repeatedly hesitate."],
        ["Continuing care", "Maintains attention after the excitement of a beginning has passed.", "For example, following up until a new member can access needed resources."],
        ["Human context memory", "Remembers preferences, history, and constraints that make support specific.", "For example, preparing a meeting format around a teammate's access needs."],
        ["Gap prevention", "Sees unowned support work before it becomes a problem.", "For example, adding a data check before delivery day."],
      ],
      growthEdges: [
        ["Ask instead of waiting to be noticed", "Personal needs can stay hidden until disappointment builds.", "Make a specific request with a time attached."],
        ["Separate help from permanent duty", "A one-time contribution can become a silent expectation.", "Agree on ownership and duration when accepting extra work."],
        ["Let a new method earn trust", "Familiarity creates safety but can preserve unnecessary work.", "Test a new method in a small scope and compare actual results."],
      ],
      decisionStyle: "Often weighs human effects, prior experience, and what must be protected. Counting personal needs as valid data creates a more balanced answer.",
      communicationStyle: "Usually considerate, detailed, and grounded in facts or support. Deliberately naming disagreement before agreeing protects honest harmony.",
      relationships: "Often builds bonds through consistency, shared memory, and detailed care. Recognition matters, as does knowing that support is not treated as automatic.",
      work: {
        individual: "Often excels in quality, experience, and detail work connected to real users.",
        teamwork: "Helps people feel supported and remembers small effects while needing invisible work to be shared explicitly.",
        leadership: "Tends to lead through listening, preparedness, and standards that protect people.",
        environments: ["high-trust teams", "service work with real feedback", "recognition of support labor"],
        roleExamples: ["service operations", "customer enablement", "care coordination", "quality support"],
      },
      stress: {
        signals: ["saying yes automatically without capacity", "replaying criticism or old mistakes", "worrying across many unsupported futures"],
        recoveryPractices: ["pause new commitments temporarily", "return to a familiar controllable task or place", "ask for one piece of help without overexplaining"],
      },
      movieProfileLens: { title: "Courage in small repeated acts", body: "May enjoy stories where care grows relationships, ordinary details become important, and loyalty is tested with real weight." },
    },
  },
  {
    code: "ESTJ",
    relatedCodes: ["ISTJ", "ENTJ", "ESFJ"],
    th: {
      identitySentence: "ผู้จัดระเบียบการลงมือที่มักทำให้ความคาดหวังชัดและทรัพยากรเคลื่อนไปสู่ผลลัพธ์",
      introduction: [
        "ESTJ มักมองเห็นสิ่งที่ต้องทำ ใครควรรับผิดชอบ และมาตรฐานใดจะบอกว่างานเสร็จ พวกเขาสร้างความมั่นใจให้กลุ่มผ่านโครงสร้าง การตัดสินใจ และการติดตามที่มองเห็นได้",
        "วิธีที่พิสูจน์แล้วเป็นฐานที่ดี แต่ไม่ได้ครอบคลุมทุกบริบท การฟังข้อมูลเชิงคุณภาพและเปิดทางให้คนอธิบายข้อจำกัดช่วยให้ประสิทธิภาพไม่กลายเป็นความแข็งตัว",
      ],
      strengths: [
        ["ทำความคาดหวังให้ชัด", "ระบุ owner กำหนดเวลา และเกณฑ์สำเร็จได้ตรง", "เช่น เปลี่ยนการประชุมคลุมเครือเป็น action list ที่ติดตามได้"],
        ["ขับเคลื่อนการส่งมอบ", "รักษาจังหวะและแก้สิ่งติดขัดก่อนกระทบปลายทาง", "เช่น escalate dependency ที่ค้างพร้อมทางเลือกตัดสินใจ"],
        ["ใช้ทรัพยากรอย่างเป็นรูปธรรม", "ชั่ง capacity และข้อจำกัดจากสิ่งที่เกิดขึ้นจริง", "เช่น ปรับแผนตาม workload แทนคำคาดหวังลอย ๆ"],
        ["รักษาความรับผิดชอบ", "ติดตามข้อตกลงอย่างสม่ำเสมอและยุติธรรม", "เช่น review commitment ด้วยเกณฑ์เดียวกันทุกทีม"],
      ],
      growthEdges: [
        ["ถามก่อนกำหนดวิธี", "ความชัดอาจกลายเป็นการปิดความรู้จากผู้ลงมือ", "ขอให้ owner เสนอวิธีและความเสี่ยงก่อนสั่งขั้นตอน"],
        ["นับผลที่วัดยาก", "สิ่งสำคัญบางอย่างยังไม่มี metric ทันที", "เพิ่ม observation และ feedback เชิงคุณภาพในการ review"],
        ["ปรับโทนโดยไม่ลดมาตรฐาน", "ความตรงภายใต้แรงกดอาจถูกได้ยินเป็นการลดคุณค่า", "กล่าวถึงพฤติกรรม ผลกระทบ และคำขอแทนตัดสินตัวคน"],
      ],
      decisionStyle: "มักเลือกจากข้อเท็จจริง ประสิทธิภาพ และความรับผิดชอบที่ชัด การเชิญข้อมูลจากผู้ได้รับผลกระทบก่อนปิดคำตอบช่วยลด blind spot",
      communicationStyle: "ตรง เป็นโครงสร้าง และมุ่ง next step ได้ดี ควรแยกเรื่องเร่งด่วนจริงออกจากความชอบส่วนตัวเรื่องความเร็ว",
      relationships: "มักแสดงความรักผ่านการรับผิดชอบ วางแผน และทำให้ชีวิตเดินได้ การฟังโดยไม่รีบจัดการทำให้อีกฝ่ายรู้สึกว่าอารมณ์มีที่อยู่",
      work: {
        individual: "เด่นกับงานที่มี outcome ชัด ต้องประสานข้อจำกัด และติดตามจนเสร็จ",
        teamwork: "ช่วยสร้าง cadence และ accountability พร้อมต้องเปิดพื้นที่ให้วิธีทำหลากหลาย",
        leadership: "มักนำผ่านมาตรฐาน การตัดสินใจที่ทันเวลา และการทำให้บทบาทไม่คลุมเครือ",
        environments: ["เป้าหมายและสิทธิ์ตัดสินใจชัด", "feedback จากผลจริง", "ทีมรักษาคำมั่น"],
        roleExamples: ["delivery operations", "program coordination", "process improvement", "field management"],
      },
      stress: {
        signals: ["เร่งและสั่งละเอียดขึ้นเรื่อย ๆ", "ตีความความไม่เป็นระเบียบเป็นความไม่รับผิดชอบ", "ทำงานต่อโดยไม่รับรู้ความล้าหรืออารมณ์"],
        recoveryPractices: ["หยุดจัดการคนอื่นแล้วทบทวน priority ของตน", "ทำกิจกรรมที่ไม่มี outcome ให้ควบคุม", "ขอ feedback ว่าโทนและวิธีทำงานส่งผลอย่างไร"],
      },
      movieProfileLens: { title: "ภารกิจที่วัดกันด้วยการลงมือ", body: "อาจชอบเรื่องที่มีเป้าหมายชัด ทีมต้องรักษาหน้าที่ และผลลัพธ์เกิดจากวินัยมากกว่าความบังเอิญ" },
    },
    en: {
      identitySentence: "An execution organizer who often clarifies expectations and moves resources toward a result.",
      introduction: [
        "ESTJs often see what needs to happen, who should own it, and which standard marks completion. They create confidence through visible structure, decisions, and follow-through.",
        "Proven methods are a useful base but do not cover every setting. Listening to qualitative evidence and real constraints keeps efficiency from becoming rigidity.",
      ],
      strengths: [
        ["Expectation clarity", "Defines ownership, timing, and completion criteria directly.", "For example, turning an ambiguous meeting into a trackable action list."],
        ["Delivery momentum", "Maintains pace and addresses blockers before downstream impact.", "For example, escalating a stalled dependency with decision options."],
        ["Concrete resourcing", "Weighs capacity and constraints from observable conditions.", "For example, adjusting a plan to workload rather than wishful expectations."],
        ["Accountability", "Follows agreements consistently and fairly.", "For example, reviewing commitments with the same criteria across teams."],
      ],
      growthEdges: [
        ["Ask before prescribing method", "Clarity can close off knowledge held by the person doing the work.", "Invite the owner to propose method and risk first."],
        ["Count hard-to-measure effects", "Some important outcomes do not have an immediate metric.", "Add observation and qualitative feedback to review."],
        ["Adjust tone without lowering standards", "Directness under pressure can sound like a judgment of worth.", "Name behavior, impact, and request rather than judging the person."],
      ],
      decisionStyle: "Often chooses from facts, efficiency, and clear accountability. Input from affected people before closure reduces blind spots.",
      communicationStyle: "Usually structured, direct, and oriented to next steps. Separating true urgency from a personal preference for speed improves accuracy.",
      relationships: "Often expresses care through responsibility, planning, and practical stability. Listening without immediate organization gives emotion room to exist.",
      work: {
        individual: "Often excels with clear outcomes, coordinated constraints, and ownership through completion.",
        teamwork: "Creates cadence and accountability while needing to permit different working methods.",
        leadership: "Tends to lead through standards, timely decisions, and unambiguous roles.",
        environments: ["clear outcomes and decision rights", "feedback from real results", "teams that honor commitments"],
        roleExamples: ["delivery operations", "program coordination", "process improvement", "field management"],
      },
      stress: {
        signals: ["accelerating and prescribing more detail", "equating disorder with irresponsibility", "continuing work without noticing fatigue or feeling"],
        recoveryPractices: ["stop managing others and review personal priorities", "do an activity with no outcome to control", "ask how tone and process are affecting the group"],
      },
      movieProfileLens: { title: "A mission measured by action", body: "May enjoy stories with clear objectives, teams that must honor their duties, and outcomes earned through discipline rather than chance." },
    },
  },
  {
    code: "ESFJ",
    relatedCodes: ["ISFJ", "ENFJ", "ESTJ"],
    th: {
      identitySentence: "ผู้ประสานความสัมพันธ์ที่มักทำให้กลุ่มรู้สึกได้รับการต้อนรับและพร้อมร่วมมือกัน",
      introduction: [
        "ESFJ มักสังเกตว่าผู้คนต้องการอะไรเพื่อเข้าร่วมอย่างมั่นใจ พวกเขาสร้างพลังร่วมผ่านการสื่อสารที่อบอุ่น ความใส่ใจในรายละเอียด และธรรมเนียมที่ทำให้กลุ่มเชื่อมกัน",
        "การรับรู้ปฏิกิริยาของคนอย่างไวอาจทำให้ feedback กลายเป็นการตัดสินคุณค่าตนเอง การแยกความนิยมออกจากหลักการและรักษาขอบเขตช่วยให้การดูแลมั่นคงขึ้น",
      ],
      strengths: [
        ["สร้างการมีส่วนร่วม", "ทำให้คนเข้าใจว่าตนมีที่และมีบทบาทในกลุ่ม", "เช่น ต้อนรับสมาชิกใหม่พร้อมเชื่อมเขากับคนและข้อมูลที่จำเป็น"],
        ["อ่านความต้องการปัจจุบัน", "เห็นสิ่งที่ต้องจัดการเพื่อให้ประสบการณ์ราบรื่น", "เช่น ปรับ event flow จากปฏิกิริยาหน้างาน"],
        ["รักษาเครือข่าย", "ติดตามความสัมพันธ์และความร่วมมืออย่างต่อเนื่อง", "เช่น กลับไปหาพาร์ตเนอร์หลังงานจบเพื่อรักษาความไว้ใจ"],
        ["ทำคุณค่าให้มองเห็น", "เปลี่ยนคำว่าดูแลหรือร่วมมือเป็นกิจกรรมจริง", "เช่น สร้าง ritual ขอบคุณ contribution ของทีม"],
      ],
      growthEdges: [
        ["ยอมให้ความไม่พอใจมีอยู่", "การรีบคืนความกลมกลืนอาจปิดประเด็นจำเป็น", "ถามว่าความขัดแย้งกำลังปกป้องอะไร"],
        ["ไม่อ่านทุก reaction เป็นคะแนน", "อารมณ์ชั่วคราวของคนอื่นไม่ใช่คำตัดสินตัวตน", "รอข้อมูลหลายจุดก่อนสรุปว่าความสัมพันธ์มีปัญหา"],
        ["ตัดสิ่งที่เกิน capacity", "ความอยากให้ทุกคนได้รับการดูแลอาจสร้างภาระซ่อน", "กำหนดบริการหลักและสิ่งที่ต้องขอคนอื่นช่วย"],
      ],
      decisionStyle: "มักชั่งผลต่อความร่วมมือ ประสบการณ์จริง และสิ่งที่กลุ่มให้คุณค่า การเพิ่มหลักเกณฑ์อิสระจากเสียงตอบรับช่วยให้ตัดสินใจมั่นคง",
      communicationStyle: "เป็นมิตร ชัด และตอบสนองต่อบรรยากาศได้เร็ว มักสื่อสารได้ดีเมื่อ feedback ระบุพฤติกรรมและทางแก้ ไม่ปล่อยให้ต้องเดาจากความเงียบ",
      relationships: "มักลงทุนผ่านเวลา การเฉลิมฉลอง และความช่วยเหลือที่จับต้องได้ ต้องการการตอบรับและความสม่ำเสมอ ขอบเขตช่วยให้การให้ไม่กลายเป็นบัญชีค้างใจ",
      work: {
        individual: "เด่นกับการประสานคน ประสบการณ์ และรายละเอียดบริการที่มี feedback ใกล้ตัว",
        teamwork: "สร้าง connection และ cadence ทางสังคม พร้อมควรแบ่งงานดูแลกลุ่มกับคนอื่น",
        leadership: "มักนำด้วยการเข้าถึงง่าย ความชัดของค่านิยม และการรับรอง contribution",
        environments: ["ร่วมมือและตอบรับกัน", "ผลของงานต่อคนมองเห็นได้", "บทบาทดูแลได้รับการยอมรับ"],
        roleExamples: ["community operations", "partner coordination", "event experience", "customer programs"],
      },
      stress: {
        signals: ["พยายามแก้บรรยากาศทุกจุด", "รับคำวิจารณ์หนึ่งเรื่องเป็นภาพรวมทั้งหมด", "ยุ่งกับรายละเอียดคนอื่นเพื่อหลบความต้องการตน"],
        recoveryPractices: ["หยุดตรวจ reaction และกลับสู่ข้อเท็จจริง", "ใช้เวลากับคนที่ไม่ต้อง perform", "เลือกขอบเขตหนึ่งเรื่องแล้วสื่อสารโดยไม่แก้ตัว"],
      },
      movieProfileLens: { title: "กลุ่มคนที่กลายเป็นบ้าน", body: "อาจชอบเรื่องที่ความอบอุ่น พิธีกรรมร่วม และการเลือกดูแลกันทำให้คนต่างพื้นหลังสร้างชุมชนขึ้นมา" },
    },
    en: {
      identitySentence: "A relationship coordinator who often helps a group feel welcomed and ready to cooperate.",
      introduction: [
        "ESFJs often notice what people need in order to participate with confidence. They build shared energy through warm communication, practical detail, and rituals that connect a group.",
        "Sensitivity to reaction can make feedback feel like a judgment of personal worth. Separating popularity from principle and protecting boundaries makes care more stable.",
      ],
      strengths: [
        ["Participation building", "Helps people understand that they have a place and role in the group.", "For example, welcoming a new member and connecting them to people and information."],
        ["Present need awareness", "Sees what must be handled for an experience to run smoothly.", "For example, adapting an event flow from live participant response."],
        ["Network continuity", "Maintains relationships and cooperation after the immediate task.", "For example, following up with partners to preserve trust."],
        ["Visible values", "Turns care and collaboration into concrete group behavior.", "For example, creating a ritual that recognizes team contributions."],
      ],
      growthEdges: [
        ["Allow dissatisfaction", "Restoring harmony too quickly can close a necessary issue.", "Ask what the conflict may be protecting."],
        ["Do not treat every reaction as a score", "Another person's temporary mood is not a verdict on identity.", "Wait for multiple data points before concluding the relationship is damaged."],
        ["Reduce beyond capacity", "Trying to care for everyone can create hidden load.", "Define the core service and what needs shared help."],
      ],
      decisionStyle: "Often weighs cooperation, lived experience, and group values. Criteria that stand apart from immediate approval make decisions steadier.",
      communicationStyle: "Usually friendly, clear, and responsive to atmosphere. Specific feedback with a repair path works better than silence that must be interpreted.",
      relationships: "Often invests through time, celebration, and practical support. Reciprocity and consistency matter, while boundaries keep giving from becoming a private ledger.",
      work: {
        individual: "Often excels in coordinating people, experience, and service details with nearby feedback.",
        teamwork: "Creates connection and social cadence while needing care work to be shared.",
        leadership: "Tends to lead through accessibility, clear values, and recognition of contribution.",
        environments: ["responsive collaboration", "visible human impact", "recognized care work"],
        roleExamples: ["community operations", "partner coordination", "event experience", "customer programs"],
      },
      stress: {
        signals: ["trying to repair every shift in atmosphere", "turning one criticism into a total judgment", "managing others' details to avoid personal needs"],
        recoveryPractices: ["stop checking reactions and return to facts", "spend time with people who require no performance", "choose one boundary and state it without overjustifying"],
      },
      movieProfileLens: { title: "A group of people becoming home", body: "May enjoy stories where warmth, shared rituals, and chosen care turn different lives into a community." },
    },
  },
  {
    code: "ISTP",
    relatedCodes: ["ESTP", "INTP", "ISTJ"],
    th: {
      identitySentence: "นักแก้ปัญหาเชิงกลไกที่มักเข้าใจสถานการณ์ผ่านการสังเกต ทดลอง และลงมืออย่างแม่นยำ",
      introduction: [
        "ISTP มักสนใจว่าสิ่งหนึ่งทำงานจริงอย่างไรเมื่อเจอกับเงื่อนไขหน้างาน พวกเขาแยกปัญหาเป็นชิ้น จัดการสิ่งที่ควบคุมได้ และปรับตาม feedback โดยไม่ต้องมีพิธีการมาก",
        "ความสงบภายใต้แรงกดช่วยให้แก้เหตุเฉพาะหน้าได้ดี แต่คนอื่นอาจไม่เห็น reasoning ที่เกิดขึ้นภายใน การบอกสถานะ ความเสี่ยง และสิ่งที่ต้องการจากทีมทำให้ autonomy ทำงานร่วมกับความไว้ใจได้",
      ],
      strengths: [
        ["วิเคราะห์จากของจริง", "อ่านกลไกและข้อจำกัดจากสิ่งที่สังเกตหรือทดสอบได้", "เช่น แยก failure ทีละส่วนจนพบ component ต้นเหตุ"],
        ["ตอบสนองหน้างาน", "รักษาความนิ่งและเลือก action ที่เหมาะกับสภาพจริง", "เช่น ลดผลกระทบ incident ก่อนค่อยวิเคราะห์ระยะยาว"],
        ["ใช้เครื่องมือคล่อง", "เรียนรู้ผ่านการจับ ลอง และปรับวิธีให้มีประสิทธิภาพ", "เช่น สร้าง utility เล็กเพื่อตัดงานซ้ำในการตรวจระบบ"],
        ["ตัดความซับซ้อน", "มองหาวิธีตรงที่แก้เหตุแทนเพิ่มขั้นตอน", "เช่น ลบ layer ที่ไม่สร้างค่าออกจาก workflow"],
      ],
      growthEdges: [
        ["ส่งสถานะก่อนหายไปแก้", "การทำงานเงียบอาจทำให้ทีมไม่รู้ว่าความเสี่ยงอยู่ตรงไหน", "บอก hypothesis และเวลาที่จะกลับมา update"],
        ["วางแผนเกินเหตุเฉพาะหน้า", "การแก้วันนี้อาจสร้างหนี้ถ้าไม่บันทึกผลต่อเนื่อง", "เพิ่ม follow-up สำหรับ root cause และ preventive change"],
        ["พูดเรื่องความต้องการตรง ๆ", "การรักษาระยะอาจถูกอ่านว่าไม่สนใจ", "ใช้ประโยคสั้นที่บอกความรู้สึกหรือพื้นที่ที่ต้องการ"],
      ],
      decisionStyle: "มักดูข้อเท็จจริงปัจจุบัน ทดสอบทางเลือกที่ย้อนกลับได้ และเลือก action มีประสิทธิภาพ การระบุผลระยะยาวช่วยไม่ให้คำตอบดีเฉพาะวันนี้",
      communicationStyle: "กระชับ ตรง และชอบข้อมูลที่ใช้แก้ปัญหาได้ มักทำงานร่วมกันดีเมื่อไม่ถูกบังคับให้อธิบายเกินจำเป็นแต่ยังมี checkpoint ชัด",
      relationships: "มักเชื่อมกันผ่านกิจกรรม ความไว้ใจ และการให้พื้นที่ แสดงความใส่ใจด้วยการช่วยแก้หรืออยู่ตรงนั้นจริง การบอกเจตนาช่วยไม่ให้ความเงียบถูกตีความผิด",
      work: {
        individual: "เด่นกับ troubleshooting งานใช้เครื่องมือ และโจทย์ที่ให้ autonomy พร้อม feedback จริง",
        teamwork: "ช่วยทีมยามวิกฤตและตัดสิ่งเกินจำเป็น แต่ต้องมี handoff กับ documentation พอเหมาะ",
        leadership: "มักนำแบบสงบจากความชำนาญและการให้คนแก้ปัญหาใกล้หน้างาน",
        environments: ["อิสระในการลงมือ", "feedback จากระบบจริง", "กฎน้อยแต่ความรับผิดชอบชัด"],
        roleExamples: ["technical troubleshooting", "prototype engineering", "field operations", "process repair"],
      },
      stress: {
        signals: ["ตัดขาดการสื่อสาร", "เสี่ยงหรือเร่ง action เพื่อให้รู้สึกควบคุมได้", "เก็บอารมณ์จนปะทุจากจุดเล็ก"],
        recoveryPractices: ["หยุด input และทำงานกายที่มีขอบเขต", "เขียนสิ่งที่รู้ ไม่รู้ และ action ถัดไป", "ติดต่อคนที่ไว้ใจด้วยข้อความตรงสั้น ๆ"],
      },
      movieProfileLens: { title: "เอาตัวรอดด้วยทักษะและการอ่านสถานการณ์", body: "อาจชอบเรื่องที่ตัวละครใช้ความชำนาญ แก้กลไกตรงหน้า และตัดสินใจจากสิ่งที่เกิดขึ้นจริงมากกว่าคำประกาศใหญ่" },
    },
    en: {
      identitySentence: "A mechanical problem solver who often understands a situation through observation, testing, and precise action.",
      introduction: [
        "ISTPs often want to know how something actually behaves under real conditions. They break a problem into parts, work with what can be controlled, and adjust from feedback without much ceremony.",
        "Calm under pressure supports immediate repair, but other people may not see the reasoning happening inside. Sharing status, risk, and needed support lets autonomy coexist with trust.",
      ],
      strengths: [
        ["Reality-based analysis", "Reads mechanisms and constraints from observable tests.", "For example, isolating a failure component by component."],
        ["Field response", "Stays calm and chooses action suited to current conditions.", "For example, containing incident impact before long-range analysis."],
        ["Tool fluency", "Learns by handling, trying, and refining for efficiency.", "For example, building a small utility to remove repetitive system checks."],
        ["Complexity reduction", "Looks for a direct repair instead of another layer of procedure.", "For example, removing a non-value-adding workflow layer."],
      ],
      growthEdges: [
        ["Share status before disappearing", "Quiet problem solving can hide current risk from the team.", "State the hypothesis and the next update time."],
        ["Plan beyond immediate repair", "Today's fix can create debt without a follow-up.", "Add root-cause and prevention work after containment."],
        ["State needs directly", "Protecting distance can be read as lack of care.", "Use a short sentence naming the feeling or space needed."],
      ],
      decisionStyle: "Often checks present facts, tests reversible options, and chooses efficient action. Naming downstream effects prevents a solution that works only today.",
      communicationStyle: "Usually concise, direct, and interested in actionable information. Clear checkpoints support collaboration without requiring excessive narration.",
      relationships: "Often bonds through shared activity, trust, and room to breathe. Care appears in practical presence or repair, while stated intent prevents silence from being misread.",
      work: {
        individual: "Often excels in troubleshooting, tool work, and autonomous problems with real feedback.",
        teamwork: "Helps during pressure and removes excess while needing enough handoff and documentation.",
        leadership: "Tends to lead calmly through expertise and decisions close to the work.",
        environments: ["freedom to act", "feedback from real systems", "few rules with clear accountability"],
        roleExamples: ["technical troubleshooting", "prototype engineering", "field operations", "process repair"],
      },
      stress: {
        signals: ["cutting off communication", "using risk or speed to regain control", "containing feeling until a small trigger releases it"],
        recoveryPractices: ["reduce input and do bounded physical work", "write what is known, unknown, and next", "send a brief direct message to someone trusted"],
      },
      movieProfileLens: { title: "Survival through skill and situation reading", body: "May enjoy stories where practical mastery, immediate mechanisms, and evidence-based choices matter more than large declarations." },
    },
  },
  {
    code: "ISFP",
    relatedCodes: ["INFP", "ESFP", "ISFJ"],
    th: {
      identitySentence: "นักสร้างประสบการณ์อย่างอ่อนโยนที่มักทำให้คุณค่าภายในมองเห็นได้ผ่านรายละเอียดและการกระทำ",
      introduction: [
        "ISFP มักรับรู้บรรยากาศ ความงาม และผลของสิ่งต่าง ๆ ต่อคนตรงหน้า พวกเขามีแนวโน้มแสดงตัวตนผ่านการเลือกและงานที่จับต้องได้ มากกว่าการประกาศหลักการยาว ๆ",
        "การปรับตามสถานการณ์ทำให้ตอบสนองมนุษย์ได้ดี แต่อาจเลื่อนบทสนทนาที่ยากหรือแผนระยะยาว การสร้างโครงเบาที่เคารพอิสระช่วยปกป้องทั้งคุณค่าและพลังสร้างสรรค์",
      ],
      strengths: [
        ["สัมผัสคุณภาพประสบการณ์", "เห็นว่ารายละเอียด สี จังหวะ หรือท่าทีส่งผลต่อความรู้สึกอย่างไร", "เช่น ปรับหน้าจอให้สงบและเข้าถึงง่ายขึ้นจากการใช้งานจริง"],
        ["ช่วยเหลือตรงจุด", "ตอบสนองสิ่งที่คนต้องการตอนนี้โดยไม่ทำให้เป็นเรื่องใหญ่", "เช่น เข้าไปแก้รายละเอียดหน้างานที่ทำให้ผู้ร่วมงานติดขัด"],
        ["สร้างจากคุณค่าจริง", "ทำงานที่มีน้ำเสียงเป็นตัวเองและไม่ฝืนความรู้สึกสำคัญ", "เช่น เลือก concept ที่ซื่อตรงกับผู้ใช้แทน trend ชั่วคราว"],
        ["ปรับตัวอย่างนุ่มนวล", "เปลี่ยนวิธีตาม feedback โดยไม่สร้างแรงปะทะเกินจำเป็น", "เช่น ปรับกิจกรรมให้เข้ากับพลังของกลุ่มในวันนั้น"],
      ],
      growthEdges: [
        ["พูดก่อนถอย", "ความไม่สบายใจอาจถูกเก็บจนตัดสินใจหายออกจากสถานการณ์", "บอกข้อกังวลหนึ่งประโยคและสิ่งที่ต้องการเปลี่ยน"],
        ["ทำแผนให้เบาแต่มีจริง", "การพึ่งจังหวะปัจจุบันอาจทำให้เป้าหมายไกลไม่ขยับ", "กำหนด milestone เล็กที่ยังเปิดวิธีทำ"],
        ["ไม่รับ feedback เป็นการล้ำคุณค่า", "คำวิจารณ์วิธีทำอาจรู้สึกเหมือนปฏิเสธสิ่งสำคัญภายใน", "ขอ example และแยกเจตนาจากผลที่เกิด"],
      ],
      decisionStyle: "มักเลือกจากสิ่งที่รู้สึกจริง สอดคล้องกับคุณค่า และเหมาะกับคนตรงหน้า การเพิ่มผลระยะยาวกับข้อจำกัดที่มองไม่เห็นช่วยให้ภาพครบ",
      communicationStyle: "นุ่มนวล เป็นธรรมชาติ และสื่อผ่านการกระทำได้มาก มักต้องการพื้นที่ปลอดแรงกดเพื่อพูดเรื่องที่มีความรู้สึกสูง",
      relationships: "มักให้การยอมรับ อิสระ และการอยู่ข้างกันแบบไม่รุกล้ำ ต้องการความจริงใจมากกว่าพิธีการ การบอกความต้องการก่อนถอนตัวช่วยรักษาความใกล้ชิด",
      work: {
        individual: "เด่นกับงาน craft ประสบการณ์ และการปรับรายละเอียดจาก feedback ตรง",
        teamwork: "นำความละเอียดอ่อนและความยืดหยุ่นมาให้ทีม พร้อมต้องมีช่องทางพูดข้อกังวลโดยไม่ถูกเร่ง",
        leadership: "มักนำด้วยตัวอย่าง ความเคารพความเป็นตัวเอง และการปกป้องคุณภาพประสบการณ์",
        environments: ["มี autonomy และคุณค่าชัด", "feedback จากของจริง", "เคารพสไตล์ส่วนบุคคล"],
        roleExamples: ["visual craft", "experience design", "hands-on service", "creative production"],
      },
      stress: {
        signals: ["ถอนตัวจากคนและ decision", "วิจารณ์ตนเองด้วยมาตรฐานแข็ง", "ตอบสนองต่อรายละเอียดรอบตัวไวเกินปกติ"],
        recoveryPractices: ["กลับสู่กิจกรรมประสาทสัมผัสที่สงบ", "ลดความคาดหวังเหลือ action วันนี้", "คุยกับคนที่รับฟังโดยไม่รีบตีความ"],
      },
      movieProfileLens: { title: "ความหมายที่เล่าผ่านภาพและการเลือก", body: "อาจชอบเรื่องที่ใช้อารมณ์ บรรยากาศ และการกระทำเล็ก ๆ แทนคำอธิบายตรง พร้อมให้ตัวละครเลือกความจริงของตน" },
    },
    en: {
      identitySentence: "A gentle experience maker who often gives inner values visible form through detail and action.",
      introduction: [
        "ISFPs often notice atmosphere, beauty, and the immediate human effect of a choice. They tend to express identity through tangible work and decisions more than long declarations of principle.",
        "Situational flexibility supports humane response but can delay difficult conversations or distant plans. Light structure that respects autonomy can protect both values and creative energy.",
      ],
      strengths: [
        ["Experience sensitivity", "Notices how detail, color, pace, or manner changes feeling.", "For example, refining an interface to feel calmer and more accessible in real use."],
        ["Specific practical care", "Responds to what a person needs now without making it performative.", "For example, fixing a field detail that is blocking a colleague."],
        ["Values made tangible", "Creates work with an honest voice rather than forcing an empty trend.", "For example, selecting a concept faithful to users over temporary fashion."],
        ["Gentle adaptation", "Changes approach from feedback without unnecessary friction.", "For example, adapting an activity to the group's actual energy."],
      ],
      growthEdges: [
        ["Speak before withdrawing", "Discomfort can accumulate until leaving feels like the only option.", "Name one concern and the change that would help."],
        ["Use a light but real plan", "Reliance on the present moment can leave distant goals unmoved.", "Set a small milestone while keeping the method open."],
        ["Do not treat feedback as a values invasion", "Critique of method can feel like rejection of something personal.", "Ask for an example and separate intent from impact."],
      ],
      decisionStyle: "Often chooses what feels honest, value-aligned, and suitable for the people present. Downstream effects and hidden constraints complete the view.",
      communicationStyle: "Usually gentle, natural, and expressive through action. Emotionally charged topics benefit from a low-pressure setting.",
      relationships: "Often offers acceptance, freedom, and nonintrusive presence. Sincerity matters more than ceremony, and naming needs before withdrawal protects closeness.",
      work: {
        individual: "Often excels in craft, experience, and detail refinement from direct feedback.",
        teamwork: "Brings sensitivity and flexibility while needing room to voice concerns without pressure.",
        leadership: "Tends to lead by example, respect for individuality, and protection of experience quality.",
        environments: ["autonomy with clear values", "feedback from real use", "respect for individual style"],
        roleExamples: ["visual craft", "experience design", "hands-on service", "creative production"],
      },
      stress: {
        signals: ["withdrawing from people and decisions", "applying rigid criticism to the self", "becoming unusually reactive to surrounding detail"],
        recoveryPractices: ["return to a calming sensory activity", "reduce expectation to one action today", "talk with someone who listens without rushing to interpret"],
      },
      movieProfileLens: { title: "Meaning told through image and choice", body: "May enjoy stories where atmosphere, feeling, and small actions carry the message while characters choose their own honest path." },
    },
  },
  {
    code: "ESTP",
    relatedCodes: ["ISTP", "ESFP", "ENTP"],
    th: {
      identitySentence: "นักปฏิบัติการตามจังหวะที่มักอ่านสถานการณ์เร็วและเปลี่ยนพลังตรงหน้าให้เป็นการเคลื่อนไหว",
      introduction: [
        "ESTP มักจับสัญญาณจากคน สภาพแวดล้อม และข้อจำกัดปัจจุบันได้ไว พวกเขาชอบเรียนรู้จากการลงสนาม ตัดสินใจจาก feedback และทำให้เรื่องที่ค้างเริ่มเคลื่อน",
        "ความเร็วและความกล้าเปิดโอกาสที่การคิดนานอาจพลาด แต่ผลระยะยาวไม่ได้ส่งสัญญาณดังเสมอ การกำหนด guardrail และจังหวะทบทวนทำให้การเสี่ยงเป็นการทดลองมากกว่าการเดิมพันโดยไม่รู้ตัว",
      ],
      strengths: [
        ["อ่านเกมปัจจุบัน", "เห็นแรงกด โอกาส และผู้มีอิทธิพลในสถานการณ์จริง", "เช่น ปรับข้อเสนอสดเมื่อเห็นว่าลูกค้าติดเงื่อนไขใด"],
        ["ลงมือภายใต้ความไม่แน่นอน", "เลือก action ที่ให้ข้อมูลเพิ่มแทนรอความชัดทั้งหมด", "เช่น เปิด pilot จำกัดพื้นที่เพื่อทดสอบ demand"],
        ["สร้าง momentum", "ทำให้คนขยับจากการคุยไปสู่การทดลอง", "เช่น ชวนทีมทำ mockup ในห้องแทนถก concept ต่อ"],
        ["แก้ปัญหาเฉพาะหน้า", "ใช้ทรัพยากรที่มีอย่างยืดหยุ่นเมื่อแผนไม่ตรงจริง", "เช่น ออกแบบ workaround ปลอดภัยระหว่างระบบหลักขัดข้อง"],
      ],
      growthEdges: [
        ["นับผลที่มาช้า", "feedback ทันทีอาจทำให้ต้นทุนอนาคตถูกมองข้าม", "เพิ่ม checkpoint หลัง action และ owner สำหรับผลต่อเนื่อง"],
        ["เว้นจังหวะก่อนเพิ่มความเสี่ยง", "ความตื่นตัวอาจผลักให้ต้องทำให้เข้มขึ้นเรื่อย ๆ", "กำหนดเพดานความเสียหายก่อนเริ่ม"],
        ["อยู่กับบทสนทนาที่ไม่แก้ทันที", "การเปลี่ยนบรรยากาศอาจหลบความรู้สึกสำคัญ", "ฟังและสะท้อนก่อนเสนอ action"],
      ],
      decisionStyle: "มักอ่านสิ่งที่เกิดขึ้นจริง เลือกทางตอบสนองไว และเรียนจากผล การเพิ่ม pre-mortem สั้นกับ limit ที่ย้อนกลับไม่ได้ช่วยรักษาความคล่องตัว",
      communicationStyle: "ตรง มีพลัง และโน้มน้าวผ่านตัวอย่างจริง ชอบบทสนทนาที่ไปสู่ action แต่ควรยืนยันความเข้าใจเมื่อเรื่องมีผลทางอารมณ์หรือระยะยาว",
      relationships: "มักสร้างความใกล้ชิดผ่านประสบการณ์ร่วม อารมณ์ขัน และการอยู่ช่วยตอนเกิดเรื่อง ต้องการอิสระและความตรง การทำตามข้อตกลงหลังเหตุการณ์ผ่านไปสร้างความไว้ใจ",
      work: {
        individual: "เด่นกับสถานการณ์สด การเจรจา และโจทย์ที่ feedback เร็วพร้อมสิทธิ์ตัดสินใจ",
        teamwork: "เติมพลังและความกล้าลอง พร้อมต้องจับคู่กับคนหรือระบบที่ติดตามผลระยะยาว",
        leadership: "มักนำจากแนวหน้า ตัดสินใจตามสถานการณ์ และทำให้ทีมไม่หยุดนิ่งเมื่อแผนพัง",
        environments: ["feedback เร็วและเห็นผล", "อิสระภายใต้ guardrail", "งานเชื่อมกับโลกจริง"],
        roleExamples: ["field execution", "negotiation", "incident response", "growth experiments"],
      },
      stress: {
        signals: ["เพิ่มความเร็วหรือความเสี่ยงเพื่อหนีความกังวล", "เบื่อข้อจำกัดจนละเลยรายละเอียดสำคัญ", "คาดการณ์อนาคตลบรุนแรงแบบไม่คุ้นเคย"],
        recoveryPractices: ["หยุด stimulation และกลับสู่ข้อเท็จจริง", "ทำกิจกรรมทางกายที่ปลอดภัยและมีขอบเขต", "ทบทวนผลระยะยาวกับคนที่คิดต่าง"],
      },
      movieProfileLens: { title: "แรงกดที่บังคับให้เลือกเดี๋ยวนั้น", body: "อาจชอบเรื่องจังหวะเร็ว การเจรจา การไล่ล่า หรือสถานการณ์ที่ทักษะอ่านคนและกล้าลงมือเปลี่ยนผลลัพธ์ทันที" },
    },
    en: {
      identitySentence: "A situational operator who often reads the moment quickly and turns present energy into movement.",
      introduction: [
        "ESTPs often catch signals from people, surroundings, and current constraints quickly. They tend to learn in the field, decide from feedback, and get a stalled situation moving.",
        "Speed and courage reveal opportunities that extended analysis can miss, while long-range costs are not always loud. Guardrails and review points turn risk into an experiment rather than an unnoticed bet.",
      ],
      strengths: [
        ["Current-game reading", "Notices pressure, opportunity, and influence in the real situation.", "For example, adapting a proposal live around the customer's actual constraint."],
        ["Action under uncertainty", "Chooses a step that creates information instead of waiting for full clarity.", "For example, opening a limited pilot to test demand."],
        ["Momentum creation", "Moves a group from discussion into an experiment.", "For example, building a mockup in the room instead of extending concept debate."],
        ["Immediate problem solving", "Uses available resources flexibly when the plan meets reality.", "For example, creating a safe workaround during a primary system outage."],
      ],
      growthEdges: [
        ["Count delayed effects", "Immediate feedback can hide future cost.", "Add a post-action checkpoint and an owner for downstream effects."],
        ["Pause before increasing risk", "Activation can create pressure to keep raising intensity.", "Define the maximum acceptable loss before starting."],
        ["Stay in conversations without an instant fix", "Changing the mood can avoid an important feeling.", "Listen and reflect before proposing action."],
      ],
      decisionStyle: "Often reads current reality, chooses a responsive move, and learns from the result. A short pre-mortem and irreversible limits preserve agility.",
      communicationStyle: "Usually direct, energetic, and persuasive through concrete examples. Confirming understanding matters when emotional or long-range effects are involved.",
      relationships: "Often builds closeness through shared experience, humor, and practical presence in a difficult moment. Following through after the event strengthens trust.",
      work: {
        individual: "Often excels in live situations, negotiation, and fast-feedback problems with decision room.",
        teamwork: "Adds energy and courage to test while benefiting from systems that track downstream results.",
        leadership: "Tends to lead from the front, decide situationally, and keep the team moving when plans break.",
        environments: ["fast visible feedback", "freedom inside guardrails", "work connected to real conditions"],
        roleExamples: ["field execution", "negotiation", "incident response", "growth experiments"],
      },
      stress: {
        signals: ["increasing speed or risk to outrun concern", "ignoring important detail out of constraint fatigue", "forming unusually severe negative future predictions"],
        recoveryPractices: ["reduce stimulation and return to current facts", "use safe bounded physical activity", "review downstream effects with someone who thinks differently"],
      },
      movieProfileLens: { title: "Pressure that demands a choice now", body: "May enjoy fast pacing, negotiation, pursuit, and moments where reading people and acting decisively changes the outcome." },
    },
  },
  {
    code: "ESFP",
    relatedCodes: ["ISFP", "ESTP", "ENFP"],
    th: {
      identitySentence: "ผู้ส่งพลังผ่านประสบการณ์ที่มักทำให้ผู้คนรู้สึกมีชีวิต มีส่วนร่วม และเห็นคุณค่าของช่วงเวลาตรงหน้า",
      introduction: [
        "ESFP มักรับรู้พลังของห้องและตอบสนองต่อผู้คนอย่างเป็นธรรมชาติ พวกเขาสร้างการมีส่วนร่วมด้วยความอบอุ่น ความกล้าแสดงออก และการทำให้ไอเดียกลายเป็นประสบการณ์จริง",
        "การอยู่กับปัจจุบันเป็นจุดแข็ง แต่ภาระที่ยังไม่ส่งเสียงอาจถูกเลื่อนไป การเตรียมโครงง่าย ๆ สำหรับเงิน เวลา และ commitment ช่วยให้ความเป็นอิสระไม่สร้างแรงกดในภายหลัง",
      ],
      strengths: [
        ["ทำให้คนเข้าร่วม", "ลดระยะห่างและชวนให้คนรู้สึกว่าตนมีที่ในเหตุการณ์", "เช่น เปลี่ยน session เงียบให้คนกล้าลองผ่านกิจกรรมที่เข้าถึงง่าย"],
        ["อ่าน feedback สด", "จับสีหน้า พลัง และความสนใจแล้วปรับทันที", "เช่น เปลี่ยนจังหวะนำเสนอเมื่อผู้ฟังเริ่มหลุด"],
        ["ทำไอเดียให้เป็นประสบการณ์", "นำสิ่งนามธรรมมาสู่ภาพ เสียง กิจกรรม หรือการสาธิต", "เช่น สร้าง demo ที่ทำให้ลูกค้ารู้สึกถึงคุณค่าก่อนอ่านรายละเอียด"],
        ["นำความอบอุ่น", "แสดงการยอมรับและความสนใจอย่างเห็นได้ชัด", "เช่น ฉลอง contribution ของคนที่มักอยู่หลังฉาก"],
      ],
      growthEdges: [
        ["วางรางให้อนาคต", "สิ่งเร่งตรงหน้าอาจกินเวลาเรื่องสำคัญแต่ไม่ด่วน", "จองเวลาและทรัพยากรสำหรับ commitment ก่อนเริ่มกิจกรรมใหม่"],
        ["ไม่ใช้พลังบวกกลบเรื่องยาก", "การชวนสนุกอาจทำให้ความเจ็บหรือข้อกังวลไม่มีพื้นที่", "ยืนยันความรู้สึกก่อนเปลี่ยนบรรยากาศ"],
        ["แยกเสียงตอบรับจากคุณค่า", "ปฏิกิริยาของผู้ชมอาจมีอิทธิพลต่อความมั่นใจมากเกินไป", "ประเมินจากเกณฑ์ส่วนตัวและ feedback หลังเวลาผ่านไปด้วย"],
      ],
      decisionStyle: "มักเลือกจากผลต่อประสบการณ์จริง คุณค่าต่อคน และสิ่งที่ทำได้ตอนนี้ การดูต้นทุนอนาคตและ commitment เดิมก่อนตอบ yes ช่วยให้สมดุล",
      communicationStyle: "เปิดเผย มีชีวิต และใช้ตัวอย่างหรือการสาธิตเก่ง มักทำให้เรื่องเข้าถึงง่าย แต่ควรสรุปรายละเอียดสำคัญเป็นลายลักษณ์อักษร",
      relationships: "มักให้เวลา ความสนุก และการสนับสนุนที่มองเห็นได้ ต้องการความจริงใจและการตอบสนอง การมีพื้นที่คุยเรื่องหนักโดยไม่ต้องทำให้ทุกอย่างดีทันทีเพิ่มความลึก",
      work: {
        individual: "เด่นกับงานที่มีผู้คน feedback สด และโอกาสสร้างประสบการณ์ที่จับต้องได้",
        teamwork: "เพิ่มการมีส่วนร่วมและพลัง พร้อมต้องมี partner หรือระบบช่วยติดตามรายละเอียดหลังงาน",
        leadership: "มักนำด้วยการปรากฏตัว ความเข้าถึงง่าย และการทำให้คนเห็นผลของงานตรงหน้า",
        environments: ["มีปฏิสัมพันธ์และ feedback", "เปิดให้สร้างสรรค์หน้างาน", "โครงสร้างสนับสนุนงานหลังฉาก"],
        roleExamples: ["live experience", "customer engagement", "creative performance", "community activation"],
      },
      stress: {
        signals: ["หา stimulation เพิ่มเพื่อหลบความกังวล", "รับ reaction ลบเป็นภาพอนาคตทั้งหมด", "เลื่อนงานหลังฉากจนแรงกดสะสม"],
        recoveryPractices: ["ลดเสียงและกลับสู่ routine ทางกาย", "จัดการ commitment ค้างหนึ่งเรื่องให้เสร็จ", "อยู่กับคนที่ปลอดภัยโดยไม่ต้องสร้างบรรยากาศ"],
      },
      movieProfileLens: { title: "เรื่องที่ต้องรู้สึกไปพร้อมกัน", body: "อาจชอบภาพยนตร์ที่มีพลัง ตัวละครเข้าถึงง่าย ดนตรีหรือภาพโดดเด่น และช่วงเวลาที่ผู้ชมได้หัวเราะหรือลุ้นร่วมกัน" },
    },
    en: {
      identitySentence: "An experience energizer who often helps people feel alive, included, and connected to the present moment.",
      introduction: [
        "ESFPs often sense a room's energy and respond naturally to people. They create participation through warmth, expressive courage, and a talent for turning ideas into lived experience.",
        "Presence is a strength, while obligations that make little noise can be postponed. Simple structure around time, money, and commitments protects future freedom.",
      ],
      strengths: [
        ["Participation energy", "Reduces distance and helps people feel they belong in the moment.", "For example, turning a quiet session into accessible shared activity."],
        ["Live feedback reading", "Catches expression, energy, and interest and adjusts quickly.", "For example, changing presentation pace when attention begins to drop."],
        ["Ideas into experience", "Gives abstract value a visible form through image, sound, activity, or demonstration.", "For example, building a demo that lets customers feel value before reading detail."],
        ["Visible warmth", "Shows acceptance and interest in a way people can perceive.", "For example, recognizing the contribution of someone who usually works backstage."],
      ],
      growthEdges: [
        ["Lay track for the future", "Immediate activity can consume important nonurgent work.", "Reserve time and resources for existing commitments before adding another event."],
        ["Do not cover difficulty with positivity", "Fast energy can leave pain or concern without space.", "Acknowledge the feeling before changing the atmosphere."],
        ["Separate response from worth", "Audience reaction can influence confidence too strongly.", "Use personal criteria and feedback gathered after time has passed."],
      ],
      decisionStyle: "Often chooses from lived impact, human value, and what can be done now. Reviewing future cost and existing commitments before saying yes adds balance.",
      communicationStyle: "Usually open, lively, and skilled with examples or demonstration. Written follow-up helps preserve important detail.",
      relationships: "Often gives time, play, and visible support and values sincere response. Space for serious conversation without instant repair adds depth.",
      work: {
        individual: "Often excels around people, live feedback, and tangible experience creation.",
        teamwork: "Adds participation and energy while benefiting from a partner or system that tracks backstage detail.",
        leadership: "Tends to lead through presence, accessibility, and visible connection to the work's effect.",
        environments: ["interaction and feedback", "room for live creativity", "structure that supports backstage work"],
        roleExamples: ["live experience", "customer engagement", "creative performance", "community activation"],
      },
      stress: {
        signals: ["seeking more stimulation to avoid concern", "turning a negative reaction into a total future story", "postponing backstage tasks until pressure accumulates"],
        recoveryPractices: ["reduce noise and return to a physical routine", "close one outstanding commitment", "spend time with safe people without managing the mood"],
      },
      movieProfileLens: { title: "A story to feel together", body: "May enjoy energetic films, approachable characters, memorable sound or image, and moments an audience can laugh or hold its breath together." },
    },
  },
];

export const mbtiZTypeDetails = DETAIL_SEEDS.map(({ code, relatedCodes, th, en }) => ({
  code,
  routeSlug: code.toLowerCase(),
  relatedCodes,
  locales: {
    th: createLocaleDetail(code, "th", th),
    en: createLocaleDetail(code, "en", en),
  },
}));

export const MBTI_Z_TYPE_ROUTE_SLUGS = mbtiZTypeDetails.map(
  (profile) => profile.routeSlug
);

const DETAIL_BY_CODE = new Map(
  mbtiZTypeDetails.map((profile) => [profile.code, profile])
);
const BASE_BY_CODE = new Map(mbtiZProfiles.map((profile) => [profile.code, profile]));

export function getMbtiZTypeProfile(value) {
  if (typeof value !== "string") return null;

  const code = value.trim().toUpperCase();
  const base = BASE_BY_CODE.get(code);
  const detail = DETAIL_BY_CODE.get(code);

  return base && detail ? { ...base, ...detail } : null;
}

export function getMbtiZTypeStaticPaths() {
  return MBTI_Z_TYPE_ROUTE_SLUGS.map((code) => ({ params: { code } }));
}

export function selectMbtiZTypeLocale(profile, locale) {
  if (!profile || typeof locale !== "string") return null;

  const normalizedLocale = locale.trim().toLowerCase().split("-")[0];
  if (!SUPPORTED_LOCALES.includes(normalizedLocale)) return null;

  const localizedDetail = profile.locales?.[normalizedLocale];
  if (!localizedDetail) return null;

  const isThai = normalizedLocale === "th";
  return {
    ...profile,
    locale: normalizedLocale,
    archetypeName: isThai ? profile.archetypeNameTh : profile.archetypeNameEn,
    houseTitle: isThai ? profile.houseTitleTh : profile.houseTitleEn,
    houseDescription: isThai
      ? profile.houseDescriptionTh
      : profile.houseDescriptionEn,
    animalName: isThai ? profile.animalNameTh : profile.animalNameEn,
    tagline: isThai ? profile.taglineTh : profile.taglineEn,
    summary: isThai ? profile.summaryTh : profile.summaryEn,
    ...localizedDetail,
  };
}
