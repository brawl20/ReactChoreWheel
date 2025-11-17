import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ManualAssignmentProps {
  names: string[];
  tasks: string[];
  assignments: Record<string, string>;
  onUpdateAssignment: (name: string, task: string) => void;
}

export function ManualAssignment({ names, tasks, assignments, onUpdateAssignment }: ManualAssignmentProps) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="mb-4 text-center text-gray-700">Manual Assignment</h3>
      <div className="grid gap-3">
        {names.map((name) => (
          <div key={name} className="flex items-center justify-between gap-4">
            <span className="text-purple-900 min-w-[100px]">{name}</span>
            <Select
              value={assignments[name] || ''}
              onValueChange={(value) => onUpdateAssignment(name, value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a chore..." />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((task) => (
                  <SelectItem key={task} value={task}>
                    {task}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
