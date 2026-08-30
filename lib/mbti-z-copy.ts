export type MbtiZLocale = "th" | "en";

export const mbtiZNavCopy = {
  th: {
    home: "หน้าแรก",
    quiz: "แบบทดสอบ",
    types: "16 Types",
    dashboard: "ผลของฉัน",
    myResults: "ผลของฉัน",
    account: "เข้าสู่ระบบ",
    login: "เข้าสู่ระบบ",
    guestMode: "โหมด guest",
    startQuiz: "เริ่มแบบทดสอบ",
    brandTag: "ห้องทดลองบุคลิกแฟนตาซี",
    runtimeHint:
      "Account, cloud save และ social share ยังพักไว้ชั่วคราวระหว่างรอ runtime ใหม่",
    menuLabel: "เปิดเมนูเพิ่มเติม",
    closeMenuLabel: "ปิดเมนูเพิ่มเติม",
    primaryNavigationLabel: "เมนูหลัก",
    secondaryNavigationLabel: "เมนูเพิ่มเติม",
    languageLabel: "ภาษา",
  },
  en: {
    home: "Home",
    quiz: "Quiz",
    types: "16 Types",
    dashboard: "My Results",
    myResults: "My Results",
    account: "Log in",
    login: "Log in",
    guestMode: "Guest Mode",
    startQuiz: "Start Quiz",
    brandTag: "fantasy personality lab",
    runtimeHint:
      "Account, cloud save, and social sharing remain temporarily offline while the new runtime is being rebuilt.",
    menuLabel: "Open more menu",
    closeMenuLabel: "Close more menu",
    primaryNavigationLabel: "Primary navigation",
    secondaryNavigationLabel: "More navigation",
    languageLabel: "Language",
  },
} as const;

export const mbtiZHomeCopy = {
  th: {
    pageTitle: "MBTI Z | อ่านตัวตนให้ลึกกว่า 4 ตัวอักษร",
    metaDescription:
      "แบบทดสอบบุคลิกภาพที่เชื่อม Type, House, สัตว์ประจำตัว และ Movie Profile ไว้ใน Result Artifact เดียว",
    eyebrow: "แบบทดสอบบุคลิกภาพที่อ่านต่อได้จริง",
    status: "เริ่มแบบ guest · TH เป็นค่าเริ่มต้น · 16 types",
    title: "อ่านตัวตนให้ลึกกว่า MBTI 4 ตัวอักษร",
    subtitle:
      "ตอบคำถามตามจังหวะของคุณ แล้วรับผลลัพธ์ที่เชื่อม Type, House, สัตว์ประจำตัว และรสนิยมภาพยนตร์ไว้ในภาพเดียว",
    start: "เริ่มแบบทดสอบ",
    preview: "ดูตัวอย่างผลลัพธ์",
    guestNote: "ไม่ต้องสมัครสมาชิก ผลลัพธ์เก็บไว้ในเครื่องของคุณ",
    constellationLabel: "ตัวอย่างผลลัพธ์จากทั้ง 4 Houses",
    constellationHint: "เลือกตัวแทนเพื่อดูรายละเอียด",
    viewProfile: "อ่านโปรไฟล์",
    outcomeEyebrow: "โครงสร้างผลลัพธ์",
    outcomeTitle: "หนึ่งผลลัพธ์ อ่านได้หลายชั้น",
    outcomeBody:
      "แต่ละชั้นตอบคำถามคนละแบบ ตั้งแต่วิธีคิดไปจนถึงภาพและเรื่องราวที่สะท้อนตัวคุณ",
    outcomes: [
      ["Type", "แกนบุคลิกและวิธีตัดสินใจที่เด่นที่สุด"],
      ["House", "กลุ่มพลังและพื้นที่ที่คุณรู้สึกเป็นตัวเอง"],
      ["Animal", "ภาพแทนตัวตนที่จดจำได้ง่าย"],
      ["Movie Profile", "รสนิยมเรื่องเล่าที่สะท้อนจังหวะอารมณ์"],
      ["PNG", "ภาพผลลัพธ์สำหรับเก็บหรือแบ่งปันต่อ"],
    ],
    houseEyebrow: "4 Houses · 16 Types",
    houseBody: "เลือกแต่ละ House เพื่ออ่านพลังหลักและดูสมาชิกทั้ง 4 Types",
    explore: "สำรวจทั้ง 16 Types",
    howEyebrow: "ลำดับการใช้งาน",
    howTitle: "ตอบ เปิดผลลัพธ์ แล้วเก็บเรื่องราวของคุณไว้",
    howBody: "เส้นทางหลักเริ่มได้ทันทีโดยไม่ต้องสร้างบัญชี",
    steps: [
      ["01", "ตอบตามจังหวะจริง", "เลือกคำตอบแบบ 5 ระดับ แล้วต่อด้วยคำถามเรื่องรสนิยมภาพยนตร์"],
      ["02", "เปิด Result Artifact", "เห็น Type, House, Animal และ Movie Profile ในลำดับที่อ่านง่าย"],
      ["03", "เก็บหรือแบ่งปัน", "กลับมาเปิดผลเดิมได้ และดาวน์โหลดภาพ PNG เมื่อพร้อมแบ่งปัน"],
    ],
    resultsEyebrow: "My Results",
    resultsTitle: "ผลลัพธ์ยังอยู่เมื่อคุณกลับมา",
    resultsBody:
      "MBTI Z เก็บผลล่าสุดและประวัติไว้บนเครื่องนี้ คุณจึงเปิดอ่านหรือดาวน์โหลดซ้ำได้โดยไม่ต้องเข้าสู่ระบบ",
    resultsPoints: ["เปิดผลล่าสุดได้ทันที", "ย้อนดูประวัติในเครื่องนี้", "ดาวน์โหลด PNG จากผลลัพธ์"],
    resultsCta: "เปิดผลของฉัน",
    primaryCta: "เริ่มแบบทดสอบ MBTI Z",
    secondaryCta: "เปิด Dashboard",
    tertiaryCta: "สำรวจ 16 Types",
    heroChips: [
      "คำตอบแบบ 5 ระดับ",
      "Movie Profile",
      "Result Artifact",
      "ดาวน์โหลด PNG 1080x1350",
    ],
    metrics: [
      ["16", "types + สัตว์"],
      ["4", "houses"],
      ["12", "movie prompts"],
      ["1080x1350", "ไฟล์ PNG"],
    ],
    previewEyebrow: "ตัวอย่าง Artifact",
    previewTitle: "หนึ่งผลลัพธ์จะเปิดทั้ง type, house, animal, Movie Profile และสรุปภาษาไทย",
    previewBody:
      "ส่วน hero ไม่ได้ผูกอยู่กับ INTJ ตัวเดียวอีกต่อไป แต่แสดงภาพรวมของระบบทั้งหมดว่าผลลัพธ์สุดท้ายจะมีอะไรบ้างและใช้งานต่อยังไง",
    previewSummaryTitle: "ภาพรวมตัวอย่าง",
    previewItems: [
      "MBTI type + สีประจำ house",
      "สัตว์ประจำตัว",
      "สมดุลแกน",
      "Movie Profile",
      "PNG พร้อมแชร์",
    ],
    featureTitle: "สิ่งที่ผู้ใช้จะได้จาก flow ใหม่",
    featureSubtitle:
      "หน้า home ต้องทำให้เห็นทันทีว่าระบบใหม่นี้เพิ่มอะไรจาก MBTI เดิม และผลลัพธ์นำไปใช้ต่อได้อย่างไร",
    featureCards: [
      {
        title: "คำตอบแบบมีน้ำหนัก",
        body: "ตอบแบบ 5 ระดับแทนการถูกบังคับให้เลือกขั้วเดียวทุกข้อ",
      },
      {
        title: "เอกลักษณ์ประจำ house",
        body: "ผลลัพธ์บอกทั้งบ้าน สีพลังงาน และสัตว์ประจำ type เพื่อให้จดจำง่ายขึ้น",
      },
      {
        title: "Movie Profile",
        body: "หลังแกน MBTI หลัก ระบบจะต่อด้วย prompt เรื่องรสนิยมหนังเพื่อสร้างมุมอ่านเพิ่ม",
      },
      {
        title: "ดาวน์โหลด Result",
        body: "ผลลัพธ์ถูกออกแบบต่อไปถึงภาพ PNG สำหรับเก็บและแชร์ใน social",
      },
    ],
    houseTitle: "สี่พลังที่พาคุณไปเจอ Type ของตัวเอง",
    houseSubtitle:
      "แต่ละ House มีพลังงาน สี และกลุ่มบุคลิกที่ต่างกันชัดเจน เพื่อให้ first viewport ส่งสัญญาณของ product ได้ทันที",
    houseTypeCount: "Types",
    houseCta: "เปิดคลัง 16 types",
    movieTitle: "Movie Profile ที่ช่วยอ่านรสนิยมหนังไปพร้อมกับตัวตน",
    movieSubtitle:
      "โมดูลนี้ทำให้ผลลัพธ์ไม่จบแค่ตัวอักษร 4 ตัว แต่เชื่อมเข้ากับเรื่องเล่า อารมณ์ และรสนิยมการดูหนังของผู้ใช้จริง",
    whyTitle: "ทำไม flow นี้อ่านลึกกว่าเดิม",
    whySubtitle:
      "การ redesign รอบนี้ไม่ได้เปลี่ยนแค่หน้าตา แต่เปลี่ยนวิธีเล่า การจัดลำดับข้อมูล และความชัดของผลลัพธ์ทั้งระบบ",
    whyCards: [
      {
        title: "ตอบอยู่ตรงกลางจริง",
        body: "คำถามหลักต้องให้พื้นที่กับน้ำหนักของคำตอบ ไม่ใช่บีบให้ไปมุมซ้ายหรือขวาทันที",
      },
      {
        title: "อ่าน Result ได้ใน 5-8 วินาที",
        body: "ลำดับข้อมูลจะบอก type, house, animal, Movie Profile และคะแนนที่อ่านออกทันที",
      },
      {
        title: "ทุกหน้าต้อง responsive จริง",
        body: "หน้า home, quiz, result, dashboard และ hold page ต้องทำงานทั้งมือถือและ desktop โดยไม่กินพื้นที่ฟรี",
      },
    ],
    journeyTitle: "ลำดับการใช้งาน",
    journeySubtitle:
      "ทุกหน้าถูกจัดให้เชื่อมต่อกันเป็นลำดับเดียว ตั้งแต่เริ่มตอบ จนเห็น Result และเก็บ Artifact ต่อใน Dashboard",
    journeySteps: [
      {
        label: "01",
        title: "เริ่มแบบ guest",
        body: "เข้าได้ทันทีโดยไม่ต้องติด auth ก่อน",
      },
      {
        label: "02",
        title: "ตอบด้วยสเกลและคำถามหนัง",
        body: "ค่อย ๆ อ่านแกนบุคลิกและรสนิยมการดูหนังในลำดับเดียว",
      },
      {
        label: "03",
        title: "เปิด Result Artifact",
        body: "เปิด type, house, animal, scores และสรุปภาษาไทยแบบพร้อมใช้",
      },
      {
        label: "04",
        title: "เก็บต่อหรือแชร์ต่อ",
        body: "เก็บใน Dashboard ต่อ และดาวน์โหลด PNG สำหรับแชร์ต่อได้",
      },
    ],
    finalTitle: "พร้อมดูเรื่องราวที่ซ่อนอยู่หลัง 4 ตัวอักษรหรือยัง",
    finalBody: "เริ่มแบบทดสอบ แล้วรับ Result Artifact ที่อ่านง่าย เก็บได้ และเป็นของคุณจริง ๆ",
    finalCta: "เข้าแบบทดสอบตอนนี้",
  },
  en: {
    pageTitle: "MBTI Z | Read beyond four personality letters",
    metaDescription:
      "A personality assessment connecting your Type, House, signature animal, and Movie Profile in one Result Artifact.",
    eyebrow: "A personality assessment designed to be read beyond the score",
    status: "guest-first runtime · TH default · 16 types",
    title: "Read yourself beyond four MBTI letters",
    subtitle:
      "Answer at your own pace and receive one result that connects your Type, House, signature animal, and movie taste.",
    start: "Start the assessment",
    preview: "View a sample result",
    guestNote: "No account required. Your result stays on this device.",
    constellationLabel: "A result preview from all four Houses",
    constellationHint: "Select a representative to see more",
    viewProfile: "View profile",
    outcomeEyebrow: "Result Anatomy",
    outcomeTitle: "One result, several ways to read it",
    outcomeBody:
      "Each layer answers a different question, from how you decide to the imagery and stories that feel like you.",
    outcomes: [
      ["Type", "Your strongest personality and decision-making pattern"],
      ["House", "The energy and environment where you feel most like yourself"],
      ["Animal", "A memorable visual signature for your result"],
      ["Movie Profile", "The stories that match your emotional rhythm"],
      ["PNG", "A result image ready to save or share"],
    ],
    houseEyebrow: "4 Houses · 16 Types",
    houseBody: "Select a House to read its core energy and meet all four member Types.",
    explore: "Explore all 16 Types",
    howEyebrow: "How it works",
    howTitle: "Answer, reveal, and keep your story",
    howBody: "The core journey starts immediately, without creating an account.",
    steps: [
      ["01", "Answer with real nuance", "Use a five-level scale, followed by prompts about your movie taste."],
      ["02", "Reveal the Result Artifact", "See your Type, House, Animal, and Movie Profile in a clear reading order."],
      ["03", "Keep or share it", "Return to your result later and download a PNG when you are ready to share."],
    ],
    resultsEyebrow: "My Results",
    resultsTitle: "Your results are here when you return",
    resultsBody:
      "MBTI Z keeps your latest result and history on this device, so you can reopen or download them without logging in.",
    resultsPoints: ["Open your latest result", "Review history on this device", "Download a PNG from any result"],
    resultsCta: "Open My Results",
    primaryCta: "Start MBTI Z Quiz",
    secondaryCta: "Open Dashboard",
    tertiaryCta: "Explore 16 Types",
    heroChips: [
      "5-level answer scale",
      "Movie Profile module",
      "Result Artifact",
      "download PNG 1080x1350",
    ],
    metrics: [
      ["16", "types + animals"],
      ["4", "houses"],
      ["12", "movie prompts"],
      ["1080x1350", "share PNG"],
    ],
    previewEyebrow: "Artifact preview",
    previewTitle:
      "Each result unlocks type, house, animal, Movie Profile, and a Thai-first summary.",
    previewBody:
      "The hero is no longer anchored to a single INTJ sample. It now previews the full system and shows what the final artifact actually contains.",
    previewSummaryTitle: "Preview summary",
    previewItems: [
      "MBTI type + house color",
      "animal signature",
      "dimension balance",
      "Movie Profile",
      "share-ready PNG",
    ],
    featureTitle: "What the new flow delivers",
    featureSubtitle:
      "The home page should make the upgraded system legible immediately, including what was added and what the result can do next.",
    featureCards: [
      {
        title: "Weighted answers",
        body: "Users answer on a 5-level scale instead of being forced into a hard binary every time.",
      },
      {
        title: "House identity",
        body: "Results reveal the house, color energy, and signature animal so the outcome is easier to remember.",
      },
      {
        title: "Movie Profile",
        body: "After the core MBTI read, the system layers in movie taste prompts for a richer interpretation.",
      },
      {
        title: "Result download",
        body: "The result surface extends into a PNG card designed for saving and social sharing.",
      },
    ],
    houseTitle: "Four energies that lead you toward your Type",
    houseSubtitle:
      "Each House carries its own energy, palette, and personality group so the product reads immediately in the first viewport.",
    houseTypeCount: "Types",
    houseCta: "Open the 16-type atlas",
    movieTitle: "A Movie Profile layered into the personality read",
    movieSubtitle:
      "This module pushes the outcome beyond four letters by connecting personality with story taste and emotional viewing patterns.",
    whyTitle: "Why this flow reads deeper",
    whySubtitle:
      "This redesign changes more than the visuals. It changes the reading model, the information order, and the clarity of the full outcome.",
    whyCards: [
      {
        title: "Real middle-ground answers",
        body: "Core questions need room for nuance instead of pushing every answer straight to one edge.",
      },
      {
        title: "A result you can read in seconds",
        body: "The final hierarchy reveals type, house, animal, Movie Profile, and score balance in a clear order.",
      },
      {
        title: "Responsive by default",
        body: "Home, quiz, result, dashboard, and hold surfaces must work on phone and desktop without wasting space.",
      },
    ],
    journeyTitle: "Product flow",
    journeySubtitle:
      "Every surface is being reorganized into one connected flow, from answering the quiz to revealing the result and preserving it in the Dashboard.",
    journeySteps: [
      {
        label: "01",
        title: "Start in guest mode",
        body: "Enter immediately without hitting auth first.",
      },
      {
        label: "02",
        title: "Answer with scale + movie prompts",
        body: "Read personality axes and movie taste in one connected journey.",
      },
      {
        label: "03",
        title: "Reveal the Artifact",
        body: "Unlock type, house, animal, scores, and a Thai-first summary.",
      },
      {
        label: "04",
        title: "Save or share",
        body: "Keep it in the Dashboard and download a PNG made for sharing.",
      },
    ],
    finalTitle: "Ready to see the story behind your four letters?",
    finalBody: "Start the assessment and receive a Result Artifact that is clear, memorable, and yours to keep.",
    finalCta: "Enter Quiz now",
  },
} as const;

export const mbtiZHoldCopy = {
  th: {
    pageTitle: "พัก Account ชั่วคราว | MBTI Z",
    metaDescription:
      "พื้นที่ Account ของ MBTI Z ยังพักไว้ชั่วคราว แต่ guest runtime, Result, Dashboard และ reconnect bundle ยังใช้งานได้",
    tag: "พัก Account ชั่วคราว",
    statusChip: "guest-first",
    title: "Account ยังพักไว้ แต่ MBTI Z ใช้งานได้แล้ว",
    body:
      "ตอนนี้ใช้ guest runtime ได้ทันที: เข้า Quiz ดู Result เปิด Dashboard และเก็บ reconnect bundle โดยไม่ต้องรอ auth หรือ database",
    guestPathTitle: "เส้นทางใช้งานตอนนี้",
    guestPathBody:
      "เดิน flow หลักแบบ guest ได้ครบ แล้วค่อยใช้ bundle นี้เชื่อมข้อมูลกลับเมื่อ account runtime พร้อม",
    worksTitle: "ตอนนี้ใช้อะไรได้แล้ว",
    worksShortLabel: "พร้อมใช้",
    worksNow: [
      "เริ่ม Quiz ได้ทันทีโดยไม่ต้อง login",
      "ดู Result Artifact และประวัติล่าสุดใน browser นี้ได้",
      "ใช้ reconnect bundle เป็นสะพานสำหรับย้ายข้อมูลในภายหลังได้",
    ],
    returnsTitle: "อะไรจะกลับมาในเฟสถัดไป",
    returnsLater: [
      "cloud save",
      "social share surfaces",
      "account sync และพื้นที่ profile/community",
    ],
    pausedTitle: "ส่วนที่ยังพักไว้",
    pausedBody:
      "auth, cloud save และ social/community ยังพักไว้ เพื่อให้ flow หลัก, Result และ export เสถียรก่อน",
    runtimeTitle: "ภาพรวม runtime",
    runtimeBody:
      "สถานะนี้แยกสิ่งที่พร้อมใช้จริงออกจากชั้น account/cloud ที่ยังรอ reconnect",
    bundleTitle: "ภาพรวม bundle",
    bundleReadyStatus: "พร้อม",
    bundleIdleStatus: "ยังไม่มี",
    bundleReady:
      "browser นี้มี handoff package พร้อมแล้ว เมื่อ account runtime กลับมา ข้อมูลจะมีฐานสำหรับ reconnect ต่อได้ทันที",
    bundleIdle:
      "ยังไม่มี handoff package เพราะ browser นี้ยังไม่มีผลลัพธ์หรือ session ที่รอเชื่อมกลับ",
    historyLabel: "ประวัติ",
    pendingLabel: "ค้างอยู่",
    primary: "เข้าแบบทดสอบ",
    secondary: "กลับหน้าแรก",
    dashboard: "เปิด Dashboard",
  },
  en: {
    pageTitle: "Account Hold | MBTI Z",
    metaDescription:
      "The MBTI Z account area is still paused, while the guest runtime, Result, Dashboard, and reconnect bundle remain available.",
    tag: "Account Hold",
    statusChip: "guest-first",
    title: "Account is paused, but MBTI Z is usable",
    body:
      "Guest runtime is live now: enter the Quiz, inspect Results, open the Dashboard, and keep a reconnect bundle without waiting for auth or database work.",
    guestPathTitle: "Current path",
    guestPathBody:
      "Use the full guest flow now, then reconnect the saved bundle when the account runtime returns.",
    worksTitle: "What already works now",
    worksShortLabel: "Ready",
    worksNow: [
      "Start the Quiz immediately without login",
      "View the latest Result Artifact and local history in this browser",
      "Use the reconnect bundle as a bridge for later migration",
    ],
    returnsTitle: "What returns in the next phase",
    returnsLater: [
      "cloud save",
      "social share surfaces",
      "account sync plus profile/community surfaces",
    ],
    pausedTitle: "What is still paused",
    pausedBody:
      "Auth, cloud save, and social/community stay offline while the main flow, Result, and export system are stabilized first.",
    runtimeTitle: "Runtime snapshot",
    runtimeBody:
      "This state separates the live guest path from the account/cloud layers waiting for reconnect.",
    bundleTitle: "Bundle snapshot",
    bundleReadyStatus: "Ready",
    bundleIdleStatus: "Idle",
    bundleReady:
      "This browser already has a handoff package. Once the account runtime returns, the data has a structured basis to reconnect immediately.",
    bundleIdle:
      "No handoff package exists yet because this browser does not currently hold a result or pending session.",
    historyLabel: "History",
    pendingLabel: "Pending",
    primary: "Enter Quiz",
    secondary: "Back home",
    dashboard: "Open Dashboard",
  },
} as const;

export type MbtiZRelaunchScenario =
  | "profile"
  | "settings"
  | "community"
  | "share"
  | "verification"
  | "operations";

export type MbtiZRelaunchScenarioCopy = {
  browserTitle: string;
  tag: string;
  headline: string;
  body: string;
  statusLabel: string;
  statusBody: string;
  bullets: Array<{ title: string; body: string }>;
  queueLabel: string;
  queueItems: string[];
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export const mbtiZRelaunchSharedCopy: Record<MbtiZLocale, { modeBadge: string; statusHeading: string }> = {
  th: {
    modeBadge: "Guest Mode Active",
    statusHeading: "Relaunch status",
  },
  en: {
    modeBadge: "Guest Mode Active",
    statusHeading: "Relaunch status",
  },
};

export const mbtiZRelaunchCopy: Record<MbtiZRelaunchScenario, Record<MbtiZLocale, MbtiZRelaunchScenarioCopy>> = {
  profile: {
    th: {
      browserTitle: "Profile Relaunch Queue | MBTI Z",
      tag: "Profile relaunch queue",
      headline: "พื้นที่โปรไฟล์และ public identity กำลังถูกย้ายเข้าสู่ MBTI Z",
      body:
        "เราเก็บ flow หลักให้ทดสอบได้ก่อน แล้วค่อยยก profile, public pages, follower graph และ creator identity กลับมาในชั้น cloud ที่เสถียรกว่าเดิม",
      statusLabel: "Guest-safe now",
      statusBody:
        "ผลลัพธ์ล่าสุดและประวัติของคุณยังเข้าได้จาก dashboard โดยไม่ต้องพึ่ง account runtime",
      bullets: [
        {
          title: "Public persona",
          body: "โปรไฟล์สาธารณะ, username routing และ social edges จะกลับมาพร้อม visual language ใหม่ทั้งชุด",
        },
        {
          title: "Identity first",
          body: "เมื่อระบบ account กลับมา ข้อมูลโปรไฟล์จะถูกผูกกับ result, share card และ premium narrative อย่างเป็นระบบกว่าเดิม",
        },
        {
          title: "No broken forms",
          body: "รอบนี้เราไม่ปล่อยหน้า profile แบบครึ่งใช้ได้ครึ่งพังอีกแล้ว ทุกอย่างที่ยังไม่พร้อมจะถูกประกาศตรง ๆ",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: [
        "/profile",
        "/profile/[username]",
        "/profile/[username]/followers",
        "/profile/[username]/following",
        "/u/[username]",
      ],
      primaryLabel: "Open dashboard",
      primaryHref: "/dashboard",
      secondaryLabel: "Return to assessment",
      secondaryHref: "/quiz",
    },
    en: {
      browserTitle: "Profile Relaunch Queue | MBTI Z",
      tag: "Profile relaunch queue",
      headline: "Profile and public identity surfaces are being migrated into MBTI Z",
      body:
        "The primary assessment journey is live first. Public profiles, follower graphs, and creator identity will return on top of a more stable cloud layer.",
      statusLabel: "Guest-safe now",
      statusBody:
        "Your latest result and recent history are already available in the dashboard without relying on the account runtime.",
      bullets: [
        {
          title: "Public persona",
          body: "Public profiles, username routing, and social edges will return as part of the new visual system.",
        },
        {
          title: "Identity first",
          body: "Once account systems return, profile data will connect cleanly to results, share cards, and premium narrative layers.",
        },
        {
          title: "No broken forms",
          body: "This relaunch avoids half-working profile surfaces. Anything not ready is intentionally held back.",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: [
        "/profile",
        "/profile/[username]",
        "/profile/[username]/followers",
        "/profile/[username]/following",
        "/u/[username]",
      ],
      primaryLabel: "Open dashboard",
      primaryHref: "/dashboard",
      secondaryLabel: "Return to assessment",
      secondaryHref: "/quiz",
    },
  },
  settings: {
    th: {
      browserTitle: "Account Settings Hold | MBTI Z",
      tag: "Account settings relaunch",
      headline: "ระบบตั้งค่า account กำลังถูกสร้างใหม่บน guest-first foundation",
      body:
        "settings, password, onboarding profile และ username setup จะกลับมาหลังจาก cloud persistence และ auth layer ถูกเชื่อมกลับเข้ามาแบบไม่พัง flow หลัก",
      statusLabel: "Current runtime",
      statusBody:
        "ตอนนี้ path ที่ใช้งานได้จริงคือ guest assessment, result และ dashboard ส่วน account module ถูกพักไว้แบบตั้งใจ",
      bullets: [
        {
          title: "Safer rollout",
          body: "เราไม่บังคับผู้ใช้ผ่าน onboarding หรือ password forms ที่ยังผูกกับ infra เก่า",
        },
        {
          title: "Single visual system",
          body: "เมื่อ settings กลับมา ทุกหน้า account จะถูกยกเข้าภาษา MBTI Z เดียวกับ quiz และ result",
        },
        {
          title: "Cloud-first return",
          body: "ขั้นถัดไปคือ reconnect auth + persistence ก่อน แล้วค่อยเปิดให้แก้ข้อมูลถาวรจริง",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: [
        "/settings",
        "/settings/password",
        "/setup-profile",
        "/setup-username",
      ],
      primaryLabel: "Start assessment",
      primaryHref: "/quiz",
      secondaryLabel: "Back to home",
      secondaryHref: "/",
    },
    en: {
      browserTitle: "Account Settings Hold | MBTI Z",
      tag: "Account settings relaunch",
      headline: "Account settings are being rebuilt on top of the guest-first foundation",
      body:
        "Settings, password, onboarding profile, and username setup will return after cloud persistence and the auth layer are reconnected without breaking the main flow.",
      statusLabel: "Current runtime",
      statusBody:
        "The stable path right now is the guest assessment, result, and dashboard flow. Account surfaces are intentionally held back.",
      bullets: [
        {
          title: "Safer rollout",
          body: "Users are no longer pushed into onboarding or password forms that still depend on the old infrastructure.",
        },
        {
          title: "Single visual system",
          body: "When settings return, every account surface will match the MBTI Z language used across quiz and result.",
        },
        {
          title: "Cloud-first return",
          body: "The next step is reconnecting auth and persistence before permanent edits come back.",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: [
        "/settings",
        "/settings/password",
        "/setup-profile",
        "/setup-username",
      ],
      primaryLabel: "Start assessment",
      primaryHref: "/quiz",
      secondaryLabel: "Back to home",
      secondaryHref: "/",
    },
  },
  community: {
    th: {
      browserTitle: "Community Relaunch Queue | MBTI Z",
      tag: "Community surfaces in relaunch",
      headline: "หน้า community, creator cards และ social discovery กำลังถูก refactor ใหม่",
      body:
        "explore, leaderboard, public cards และ creator surfaces เดิมยังผูกกับ data model เก่าเกินไป เราจึงพาออกจากเส้นทางหลักชั่วคราวแล้วจะคืนกลับมาแบบ cyber social layer ที่สะอาดกว่าเดิม",
      statusLabel: "Why this is paused",
      statusBody:
        "community layer ต้องรอ cloud-backed persistence, public profiles และ share pipeline ก่อนถึงจะกลับมาได้แบบคุณภาพจริง",
      bullets: [
        {
          title: "Discovery later",
          body: "ตอนนี้ user ควรโฟกัสที่การทำแบบทดสอบและดูผลลัพธ์ใน runtime ใหม่ก่อน",
        },
        {
          title: "Stronger social layer",
          body: "เมื่อกลับมา explore และ leaderboard จะอิงกับ identity, result artifacts และ moderation ที่ชัดกว่าเดิม",
        },
        {
          title: "Reduced dead ends",
          body: "การพักหน้าเก่าลงช่วยไม่ให้ user หลุดไปเจอ query DB หรือ social actions ที่ยังไม่เสถียร",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: [
        "/explore",
        "/leaderboard",
        "/card/[id]",
        "/card/me",
        "/profile/[username]/cards",
      ],
      primaryLabel: "Open dashboard",
      primaryHref: "/dashboard",
      secondaryLabel: "Retake assessment",
      secondaryHref: "/quiz",
    },
    en: {
      browserTitle: "Community Relaunch Queue | MBTI Z",
      tag: "Community surfaces in relaunch",
      headline: "Community, creator cards, and social discovery are being refactored",
      body:
        "Explore, leaderboard, public cards, and creator surfaces still depend too heavily on the old data model, so they are being taken out of the main journey until the cyber social layer is rebuilt cleanly.",
      statusLabel: "Why this is paused",
      statusBody:
        "The community layer needs cloud-backed persistence, public profiles, and the share pipeline before it can return at the right quality bar.",
      bullets: [
        {
          title: "Discovery later",
          body: "Right now users should stay focused on the new assessment and result flow first.",
        },
        {
          title: "Stronger social layer",
          body: "When it returns, explore and leaderboard will connect to identity, result artifacts, and clearer moderation rules.",
        },
        {
          title: "Reduced dead ends",
          body: "Pausing the old pages avoids pushing users into DB queries or social actions that are still unstable.",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: [
        "/explore",
        "/leaderboard",
        "/card/[id]",
        "/card/me",
        "/profile/[username]/cards",
      ],
      primaryLabel: "Open dashboard",
      primaryHref: "/dashboard",
      secondaryLabel: "Retake assessment",
      secondaryHref: "/quiz",
    },
  },
  share: {
    th: {
      browserTitle: "Share Hold | MBTI Z",
      tag: "Share pipeline on hold",
      headline: "ระบบ share card และ public result preview กำลังรอ cloud relaunch",
      body:
        "หน้าแชร์ผลลัพธ์จะกลับมาเมื่อ persistence, public slug และ premium/share artifacts ถูกเชื่อมเข้ากับ runtime ใหม่แบบครบเส้นทาง",
      statusLabel: "What still works",
      statusBody:
        "คุณยังทำแบบทดสอบ, ดูผลลัพธ์ฟรี และเก็บ history ใน browser นี้ได้ตามปกติ ส่วน share จริงยังถูกพักไว้",
      bullets: [
        {
          title: "No fake sharing",
          body: "เรายังไม่เปิด public share จนกว่าจะมั่นใจว่า slug, access, และ metadata เสถียรจริง",
        },
        {
          title: "Premium preview later",
          body: "share page รอบใหม่จะเล่า MBTI artifact แบบ cinematic และเชื่อมกับ premium tease อย่างเป็นระบบ",
        },
        {
          title: "Login returns with purpose",
          body: "เมื่อ account กลับมา การแชร์จะผูกกับ save history และ identity จริง ไม่ใช่แค่ลิงก์ชั่วคราว",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: ["/share/[slug]", "public share cards", "result preview artifacts"],
      primaryLabel: "See your dashboard",
      primaryHref: "/dashboard",
      secondaryLabel: "Back to assessment",
      secondaryHref: "/quiz",
    },
    en: {
      browserTitle: "Share Hold | MBTI Z",
      tag: "Share pipeline on hold",
      headline: "Share cards and public result previews are waiting for the cloud relaunch",
      body:
        "The sharing layer will return after persistence, public slugs, and premium/share artifacts are fully reconnected to the new runtime.",
      statusLabel: "What still works",
      statusBody:
        "You can still take the assessment, view the free result, and keep local history in this browser. Public sharing remains paused.",
      bullets: [
        {
          title: "No fake sharing",
          body: "Public share pages are not being reopened until slug, access, and metadata behavior are stable.",
        },
        {
          title: "Premium preview later",
          body: "The new share page will present MBTI artifacts more cinematically and connect to a real premium tease.",
        },
        {
          title: "Login returns with purpose",
          body: "When accounts return, sharing will attach to saved history and identity rather than a temporary link.",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: ["/share/[slug]", "public share cards", "result preview artifacts"],
      primaryLabel: "See your dashboard",
      primaryHref: "/dashboard",
      secondaryLabel: "Back to assessment",
      secondaryHref: "/quiz",
    },
  },
  verification: {
    th: {
      browserTitle: "Account Verification Hold | MBTI Z",
      tag: "Verification and recovery hold",
      headline: "email verification และ account recovery กำลังรอ auth relaunch",
      body:
        "ระบบ verify email, password recovery และ onboarding ที่พึ่ง token-based account flow ถูกพักไว้ก่อน เพื่อให้เราแก้ auth stack แบบครบวงจรครั้งเดียว",
      statusLabel: "Guest mode active",
      statusBody:
        "ถ้าจุดประสงค์ของคุณคือทำแบบทดสอบหรือดูผลลัพธ์ ตอนนี้ไม่ต้องรอ account flow แล้ว สามารถใช้ guest runtime ได้ทันที",
      bullets: [
        {
          title: "One clean rebuild",
          body: "แทนที่จะ patch flow เก่าเป็นชิ้น ๆ เรากำลังรอ reconnect auth, persistence และ email flow แบบเป็นระบบเดียว",
        },
        {
          title: "No token dead ends",
          body: "ผู้ใช้จะไม่ถูกพาไปหน้า verify/reset ที่สุดท้ายจบลงด้วย state ที่เชื่อถือไม่ได้",
        },
        {
          title: "Assessment first",
          body: "เป้าหมายตอนนี้คือให้ product core ใช้งานได้ก่อน แล้วค่อยคืน account security surfaces อย่างถูกต้อง",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: ["/verify-email", "email verification", "token-based recovery"],
      primaryLabel: "Go to assessment",
      primaryHref: "/quiz",
      secondaryLabel: "Back to home",
      secondaryHref: "/",
    },
    en: {
      browserTitle: "Account Verification Hold | MBTI Z",
      tag: "Verification and recovery hold",
      headline: "Email verification and account recovery are waiting for the auth relaunch",
      body:
        "Verify email, password recovery, and other token-based onboarding flows are paused so the auth stack can be rebuilt properly in one pass.",
      statusLabel: "Guest mode active",
      statusBody:
        "If your goal is to take the assessment or review a result, you do not need to wait for account flows anymore. The guest runtime is already live.",
      bullets: [
        {
          title: "One clean rebuild",
          body: "Instead of patching the old flow piece by piece, auth, persistence, and email flow will return as one coherent system.",
        },
        {
          title: "No token dead ends",
          body: "Users should not end up in verify or recovery pages that resolve into unreliable state.",
        },
        {
          title: "Assessment first",
          body: "The priority is keeping the product core usable before security-oriented account surfaces return properly.",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: ["/verify-email", "email verification", "token-based recovery"],
      primaryLabel: "Go to assessment",
      primaryHref: "/quiz",
      secondaryLabel: "Back to home",
      secondaryHref: "/",
    },
  },
  operations: {
    th: {
      browserTitle: "Operations Console Hold | MBTI Z",
      tag: "Operations console relaunch",
      headline: "พื้นที่ admin และ moderation กำลังรอ auth + cloud relaunch อย่างเป็นระบบ",
      body:
        "รอบนี้เราไม่เปิด admin console ทับบน auth stack เดิมที่ยังไม่เสถียร เพราะเป้าหมายหลักคือให้ product flow ใช้งานได้ก่อน แล้วค่อยคืน operations surface บนระบบที่เชื่อถือได้จริง",
      statusLabel: "Why this is held",
      statusBody:
        "admin, moderation, user control และ global settings จะกลับมาเมื่อ account roles, persistence และ audit trail ถูกเชื่อมกลับมาแบบครบวงจร",
      bullets: [
        {
          title: "No legacy backdoor",
          body: "เราไม่ปล่อยให้ admin pages วิ่งบน runtime เก่าที่ยังผูกกับ account flow และ session logic ก่อน relaunch",
        },
        {
          title: "Operations on real data",
          body: "เมื่อ surface นี้กลับมา มันควรเชื่อมกับ Supabase target ใหม่, moderation rules, และ durable logs ไม่ใช่ data model กึ่งเก่า-กึ่งใหม่",
        },
        {
          title: "Primary flow first",
          body: "ในช่วงนี้ priority สูงสุดยังเป็น assessment, result และ dashboard ของผู้ใช้ทั่วไป ส่วน operations อยู่ใน queue ถัดไป",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: [
        "/admin",
        "/admin/cards",
        "/admin/comments",
        "/admin/settings",
        "/admin/users",
      ],
      primaryLabel: "Open dashboard",
      primaryHref: "/dashboard",
      secondaryLabel: "Back to home",
      secondaryHref: "/",
    },
    en: {
      browserTitle: "Operations Console Hold | MBTI Z",
      tag: "Operations console relaunch",
      headline: "Admin and moderation surfaces are waiting for a proper auth and cloud relaunch",
      body:
        "The admin console is intentionally not being restored on top of the old auth stack. The product journey comes first, and operations should only return on infrastructure that is actually stable.",
      statusLabel: "Why this is held",
      statusBody:
        "Admin, moderation, user control, and global settings return after roles, persistence, and audit trails are reconnected as one coherent system.",
      bullets: [
        {
          title: "No legacy backdoor",
          body: "Admin pages are not being reopened on top of the pre-relaunch runtime that still depends on old account and session assumptions.",
        },
        {
          title: "Operations on real data",
          body: "When this surface returns, it should connect to the new Supabase target, moderation rules, and durable logs rather than a half-old data model.",
        },
        {
          title: "Primary flow first",
          body: "The highest priority remains the assessment, result, and dashboard flow for end users. Operations stay in the next queue.",
        },
      ],
      queueLabel: "Included in this relaunch queue",
      queueItems: [
        "/admin",
        "/admin/cards",
        "/admin/comments",
        "/admin/settings",
        "/admin/users",
      ],
      primaryLabel: "Open dashboard",
      primaryHref: "/dashboard",
      secondaryLabel: "Back to home",
      secondaryHref: "/",
    },
  },
};

export const mbtiZQuizCopy = {
  th: {
    pageTitle: "แบบทดสอบ MBTI Z | MBTI Z",
    metaDescription:
      "ทำแบบทดสอบ MBTI Z แบบ guest ด้วยคำตอบ 5 ระดับและโมดูล Movie Profile ในลำดับเดียว",
    title: "แบบทดสอบ MBTI Z",
    subtitle:
      "แบบทดสอบนี้ค่อย ๆ อ่านพลังงาน วิธีรับข้อมูล การตัดสินใจ และรสนิยมการดูหนังของคุณเป็นชั้น ๆ เพื่อให้ผลลัพธ์ออกมาเป็น artifact ที่มีน้ำหนักมากกว่า quiz แบบเลือกไวแล้วจบ",
    helper:
      "คำตอบทั้งหมดถูกเก็บไว้ใน browser นี้ชั่วคราว คุณสามารถย้อนกลับ รีเซ็ต หรือปิดหน้าแล้วกลับมาอ่านต่อได้ใน runtime ปัจจุบัน",
    localRuntime: "guest runtime ทำงานอยู่",
    question: "คำถาม",
    of: "จาก",
    homeAriaLabel: "กลับหน้าแรก",
    previous: "ย้อนกลับ",
    next: "ถัดไป",
    revealResult: "ดูผลลัพธ์",
    restart: "เริ่มใหม่",
    processing: "กำลังประมวลผลผลลัพธ์ของคุณ...",
    localeReset: "การสลับภาษาจะเริ่ม session ใหม่ ต้องการรีเซ็ตตอนนี้หรือไม่",
    dashboard: "ดูประวัติล่าสุด",
    details: "เก็บความคืบหน้าในเครื่องเท่านั้น ส่วน cloud save จะกลับมาในเฟสถัดไป",
    phase: "ช่วงการประเมิน",
    currentAxis: "แกนปัจจุบัน",
    signalChamber: "ห้องรวมสัญญาณ",
    signalBody:
      "แต่ละข้อถูกวางให้ช่วยบีบความต่างระหว่างสองแกนหลัก เพื่อให้ผลลัพธ์สุดท้ายมีน้ำหนักมากกว่าการเลือกแบบ intuition ล้วน",
    scaleLabel: "5 ระดับการเลือก",
    coreHint: "เลือกจากน้ำหนักที่ใกล้ตัวคุณที่สุด ไม่ต้องรีบพุ่งไปสุดทุกข้อ",
    movieHint:
      "คำถามชุดนี้จะประกอบเป็น Movie Profile ให้เลือก route ที่ชนะในใจคุณจริงที่สุด",
    autosave: "บันทึกอัตโนมัติใน browser นี้",
    answered: "ตอบแล้ว",
    remaining: "เหลือ",
    archive: "โหมดเก็บในเครื่อง",
    option: "ตัวเลือก",
    nextUnlock: "Result Artifact จะเปิดหลังคำถามสุดท้าย",
    responseFocus: "จุดโฟกัสของคำตอบ",
    responseBody:
      "พื้นที่กลางนี้ตั้งใจให้คำตอบเป็นจุดเด่นหลัก ส่วน phase, runtime และ archive ถูกย้ายลงไปเป็นข้อมูลเสริมเพื่อไม่แย่งสายตา",
    phaseMap: "แผนที่การประเมิน",
    moduleCore: "แกนบุคลิกหลัก",
    moduleMovie: "Movie Profile",
    progressLabel: "เสร็จแล้ว",
    memoryLabel: "หน่วยความจำในเครื่อง",
    stageLabels: ["พลังงาน", "การรับข้อมูล", "การตัดสินใจ", "Movie Profile"],
    answerDeck: {
      optionPrefix: "ตัวเลือก",
      strong: "ชัดเจน",
      lean: "เอนมา",
      balancedMid: "สมดุล · กึ่งกลาง",
      tapToSelect: "คลิกเพื่อเลือก",
      selected: "เลือกแล้ว",
      ready: "พร้อมตอบ",
    },
    phases: [
      ["ตั้งค่าแกนเริ่มต้น", "กำลังอ่านจังหวะพื้นฐานและพลังงานเริ่มต้นของคุณ"],
      ["แผนที่รูปแบบ", "เริ่มเห็นรูปแบบการรับข้อมูลและการตัดสินใจชัดขึ้น"],
      ["ล็อกสัญญาณ", "กำลังยืนยันแกนเด่นและจุดที่บุคลิกเริ่มนิ่ง"],
      ["สังเคราะห์ขั้นสุดท้าย", "กำลังประกอบ narrative สุดท้ายก่อนเปิดผลลัพธ์"],
    ],
  },
  en: {
    pageTitle: "MBTI Z Assessment | MBTI Z",
    metaDescription:
      "Take the MBTI Z guest assessment with weighted answers and a Movie Profile module in one connected flow.",
    title: "MBTI Z Assessment",
    subtitle:
      "This assessment reads your energy, perception, decision style, and movie taste in layers so the final artifact feels more deliberate than a quick guess-and-submit quiz.",
    helper:
      "Your answers remain stored in this browser for now. You can go backward, restart, or leave and return to continue within the current runtime.",
    localRuntime: "Guest runtime active",
    question: "Question",
    of: "of",
    homeAriaLabel: "Back to home",
    previous: "Previous",
    next: "Next",
    revealResult: "Reveal Result",
    restart: "Restart",
    processing: "Computing your result...",
    localeReset: "Switching languages will restart this session. Continue?",
    dashboard: "Open recent history",
    details: "Local progress only. Cloud save returns in a later phase.",
    phase: "Assessment phase",
    currentAxis: "Current axis",
    signalChamber: "Signal chamber",
    signalBody:
      "Each prompt is placed to tighten the difference between the two active poles, so the final readout carries more weight than instinct alone.",
    scaleLabel: "5-level scale",
    coreHint: "Choose the weight that feels closest to you instead of rushing to the extremes every time.",
    movieHint:
      "These prompts shape your Movie Profile, so pick the cinematic route that truly wins your attention.",
    autosave: "autosaved in this browser",
    answered: "Answered",
    remaining: "Remaining",
    archive: "Archive mode",
    option: "Option",
    nextUnlock: "Result artifact unlocks after the final prompt",
    responseFocus: "Response focus",
    responseBody:
      "The center surface is intentionally answer-first, while phase, runtime, and archive context stay below as supporting detail.",
    phaseMap: "Assessment map",
    moduleCore: "Core dimension",
    moduleMovie: "Movie Profile module",
    progressLabel: "Complete",
    memoryLabel: "Local memory",
    stageLabels: ["Energy Source", "Perception", "Judgment", "Lifestyle"],
    answerDeck: {
      optionPrefix: "Option",
      strong: "Strong",
      lean: "Lean",
      balancedMid: "Balanced · Mid",
      tapToSelect: "Tap to select",
      selected: "Selected",
      ready: "Ready",
    },
    phases: [
      ["Calibration", "Reading your baseline rhythm and energy signature."],
      ["Pattern map", "Your information and decision patterns are becoming clearer."],
      ["Signal lock", "The dominant axes are tightening into a stable read."],
      ["Final synthesis", "The final narrative is being assembled before reveal."],
    ],
  },
} as const;

export const mbtiZTypesMovieLensCopy = {
  purple: {
    th: "ปริศนา, pattern, โลกสมมติที่มีระบบ",
    en: "mystery, patterns, and structured worldbuilding",
  },
  green: {
    th: "อารมณ์, ความหมาย, และเรื่องเล่าที่พาคนเข้าไปข้างใน",
    en: "emotion, meaning, and story worlds with inner gravity",
  },
  yellow: {
    th: "ความไว้วางใจ, ความอบอุ่น, และโครงสร้างที่พาคนอยู่ร่วมกันได้",
    en: "trust, warmth, and systems that keep people together",
  },
  blue: {
    th: "จังหวะ, แรงส่ง, และภาพที่ขับเคลื่อนการลงมือ",
    en: "pace, momentum, and action-first cinematic energy",
  },
} as const;

export const mbtiZTypesCopy = {
  th: {
    pageTitle: "16 Types | MBTI Z",
    title: "คลัง 16 Types ของ MBTI Z",
    subtitle:
      "คลัง 16 types ของ MBTI Z ถูกจัดใหม่ให้เริ่มจาก 4 houses ก่อน แล้วค่อยเจาะลงไปที่สัตว์ประจำ type, สรุปแกนหลัก, และพื้นที่ที่แต่ละแบบมักปล่อยของได้ดีที่สุด",
    metaDescription:
      "สำรวจ 16 Types ของ MBTI Z ผ่าน 4 houses, สัตว์ประจำตัว และคำอธิบายการใช้งานที่เหมาะกับแต่ละแบบ",
    home: "กลับหน้าแรก",
    quiz: "เข้า Quiz",
    result: "เปิดผลของฉัน",
    atlas: "คลัง 16 Types",
    fit: "เหมาะกับอะไร",
    animal: "สัตว์",
    summaryLabel: "ภาพรวมแกนหลัก",
    houseLibrary: "4 houses · 16 types · ระบบสัตว์แฟนตาซี",
    quickScanTitle: "อ่าน atlas แบบไล่จาก house ก่อนแล้วค่อยลงถึง type",
    quickScanBody:
      "แต่ละ house ทำหน้าที่เป็นแกนสี อารมณ์ และรสนิยมหนัง ส่วน type card จะบอกสัตว์ประจำตัว ความหมายหลัก และพื้นที่ที่เหมาะกับการใช้งานจริง",
    houseNarrative: "เรื่องเล่าของ house",
    movieLens: "มุมดูหนัง",
    typeCount: "Types",
    archiveTitle: "คลัง type",
    archiveBody:
      "แต่ละ card ตั้งใจให้หยิบไปอ่านต่อใน mobile ได้ง่าย โดยไม่ต้องกวาดสายตากลับไปกลับมาระหว่างหัวข้อ",
    viewProfile: "อ่านโปรไฟล์",
  },
  en: {
    pageTitle: "16 Types | MBTI Z",
    title: "MBTI Z Type Atlas",
    subtitle:
      "The 16 MBTI Z types are reorganized to start from the four houses first, then drill into each type's animal, core readout, and the spaces where it tends to land best.",
    metaDescription:
      "Explore all 16 MBTI Z personalities through four fantasy houses, animal identities, and fit guidance.",
    home: "Back home",
    quiz: "Enter Quiz",
    result: "Open My Results",
    atlas: "Type atlas",
    fit: "Best fit",
    animal: "Animal",
    summaryLabel: "Core readout",
    houseLibrary: "4 houses · 16 types · fantasy animal system",
    quickScanTitle: "Read the atlas by house first, then drop into each type",
    quickScanBody:
      "Each house carries a color route, emotional tone, and movie preference lens. Every type card then reveals the animal, the core readout, and where it tends to work best.",
    houseNarrative: "House narrative",
    movieLens: "Movie lens",
    typeCount: "Types",
    archiveTitle: "Type library",
    archiveBody:
      "Each card is designed to stay readable on mobile without forcing the reader to sweep back and forth across too many competing surfaces.",
    viewProfile: "View profile",
  },
} as const;

export const mbtiZResultCopy = {
  th: {
    notFoundPageTitle: "Result ไม่พร้อมใช้งาน | MBTI Z",
    kicker: "MBTI Z result artifact",
    notFoundTitle: "ไม่พบผลลัพธ์ใน guest memory",
    notFoundBody:
      "ผลลัพธ์นี้อาจมาจาก session เก่าที่ถูกลบไปแล้ว หรือสร้างจากระบบ account รุ่นก่อนหน้า ลองทำแบบทดสอบใหม่อีกครั้งใน guest flow ปัจจุบัน",
    notFoundCta: "เริ่มทำแบบทดสอบใหม่",
    summary: "สรุปที่เปิดให้ใช้ฟรี",
    dimensions: "สมดุลของแต่ละแกน",
    premium: "ชั้นที่รอปลดล็อก",
    answers: "ร่องรอยคำตอบล่าสุด",
    accountQueue: "คิว Account",
    confidence: "Confidence",
    questions: "ตอบแล้ว",
    runtime: "Runtime",
    local: "เก็บในเครื่องเท่านั้น",
    dashboard: "ไปที่แดชบอร์ด",
    retake: "ทำแบบทดสอบอีกครั้ง",
    signalMapTitle: "สัญญาณของคุณกำลังนิ่งเข้าหาแกนหลัก",
    premiumModulesTitle: "ชั้นลึกที่รอปลดล็อก",
    answerTrailTitle: "ร่องรอยสัญญาณล่าสุด",
    artifactLayersTitle: "ชั้นของ Artifact",
    artifactLayersBody:
      "ผลลัพธ์นี้ไม่ได้จบที่ตัวอักษร 4 ตัว แต่ถูกเปิดเป็นชั้นเพื่อให้คุณอ่านตัวเองได้อย่างเป็นระบบและนำกลับไปใช้ต่อได้",
    artifactRuntimeState: "Artifact แบบ guest ทำงานอยู่",
    signature: "ลายเซ็นของ Artifact",
    signatureBody:
      "นี่คือผลลัพธ์เวอร์ชันที่ใช้งานได้จริงใน guest runtime พร้อมชั้นความหมายที่ถูกจัดใหม่ให้ใกล้ product มากขึ้น",
    house: "House",
    animal: "สัตว์",
    movieProfile: "Movie Profile",
    typeAtlas: "เปิดคลัง 16 types",
    sharePreview: "ตัวอย่างการ์ดสำหรับแชร์",
    sharePreviewBody:
      "ไฟล์นี้จัดไว้ที่ 1080x1350 พร้อมสรุปภาษาไทยสำหรับแชร์ลง social ได้ทันที",
    downloadPng: "ดาวน์โหลด PNG",
    processingPng: "กำลังเตรียม PNG",
    downloadError: "ยัง export PNG ไม่ได้",
    created: "วันที่",
    thaiExport: "Thai-first export · 1080x1350",
    layerLabel: "ชั้น",
    axesUnit: "แกน",
    modulesUnit: "โมดูล",
    tracesUnit: "ร่องรอย",
    spreadLabel: "ระยะห่าง",
    winnerLabel: "แกนเด่น",
    lockedTitle: "โมดูลที่ผูกกับ account ยังพักอยู่ชั่วคราว",
    lockedBody:
      "premium unlock, cloud save และ account sync จะกลับมาเมื่อ auth/runtime ใหม่พร้อม ตอนนี้ local PNG export และ result artifact พร้อมใช้งานแล้วใน browser นี้",
    premiumUnlock: "เปิด account queue",
  },
  en: {
    notFoundPageTitle: "Result Unavailable | MBTI Z",
    kicker: "MBTI Z result artifact",
    notFoundTitle: "No result found in guest memory",
    notFoundBody:
      "This result may belong to an older session that no longer exists locally, or to the previous account-based runtime. Run the current guest assessment to generate a fresh result.",
    notFoundCta: "Start a new assessment",
    summary: "Free summary",
    dimensions: "Dimension balance",
    premium: "Premium teaser",
    answers: "Recent signal trail",
    accountQueue: "Account queue",
    confidence: "Confidence",
    questions: "Answered",
    runtime: "Runtime",
    local: "Local only",
    dashboard: "Open dashboard",
    retake: "Retake assessment",
    signalMapTitle: "Your signal map is settling into a dominant axis pattern",
    premiumModulesTitle: "Deep-report modules waiting behind the lock",
    answerTrailTitle: "Recent signal trail",
    artifactLayersTitle: "Artifact layers",
    artifactLayersBody:
      "This result does not stop at four letters. It unfolds in layers so the readout feels structured, deliberate, and reusable.",
    artifactRuntimeState: "guest artifact active",
    signature: "Artifact signature",
    signatureBody:
      "This is the working guest-runtime version of your result, now reorganized to feel closer to a premium product artifact instead of a static outcome screen.",
    house: "House",
    animal: "Animal",
    movieProfile: "Movie Profile",
    typeAtlas: "Open the 16-type atlas",
    sharePreview: "Social card preview",
    sharePreviewBody:
      "This file is composed at 1080x1350 with a Thai-first summary for social sharing.",
    downloadPng: "Download PNG",
    processingPng: "Preparing PNG",
    downloadError: "PNG export unavailable",
    created: "Date",
    thaiExport: "Thai-first export · 1080x1350",
    layerLabel: "Layer",
    axesUnit: "axes",
    modulesUnit: "modules",
    tracesUnit: "traces",
    spreadLabel: "spread",
    winnerLabel: "winner",
    lockedTitle: "Account-linked modules are temporarily paused",
    lockedBody:
      "Premium unlocks, cloud save, and account sync return when the new auth runtime is ready. Local PNG export and the result artifact already work in this browser now.",
    premiumUnlock: "Open account queue",
  },
} as const;

export const mbtiZDashboardCopy = {
  th: {
    pageTitle: "Dashboard | MBTI Z",
    metaDescription:
      "เปิดดู Result ล่าสุด, ประวัติในเครื่อง และไฟล์ PNG สำหรับแชร์จาก Dashboard ของ MBTI Z",
    eyebrow: "คลังความจำแบบ guest",
    title: "แดชบอร์ดเวอร์ชัน guest ที่ยังเก็บ narrative ของคุณไว้เป็น vault ได้",
    subtitle:
      "ที่นี่คือห้องเก็บ Result ล่าสุด ประวัติในเครื่อง local PNG export และสถานะของ account/cloud features ที่กำลังถูกสร้างกลับมาใหม่",
    noResultTitle: "ยังไม่มีผลลัพธ์ล่าสุด",
    noResultBody: "เริ่มทำแบบทดสอบก่อน แล้ว vault นี้จะเริ่มจำผลลัพธ์ล่าสุดของคุณให้ทันที",
    startQuiz: "เริ่มทำแบบทดสอบ",
    latest: "Artifact ล่าสุด",
    history: "ประวัติแบบ guest",
    runtime: "สถานะ runtime",
    guestValue: "guest",
    historySlots: "ช่องประวัติ",
    historySlotsValueSuffix: "/8",
    bilingual: "ภาษา",
    bilingualValue: "TH/EN",
    handoff: "Bundle สำหรับ reconnect",
    locked: "โมดูลที่ยัง offline",
    lockedBody:
      "premium unlock, account sync และ cloud save ยังพักอยู่ชั่วคราว แต่ latest artifact และ local PNG export พร้อมใช้งานแล้ว",
    handoffReady: "พร้อม",
    handoffIdle: "ยังไม่มี",
    handoffTitle: "สะพานเชื่อม guest ไป cloud",
    handoffBodyReady:
      "ข้อมูลล่าสุดของ guest runtime ถูกจัดเป็น handoff package แล้ว เพื่อเตรียมเชื่อมกับ account/cloud persistence เมื่อ infra พร้อม",
    handoffBodyIdle:
      "ยังไม่มี package สำหรับ handoff เพราะ browser นี้ยังไม่มี guest result หรือ session ที่ต้องย้ายขึ้น cloud",
    pendingSession: "session ที่ค้างอยู่",
    lastActivity: "กิจกรรมล่าสุด",
    retake: "ทำแบบทดสอบอีกครั้ง",
    open: "เปิดผลลัพธ์",
    archiveTitle: "ร่องรอย archive ส่วนตัว",
    archiveBody:
      "ประวัติใน guest mode ถูกเก็บไว้เป็นร่องรอยล่าสุดของคุณก่อน reconnect ขึ้น cloud runtime",
    vaultTitle: "สัญญาณใน vault",
    vaultBody:
      "ผลลัพธ์ล่าสุดเป็นแกนกลางของ archive นี้ แล้วแตกออกเป็น PNG share card, local history และ reconnect bundle ในจุดเดียว",
    vaultTags: ["result ล่าสุด", "ส่งออก PNG", "archive ในเครื่อง"],
    accountQueue: "เปิด account queue",
    house: "House",
    animal: "Animal",
    movieProfile: "Movie Profile",
    typeAtlas: "เปิดคลัง 16 types",
    sharePreview: "การ์ดล่าสุดสำหรับแชร์",
    sharePreviewBody:
      "การ์ดนี้พร้อมโหลดเป็น PNG ขนาด 1080x1350 พร้อมสรุปภาษาไทยสำหรับโพสต์ต่อ",
    downloadPng: "ดาวน์โหลด PNG",
    processingPng: "กำลังเตรียม PNG",
    downloadError: "ยัง export PNG ไม่ได้",
    created: "วันที่",
    localExport: "ส่งออก PNG ในเครื่อง",
    confidenceLabel: "Confidence",
    archiveItemLabel: "archive",
    cloudQueueTitle: "คิว relaunch ฝั่ง cloud",
    accountSyncTitle: "เชื่อม Account",
    premiumUnlockTitle: "ปลดล็อก Premium",
    exportedLabel: "ส่งออกแล้ว",
    noBundleLabel: "ยังไม่มี bundle",
    historyMetaPrefix: "history",
  },
  en: {
    pageTitle: "Dashboard | MBTI Z",
    metaDescription:
      "Review your latest MBTI Z Result, local history, reconnect bundle, and PNG export from the guest Dashboard.",
    eyebrow: "Guest dashboard memory",
    title: "A guest dashboard that still preserves your narrative as a vault",
    subtitle:
      "This is the room for your latest result, local archive trail, PNG export, and the account/cloud features currently being rebuilt.",
    noResultTitle: "No latest result yet",
    noResultBody: "Start the assessment first and this vault will immediately store your latest guest result.",
    startQuiz: "Start assessment",
    latest: "Latest artifact",
    history: "Guest history",
    runtime: "Runtime status",
    guestValue: "Guest",
    historySlots: "History slots",
    historySlotsValueSuffix: "/8",
    bilingual: "Bilingual",
    bilingualValue: "TH/EN",
    handoff: "Reconnect bundle",
    locked: "Offline modules",
    lockedBody:
      "Premium unlocks, account sync, and cloud save are still paused, but the latest artifact and local PNG export already work.",
    handoffReady: "Ready",
    handoffIdle: "Idle",
    handoffTitle: "Guest-to-cloud handoff",
    handoffBodyReady:
      "The latest guest runtime data is already packaged into a handoff bundle so it can reconnect to account and cloud persistence once infra is ready.",
    handoffBodyIdle:
      "No handoff package exists yet because this browser does not currently hold a guest result or in-progress session.",
    pendingSession: "Pending session",
    lastActivity: "Last activity",
    retake: "Retake assessment",
    open: "Open result",
    archiveTitle: "Personal archive trail",
    archiveBody:
      "Guest mode keeps your recent outcome as a recoverable trail before the runtime reconnects to cloud persistence.",
    vaultTitle: "Vault signal",
    vaultBody:
      "The latest result sits at the center of this archive, then fans out into a PNG share card, local history, and a reconnect bundle.",
    vaultTags: ["latest result", "png export", "local archive"],
    accountQueue: "Open account queue",
    house: "House",
    animal: "Animal",
    movieProfile: "Movie Profile",
    typeAtlas: "Open the 16-type atlas",
    sharePreview: "Latest share card",
    sharePreviewBody:
      "This card is ready to download at 1080x1350 with a Thai-first summary for social posting.",
    downloadPng: "Download PNG",
    processingPng: "Preparing PNG",
    downloadError: "PNG export unavailable",
    created: "Date",
    localExport: "Local PNG export",
    confidenceLabel: "Confidence",
    archiveItemLabel: "archive",
    cloudQueueTitle: "Cloud relaunch queue",
    accountSyncTitle: "Account sync",
    premiumUnlockTitle: "Premium unlock",
    exportedLabel: "Exported",
    noBundleLabel: "no-bundle",
    historyMetaPrefix: "history",
  },
} as const;

export const mbtiZMyResultsCopy = {
  th: {
    pageTitle: "ผลของฉัน | MBTI Z",
    metaDescription: "ดูผล MBTI Z ล่าสุด ประวัติในเครื่อง และดาวน์โหลดการ์ด PNG",
    title: "ผลของฉัน",
    subtitle: "ผลแบบทดสอบล่าสุดและประวัติที่บันทึกอยู่ใน browser นี้",
    localOnly: "บันทึกใน browser นี้เท่านั้น",
    latest: "ผลล่าสุด",
    latestBody: "เปิดผลฉบับเต็ม ดูรายละเอียด type หรือดาวน์โหลดการ์ด PNG",
    house: "House",
    animal: "Animal",
    movieProfile: "Movie Profile",
    patternClarity: "ความชัดของ pattern",
    openResult: "เปิดผลฉบับเต็ม",
    openType: "ดูรายละเอียด type",
    downloadPng: "ดาวน์โหลด PNG",
    processingPng: "กำลังเตรียม PNG",
    downloadError: "ยัง export PNG ไม่ได้",
    retake: "ทำแบบทดสอบอีกครั้ง",
    pending: "แบบทดสอบที่ทำค้างไว้",
    resumeTitle: "ทำต่อจากจุดเดิม",
    resumeBody: "คำตอบล่าสุดยังอยู่ในเครื่องนี้และพร้อมทำต่อ",
    continueQuiz: "ทำแบบทดสอบต่อ",
    restartQuiz: "เริ่มใหม่",
    restartConfirm: "เริ่มแบบทดสอบใหม่และแทนที่ session ที่กำลังทำอยู่หรือไม่?",
    answered: "ความคืบหน้าของแบบทดสอบ",
    questionUnit: "ข้อ",
    history: "ประวัติล่าสุด",
    historyBody: "เก็บผลล่าสุดได้สูงสุด 8 รายการใน browser นี้",
    openHistoryItem: "เปิดผลลัพธ์",
    emptyTitle: "ยังไม่มีผลลัพธ์",
    emptyBody: "เริ่มทำแบบทดสอบเพื่อสร้างผลแรกของคุณ",
    startQuiz: "เริ่มทำแบบทดสอบ",
    advanced: "ขั้นสูง",
    advancedTitle: "ย้ายหรือกู้คืนข้อมูล",
    advancedBody: "เครื่องมือสำหรับส่งออกหรือนำเข้าข้อมูลที่บันทึกไว้ใน browser",
    storageEyebrow: "เปิดข้อมูลในเครื่องไม่ได้",
    storageTitle: "ผลของคุณยังไม่พร้อมแสดง",
    storageBody:
      "Browser ปิดกั้นการอ่านข้อมูลชั่วคราว ลองอนุญาต site storage แล้วเปิดข้อมูลอีกครั้ง",
    retryStorage: "ลองเปิดข้อมูลอีกครั้ง",
  },
  en: {
    pageTitle: "My Results | MBTI Z",
    metaDescription: "View your latest MBTI Z result, local history, and downloadable PNG card.",
    title: "My Results",
    subtitle: "Your latest assessment result and history saved in this browser",
    localOnly: "Stored in this browser only",
    latest: "Latest result",
    latestBody: "Open the full result, explore the type profile, or download its PNG card",
    house: "House",
    animal: "Animal",
    movieProfile: "Movie Profile",
    patternClarity: "Pattern clarity",
    openResult: "Open full result",
    openType: "Explore this type",
    downloadPng: "Download PNG",
    processingPng: "Preparing PNG",
    downloadError: "PNG export unavailable",
    retake: "Retake assessment",
    pending: "Assessment in progress",
    resumeTitle: "Continue where you left off",
    resumeBody: "Your latest answers are still on this device and ready to continue.",
    continueQuiz: "Continue assessment",
    restartQuiz: "Start over",
    restartConfirm: "Start a new assessment and replace the current session?",
    answered: "Assessment progress",
    questionUnit: "questions",
    history: "Recent results",
    historyBody: "Up to 8 recent results are kept in this browser",
    openHistoryItem: "Open result",
    emptyTitle: "No results yet",
    emptyBody: "Take the assessment to create your first result.",
    startQuiz: "Start assessment",
    advanced: "Advanced",
    advancedTitle: "Transfer or recover data",
    advancedBody: "Tools for exporting or importing data saved in this browser",
    storageEyebrow: "Local data unavailable",
    storageTitle: "Your results cannot be shown yet",
    storageBody:
      "This browser temporarily blocked access to local data. Allow site storage, then try again.",
    retryStorage: "Try opening results again",
  },
} as const;

export const mbtiZReconnectBundleCopy = {
  th: {
    eyebrow: "Artifact สำหรับย้ายข้อมูลในเครื่อง",
    bodyReady:
      "ดาวน์โหลดหรือคัดลอก package จาก browser นี้ไว้ก่อนได้ เพื่อใช้เป็น recovery artifact ตอน cloud reconnect กลับมา",
    bodyEmpty:
      "browser นี้ยังไม่มี local package อยู่ แต่คุณยังสามารถอัปโหลดหรือวาง JSON จาก package เดิมเพื่อกู้ vault นี้กลับมาได้",
    download: "ดาวน์โหลด package",
    copy: "คัดลอก JSON",
    copied: "คัดลอกแล้ว",
    downloaded: "ดาวน์โหลดแล้ว",
    failed: "ยังทำรายการไม่ได้",
    version: "เวอร์ชัน",
    locale: "ภาษา",
    recoveryTitle: "คอนโซลกู้ข้อมูล",
    openRecovery: "เปิดคอนโซลกู้ข้อมูล",
    closeRecovery: "ซ่อนคอนโซล",
    recoveryBodyReady:
      "ถ้าคุณย้าย browser หรือล้าง local memory ไปแล้ว ให้วาง JSON หรืออัปโหลดไฟล์ package เดิมเพื่อ restore latest result, history และ session กลับมา",
    recoveryBodyEmpty:
      "วาง JSON หรืออัปโหลดไฟล์ package ที่เคยดาวน์โหลดไว้ แล้ว browser นี้จะ rebuild guest vault กลับขึ้นมาอีกครั้ง",
    placeholder:
      "วาง JSON ของ handoff package ที่นี่ หรืออัปโหลดไฟล์ .json ที่เคยดาวน์โหลดไว้",
    upload: "อัปโหลด package",
    clear: "ล้างข้อความ",
    import: "นำ package กลับเข้า browser นี้",
    importReady: "พร้อม import",
    source: "แหล่งข้อมูลที่โหลดแล้ว",
    overwriteConfirm:
      "browser นี้มี guest result หรือ session อยู่แล้ว การ import จะเขียนทับ latest result, history และ pending session ปัจจุบัน ดำเนินการต่อหรือไม่?",
    restored: "restore กลับเข้า browser นี้แล้ว",
    invalidJson: "JSON ไม่ถูกต้อง",
    invalidBundle: "โครงสร้าง package ไม่ถูกต้อง",
    storageUnavailable: "browser นี้ยังไม่รองรับ local recovery path",
    inputRequired: "วาง JSON หรืออัปโหลด package ก่อน",
    sourceLoaded: "โหลด package แล้ว",
    emptyState: "ยังไม่มี package ในเครื่อง",
  },
  en: {
    eyebrow: "Local handoff artifact",
    bodyReady:
      "Download or copy the package from this browser now so it can act as a recovery artifact when cloud reconnect returns.",
    bodyEmpty:
      "This browser has no local package yet, but you can still upload or paste a previous bundle to recover the vault here.",
    download: "Download package",
    copy: "Copy JSON",
    copied: "Copied",
    downloaded: "Downloaded",
    failed: "Action failed",
    version: "Version",
    locale: "Locale",
    recoveryTitle: "Recovery console",
    openRecovery: "Open recovery console",
    closeRecovery: "Hide console",
    recoveryBodyReady:
      "If you moved browsers or cleared local memory, paste the previous JSON package or upload the saved file to restore the latest result, history, and session here.",
    recoveryBodyEmpty:
      "Paste the JSON package or upload the saved file and this browser will rebuild the guest vault again.",
    placeholder:
      "Paste the handoff package JSON here or upload the .json file you downloaded earlier.",
    upload: "Upload package",
    clear: "Clear input",
    import: "Restore package into this browser",
    importReady: "Ready to import",
    source: "Loaded source",
    overwriteConfirm:
      "This browser already has a guest result or session. Importing will overwrite the current latest result, history, and pending session. Continue?",
    restored: "Restored into this browser",
    invalidJson: "The JSON payload is invalid",
    invalidBundle: "The package structure is invalid",
    storageUnavailable: "This browser does not support local recovery yet",
    inputRequired: "Paste JSON or upload a package first",
    sourceLoaded: "Package loaded",
    emptyState: "No local package yet",
  },
} as const;

export const mbtiZResultShareCopy = {
  th: {
    brand: "MBTI Z",
    result: "Result Artifact",
    house: "House",
    animal: "สัตว์",
    movieProfile: "Movie Profile",
    summary: "สรุปภาษาไทย",
    dimensions: "สมดุลของแต่ละแกน",
  },
  en: {
    brand: "MBTI Z",
    result: "Result Artifact",
    house: "House",
    animal: "Animal",
    movieProfile: "Movie Profile",
    summary: "Thai summary",
    dimensions: "Dimension balance",
  },
} as const;
