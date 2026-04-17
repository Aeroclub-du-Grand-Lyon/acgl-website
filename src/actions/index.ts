import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { getCollection } from "astro:content";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const server = {
  contact: defineAction({
    input: z.object({
      name: z
        .string()
        .min(2, "Veuillez saisir votre nom (2 caractères minimum).")
        .max(100),
      email: z.string().email("Adresse email invalide."),
      subject: z.string().max(120).optional(),
      message: z
        .string()
        .min(10, "Le message doit faire au moins 10 caractères.")
        .max(4000),
      _gotcha: z.string().max(0),
      _loadedAt: z.number(),
    }),
    handler: async (input) => {
      // 1. Honeypot — bots fill this, humans don't
      if (input._gotcha.length > 0) {
        throw new ActionError({ code: "FORBIDDEN" });
      }

      // 2. Time gate — reject submissions faster than 10 seconds
      if (Date.now() - input._loadedAt < 10000) {
        throw new ActionError({ code: "FORBIDDEN" });
      }

      // 3. Fetch recipient address from CMS settings
      const [contactEntry] = await getCollection("contactSettings");
      const acglEmail = contactEntry?.data.email;
      if (!acglEmail) {
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR" });
      }

      // 4. Send email via Brevo transactional API
      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": import.meta.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Formulaire ACGL", email: acglEmail },
          to: [{ email: acglEmail }],
          replyTo: { email: input.email, name: input.name },
          subject: `[ACGL] ${input.subject ?? "Message depuis le site"}`,
          htmlContent: `
            <p><strong>De :</strong> ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;</p>
            ${input.subject ? `<p><strong>Objet :</strong> ${escapeHtml(input.subject)}</p>` : ""}
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />
            <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(input.message)}</p>
          `,
        }),
      });

      if (!brevoRes.ok) {
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return { success: true as const };
    },
  }),
};
