// TODO: THIS IS THE DEFAULT DASHBOARD PAGE THAT THE USER WILL SEE AFTER AUTHENTICATION. ADD MAIN FUNCTIONALITY HERE.
// This is the entry point for users who have just signed in

import { Protected } from "@/lib/protected-page";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  CheckCircle, 
  Plus, 
  Filter, 
  Calendar,
  Target,
  Briefcase,
  User,
  ShoppingCart,
  Heart,
  BookOpen,
  MoreHorizontal,
  TrendingUp,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@/components/auth/UserButton";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

const categoryIcons = {
  work: Briefcase,
  personal: User,
  shopping: ShoppingCart,
  health: Heart,
  learning: BookOpen,
  other: MoreHorizontal,
};

const priorityColors = {
  urgent: "bg-red-500 text-white",
  high: "bg-orange-500 text-white", 
  medium: "bg-yellow-500 text-black",
  low: "bg-green-500 text-white",
};

const categoryColors = {
  work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  personal: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  health: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  learning: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

function CreateTodoDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");
  const [dueDate, setDueDate] = useState("");

  const createTodo = useMutation(api.todos.createTodo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        priority: priority as any,
        category: category as any,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      });
      
      toast.success("Todo created successfully!");
      setOpen(false);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("personal");
      setDueDate("");
    } catch (error) {
      toast.error("Failed to create todo");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
          <Plus className="w-4 h-4 mr-2" />
          Add Todo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">Create Todo</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TodoItem({ todo }: { todo: any }) {
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const handleToggle = async () => {
    try {
      await toggleTodo({ id: todo._id });
      toast.success(todo.completed ? "Todo marked as pending" : "Todo completed!");
    } catch (error) {
      toast.error("Failed to update todo");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo({ id: todo._id });
      toast.success("Todo deleted");
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  };

  const CategoryIcon = categoryIcons[todo.category as keyof typeof categoryIcons];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-200 ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <CategoryIcon className="w-4 h-4 text-muted-foreground" />
            <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
              {todo.title}
            </h3>
          </div>
          
          {todo.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {todo.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={priorityColors[todo.priority as keyof typeof priorityColors]}>
              {todo.priority}
            </Badge>
            <Badge variant="secondary" className={categoryColors[todo.category as keyof typeof categoryColors]}>
              {todo.category}
            </Badge>
            {todo.dueDate && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(todo.dueDate), 'MMM dd')}
              </Badge>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          ×
        </Button>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const todos = useQuery(api.todos.getTodos, {
    completed: filter === 'all' ? undefined : filter === 'completed',
    category: categoryFilter === 'all' ? undefined : categoryFilter as any,
  });
  const stats = useQuery(api.todos.getTodoStats);

  const filteredTodos = todos || [];

  return (
    <Protected>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        {/* Header */}
        <motion.header 
          className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                  <p className="text-sm text-muted-foreground">Stay organized, stay productive</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <CreateTodoDialog />
                <UserButton />
              </div>
            </div>
          </div>
        </motion.header>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Stats Cards */}
            <motion.div 
              className="lg:col-span-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="gradient-card border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Total Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total || 0}</div>
                </CardContent>
              </Card>

              <Card className="gradient-card border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats?.completed || 0}</div>
                </CardContent>
              </Card>

              <Card className="gradient-card border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats?.pending || 0}</div>
                </CardContent>
              </Card>

              <Card className="gradient-card border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Filters */}
            <motion.div 
              className="lg:col-span-4 flex flex-wrap gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              
              <div className="flex gap-2">
                {['all', 'pending', 'completed'].map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(f as any)}
                    className={filter === f ? 'bg-gradient-to-r from-primary to-primary/80' : ''}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                {['all', 'work', 'personal', 'shopping', 'health', 'learning', 'other'].map((cat) => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter(cat)}
                    className={categoryFilter === cat ? 'bg-gradient-to-r from-primary to-primary/80' : ''}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Todo List */}
            <motion.div 
              className="lg:col-span-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="space-y-3">
                {filteredTodos.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No todos found</h3>
                    <p className="text-muted-foreground mb-6">
                      {filter === 'all' ? 'Create your first todo to get started!' : `No ${filter} todos yet.`}
                    </p>
                    <CreateTodoDialog />
                  </div>
                ) : (
                  filteredTodos.map((todo) => (
                    <TodoItem key={todo._id} todo={todo} />
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Protected>
  );
}