import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import ActividadService from '../Services/ActividadService';

interface Actividad {
    idActividad: number;
    descripcion: string;
    indicadorResultados: string;
    medioVerificacion: string;
}

export default function CRUDActividad() {
    const emptyActividad: Actividad = {
        idActividad: 0,
        descripcion: '',
        indicadorResultados: '',
        medioVerificacion: ''
    };

    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [actividad, setActividad] = useState<Actividad>(emptyActividad);
    const [actividadDialog, setActividadDialog] = useState<boolean>(false);
    const [deleteActividadDialog, setDeleteActividadDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Actividad[]>>(null);

    useEffect(() => {
        ActividadService.findAll().then((response) => setActividades(response.data));
    }, []);

    const openNew = () => {
        setActividad(emptyActividad);
        setSubmitted(false);
        setActividadDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setActividadDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteActividadDialog(false);
    };

    const saveActividad = async () => {
        setSubmitted(true);

        if (actividad.descripcion.trim()) {
            let _actividades = [...actividades];
            let _actividad = { ...actividad };

            if (actividad.idActividad) {
                ActividadService.update(actividad.idActividad, actividad);
                const index = findIndexById(actividad.idActividad);
                _actividades[index] = _actividad;
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Actividad actualizada', life: 3000 });
            } else {
                _actividad.idActividad = await getIdActividad(_actividad);
                _actividades.push(_actividad);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Actividad creada', life: 3000 });
            }

            setActividades(_actividades);
            setActividadDialog(false);
            setActividad(emptyActividad);
        }
    };

    const getIdActividad = async (actividad: Actividad) => {
        let id = 0;
        const nuevaActividad = {
            descripcion: actividad.descripcion,
            indicadorResultados: actividad.indicadorResultados,
            medioVerificacion: actividad.medioVerificacion
        };
        await ActividadService.create(nuevaActividad).then((response) => {
            id = response.data.idActividad;
        }).catch((error) => {
            console.log(error);
        });
        return id;
    };

    const editActividad = (actividad: Actividad) => {
        setActividad({ ...actividad });
        setActividadDialog(true);
    };

    const confirmDeleteActividad = (actividad: Actividad) => {
        setActividad(actividad);
        setDeleteActividadDialog(true);
    };

    const deleteActividad = () => {
        const _actividades = actividades.filter((val) => val.idActividad !== actividad.idActividad);
        ActividadService.delete(actividad.idActividad);
        setActividades(_actividades);
        setDeleteActividadDialog(false);
        setActividad(emptyActividad);
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Actividad eliminada', life: 3000 });
    };

    const findIndexById = (id: number) => {
        return actividades.findIndex((actividad) => actividad.idActividad === id);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, campo: keyof Actividad) => {
        const val = (e.target && e.target.value) || '';
        setActividad({ ...actividad, [campo]: val });
    };

    const leftToolbarTemplate = () => (
        <div className="flex flex-wrap gap-2">
            <Button label="Nueva" icon="pi pi-plus" severity="success" onClick={openNew} />
        </div>
    );

    const rightToolbarTemplate = () => (
        <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
    );

    const actionBodyTemplate = (rowData: Actividad) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editActividad(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteActividad(rowData)} />
        </>
    );

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestión de Actividades</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" placeholder="Buscar..." onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} />
            </IconField>
        </div>
    );

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveActividad} />
        </>
    );

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteActividad} />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable ref={dt} value={actividades} dataKey="idActividad"
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter} header={header}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} actividades"
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="idActividad" header="ID" sortable style={{ minWidth: '5rem' }}></Column>
                    <Column field="descripcion" header="Descripción" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="indicadorResultados" header="Indicador" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="medioVerificacion" header="Medio de Verificación" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={actividadDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Detalles de Actividad" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="descripcion" className="font-bold">Descripción</label>
                    <InputText id="descripcion" value={actividad.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus
                        className={classNames({ 'p-invalid': submitted && !actividad.descripcion })} />
                    {submitted && !actividad.descripcion && <small className="p-error">La descripción es requerida</small>}
                </div>
                <div className="field">
                    <label htmlFor="indicadorResultados" className="font-bold">Indicador</label>
                    <InputText id="indicadorResultados" value={actividad.indicadorResultados} onChange={(e) => onInputChange(e, 'indicadorResultados')} required />
                </div>
                <div className="field">
                    <label htmlFor="medioVerificacion" className="font-bold">Medio de Verificación</label>
                    <InputText id="medioVerificacion" value={actividad.medioVerificacion} onChange={(e) => onInputChange(e, 'medioVerificacion')} required />
                </div>
            </Dialog>

            <Dialog visible={deleteActividadDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirmar" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {actividad && <span>¿Estás seguro de eliminar la actividad <b>{actividad.descripcion}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}

