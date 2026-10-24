import Link from "next/link";
import Image from "next/image";

export function ProductSizesSection({ title, text, image }: { title: string; text: string; image: string }) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="bg-cover bg-center py-16"
        style={{ backgroundImage: `url("${image}")` }}
      >
        <div className="absolute inset-0 bg-[var(--color-primary)]/55" />
        <div className="relative container-app">
          <div className="max-w-3xl text-white">
            <h2 className="text-2xl font-extrabold leading-snug sm:text-3xl">{title}</h2>
            <p className="mt-4 text-base leading-7 text-white/90 sm:text-lg sm:leading-8">{text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DownloadSection({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <section className="container-app py-12">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--color-foreground)]">{title}</h2>
          <p className="mt-3 text-base leading-7 text-[var(--color-muted)]">{text}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="https://play.google.com/store/apps/details?id=com.entlq.jak&hl=en" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 focus-ring rounded-lg">
              <Image src="/images/home/google-play.png" alt="Google Play" width={160} height={48} className="h-12 w-auto" />
            </Link>
            <Link href="https://apps.apple.com/us/app/jak-f-b-%D8%AC%D8%A7%D9%83/id6455428264" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 focus-ring rounded-lg">
              <Image src="/images/home/app-store.png" alt="App Store" width={160} height={48} className="h-12 w-auto" />
            </Link>
          </div>
        </div>
        <div />
      </div>
    </section>
  );
}

// Backwards-compatible alias
export const OrderCtaSection = DownloadSection;
