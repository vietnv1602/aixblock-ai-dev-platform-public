import { SNSClient } from '@aws-sdk/client-sns';
import { isNil } from 'workflow-shared';

export function createSNS(auth: {
  accessKeyId: string;
  secretAccessKey: string;
  region: string | undefined;
  endpoint: string | undefined;
}) {
  const sns = new SNSClient({
    credentials: {
      accessKeyId: auth.accessKeyId,
      secretAccessKey: auth.secretAccessKey,
    },
    region: auth.region,
    endpoint:
      auth.endpoint === '' || isNil(auth.endpoint) ? undefined : auth.endpoint,
  });
  return sns;
}
