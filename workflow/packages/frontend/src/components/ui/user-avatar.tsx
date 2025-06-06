import { useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { LogOut, SunMoon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useEmbedding } from '@/components/embed-provider';
import { userHooks } from '@/hooks/user-hooks';
import { authenticationSession } from '@/lib/authentication-session';

import { Avatar, AvatarFallback } from './avatar';
import { AvatarLetter } from './avatar-letter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { TextWithIcon } from './text-with-icon';
export function UserAvatar() {
  const { embedState } = useEmbedding();
  const { data: user } = userHooks.useCurrentUser();
  const queryClient = useQueryClient();
  if (!user || embedState.isEmbedded) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>
            <AvatarLetter
              name={user.firstName + ' ' + user.lastName}
              email={user.email}
              disablePopup={true}
            ></AvatarLetter>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel>
          <div className="flex">
            <div className="flex-grow flex-shrink truncate">{user.email}</div>
          </div>
        </DropdownMenuLabel>
        <Link to="/settings/appearance">
          <DropdownMenuItem className="cursor-pointer">
            <TextWithIcon
              icon={<SunMoon size={18} />}
              text={t('Appearance')}
              className="cursor-pointer"
            />
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          onClick={() => {
            userHooks.invalidateCurrentUser(queryClient);
            authenticationSession.logOut();
          }}
          className="cursor-pointer"
        >
          <TextWithIcon
            icon={<LogOut size={18} className="text-destructive" />}
            text={<span className="text-destructive">{t('Logout')}</span>}
            className="cursor-pointer"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
