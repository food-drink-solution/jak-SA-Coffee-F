import { PageSectionSkeleton } from "@/components/common/skeletons";

export default function Loading() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4">
      <PageSectionSkeleton />
    </section>
  );
}
