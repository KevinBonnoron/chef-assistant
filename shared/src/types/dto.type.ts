export type CreateDto<T> = Omit<T, 'id'>;
export type UpdateDto<T> = Partial<CreateDto<T>>;
