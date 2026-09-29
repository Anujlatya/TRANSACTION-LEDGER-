import { LoaderCircle } from "lucide-react";

export default function LoadingSpinner({
  text = "Loading...",
}) {
  return (
    <div className="flex items-center justify-center gap-2">

      <LoaderCircle
        size={20}
        className="animate-spin"
      />

      <span>{text}</span>

    </div>
  );
}