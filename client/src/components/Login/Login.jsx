import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDataModal from '../modals/UserDataModal/UserDataModal';
import { loginUser } from '../../services/authService';
import '../../styles/Login/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const navigate = useNavigate();

  const showModal = (type, message) => {
    setModal({ isOpen: true, type, message });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showModal('error', 'Por favor ingrese usuario y contraseña');
      return;
    }

    setIsAuthenticating(true);
    showModal('loading', 'Validando credenciales...');

    try {
      const userData = await loginUser(username, password);

      // 👇 Muestra en consola la respuesta del backend
      console.log("✅ Respuesta del backend:", userData);

      showModal('success', 'Inicio de sesión exitoso. Redirigiendo...');
      setTimeout(() => {
        closeModal();
        navigate('/welcome'); // Redirigir a la vista principal
      }, 2000);
    } catch (error) {
      // 👇 Muestra en consola el error
      console.error("❌ Error en login:", error.message);
      showModal('error', error.message || 'Error al iniciar sesión');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleModalClose = () => {
    closeModal();
    if (modal.type === 'success') {
      navigate('/welcome');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-logo">
          <img src="/Logo-Los-Molinos.webp" alt="Logo de la aplicación" id="logo" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              className="form-control"
              disabled={isAuthenticating}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="form-control"
              disabled={isAuthenticating}
            />
          </div>

          <button type="submit" className="login-btn" disabled={isAuthenticating}>
            {isAuthenticating ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>

      <UserDataModal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={handleModalClose}
        showLoading={modal.type === 'loading'}
      />
    </div>
  );
};

export default Login;
