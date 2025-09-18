// src/pages/Gestionar_Bitacora/index.jsx
import React, { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api/bitacora/";

export default function GestionarBitacora() {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    async function fetchBitacora() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("https://clinica-backend-b8m9.onrender.com/api/bitacoras/", {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Token ${token}` } : {})
                }
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Error ${res.status}: ${text}`);
            }
            const data = await res.json();
            setRegistros(data);
        } catch (err) {
            console.error(err);
            setError(String(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBitacora();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ padding: 20, color: "black" }}>
            <h1>Bitácora del Sistema</h1>

            {loading && <div>Cargando...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: 12,
                    color: "black"
                }}
            >
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: 6 }}>ID</th>
                        <th style={{ border: "1px solid #ddd", padding: 6 }}>Fecha/Hora</th>
                        <th style={{ border: "1px solid #ddd", padding: 6 }}>Usuario</th>
                        <th style={{ border: "1px solid #ddd", padding: 6 }}>Acción</th>
                        <th style={{ border: "1px solid #ddd", padding: 6 }}>Objeto</th>
                        <th style={{ border: "1px solid #ddd", padding: 6 }}>IP</th>
                        <th style={{ border: "1px solid #ddd", padding: 6 }}>Extra</th>
                    </tr>
                </thead>
                <tbody>
                    {registros.length === 0 && !loading ? (
                        <tr>
                            <td colSpan={7} style={{ textAlign: "center", padding: 10 }}>
                                No hay registros
                            </td>
                        </tr>
                    ) : (
                        registros.map((r) => (
                            <tr key={r.id}>
                                <td style={{ border: "1px solid #ddd", padding: 6 }}>{r.id}</td>
                                <td style={{ border: "1px solid #ddd", padding: 6 }}>
                                    {new Date(r.timestamp).toLocaleString()}
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: 6 }}>
                                    {r.usuario?.nombre || "Anónimo"}
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: 6 }}>{r.accion}</td>
                                <td style={{ border: "1px solid #ddd", padding: 6 }}>{r.objeto}</td>
                                <td style={{ border: "1px solid #ddd", padding: 6 }}>{r.ip}</td>
                                <td style={{ border: "1px solid #ddd", padding: 6 }}>
                                    {JSON.stringify(r.extra || {})}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}