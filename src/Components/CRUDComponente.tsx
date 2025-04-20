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
import ComponenteService from '../Services/ComponenteService';

interface Componente {
    idActividad: number;
    descripcion: string;
    indicadorResultados: string;
    medioVerificacion: string;
}

export default function CRUDComponente() {
    const emptyComponente: Componente = {
        idActividad: 0,
        descripcion: '',
        indicadorResultados: '',
        medioVerificacion: ''
    };

    const [componentes, setComponentes] = useState<Componente[]>([]);
    const [componente, setComponente] = useState<Componente>(emptyComponente);
    const [componenteDialog, setComponenteDialog] = useState<boolean>(false);
    const [deleteComponenteDialog, setDeleteComponenteDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Componente[]>>(null);

    useEffect(() => {
        ComponenteService.findAll().then((response) => setComponentes(response.data));
    }, []);

    const openNew = () => {
        setComponente(emptyComponente);
        setSubmitted(false);
        setComponenteDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setComponenteDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteComponenteDialog(false);
    };

    const saveComponente = async () => {
        setSubmitted(true);

        if (componente.descripcion.trim()) {
            let _componentes = [...componentes];
            let _componente = { ...componente };

            if (componente.idActividad) {
                await ComponenteService.update(componente.idActividad, componente);
                const index = findIndexById(componente.idActividad);
                _componentes[index] = _componente;
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Componente actualizado', life: 3000 });
            } else {
                _componente.idActividad = await getIdComponente(_componente);
                _componentes.push(_componente);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Componente creado', life: 3000 });
            }

            setComponentes(_componentes);
            setComponenteDialog(false);
            setComponente(emptyComponente);
        }
    };

    const getIdComponente = async (componente: Componente) => {
        let id = 0;
        const nuevoComponente = {
            descripcion: componente.descripcion,
            indicadorResultados: componente.indicadorResultados,
            medioVerificacion: componente.medioVerificacion
        };
        await ComponenteService.create(nuevoComponente).then((response) => {
            id = response.data.idActividad;
        });
        return id;
    };

    const editComponente = (componente: Componente) => {
        setComponente({ ...componente });
        setComponenteDialog(true);
    };

    const confirmDeleteComponente = (componente: Componente) => {
        setComponente(componente);
        setDeleteComponenteDialog(true);
    };

    const deleteComponente = () => {
        const _componentes = componentes.filter((val) => val.idActividad !== componente.idActividad);
        ComponenteService.delete(componente.idActividad);
        setComponentes(_componentes);
        setDeleteComponenteDialog(false);
        setComponente(emptyComponente);
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Componente eliminado', life: 3000 });
    };

    const findIndexById = (id: number) => {
        return componentes.findIndex(c => c.idActividad === id);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Componente) => {
        const val = (e.target && e.target.value) || '';
        setComponente({ ...componente, [field]: val });
    };

    const leftToolbarTemplate = () => (
        <div className="flex flex-wrap gap-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
        </div>
    );

    const rightToolbarTemplate = () => (
        <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
    );

    const actionBodyTemplate = (rowData: Componente) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editComponente(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteComponente(rowData)} />
        </>
    );

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestión de Componentes</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" placeholder="Buscar..." onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} />
            </IconField>
        </div>
    );

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveComponente} />
        </>
    );

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteComponente} />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={componentes} dataKey="idActividad"
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter} header={header}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} componentes"
                >
                    <Column field="idActividad" header="ID" sortable style={{ minWidth: '5rem' }}></Column>
                    <Column field="descripcion" header="Descripción" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="indicadorResultados" header="Indicador" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="medioVerificacion" header="Medio de Verificación" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={componenteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Detalles del Componente" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="descripcion" className="font-bold">Descripción</label>
                    <InputText id="descripcion" value={componente.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus
                        className={classNames({ 'p-invalid': submitted && !componente.descripcion })} />
                    {submitted && !componente.descripcion && <small className="p-error">La descripción es requerida</small>}
                </div>
                <div className="field">
                    <label htmlFor="indicadorResultados" className="font-bold">Indicador de Resultados</label>
                    <InputText id="indicadorResultados" value={componente.indicadorResultados} onChange={(e) => onInputChange(e, 'indicadorResultados')} />
                </div>
                <div className="field">
                    <label htmlFor="medioVerificacion" className="font-bold">Medio de Verificación</label>
                    <InputText id="medioVerificacion" value={componente.medioVerificacion} onChange={(e) => onInputChange(e, 'medioVerificacion')} />
                </div>
            </Dialog>

            <Dialog visible={deleteComponenteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirmar" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {componente && <span>¿Estás seguro de eliminar el componente <b>{componente.descripcion}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}
