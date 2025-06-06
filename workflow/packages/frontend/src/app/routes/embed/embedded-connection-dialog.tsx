import { useEffect, useRef, useState } from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/spinner';
import { cn, parentWindow } from '@/lib/utils';
import {
  NEW_CONNECTION_QUERY_PARAMS,
  WorkflowClientConnectionNameIsInvalid,
  WorkflowClientConnectionPieceNotFound,
  WorkflowClientEventName,
  WorkflowClientShowConnectionIframe,
  WorkflowNewConnectionDialogClosed,
} from 'axb-embed-sdk';
import {
  apId,
  AppConnectionWithoutSensitiveData,
  isNil,
} from 'workflow-shared';

import { piecesHooks } from '../../../features/pieces/lib/blocks-hook';
import { CreateOrEditConnectionDialogContent } from '../../connections/create-edit-connection-dialog';

const extractIdFromQueryParams = () => {
  const connectionName = new URLSearchParams(window.location.search).get(
    NEW_CONNECTION_QUERY_PARAMS.connectionName,
  );
  return isNil(connectionName) || connectionName.length === 0
    ? apId()
    : connectionName;
};
export const EmbeddedConnectionDialog = () => {
  const connectionName = extractIdFromQueryParams();
  const blockName = new URLSearchParams(window.location.search).get(
    NEW_CONNECTION_QUERY_PARAMS.name,
  );
  const randomId = new URLSearchParams(window.location.search).get(
    NEW_CONNECTION_QUERY_PARAMS.randomId,
  );
  console.log(connectionName);
  return (
    <EmbeddedConnectionDialogContent
      connectionName={
        connectionName && connectionName.length > 0 ? connectionName : null
      }
      blockName={blockName}
      key={randomId}
    ></EmbeddedConnectionDialogContent>
  );
};

type EmbeddedConnectionDialogContentProps = {
  blockName: string | null;
  connectionName: string | null;
};

const EmbeddedConnectionDialogContent = ({
  blockName,
  connectionName,
}: EmbeddedConnectionDialogContentProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const hasErrorRef = useRef(false);

  const {
    pieceModel,
    isLoading: isLoadingPiece,
    isSuccess,
  } = piecesHooks.usePiece({
    name: blockName ?? '',
  });
  const hideConnectionIframe = (
    connection?: Pick<AppConnectionWithoutSensitiveData, 'id' | 'externalId'>,
  ) => {
    postMessageToParent({
      type: WorkflowClientEventName.CLIENT_NEW_CONNECTION_DIALOG_CLOSED,
      data: {
        connection: connection
          ? {
              id: connection.id,
              name: connection.externalId,
            }
          : undefined,
      },
    });
  };

  const postMessageToParent = (
    event:
      | WorkflowNewConnectionDialogClosed
      | WorkflowClientConnectionNameIsInvalid
      | WorkflowClientConnectionPieceNotFound,
  ) => {
    parentWindow.postMessage(event, '*');
  };
  useEffect(() => {
    const showConnectionIframeEvent: WorkflowClientShowConnectionIframe = {
      type: WorkflowClientEventName.CLIENT_SHOW_CONNECTION_IFRAME,
      data: {},
    };
    parentWindow.postMessage(showConnectionIframeEvent, '*');
    document.body.style.background = 'transparent';
  }, []);

  useEffect(() => {
    if (!isSuccess && !isLoadingPiece && !hasErrorRef.current) {
      postMessageToParent({
        type: WorkflowClientEventName.CLIENT_CONNECTION_PIECE_NOT_FOUND,
        data: {
          error: JSON.stringify({
            isValid: 'false',
            error: `block: ${blockName} not found`,
          }),
        },
      });
      hideConnectionIframe();
      hasErrorRef.current = true;
    }
  }, [isSuccess, isLoadingPiece, blockName]);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          hideConnectionIframe();
        }
      }}
    >
      <DialogContent
        showOverlay={false}
        onInteractOutside={(e) => e.preventDefault()}
        className={cn(
          'max-h-[70vh]  min-w-[450px] max-w-[450px] lg:min-w-[650px] lg:max-w-[650px] overflow-y-auto',
          {
            '!bg-transparent !border-none focus:outline-none !border-transparent !shadow-none':
              isLoadingPiece,
          },
        )}
        withCloseButton={!isLoadingPiece}
      >
        {isLoadingPiece && (
          <div className="flex justify-center items-center">
            <LoadingSpinner
              size={50}
              className="stroke-background"
            ></LoadingSpinner>
          </div>
        )}

        {!isLoadingPiece && pieceModel && (
          <CreateOrEditConnectionDialogContent
            reconnectConnection={null}
            piece={pieceModel}
            externalIdComingFromSdk={connectionName}
            isGlobalConnection={false}
            setOpen={(open, connection) => {
              if (!open) {
                hideConnectionIframe(connection);
              }
              setIsDialogOpen(open);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
