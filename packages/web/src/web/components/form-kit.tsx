import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldBase =
  "h-11 w-full rounded-xl border border-line bg-white px-4 text-[0.95rem] text-ink outline-none transition placeholder:text-muted/60 focus:border-navy/50 focus:ring-2 focus:ring-navy/10";

export function Label({ children, htmlFor, required }: { children: React.ReactNode; htmlFor?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[0.8rem] font-bold uppercase tracking-[0.1em] text-navy">
      {children}
      {required && <span className="ml-1 text-red">*</span>}
    </label>
  );
}

export function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label required={required}>{label}</Label>
      {children}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(fieldBase, className)} {...props} />,
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, "h-auto min-h-[120px] py-3 leading-relaxed", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, "appearance-none bg-white pr-10", className)} {...props}>
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export function FormSuccess({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-navy/15 bg-white p-10 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gold/20">
        <CheckCircle2 className="size-8 text-navy" />
      </div>
      <h3 className="font-display text-2xl text-navy">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-ink/70">{message}</p>
    </div>
  );
}

export function OptionCards<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T | "";
  onChange: (v: T) => void;
  options: { value: T; label: string; desc: string }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-xl border p-4 text-left transition",
              active ? "border-red bg-[#FBEBED] ring-2 ring-red/20" : "border-line bg-white hover:border-navy/40",
            )}
          >
            <div className={cn("font-display text-lg", active ? "text-red-ink" : "text-navy")}>{opt.label}</div>
            <div className="mt-0.5 text-sm text-ink/65">{opt.desc}</div>
          </button>
        );
      })}
    </div>
  );
}
