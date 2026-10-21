export const weddingDetails = {
  couple: 'Sarah & Jesus',
  date: 'November 27, 2027',
  shortDate: '11 · 27 · 2027',
  countdownTarget: '2027-11-27T00:00:00-06:00',
  location: 'Houston, Texas',
  church: {
    name: 'The Church of the Annunciation',
    location: 'Downtown Houston, Texas',
    address: '1618 Texas Avenue, Houston, Texas',
    time: 'Tentatively 12:00 p.m. · Pending confirmation',
    mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Church+of+the+Annunciation%2C+1618+Texas+Ave%2C+Houston%2C+TX+77003',
  },
  hero: {
    image: {
      src: '/images/annunciation-church-houston.webp',
      alt: 'Exterior of The Church of the Annunciation in Downtown Houston, Texas',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Annunciation_Church_Houston_Texas.JPG',
      credit: '“Annunciation Church Houston Texas” — Ed Uthman, CC BY 3.0, via Wikimedia Commons. Resized.',
    },
  },
  registryUrl: 'https://example.com/registry',
}

export const navigation = [
  { href: '#home', label: 'Home' },
  { href: '#the-wedding', label: 'The Wedding' },
  { href: '#our-story', label: 'Our Story' },
  { href: '#faq', label: 'FAQ' },
  { href: '#rsvp', label: 'RSVP' },
  { href: '#registry', label: 'Registry' },
]

export const storyChapters = [
  {
    number: 'I',
    title: 'How We Met',
    accent: 'The beginning',
    body: 'A place to share the first chapter of Sarah and Jesus’s story. Add the memory, date, or small detail that still makes you both smile.',
    imageLabel: 'A first photograph',
  },
  {
    number: 'II',
    title: 'Our Journey Together',
    accent: 'The unfolding',
    body: 'A place to tell the story of the seasons, places, and people that have shaped your life together. Replace this note with your own words when you are ready.',
    imageLabel: 'A cherished moment',
  },
  {
    number: 'III',
    title: 'The Proposal',
    accent: 'Rome · October 2026',
    body: 'In Rome, Italy, in October 2026, Sarah and Jesus said yes to the life they are building together. Add the full proposal story here when you wish to share it.',
    imageLabel: 'Rome, to be added',
  },
]

export const faqs = [
  { question: 'What is the dress code?', answer: 'Answer pending. We look forward to sharing guidance closer to the celebration.' },
  { question: 'Where is the wedding ceremony?', answer: 'The ceremony will be held at The Church of the Annunciation in Downtown Houston.' },
  { question: 'Where is the reception?', answer: 'Reception details are coming soon.' },
  { question: 'What time should guests arrive?', answer: 'Arrival time will be confirmed closer to the wedding day.' },
  { question: 'Where should we stay?', answer: 'Hotel recommendations are coming soon.' },
  { question: 'Is parking available?', answer: 'Parking details are coming soon.' },
  { question: 'Are children invited?', answer: 'To be confirmed.' },
  { question: 'Can I bring a plus-one?', answer: 'Only guests specifically included in an invitation may attend.' },
  { question: 'When should I RSVP?', answer: 'The RSVP deadline will be announced.' },
  { question: 'Traveling to Houston?', answer: 'Airport information, accommodations, and local recommendations for out-of-town guests are coming soon.' },
]

// Localization architecture: add all visitor-facing copy to both objects before enabling a language switcher.
export const localeLabels = {
  en: { menu: 'Menu', close: 'Close menu', directions: 'Get directions', registry: 'View Our Registry' },
  pt: { menu: 'Menu', close: 'Fechar menu', directions: 'Ver direções', registry: 'Ver nosso registro' },
}
