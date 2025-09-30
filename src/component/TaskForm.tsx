import { Field, Fieldset, For, Input, NativeSelect, Button, Text, Box } from "@chakra-ui/react";
import { Task } from "../interfaces/Task.interface";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../client";

interface TaskFormProps {
  onClose: (isNewTaskModalOpen: boolean) => void;
}

function TaskForm({ onClose }: TaskFormProps) {
  const queryClient = useQueryClient();

  const { data: columns } = useQuery({
    queryKey: ["columns"],
    queryFn: () => client.get("columns").then((res) => res.data),
  });


  const { mutate: createTask } = useMutation<AxiosResponse<Task>, Error, Partial<Task>, { oldTask: Task[] }>({
    onMutate: (task: Partial<Task>) => {
      const oldTask = queryClient.getQueryData(["tasks"]) as Task[];
      queryClient.setQueryData(["tasks"], (oldTask: Task[]) => {
        return [...oldTask, {...task, id: Date.now()}];
      });
      return { oldTask };
    },
    mutationFn: (task: Partial<Task>) => client.post("tasks", task),
    onSuccess: (taskResponse) => {
      queryClient.setQueryData(["tasks"], (oldTask: Task[]) => {
        return [...oldTask, taskResponse.data];
      });
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(["tasks"], () => context.oldTask);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const taskSchema = z.object({
    title: z.string().min(3, { error: "Title must be at least 3 characters" }),
    priority: z.literal(["Low", "Normal", "High"], {error:  "Invalid priority"}),
    status: z.literal(["To Do", "In Progress", "Done"], {error: "Invalid status"}),
  });

  type TaskFormData = z.infer<typeof taskSchema>;
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const handleFormSubmit = (data: TaskFormData) => {
    const columnId = data.status === "To Do" ? columns[0].id : data.status === "In Progress" ? columns[1].id : columns[2].id;
    const task = {
      title: data.title,
      priority: data.priority,
      columnId: Number(columnId),
    };
    reset();
    console.log('task to create', {task});
    createTask(task);
    onClose(false);
  }

  
  return (
   <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Fieldset.Root size="lg" invalid>
            <Fieldset.Legend color="gray.200" fontSize="lg" fontWeight="bold" mx="auto">
              New Task
            </Fieldset.Legend>
            <Fieldset.Content>
              <Field.Root>
                <Field.Label>Title</Field.Label>
                <Input {...register("title")} />
                {errors.title?.message && <Text color="red.300">{errors.title?.message}</Text>}
              </Field.Root>
              <Field.Root>
                <Field.Label>Priority</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register("priority")}>
                    <For each={["Low", "Normal", "High"]}>
                      {(item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      )}
                    </For>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                {errors.priority?.message && (
                  <Text color="red.300">{errors.priority?.message}</Text>
                )}
              </Field.Root>
              <Field.Root>
                <Field.Label>Status</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register("status")}>
                    <For each={["To Do", "In Progress", "Done"]}>
                      {(item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      )}
                    </For>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                  {errors.status?.message && <Text color="red.300">{errors.status?.message}</Text>}
                </NativeSelect.Root>
              </Field.Root>
            </Fieldset.Content>
          </Fieldset.Root>
          <Button mt={4} w="100%" bg="blue.700" color="white" type="submit" loading={isSubmitting}>
            Create Task
          </Button>
        </form> 
  )
}

export default TaskForm;