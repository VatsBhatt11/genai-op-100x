import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface NaturalLanguageSearchProps {
  onSearch: (query: string) => Promise<void>;
  isLoading?: boolean;
}

export function NaturalLanguageSearch({ onSearch, isLoading }: NaturalLanguageSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await onSearch(query);
    }
  };

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium">
            Describe the candidate you're looking for
          </label>
          <Textarea
            id="search"
            placeholder="e.g., Find senior Gen-AI engineers with LangChain + RAG experience in Europe, open to contract work"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            'Search Candidates'
          )}
        </Button>
      </form>
    </Card>
  );
} 