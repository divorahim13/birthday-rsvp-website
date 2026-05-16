export type EventDetail = {
  label: string;
  value: string;
};

export type ItineraryItem = {
  time: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const eventConfig = {
  celebrantName: "Mara",
  eventTitle: "Mara's Birthday Weekend",
  date: "Saturday, August 22, 2026",
  dateTimeISO: "2026-08-22T17:30:00-04:00",
  time: "5:30 PM until late",
  venue: "The Glasshouse Garden Room",
  address: "118 Waverly Place, New York, NY",
  shortIntro:
    "One long table, a few favorite songs, and a weekend kept deliberately open for good food, unhurried conversation, and the people Mara loves most.",
  dressCode: "Garden party after dark: relaxed, polished, and comfortable enough to stay for dessert.",
  contactPerson: "Elena Rivera",
  contactEmail: "elena@example.com",
  mapLink: "https://maps.google.com/?q=118+Waverly+Place+New+York+NY",
  details: [
    {
      label: "Arrival",
      value: "Doors open at 5:30 PM. Dinner begins once everyone has a drink in hand."
    },
    {
      label: "Dinner",
      value: "Shared plates, a small toast, and cake from the bakery Mara refuses to name until the first slice."
    },
    {
      label: "Weekend note",
      value: "For out-of-town guests, Sunday is intentionally light: coffee nearby, easy walks, and no rushed goodbyes."
    }
  ] satisfies EventDetail[],
  itinerary: [
    {
      time: "5:30 PM",
      title: "Arrive and settle in",
      description: "A calm first hour for hellos, photos, and a welcome drink in the garden room."
    },
    {
      time: "7:00 PM",
      title: "Dinner at the long table",
      description: "Seasonal shared plates with vegetarian options and space for dietary notes on the RSVP."
    },
    {
      time: "8:45 PM",
      title: "Toast and cake",
      description: "A short toast, candles, and the part where nobody lets Mara cut her own cake."
    },
    {
      time: "9:30 PM",
      title: "Music downstairs",
      description: "The evening loosens up with a small playlist, late snacks, and one last round."
    }
  ] satisfies ItineraryItem[],
  faqs: [
    {
      question: "Can I bring a guest?",
      answer: "Please include your total party size in the RSVP so the dinner count stays accurate."
    },
    {
      question: "Is there parking nearby?",
      answer: "Street parking is limited. A rideshare or train is usually the smoothest option."
    },
    {
      question: "When should I reply by?",
      answer: "A reply by July 31 helps keep dinner, seating, and weekend details tidy."
    }
  ] satisfies FaqItem[]
} as const;
