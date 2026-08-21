/* ============================================================
   Site-wide configuration.
   Every number here is taken from the submitted manuscript.
   The table it comes from is named in the comment beside it.
   TODO(launch): add the code and demo URLs after the review period.
   ============================================================ */

export const site = {
  name: "SlideLab",
  title: "SlideLab: Audience-Centered Scientific Slide Generation and Evaluation",
  url: "https://slidelab.github.io",
  description:
    "A training-free multi-agent framework that generates scientific presentations from research papers, and ConfArena, an evaluation environment that simulates a conference room and assesses a deck slide by slide.",
  authors: [
    { name: "Vidushee Vats", url: "https://koookieee.github.io", image: "/img/authors/vidushee-vats.webp" },
    { name: "Karun Sharma", url: "https://anonymous-atom.github.io", image: "/img/authors/karun-sharma.webp" },
    { name: "Yuxia Wang", url: "https://yuxiaw.github.io", image: "/img/authors/yuxia-wang.jpg" },
  ],
  links: {
    paper: "/exhibits/SlideLab.pdf",
    code: "",
    demo: "",
  },
  release: {
    code: "Released after the review period",
    data: "Released after the review period",
  },
  decks: [
    {
      role: "Figure 2",
      title: "One paper, four decks",
      note: "SlideLab against DeepPresenter, Kimi Slides, and Manus on the same paper.",
      preview: "/img/slide-comparison.png",
      detail: "/img/slide-comparison.png",
      previewPage: "Same paper, four systems",
    },
    {
      role: "Comparison 1",
      title: "Representative qualitative comparison",
      note: "Supporting the quantitative results reported in the main paper.",
      preview: "/img/comp1.png",
      detail: "/img/comp1.png",
      previewPage: "Qualitative comparison 1",
    },
    {
      role: "Comparison 2",
      title: "Representative qualitative comparison",
      note: "Supporting the quantitative results reported in the main paper.",
      preview: "/img/comp2.png",
      detail: "/img/comp2.png",
      previewPage: "Qualitative comparison 2",
    },
    {
      role: "Comparison 3",
      title: "Representative qualitative comparison",
      note: "Supporting the quantitative results reported in the main paper.",
      preview: "/img/comp3.png",
      detail: "/img/comp3.png",
      previewPage: "Qualitative comparison 3",
    },
  ],
} as const;

/** Headline results. Table 2 — blind human preference study, 30 papers. */
export const preference = {
  ours: 23,
  total: 30,
  percent: 77,
  runnerUp: { name: "Kimi Slides", papers: 7, percent: 23 },
  zeroPick: ["DeepPresenter", "Manus"],
} as const;

/** Table 1 — ConfArena, 100 papers x 3 seeds. Lower is better on errors. */
export const confarena = {
  columns: [
    { key: "grounding", label: "Grounding errors", scope: "per slide", better: "lower" },
    { key: "figure", label: "Figure errors", scope: "per slide", better: "lower" },
    { key: "design", label: "Design", scope: "per slide", better: "higher" },
    { key: "figureUse", label: "Figure use", scope: "per slide", better: "higher" },
    { key: "narrative", label: "Narrative errors", scope: "whole talk", better: "lower" },
    { key: "coverage", label: "Coverage", scope: "whole talk", better: "higher" },
    { key: "env", label: "Env. score", scope: "whole talk", better: "higher" },
  ],
  rows: [
    { system: "PPTAgent", grounding: 0.98, figure: 0.64, design: 3.21, figureUse: 3.18, narrative: 5.4, coverage: 0.61, env: 0.42 },
    { system: "DeepPresenter", grounding: 2.08, figure: 0.53, design: 3.49, figureUse: 3.27, narrative: 5.19, coverage: 0.94, env: 0.32 },
    { system: "Kimi Slides", grounding: 1.48, figure: 0.17, design: 3.67, figureUse: 3.08, narrative: 4.56, coverage: 0.91, env: 0.58 },
    { system: "Manus", grounding: 1.81, figure: null, design: 3.59, figureUse: null, narrative: 4.14, coverage: 0.89, env: 0.37 },
    { system: "SlideLab", ours: true, grounding: 0.71, figure: 0.26, design: 4.21, figureUse: 3.8, narrative: 3.29, coverage: 0.99, env: 0.73 },
  ],
} as const;

/** Table 3 — component ablations. One run per paper, so the full-system
    score is 0.70 here and not the 0.73 of Table 1, which averages three. */
export const ablations = {
  full: 0.7,
  rows: [
    { label: "Planner", env: 0.51 },
    { label: "LayoutDebugger", env: 0.58 },
    { label: "Custom visuals (paper figures only)", env: 0.63 },
    { label: "Compositor", env: 0.65 },
  ],
} as const;

/** Table 4 — the same decks scored by three existing benchmarks. */
export const externalBenchmarks = {
  rows: [
    { system: "PPTAgent", content: 3.5, design: 3.8, coherence: 3.6, presentBench: 63, slidesGen: 0.74 },
    { system: "DeepPresenter", content: 3.7, design: 3.7, coherence: 3.4, presentBench: 64, slidesGen: 0.76 },
    { system: "Kimi Slides", content: 3.9, design: 4.2, coherence: 4.0, presentBench: 73, slidesGen: 0.79 },
    { system: "Manus", content: 3.6, design: 3.8, coherence: 3.5, presentBench: 61, slidesGen: 0.72 },
    { system: "SlideLab", ours: true, content: 4.1, design: 4.4, coherence: 4.2, presentBench: 71, slidesGen: 0.84 },
  ],
} as const;

/** Table 5 — system rank under each evaluation framework. 1 is best. */
export const ranks = {
  frameworks: ["Human", "ConfArena", "PPTEval", "PresentBench", "SlidesGen-Bench"],
  rows: [
    { system: "SlideLab", ours: true, ranks: [1, 1, 1, 2, 1] },
    { system: "Kimi Slides", ranks: [2, 2, 2, 1, 2] },
    { system: "Manus", ranks: [3, 3, 3, 4, 4] },
    { system: "DeepPresenter", ranks: [3, 4, 4, 3, 3] },
  ],
} as const;

/** Table 6 — can each framework detect a planted failure?
    yes = the relevant metric moved as expected, no = it did not,
    none = the framework has no metric for that failure at all. */
export const perturbations = {
  frameworks: ["PPTEval", "SlidesGen-Bench", "PresentBench", "ConfArena"],
  rows: [
    { damage: "Falsified number", verdicts: ["yes", "no", "no", "yes"] },
    { damage: "Degraded figure", verdicts: ["yes", "yes", "yes", "yes"] },
    { damage: "Dropped slide", verdicts: ["none", "no", "no", "yes"] },
    { damage: "Shuffled order", verdicts: ["yes", "yes", "yes", "yes"] },
  ],
  caught: [3, 1, 2, 4],
} as const;

/** Table 7 — each planted failure moves mainly its own metric.
    Positive means worse. The targeted metric is marked. */
export const sensitivity = {
  rows: [
    { damage: "Shuffle slide order", narrative: 7.25, grounding: 0.11, figure: -0.01, target: "narrative" },
    { damage: "Inject one false number", narrative: 0.5, grounding: 1.51, figure: 0.2, target: "grounding" },
    { damage: "Shrink figures by 50%", narrative: 0.25, grounding: -0.17, figure: 0.51, target: "figure" },
    { damage: "Drop slides", narrative: 2.5, grounding: 0.01, figure: -0.01, target: "narrative" },
  ],
} as const;

/** Appendix Table 10 — average per deck, from production logs. */
export const cost = {
  stages: [
    { stage: "Planner", seconds: 96, dollars: 0.1, tokens: 0.09 },
    { stage: "Slide Generator", seconds: 264, dollars: 0.03, tokens: 0.23 },
    { stage: "Visual Generator + Compositor", seconds: 261, dollars: 0.42, tokens: 0.32 },
    { stage: "LayoutDebugger", seconds: 122, dollars: 0.03, tokens: 0.05 },
  ],
  total: { seconds: 744, dollars: 0.58, tokens: 0.69 },
  deepPresenter: { seconds: 1620, dollars: 2.1, tokens: 2.9 },
} as const;

/** Appendix Table 8 — the model behind each stage. */
export const stageConfig = [
  { stage: "Planner", model: "gpt-5.5", rounds: "60" },
  { stage: "Slide Generator", model: "mimo-v2.5-pro", rounds: "50" },
  { stage: "Visual Generator", model: "mimo-v2.5-pro", rounds: "15" },
  { stage: "Compositor", model: "mimo-v2.5-pro", rounds: "30" },
  { stage: "LayoutDebugger", model: "gpt-5.5", rounds: "5 per slide" },
  { stage: "Narration Engine", model: "mimo-v2.5-pro", rounds: "15" },
] as const;

/** Appendix Table 9 — the three attendees, quoted from the paper. */
export const attendees = [
  {
    name: "Expert reviewer",
    focus: "Scientific rigor and correctness.",
    trigger:
      "Asks a question when a claim, result, or numerical value appears unsupported, inconsistent, or overstated.",
  },
  {
    name: "Learner",
    focus: "Whether the core ideas, methodology, and motivation are easy to follow.",
    trigger: "Asks a question when an important concept or step is insufficiently explained.",
  },
  {
    name: "Cross-field attendee",
    focus: "Accessibility without deep subfield knowledge.",
    trigger:
      "Asks a question when jargon or field-specific assumptions are introduced without adequate explanation.",
  },
] as const;

/** Appendix Table 11 — what annotators rate after picking a deck. */
export const humanDimensions = [
  { name: "Content grounding", question: "Do the slides match what the paper says?" },
  { name: "Content coverage", question: "Does the deck cover the paper's key contributions?" },
  { name: "Narrative structure", question: "Do the slides tell a coherent story?" },
  { name: "Visual design", question: "Does it look like a professional conference talk?" },
  { name: "Information density", question: "Are slides concise, not walls of text?" },
  { name: "Figure usage", question: "Are figures well-chosen and sized correctly?" },
] as const;
