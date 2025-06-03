import Link from "next/link";
import { cn } from "@/lib/utils";

interface TermsLinksProps {
  className?: string;
  termsClassName?: string;
  privacyClassName?: string;
  showAnd?: boolean;
}

export function TermsLinks({ 
  className = "", 
  termsClassName = "text-primary hover:underline",
  privacyClassName = "text-primary hover:underline",
  showAnd = true
}: TermsLinksProps) {
  return (
    <span className={cn("text-sm text-muted-foreground", className)}>
      Al registrarte, aceptas nuestros{" "}
      <Link href="/terms" className={termsClassName}>
        Términos y Condiciones
      </Link>
      {showAnd && " y "}
      <Link href="/privacy" className={privacyClassName}>
        Política de Privacidad
      </Link>
    </span>
  );
}
