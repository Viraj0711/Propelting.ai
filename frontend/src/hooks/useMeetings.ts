import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingService, actionItemService } from '@/services';
import {
  Meeting,
  MeetingSummary,
  Transcript,
  ActionItem,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  CreateActionItemRequest,
  UpdateActionItemRequest,
  MeetingStats,
  PaginatedResponse,
  PaginationParams,
  FilterParams,
} from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/uiSlice';

/**
 * Hook to get all meetings
 */
export const useMeetings = (params?: PaginationParams & FilterParams) => {
  return useQuery<PaginatedResponse<Meeting>, Error>({
    queryKey: ['meetings', params],
    queryFn: () => meetingService.getMeetings(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to get meeting by ID
 */
export const useMeeting = (id: string) => {
  return useQuery<Meeting, Error>({
    queryKey: ['meetings', id],
    queryFn: () => meetingService.getMeetingById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create meeting
 */
export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: CreateMeetingRequest) => meetingService.createMeeting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      dispatch(addToast({ type: 'success', message: 'Meeting created successfully' }));
    },
    onError: (error: Error) => {
      dispatch(addToast({ type: 'error', message: error.message }));
    },
  });
};

/**
 * Hook to update meeting
 */
export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMeetingRequest }) =>
      meetingService.updateMeeting(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['meetings', variables.id] });
      dispatch(addToast({ type: 'success', message: 'Meeting updated successfully' }));
    },
    onError: (error: Error) => {
      dispatch(addToast({ type: 'error', message: error.message }));
    },
  });
};

/**
 * Hook to delete meeting
 */
export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => meetingService.deleteMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      dispatch(addToast({ type: 'success', message: 'Meeting deleted successfully' }));
    },
    onError: (error: Error) => {
      dispatch(addToast({ type: 'error', message: error.message }));
    },
  });
};

/**
 * Hook to upload meeting file
 */
export const useUploadMeetingFile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (progress: number) => void;
    }) => meetingService.uploadMeetingFile(file, undefined, undefined, undefined, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      dispatch(addToast({ type: 'success', message: 'File uploaded successfully' }));
    },
    onError: (error: Error) => {
      dispatch(addToast({ type: 'error', message: error.message }));
    },
  });
};

/**
 * Hook to get meeting summary
 */
export const useMeetingSummary = (meetingId: string) => {
  return useQuery<MeetingSummary, Error>({
    queryKey: ['meetings', meetingId, 'summary'],
    queryFn: () => meetingService.getMeetingSummary(meetingId),
    enabled: !!meetingId,
  });
};

/**
 * Hook to get meeting transcript
 */
export const useMeetingTranscript = (meetingId: string) => {
  return useQuery<Transcript, Error>({
    queryKey: ['meetings', meetingId, 'transcript'],
    queryFn: () => meetingService.getMeetingTranscript(meetingId),
    enabled: !!meetingId,
  });
};

/**
 * Hook to get meeting action items
 */
export const useMeetingActionItems = (meetingId: string) => {
  return useQuery<ActionItem[], Error>({
    queryKey: ['meetings', meetingId, 'action-items'],
    queryFn: () => meetingService.getMeetingActionItems(meetingId),
    enabled: !!meetingId,
  });
};

/**
 * Hook to get meeting stats
 */
export const useMeetingStats = () => {
  return useQuery<MeetingStats, Error>({
    queryKey: ['meetings', 'stats'],
    queryFn: () => meetingService.getMeetingStats(),
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to get all action items
 */
export const useActionItems = (params?: PaginationParams & FilterParams) => {
  return useQuery<PaginatedResponse<ActionItem>, Error>({
    queryKey: ['action-items', params],
    queryFn: () => actionItemService.getActionItems(params),
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to create action item
 */
export const useCreateActionItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: CreateActionItemRequest) => actionItemService.createActionItem(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      queryClient.invalidateQueries({ queryKey: ['meetings', variables.meetingId, 'action-items'] });
      dispatch(addToast({ type: 'success', message: 'Action item created successfully' }));
    },
    onError: (error: Error) => {
      dispatch(addToast({ type: 'error', message: error.message }));
    },
  });
};

/**
 * Hook to update action item
 */
export const useUpdateActionItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateActionItemRequest }) =>
      actionItemService.updateActionItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      dispatch(addToast({ type: 'success', message: 'Action item updated successfully' }));
    },
    onError: (error: Error) => {
      dispatch(addToast({ type: 'error', message: error.message }));
    },
  });
};

/**
 * Hook to delete action item
 */
export const useDeleteActionItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => actionItemService.deleteActionItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      dispatch(addToast({ type: 'success', message: 'Action item deleted successfully' }));
    },
    onError: (error: Error) => {
      dispatch(addToast({ type: 'error', message: error.message }));
    },
  });
};

/**
 * Hook to complete action item
 */
export const useCompleteActionItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => actionItemService.completeActionItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      dispatch(addToast({ type: 'success', message: 'Action item completed!' }));
    },
    onError: (error: Error) => {
      dispatch(addToast({ type: 'error', message: error.message }));
    },
  });
};
