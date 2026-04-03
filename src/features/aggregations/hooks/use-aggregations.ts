import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../lib/toast-context';
import { AggregationRepositoryImpl } from '../api/aggregation-repository-impl';
import {
  GetOpenAggregationsUseCase,
  GetAggregationDetailUseCase,
  CreateAggregationUseCase,
  ContributeToAggregationUseCase,
  UpdateAggregationStatusUseCase,
  VerifyAggregationItemUseCase,
  UpdateAggregationItemStatusUseCase,
  GetMyAggregationsUseCase,
  GetAssociationAggregationsUseCase,
  GetCropTypesUseCase,
  DeleteAggregationUseCase
} from '../services';
import type { Aggregation, CropType } from '../types/aggregation';


const repository = new AggregationRepositoryImpl();

// Use Cases
const getOpenAggregationsUseCase = new GetOpenAggregationsUseCase(repository);
const getAggregationDetailUseCase = new GetAggregationDetailUseCase(repository);
const createAggregationUseCase = new CreateAggregationUseCase(repository);
const contributeToAggregationUseCase = new ContributeToAggregationUseCase(repository);
const updateAggregationStatusUseCase = new UpdateAggregationStatusUseCase(repository);
const verifyAggregationItemUseCase = new VerifyAggregationItemUseCase(repository);
const updateAggregationItemStatusUseCase = new UpdateAggregationItemStatusUseCase(repository);
const getMyAggregationsUseCase = new GetMyAggregationsUseCase(repository);
const getAssociationAggregationsUseCase = new GetAssociationAggregationsUseCase(repository);
const getCropTypesUseCase = new GetCropTypesUseCase(repository);
const deleteAggregationUseCase = new DeleteAggregationUseCase(repository);

// Queries
export const useAggregations = (params?: any) => {
  return useQuery<Aggregation[]>({
    queryKey: ['aggregations', params],
    queryFn: () => getOpenAggregationsUseCase.execute(params),
  });
};

export const useOpenAggregations = (params?: {
  skip?: number;
  limit?: number;
  cropTypeId?: string;
  minQuantity?: number;
  keyword?: string;
  region?: string;
}) => {
  return useQuery<Aggregation[]>({
    queryKey: ['open-aggregations', params],
    queryFn: () => getOpenAggregationsUseCase.execute(params),
  });
};

export const useAggregationDetail = (id: string) => {
  return useQuery<Aggregation>({
    queryKey: ['aggregation', id],
    queryFn: () => getAggregationDetailUseCase.execute(id),
    enabled: !!id,
  });
};

export const useMyAggregations = (params?: { skip?: number; limit?: number; keyword?: string }) => {
  return useQuery<Aggregation[]>({
    queryKey: ['my-aggregations', params],
    queryFn: () => getMyAggregationsUseCase.execute(params),
  });
};

export const useAssociationAggregations = (associationId: string, params?: { skip?: number; limit?: number; keyword?: string }) => {
  return useQuery<Aggregation[]>({
    queryKey: ['association-aggregations', associationId, params],
    queryFn: () => getAssociationAggregationsUseCase.execute(associationId, params),
    enabled: !!associationId,
  });
};

export const useCropTypes = () => {
  return useQuery<CropType[]>({
    queryKey: ['crop-types'],
    queryFn: () => getCropTypesUseCase.execute(),
  });
};

// Mutations
export const useCreateAggregation = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof createAggregationUseCase.execute>[0]) =>
      createAggregationUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-aggregations'] });
      queryClient.invalidateQueries({ queryKey: ['my-aggregations'] });
      toast.success('Aggregation pool created successfully');
    },
  });
};

export const useDeleteAggregation = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAggregationUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aggregations'] });
      queryClient.invalidateQueries({ queryKey: ['my-aggregations'] });
      queryClient.invalidateQueries({ queryKey: ['open-aggregations'] });
      toast.success('Deleted successfully');
    },
  });
};

export const useContributeToAggregation = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: [string, Parameters<typeof contributeToAggregationUseCase.execute>[1]]) =>
      contributeToAggregationUseCase.execute(variables[0], variables[1]),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['aggregation', variables[0]] });
      queryClient.invalidateQueries({ queryKey: ['open-aggregations'] });
      toast.success('Contribution submitted successfully');
    },
  });
};

export const useUpdateAggregationStatus = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: [string, Parameters<typeof updateAggregationStatusUseCase.execute>[1]]) =>
      updateAggregationStatusUseCase.execute(variables[0], variables[1]),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['aggregation', variables[0]] });
      queryClient.invalidateQueries({ queryKey: ['my-aggregations'] });
      queryClient.invalidateQueries({ queryKey: ['association-aggregations'] });
      toast.success(`Aggregation status updated to ${(variables[1] as string).replaceAll('_', ' ').toUpperCase()}`);
    },
  });
};

export const useVerifyAggregationItem = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: [string, string, number, NonNullable<any>, string?]) =>
      verifyAggregationItemUseCase.execute(variables[0], variables[1], variables[2], variables[3], variables[4]),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['aggregation', variables[0]] });
      toast.success('Quality verification recorded successfully');
    },
  });
};

export const useUpdateAggregationItemStatus = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: [string, string, any, string?]) =>
      updateAggregationItemStatusUseCase.execute(variables[0], variables[1], variables[2], variables[3]),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['aggregation', variables[0]] });
      toast.success('Item status updated successfully');
    },
  });
};