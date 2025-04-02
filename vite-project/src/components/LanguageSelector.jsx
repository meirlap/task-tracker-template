import { useTranslation } from 'react-i18next';
import { ButtonGroup, Button } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ButtonGroup
      variant="outlined"
      size="small"
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: 1,
        px: 1,
        '& button': {
          color: '#1976d2',
          borderColor: '#1976d2',
          fontWeight: 'bold',
          minWidth: '48px'
        },
        '& svg': {
          color: '#1976d2',
        }
      }}
    >
      <Button onClick={() => changeLang('he')}>עברית</Button>
      <Button onClick={() => changeLang('en')}>EN</Button>
    </ButtonGroup>
  );
};

export default LanguageSelector;
