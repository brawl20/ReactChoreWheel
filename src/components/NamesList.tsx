import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X, Plus } from 'lucide-react';

interface NamesListProps {
  names: string[];
  onAddName: (name: string) => void;
  onRemoveName: (name: string) => void;
}

export function NamesList({ names, onAddName, onRemoveName }: NamesListProps) {
  const [newName, setNewName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddName(newName);
    setNewName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>People</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add a name..."
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {names.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No names yet</p>
          ) : (
            names.map((name) => (
              <div
                key={name}
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg group hover:bg-purple-100 transition-colors"
              >
                <span>{name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveName(name)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
