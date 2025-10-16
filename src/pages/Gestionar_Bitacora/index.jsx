// src/pages/Gestionar_Bitacora/index.jsx
import React, { useEffect, useState } from "react";
import UniversalTable from "../../components/UniversalTable";
import { api } from "../../services/apiClient";

export default function GestionarBitacora() {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");
        api.get("/cuentas/bitacoras/")
            .then(data => setRegistros(Array.isArray(data) ? data : []))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { header: "ID", accessor: "id" },
        {
            header: "Fecha/Hora",
            accessor: "timestamp",
            render: item =>
                item.timestamp
                    ? new Date(item.timestamp).toLocaleString("es-BO", { timeZone: "America/La_Paz" })
                    : "—"
        },
        { header: "Usuario", accessor: "usuario" },
        { header: "Acción", accessor: "accion" },
        { header: "Objeto", accessor: "objeto" },
        { header: "IP", accessor: "ip" },
        {
            header: "Extra",
            accessor: "extra",
            render: item => item.extra ? JSON.stringify(item.extra) : "—"
        }
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Bitácora del Sistema</h1>
            {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                    {error}
                </div>
            )}
            <UniversalTable
                title="Registros de Bitácora"
                data={registros}
                columns={columns}
                loading={loading}
                emptyMessage="No hay registros en la bitácora"
                showAddButton={false}
                showEditButton={false}
                showDeleteButton={false}
            />
        </div>
    );
}