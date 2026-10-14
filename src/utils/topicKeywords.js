export const issueTopics = [
  {
    id: 'neighborhood',
    label: 'My Neighborhood',
    description: 'Local services and environment, including water and roads.',
    keywords: [
      'neighborhood',
      'neighborhoods',
      'community',
      'communities',
      'local services',
      'local government',
      'road',
      'roads',
      'water',
      'water systems',
      'water system',
      'public transit',
      'transit',
      'transportation',
      'infrastructure',
      'park',
      'parks',
      'public safety',
      'environment',
      'environmental',
      'climate',
      'air quality',
    ],
  },
  {
    id: 'vote',
    label: 'My Vote and My Say',
    description: 'Voting, elections, campaigns, and ways to take part.',
    keywords: [
      'vote',
      'votes',
      'voting',
      'voter',
      'voters',
      'election',
      'elections',
      'campaign',
      'campaigns',
      'candidate',
      'candidates',
      'ballot',
      'ballots',
      'public comment',
      'public comments',
      'public hearing',
      'public hearings',
      'initiative',
      'initiatives',
      'referendum',
      'referendums',
      'petition',
      'petitions',
      'representation',
    ],
  },
  {
    id: 'home',
    label: 'My Home',
    description: 'Housing, renting, and residential property.',
    keywords: [
      'housing',
      'home',
      'homes',
      'homeowner',
      'homeowners',
      'mortgage',
      'mortgages',
      'rent',
      'rents',
      'rental',
      'rentals',
      'renter',
      'renters',
      'tenant',
      'tenants',
      'landlord',
      'landlords',
      'residential',
      'apartment',
      'apartments',
      'dwelling',
      'dwellings',
    ],
  },
  {
    id: 'taxes',
    label: 'My Taxes',
    description: 'Taxes, public revenue, fees, and government spending.',
    keywords: [
      'property tax',
      'tax',
      'taxes',
      'taxpayer',
      'taxpayers',
      'taxation',
      'revenue',
      'revenues',
      'fee',
      'fees',
      'bond',
      'bonds',
      'budget',
      'budgets',
      'fiscal',
      'public funding',
      'assessment',
      'assessments',
    ],
  },
  {
    id: 'health-schools',
    label: 'My Health and Schools',
    description: 'Health care, schools, students, and education.',
    keywords: [
      'mental health',
      'public health',
      'health',
      'healthcare',
      'medical',
      'hospital',
      'hospitals',
      'clinic',
      'clinics',
      'school',
      'schools',
      'student',
      'students',
      'teacher',
      'teachers',
      'education',
      'educational',
      'university',
      'universities',
      'college',
      'colleges',
      'childcare',
    ],
  },
];

function buildKeywordPattern(keywords) {
  const alternatives = [...keywords]
    .sort((left, right) => right.length - left.length)
    .map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'));

  return new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
}

export function countTopicMentions(text) {
  return issueTopics.map((topic) => ({
    ...topic,
    count: [...text.matchAll(buildKeywordPattern(topic.keywords))].length,
  }));
}

export function getTopicEvidence(text, topic, maxSnippets = 8) {
  const pattern = buildKeywordPattern(topic.keywords);
  const ranges = [];
  const matches = [...text.matchAll(pattern)];
  const selectedMatches =
    matches.length <= maxSnippets
      ? matches
      : Array.from({ length: maxSnippets }, (_, index) => {
          const sampleIndex = Math.round((index * (matches.length - 1)) / (maxSnippets - 1));
          return matches[sampleIndex];
        });

  for (const match of selectedMatches) {
    const start = Math.max(0, match.index - 280);
    const end = Math.min(text.length, match.index + match[0].length + 420);
    const previous = ranges.at(-1);

    if (previous && start <= previous.end) previous.end = end;
    else ranges.push({ start, end });
  }

  return ranges.map(({ start, end }) => text.slice(start, end).trim());
}
