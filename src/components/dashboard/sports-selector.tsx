'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SPORTS = [
  { id: 'cricket', name: 'Cricket' },
  { id: 'football', name: 'Football' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'tennis', name: 'Tennis' },
  { id: 'swimming', name: 'Swimming' },
  { id: 'athletics', name: 'Athletics' },
];

interface SportsSelectorProps {
  onSportChange?: (sportId: string) => void;
}

export default function SportsSelector({ onSportChange }: SportsSelectorProps) {
  const [selectedSport, setSelectedSport] = useState(SPORTS[0].id);

  const handleSportChange = (value: string) => {
    setSelectedSport(value);
    onSportChange?.(value);
  };

  return (
    <div className="px-2 py-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Sport: {SPORTS.find(s => s.id === selectedSport)?.name}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuRadioGroup value={selectedSport} onValueChange={handleSportChange}>
            {SPORTS.map((sport) => (
              <DropdownMenuRadioItem key={sport.id} value={sport.id}>
                {sport.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}