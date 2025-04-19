import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import UnidadResponsableService from '../Services/UnidadResponsableService';
<<<<<<< HEAD
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
=======

//define la interfaz articulo para tipar los objetos que representan a los articulos 

interface UnidadResponsable {
    idUnidadResponsable: number;
    jefeUnidad: string;
    nombreUnidadResponsable: string;
}


export default function ListaRol() {


    //define el componente funcional lista articulos
    const [unidadesResponsables, setUnidadesResponsables] = useState<UnidadResponsable[]>([]);
    //Hook useEfect para realizar efectos secundarios en el componenete
    useEffect(() => {
        //llama al servicio articulo para obtener todos los articulos
       UnidadResponsableService.findAll().then(Response => {
            //actuliza el estado de las mascotas con los datos obtenidos
            setUnidadesResponsables(Response.data);
        }).catch(error => {
            //imprime el error que se tuvo
            console.log(error);

        })

    }, []);//El array vacio como segundo argumento indica que este efecto
    //solo debe ejecutarse una vez al montar el componente

    //renderiza el componente Datatable para mostrar la lista de mascotas
    return (
        <div className="card">
            <DataTable value={unidadesResponsables} tableStyle={{ minWidth: '50rem' }}>
                
                <Column field='idUnidadResponsable' header="ID"></Column>
                <Column field='nombreUnidadResponsable' header="Nombre Unidad Responsable"></Column>
                <Column field='jefeUnidad' header="Jefe Unidad"></Column>
            </DataTable>

        </div>
    );
}
>>>>>>> 4cda38e (1)
