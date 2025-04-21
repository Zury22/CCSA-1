<<<<<<< HEAD
=======
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
import PlanificacionService from '../Services/PlanificacionService';
>>>>>>> eaee85ff7709f199a151e67aef1f429b6b4c17ab

interface Planificacion {
    idPlanificacion: number;
    jefeUnidad: string;
    numeroActividades: string;
    objetivoArea: string;
}

export default function CRUDPlanificacion() {
    const emptyPlanificacion: Planificacion = {
        idPlanificacion: 0,
        jefeUnidad: '',
        numeroActividades: '',
        objetivoArea: ''
    };

    const [planificaciones, setPlanificaciones] = useState<Planificacion[]>([]);
    const [planificacion, setPlanificacion] = useState<Planificacion>(emptyPlanificacion);
    const [planificacionDialog, setPlanificacionDialog] = useState<boolean>(false);
    const [deletePlanificacionDialog, setDeletePlanificacionDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Planificacion[]>>(null);

    useEffect(() => {
        PlanificacionService.findAll().then((response) => setPlanificaciones(response.data));
    }, []);

    const openNew = () => {
        setPlanificacion(emptyPlanificacion);
        setSubmitted(false);
        setPlanificacionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPlanificacionDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeletePlanificacionDialog(false);
    };

    const savePlanificacion = async () => {
        setSubmitted(true);

        if (planificacion.objetivoArea.trim()) {
            let _planificaciones = [...planificaciones];
            let _planificacion = { ...planificacion };

            if (planificacion.idPlanificacion) {
                PlanificacionService.update(planificacion.idPlanificacion, planificacion);
                const index = findIndexById(planificacion.idPlanificacion);
                _planificaciones[index] = _planificacion;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Planificación actualizada',
                    life: 3000
                });
            } else {
                _planificacion.idPlanificacion = await getIdPlanificacion(_planificacion);
                _planificaciones.push(_planificacion);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Planificación creada',
                    life: 3000
                });
            }

            setPlanificaciones(_planificaciones);
            setPlanificacionDialog(false);
            setPlanificacion(emptyPlanificacion);
        }
    };

    const getIdPlanificacion = async (plan: Planificacion) => {
        let id = 0;
        await PlanificacionService.create(plan).then((response) => {
            id = response.data.idPlanificacion;
        }).catch((error) => {
            console.log(error);
        });
        return id;
    };

    const editPlanificacion = (plan: Planificacion) => {
        setPlanificacion({ ...plan });
        setPlanificacionDialog(true);
    };

    const confirmDeletePlanificacion = (plan: Planificacion) => {
        setPlanificacion(plan);
        setDeletePlanificacionDialog(true);
    };

    const deletePlanificacion = () => {
        const _planificaciones = planificaciones.filter((val) => val.idPlanificacion !== planificacion.idPlanificacion);
        PlanificacionService.delete(planificacion.idPlanificacion);
        setPlanificaciones(_planificaciones);
        setDeletePlanificacionDialog(false);
        setPlanificacion(emptyPlanificacion);
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Planificación eliminada', life: 3000 });
    };

    const findIndexById = (id: number) => {
        return planificaciones.findIndex(p => p.idPlanificacion === id);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, campo: keyof Planificacion) => {
        const val = e.target.value;
        setPlanificacion({ ...planificacion, [campo]: val });
    };

    const leftToolbarTemplate = () => (
        <div className="flex flex-wrap gap-2">
            <Button label="Nueva" icon="pi pi-plus" severity="success" onClick={openNew} />
        </div>
    );

    const rightToolbarTemplate = () => (
        <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
    );

    const actionBodyTemplate = (rowData: Planificacion) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editPlanificacion(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeletePlanificacion(rowData)} />
        </>
    );

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestión de Planificación</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" placeholder="Buscar..." onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    setGlobalFilter(target.value);
                }} />
            </IconField>
        </div>
    );

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={savePlanificacion} />
        </>
    );

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deletePlanificacion} />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={planificaciones} dataKey="idPlanificacion"
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter} header={header}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} registros">
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="idPlanificacion" header="ID" sortable style={{ minWidth: '5rem' }}></Column>
                    <Column field="jefeUnidad" header="Jefe de Unidad" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="numeroActividades" header="Actividades" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="objetivoArea" header="Objetivo del Área" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={planificacionDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Detalles de Planificación" modal className="p-fluid"
                footer={dialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="jefeUnidad" className="font-bold">Jefe de Unidad</label>
                    <InputText id="jefeUnidad" value={planificacion.jefeUnidad} onChange={(e) => onInputChange(e, 'jefeUnidad')} required
                        className={classNames({ 'p-invalid': submitted && !planificacion.jefeUnidad })} />
                    {submitted && !planificacion.jefeUnidad && <small className="p-error">El jefe es requerido</small>}
                </div>
                <div className="field">
                    <label htmlFor="numeroActividades" className="font-bold">Número de Actividades</label>
                    <InputText id="numeroActividades" value={planificacion.numeroActividades} onChange={(e) => onInputChange(e, 'numeroActividades')} required
                        className={classNames({ 'p-invalid': submitted && !planificacion.numeroActividades })} />
                    {submitted && !planificacion.numeroActividades && <small className="p-error">El número es requerido</small>}
                </div>
                <div className="field">
                    <label htmlFor="objetivoArea" className="font-bold">Objetivo del Área</label>
                    <InputText id="objetivoArea" value={planificacion.objetivoArea} onChange={(e) => onInputChange(e, 'objetivoArea')} required
                        className={classNames({ 'p-invalid': submitted && !planificacion.objetivoArea })} />
                    {submitted && !planificacion.objetivoArea && <small className="p-error">El objetivo es requerido</small>}
                </div>
            </Dialog>

            <Dialog visible={deletePlanificacionDialog} style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar"
                modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {planificacion && (
                        <span>¿Estás seguro de eliminar la planificación del jefe <b>{planificacion.jefeUnidad}</b>?</span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
