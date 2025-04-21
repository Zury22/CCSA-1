import React, {useState, useEffect, useRef} from 'react';
import {classNames} from 'primereact/utils';
import {DataTable} from 'primereact/datatable'; 
import {Column} from 'primereact/column' ;
import {Toast} from 'primereact/toast' ; 
import {Button} from 'primereact/button';
import {Toolbar} from 'primereact/toolbar' ;
import {IconField} from 'primereact/iconfield' ;
import {InputIcon} from 'primereact/inputicon'; 
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext' ;
import AutorizacionService from '../Services/AutorizacionService';

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

interface Planificacion {
    idPlanificacion: number;
    jefeUnidad: string;
    numeroActividades: string;
    objetivoArea: string;
}


export default function CRUDAutorizacion() {
    const emptyAurizacion: Autorizacion = {
        
        id_autorizacion: 0,
        asignado_por: '',
        asignado_por_cargo: '',
        autorizado_por: '',
        autorizado_por_cargo: '',
        ejecucion_por: '',
        ejecucion_por_cargo: '',
        elaborado_por: '',
        elaborado_por_cargo: '',
        recibido_por: '',
        recibido_por_cargo: '',
        ruta_firma_asignado_por: '',
        ruta_firma_autorizado_por: '',
        ruta_firma_ejecucion_por: '',
        ruta_firma_elaborado_por: '',
        ruta_firma_recibido_por: '',
        ruta_firma_vo_bo_por: '',
        vo_bo_por: '',
        vo_bo_por_cargo: ''
    };
//lista de roles
    const [listaPlanificaciones, setListaPlanificaciones] = useState<Planificacion[]>([]);
    const [autorizaciones, setAutorizaciones] = useState<Autorizacion[]>([]);
    const [autorizacion, setAutorizacion] = useState<Autorizacion>(emptyAurizacion);
    const [autorizacionDialog, setAutorizacionDialog] = useState<boolean>(false);
    const [deleteAutorizacionDialog, setDeleteAutorizacionDialog] = useState<boolean>(false);
//agregado para el listado de usuarios
    const [autorizacionListado, setAutorizacionListado] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Autorizacion[]>>(null);

    useEffect(() => {
        AutorizacionService.findAll().then((response) => setAutorizaciones(response.data));
    }, []);

    const openNew = () => {
        setAutorizacion(emptyAurizacion);
        setSubmitted(false);
        setAutorizacionDialog(true);
    };
//ocultar listado de roles
    const hideListadoDialog = () => {
        setSubmitted(false);
        setAutorizacionListado(false);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAutorizacionDialog(false);
    };


    const hideDeleteObjetoDialog = () => {
        setDeleteAutorizacionDialog(false);
    };

    const saveAutorizacion = async() => {
        setSubmitted(true);
        if (autorizacion.asignado_por.trim()) {
            let _autorizaciones = [...autorizaciones];
            let _autorizacion = { ...autorizacion };

            if (autorizacion.id_autorizacion) {
                AutorizacionService.update(autorizacion.id_autorizacion, autorizacion);
                const index = findIndexById(autorizacion.id_autorizacion);
                _autorizaciones[index] = _autorizacion;
                toast.current?.show({ 
                    severity: 'success', 
                    summary: 'Exito', 
                    detail: 'Autorizacion actualizado', 
                    life: 3000 });
            } else {
                _autorizacion.id_autorizacion = await getIdAutorizacion(_autorizacion);
                _autorizaciones.push(_autorizacion);
                toast.current?.show({ 
                    severity: 'success', 
                    summary: 'exito', 
                    detail: 'Autorizacion creado', 
                    life: 3000 });
            }

            setAutorizaciones(_autorizaciones);
            setAutorizacionDialog(false);
            setAutorizacion(emptyAurizacion);
        }
    };

    const getIdAutorizacion = async(autorizacion: Autorizacion) => {
        let idAutorizacion = 0;
        const newAutorizacion = {
            
            id_autorizacion: 0,
            asignado_por: autorizacion.asignado_por,
            asignado_por_cargo: autorizacion.asignado_por_cargo,
            autorizado_por: autorizacion.autorizado_por,
            autorizado_por_cargo: autorizacion.autorizado_por_cargo,
            ejecucion_por: autorizacion.ejecucion_por,
            ejecucion_por_cargo: autorizacion.ejecucion_por_cargo,
            elaborado_por: autorizacion.elaborado_por,
            elaborado_por_cargo: autorizacion.elaborado_por_cargo,
            recibido_por: autorizacion.recibido_por,
            recibido_por_cargo: autorizacion.recibido_por_cargo,
            ruta_firma_asignado_por: autorizacion.ruta_firma_asignado_por,
            ruta_firma_autorizado_por: autorizacion.ruta_firma_autorizado_por,
            ruta_firma_ejecucion_por: autorizacion.ruta_firma_ejecucion_por,
            ruta_firma_elaborado_por: autorizacion.ruta_firma_elaborado_por,
            ruta_firma_recibido_por: autorizacion.ruta_firma_recibido_por,
            ruta_firma_vo_bo_por: autorizacion.ruta_firma_vo_bo_por,
            vo_bo_por: autorizacion.vo_bo_por,
            vo_bo_por_cargo: autorizacion.vo_bo_por_cargo

        };
        await AutorizacionService.create(newAutorizacion).then((response) => {
            idAutorizacion = response.data.idUsuario; 
        }).catch((error) => {
            console.log(error);
        });
        return idAutorizacion;   
    }; 
    
    //listar roles
    const listarRoles = (autorizacion: Autorizacion) => {
        setAutorizacion({...autorizacion});
        AutorizacionService.findById(autorizacion.id_autorizacion).then((response) => {
            setListaPlanificaciones(response.data.roles); // Asignar la lista de roles al estado
        }).catch(error => {
            console.log(error);
        })
        setAutorizacionListado(true);
    };

    const editAutorizacion = (autorizacion: Autorizacion) => {
        setAutorizacion({ ...autorizacion });
        setAutorizacionDialog(true);
    };

    const confirmDeleteObjeto = (autorizacion: Autorizacion) => {
        setAutorizacion(autorizacion);
        setDeleteAutorizacionDialog(true);
    };

    const deleteAutorizacion = () => {
        const _autorizaciones = autorizaciones.filter((val) => val.id_autorizacion !== 
        autorizacion.id_autorizacion);
        AutorizacionService.delete(autorizacion.id_autorizacion);
        setAutorizaciones(_autorizaciones);
        setDeleteAutorizacionDialog(false);
        setAutorizacion(emptyAurizacion);
        toast.current?.show({ severity: 'success', summary: 'Exito', 
            detail: 'Usuario eliminado', life: 3000 });
    };
    const findIndexById = (idAutorizacion: number) => {
        let index = -1;
        for (let i = 0; i < autorizaciones.length; i++) {
            if (autorizaciones[i].id_autorizacion === idAutorizacion) {
                index = i;
                break;
            }
        }
        return index;
    };
    const exportCSV = () => {
        dt.current?.exportCSV();
    };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, numCampo: number) => {
        const val = (e.target && e.target.value) || '';
        const _autorizacion = { ...autorizacion };
        switch (numCampo) {
            case 1:
                _autorizacion.asignado_por = val;
                break;
            case 2:
                _autorizacion.asignado_por_cargo = val;
                break;
            case 3:
                _autorizacion.autorizado_por = val;
                break;
            case 4:
                _autorizacion.autorizado_por_cargo = val;
                break;
            case 5:
                _autorizacion.ejecucion_por = val;
                break;
            case 6:
                _autorizacion.ejecucion_por_cargo = val;
                break;
            case 7:
                _autorizacion.elaborado_por = val;
                break;
            case 8:
                _autorizacion.elaborado_por_cargo = val;
                break;
            case 9:
                _autorizacion.recibido_por = val;
                break; 
            case 10:
                _autorizacion.recibido_por_cargo = val;
                break; 
            case 11:
                _autorizacion.ruta_firma_asignado_por = val;
                break; 
            case 12:
                _autorizacion.ruta_firma_autorizado_por = val;
                break; 
            case 13:
                _autorizacion.ruta_firma_ejecucion_por = val;
                break; 
            case 14:
                _autorizacion.ruta_firma_elaborado_por = val;
                break; 
            case 15:
                _autorizacion.ruta_firma_recibido_por = val;
                break; 
            case 16:
                _autorizacion.ruta_firma_vo_bo_por = val;
                break; 
            case 17:
                _autorizacion.vo_bo_por = val;
                break; 
            case 18:
                _autorizacion.vo_bo_por_cargo = val;
                break;
        }

        setAutorizacion(_autorizacion);
    };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nuevo" icon="pi pi-plus" severity="success" 
                onClick={openNew} />
            </div>
        );
    };
    const rightToolbarTemplate = () => {
        return <Button label="Exportar" icon="pi pi-upload" className=
        "p-button-help" onClick={exportCSV} />;
    };
    const actionBodyTemplate = (rowData: Autorizacion) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-prime" style={{color: 'green'}}rounded outlined className='mr-2' onClick={()=> listarRoles(rowData)}/>
                <Button icon="pi pi-pencil" rounded outlined className='mr-2' onClick={() => editAutorizacion(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteObjeto(rowData)} />
            </React.Fragment>
        );
    };
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestion de roles</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                 <InputText type="search" placeholder="Search..." onInput={(e) => {const target = e.target as HTMLInputElement; setGlobalFilter(target.value);}}  />
            </IconField>
        </div>
    );
    const objetoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveAutorizacion} />
        </React.Fragment>
    );
    const deleteObjetoDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteObjetoDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteAutorizacion} />
        </React.Fragment>
    );
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={autorizaciones} dataKey="id_autorizacion"
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} usuarios" 
                    globalFilter={globalFilter} header={header}
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    
                    <Column field="id_autorizacion" header="ID Autorizacion" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="asignado_por" header="Asignado por" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="asignado_por_cargo" header="Cargo Asignado" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="autorizado_por" header="Autorizado por" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="autorizado_por_cargo" header="Cargo Autorizado" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="ejecucion_por" header="Ejecutado por" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="ejecucion_por_cargo" header="Cargo Ejecutado" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="elaborado_por" header="Elaborado por" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="elaborado_por_cargo" header="Cargo Elaborado" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="recibido_por" header="Recibido por" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="recibido_por_cargo" header="Cargo Recibido" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="ruta_firma_asignado_por" header="Ruta firma Asignado" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="ruta_firma_autorizado_por" header="Ruta firma Autorizado" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="ruta_firma_ejecucion_por" header="Ruta firma Ejecutado" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="ruta_firma_elaborado_por" header="Ruta firma Elaborado" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="ruta_firma_recibido_por" header="Ruta firma Recibido" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="ruta_firma_vo_bo_por" header="Ruta firma Vo Bo" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="vo_bo_por" header="Vo Bo por" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="vo_bo_por_cargo" header="Cargo Vo Bo" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={autorizacionDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Detalles de la autorizacion" modal className="p-fluid" 
            footer={objetoDialogFooter} onHide={hideDialog}>
                
                <div className="field">
                    <label htmlFor="asignado_por">Asignado por</label>
                    <InputText id="asignado_por" value={autorizacion.asignado_por} onChange={(e) => onInputChange(e, 1)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.asignado_por })} />
                    {submitted && !autorizacion.asignado_por && <small className="p-error">El nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="asignado_por_cargo">Cargo Asignado</label>
                    <InputText id="asignado_por_cargo" value={autorizacion.asignado_por_cargo} onChange={(e) => onInputChange(e, 2)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.asignado_por_cargo })} />
                    {submitted && !autorizacion.asignado_por_cargo && <small className="p-error">El cargo es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="autorizado_por">Autorizado por</label>
                    <InputText id="autorizado_por" value={autorizacion.autorizado_por} onChange={(e) => onInputChange(e, 3)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.autorizado_por })} />
                    {submitted && !autorizacion.autorizado_por && <small className="p-error">El nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="autorizado_por_cargo">Cargo Autorizado</label>
                    <InputText id="autorizado_por_cargo" value={autorizacion.autorizado_por_cargo} onChange={(e) => onInputChange(e, 4)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.autorizado_por_cargo })} />
                    {submitted && !autorizacion.autorizado_por_cargo && <small className="p-error">El cargo es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="ejecucion_por">Ejecutado por</label>
                    <InputText id="ejecucion_por" value={autorizacion.ejecucion_por} onChange={(e) => onInputChange(e, 5)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.ejecucion_por })} />
                    {submitted && !autorizacion.ejecucion_por && <small className="p-error">El nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="ejecucion_por_cargo">Cargo Ejecutado</label>
                    <InputText id="ejecucion_por_cargo" value={autorizacion.ejecucion_por_cargo} onChange={(e) => onInputChange(e, 6)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.ejecucion_por_cargo })} />
                    {submitted && !autorizacion.ejecucion_por_cargo && <small className="p-error">El cargo es requerido.</small>}
                </div>
                <div className="field"> 
                    <label htmlFor="elaborado_por">Elaborado por</label>
                    <InputText id="elaborado_por" value={autorizacion.elaborado_por} onChange={(e) => onInputChange(e, 7)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.elaborado_por })} />
                    {submitted && !autorizacion.elaborado_por && <small className="p-error">El nombre es requerido.</small>}
                </div>
                <div className="field"> 
                    <label htmlFor="elaborado_por_cargo">Cargo Elaborado</label>
                    <InputText id="elaborado_por_cargo" value={autorizacion.elaborado_por_cargo} onChange={(e) => onInputChange(e, 8)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.elaborado_por_cargo })} />
                    {submitted && !autorizacion.elaborado_por_cargo && <small className="p-error">El cargo es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="recibido_por">Recibido por</label>
                    <InputText id="recibido_por" value={autorizacion.recibido_por} onChange={(e) => onInputChange(e, 9)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.recibido_por })} />
                    {submitted && !autorizacion.recibido_por && <small className="p-error">El nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="recibido_por_cargo">Cargo Recibido</label>
                    <InputText id="recibido_por_cargo" value={autorizacion.recibido_por_cargo} onChange={(e) => onInputChange(e, 10)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.recibido_por_cargo })} />
                    {submitted && !autorizacion.recibido_por_cargo && <small className="p-error">El cargo es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="ruta_firma_asignado_por">Ruta firma Asignado</label>
                    <InputText id="ruta_firma_asignado_por" value={autorizacion.ruta_firma_asignado_por} onChange={(e) => onInputChange(e, 11)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.ruta_firma_asignado_por })} />
                    {submitted && !autorizacion.ruta_firma_asignado_por && <small className="p-error">La ruta es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="ruta_firma_autorizado_por">Ruta firma Autorizado</label>
                    <InputText id="ruta_firma_autorizado_por" value={autorizacion.ruta_firma_autorizado_por} onChange={(e) => onInputChange(e, 12)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.ruta_firma_autorizado_por })} />
                    {submitted && !autorizacion.ruta_firma_autorizado_por && <small className="p-error">La ruta es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="ruta_firma_ejecucion_por">Ruta firma Ejecutado</label>
                    <InputText id="ruta_firma_ejecucion_por" value={autorizacion.ruta_firma_ejecucion_por} onChange={(e) => onInputChange(e, 13)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.ruta_firma_ejecucion_por })} />
                    {submitted && !autorizacion.ruta_firma_ejecucion_por && <small className="p-error">La ruta es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="ruta_firma_elaborado_por">Ruta firma Elaborado</label>
                    <InputText id="ruta_firma_elaborado_por" value={autorizacion.ruta_firma_elaborado_por} onChange={(e) => onInputChange(e, 14)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.ruta_firma_elaborado_por })} />
                    {submitted && !autorizacion.ruta_firma_elaborado_por && <small className="p-error">La ruta es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="ruta_firma_recibido_por">Ruta firma Recibido</label>
                    <InputText id="ruta_firma_recibido_por" value={autorizacion.ruta_firma_recibido_por} onChange={(e) => onInputChange(e, 15)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.ruta_firma_recibido_por })} />
                    {submitted && !autorizacion.ruta_firma_recibido_por && <small className="p-error">La ruta es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="ruta_firma_vo_bo_por">Ruta firma Vo Bo</label>
                    <InputText id="ruta_firma_vo_bo_por" value={autorizacion.ruta_firma_vo_bo_por} onChange={(e) => onInputChange(e, 16)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.ruta_firma_vo_bo_por })} />
                    {submitted && !autorizacion.ruta_firma_vo_bo_por && <small className="p-error">La ruta es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="vo_bo_por">Vo Bo por</label>
                    <InputText id="vo_bo_por" value={autorizacion.vo_bo_por} onChange={(e) => onInputChange(e, 17)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.vo_bo_por })} />
                    {submitted && !autorizacion.vo_bo_por && <small className="p-error">El nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="vo_bo_por_cargo">Cargo Vo Bo</label>
                    <InputText id="vo_bo_por_cargo" value={autorizacion.vo_bo_por_cargo} onChange={(e) => onInputChange(e, 18)} required autoFocus className={classNames({ 'p-invalid': submitted && !autorizacion.vo_bo_por_cargo })} />
                    {submitted && !autorizacion.vo_bo_por_cargo && <small className="p-error">El cargo es requerido.</small>}
                </div>
            </Dialog>
            <Dialog visible={deleteAutorizacionDialog} style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" 
            modal footer={deleteObjetoDialogFooter} onHide={hideDeleteObjetoDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {autorizacion && (
                        <span>
                            ¿Estas seguro de eliminar a <b>{autorizacion.asignado_por}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
            <Dialog visible={autorizacionListado} style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Rol del usuario" modal className="p-fluid" 
            onHide={hideListadoDialog}>
                <div className="field">
                    <ul>{listaPlanificaciones.map(item => <li>{item.idPlanificacion}</li>)}</ul>
                </div>
            </Dialog>
        </div>
    );
}