import {
  BlockCategory,
  EventPayload,
  ParseEventResponse,
} from 'workflow-shared';
import { Action } from './action/action';
import { BlockBase, BlockMetadata } from './block-metadata';
import { PieceAuthProperty } from './property/authentication';
import { Trigger } from './trigger/trigger';

export class Piece<PieceAuth extends PieceAuthProperty = PieceAuthProperty>
  implements Omit<BlockBase, 'version' | 'name'>
{
  private readonly _actions: Record<string, Action> = {};
  private readonly _triggers: Record<string, Trigger> = {};

  constructor(
    public readonly displayName: string,
    public readonly logoUrl: string,
    public readonly authors: string[],
    public readonly events: PieceEventProcessors | undefined,
    actions: Action<PieceAuth>[],
    triggers: Trigger<PieceAuth>[],
    public readonly categories: BlockCategory[],
    public readonly auth?: PieceAuth,
    public readonly minimumSupportedRelease?: string,
    public readonly maximumSupportedRelease?: string,
    public readonly description = '',
  ) {
    actions.forEach((action) => (this._actions[action.name] = action));
    triggers.forEach((trigger) => (this._triggers[trigger.name] = trigger));
  }

  metadata(): BackwardCompatiblePieceMetadata {
    return {
      displayName: this.displayName,
      logoUrl: this.logoUrl,
      actions: this._actions,
      triggers: this._triggers,
      categories: this.categories,
      description: this.description,
      authors: this.authors,
      auth: this.auth,
      minimumSupportedRelease: this.minimumSupportedRelease,
      maximumSupportedRelease: this.maximumSupportedRelease,
    };
  }

  getAction(actionName: string): Action | undefined {
    return this._actions[actionName];
  }

  getTrigger(triggerName: string): Trigger | undefined {
    return this._triggers[triggerName];
  }

  actions() {
    return this._actions;
  }

  triggers() {
    return this._triggers;
  }
}

export const createPiece = <PieceAuth extends PieceAuthProperty>(
  params: CreatePieceParams<PieceAuth>
) => {
  return new Piece(
    params.displayName,
    params.logoUrl,
    params.authors ?? [],
    params.events,
    params.actions,
    params.triggers,
    params.categories ?? [],
    params.auth ?? undefined,
    params.minimumSupportedRelease,
    params.maximumSupportedRelease,
    params.description,
  );
};

type CreatePieceParams<
  PieceAuth extends PieceAuthProperty = PieceAuthProperty
> = {
  displayName: string;
  logoUrl: string;
  authors: string[];
  description?: string;
  auth: PieceAuth | undefined;
  events?: PieceEventProcessors;
  minimumSupportedRelease?: string;
  maximumSupportedRelease?: string;
  actions: Action<PieceAuth>[];
  triggers: Trigger<PieceAuth>[];
  categories?: BlockCategory[];
};

type PieceEventProcessors = {
  parseAndReply: (ctx: { payload: EventPayload }) => ParseEventResponse;
  verify: (ctx: {
    webhookSecret: string | Record<string, string>;
    payload: EventPayload;
    appWebhookUrl: string;
  }) => boolean;
};

type BackwardCompatiblePieceMetadata = Omit<BlockMetadata, 'name' | 'version' | 'authors'> & {
  authors?: BlockMetadata['authors']
}
