import { BaseModel, ProjectId } from "workflow-shared";

export type ConnectionKeyId = string;

export interface ConnectionKey extends BaseModel<ConnectionKeyId> {
  projectId: ProjectId;
  settings: SigningKeyConnection;
}

export interface SigningKeyConnection {
  type: ConnectionKeyType.SIGNING_KEY;
  publicKey: string;
  privateKey?: string;
}

export enum ConnectionKeyType {
  SIGNING_KEY = "SIGNING_KEY"
}
