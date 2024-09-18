export interface IBaseContract {
  id: number;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
  is_deleted: boolean;
  deleted_at: Date;
}
