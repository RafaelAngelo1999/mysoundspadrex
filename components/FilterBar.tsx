"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterBarProps {
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function FilterBar({
  allTags,
  selectedTags,
  onTagsChange,
}: FilterBarProps) {
  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Select onValueChange={handleAddTag}>
          <SelectTrigger className="w-full sm:w-[250px] h-11">
            <SelectValue placeholder="Filtrar por tag" />
          </SelectTrigger>
          <SelectContent>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedTags.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="default" className="pl-3 pr-1 py-1.5">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1.5 hover:text-destructive"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
