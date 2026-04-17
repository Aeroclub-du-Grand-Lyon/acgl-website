import { collection, config, fields, singleton } from "@keystatic/core";

export default config({
  storage:
  {
    kind: "github",
    repo: "aeroclub-du-grand-lyon/acgl-website",
    branchPrefix: "keystatic/",
  },
  ui: {
    navigation: {
      "Page d'accueil": ["homeClubNumbers"],
      "Le club": [
        "board",
        "instructors",
        "clubEvents",
        "commitments",
        "contact",
        "socialLinks",
        "links",
      ],
      Voler: ["fleet", "offers", "ratings"],
      Tarifs: ["pricing", "pricingDetails"],
      "Questions fréquentes": ["faq"],
    },
  },
  singletons: {
    homeClubNumbers: singleton({
      label: "Accueil",
      path: "src/content/settings/home-club-numbers",
      format: { data: "yaml" },
      schema: {
        stats: fields.array(
          fields.object({
            value: fields.number({
              label: "Chiffre",
              description: "Entier strictement positif.",
              validation: { min: 1, max: 999999 },
              step: 1,
            }),
            label: fields.text({
              label: "Libellé",
              description:
                "Texte affiché sous le chiffre (ex. avions, instructeurs, membres).",
            }),
          }),
          {
            label: "Blocs chiffres + libellé",
            description:
              "Ajoutez de 0 à 3 blocs. Chaque bloc affiche un nombre et son libellé sur la page d'accueil.",
            itemLabel: (props) => {
              const v = props.fields.value?.value;
              const l = props.fields.label?.value;
              if (v != null && l) return `${v} - ${l}`;
              return "Bloc";
            },
            validation: { length: { min: 0, max: 3 } },
          },
        ),
      },
    }),

    contact: singleton({
      label: "Coordonnées",
      path: "src/content/settings/contact",
      format: { data: "yaml" },
      schema: {
        phone: fields.text({
          label: "Téléphone",
          description: "Format affiché sur le site (ex : 04 72 37 51 32). Le lien cliquable est généré automatiquement.",
        }),
        email: fields.text({ label: "Email de contact" }),
        permanence: fields.text({
          label: "Permanence",
          description: "Jour et horaires (ex : Tous les samedis, 9h30 – 12h). Laisser vide pour masquer le bloc.",
        }),
        address: fields.object({
          street: fields.text({
            label: "Rue",
          }),
          postalCode: fields.text({ label: "Code postal" }),
          city: fields.text({ label: "Ville" }),

        },
          {
            label: "Adresse",
            description: "Adresse du club.",
          }
        ),
        mapsEmbedUrl: fields.text({
          label: "URL embed Google Maps (src de l'iframe)",
          description:
            "Coller l'URL de la carte Google Maps à intégrer (format embed).",
          multiline: false,
        }),
        mapsDirectionsUrl: fields.text({
          label: "Lien Google Maps (Voir sur Maps)",
          description: "URL vers la fiche Google Maps du club.",
        }),
      },
    }),

    socialLinks: singleton({
      label: "Réseaux sociaux",
      path: "src/content/settings/social-links",
      format: { data: "yaml" },
      schema: {
        facebookUrl: fields.text({
          label: "URL Facebook",
          description: "Ex : https://www.facebook.com/AeroClubduGrandLyon/",
        }),
        instagramUrl: fields.text({
          label: "URL Instagram",
          description: "Ex : https://www.instagram.com/aeroclub_acgl/",
        }),
      },
    }),

    pricingDetails: singleton({
      label: "Détails des tarifs",
      path: "src/content/settings/pricing-details",
      format: { data: "yaml" },
      schema: {
        updatedOn: fields.text({
          label: "Date de mise à jour des tarifs",
          description:
            "Affiché sous le titre de la page Tarifs (ex : 1er janvier 2026).",
        }),
        membershipNote: fields.object(
          {
            enabled: fields.checkbox({
              label: 'Afficher l’infobulle cotisations',
              defaultValue: false,
              description:
                "Décochez pour masquer l’infobulle, sans perdre le contenu saisi ci-dessous.",
            }),
            title: fields.text({ label: 'Titre' }),
            description: fields.text({
              label: 'Texte',
              multiline: true,
            }),
          },
          {
            label: 'Infobulle cotisations',
            description:
              "Infobulle affichée sous la section Cotisations.",
          }
        ),
        fleetNote: fields.object(
          {
            enabled: fields.checkbox({
              label: 'Afficher l’infobulle cotisations',
              defaultValue: false,
              description:
                "Décochez pour masquer l’infobulle, sans perdre le contenu saisi ci-dessous.",
            }),
            title: fields.text({ label: 'Titre' }),
            description: fields.text({
              label: 'Texte',
              multiline: true,
            }),
          },
          {
            label: 'Infobulle avions',
            description:
              "Infobulle affichée sous la section Avions.",
          }
        ),
        trainingNote: fields.object(
          {
            enabled: fields.checkbox({
              label: 'Afficher l’infobulle instruction',
              defaultValue: false,
              description:
                "Décochez pour masquer l’infobulle, sans perdre le contenu saisi ci-dessous.",
            }),
            title: fields.text({ label: "Titre" }),
            description: fields.text({ label: "Texte", multiline: true }),
          },
          {
            label: "Infobulle instruction",
            description:
              "Infobulle affichée sous la section Instruction.",
          },
        ),
      },
    }),

    clubEvents: singleton({
      label: "Vie du club",
      path: "src/content/settings/club-events",
      format: { data: "yaml" },
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: "Titre" }),
            icon: fields.select({
              label: "Icône",
              options: [
                { label: "Avion", value: "plane" },
                { label: "Cadeau", value: "gift" },
                { label: "Boussole", value: "compass" },
                { label: "Groupe", value: "users" },
                { label: "Cœur", value: "heart" },
                { label: "Trophée", value: "award" },
                { label: "Billet avion", value: "plane-ticket" },
                { label: "Casquette pilote", value: "pilot-cap" },
                { label: "Piste", value: "runway" },
                { label: "Localisation", value: "map-pin" },
              ],
              defaultValue: "plane",
            }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          {
            label: "Événements",
            itemLabel: (props) => props.fields.title?.value ?? "Événement",
          },
        ),
      },
    }),

    commitments: singleton({
      label: "Engagements",
      path: "src/content/settings/commitments",
      format: { data: "yaml" },
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: "Titre de l'engagement" }),
            description: fields.text({
              label: "Description",
              multiline: true,
            }),
          }),
          {
            label: "Engagements du club",
            itemLabel: (props) => props.fields.title?.value ?? "Engagement",
          },
        ),
      },
    }),
  },
  collections: {
    fleet: collection({
      label: "Flotte",
      slugField: "key",
      path: "src/content/fleet/*",
      format: { data: "yaml" },
      columns: ["registration", "order"],
      schema: {
        key: fields.slug({
          name: { label: "Modèle" },
          slug: {
            label: "Identifiant",
            description: "Nom du fichier (sans espaces)",
          },
        }),
        photo: fields.image({
          label: "Photo",
          description:
            "Image affichée sur la page Flotte. Format paysage recommandé (ex. 1200×800).",
          directory: "public/images/fleet",
          publicPath: "/images/fleet/",
          validation: { isRequired: false },
        }),
        registration: fields.text({ label: "Immatriculation" }),
        usage: fields.text({ label: "Usage", multiline: true }),
        equipment: fields.array(fields.text({ label: "Élément" }), {
          label: "Équipements",
          itemLabel: (props) => props.value ?? "Élément",
        }),
        engine: fields.text({ label: "Moteur" }),
        seats: fields.number({
          label: "Places",
          step: 1,
          validation: { min: 1, max: 6, validateStep: true },
        }),
        speed: fields.text({ label: "Vitesse" }),
        autonomy: fields.text({ label: "Autonomie" }),
        normal: fields.text({
          label: "Tarif VFR normal",
          description: "Format : 169 €/h. Laisser vide si non applicable.",
        }),
        reduced: fields.text({
          label: "Tarif VFR réduit",
          description: "Format : 139 €/h. Laisser vide si pas de tarif réduit.",
        }),
        ifrNormal: fields.text({
          label: "Tarif IFR normal",
          description: "Format : 252 €/h. Laisser vide si non applicable.",
        }),
        ifrReduced: fields.text({
          label: "Tarif IFR réduit",
          description: "Format : 222 €/h. Laisser vide si non applicable.",
        }),
        schoolAircraft: fields.checkbox({
          label: "Avion école",
          description: "Cocher si cet avion est utilisé pour la formation.",
        }),
        pricingNotes: fields.text({
          label: "Notes tarif",
          multiline: true,
          description: "Informations complémentaires affichées sur la page tarifs.",
        }),
        order: fields.number({
          label: "Ordre",
          step: 1,
          validation: { min: 0, validateStep: true },
        }),
      },
    }),

    pricing: collection({
      label: "Tarifs",
      slugField: "key",
      path: "src/content/pricing/*",
      format: { data: "yaml" },
      columns: ["category", "order"],
      schema: {
        key: fields.slug({
          name: { label: "Libellé" },
          slug: { label: "Identifiant" },
        }),
        category: fields.select({
          label: "Catégorie",
          options: [
            { label: "Cotisation", value: "membership" },
            { label: "Instruction", value: "training" },
          ],
          defaultValue: "membership",
        }),
        normal: fields.text({
          label: "Tarif",
          description: "Format : 50 €/h (instruction), 240 € (cotisation)",
        }),
        notes: fields.text({ label: "Notes", multiline: true }),
        order: fields.number({
          label: "Ordre",
          step: 1,
          validation: { min: 0, validateStep: true },
        }),
      },
    }),

    board: collection({
      label: "Conseil d'administration",
      slugField: "key",
      path: "src/content/board/*",
      format: { data: "yaml" },
      columns: ["role", "group", "order"],
      schema: {
        key: fields.slug({
          name: { label: "Nom" },
          slug: { label: "Identifiant" },
        }),
        role: fields.text({ label: "Fonction" }),
        group: fields.select({
          label: "Groupe",
          options: [
            { label: "Bureau élu", value: "executive" },
            { label: "Conseil d'administration", value: "council" },
          ],
          defaultValue: "executive",
        }),
        order: fields.number({
          label: "Ordre",
          step: 1,
          validation: { min: 0, validateStep: true },
        }),
      },
    }),

    instructors: collection({
      label: "Instructeurs",
      slugField: "key",
      path: "src/content/instructors/*",
      format: { data: "yaml" },
      columns: ["order"],
      schema: {
        key: fields.slug({
          name: { label: "Nom" },
          slug: { label: "Identifiant" },
        }),
        examiner: fields.checkbox({
          label: "Examinateur FE(A)",
          description:
            "Cocher si l'instructeur est aussi examinateur (FE(A)).",
          defaultValue: false,
        }),
        nightRating: fields.checkbox({
          label: "Qualification Vol de Nuit",
          defaultValue: false,
        }),
        ifrRating: fields.checkbox({
          label: "Qualification IFR",
          defaultValue: false,
        }),
        mountainRating: fields.checkbox({
          label: "Qualification Montagne",
          defaultValue: false,
        }),
        status: fields.text({ label: "Statut / rôle particulier" }),
        order: fields.number({
          label: "Ordre",
          step: 1,
          validation: { min: 0, validateStep: true },
        }),
      },
    }),

    offers: collection({
      label: "Vols découverte & offres",
      slugField: "title",
      path: "src/content/offers/*",
      format: { data: "yaml" },
      columns: ["order"],
      schema: {
        title: fields.slug({
          name: { label: "Titre de l'offre" },
          slug: { label: "Identifiant URL (ancre de page)" },
        }),
        icon: fields.select({
          label: "Icône",
          options: [
            { label: "Avion", value: "plane" },
            { label: "Horloge", value: "clock" },
            { label: "Cadeau", value: "gift" },
            { label: "Casque pilote", value: "headset" },
            { label: "Vent", value: "wind" },
            { label: "Trophée", value: "award" },
            { label: "Billet d'avion", value: "plane-ticket" },
            { label: "Casquette pilote", value: "pilot-cap" },
            { label: "Piste d'atterrissage", value: "runway" },
          ],
          defaultValue: "plane",
        }),
        tagline: fields.text({
          label: "Accroche courte",
          description: "Phrase d'accroche affichée en badge/sous-titre.",
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        duration: fields.text({
          label: "Durée",
          description: "Ex: 30 min de vol + briefing",
        }),
        price: fields.text({
          label: "Tarif affiché",
          description: "Ex: À partir de 170 €",
        }),
        capacity: fields.text({
          label: "Capacité",
          description: "Ex: 1 pilote + 1 passager",
        }),
        notes: fields.text({
          label: "Conditions / Notes",
          multiline: true,
          description:
            "Informations complémentaires affichées sous le tarif.",
        }),
        order: fields.number({
          label: "Ordre d'affichage",
          step: 1,
          validation: { min: 0, validateStep: true },
        }),
      },
    }),

    faq: collection({
      label: "Questions fréquentes",
      slugField: "question",
      path: "src/content/faq/*",
      format: { data: "yaml" },
      columns: ["page", "order"],
      schema: {
        question: fields.slug({
          name: { label: "Question" },
          slug: { label: "Identifiant" },
        }),
        answer: fields.text({ label: "Réponse", multiline: true }),
        page: fields.select({
          label: "Page",
          options: [
            { label: "Tarifs", value: "pricing" },
            { label: "Vol découverte", value: "discovery-flights" },
            { label: "École de pilotage", value: "flight-school" },
          ],
          defaultValue: "pricing",
        }),
        order: fields.number({
          label: "Ordre",
          step: 1,
          validation: { min: 0, validateStep: true },
        }),
      },
    }),

    ratings: collection({
      label: "Perfectionnements & qualifications",
      slugField: "title",
      path: "src/content/ratings/*",
      format: { data: "yaml" },
      columns: ["available", "order"],
      schema: {
        title: fields.slug({
          name: { label: "Intitulé" },
          slug: { label: "Identifiant" },
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        conditions: fields.text({
          label: "Prérequis",
          multiline: true,
        }),
        available: fields.checkbox({
          label: "Disponible à l'ACGL",
          defaultValue: true,
        }),
        order: fields.number({
          label: "Ordre d'affichage",
          step: 1,
          validation: { min: 0, validateStep: true },
        }),
      },
    }),

    links: collection({
      label: "Partenaires & liens",
      slugField: "key",
      path: "src/content/links/*",
      format: { data: "yaml" },
      columns: ["category", "order"],
      schema: {
        key: fields.slug({
          name: { label: "Nom" },
          slug: { label: "Identifiant" },
        }),
        category: fields.select({
          label: "Catégorie",
          options: [
            { label: "Partenaire", value: "partner" },
            { label: "Lien utile", value: "resource" },
          ],
          defaultValue: "partner",
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
        }),
        href: fields.text({
          label: "URL du site",
          description: "Ex : https://www.ffa-aero.fr",
        }),
        order: fields.number({
          label: "Ordre d'affichage",
          step: 1,
          validation: { min: 0, validateStep: true },
        }),
      },
    }),
  },
});
