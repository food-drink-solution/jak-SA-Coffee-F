import { FailureState } from "@/components/common/failure-state";

export default function NotFound() {
  return <FailureState kind="not-found" />;
}
