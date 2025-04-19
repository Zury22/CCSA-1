import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import UnidadResponsableService from '../Services/UnidadResponsableService';

interface UnidadResponsable {
    idUnidadResponsable: number;
    jefeUnidad: string;
    numeroUnidadResponsable: number;
}
export default function ListaUnidadResponsable() {
    const [unidadResponsable, setUnidadResponsable] = useState<UnidadResponsable[]>([]);
    useEffect(() => {
       UnidadResponsableService.findAll().then(Response => {
            setUnidadResponsable(Response.data);
        }).catch(error => {
            console.log(error);
        })
    }, []);
    return (
        <div className="card">
            <DataTable value={unidadResponsable} tableStyle={{ minWidth: '50rem' }}>
                <Column field='idUnidadResponsable' header="ID Unidad Responsable"></Column>
                <Column field='jefeUnidad' header="Jefe Unida"></Column>
                <Column field='numeroUnidadResponsable' header="Numero Unidad Responsable"></Column>
            </DataTable>
        </div>
    );
}

