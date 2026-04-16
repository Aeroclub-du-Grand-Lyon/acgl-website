import { useActionState, useState } from "react";
import { actions, isInputError } from "astro:actions";

const inputBase =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:border-brand transition-[border-color,box-shadow] duration-200";

const inputErrClass =
  "border-signal focus-visible:ring-signal/20 focus-visible:border-signal";

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="ml-0.5 text-signal" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-signal">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [loadedAt] = useState(() => Date.now());
  const [defaultSubject] = useState(() =>
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("subject") ?? "")
      : ""
  );

const [result, dispatch, isPending] = useActionState(
    actions.contact,
    null,
  );

  if (result?.data?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="inline-flex size-14 items-center justify-center rounded-full bg-light-frost text-brand">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-7"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-ink">Message envoyé !</p>
          <p className="mt-1 text-sm text-muted">
            Nous avons bien reçu votre message et vous répondrons dans les
            meilleurs délais.
          </p>
        </div>
      </div>
    );
  }

  const fieldErrors = isInputError(result?.error) ? result.error.fields : {};
  const isGeneralError = result?.error && !isInputError(result.error);

  return (
    <form action={dispatch} className="flex flex-col gap-4" noValidate>
      {/* Time-gate hidden field — set to page-load timestamp */}
      <input type="hidden" name="_loadedAt" value={String(loadedAt)} />

      {/* Honeypot — positioned off-screen, tabIndex=-1 so no real user fills it */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          height: 0,
          overflow: "hidden",
        }}
      >
        <input
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field id="name" label="Nom" required error={fieldErrors.name?.[0]}>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="Jean Dupont"
          className={[inputBase, fieldErrors.name ? inputErrClass : ""].join(" ")}
        />
      </Field>

      <Field id="email" label="Email" required error={fieldErrors.email?.[0]}>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          placeholder="jean@exemple.fr"
          className={[inputBase, fieldErrors.email ? inputErrClass : ""].join(" ")}
        />
      </Field>

      <Field id="subject" label="Objet" error={fieldErrors.subject?.[0]}>
        <input
          type="text"
          id="subject"
          name="subject"
          defaultValue={defaultSubject}
          placeholder="Vol découverte, formation, adhésion…"
          className={[inputBase, fieldErrors.subject ? inputErrClass : ""].join(" ")}
        />
      </Field>

      <Field
        id="message"
        label="Message"
        required
        error={fieldErrors.message?.[0]}
      >
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Votre message…"
          className={[
            inputBase,
            "resize-y",
            fieldErrors.message ? inputErrClass : "",
          ].join(" ")}
        />
      </Field>

      {isGeneralError && (
        <p role="alert" className="text-sm text-signal">
          Une erreur est survenue. Veuillez réessayer ou nous contacter par
          téléphone.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-display text-sm font-semibold text-white shadow-[0_2px_12px_rgb(4_103_179/0.3)] transition-[box-shadow,background] duration-200 hover:bg-navy hover:shadow-[0_8px_28px_rgb(4_32_90/0.22)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Envoi en cours…" : "Envoyer le message"}
      </button>

      <p className="text-xs text-muted">
        Les champs marqués d'un{" "}
        <span className="text-signal" aria-hidden="true">
          *
        </span>{" "}
        sont obligatoires.
      </p>
    </form>
  );
}
