import { Trash, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface filterBadgesProps {
    activeFilters: string[];
    handleFilterChange: (title: string, checked: boolean ) => void;
    handleClearFilters: () => void
}

const FilterBadges = ( { activeFilters, handleFilterChange, handleClearFilters }: filterBadgesProps) => {
    
    return (
        <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
            <Badge
                key={`${filter}-${index}`}
                variant="outline"
                className="flex h-6 items-center gap-1 px-1 bg-white"
            >
                {filter}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 hover:bg-transparent"
                    onClick={() => handleFilterChange(filter, false)}
                >
                    <X className="" />
                </Button>
            </Badge>
            ))}
            {activeFilters.length > 0 && (
                <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs h-6 border bg-white shadow"
                    onClick={handleClearFilters}
                >
                    <Trash />
                    Clear all
                </Button>
            )}
        </div>
    );
};

export default FilterBadges