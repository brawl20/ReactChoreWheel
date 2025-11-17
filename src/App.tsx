import { useState } from 'react';
import { ChoreWheel } from './components/ChoreWheel';
import { NamesList } from './components/NamesList';
import { TasksList } from './components/TasksList';
import { ManualAssignment } from './components/ManualAssignment';
import { Button } from './components/ui/button';
import { RotateCw, ChevronRight, Settings } from 'lucide-react';

export default function App() {
  const [names, setNames] = useState<string[]>(() => {
    const saved = localStorage.getItem('choreWheel_names');
    return saved ? JSON.parse(saved) : ['Alice', 'Bob', 'Charlie'];
  });
  const [tasks, setTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem('choreWheel_tasks');
    return saved ? JSON.parse(saved) : ['Dishes', 'Vacuum', 'Laundry', 'Trash'];
  });
  const [assignments, setAssignments] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('choreWheel_assignments');
    return saved ? JSON.parse(saved) : {};
  });
  const [rotation, setRotation] = useState(() => {
    const saved = localStorage.getItem('choreWheel_rotation');
    return saved ? parseFloat(saved) : 0;
  });
  const [showManualAssignment, setShowManualAssignment] = useState(false);

  // Save to localStorage whenever state changes
  const updateNames = (newNames: string[]) => {
    setNames(newNames);
    localStorage.setItem('choreWheel_names', JSON.stringify(newNames));
  };

  const updateTasks = (newTasks: string[]) => {
    setTasks(newTasks);
    localStorage.setItem('choreWheel_tasks', JSON.stringify(newTasks));
  };

  const updateAssignmentsState = (newAssignments: Record<string, string>) => {
    setAssignments(newAssignments);
    localStorage.setItem('choreWheel_assignments', JSON.stringify(newAssignments));
  };

  const updateRotation = (newRotation: number) => {
    setRotation(newRotation);
    localStorage.setItem('choreWheel_rotation', newRotation.toString());
  };

  const advanceWheel = () => {
    if (names.length === 0 || Object.keys(assignments).length === 0 || tasks.length === 0) return;
    
    // Rotate wheel by one segment
    const segmentAngle = 360 / names.length;
    updateRotation(rotation + segmentAngle);
    
    // Create new assignments based on tasks list order
    const newAssignments: Record<string, string> = {};
    names.forEach((name) => {
      const currentChore = assignments[name];
      if (currentChore) {
        const currentIndex = tasks.indexOf(currentChore);
        if (currentIndex !== -1) {
          // Move to next chore in the tasks list, wrap around if at the end
          const nextIndex = (currentIndex + 1) % tasks.length;
          newAssignments[name] = tasks[nextIndex];
        }
      }
    });
    
    updateAssignmentsState(newAssignments);
  };

  const updateAssignment = (name: string, task: string) => {
    const newAssignments = { ...assignments, [name]: task };
    updateAssignmentsState(newAssignments);
  };

  const addName = (name: string) => {
    if (name.trim() && !names.includes(name.trim())) {
      updateNames([...names, name.trim()]);
    }
  };

  const removeName = (name: string) => {
    updateNames(names.filter(n => n !== name));
    const newAssignments = { ...assignments };
    delete newAssignments[name];
    updateAssignmentsState(newAssignments);
  };

  const addTask = (task: string) => {
    if (task.trim() && !tasks.includes(task.trim())) {
      updateTasks([...tasks, task.trim()]);
    }
  };

  const removeTask = (task: string) => {
    updateTasks(tasks.filter(t => t !== task));
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    const result = Array.from(tasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    updateTasks(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2">Chore Wheel</h1>
          <p className="text-gray-600">Add names and tasks, then spin the wheel to assign chores!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <NamesList 
            names={names} 
            onAddName={addName} 
            onRemoveName={removeName}
          />
          
          <div className="flex flex-col items-center justify-center">
            <ChoreWheel 
              names={names} 
              tasks={tasks}
              assignments={assignments}
              rotation={rotation}
            />
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={advanceWheel}
                size="lg"
                disabled={names.length === 0 || Object.keys(assignments).length === 0 || tasks.length === 0}
              >
                <ChevronRight className="mr-2 h-5 w-5" />
                Advance Wheel
              </Button>
              {names.length > 0 && tasks.length > 0 && (
                <Button 
                  onClick={() => setShowManualAssignment(!showManualAssignment)}
                  size="lg"
                  variant="outline"
                >
                  <Settings className="mr-2 h-5 w-5" />
                  {showManualAssignment ? 'Hide' : 'Assign'}
                </Button>
              )}
            </div>
          </div>

          <TasksList 
            tasks={tasks} 
            onAddTask={addTask} 
            onRemoveTask={removeTask}
            onReorderTasks={reorderTasks}
          />
        </div>

        {/* Current Assignments */}
        {Object.keys(assignments).length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mb-6">
            <h2 className="text-2xl mb-4 text-center">Current Assignments</h2>
            <div className="grid gap-3">
              {names.map((name) => (
                assignments[name] && (
                  <div key={name} className="flex items-center justify-between p-3 bg-purple-50 rounded-md">
                    <span className="text-purple-900">{name}</span>
                    <span className="text-blue-900">{assignments[name]}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {showManualAssignment && names.length > 0 && tasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-6">
            <h2 className="text-2xl mb-4 text-center">Manual Assignment</h2>
            <p className="text-sm text-gray-500 text-center mb-4">Assign or update chores for each person</p>
            <div className="grid gap-3">
              {names.map((name) => (
                <div key={name} className="flex items-center justify-between gap-4">
                  <span className="text-purple-900 min-w-[100px]">{name}</span>
                  <select
                    className="flex-1 p-2 border rounded-md"
                    value={assignments[name] || ''}
                    onChange={(e) => {
                      updateAssignment(name, e.target.value);
                      // Auto-collapse after assignment if all are assigned
                      const updatedAssignments = { ...assignments, [name]: e.target.value };
                      const allAssigned = names.every(n => updatedAssignments[n]);
                      if (allAssigned) {
                        setTimeout(() => setShowManualAssignment(false), 300);
                      }
                    }}
                  >
                    <option value="">Select a chore...</option>
                    {tasks.map((task) => (
                      <option key={task} value={task}>
                        {task}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}