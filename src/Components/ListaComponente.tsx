import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ComponenteService from '../Services/ComponenteService';
interface Componente {
    idActividad: number;
    descripcion: string;
    indicadorResultados: string;
    medioVerificacion: string;
}
export default function ListaComponente() {
    const [componente, setComponente] = useState<Componente[]>([]);
    useEffect(() => {
       ComponenteService.findAll().then(Response => {
            setComponente(Response.data);
        }).catch(error => {
            console.log(error);
        })
    }, []);
    return (
        <div className="card">
            <DataTable value={componente} tableStyle={{ minWidth: '50rem' }}>
                <Column field='idComponente' header="ID Componente"></Column>
                <Column field='componente' header="Componente"></Column>
                <Column field='nivel' header="Nivel"></Column>
                <Column field='nombreIndicador' header="Nombre Indicador"></Column>
            </DataTable>
        </div>
    );
}
