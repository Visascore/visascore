export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'boolean' | 'number' | 'text';
  options?: string[];
  required: boolean;
  weight: number; // AI will use this to weigh importance
  ukviReference?: string; // Reference to official UKVI guidance
  conditionalLogic?: {
    dependsOn: string; // Question ID this depends on
    showWhen: string | string[]; // Value(s) that should trigger showing this question
  };
  endorsingBody?: string; // Specific endorsing body this question applies to
}

export interface VisaRoute {
  id: string;
  name: string;
  description: string;
  category: 'Work' | 'Education' | 'Family' | 'Visit' | 'Settlement';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  processingTime: string;
  cost: number;
  minSalary?: number;
  ukviUrl: string; // Official UK government application URL
  ukviGuidanceUrl: string; // Official UKVI guidance URL
  lastUpdated: string;
  questions: Question[];
  requirements: {
    essential: string[];
    desirable: string[];
    disqualifying: string[];
  };
  eligibilityCriteria: {
    category: string;
    criteria: string[];
    ukviReference: string;
  }[];
}

export const visaRoutes: VisaRoute[] = [
  {
    id: 'skilled-worker',
    name: 'Skilled Worker Visa',
    description: 'For skilled workers who have a job offer from a UK employer with a sponsor licence. Post-July 2025: minimum salary usually £41,700, or £25,000 for care/health workers in RQF6+ roles.',
    category: 'Work',
    difficulty: 'Medium',
    processingTime: '~3 weeks (outside UK), ~8 weeks (inside UK). Priority: 5 working days; Super Priority: next working day',
    cost: 900, // Standard fee ≤3 years: ~£885-£900
    minSalary: 41700, // Updated for post-July 2025
    ukviUrl: 'https://www.gov.uk/skilled-worker-visa/apply',
    ukviGuidanceUrl: 'https://www.gov.uk/skilled-worker-visa',
    lastUpdated: '2025-07-29',
    requirements: {
      essential: [
        'Certificate of Sponsorship (CoS) reference from UK employer with sponsor licence',
        'Job must be graduate-level (RQF 6) or on Temporary Shortage List (until end-2026)',
        'Minimum salary £41,700, or £25,000 for care/health workers in eligible RQF6+ roles',
        'Salary meets going rate for occupation (SOC code)',
        'English language requirement met (CEFR B1 or above)',
        'Financial requirement met (£1,270 maintenance funds for 28 days, unless sponsor guarantees)',
        'Valid passport or travel document',
        'Criminal record certificate if working in education, healthcare, social services'
      ],
      desirable: [
        'PhD in subject relevant to job (+10 points)',
        'PhD in STEM field relevant to job (+20 points)',
        'Job on Shortage Occupation List (+20 points)',
        'Higher salary than minimum threshold',
        'Previous UK work experience'
      ],
      disqualifying: [
        'Criminal convictions',
        'Previous immigration violations',
        'Failure to meet English language requirement',
        'Insufficient maintenance funds',
        'Invalid or expired Certificate of Sponsorship'
      ]
    },
    eligibilityCriteria: [
      {
        category: 'Sponsorship (20 points)',
        criteria: [
          'Valid Certificate of Sponsorship from licensed UK employer',
          'Job offer is genuine and meets skill level requirements',
          'Employer has valid sponsor licence'
        ],
        ukviReference: 'https://www.gov.uk/skilled-worker-visa/your-job'
      },
      {
        category: 'Skill Level (20 points)',
        criteria: [
          'Job is graduate-level (RQF Level 6 or above)',
          'OR job is on Temporary Shortage List (valid until end-2026)',
          'Role matches Standard Occupational Classification (SOC) code'
        ],
        ukviReference: 'https://www.gov.uk/skilled-worker-visa/your-job'
      },
      {
        category: 'Salary (up to 20 points)',
        criteria: [
          'Salary is at least £41,700 per year (or £25,000 for care/health workers)',
          'Salary meets going rate for the occupation',
          'All allowances and benefits are properly documented'
        ],
        ukviReference: 'https://www.gov.uk/skilled-worker-visa/how-much-it-costs'
      },
      {
        category: 'English Language (10 points)',
        criteria: [
          'IELTS, TOEFL, or equivalent qualification at CEFR B1 level',
          'Degree taught in English from majority English-speaking country',
          'National of majority English-speaking country'
        ],
        ukviReference: 'https://www.gov.uk/skilled-worker-visa/knowledge-of-english'
      }
    ],
    questions: [
      {
        id: 'job-offer-sponsor',
        text: 'Do you have a job offer from a Home Office-approved sponsor?',
        type: 'boolean',
        required: true,
        weight: 20,
        ukviReference: 'https://www.gov.uk/skilled-worker-visa/your-job'
      },
      {
        id: 'skill-level',
        text: 'Is the job at graduate level (RQF 6 or above) or on the Temporary Shortage List (valid until end-2026)?',
        type: 'boolean',
        required: true,
        weight: 20,
        ukviReference: 'https://www.gov.uk/skilled-worker-visa/your-job'
      },
      {
        id: 'salary-threshold',
        text: 'Is your annual salary ≥ £41,700, or ≥ £25,000 if you\'re a care/health worker in an eligible RQF 6 role?',
        type: 'boolean',
        required: true,
        weight: 20,
        ukviReference: 'https://www.gov.uk/skilled-worker-visa/how-much-it-costs'
      },
      {
        id: 'going-rate',
        text: 'Does your salary meet or exceed the "going rate" for the SOC code of your job?',
        type: 'boolean',
        required: true,
        weight: 20,
        ukviReference: 'https://www.gov.uk/skilled-worker-visa/your-job'
      },
      {
        id: 'english-b1',
        text: 'Do you speak English at CEFR B1 or above?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/skilled-worker-visa/knowledge-of-english'
      },
      {
        id: 'phd-relevant',
        text: 'Do you have a PhD in a subject relevant to your job?',
        type: 'boolean',
        required: false,
        weight: 10
      },
      {
        id: 'phd-stem',
        text: 'If your PhD is in a STEM field relevant to the job, can you claim +20 points instead?',
        type: 'boolean',
        required: false,
        weight: 20
      },
      {
        id: 'shortage-list',
        text: 'Is the occupation on the Shortage Occupation List?',
        type: 'boolean',
        required: false,
        weight: 20,
        ukviReference: 'https://www.gov.uk/government/publications/skilled-worker-visa-shortage-occupations'
      },
      {
        id: 'maintenance-funds',
        text: 'Did your sponsor guarantee maintenance funds, or can you show £1,270 held for 28 days in savings?',
        type: 'boolean',
        required: true,
        weight: 5,
        ukviReference: 'https://www.gov.uk/skilled-worker-visa/money'
      },
      {
        id: 'criminal-record-cert',
        text: 'Do you provide a criminal record certificate, if required under applicable rules?',
        type: 'boolean',
        required: true,
        weight: 5
      }
    ]
  },
  {
    id: 'graduate-route',
    name: 'Graduate Route (Post-Study Work Visa)',
    description: 'For international students who completed their degree in the UK. Undergraduates/Postgrad: valid for 18 months; PhD holders: 3 years (new durations from July 2025). No job offer or sponsorship needed.',
    category: 'Work',
    difficulty: 'Easy',
    processingTime: 'Typically 8 weeks; priority services may be available',
    cost: 880, // Application fee: £880 (approx.)
    ukviUrl: 'https://www.gov.uk/graduate-visa/apply',
    ukviGuidanceUrl: 'https://www.gov.uk/graduate-visa',
    lastUpdated: '2025-07-29',
    requirements: {
      essential: [
        'Successfully completed eligible course in UK',
        'Current valid Student visa when applying',
        'Study was with licensed Student sponsor',
        'Confirmation from university that you completed your course',
        'Valid passport or identity document',
        'Proof you meet English requirement (might already be satisfied via Student visa)'
      ],
      desirable: [
        'Strong academic record',
        'Clear post-graduation plans',
        'UK work experience during studies'
      ],
      disqualifying: [
        'Did not complete course successfully',
        'Previous Graduate visa held',
        'Student visa has already expired',
        'Study visa violations'
      ]
    },
    eligibilityCriteria: [
      {
        category: 'Course Completion',
        criteria: [
          'Successfully completed UK bachelor degree or higher',
          'Course was full-time and minimum duration',
          'Studied with licensed Student sponsor',
          'University confirms course completion'
        ],
        ukviReference: 'https://www.gov.uk/graduate-visa/eligibility'
      },
      {
        category: 'Visa Duration',
        criteria: [
          'Undergraduates/Postgraduates: 18 months (from July 2025)',
          'PhD holders: 3 years (from July 2025)',
          'Can work, self-employ, look for work',
          'Can bring dependants if they were in UK on Student visa'
        ],
        ukviReference: 'https://www.gov.uk/graduate-visa'
      }
    ],
    questions: [
      {
        id: 'student-visa-current',
        text: 'Do you currently hold a Student visa?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/graduate-visa/eligibility'
      },
      {
        id: 'university-confirmation',
        text: 'Has your university confirmed course completion?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/graduate-visa/eligibility'
      },
      {
        id: 'before-expiry',
        text: 'Have you applied before your Student visa expiry?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/graduate-visa'
      },
      {
        id: 'uk-hei-degree',
        text: 'Was your degree awarded by a UK HEI?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/graduate-visa/eligibility'
      },
      {
        id: 'degree-level-duration',
        text: 'Are you an undergraduate/postgraduate (eligible for 18 months) or a PhD holder (eligible for 3 years) starting July 2025?',
        type: 'single',
        options: ['Undergraduate/Postgraduate (18 months)', 'PhD holder (3 years)', 'Not sure'],
        required: true,
        weight: 8,
        ukviReference: 'https://www.gov.uk/graduate-visa'
      }
    ]
  },
  {
    id: 'visitor-eta',
    name: 'Standard Visitor & ETA',
    description: 'Standard Visitor permits stays up to 6 months. Electronic Travel Authorisation (ETA) required for visa-exempt nationals from 2 April 2025 onward.',
    category: 'Visit',
    difficulty: 'Easy',
    processingTime: '~3 weeks for Standard Visitor; ~3 working days for ETA',
    cost: 115, // Standard Visitor ~£115 (single/6 months); ETA £16
    ukviUrl: 'https://www.gov.uk/standard-visitor-visa/apply',
    ukviGuidanceUrl: 'https://www.gov.uk/standard-visitor-visa',
    lastUpdated: '2025-07-29',
    requirements: {
      essential: [
        'Purpose statement (e.g. tourism/business/invitation)',
        'Proof of funds, accommodation, travel itinerary',
        'Ties to home country (e.g. job, family, property)',
        'Valid passport',
        'For ETA: Apply via UK ETA app or website at least 3 days before travel'
      ],
      desirable: [
        'Previous travel history',
        'Detailed itinerary',
        'Hotel bookings or invitation letter',
        'Return flight bookings'
      ],
      disqualifying: [
        'Insufficient funds',
        'No clear purpose of visit',
        'Previous immigration violations',
        'Criminal record'
      ]
    },
    eligibilityCriteria: [
      {
        category: 'Standard Visitor Visa',
        criteria: [
          'Tourism, business, or family visit purposes',
          'Stay up to 6 months',
          'Cost: ~£115 (single/6 months), up to £960 for 10-year multiple entry',
          'Apply online, book biometrics, upload documents'
        ],
        ukviReference: 'https://www.gov.uk/standard-visitor-visa'
      },
      {
        category: 'Electronic Travel Authorisation (ETA)',
        criteria: [
          'Required for visa-free nationals from 2 April 2025',
          'Apply via UK ETA app: upload passport, scan face, answer questions',
          'Pay £16, valid for 2 years or passport expiry',
          'Decision usually within 3 working days'
        ],
        ukviReference: 'https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta'
      }
    ],
    questions: [
      {
        id: 'visit-duration',
        text: 'Will your stay be ≤ 6 months (or applying for long-term return visa)?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/standard-visitor-visa'
      },
      {
        id: 'visit-purpose',
        text: 'Can you clearly state your purpose of visit (e.g. tourism, business, visiting)?',
        type: 'boolean',
        required: true,
        weight: 9,
        ukviReference: 'https://www.gov.uk/standard-visitor-visa'
      },
      {
        id: 'adequate-funds',
        text: 'Can you show adequate funds for your stay, accommodation, travel plans?',
        type: 'boolean',
        required: true,
        weight: 9,
        ukviReference: 'https://www.gov.uk/standard-visitor-visa'
      },
      {
        id: 'home-ties',
        text: 'Can you demonstrate ties to your home country (e.g. job, property, family)?',
        type: 'boolean',
        required: true,
        weight: 8,
        ukviReference: 'https://www.gov.uk/standard-visitor-visa'
      },
      {
        id: 'travel-history',
        text: 'Do you have a previous travel history, if available?',
        type: 'boolean',
        required: false,
        weight: 5
      },
      {
        id: 'eta-eligible',
        text: 'Have you applied via ETA app or website, if you are eligible—and at least 3 days before travel? (Required from 2 April 2025)',
        type: 'boolean',
        required: false,
        weight: 8,
        ukviReference: 'https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta'
      }
    ]
  },
  {
    id: 'family-partner',
    name: 'Family & Partner Visas',
    description: 'For partners or parents of UK-based individuals. Includes spouse, civil partner, unmarried partner, and parent routes.',
    category: 'Family',
    difficulty: 'Medium',
    processingTime: '8-16 weeks (outside UK), ~8 weeks (inside UK). Priority available for in-UK applications',
    cost: 1538, // Partner within UK: ~£1,538 + IHS
    ukviUrl: 'https://www.gov.uk/uk-family-visa/apply',
    ukviGuidanceUrl: 'https://www.gov.uk/uk-family-visa',
    lastUpdated: '2025-07-29',
    requirements: {
      essential: [
        'Proof of relationship (marriage/civil partnership certificate, joint accounts, photos)',
        'Sponsor\'s UK status proof (citizenship, ILR, visa)',
        'English language evidence (unless exempt)',
        'Financial requirement: joint income or savings to meet minimum threshold (~£18,600+ depending on children)',
        'TB certificate (if applicable)',
        'Identity documents (passports, previous passports) and translations'
      ],
      desirable: [
        'Extensive relationship evidence',
        'Higher income than minimum threshold',
        'Property ownership',
        'Long relationship history'
      ],
      disqualifying: [
        'Sham relationship',
        'Insufficient financial support',
        'Criminal convictions',
        'Previous immigration violations'
      ]
    },
    eligibilityCriteria: [
      {
        category: 'Relationship Requirements',
        criteria: [
          'Married to or in civil/unmarried partnership with UK citizen or settled person',
          'Genuine and subsisting relationship',
          'Intention to live together permanently',
          'Met in person and relationship is not arranged solely for immigration'
        ],
        ukviReference: 'https://www.gov.uk/uk-family-visa/partner'
      },
      {
        category: 'Financial Requirements',
        criteria: [
          'Minimum income: £18,600 per year',
          'Higher amounts required with children',
          'Can use employment, self-employment, savings, pension income',
          'Sponsor must be earning in UK or returning to UK'
        ],
        ukviReference: 'https://www.gov.uk/uk-family-visa/proof-income'
      }
    ],
    questions: [
      {
        id: 'uk-relationship',
        text: 'Are you married to or in a civil/unmarried partnership with a UK citizen or settled person?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/uk-family-visa/partner'
      },
      {
        id: 'relationship-proof',
        text: 'Can you provide proof of relationship (marriage certificate, joint finances, photos)?',
        type: 'boolean',
        required: true,
        weight: 9,
        ukviReference: 'https://www.gov.uk/uk-family-visa/documents'
      },
      {
        id: 'sponsor-status',
        text: 'Can your sponsor prove their UK status (e.g. British passport, ILR)?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/uk-family-visa/partner'
      },
      {
        id: 'english-requirement',
        text: 'Do you meet the English language requirement, unless exempt?',
        type: 'boolean',
        required: true,
        weight: 8,
        ukviReference: 'https://www.gov.uk/uk-family-visa/knowledge-of-english'
      },
      {
        id: 'financial-threshold',
        text: 'Can you meet the financial requirement (£18,600+, higher with children)?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/uk-family-visa/proof-income'
      },
      {
        id: 'documents-ready',
        text: 'Can you submit identity documents and translations, if needed?',
        type: 'boolean',
        required: true,
        weight: 7,
        ukviReference: 'https://www.gov.uk/uk-family-visa/documents'
      }
    ]
  },
  {
    id: 'global-talent',
    name: 'Global Talent Visa',
    description: 'For leaders or potential leaders in academia, research, arts, culture, or digital technology. Requires endorsement from approved bodies or qualifying international prizes.',
    category: 'Work',
    difficulty: 'Hard',
    processingTime: '~8 weeks for endorsement; 3 weeks for visa after endorsement',
    cost: 766, // Endorsement fee £561 + visa fee £205
    ukviUrl: 'https://www.gov.uk/global-talent-visa/apply',
    ukviGuidanceUrl: 'https://www.gov.uk/global-talent-visa',
    lastUpdated: '2025-07-29',
    requirements: {
      essential: [
        'Endorsement from approved body OR qualifying international prize',
        'Age 18 or above',
        'CV (max 3 pages) summarising achievements',
        'Personal statement outlining contributions and future value to UK',
        '3+ recommendation letters from field experts',
        'Evidence meeting endorsing body criteria',
        'Valid passport',
        'English language proof (if required)',
        'Maintenance funds (£1,270 for 28 days)'
      ],
      desirable: [
        'International recognition and awards',
        'Publications in top-tier journals',
        'Speaking at major conferences',
        'Patents or significant innovations',
        'Board positions or advisory roles',
        'Media coverage and public engagement'
      ],
      disqualifying: [
        'Cannot demonstrate exceptional talent/promise',
        'Insufficient evidence for endorsement',
        'Criminal convictions',
        'Previous immigration violations',
        'Failed to meet specific endorsing body criteria'
      ]
    },
    eligibilityCriteria: [
      {
        category: 'Tech Nation (Digital Technology)',
        criteria: [
          'MANDATORY: Proven track record of innovation in digital technology',
          'MANDATORY: Recognised as having worked on cutting-edge technology',
          'MANDATORY: Evidence of impact beyond personal reputation',
          'OPTIONAL (2 of 4): Exceptional technical skills as core team member of significant product',
          'OPTIONAL (2 of 4): Product-led digital technology companies as founder, employee, or investor',
          'OPTIONAL (2 of 4): Exceptional technical skills in specialist field (AI, cybersecurity, fintech, etc.)',
          'OPTIONAL (2 of 4): Track record of building skilled teams and evidence of leadership'
        ],
        ukviReference: 'https://technation.uk/global-talent-visa/'
      },
      {
        category: 'Arts Council England (Arts & Culture)',
        criteria: [
          'MANDATORY: Internationally recognised track record of excellence',
          'MANDATORY: Evidence of recognition through prizes, awards, or nominations',
          'MANDATORY: Evidence of professional recognition through peer and press commentary',
          'OPTIONAL (2 of 4): Evidence of innovation and significant contribution to the arts',
          'OPTIONAL (2 of 4): Evidence of outstanding leadership in the arts through position/influence',
          'OPTIONAL (2 of 4): Evidence of significant commercial success or impact',
          'OPTIONAL (2 of 4): Evidence of critical acclaim through media attention or peer recognition'
        ],
        ukviReference: 'https://www.artscouncil.org.uk/funding/global-talent-visa-endorsement'
      },
      {
        category: 'British Academy (Humanities & Social Sciences)',
        criteria: [
          'MANDATORY: PhD or equivalent professional training/experience in relevant field',
          'MANDATORY: Active in research with evidence of current engagement',
          'MANDATORY: Track record of research excellence with international reach',
          'OPTIONAL (2 of 4): Evidence of research impact beyond academic publications',
          'OPTIONAL (2 of 4): Evidence of innovation in research methods or findings',
          'OPTIONAL (2 of 4): Evidence of leadership in research community',
          'OPTIONAL (2 of 4): Evidence of significant external funding or commercial success'
        ],
        ukviReference: 'https://www.thebritishacademy.ac.uk/funding/global-talent-visa/'
      },
      {
        category: 'Royal Society (Science & Research)',
        criteria: [
          'MANDATORY: PhD or equivalent research experience in science/mathematics/engineering',
          'MANDATORY: Currently active in relevant research',
          'MANDATORY: Research recognised internationally through publications, citations, h-index',
          'OPTIONAL (2 of 4): Evidence of research leading to significant impact beyond academia',
          'OPTIONAL (2 of 4): Evidence of innovation in research with potential for significant impact',
          'OPTIONAL (2 of 4): Evidence of leadership in research field through roles or influence',
          'OPTIONAL (2 of 4): Evidence of significant industry collaboration or commercial application'
        ],
        ukviReference: 'https://royalsociety.org/grants-schemes-awards/awards/global-talent-visa/'
      },
      {
        category: 'Royal Academy of Engineering (Engineering)',
        criteria: [
          'MANDATORY: Professional engineering qualification or equivalent experience',
          'MANDATORY: Evidence of exceptional technical skills in engineering field',
          'MANDATORY: Evidence of innovation with potential for significant impact',
          'OPTIONAL (2 of 4): Evidence of technical innovation leading to significant commercial success',
          'OPTIONAL (2 of 4): Evidence of exceptional technical skills leading to industry recognition',
          'OPTIONAL (2 of 4): Evidence of leadership in engineering field',
          'OPTIONAL (2 of 4): Evidence of technical innovation with wider societal benefit'
        ],
        ukviReference: 'https://www.raeng.org.uk/grants-and-prizes/international-programmes/newton-funds/global-talent-visa'
      },
      {
        category: 'UK Research and Innovation (Research)',
        criteria: [
          'MANDATORY: PhD or equivalent research qualification',
          'MANDATORY: Currently active in research with evidence of ongoing engagement',
          'MANDATORY: Research recognised through publications, citations, and impact',
          'OPTIONAL (2 of 4): Evidence of research impact beyond academic sphere',
          'OPTIONAL (2 of 4): Evidence of innovation in research with potential for significant impact',
          'OPTIONAL (2 of 4): Evidence of leadership in research community or field',
          'OPTIONAL (2 of 4): Evidence of securing significant research funding or partnerships'
        ],
        ukviReference: 'https://www.ukri.org/what-we-offer/supporting-healthy-research-and-innovation-culture/global-talent-visa/'
      }
    ],
    questions: [
      {
        id: 'age-18-plus',
        text: 'Are you 18 years or older?',
        type: 'boolean',
        required: true,
        weight: 5,
        ukviReference: 'https://www.gov.uk/global-talent-visa/eligibility'
      },
      {
        id: 'prestigious-prize',
        text: 'Have you won an eligible prestigious prize (Nobel Prize, Turing Award, etc.) allowing direct visa application?',
        type: 'boolean',
        required: false,
        weight: 15,
        ukviReference: 'https://www.gov.uk/global-talent-visa/eligibility'
      },
      {
        id: 'endorsing-body-selection',
        text: 'Which endorsing body best matches your field of expertise?',
        type: 'single',
        options: [
          'Tech Nation - Digital Technology (AI, fintech, cybersecurity, etc.)',
          'Arts Council England - Arts & Culture',
          'British Academy - Humanities & Social Sciences',
          'Royal Society - Science & Research',
          'Royal Academy of Engineering - Engineering',
          'UK Research and Innovation - Research'
        ],
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/global-talent-visa/endorsement'
      },
      // Tech Nation Specific Questions
      {
        id: 'tech-innovation-track-record',
        text: '[Tech Nation] Can you demonstrate a proven track record of innovation in digital technology?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://technation.uk/global-talent-visa/'
      },
      {
        id: 'tech-cutting-edge-work',
        text: '[Tech Nation] Are you recognised as having worked on cutting-edge technology?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://technation.uk/global-talent-visa/'
      },
      {
        id: 'tech-impact-beyond-reputation',
        text: '[Tech Nation] Can you provide evidence of impact beyond your personal reputation?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://technation.uk/global-talent-visa/'
      },
      {
        id: 'tech-optional-criteria',
        text: '[Tech Nation] How many of these optional criteria can you demonstrate? (Need 2 of 4): Technical skills as core team member, Product-led companies experience, Specialist technical expertise, Team building/leadership track record',
        type: 'single',
        options: ['0', '1', '2', '3', '4'],
        required: true,
        weight: 15,
        ukviReference: 'https://technation.uk/global-talent-visa/'
      },
      // Arts Council England Specific Questions
      {
        id: 'arts-international-recognition',
        text: '[Arts Council England] Do you have an internationally recognised track record of excellence in arts/culture?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.artscouncil.org.uk/funding/global-talent-visa-endorsement'
      },
      {
        id: 'arts-awards-recognition',
        text: '[Arts Council England] Can you provide evidence of recognition through prizes, awards, or nominations?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.artscouncil.org.uk/funding/global-talent-visa-endorsement'
      },
      {
        id: 'arts-peer-press-recognition',
        text: '[Arts Council England] Do you have evidence of professional recognition through peer and press commentary?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.artscouncil.org.uk/funding/global-talent-visa-endorsement'
      },
      {
        id: 'arts-optional-criteria',
        text: '[Arts Council England] How many of these optional criteria can you demonstrate? (Need 2 of 4): Innovation/significant contribution, Outstanding leadership, Commercial success/impact, Critical acclaim/media attention',
        type: 'single',
        options: ['0', '1', '2', '3', '4'],
        required: true,
        weight: 15,
        ukviReference: 'https://www.artscouncil.org.uk/funding/global-talent-visa-endorsement'
      },
      // British Academy Specific Questions
      {
        id: 'ba-phd-qualification',
        text: '[British Academy] Do you have a PhD or equivalent professional training/experience in your field?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.thebritishacademy.ac.uk/funding/global-talent-visa/'
      },
      {
        id: 'ba-active-research',
        text: '[British Academy] Are you currently active in research with evidence of ongoing engagement?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.thebritishacademy.ac.uk/funding/global-talent-visa/'
      },
      {
        id: 'ba-research-excellence',
        text: '[British Academy] Can you demonstrate a track record of research excellence with international reach?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.thebritishacademy.ac.uk/funding/global-talent-visa/'
      },
      {
        id: 'ba-optional-criteria',
        text: '[British Academy] How many of these optional criteria can you demonstrate? (Need 2 of 4): Research impact beyond academia, Innovation in research, Leadership in research community, External funding/commercial success',
        type: 'single',
        options: ['0', '1', '2', '3', '4'],
        required: true,
        weight: 15,
        ukviReference: 'https://www.thebritishacademy.ac.uk/funding/global-talent-visa/'
      },
      // Royal Society Specific Questions
      {
        id: 'rs-phd-research',
        text: '[Royal Society] Do you have a PhD or equivalent research experience in science/mathematics/engineering?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://royalsociety.org/grants-schemes-awards/awards/global-talent-visa/'
      },
      {
        id: 'rs-active-research',
        text: '[Royal Society] Are you currently active in relevant research?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://royalsociety.org/grants-schemes-awards/awards/global-talent-visa/'
      },
      {
        id: 'rs-international-recognition',
        text: '[Royal Society] Is your research recognised internationally through publications, citations, and h-index?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://royalsociety.org/grants-schemes-awards/awards/global-talent-visa/'
      },
      {
        id: 'rs-optional-criteria',
        text: '[Royal Society] How many of these optional criteria can you demonstrate? (Need 2 of 4): Research impact beyond academia, Innovation with significant impact potential, Leadership in research field, Industry collaboration/commercial application',
        type: 'single',
        options: ['0', '1', '2', '3', '4'],
        required: true,
        weight: 15,
        ukviReference: 'https://royalsociety.org/grants-schemes-awards/awards/global-talent-visa/'
      },
      // Royal Academy of Engineering Specific Questions
      {
        id: 'rae-engineering-qualification',
        text: '[Royal Academy of Engineering] Do you have professional engineering qualification or equivalent experience?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.raeng.org.uk/grants-and-prizes/international-programmes/newton-funds/global-talent-visa'
      },
      {
        id: 'rae-technical-skills',
        text: '[Royal Academy of Engineering] Can you demonstrate exceptional technical skills in your engineering field?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.raeng.org.uk/grants-and-prizes/international-programmes/newton-funds/global-talent-visa'
      },
      {
        id: 'rae-innovation-impact',
        text: '[Royal Academy of Engineering] Do you have evidence of innovation with potential for significant impact?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.raeng.org.uk/grants-and-prizes/international-programmes/newton-funds/global-talent-visa'
      },
      {
        id: 'rae-optional-criteria',
        text: '[Royal Academy of Engineering] How many of these optional criteria can you demonstrate? (Need 2 of 4): Technical innovation with commercial success, Industry recognition for technical skills, Leadership in engineering, Innovation with societal benefit',
        type: 'single',
        options: ['0', '1', '2', '3', '4'],
        required: true,
        weight: 15,
        ukviReference: 'https://www.raeng.org.uk/grants-and-prizes/international-programmes/newton-funds/global-talent-visa'
      },
      // UKRI Specific Questions
      {
        id: 'ukri-phd-qualification',
        text: '[UKRI] Do you have a PhD or equivalent research qualification?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.ukri.org/what-we-offer/supporting-healthy-research-and-innovation-culture/global-talent-visa/'
      },
      {
        id: 'ukri-active-research',
        text: '[UKRI] Are you currently active in research with evidence of ongoing engagement?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.ukri.org/what-we-offer/supporting-healthy-research-and-innovation-culture/global-talent-visa/'
      },
      {
        id: 'ukri-research-recognition',
        text: '[UKRI] Is your research recognised through publications, citations, and impact?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.ukri.org/what-we-offer/supporting-healthy-research-and-innovation-culture/global-talent-visa/'
      },
      {
        id: 'ukri-optional-criteria',
        text: '[UKRI] How many of these optional criteria can you demonstrate? (Need 2 of 4): Research impact beyond academia, Innovation with significant impact potential, Leadership in research community, Significant funding/partnerships',
        type: 'single',
        options: ['0', '1', '2', '3', '4'],
        required: true,
        weight: 15,
        ukviReference: 'https://www.ukri.org/what-we-offer/supporting-healthy-research-and-innovation-culture/global-talent-visa/'
      },
      // Common questions for all endorsing bodies
      {
        id: 'cv-ready',
        text: 'Can you provide a strong CV (≤3 pages) summarising your achievements?',
        type: 'boolean',
        required: true,
        weight: 8
      },
      {
        id: 'personal-statement',
        text: 'Do you have a personal statement (≤1000 words) outlining past contributions and future value to UK?',
        type: 'boolean',
        required: true,
        weight: 8
      },
      {
        id: 'recommendation-letters',
        text: 'Can you provide 3+ recommendation letters from recognised experts in your field?',
        type: 'boolean',
        required: true,
        weight: 9
      },
      {
        id: 'evidence-portfolio',
        text: 'Do you have comprehensive evidence portfolio documenting your achievements and impact?',
        type: 'boolean',
        required: true,
        weight: 9
      },
      {
        id: 'maintenance-funds',
        text: 'Can you show £1,270 in personal savings held for 28 consecutive days?',
        type: 'boolean',
        required: true,
        weight: 5
      }
    ]
  },
  {
    id: 'innovator-founder',
    name: 'Innovator Founder Visa',
    description: 'For experienced business people wanting to establish innovative businesses in the UK. Requires endorsement and business plan assessment.',
    category: 'Work',
    difficulty: 'Hard',
    processingTime: '~8 weeks; varies by endorsing body',
    cost: 1191, // Application fee approx. £1,191-£1,590 + endorsement fee ~£1,000
    ukviUrl: 'https://www.gov.uk/innovator-founder-visa/apply',
    ukviGuidanceUrl: 'https://www.gov.uk/innovator-founder-visa',
    lastUpdated: '2025-07-29',
    requirements: {
      essential: [
        'Valid endorsement letter (issued within past 3 months, not withdrawn)',
        'Endorsing body confirms you are fit and proper person',
        'Business plan originated or significantly contributed to by you',
        'Day-to-day role in managing and developing business',
        'Business is new (not already trading in UK), innovative, viable, and scalable',
        'Minimum £1,270 in personal funds (held for 28 consecutive days)',
        'English language requirement (CEFR B2 or equivalent)',
        'Valid passport and supporting documents'
      ],
      desirable: [
        'Business experience',
        'Relevant qualifications',
        'Market research completed',
        'Prototype or proof of concept',
        'Investment ready'
      ],
      disqualifying: [
        'Previous Innovator Founder visa held (restrictions apply)',
        'Business idea not innovative enough',
        'Insufficient personal funds',
        'Cannot demonstrate day-to-day involvement',
        'Criminal convictions'
      ]
    },
    eligibilityCriteria: [
      {
        category: 'Business Innovation Requirements',
        criteria: [
          'Business plan scores 30 points (innovation, viability, scalability)',
          'Venture innovation/viability/scalability scores 20 points',
          'Total 50 mandatory points plus English + funds + endorsement validity',
          'Must reach 70 total points'
        ],
        ukviReference: 'https://www.gov.uk/innovator-founder-visa/eligibility'
      },
      {
        category: 'Settlement Requirements (after 3 years)',
        criteria: [
          'Satisfy ≥2 of: £50k investment; job creation thresholds; revenue growth; IP/R&D; export income',
          'Spend ≤180 days outside UK in any rolling 12-month period',
          'At least two contact-point meetings with endorsing body at 12 and 24 months'
        ],
        ukviReference: 'https://www.gov.uk/innovator-founder-visa/extend-your-visa'
      }
    ],
    questions: [
      {
        id: 'age-18-plus-innovator',
        text: 'Are you 18 years or older at the date of application?',
        type: 'boolean',
        required: true,
        weight: 5,
        ukviReference: 'https://www.gov.uk/innovator-founder-visa/eligibility'
      },
      {
        id: 'endorsement-letter',
        text: 'Do you have a valid endorsement letter, issued within the past 3 months and not withdrawn?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/innovator-founder-visa/endorsement'
      },
      {
        id: 'fit-and-proper',
        text: 'Did the endorsing body confirm you are a fit and proper person, with no financial misconduct or illicit wealth concerns?',
        type: 'boolean',
        required: true,
        weight: 8,
        ukviReference: 'https://www.gov.uk/innovator-founder-visa/eligibility'
      },
      {
        id: 'business-plan-contribution',
        text: 'Was your business plan either originated or significantly contributed to by you?',
        type: 'boolean',
        required: true,
        weight: 9,
        ukviReference: 'https://www.gov.uk/innovator-founder-visa/eligibility'
      },
      {
        id: 'day-to-day-role',
        text: 'Will you take a day-to-day role in managing and developing the business?',
        type: 'boolean',
        required: true,
        weight: 9,
        ukviReference: 'https://www.gov.uk/innovator-founder-visa/eligibility'
      },
      {
        id: 'business-innovative',
        text: 'Is your proposed business new (not already trading in UK), innovative, viable, and scalable?',
        type: 'boolean',
        required: true,
        weight: 10,
        ukviReference: 'https://www.gov.uk/innovator-founder-visa/eligibility'
      },
      {
        id: 'personal-funds-1270',
        text: 'Can you show a minimum of £1,270 in personal funds, held for at least 28 consecutive days (excluding business funds)?',
        type: 'boolean',
        required: true,
        weight: 8,
        ukviReference: 'https://www.gov.uk/innovator-founder-visa/eligibility'
      },
      {
        id: 'english-b2',
        text: 'Can you meet English language requirement (CEFR B2 or equivalent)?',
        type: 'boolean',
        required: true,
        weight: 8,
        ukviReference: 'https://www.gov.uk/innovator-founder-visa/knowledge-of-english'
      },
      {
        id: 'endorsement-meetings',
        text: 'Will you have at least two contact-point meetings with your endorsing body at 12 and 24 months?',
        type: 'boolean',
        required: true,
        weight: 7,
        ukviReference: 'https://www.gov.uk/innovator-founder-visa/endorsement'
      }
    ]
  }
];

// Export categories for filtering
export const visaCategories = [
  'Work',
  'Education', 
  'Family',
  'Visit',
  'Settlement'
] as const;

// Export difficulty levels
export const difficultyLevels = [
  'Easy',
  'Medium', 
  'Hard'
] as const;