import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ActividadService from '../Services/ActividadService';
interface Actividad {
    idActividad: number;
    descripcion: string;
    indicadorResultados: string;
    medioVerificacion: string;
}
export default function ListaActividad() {
    const [actividad, setActividad] = useState<Actividad[]>([]);
    useEffect(() => {
       ActividadService.findAll().then(Response => {
            setActividad(Response.data);
        }).catch(error => {
            console.log(error);
        })
    }, []);
    return (
        <div className="card">
            <DataTable value={actividad} tableStyle={{ minWidth: '50rem' }}>
                <Column field='idActividad' header="ID Actividad"></Column>
                <Column field='descripcion' header="Descripcion"></Column>
                <Column field='indicadorResultados' header="Indicador Resultados"></Column>
                <Column field='medioVerificacion' header="Medio Verificacion"></Column>
            </DataTable>
        </div>
    );
}
