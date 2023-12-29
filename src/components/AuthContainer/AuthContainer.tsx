import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { useWalletData } from 'src/states/wallet';
import NotAuthWarning from './NotAuthWarning';

export default function LoginRequired({ children, NotAuthComponent }: { children: ReactNode; NotAuthComponent?: ReactNode }) {
    const { logged } = useWalletData();
    return (
        <>
            {logged && children}
            {!logged && (NotAuthComponent || <NotAuthWarning />)}
        </>
    );
}
