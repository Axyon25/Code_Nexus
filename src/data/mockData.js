/**
 * Demo dataset for the Truth Nuke frontend.
 * Everything in this file is illustrative sample content. No backend, AI model
 * or file processing is connected in this build.
 */

export const organisation = {
  name: 'Northwind Labs',
  domain: 'northwind.co',
  plan: 'Enterprise',
  industry: 'Consumer technology',
  timezone: 'Europe/London',
  members: 24,
  description:
    'Calm, considered technology for everyday life. Northwind designs connected home products and the services around them.',
}

export const users = [
  {
    id: 'u1',
    name: 'Maya Chen',
    email: 'maya.chen@northwind.co',
    role: 'Manager',
    title: 'Head of Brand Governance',
    avatarTone: 'blue',
    status: 'active',
    location: 'London, UK',
    joinedAt: '2023-02-14T09:00:00.000Z',
    lastActive: '2026-11-06T11:42:00.000Z',
  },
  {
    id: 'u2',
    name: 'Daniel Okafor',
    email: 'daniel.okafor@northwind.co',
    role: 'Reviewer',
    title: 'Senior Brand Reviewer',
    avatarTone: 'emerald',
    status: 'active',
    location: 'Manchester, UK',
    joinedAt: '2023-06-01T09:00:00.000Z',
    lastActive: '2026-11-06T10:18:00.000Z',
  },
  {
    id: 'u3',
    name: 'Priya Nair',
    email: 'priya.nair@northwind.co',
    role: 'Creator',
    title: 'Content Strategist',
    avatarTone: 'violet',
    status: 'active',
    location: 'Bengaluru, IN',
    joinedAt: '2024-01-08T09:00:00.000Z',
    lastActive: '2026-11-06T09:55:00.000Z',
  },
  {
    id: 'u4',
    name: 'Lucas Meyer',
    email: 'lucas.meyer@northwind.co',
    role: 'Reviewer',
    title: 'Legal & Compliance Reviewer',
    avatarTone: 'amber',
    status: 'active',
    location: 'Berlin, DE',
    joinedAt: '2023-09-19T09:00:00.000Z',
    lastActive: '2026-11-05T16:22:00.000Z',
  },
  {
    id: 'u5',
    name: 'Sofia Alvarez',
    email: 'sofia.alvarez@northwind.co',
    role: 'Creator',
    title: 'Product Marketing Lead',
    avatarTone: 'rose',
    status: 'active',
    location: 'Madrid, ES',
    joinedAt: '2024-03-11T09:00:00.000Z',
    lastActive: '2026-11-06T08:37:00.000Z',
  },
  {
    id: 'u6',
    name: 'Ethan Wright',
    email: 'ethan.wright@northwind.co',
    role: 'Manager',
    title: 'Brand Operations Manager',
    avatarTone: 'teal',
    status: 'active',
    location: 'Toronto, CA',
    joinedAt: '2022-11-02T09:00:00.000Z',
    lastActive: '2026-11-04T14:08:00.000Z',
  },
  {
    id: 'u7',
    name: 'Nadia Haddad',
    email: 'nadia.haddad@northwind.co',
    role: 'Reviewer',
    title: 'Accessibility Lead',
    avatarTone: 'cyan',
    status: 'active',
    location: 'Dubai, AE',
    joinedAt: '2024-05-20T09:00:00.000Z',
    lastActive: '2026-11-06T07:51:00.000Z',
  },
  {
    id: 'u8',
    name: 'Jonas Berg',
    email: 'jonas.berg@northwind.co',
    role: 'Creator',
    title: 'Lifecycle Marketing',
    avatarTone: 'slate',
    status: 'invited',
    location: 'Stockholm, SE',
    joinedAt: '2026-11-05T09:00:00.000Z',
    lastActive: null,
  },
]

export const currentUserId = 'u1'

export const guidelines = [
  {
    id: 'g-bv-01',
    code: 'BV-001',
    title: 'Speak as one team, in the first person',
    category: 'Brand Voice',
    description:
      'Use “we” and “our”. Avoid referring to Northwind in the third person or opening with corporate pluralism such as “At Northwind, we believe”. Start with the belief itself.',
    severity: 'Medium',
    source: 'Brand Book v4.2 · §2.1',
    status: 'active',
    ownerId: 'u1',
    updatedAt: '2026-10-18T10:00:00.000Z',
    example: 'Say “We believe technology should feel effortless”, not “At Northwind, we believe…”.',
  },
  {
    id: 'g-bv-02',
    code: 'BV-002',
    title: 'Warm, direct, quietly confident',
    category: 'Brand Voice',
    description:
      'Write with calm certainty. Avoid hype, aggressive language and promises about dominance. Replace superlatives with specific, supportable facts.',
    severity: 'Medium',
    source: 'Brand Book v4.2 · §2.3',
    status: 'active',
    ownerId: 'u1',
    updatedAt: '2026-10-18T10:00:00.000Z',
    example: 'Prefer “We aim to lead our category” over “We will dominate the category”.',
  },
  {
    id: 'g-bv-03',
    code: 'BV-003',
    title: 'No hype or exclamation stacks',
    category: 'Brand Voice',
    description:
      'Avoid exclamation marks in body copy, stacked emphasis and words such as “simply” or “just” in instructions. Respect the reader’s time and competence.',
    severity: 'Low',
    source: 'Brand Book v4.2 · §2.4',
    status: 'active',
    ownerId: 'u5',
    updatedAt: '2026-09-02T10:00:00.000Z',
    example: '“Open the app” rather than “Simply open the app!”',
  },
  {
    id: 'g-af-01',
    code: 'AF-001',
    title: 'Use only approved product specifications',
    category: 'Approved Facts',
    description:
      'Product capabilities, materials and compatibility must match the current Approved Facts Register. Never round up, extrapolate or merge specifications from different products.',
    severity: 'Critical',
    source: 'Approved Facts Register · 2026-Q4',
    status: 'active',
    ownerId: 'u2',
    updatedAt: '2026-10-29T10:00:00.000Z',
    example: 'Aurora X1 enclosure: 92% recycled aluminium. Battery assembly is not recyclable.',
  },
  {
    id: 'g-af-02',
    code: 'AF-002',
    title: 'Quantified claims need a named source',
    category: 'Approved Facts',
    description:
      'Every statistic, percentage, financial figure or satisfaction score needs an approved source reference. Add the source in the review notes even when it is not published.',
    severity: 'Critical',
    source: 'Evidence Standard · §3.2',
    status: 'active',
    ownerId: 'u4',
    updatedAt: '2026-10-11T10:00:00.000Z',
    example: '“87% of pilot participants rated Aurora X1 four stars or higher (2026 Pilot, n=120)”.',
  },
  {
    id: 'g-af-03',
    code: 'AF-003',
    title: 'Date references must be current',
    category: 'Approved Facts',
    description:
      'Offers, availability windows and report periods must match the current quarter. Any date in published content must be verified against the content calendar before approval.',
    severity: 'High',
    source: 'Editorial Handbook · §5.6',
    status: 'active',
    ownerId: 'u6',
    updatedAt: '2026-09-27T10:00:00.000Z',
    example: 'Q4 2026 offers run until 31 December 2026.',
  },
  {
    id: 'g-tb-01',
    code: 'TB-001',
    title: 'Use sentence case for headings',
    category: 'Terminology',
    description:
      'Headings and interface labels use sentence case. All-caps is reserved for short acronyms and never used for full sentences or emphasis.',
    severity: 'Low',
    source: 'Design Language · §4.1',
    status: 'active',
    ownerId: 'u7',
    updatedAt: '2026-08-15T10:00:00.000Z',
    example: '“Set up your Aurora” rather than “SET UP YOUR AURORA”.',
  },
  {
    id: 'g-tb-02',
    code: 'TB-002',
    title: 'Use “use”, not “utilise” or “leverage”',
    category: 'Terminology',
    description:
      'Prefer plain verbs. “Utilise”, “leverage” and “facilitate” add distance between the brand and the reader. Use “use”, “help” or “work with”.',
    severity: 'Medium',
    source: 'Brand Book v4.2 · §3.2',
    status: 'active',
    ownerId: 'u3',
    updatedAt: '2026-07-30T10:00:00.000Z',
    example: '“Use the companion app” — not “Utilise the companion app”.',
  },
  {
    id: 'g-tb-03',
    code: 'TB-003',
    title: 'Our audience are “members”, not “users”',
    category: 'Terminology',
    description:
      'Northwind communities are “members”. Avoid “users” or “consumers” in customer-facing content. B2B contexts may use “customers” only when referring to a commercial account.',
    severity: 'Medium',
    source: 'Brand Book v4.2 · §3.4',
    status: 'active',
    ownerId: 'u5',
    updatedAt: '2026-08-22T10:00:00.000Z',
    example: '“Our members helped shape Aurora X1.”',
  },
  {
    id: 'g-tb-04',
    code: 'TB-004',
    title: 'Prefer plain, specific language',
    category: 'Terminology',
    description:
      'Replace abstract collective nouns such as “stakeholders” with the people or teams you actually mean. Keep sentences below 28 words where possible.',
    severity: 'Low',
    source: 'Editorial Handbook · §3.1',
    status: 'review',
    ownerId: 'u3',
    updatedAt: '2026-10-30T10:00:00.000Z',
    example: 'Say “partners and internal teams” rather than “stakeholders”.',
  },
  {
    id: 'g-mc-01',
    code: 'MC-001',
    title: 'No unverifiable superlatives',
    category: 'Marketing Claims',
    description:
      'Avoid “world’s first”, “best”, “fastest” and “number one” unless the claim is covered by a current, dated verification report attached to the review.',
    severity: 'High',
    source: 'Marketing Claims Policy · §1.1',
    status: 'active',
    ownerId: 'u4',
    updatedAt: '2026-10-02T10:00:00.000Z',
    example: 'Replace “the world’s best smart speaker” with a specific, verified capability.',
  },
  {
    id: 'g-mc-02',
    code: 'MC-002',
    title: 'Comparative claims need substantiation',
    category: 'Marketing Claims',
    description:
      'Any comparison against a competitor, category or earlier version must name the comparison, the date and the methodology. Attach the benchmark to the review record.',
    severity: 'High',
    source: 'Marketing Claims Policy · §1.3',
    status: 'active',
    ownerId: 'u4',
    updatedAt: '2026-09-14T10:00:00.000Z',
    example: '“Setup completed in a median of 48 seconds (internal benchmark, October 2026).”',
  },
  {
    id: 'g-mc-03',
    code: 'MC-003',
    title: 'No health claims without clinical evidence',
    category: 'Marketing Claims',
    description:
      'Wellness, stress, sleep and health claims require peer-reviewed clinical evidence reviewed by Legal. Internal usability studies cannot be described as clinical proof.',
    severity: 'Critical',
    source: 'Legal Playbook 2026 · §4.2',
    status: 'active',
    ownerId: 'u4',
    updatedAt: '2026-10-05T10:00:00.000Z',
    example: 'Say “tested with 120 volunteers to support everyday focus” — not “clinically proven”.',
  },
  {
    id: 'g-mc-04',
    code: 'MC-004',
    title: 'No environmental claims without verification',
    category: 'Marketing Claims',
    description:
      'Carbon, recycling and sustainability claims require third-party verification and must state the boundary of the claim. Avoid “carbon neutral” and “fully recyclable” without certification.',
    severity: 'Critical',
    source: 'Sustainability Comms Standard · §2',
    status: 'review',
    ownerId: 'u6',
    updatedAt: '2026-10-25T10:00:00.000Z',
    example: 'State the verified percentage and what it covers, including exclusions.',
  },
  {
    id: 'g-ac-01',
    code: 'AC-001',
    title: 'Meet WCAG 2.2 AA contrast',
    category: 'Accessibility',
    description:
      'Text and meaningful interface elements must meet WCAG 2.2 AA contrast ratios: 4.5:1 for body text and 3:1 for large text and interface components.',
    severity: 'High',
    source: 'WCAG 2.2 AA · 1.4.3',
    status: 'active',
    ownerId: 'u7',
    updatedAt: '2026-06-18T10:00:00.000Z',
    example: 'Never place body text directly on a decorative image or low-contrast glass surface.',
  },
  {
    id: 'g-ac-02',
    code: 'AC-002',
    title: 'Link text must describe its destination',
    category: 'Accessibility',
    description:
      'Use descriptive link text that makes sense out of context. Avoid “click here”, “read more” and bare URLs. Do not rely on colour alone to signal a link.',
    severity: 'High',
    source: 'WCAG 2.2 AA · 2.4.4',
    status: 'active',
    ownerId: 'u7',
    updatedAt: '2026-06-18T10:00:00.000Z',
    example: '“Download the 2026 Sustainability Report (PDF, 3.2 MB)”.',
  },
  {
    id: 'g-ac-03',
    code: 'AC-003',
    title: 'Avoid all-caps runs longer than three words',
    category: 'Accessibility',
    description:
      'Long all-caps passages are difficult to scan and may be read letter by letter by screen readers. Use sentence case with weight or colour for emphasis.',
    severity: 'Medium',
    source: 'Accessibility Playbook · §5.2',
    status: 'active',
    ownerId: 'u7',
    updatedAt: '2026-07-08T10:00:00.000Z',
    example: '“Important: keep your device near the router during setup.”',
  },
  {
    id: 'g-cr-01',
    code: 'CR-001',
    title: 'Never disparage competitors',
    category: 'Content Restrictions',
    description:
      'Do not imply that competitors are failing, unsafe or dishonest. Compare capabilities, not character, and keep all comparisons factual.',
    severity: 'High',
    source: 'Legal Playbook 2026 · §5.1',
    status: 'active',
    ownerId: 'u4',
    updatedAt: '2026-09-09T10:00:00.000Z',
    example: 'Say “the category is still maturing” rather than naming a competitor’s failure.',
  },
  {
    id: 'g-cr-02',
    code: 'CR-002',
    title: 'No guaranteed financial outcomes',
    category: 'Content Restrictions',
    description:
      'Never promise or imply guaranteed investment returns, valuations or exit outcomes. Forward-looking statements require Legal and Finance approval.',
    severity: 'Critical',
    source: 'Legal Playbook 2026 · §6.4',
    status: 'active',
    ownerId: 'u4',
    updatedAt: '2026-09-09T10:00:00.000Z',
    example: '“A long-term growth plan with no guaranteed returns.”',
  },
  {
    id: 'g-cr-03',
    code: 'CR-003',
    title: 'Do not publish confidential information',
    category: 'Content Restrictions',
    description:
      'Unreleased financials, internal notes and third-party confidential material must never appear in external content. Internal reviews still require confidentiality marking.',
    severity: 'Critical',
    source: 'Information Security Policy · §7',
    status: 'active',
    ownerId: 'u1',
    updatedAt: '2026-05-30T10:00:00.000Z',
    example: 'Share material only through the approved investor portal.',
  },
]

function makeFinding(
  id,
  category,
  severity,
  originalText,
  explanation,
  guidelineId,
  suggestedCorrection,
  status = 'pending',
  confidence = 0.94,
) {
  return {
    id,
    category,
    severity,
    originalText,
    explanation,
    guidelineId,
    suggestedCorrection,
    status,
    confidence,
  }
}

const auroraContent = `Introducing Aurora X1 — the world's first fully recyclable smart speaker.

At Northwind, we believe technology should feel effortless. The Aurora X1 is clinically proven to reduce stress by 40% and delivers the fastest setup in the industry.

Utilize the companion app to get started in under 60 seconds. Simply CLICK HERE to download the app and pair your speaker.

Early access pricing is valid until March 2025. Aurora X1 is available now across Europe and the US, with global availability to follow.

Our customers love it — 100% of users say it changed their lives.`

const sustainabilityContent = `Northwind has been carbon neutral across all operations since 2023.

In 2024, emissions fell by 62% against our 2019 baseline, and we are on track to reach net zero by 2030. These results cover our European facilities and exclude logistics partners.

We utilise third-party verification for all reported figures. Stakeholders can download the full report here.

Our customers and suppliers are essential to this progress.`

const careersContent = `Design at Northwind

We're looking for a Senior Product Designer to shape how millions of people experience everyday technology.

You'll partner with researchers and engineers to turn complex problems into calm, considered products. We value clear thinking, generous collaboration and a portfolio that shows your process.

Northwind is an equal opportunity employer. We celebrate different perspectives and make reasonable adjustments throughout our hiring process.

Apply by 30 November 2026.`

const holidayContent = `THE GIFT OF EFFORTLESS SOUND 🎁

Give them the Aurora X1 this holiday. The world's best smart speaker is now 30% off — our biggest discount ever.

Offer ends 31 December 2024. Use code SOUND30 at checkout. Click here for terms.

#Northwind #AuroraX1 #Holiday`

const docsContent = `Authentication API v2

Create a short-lived access token by exchanging your client credentials at POST /v2/token. Tokens expire after 15 minutes. Refresh tokens rotate on every use; store the latest refresh token securely.

All requests must include an Authorization header using the Bearer scheme. Requests without a token receive a 401 response with a machine-readable error code.

Need help? Contact the developer support team at developers@northwind.co.`

const investorContent = `Investors,

We are pleased to report that Northwind has closed a successful Series B. The round was oversubscribed and revenue has tripled to $48M. This is a guaranteed 5x return for early backers.

We will dominate the category. Our competitors are failing to keep up, and we intend to leverage that position aggressively.

The attached financials are unaudited and confidential. Do not share this email.`

const partnerContent = `Northwind × Solara: better sound, together.

Solara's acoustic engineering meets Northwind's approach to calm, connected home technology. Starting in January 2027, Solara will join us as our official audio partner for the Aurora product family.

The partnership does not change your devices, your data practices or your support experience. Existing warranties remain exactly as they are.

We'll share the first co-developed product later this year. Until then, read more about Solara's work in our newsroom.`

const onboardingContent = `Welcome to Northwind, {{first_name}}.

Your Aurora X1 is almost ready. To finish setting up, simply utilize the companion app and follow the on-screen steps.

IMPORTANT: KEEP YOUR DEVICE NEAR YOUR ROUTER DURING SETUP.

Questions? Click here to visit our help center. Our customers usually find answers in under two minutes.

Offer available until 30 November 2026.`

export const reviews = [
  {
    id: 'RV-1042',
    title: 'Aurora X1 launch announcement',
    contentType: 'Blog post',
    content: auroraContent,
    status: 'in-review',
    complianceScore: 68,
    revision: 2,
    createdAt: '2026-11-04T09:24:00.000Z',
    updatedAt: '2026-11-05T15:10:00.000Z',
    createdBy: 'u5',
    reviewer: 'u2',
    guidelines: ['g-bv-01', 'g-af-01', 'g-af-02', 'g-af-03', 'g-tb-02', 'g-tb-03', 'g-mc-01', 'g-mc-02', 'g-mc-03', 'g-ac-02'],
    findings: [
      makeFinding(
        'f-1042-1',
        'claims',
        'critical',
        "world's first fully recyclable smart speaker",
        'The Aurora X1 contains a lithium battery and a mixed-material driver assembly, so “fully recyclable” overstates the verified specification. “World’s first” is also an unverified superlative and is not covered by a current verification report.',
        'g-mc-01',
        'a smart speaker built with 92% recycled aluminium',
        'pending',
        0.97,
      ),
      makeFinding(
        'f-1042-2',
        'claims',
        'critical',
        'clinically proven to reduce stress by 40%',
        'This is a health claim. The 2025 internal study measured perceived focus after a short task; it was not peer reviewed and did not measure clinical stress reduction. Legal has not approved clinical language for Aurora.',
        'g-mc-03',
        'tested with 120 volunteers to support everyday focus',
        'pending',
        0.98,
      ),
      makeFinding(
        'f-1042-3',
        'claims',
        'high',
        'fastest setup in the industry',
        'A comparative leadership claim requires a named comparison set, a dated benchmark and methodology. No benchmark is attached to this review, and the current setup benchmark covers Aurora X1 only.',
        'g-mc-02',
        'a setup that most people complete in under a minute',
        'pending',
        0.94,
      ),
      makeFinding(
        'f-1042-4',
        'terminology',
        'medium',
        'Utilize',
        '“Utilize” is on the plain-language substitution list. The preferred verb is “use”.',
        'g-tb-02',
        'Use',
        'pending',
        0.99,
      ),
      makeFinding(
        'f-1042-5',
        'accessibility',
        'high',
        'CLICK HERE',
        'Link text must describe its destination and should not be written in all caps. Screen-reader users navigating by link list will hear only “click here”.',
        'g-ac-02',
        'Open the Aurora companion app',
        'pending',
        0.96,
      ),
      makeFinding(
        'f-1042-6',
        'outdated',
        'high',
        'March 2025',
        'The early-access pricing window expired in March 2025. Publishing this date would mislead readers about current offer availability.',
        'g-af-03',
        '31 March 2027',
        'pending',
        0.98,
      ),
      makeFinding(
        'f-1042-7',
        'claims',
        'critical',
        '100% of users say it changed their lives',
        'No source is attached for a 100% satisfaction claim. The 2026 Aurora pilot recorded 87% of 120 participants rating the product four stars or higher — not a life-change measure.',
        'g-af-02',
        'In our 2026 pilot, 87% of participants rated Aurora X1 four stars or higher',
        'pending',
        0.97,
      ),
      makeFinding(
        'f-1042-8',
        'voice',
        'low',
        'At Northwind, we believe',
        'The brand voice guideline asks for first-person conviction without corporate pluralism. Lead with the belief itself.',
        'g-bv-01',
        'We believe',
        'pending',
        0.88,
      ),
      makeFinding(
        'f-1042-9',
        'terminology',
        'low',
        'Our customers',
        'Northwind audiences are “members”. Reserve “customers” for commercial account contexts.',
        'g-tb-03',
        'Our members',
        'pending',
        0.91,
      ),
    ],
    comments: [
      {
        id: 'c-1042-1',
        authorId: 'u4',
        body: 'The health claim needs Legal sign-off before this goes anywhere near paid media. Please do not carry it into the social variants.',
        at: '2026-11-05T09:12:00.000Z',
      },
      {
        id: 'c-1042-2',
        authorId: 'u1',
        body: 'Agreed. Sofia, can we swap in the pilot language from the launch brief? Daniel can review the revised copy today.',
        at: '2026-11-05T10:03:00.000Z',
      },
      {
        id: 'c-1042-3',
        authorId: 'u5',
        body: 'Updated the first two paragraphs in revision 2. I am waiting on final pilot numbers from research before touching the last line.',
        at: '2026-11-05T15:10:00.000Z',
      },
    ],
    history: [
      { id: 'h-1042-1', action: 'Draft created', actorId: 'u5', note: 'Initial launch draft imported from the campaign brief.', at: '2026-11-04T09:24:00.000Z' },
      { id: 'h-1042-2', action: 'Submitted for AI review', actorId: 'u5', note: '10 brand guidelines selected.', at: '2026-11-04T09:31:00.000Z' },
      { id: 'h-1042-3', action: 'AI review completed', actorId: 'ai', note: '9 findings detected · baseline compliance 68.', at: '2026-11-04T09:32:00.000Z' },
      { id: 'h-1042-4', action: 'Changes requested', actorId: 'u2', note: 'Legal and accessibility findings must be resolved.', at: '2026-11-04T14:40:00.000Z' },
      { id: 'h-1042-5', action: 'Revision 2 submitted', actorId: 'u5', note: 'Re-ran analysis against the same guideline set.', at: '2026-11-05T15:10:00.000Z' },
    ],
  },
  {
    id: 'RV-1045',
    title: 'Aurora holiday campaign — social copy',
    contentType: 'Social',
    content: holidayContent,
    status: 'in-review',
    complianceScore: 81,
    revision: 1,
    createdAt: '2026-11-05T08:15:00.000Z',
    updatedAt: '2026-11-05T08:17:00.000Z',
    createdBy: 'u3',
    reviewer: 'u4',
    guidelines: ['g-bv-03', 'g-af-03', 'g-mc-01', 'g-mc-02', 'g-ac-02', 'g-ac-03'],
    findings: [
      makeFinding(
        'f-1045-1',
        'accessibility',
        'medium',
        'THE GIFT OF EFFORTLESS SOUND',
        'All-caps runs longer than three words are harder to scan and may be announced letter by letter by some screen readers. Use sentence case with weight for emphasis.',
        'g-ac-03',
        'The gift of effortless sound',
        'pending',
        0.95,
      ),
      makeFinding(
        'f-1045-2',
        'claims',
        'high',
        "world's best smart speaker",
        '“World’s best” is an unverifiable superlative. The Aurora X1 holds two 2026 design awards, which does not support a category-wide leadership claim.',
        'g-mc-01',
        'the Aurora X1',
        'pending',
        0.96,
      ),
      makeFinding(
        'f-1045-3',
        'claims',
        'high',
        'our biggest discount ever',
        'A “biggest ever” claim needs a dated comparison across all prior promotions. The promo calendar only verifies this as the best offer of the 2026 holiday season.',
        'g-mc-02',
        'a seasonal saving available until 31 December',
        'pending',
        0.91,
      ),
      makeFinding(
        'f-1045-4',
        'outdated',
        'high',
        '31 December 2024',
        'The offer end date is two years out of date. Current offer windows must match the Q4 2026 content calendar.',
        'g-af-03',
        '31 December 2026',
        'pending',
        0.99,
      ),
      makeFinding(
        'f-1045-5',
        'accessibility',
        'medium',
        'Click here',
        '“Click here” does not describe the destination. Use link text that makes sense when read out of context.',
        'g-ac-02',
        'Read the offer terms',
        'pending',
        0.92,
      ),
    ],
    comments: [
      {
        id: 'c-1045-1',
        authorId: 'u3',
        body: 'This is scheduled for the holiday social flight. The offer code and dates are locked with Growth.',
        at: '2026-11-05T08:30:00.000Z',
      },
      {
        id: 'c-1045-2',
        authorId: 'u4',
        body: 'Checking whether the discount comparison is covered by the promo calendar. Do not schedule until the date is corrected.',
        at: '2026-11-05T11:02:00.000Z',
      },
    ],
    history: [
      { id: 'h-1045-1', action: 'Draft created', actorId: 'u3', note: 'Social copy for the holiday campaign.', at: '2026-11-05T08:15:00.000Z' },
      { id: 'h-1045-2', action: 'Submitted for AI review', actorId: 'u3', note: '6 brand guidelines selected.', at: '2026-11-05T08:16:00.000Z' },
      { id: 'h-1045-3', action: 'AI review completed', actorId: 'ai', note: '5 findings detected · baseline compliance 81.', at: '2026-11-05T08:17:00.000Z' },
      { id: 'h-1045-4', action: 'Assigned to reviewer', actorId: 'u1', note: 'Assigned to Lucas Meyer for legal sensitivity review.', at: '2026-11-05T09:20:00.000Z' },
    ],
  },
  {
    id: 'RV-1038',
    title: 'Q3 sustainability report — executive summary',
    contentType: 'Report',
    content: sustainabilityContent,
    status: 'changes-requested',
    complianceScore: 74,
    revision: 3,
    createdAt: '2026-11-03T13:05:00.000Z',
    updatedAt: '2026-11-04T16:35:00.000Z',
    createdBy: 'u3',
    reviewer: 'u7',
    guidelines: ['g-af-02', 'g-af-03', 'g-tb-02', 'g-tb-03', 'g-tb-04', 'g-mc-04', 'g-ac-02'],
    findings: [
      makeFinding(
        'f-1038-1',
        'claims',
        'critical',
        'carbon neutral across all operations since 2023',
        'The claim excludes logistics partners and is based on purchased offsets, which the current Sustainability Comms Standard no longer permits as a “carbon neutral” statement. Certification expired in 2024.',
        'g-mc-04',
        'on a verified path to net zero across our own operations by 2030',
        'pending',
        0.97,
      ),
      makeFinding(
        'f-1038-2',
        'outdated',
        'high',
        'In 2024, emissions fell by 62%',
        'The 2026 report cites 2024 figures. The latest audited result is a 41% year-on-year reduction for 2026. Using the older figure also overstates progress.',
        'g-af-03',
        'In 2026, emissions fell by 41%',
        'pending',
        0.98,
      ),
      makeFinding(
        'f-1038-3',
        'terminology',
        'medium',
        'utilise',
        'Prefer the plain verb “use”.',
        'g-tb-02',
        'use',
        'pending',
        0.98,
      ),
      makeFinding(
        'f-1038-4',
        'terminology',
        'low',
        'Stakeholders',
        'Name the people or groups involved instead of the collective noun “stakeholders”.',
        'g-tb-04',
        'Partners and internal teams',
        'pending',
        0.84,
      ),
      makeFinding(
        'f-1038-5',
        'accessibility',
        'medium',
        'here',
        'Bare “here” link text does not describe the destination. Include the document name and file details.',
        'g-ac-02',
        'the 2026 Sustainability Report (PDF, 3.2 MB)',
        'pending',
        0.9,
      ),
      makeFinding(
        'f-1038-6',
        'terminology',
        'low',
        'Our customers and suppliers',
        'Our consumer community are “members”. “Suppliers” should be “partners” in external sustainability reporting.',
        'g-tb-03',
        'Our members and partners',
        'pending',
        0.86,
      ),
    ],
    comments: [
      {
        id: 'c-1038-1',
        authorId: 'u7',
        body: 'Please hold publication. The offset language is not compliant with the updated sustainability standard and the emissions figure needs the 2026 audit reference.',
        at: '2026-11-04T15:20:00.000Z',
      },
      {
        id: 'c-1038-2',
        authorId: 'u3',
        body: 'Thanks Nadia. I can update the link text and terminology today; I need Finance to confirm the 2026 figure before resubmitting.',
        at: '2026-11-04T16:35:00.000Z',
      },
    ],
    history: [
      { id: 'h-1038-1', action: 'Revision 3 submitted', actorId: 'u3', note: 'Figures refreshed from the 2026 audit pack.', at: '2026-11-03T13:06:00.000Z' },
      { id: 'h-1038-2', action: 'AI review completed', actorId: 'ai', note: '6 findings detected · baseline compliance 74.', at: '2026-11-03T13:07:00.000Z' },
      { id: 'h-1038-3', action: 'Changes requested', actorId: 'u7', note: 'Sustainability and accessibility findings remain open.', at: '2026-11-04T15:20:00.000Z' },
    ],
  },
  {
    id: 'RV-1049',
    title: 'Onboarding email sequence — step 1',
    contentType: 'Email',
    content: onboardingContent,
    status: 'changes-requested',
    complianceScore: 79,
    revision: 1,
    createdAt: '2026-11-06T07:40:00.000Z',
    updatedAt: '2026-11-06T08:05:00.000Z',
    createdBy: 'u3',
    reviewer: 'u7',
    guidelines: ['g-bv-03', 'g-tb-02', 'g-tb-03', 'g-ac-02', 'g-ac-03'],
    findings: [
      makeFinding(
        'f-1049-1',
        'accessibility',
        'high',
        'IMPORTANT: KEEP YOUR DEVICE NEAR YOUR ROUTER DURING SETUP.',
        'This is a full-sentence all-caps run. It may be read letter by letter and is harder to scan. Use sentence case with weight for emphasis.',
        'g-ac-03',
        'Important: keep your device near your router during setup.',
        'pending',
        0.97,
      ),
      makeFinding(
        'f-1049-2',
        'terminology',
        'medium',
        'simply utilize',
        '“Utilize” is on the plain-language substitution list, and “simply” can read as condescending in instructions.',
        'g-tb-02',
        'use',
        'pending',
        0.93,
      ),
      makeFinding(
        'f-1049-3',
        'accessibility',
        'medium',
        'Click here',
        'Link text should describe where it goes. Use a destination-specific label.',
        'g-ac-02',
        'Visit the Aurora setup help center',
        'pending',
        0.92,
      ),
      makeFinding(
        'f-1049-4',
        'terminology',
        'low',
        'Our customers',
        'Northwind audiences are “members”.',
        'g-tb-03',
        'Our members',
        'pending',
        0.9,
      ),
    ],
    comments: [
      {
        id: 'c-1049-1',
        authorId: 'u7',
        body: 'Two accessibility blockers before this can ship. The all-caps instruction is especially problematic in the plain-text version.',
        at: '2026-11-06T08:05:00.000Z',
      },
    ],
    history: [
      { id: 'h-1049-1', action: 'Draft created', actorId: 'u3', note: 'Lifecycle email sequence, step 1 of 5.', at: '2026-11-06T07:40:00.000Z' },
      { id: 'h-1049-2', action: 'AI review completed', actorId: 'ai', note: '4 findings detected · baseline compliance 79.', at: '2026-11-06T07:41:00.000Z' },
      { id: 'h-1049-3', action: 'Changes requested', actorId: 'u7', note: 'Accessibility findings must be resolved.', at: '2026-11-06T08:05:00.000Z' },
    ],
  },
  {
    id: 'RV-1034',
    title: 'Careers page — senior product designer',
    contentType: 'Website',
    content: careersContent,
    status: 'approved',
    complianceScore: 96,
    revision: 2,
    createdAt: '2026-10-30T10:12:00.000Z',
    updatedAt: '2026-10-31T11:25:00.000Z',
    createdBy: 'u5',
    reviewer: 'u2',
    guidelines: ['g-bv-02', 'g-af-02', 'g-tb-03', 'g-ac-02'],
    findings: [
      makeFinding(
        'f-1034-1',
        'claims',
        'high',
        'millions of people',
        'The reach figure is not tied to an approved source. Use the verified member figure from the current facts register.',
        'g-af-02',
        'more than two million people',
        'accepted',
        0.9,
      ),
      makeFinding(
        'f-1034-2',
        'voice',
        'low',
        'generous collaboration',
        '“Generous collaboration” reads as a value statement without a concrete behaviour. The voice guide prefers specific, grounded language.',
        'g-bv-02',
        'thoughtful collaboration',
        'accepted',
        0.82,
      ),
    ],
    comments: [
      {
        id: 'c-1034-1',
        authorId: 'u2',
        body: 'Both corrections applied and verified against the facts register. Approved for the careers page refresh.',
        at: '2026-10-31T11:25:00.000Z',
      },
    ],
    history: [
      { id: 'h-1034-1', action: 'AI review completed', actorId: 'ai', note: '2 findings detected · baseline compliance 88.', at: '2026-10-30T10:14:00.000Z' },
      { id: 'h-1034-2', action: 'Suggestions accepted', actorId: 'u5', note: '2 of 2 AI suggestions accepted by the creator.', at: '2026-10-30T15:02:00.000Z' },
      { id: 'h-1034-3', action: 'Approved', actorId: 'u2', note: 'Human review completed. Approved for publication.', at: '2026-10-31T11:25:00.000Z' },
    ],
  },
  {
    id: 'RV-1031',
    title: 'Investor update — Series B close',
    contentType: 'Email',
    content: investorContent,
    status: 'rejected',
    complianceScore: 52,
    revision: 1,
    createdAt: '2026-10-24T09:00:00.000Z',
    updatedAt: '2026-10-24T16:10:00.000Z',
    createdBy: 'u6',
    reviewer: 'u4',
    guidelines: ['g-bv-02', 'g-af-02', 'g-tb-02', 'g-cr-01', 'g-cr-02', 'g-cr-03'],
    findings: [
      makeFinding(
        'f-1031-1',
        'off-brand',
        'critical',
        'guaranteed 5x return',
        'This promises a financial outcome, which is prohibited in every investor communication. It also creates regulatory exposure because no return can be guaranteed.',
        'g-cr-02',
        'a long-term growth plan with no guaranteed returns',
        'pending',
        0.99,
      ),
      makeFinding(
        'f-1031-2',
        'claims',
        'critical',
        'revenue has tripled to $48M',
        'The figure does not match the FY2026 audited statements ($41M, 2.1× growth). Unaudited figures also require a named source.',
        'g-af-02',
        'audited revenue grew 2.1× year on year to $41M (FY2026)',
        'pending',
        0.99,
      ),
      makeFinding(
        'f-1031-3',
        'off-brand',
        'high',
        'Our competitors are failing to keep up',
        'The brand policy prohibits disparaging competitors. Compare capabilities, not the character or performance of other companies.',
        'g-cr-01',
        'The category is still maturing',
        'pending',
        0.96,
      ),
      makeFinding(
        'f-1031-4',
        'voice',
        'high',
        'We will dominate the category',
        'This conflicts with the quietly confident voice. State ambition without claims of dominance.',
        'g-bv-02',
        'We aim to lead our category',
        'pending',
        0.94,
      ),
      makeFinding(
        'f-1031-5',
        'terminology',
        'medium',
        'leverage',
        'Use the plain verb “use”.',
        'g-tb-02',
        'use',
        'pending',
        0.98,
      ),
      makeFinding(
        'f-1031-6',
        'off-brand',
        'critical',
        'The attached financials are unaudited and confidential.',
        'Confidential financial material must not be circulated by email, and the document is mislabelled: Finance has confirmed the attached pack is the audited version.',
        'g-cr-03',
        'The attached audited financials are confidential.',
        'pending',
        0.95,
      ),
    ],
    comments: [
      {
        id: 'c-1031-1',
        authorId: 'u4',
        body: 'This cannot be corrected editorially. The financial claims and the confidentiality breach require a new draft with Finance and Legal in the room.',
        at: '2026-10-24T16:10:00.000Z',
      },
    ],
    history: [
      { id: 'h-1031-1', action: 'AI review completed', actorId: 'ai', note: '6 findings detected · baseline compliance 52.', at: '2026-10-24T09:02:00.000Z' },
      { id: 'h-1031-2', action: 'Rejected', actorId: 'u4', note: 'Regulated financial claims and confidential material. New draft required.', at: '2026-10-24T16:10:00.000Z' },
    ],
  },
  {
    id: 'RV-1029',
    title: 'Partner announcement: Northwind × Solara',
    contentType: 'Website',
    content: partnerContent,
    status: 'approved',
    complianceScore: 93,
    revision: 1,
    createdAt: '2026-10-21T11:40:00.000Z',
    updatedAt: '2026-10-22T09:15:00.000Z',
    createdBy: 'u5',
    reviewer: 'u2',
    guidelines: ['g-bv-01', 'g-af-03', 'g-ac-02', 'g-cr-01'],
    findings: [
      makeFinding(
        'f-1029-1',
        'outdated',
        'low',
        'later this year',
        'Relative time references become stale quickly. Use the confirmed launch window from the partnership plan.',
        'g-af-03',
        'in spring 2027',
        'accepted',
        0.86,
      ),
      makeFinding(
        'f-1029-2',
        'accessibility',
        'medium',
        "read more about Solara's work in our newsroom",
        'The link text is vague out of context. Name the content being linked to.',
        'g-ac-02',
        "read the Solara partner profile in our newsroom",
        'accepted',
        0.88,
      ),
    ],
    comments: [
      {
        id: 'c-1029-1',
        authorId: 'u2',
        body: 'Both suggestions accepted and the partner quote was cleared by Solara comms. Approved for publication.',
        at: '2026-10-22T09:15:00.000Z',
      },
    ],
    history: [
      { id: 'h-1029-1', action: 'AI review completed', actorId: 'ai', note: '2 findings detected · baseline compliance 89.', at: '2026-10-21T11:42:00.000Z' },
      { id: 'h-1029-2', action: 'Suggestions accepted', actorId: 'u5', note: '2 of 2 AI suggestions accepted by the creator.', at: '2026-10-21T14:08:00.000Z' },
      { id: 'h-1029-3', action: 'Approved', actorId: 'u2', note: 'Human review completed. Approved for publication.', at: '2026-10-22T09:15:00.000Z' },
    ],
  },
  {
    id: 'RV-1047',
    title: 'Developer docs — authentication v2',
    contentType: 'Documentation',
    content: docsContent,
    status: 'draft',
    complianceScore: 100,
    revision: 1,
    createdAt: '2026-11-06T06:15:00.000Z',
    updatedAt: '2026-11-06T06:15:00.000Z',
    createdBy: 'u3',
    reviewer: null,
    guidelines: ['g-bv-01', 'g-af-01', 'g-tb-01', 'g-tb-02', 'g-ac-02'],
    findings: [],
    comments: [],
    history: [
      { id: 'h-1047-1', action: 'Draft created', actorId: 'u3', note: 'Not yet submitted for review.', at: '2026-11-06T06:15:00.000Z' },
    ],
  },
]

export const dashboardStats = {
  totalReviews: 248,
  pendingReviews: 12,
  approvedContent: 196,
  issuesDetected: 342,
  totalTrend: 12.4,
  pendingTrend: -8.2,
  approvedTrend: 9.7,
  issuesTrend: -14.6,
}

export const teamActivity = [
  { id: 'a1', actorId: 'u2', action: 'approved', target: 'Careers page — senior product designer', targetId: 'RV-1034', at: '2026-10-31T11:25:00.000Z' },
  { id: 'a2', actorId: 'u7', action: 'requested changes on', target: 'Onboarding email sequence', targetId: 'RV-1049', at: '2026-11-06T08:05:00.000Z' },
  { id: 'a3', actorId: 'u3', action: 'submitted a revision of', target: 'Q3 sustainability report', targetId: 'RV-1038', at: '2026-11-04T16:35:00.000Z' },
  { id: 'a4', actorId: 'u1', action: 'added 3 rules to', target: 'Marketing Claims guidelines', targetId: null, at: '2026-11-04T12:10:00.000Z' },
  { id: 'a5', actorId: 'u5', action: 'accepted 2 suggestions in', target: 'Aurora X1 launch announcement', targetId: 'RV-1042', at: '2026-11-05T15:10:00.000Z' },
  { id: 'a6', actorId: 'u4', action: 'rejected', target: 'Investor update — Series B close', targetId: 'RV-1031', at: '2026-10-24T16:10:00.000Z' },
]

export const notifications = [
  {
    id: 'n1',
    title: 'Daniel mentioned you in a review',
    body: 'Aurora X1 launch announcement is waiting for your decision.',
    at: '2026-11-06T11:18:00.000Z',
    read: false,
    href: '/approvals',
    tone: 'blue',
  },
  {
    id: 'n2',
    title: 'AI review complete',
    body: 'Holiday campaign social copy was analysed against 6 guidelines.',
    at: '2026-11-05T08:17:00.000Z',
    read: false,
    href: '/review/RV-1045',
    tone: 'violet',
  },
  {
    id: 'n3',
    title: 'Revision awaiting review',
    body: 'Priya Nair resubmitted the Q3 sustainability report summary.',
    at: '2026-11-04T16:35:00.000Z',
    read: false,
    href: '/review/RV-1038',
    tone: 'amber',
  },
  {
    id: 'n4',
    title: 'Guideline needs review',
    body: 'MC-004 environmental claims is past its review date.',
    at: '2026-11-03T09:00:00.000Z',
    read: true,
    href: '/guidelines',
    tone: 'rose',
  },
  {
    id: 'n5',
    title: 'Weekly governance digest',
    body: '12 reviews completed · 34 findings resolved · 4.2h saved.',
    at: '2026-11-02T07:30:00.000Z',
    read: true,
    href: '/dashboard',
    tone: 'emerald',
  },
]

export const chartData = (() => {
  const today = new Date()
  return Array.from({ length: 90 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (89 - index))
    const wave = Math.sin(index / 4.2) * 2.4 + Math.sin(index / 9.5) * 3.1
    const reviews = Math.max(2, Math.round(6.5 + wave))
    const issues = Math.max(3, Math.round(reviews * 2.4 + Math.cos(index / 3.1) * 3))
    return {
      date: date.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date),
      reviews,
      issues,
      resolved: Math.max(1, Math.round(issues * 0.58)),
    }
  })
})()

export const severityHistory = [
  { name: 'Critical', value: 18, tone: 'critical' },
  { name: 'High', value: 46, tone: 'high' },
  { name: 'Medium', value: 72, tone: 'medium' },
  { name: 'Low', value: 38, tone: 'low' },
]
