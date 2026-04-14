// SAT Math Section Score conversion table — Practice Test 11
// Index = raw score (number correct), value = [lower, upper]
// Source: Raw Score Conversion Table provided with the test.

const MATH_SCORE_TABLE = [
  [200, 200], // 0
  [210, 220], // 1
  [210, 220], // 2
  [210, 230], // 3
  [220, 240], // 4
  [230, 250], // 5
  [240, 270], // 6
  [250, 290], // 7
  [260, 320], // 8
  [270, 330], // 9
  [290, 350], // 10
  [310, 350], // 11
  [330, 370], // 12
  [340, 380], // 13
  [350, 390], // 14
  [350, 390], // 15
  [360, 400], // 16
  [370, 410], // 17
  [370, 410], // 18
  [380, 420], // 19
  [390, 430], // 20
  [390, 430], // 21
  [400, 440], // 22
  [410, 450], // 23
  [410, 450], // 24
  [420, 460], // 25
  [430, 470], // 26
  [440, 480], // 27
  [450, 490], // 28
  [460, 500], // 29
  [470, 510], // 30
  [480, 520], // 31
  [490, 530], // 32
  [490, 550], // 33
  [500, 560], // 34
  [510, 570], // 35
  [530, 590], // 36
  [540, 600], // 37
  [550, 610], // 38
  [560, 620], // 39
  [570, 630], // 40
  [590, 650], // 41
  [600, 660], // 42
  [610, 670], // 43
  [620, 680], // 44
  [640, 700], // 45
  [650, 710], // 46
  [660, 720], // 47
  [680, 740], // 48
  [700, 760], // 49
  [710, 770], // 50
  [730, 780], // 51
  [750, 800], // 52
  [770, 800], // 53
  [790, 800], // 54
]

/**
 * Returns the SAT Math score range for a given raw score.
 * @param {number} rawScore - number of correct answers (0–54)
 * @returns {{ lower: number, upper: number }}
 */
export function getMathScoreRange(rawScore) {
  const clamped = Math.max(0, Math.min(rawScore, MATH_SCORE_TABLE.length - 1))
  const [lower, upper] = MATH_SCORE_TABLE[clamped]
  return { lower, upper }
}

/**
 * Returns a display string for the score range.
 * e.g. "640–700" or "800" when lower === upper.
 */
export function formatScoreRange({ lower, upper }) {
  return lower === upper ? `${lower}` : `${lower}–${upper}`
}
