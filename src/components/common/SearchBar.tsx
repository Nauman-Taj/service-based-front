"use client";

import { Search } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSubmit: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export default function SearchBar({
  onSubmit,
  placeholder = "Search for a service",
  defaultValue = "",
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(query.trim());
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-center gap-2 rounded-full border border-line bg-card p-2 shadow-sm transition-shadow focus-within:shadow-md",
        className,
      )}
    >
      <Search
        className="ml-2 h-5 w-5 shrink-0 text-muted"
        aria-hidden="true"
      />
      <label htmlFor="service-search" className="sr-only">
        Search for a service
      </label>
      <input
        id="service-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full min-w-0 bg-transparent text-sm text-heading placeholder:text-muted focus:outline-none focus-visible:outline-none"
      />
      <Button type="submit" className="shrink-0 px-5">
        Search
      </Button>
    </form>
  );
}
