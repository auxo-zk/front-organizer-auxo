import { toast } from 'react-toastify';

export function isNumeric(num: any) {
    return !isNaN(num) && !isNaN(parseFloat(num));
}

export function copyTextToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
}
