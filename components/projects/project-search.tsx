"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export default function ProjectSearch({ value, onChange, debounceMs = 400 }: ProjectSearchProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  return (
    <Input
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      placeholder="Search projects..."
      className="max-w-sm"
      aria-label="Search projects"
    />
  );
}
