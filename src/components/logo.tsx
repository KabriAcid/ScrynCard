import { Fingerprint } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Logo() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 font-headline text-xl font-bold">
      <div className="p-2">
        <button
          onClick={() => navigate("/")}
          className="hover:opacity-80 transition-opacity"
        >
          <Fingerprint className="h-6 w-6 text-primary" />
        </button>
      </div>
      <span className="text-primary dark:text-primary-foreground">Scryn</span>
    </div>
  );
}
