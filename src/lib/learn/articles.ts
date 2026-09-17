// เนื้อหาบทความ /learn — ข้อความสองภาษาฝังในไฟล์นี้โดยตรง (ไม่ผ่าน next-intl)
// เพราะเป็นเนื้อหายาวเฉพาะบทความ ไม่ใช่ข้อความ UI ที่ใช้ซ้ำ ดู constants.ts สำหรับรูปแบบเดียวกัน

export type LearnSlug =
  | "time-value-of-money"
  | "compound-interest"
  | "inflation"
  | "real-return"
  | "risk-and-return"
  | "asset-allocation";

export interface LearnSection {
  headingTh: string;
  headingEn: string;
  bodyTh: string[];
  bodyEn: string[];
}

export interface LearnArticle {
  slug: LearnSlug;
  titleTh: string;
  titleEn: string;
  summaryTh: string;
  summaryEn: string;
  sections: LearnSection[];
  interactive?: boolean;
}

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    slug: "time-value-of-money",
    titleTh: "มูลค่าเงินตามเวลา",
    titleEn: "Time Value of Money",
    summaryTh: "ทำไมเงิน 100 บาทวันนี้ถึงมีค่ามากกว่าเงิน 100 บาทในอีก 10 ปีข้างหน้า",
    summaryEn: "Why 100 baht today is worth more than 100 baht 10 years from now.",
    sections: [
      {
        headingTh: "เงินวันนี้ ไม่เท่ากับเงินจำนวนเดียวกันในอนาคต",
        headingEn: "Money today is not the same as the same amount in the future",
        bodyTh: [
          "ถ้ามีคนเสนอให้เลือกระหว่างรับเงิน 100 บาทวันนี้ กับรับเงิน 100 บาทในอีก 1 ปีข้างหน้า คนส่วนใหญ่จะเลือกรับวันนี้ เพราะเงินที่ได้วันนี้สามารถนำไปฝากธนาคารหรือลงทุนให้งอกเงยได้ทันที นี่คือแนวคิดพื้นฐานที่เรียกว่า \"มูลค่าเงินตามเวลา\" (Time Value of Money) — เงินจำนวนเท่ากัน แต่ต่างเวลากัน มีมูลค่าไม่เท่ากัน",
          "หลักการนี้สำคัญมากกับการวางแผนเกษียณ เพราะเราต้องเปรียบเทียบเงินที่ออมวันนี้ กับเงินที่จะต้องใช้ในอีก 20–40 ปีข้างหน้า ถ้าไม่ปรับมูลค่าให้อยู่ ณ จุดเวลาเดียวกันก่อน ตัวเลขที่เปรียบเทียบกันจะผิดเพี้ยนทันที",
        ],
        bodyEn: [
          "If someone offered you a choice between 100 baht today or 100 baht one year from now, most people would choose today — because money in hand now can be deposited or invested and start growing immediately. This is the core idea behind the \"time value of money\": the same amount of money at different points in time has different value.",
          "This matters enormously for retirement planning, because we're comparing money saved today against money that will be needed 20–40 years from now. Unless both amounts are converted to the same point in time first, any comparison between them is meaningless.",
        ],
      },
      {
        headingTh: "สูตรมูลค่าอนาคต (Future Value)",
        headingEn: "The future value formula",
        bodyTh: [
          "สูตรพื้นฐานที่ใช้แปลงเงินก้อนหนึ่งในวันนี้ให้เป็นมูลค่าในอนาคตคือ FV = PV × (1 + r)ⁿ โดย PV คือเงินต้นวันนี้ r คืออัตราผลตอบแทนต่อปี และ n คือจำนวนปี",
          "ตัวอย่าง: ฝากเงิน 100 บาท ได้ดอกเบี้ย 5% ต่อปี ผ่านไป 10 ปี เงินจะกลายเป็น 100 × (1.05)¹⁰ ≈ 162.89 บาท จะเห็นว่าเงินงอกขึ้นมาเกือบ 63 บาท ทั้งที่ไม่ได้เติมเงินต้นเพิ่มเลยแม้แต่บาทเดียว — นี่คือพลังของเวลาบวกกับอัตราผลตอบแทน",
        ],
        bodyEn: [
          "The basic formula for converting a sum of money today into its future value is FV = PV × (1 + r)ⁿ, where PV is today's principal, r is the annual rate of return, and n is the number of years.",
          "Example: deposit 100 baht at 5% annual interest. After 10 years it becomes 100 × (1.05)¹⁰ ≈ 162.89 baht. Notice it grew by almost 63 baht without adding a single extra baht of principal — that's the power of time combined with a rate of return.",
        ],
      },
    ],
  },
  {
    slug: "compound-interest",
    titleTh: "ดอกเบี้ยทบต้น",
    titleEn: "Compound Interest",
    summaryTh: "เครื่องมือทรงพลังที่สุดในการออมระยะยาว และทำไมการเริ่มออมเร็วถึงสำคัญกว่าที่คิด",
    summaryEn: "The most powerful tool in long-term saving, and why starting early matters more than you think.",
    interactive: true,
    sections: [
      {
        headingTh: "ดอกเบี้ยทบต้น vs ดอกเบี้ยธรรมดา",
        headingEn: "Compound interest vs. simple interest",
        bodyTh: [
          "ดอกเบี้ยธรรมดา (Simple Interest) คำนวณจากเงินต้นเท่าเดิมทุกปี ด้วยสูตร FV = PV × (1 + r × n) ส่วนดอกเบี้ยทบต้น (Compound Interest) จะนำดอกเบี้ยที่ได้ในแต่ละปีไปรวมเป็นเงินต้นสำหรับคำนวณดอกเบี้ยปีถัดไป ด้วยสูตร FV = PV × (1 + r)ⁿ",
          "ในช่วงปีแรก ๆ ผลต่างระหว่างสองแบบนี้แทบมองไม่เห็น แต่ยิ่งเวลาผ่านไปนาน เส้นกราฟของดอกเบี้ยทบต้นจะโค้งขึ้นแบบทวีคูณ (Exponential) ในขณะที่ดอกเบี้ยธรรมดายังคงเป็นเส้นตรง — ลองปรับตัวเลขในกราฟด้านล่างดูว่าเมื่อเวลาผ่านไป 30 ปี ผลต่างจะมากขนาดไหน",
        ],
        bodyEn: [
          "Simple interest is calculated on the same principal every year, using FV = PV × (1 + r × n). Compound interest, on the other hand, rolls each year's interest back into the principal for the next year's calculation, using FV = PV × (1 + r)ⁿ.",
          "In the early years the difference between the two is barely visible, but the longer the time horizon, the more compound interest curves upward exponentially while simple interest stays a straight line. Try adjusting the numbers in the chart below to see how large the gap becomes after 30 years.",
        ],
      },
      {
        headingTh: "เริ่มเร็ว สำคัญกว่าออมเยอะ",
        headingEn: "Starting early beats saving more later",
        bodyTh: [
          "เพราะดอกเบี้ยทบต้นทำงานร่วมกับเวลา คนที่เริ่มออมตั้งแต่อายุ 25 จะมี \"เวลา\" ให้เงินทำงานมากกว่าคนที่เริ่มออมตอนอายุ 35 ถึง 10 ปี แม้จะออมเงินต่อเดือนเท่ากันทุกบาท คนที่เริ่มก่อนก็มักจะมีเงินก้อนตอนเกษียณมากกว่าอย่างมีนัยสำคัญ เพราะเงินก้อนแรก ๆ ที่ออมได้มีเวลาทบต้นนานกว่า",
          "ลองสลับไปแท็บ \"เริ่มออมอายุ 25 vs 35\" ด้านล่าง เพื่อดูตัวเลขจริงว่าการรอ 10 ปีก่อนเริ่มออม ทำให้เสียโอกาสไปเท่าไหร่",
        ],
        bodyEn: [
          "Because compound interest works together with time, someone who starts saving at 25 gets a full 10 extra years for their money to work compared to someone who starts at 35. Even at the exact same monthly contribution, the early starter usually ends up with a significantly larger nest egg at retirement, because their earliest contributions had more years to compound.",
          "Switch to the \"Start at 25 vs. 35\" tab below to see the actual numbers behind how much opportunity is lost by waiting 10 years to start.",
        ],
      },
    ],
  },
  {
    slug: "inflation",
    titleTh: "เงินเฟ้อคืออะไร",
    titleEn: "What Is Inflation",
    summaryTh: "ตัวร้ายที่กัดกินมูลค่าเงินออมของคุณอย่างเงียบ ๆ ตลอด 20–40 ปีก่อนเกษียณ",
    summaryEn: "The silent force that erodes your savings' purchasing power over the 20–40 years before retirement.",
    sections: [
      {
        headingTh: "เงินเฟ้อ = ของแพงขึ้น = เงินซื้อของได้น้อยลง",
        headingEn: "Inflation = prices rise = money buys less",
        bodyTh: [
          "เงินเฟ้อ (Inflation) คือภาวะที่ราคาสินค้าและบริการโดยรวมสูงขึ้นเรื่อย ๆ ตามเวลา ซึ่งหมายความว่าเงินจำนวนเท่าเดิมจะซื้อของได้น้อยลงในอนาคต ประเทศไทยมีอัตราเงินเฟ้อเฉลี่ยระยะยาวประมาณ 2–3% ต่อปี ซึ่งฟังดูน้อย แต่เมื่อสะสมนานหลายสิบปี ผลกระทบจะมหาศาล",
          "สูตรที่ใช้คำนวณเหมือนกับมูลค่าอนาคต: FV = PV × (1 + อัตราเงินเฟ้อ)ⁿ เพียงแต่คราวนี้เราใช้เพื่อดูว่า \"ของที่วันนี้ราคา 100 บาท ในอนาคตจะราคาเท่าไหร่\" แทนที่จะดูว่าเงินออมจะโตขึ้นเท่าไหร่",
        ],
        bodyEn: [
          "Inflation is the tendency for the general price level of goods and services to rise over time, which means the same amount of money buys less in the future. Thailand's long-term average inflation rate is roughly 2–3% per year — that sounds small, but compounded over several decades the effect is enormous.",
          "The formula is the same as future value: FV = PV × (1 + inflation rate)ⁿ. Here we use it to answer \"what will something that costs 100 baht today cost in the future?\" instead of asking how much savings will grow.",
        ],
      },
      {
        headingTh: "ตัวอย่าง: ของ 100 บาทวันนี้ ในอีก 20 ปี",
        headingEn: "Example: something worth 100 baht today, 20 years from now",
        bodyTh: [
          "สมมติเงินเฟ้อเฉลี่ย 3% ต่อปี ของที่วันนี้ราคา 100 บาท ในอีก 20 ปีข้างหน้าจะมีราคาสูงถึง 100 × (1.03)²⁰ ≈ 180.61 บาท — แปลว่าถ้าวันนี้ค่าใช้จ่ายรายเดือนของคุณคือ 20,000 บาท พอถึงวันเกษียณในอีก 20–30 ปี ค่าใช้จ่ายเดือนละเท่าเดิมอาจต้องใช้เงินมากกว่าเท่าตัว",
          "นี่คือเหตุผลที่เครื่องมือคำนวณในเว็บนี้จะปรับ \"รายจ่ายหลังเกษียณ\" ที่คุณกรอกด้วยอัตราเงินเฟ้อให้อัตโนมัติ เพื่อไม่ให้คุณประเมินเงินที่ต้องใช้ต่ำกว่าความเป็นจริง",
        ],
        bodyEn: [
          "At an average inflation rate of 3% per year, something that costs 100 baht today will cost 100 × (1.03)²⁰ ≈ 180.61 baht in 20 years. That means if your monthly expenses are 20,000 baht today, by the time you retire in 20–30 years, the same lifestyle could cost more than double that amount per month.",
          "This is exactly why this site's calculator automatically adjusts the post-retirement expense you enter using the inflation rate — so you don't end up underestimating how much you'll actually need.",
        ],
      },
    ],
  },
  {
    slug: "real-return",
    titleTh: "ผลตอบแทนที่แท้จริง",
    titleEn: "Real Return",
    summaryTh: "ทำไมฝากประจำดอกเบี้ย 1.5% ถึง \"ขาดทุน\" ทั้งที่ตัวเลขในบัญชีเพิ่มขึ้นทุกปี",
    summaryEn: "Why a 1.5% fixed deposit can actually \"lose\" money, even though the account balance grows every year.",
    sections: [
      {
        headingTh: "ผลตอบแทนตามป้าย vs ผลตอบแทนที่แท้จริง",
        headingEn: "Nominal return vs. real return",
        bodyTh: [
          "ผลตอบแทนที่ธนาคารหรือกองทุนโฆษณา เช่น \"ดอกเบี้ย 1.5% ต่อปี\" เรียกว่าผลตอบแทนตามป้าย (Nominal Return) แต่ตัวเลขนี้ยังไม่ได้หักผลกระทบจากเงินเฟ้อออก สิ่งที่บอกได้จริงว่าเงินของเรา \"งอกเงย\" ขึ้นจริงหรือไม่ คือผลตอบแทนที่แท้จริง (Real Return) ซึ่งคำนวณจากสูตร Fisher Effect: (1 + ผลตอบแทนที่แท้จริง) = (1 + ผลตอบแทนตามป้าย) ÷ (1 + อัตราเงินเฟ้อ)",
          "ถ้าผลตอบแทนตามป้ายต่ำกว่าอัตราเงินเฟ้อ ผลตอบแทนที่แท้จริงจะติดลบ แปลว่าแม้ตัวเลขในบัญชีจะเพิ่มขึ้นทุกปี แต่ \"อำนาจซื้อ\" ของเงินก้อนนั้นกลับลดลง",
        ],
        bodyEn: [
          "The rate a bank or fund advertises, like \"1.5% interest per year,\" is called the nominal return — but that figure hasn't accounted for inflation yet. What actually tells us whether our money is truly growing is the real return, calculated with the Fisher Effect formula: (1 + real return) = (1 + nominal return) ÷ (1 + inflation rate)",
          "If the nominal return is lower than the inflation rate, the real return turns negative. That means even though the account balance grows every year, the purchasing power of that money is actually shrinking.",
        ],
      },
      {
        headingTh: "ตัวอย่าง: ฝากประจำ 1.5% ปะทะเงินเฟ้อ 3%",
        headingEn: "Example: a 1.5% fixed deposit vs. 3% inflation",
        bodyTh: [
          "ถ้าฝากประจำได้ดอกเบี้ย 1.5% ต่อปี ขณะที่เงินเฟ้ออยู่ที่ 3% ต่อปี ผลตอบแทนที่แท้จริงจะเท่ากับ (1.015 ÷ 1.03) − 1 ≈ −1.46% ต่อปี พูดง่าย ๆ คือทุกปีที่ฝากไว้ อำนาจซื้อของเงินก้อนนี้จะลดลงประมาณ 1.46% แม้ตัวเลขในสมุดบัญชีจะเพิ่มขึ้นก็ตาม",
          "นี่คือเหตุผลที่การวางแผนเกษียณเพียงแค่ \"ฝากเงินในบัญชีออมทรัพย์\" ไม่เพียงพอ — ต้องมองหาสินทรัพย์ที่ให้ผลตอบแทนตามป้ายสูงกว่าเงินเฟ้ออย่างสม่ำเสมอ ซึ่งมักหมายถึงการยอมรับความเสี่ยงที่สูงขึ้น (ดูบทความ \"ความเสี่ยงกับผลตอบแทน\")",
        ],
        bodyEn: [
          "If a fixed deposit pays 1.5% per year while inflation runs at 3% per year, the real return is (1.015 ÷ 1.03) − 1 ≈ −1.46% per year. In plain terms, every year that money sits there, its purchasing power shrinks by about 1.46% — even though the number printed in the passbook keeps going up.",
          "This is why retirement planning can't rely solely on a savings account. You need assets whose nominal returns consistently outpace inflation, which usually means accepting a higher level of risk (see the \"Risk and Return\" article).",
        ],
      },
    ],
  },
  {
    slug: "risk-and-return",
    titleTh: "ความเสี่ยงกับผลตอบแทน",
    titleEn: "Risk and Return",
    summaryTh: "ทำไมสินทรัพย์ที่ให้ผลตอบแทนคาดหวังสูงกว่า มักมาพร้อมความเสี่ยงที่สูงกว่าเสมอ",
    summaryEn: "Why assets with higher expected returns almost always come with higher risk.",
    sections: [
      {
        headingTh: "High Risk, High Expected Return",
        headingEn: "High risk, high expected return",
        bodyTh: [
          "ในโลกการลงทุน ไม่มีสินทรัพย์ใดให้ผลตอบแทนสูงโดยไม่มีความเสี่ยงเลย หลักการพื้นฐานที่สุดคือ \"ยิ่งอยากได้ผลตอบแทนคาดหวังสูง ยิ่งต้องยอมรับความผันผวนและโอกาสขาดทุนที่สูงขึ้น\" เงินฝากประจำแทบไม่มีความเสี่ยงเลย แต่ก็ให้ผลตอบแทนต่ำมากจนสู้เงินเฟ้อไม่ได้ ในขณะที่หุ้นให้ผลตอบแทนคาดหวังสูงกว่ามาก แต่ราคาก็ขึ้นลงแรงกว่ามากเช่นกัน",
          "คำว่า \"ผลตอบแทนคาดหวัง\" (Expected Return) สำคัญมาก — มันคือค่าเฉลี่ยในระยะยาว ไม่ใช่ตัวเลขที่จะได้แน่นอนทุกปี บางปีสินทรัพย์เสี่ยงสูงอาจขาดทุนหนัก แล้วค่อยฟื้นตัวในปีถัดไป",
        ],
        bodyEn: [
          "In investing, no asset offers a high return with zero risk. The most fundamental rule is: the higher the expected return you want, the more volatility and potential for loss you have to accept. Fixed deposits carry almost no risk, but their return is so low it can't even keep up with inflation. Stocks offer a much higher expected return, but their prices swing far more dramatically too.",
          "The word \"expected\" in expected return matters a lot — it's a long-run average, not a number you're guaranteed every single year. A high-risk asset can lose significant value in a bad year and recover in the years that follow.",
        ],
      },
      {
        headingTh: "3 ระดับความเสี่ยงที่เว็บนี้ใช้",
        headingEn: "The 3 risk levels used on this site",
        bodyTh: [
          "เครื่องมือคำนวณในเว็บนี้แบ่งระดับความเสี่ยงออกเป็น 3 กลุ่ม แต่ละกลุ่มมีสัดส่วนสินทรัพย์และผลตอบแทนคาดหวังเริ่มต้นต่างกัน ดังตารางด้านล่าง (ตัวเลขเดียวกับที่ใช้คำนวณจริงในระบบ)",
        ],
        bodyEn: [
          "This site's calculator groups risk tolerance into 3 levels, each with a different default asset mix and expected return, shown in the table below (these are the exact numbers used in the actual calculation).",
        ],
      },
    ],
  },
  {
    slug: "asset-allocation",
    titleTh: "การจัดสรรสินทรัพย์",
    titleEn: "Asset Allocation",
    summaryTh: "ทำไมไม่ควรใส่ไข่ทุกใบไว้ในตะกร้าใบเดียว และควรกระจายเงินลงทุนอย่างไร",
    summaryEn: "Why you shouldn't put all your eggs in one basket, and how to spread your investments.",
    sections: [
      {
        headingTh: "การกระจายความเสี่ยงคืออะไร",
        headingEn: "What is diversification",
        bodyTh: [
          "การจัดสรรสินทรัพย์ (Asset Allocation) คือการแบ่งเงินลงทุนไปยังสินทรัพย์หลายประเภทที่มีพฤติกรรมราคาไม่เหมือนกัน เช่น เงินฝาก พันธบัตร และหุ้น แทนที่จะทุ่มเงินทั้งหมดไปกับสินทรัพย์เดียว เพราะเมื่อสินทรัพย์ประเภทหนึ่งราคาตก สินทรัพย์อีกประเภทอาจไม่ตกตาม หรือตกน้อยกว่า ทำให้พอร์ตโดยรวมผันผวนน้อยลง",
          "หลักการนี้ไม่ได้แปลว่าจะไม่ขาดทุนเลย แต่ช่วยลดความรุนแรงของการขาดทุนในช่วงเวลาที่ตลาดแย่ และทำให้นอนหลับสบายขึ้นระหว่างทางไปสู่เป้าหมายระยะยาวอย่างการเกษียณ",
        ],
        bodyEn: [
          "Asset allocation means spreading investment money across several asset types that don't move in exactly the same way — for example deposits, bonds, and stocks — instead of putting everything into a single asset. When one asset class falls in price, another may not fall as much, or at all, which reduces the overall volatility of the portfolio.",
          "This doesn't mean you'll never lose money, but it does soften the severity of losses during bad markets, making the long journey toward a goal like retirement much easier to stay the course with.",
        ],
      },
      {
        headingTh: "3 พอร์ตตัวอย่างตามระดับความเสี่ยง",
        headingEn: "3 example portfolios by risk level",
        bodyTh: [
          "เว็บนี้เสนอสัดส่วนพอร์ตเริ่มต้น 3 แบบตามระดับความเสี่ยงที่คุณเลือกในหน้าฟอร์ม ดังตารางด้านล่าง โดยทั่วไปยิ่งอายุใกล้เกษียณมากเท่าไหร่ ควรค่อย ๆ ลดสัดส่วนหุ้นลงเพื่อลดความเสี่ยงที่จะขาดทุนหนักในช่วงใกล้ใช้เงิน",
        ],
        bodyEn: [
          "This site offers 3 default portfolio mixes based on the risk level you select on the form, shown in the table below. As a general rule, the closer you get to retirement, the more you should gradually reduce your stock allocation to lower the risk of a heavy loss right before you need the money.",
        ],
      },
    ],
  },
];

export function getLearnArticle(slug: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((article) => article.slug === slug);
}
