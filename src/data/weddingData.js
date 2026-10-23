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
    body: "Some of the best love stories begin when you least expect them. Ours started with a chance encounter, an unexpected ride, and a few familiar faces who would eventually become family. Our first date was a little awkward, filled with card games, conversations, and hours spent getting to know each other at a bar. Neither of us knew it then, but that ordinary evening was the beginning of something extraordinary.",
    imageLabel: 'A first photograph',
  },
  {
    number: 'II',
    title: 'Our Journey Together',
    accent: 'The unfolding',
    body: "As our love grew, so did the bond between our families. From the very beginning, we were welcomed with open arms and surrounded by so much love. One of our most cherished memories was traveling to Brazil, where Jesus met Sarah's family and became part of a world that meant so much to her. Through family gatherings, adventures, and countless memories, we realized that our story wasn't just about two people falling in love, but two families coming together.",
    imageLabel: 'A cherished moment',
  },
  {
    number: 'III',
    title: 'The Proposal',
    accent: 'Rome · October 10, 2026',
    body: "What Sarah thought was a family trip to Italy to celebrate her mom's and Jesus's dad's birthdays turned into the surprise of a lifetime. On October 10, 2026, at St. Peter's Basilica in Vatican City, Jesus got down on one knee and asked Sarah to marry him. Completely caught off guard, Sarah initially thought it was all a prank, until she looked around and saw their families filming, crying, and sharing in the moment. Surrounded by the people they love most, Sarah said yes to forever.",
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
