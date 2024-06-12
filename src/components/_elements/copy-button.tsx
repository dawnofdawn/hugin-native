import Clipboard from '@react-native-clipboard/clipboard';

import { TextButton } from './text-button';

interface CopyButtonProps {
  data: string;
  text: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ data, text }) => {
  // const { t } = useTranslation();

  const handleCopy = () => {
    Clipboard.setString(data);
    // toastPopUp(`${t('copied')}`);
  };

  return <TextButton onPress={handleCopy}>{text}</TextButton>;
};
