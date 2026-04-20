import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const emptyToUndefined = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.string().optional(),
);

function normalizeEquipment(raw: unknown): string {
  if (raw === undefined || raw === null) return "";
  if (Array.isArray(raw)) {
    return raw
      .map((x) => String(x).trim())
      .filter(Boolean)
      .join(", ");
  }
  return String(raw);
}

const fleet = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/fleet" }),
  schema: z.object({
    key: z.string(),
    registration: z.string(),
    engine: z.string(),
    seats: z.coerce.number().int().positive(),
    speed: z.string(),
    autonomy: z.string(),
    usage: z.string(),
    equipment: z.unknown().transform(normalizeEquipment),
    photo: z
      .preprocess(
        (v) =>
          v === null || v === undefined || v === "" ? undefined : String(v),
        z.string().min(1),
      )
      .optional(),
    normal: emptyToUndefined,
    reduced: emptyToUndefined,
    ifrNormal: emptyToUndefined,
    ifrReduced: emptyToUndefined,
    schoolAircraft: z.boolean().default(false),
    pricingNotes: emptyToUndefined,
    order: z.coerce.number().int(),
  }),
});

const pricing = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/pricing" }),
  schema: z.object({
    key: z.string(),
    category: z.enum(["membership", "training"]),
    normal: emptyToUndefined,
    notes: emptyToUndefined,
    order: z.coerce.number().int(),
  }),
});

const board = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/board" }),
  schema: z.object({
    key: z.string(),
    role: z.string(),
    group: z.enum(["executive"]).default("executive"),
    order: z.coerce.number().int(),
  }),
});

const instructors = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/instructors" }),
  schema: z.object({
    key: z.string(),
    examiner: z.boolean().default(false),
    nightRating: z.boolean().default(false),
    ifrRating: z.boolean().default(false),
    mountainRating: z.boolean().default(false),
    status: emptyToUndefined,
    order: z.coerce.number().int(),
  }),
});

const heroStatBlock = z.object({
  value: z.coerce.number().int().min(1),
  label: z.string().trim().min(1),
});

const homeClubNumbers = defineCollection({
  loader: glob({
    pattern: "home-club-numbers.yaml",
    base: "./src/content/settings",
  }),
  schema: z.object({
    stats: z.array(heroStatBlock).max(3).default([]),
  }),
});

const addressObject = z.object({
    street: z.string().optional(),
    postalCode: z.string().optional(),
    city: z.string().optional(),
  })

const contactSettings = defineCollection({
  loader: glob({
    pattern: "contact.yaml",
    base: "./src/content/settings",
  }),
  schema: z.object({
    phone: emptyToUndefined,
    email: emptyToUndefined,
    permanence: z.string().optional(),
    address: addressObject,
    mapsEmbedUrl: emptyToUndefined,
    mapsDirectionsUrl: emptyToUndefined,
  }),
});

const socialLinksSettings = defineCollection({
  loader: glob({
    pattern: "social-links.yaml",
    base: "./src/content/settings",
  }),
  schema: z.object({
    facebookUrl: emptyToUndefined,
    instagramUrl: emptyToUndefined,
  }),
});

const infoNote = z
  .object({
    enabled: z.boolean().default(false),
    title: z.string().optional(),
    description: z.string().optional(),
  })

const pricingDetailsSettings = defineCollection({
  loader: glob({
    pattern: "pricing-details.yaml",
    base: "./src/content/settings",
  }),
  schema: z.object({
    updatedOn: z.string().optional(),
    membershipNote: infoNote,
    fleetNote: infoNote,
    trainingNote: infoNote,
  }),
});

const commitments = defineCollection({
  loader: glob({
    pattern: "commitments.yaml",
    base: "./src/content/settings",
  }),
  schema: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
  }),
});

const clubEvents = defineCollection({
  loader: glob({
    pattern: "club-events.yaml",
    base: "./src/content/settings",
  }),
  schema: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        icon: z.enum(["plane", "gift", "compass", "users", "heart", "award", "plane-ticket", "pilot-cap", "runway", "map-pin"]),
        description: z.string(),
      }),
    ),
  }),
});

const offers = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/offers" }),
  schema: z.object({
    title: z.string(),
    icon: z.enum(["plane", "clock", "gift", "headset", "wind", "award", "plane-ticket", "pilot-cap", "runway"]).default("plane"),
    tagline: emptyToUndefined,
    description: z.string(),
    duration: emptyToUndefined,
    price: emptyToUndefined,
    capacity: emptyToUndefined,
    notes: emptyToUndefined,
    order: z.coerce.number().int(),
  }),
});

const links = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/links" }),
  schema: z.object({
    key: z.string(),
    category: z.enum(["partner", "resource"]),
    description: z.string(),
    href: z.string().url(),
    order: z.coerce.number().int(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/faq" }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    page: z.enum(["pricing", "discovery-flights", "flight-school"]),
    order: z.coerce.number().int(),
  }),
});

const ratings = defineCollection({
  loader: glob({
    pattern: "*.yaml",
    base: "./src/content/ratings",
  }),
  schema: z.object({
    title: z.string(),
    description: emptyToUndefined,
    conditions: emptyToUndefined,
    available: z.boolean().default(true),
    order: z.coerce.number().int(),
  }),
});

export const collections = {
  fleet,
  pricing,
  board,
  instructors,
  homeClubNumbers,
  contactSettings,
  socialLinksSettings,
  pricingDetailsSettings,
  commitments,
  clubEvents,
  offers,
  ratings,
  links,
  faq,
};
