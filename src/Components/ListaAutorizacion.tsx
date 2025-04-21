import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import AutorizacionService from '../Services/AutorizacionService';

//define la interfaz articulo para tipar los objetos que representan a los articulos 

interface Autorizacion {
    id_autorizacion: number;
    asignado_por: string;
    asignado_por_cargo: string;
    autorizado_por: string;
    autorizado_por_cargo: string;
    ejecucion_por: string;
    ejecucion_por_cargo: string;
    elaborado_por: string;
    elaborado_por_cargo: string;
    recibido_por: string;
    recibido_por_cargo: string;
    ruta_firma_asignado_por: string;
    ruta_firma_autorizado_por: string;
    ruta_firma_ejecucion_por: string;
    ruta_firma_elaborado_por: string;
    ruta_firma_recibido_por: string;
    ruta_firma_vo_bo_por: string;
    vo_bo_por: string;
    vo_bo_por_cargo: string;
}


export default function ListaAutorizacion() {


    //define el componente funcional lista articulos
    const [autorizaciones, setAutorizaciones] = useState<Autorizacion[]>([]);
    //Hook useEfect para realizar efectos secundarios en el componenete
    useEffect(() => {
        //llama al servicio articulo para obtener todos los articulos
       AutorizacionService.findAll().then(Response => {
            //actuliza el estado de las mascotas con los datos obtenidos
            setAutorizaciones(Response.data);
        }).catch(error => {
            //imprime el error que se tuvo
            console.log(error);

        })

    }, []);//El array vacio como segundo argumento indica que este efecto
    //solo debe ejecutarse una vez al montar el componente

    //renderiza el componente Datatable para mostrar la lista de mascotas
    return (
        <div className="card">
            <DataTable value={autorizaciones} tableStyle={{ minWidth: '50rem' }}>
                <Column field='id_autorizacion' header="ID Autorizacion"></Column>
                <Column field='asignado_por' header="Asignado Por"></Column>
                <Column field='asignado_por_cargo' header="Asignado Por Cargo"></Column>
                <Column field='autorizado_por' header="Autorizado Por"></Column>
                <Column field='autorizado_por_cargo' header="Autorizado Por Cargo"></Column>
                <Column field='ejecucion_por' header="Ejecutado Por"></Column>
                <Column field='ejecucion_por_cargo' header="Ejecutado Por Cargo"></Column>
                <Column field='elaborado_por' header="Elaborado Por"></Column>
                <Column field='elaborado_por_cargo' header="Elaborado Por Cargo"></Column>
                <Column field='recibido_por' header="Recibido Por"></Column>
                <Column field='recibido_por_cargo' header="Recibido Por Cargo"></Column>
                <Column field='ruta_firma_asignado_por' header="Ruta Firma Asignado Por"></Column>
                <Column field='ruta_firma_autorizado_por' header="Ruta Firma Autorizado Por"></Column>
                <Column field='ruta_firma_ejecucion_por' header="Ruta Firma Ejecutado Por"></Column>
                <Column field='ruta_firma_elaborado_por' header="Ruta Firma Elaborado Por"></Column>
                <Column field='ruta_firma_recibido_por' header="Ruta Firma Recibido Por"></Column>
                <Column field='ruta_firma_vo_bo_por' header="Ruta Firma Vo Bo Por"></Column>
                <Column field='vo_bo_por' header="Vo Bo Por"></Column>
                <Column field='vo_bo_por_cargo' header="Vo Bo Por Cargo"></Column>
            </DataTable>

        </div>
    );
}