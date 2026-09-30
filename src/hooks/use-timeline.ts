import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timelineService } from "../services/timeline.service";
import { CreateActivityInput } from "../schemas/timeline.schema";

export const ACTIVITIES_QUERY_KEY = ["crm", "activities"];

export function useActivities(customerId?: string) {
  return useQuery({
    queryKey: customerId ? [...ACTIVITIES_QUERY_KEY, customerId] : ACTIVITIES_QUERY_KEY,
    queryFn: () => timelineService.getActivities(customerId),
  });
}

export function useCreateActivity(customerId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateActivityInput) => timelineService.createActivity(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
    },
  });
}
