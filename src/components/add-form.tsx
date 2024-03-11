import { useState } from "react";
import useTodoStore from "../stores/useTodoStore";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Subtask from "./subtask";

var fechaActual = new Date();

// Obtiene el año, mes y día
var año = fechaActual.getFullYear();
var mes = ("0" + (fechaActual.getMonth() + 1)).slice(-2); // Suma 1 al mes, ya que los meses se indexan desde 0
var dia = ("0" + fechaActual.getDate()).slice(-2);

// Formatea la fecha en "yyyy/mm/dd"
var fechaFormateada = año + "-" + mes + "-" + dia;

export default function AddForm() {
  const { taskList, addTask } = useTodoStore();

  const [title, setTitle] = useState<string>("");
  const [subTasks] = useState<any>([]);
  const [deadline, setDeadline] = useState<string>(fechaFormateada);

  const [subtask, setSubtask] = useState<string>("");

  function handleAddSubtask() {
    const task = {
      id: subTasks.length === 0 ? 0 : subTasks.length + 1,
      content: subtask,
    };

    subTasks.push(task);
    setSubtask("");
  }

  function handleChangeSubtask(e: React.ChangeEvent<HTMLInputElement>) {
    setSubtask(e.target.value);
  }

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function handleChangeDate(e: React.ChangeEvent<HTMLInputElement>) {
    setDeadline(e.target.value.split("T")[0]);
  }

  function handleSubmit() {
    if (!deadline) return;
    if (subTasks.length < 1) return;

    const newTask = {
      id: taskList.length === 0 ? 1 : taskList.length + 1,
      title,
      state: "todo" as const,
      deadline,
      subtasks: subTasks,
    };

    addTask(newTask);
  }

  return (
    <form>
      <AlertDialogContent>
        <h3>Crear tarea</h3>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          placeholder="Title"
          type="text"
          onChange={handleChangeTitle}
          value={title}
          required
        />
        <div className="w-full my-3 min-h-16 bg-zinc-100 rounded p-3">
          {subTasks?.map((t: any, i: number) => {
            return <Subtask key={i} content={t.content} />;
          })}
        </div>
        <div className="w-full flex">
          <Input
            type="text"
            placeholder="Tarea"
            onChange={handleChangeSubtask}
            value={subtask}
          />
          <Button type="button" onClick={handleAddSubtask}>
            +
          </Button>
        </div>
        <div>
          Deadline:{" "}
          <input
            type="date"
            data-testid="calendar"
            onChange={handleChangeDate}
            value={deadline}
            required
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Agregar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </form>
  );
}
