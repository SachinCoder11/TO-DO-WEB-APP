import { useEffect, useState } from "react"; 
import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

function App() {
  // State variables
  const [task, setTask] = useState(""); 
  const [dateTime, setDateTime] = useState(""); 
  const [tasks, setTasks] = useState([]); 
  const [editId, setEditId] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true); 
  const [showCompleted, setShowCompleted] = useState(false); 
  const [error, setError] = useState(""); // State for error messages

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    setInitialLoad(false);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!initialLoad) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, initialLoad]);

  // Handle editing a task
  const handleEdit = (id) => {
    const taskToEdit = tasks.find(item => item.id === id);
    setTask(taskToEdit.task);
    setDateTime(taskToEdit.dateTime);
    setEditId(id);
  };

  // Handle deleting a task
  const handleDelete = (id) => {
    const updatedTasks = tasks.filter(item => item.id !== id);
    setTasks(updatedTasks);
  };

  // Toggle visibility of completed tasks
  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  // Handle adding a new task or updating an existing one
  const handleAdd = () => {
    if (task.trim()) {
      setError(""); // Clear previous error message
      if (editId) {
        // Update existing task
        setTasks(tasks.map(item => 
          item.id === editId ? { ...item, task, dateTime } : item
        ));
        setEditId(null);
      } else {
        // Add new task
        setTasks([...tasks, { id: uuidv4(), task, dateTime, isCompleted: false }]);
      }
      // Clear input fields
      setTask("");
      setDateTime(""); 
    } else {
      setError("Task cannot be empty!"); // Set error message if task is empty
    }
  };

  // Handle input changes for task and date
  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };

  const handleDateChange = (e) => {
    setDateTime(e.target.value);
  };

  // Toggle task completion status
  const toggleCompletion = (id) => {
    setTasks(tasks.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  return (
    <>
      <Navbar />
      <div className="container flex flex-col items-center m-auto my-5 rounded-xl p-5 bg-purple-300 w-full sm:w-3/4 lg:w-1/2 min-h-[80vh]">
        <h1 className="font-bold text-center text-2xl mb-5">Task-Manage Your Tasks</h1>
        
        {/* Error Message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Task addition section */}
        <div className="addtask flex flex-col gap-4 w-full">
          <input
            onChange={handleTaskChange}
            value={task}
            type="text"
            className="rounded-full px-5 py-2 border-2 border-purple-600 w-full"
            placeholder="Add a new task..."
            aria-label="New task"
          />
          <input
            type="datetime-local"
            value={dateTime}
            onChange={handleDateChange}
            className="rounded-full px-5 py-2 border-2 border-purple-600 w-full"
            aria-label="Due date and time"
          />
          <button
            onClick={handleAdd}
            className="bg-purple-800 hover:bg-purple-950 p-3 text-white rounded-full text-sm font-bold w-full"
            aria-label={editId ? "Update task" : "Save task"}
          >
            {editId ? "Update" : "Save"}
          </button>
        </div>
        
        {/* Show completed tasks toggle */}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={toggleShowCompleted}
            className="mr-2"
            aria-label="Show completed tasks"
          />
          <label className="text-sm font-semibold">Show Completed Tasks</label>
        </div>

        {/* Task list */}
        <div className="tasks w-full mt-4 overflow-auto max-h-80">
          <h2 className="text-lg font-bold">Your Tasks</h2>
          {tasks.length === 0 && <div className="m-5">No tasks available</div>}
          {tasks.filter(item => showCompleted || !item.isCompleted).map(item => (
            <div key={item.id} className="task flex justify-between items-center my-2 w-full p-3 bg-white shadow-md rounded-md">
              <div className="flex items-center gap-3">
                <input
                  name={item.id}
                  onChange={() => toggleCompletion(item.id)}
                  type="checkbox"
                  checked={item.isCompleted}
                  className="cursor-pointer"
                  aria-label={`Mark task ${item.task} as completed`}
                />
                <span className={item.isCompleted ? "line-through text-gray-500" : ""}>{item.task}</span>
              </div>
              <div className="text-sm text-gray-500">{item.dateTime}</div>
              <div className="buttons flex">
                <button 
                  onClick={() => handleEdit(item.id)} 
                  className="bg-purple-800 hover:bg-purple-950 p-2 text-white rounded-full mx-1" 
                  aria-label={`Edit task ${item.task}`}
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="bg-purple-800 hover:bg-purple-950 p-2 text-white rounded-full mx-1" 
                  aria-label={`Delete task ${item.task}`}
                >
                  <MdDeleteSweep />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App; 
