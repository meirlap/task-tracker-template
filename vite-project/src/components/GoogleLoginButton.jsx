import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const { t } = useTranslation();

  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const user = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      };
      onLoginSuccess(user);
    } catch (error) {
      console.error('❌ Failed to decode token:', error);
    }
  };

  const handleError = () => {
    console.error('❌ Login Failed');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        prompt="select_account"
        auto_select={false}
        context="signin"
      />
    </div>
  );
};

export default GoogleLoginButton;
