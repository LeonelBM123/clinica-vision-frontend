import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from '../services/apiClient';

function ResetPassword() {
  const [correo, setCorreo] = useState("");
  const [reset_token, setReset_token] = useState("");
  const [new_password, setNew_password] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Limpiar mensajes
    setSuccessMsg("");
    if (new_password !== confirm_password) {
      setErrorMsg("Las contraseñas deben coincidir");
      return;
    }
    try {
      const data = await apiClient.resetPassword(correo, reset_token, new_password);
      if (data.message) {
        setSuccessMsg("Contraseña actualizada correctamente 🎉");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setErrorMsg(data.error || "Error al restablecer la contraseña 😔");
      }
    } catch (error) {
      console.error("Error en resetear la contraseña", error);
      setErrorMsg("Error en la conexión con el servidor 🌐");
    }
  };

  const handleObtenerToken = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Limpiar mensajes
    setSuccessMsg("");
    try {
      const data = await apiClient.getToken2Reset(correo);
      if (data.message) {
        setSuccessMsg("Token enviado al correo 📧");
      } else {
        setErrorMsg(data.error || "Error al solicitar token 😢");
      }
    } catch (error) {
      console.error("Error al obtener token", error);
      setErrorMsg("Error en la conexión con el servidor 🌐");
    }
  };

  return (
    <div className="reset-container">
      {/* Alertas minimalistas */}
      {successMsg && <div className="toast success">{successMsg}</div>}
      {errorMsg && <div className="toast error">{errorMsg}</div>}

      <form onSubmit={handleReset} className="reset-form">
        <h2>Recupera tu contraseña</h2>
        <h3>Ingresa tu correo electronico y haz click en obtener token</h3>

        <input 
          type="email" 
          placeholder="Correo Electrónico asociado a su cuenta" 
          value={correo} 
          onChange={e => setCorreo(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Token de recuperación" 
          value={reset_token} 
          onChange={e => setReset_token(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Nueva contraseña" 
          value={new_password} 
          onChange={e => setNew_password(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Confirmar contraseña" 
          value={confirm_password} 
          onChange={e => setConfirm_password(e.target.value)} 
          required 
        />

        <div className="buttons">
          <button type="submit">Restablecer</button> 
          <button type="button" onClick={handleObtenerToken}>Obtener Token</button> 
        </div>
      </form>

      <style>{`
        * {
          box-sizing: border-box;
          font-family: 'Inter', 'Segoe UI', sans-serif; 
        }
        
        /* --- Layout: reset-container --- */
        .reset-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #37528bff 0%, #2b2d30ff 100%);
          padding: 20px;
        }

        
        .reset-form {
          background: #ffffff; 
          padding: 30px;
          border-radius: 16px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-width: 400px; 
          width: 100%;
          transition: all 0.3s ease;
        }

        .reset-form h2 {
          text-align: center;
          color: #333;
          margin-bottom: 5px;
          font-weight: 700;
          font-size: 1.5rem;
        }
        
        .reset-form h3 {
          text-align: center;
          color: #827e7eff;
          margin-bottom: 5px;
          font-weight: 700;
          font-size: 0.8rem;
        }

        
        .reset-form input {
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #ccc; 
          font-size: 1rem;
          color: #333;
          width: 100%; 
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .reset-form input:focus {
          border-color: #6c63ff; 
          outline: none;
          box-shadow: 0 0 0 3px rgba(108,99,255,0.2);
        }
        

        .reset-form input[type="text"] {
            
        }

        
        .buttons {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        
        .buttons button {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
          font-size: 1rem;
        }

        .buttons button[type="submit"] {
          background-color: #6c63ff; /* Primario */
          color: #fff;
        }

        .buttons button[type="submit"]:hover {
          background-color: #574cff;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(108,99,255,0.3);
        }

        .buttons button[type="button"] {
          background-color: #f0f0f0; /* Secundario/Claro */
          color: #333;
        }

        .buttons button[type="button"]:hover {
          background-color: #e0e0e0;
          transform: translateY(-1px);
        }

        
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 10px; 
          color: #fff;
          font-weight: 500;
          font-size: 0.95rem;
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          z-index: 1000;
          display: flex;
          align-items: center;
          opacity: 0;
          animation: fadein 0.4s forwards, fadeout 0.4s 2.8s forwards; /*duración a 3.2s*/
        }

        .toast.success {
          background-color: #4CAF50; 
        }

        .toast.error {
          background-color: #F44336; 
        }

        @keyframes fadein {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeout {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-30px); }
        }

        /*responsivo*/
        @media (max-width: 600px) {
          .reset-form {
            padding: 25px 20px;
            max-width: 90%;
          }
          .reset-form h2 {
            font-size: 1.3rem;
          }
          .buttons {
            flex-direction: column;
            gap: 8px;
          }
          .buttons button {
            width: 100%;
          }
          .toast {
            top: 15px;
            right: 15px;
            left: 15px;
            text-align: center;
            justify-content: center;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ResetPassword;