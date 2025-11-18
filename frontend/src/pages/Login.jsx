import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { authService } from '../api';
import { useAuthStore } from '../store';
import { FiMail, FiLock } from 'react-icons/fi';
import '../assets/styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error(t('errors.fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      useAuthStore.setState({ user, token });
      
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || t('errors.serverError');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login login--dark">
      <div className="login__container login__container--dark">
        <h2 className="login__title login__title--dark">
          {t('auth.loginTitle')}
        </h2>

        <form onSubmit={handleSubmit} className="login__form">
          <div className="login__field">
            <label className="login__label login__label--dark">
              {t('common.email')}
            </label>
            <div className="login__input-wrapper login__input-wrapper--dark">
              <FiMail className="login__icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('common.email')}
                className="login__input login__input--dark"
              />
            </div>
          </div>

          <div className="login__field">
            <label className="login__label login__label--dark">
              {t('common.password')}
            </label>
            <div className="login__input-wrapper login__input-wrapper--dark">
              <FiLock className="login__icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('common.password')}
                className="login__input login__input--dark"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login__submit"
          >
            {loading ? t('common.loading') : t('common.login')}
          </button>
        </form>

        <p className="login__link login__link--dark">
          {t('auth.noAccount')}
          <span
            onClick={() => navigate('/register')}
            className="login__link-text login__link-text--dark"
          >
            {t('common.register')}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
