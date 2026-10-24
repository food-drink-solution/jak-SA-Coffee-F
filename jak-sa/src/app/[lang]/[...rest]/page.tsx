import { notFound } from "next/navigation";

/**
 * Unmatched locale-prefixed URLs land here so they render the branded
 * not-found boundary inside the locale layout instead of Next's bare 404.
 * More specific routes always win; this only catches the leftovers.
 */
export default function CatchAll() {
  notFound();
}
