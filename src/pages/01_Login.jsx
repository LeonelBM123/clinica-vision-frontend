import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from '../services/auth';
import { Eye, LogIn } from 'lucide-react';

function Login() {
    const [formData, setFormData] = useState({
        correo: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrorMsg(""); // Limpiar error al escribir
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const userData = await authService.login(formData.correo, formData.password);
            
            if (!userData.puede_acceder) {
                navigate("/subscription-status");
                return;
            }

            // Todos los roles van al mismo dashboard
            navigate("/dashboard");
            
        } catch (error) {
            setErrorMsg(error.message || "Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Columna Izquierda: Branding */}
            <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-blue-600 text-white flex-col justify-center p-8 md:p-12">
                <Link to="/" className="flex items-center space-x-3 mb-8">
                    <Eye className="w-10 h-10" />
                    <span className="text-3xl font-bold">Visionex</span>
                </Link>
                <h1 className="text-4xl font-bold tracking-tight">Bienvenido de nuevo</h1>
                <p className="mt-4 text-blue-100 text-lg">
                    Gestiona tu clínica oftalmológica de manera eficiente y centralizada.
                </p>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="md:w-1/2 lg:w-3/5 flex items-center justify-center p-6 md:p-12">
                <div className="max-w-md w-full">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
                        <p className="text-gray-600 mt-2">Ingresa tus credenciales para acceder al sistema.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 text-gray-950">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="tu@email.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        {errorMsg && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm">{errorMsg}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center shadow-sm hover:shadow-md"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Iniciar Sesión
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 mt-2">
                            ¿Quieres dar de alta tu clínica?{" "}
                            <Link to="/register-clinic" className="font-medium text-green-600 hover:text-green-500">
                                Registra tu clínica
                            </Link>
                        </p>
                    </div>
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="inline-block text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;