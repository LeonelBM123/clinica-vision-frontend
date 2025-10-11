import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from '../services/apiClient';

function RegisterUser() {
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        password: "",
        confirmPassword: "",
        sexo: "",
        fecha_nacimiento: "",
        telefono: "",
        direccion: "",
        grupo: ""
    });
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadGrupos();
    }, []);

    const loadGrupos = async () => {
        try {
            const response = await apiClient.getGrupos();
            setGrupos(response.results || response);
        } catch (error) {
            console.error("Error cargando grupos:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrorMsg("");
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("Las contraseñas no coinciden");
            return false;
        }
        if (formData.password.length < 6) {
            setErrorMsg("La contraseña debe tener al menos 6 caracteres");
            return false;
        }
        if (!formData.grupo) {
            setErrorMsg("Debes seleccionar la clínica a la que perteneces");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrorMsg("");

        try {
            const userData = {
                ...formData,
                rol: 3 // ID del rol por defecto (ajustar según tu sistema)
            };
            delete userData.confirmPassword;

            await apiClient.register(userData);
            setSuccessMsg("Usuario registrado exitosamente. Puedes iniciar sesión.");
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setErrorMsg(error.message || "Error al registrar usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Registro de Empleado</h2>
                        <p className="text-gray-600 mt-2">Únete al equipo de tu clínica</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Juan Pérez"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo Electrónico *
                                </label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="juan@clinica.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar Contraseña *
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sexo *
                                </label>
                                <select
                                    name="sexo"
                                    value={formData.sexo}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de Nacimiento *
                                </label>
                                <input
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={formData.fecha_nacimiento}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="12345678"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Clínica *
                                </label>
                                <select
                                    name="grupo"
                                    value={formData.grupo}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar clínica</option>
                                    {grupos.map(grupo => (
                                        <option key={grupo.id} value={grupo.id}>
                                            {grupo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dirección
                            </label>
                            <textarea
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Dirección completa"
                            />
                        </div>

                        {errorMsg && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm">{errorMsg}</p>
                            </div>
                        )}

                        {successMsg && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-600 text-sm">{successMsg}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                        >
                            {loading ? "Registrando..." : "Registrar Usuario"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm mb-4">
                            ¿Ya tienes cuenta?{" "}
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">
                                Iniciar sesión
                            </Link>
                        </p>
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

export default RegisterUser;