export interface Status {
  show: boolean;
  text: string;
  color: string;
}

export interface RootState {
  loading: boolean;
  //version: string;
  status: Status;
}
