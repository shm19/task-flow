import {
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
  Button,
  Text,
  Box,
} from "@chakra-ui/react"
import { Task } from "./Board";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../client";
import { AxiosResponse } from "axios";

interface NewTaskModalProps {
  isNewTaskModalOpen: boolean;
  onClose: (isNewTaskModalOpen: boolean) => void;
}

function NewTaskModal({ isNewTaskModalOpen, onClose }: NewTaskModalProps) {
  const queryClient = useQueryClient();

  const taskSchema = z.object({
    title: z.string().min(3, { error: "Title must be at least 3 characters" }),
    priority: z.literal(["Low", "Normal", "High"], {error:  "Invalid priority"}),
    status: z.literal(["To Do", "In Progress", "Done"], {error: "Invalid status"}),
  });

  type TaskFormData = z.infer<typeof taskSchema>;
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
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

  const { data: columns } = useQuery({
    queryKey: ["columns"],
    queryFn: () => client.get("columns").then((res) => res.data),
  });

  if(!isNewTaskModalOpen) return null;

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

  const clickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(false);
    }
  }

  return (
    <Box position='fixed' top={0} left={0} right={0} bottom={0} bgColor='rgba(123, 118, 118, 0.4)' zIndex={999} onClick={clickOutside}>
    <Box mx='auto' w='500px' mt={24} bgColor='blue.500' p={4} borderRadius='lg' zIndex={1000}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Fieldset.Root size="lg" invalid>
      <Fieldset.Legend color='gray.200' fontSize='lg' fontWeight='bold' mx='auto'>New Task</Fieldset.Legend>
      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Title</Field.Label>
          <Input {...register("title")} />
          {errors.title?.message && <Text color='red.300'>{errors.title?.message}</Text>}
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
          {errors.priority?.message && <Text color='red.300'>{errors.priority?.message}</Text>}
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
            {errors.status?.message && <Text color='red.300'>{errors.status?.message}</Text>}
          </NativeSelect.Root>
        </Field.Root>
      </Fieldset.Content>
      </Fieldset.Root>
      <Button mt={4} w='100%' bg='blue.700' color='white' type="submit" loading={isSubmitting}>Create Task</Button>
      </form>
    </Box>
    </Box>
  )
}


export default NewTaskModal;