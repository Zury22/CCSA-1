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
import UnidadResponsableService from '../Services/UnidadResponsableService';

interface UnidadResponsable {
    idUnidadResponsable: number;
    jefeUnidad: string;
    nombreUnidadResponsable: string;
}

interface Usuario {
    idUsuario: number;
    contraseña: string;
    correo: string;
    nombre: string;
}

export default function CRUDUnidadResponsable() {
    const emptyUnidadResponsable: UnidadResponsable = {
        idUnidadResponsable: 0,
        jefeUnidad: '',
        nombreUnidadResponsable: ''
    };
    const [ListaUsuario, setListaUsuario] = useState<Usuario[]>([]);
    const [unidadesResponsables, setUnidadesResponsables] = useState<UnidadResponsable[]>([]);
    const [unidadResponsable, setUnidadResponsable] = useState<UnidadResponsable>(emptyUnidadResponsable);
    const [unidadResponsableDialog, setUnidadResponsableDialog] = useState<boolean>(false);
    const [deleteUnidadResponsableDialog, setDeleteUnidadResponsableDialog] = useState<boolean>(false);

    const [unidadResponsableListado, setUnidadResponsableListado] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<UnidadResponsable[]>>(null);

    useEffect(() => {
        UnidadResponsableService.findAll().then((response) => setUnidadesResponsables(response.data));
    }, []);

    const openNew = () => {
        setUnidadResponsable(emptyUnidadResponsable);
        setSubmitted(false);
        setUnidadResponsableDialog(true);
    };

    const hideListadoDialog = () => {
        setSubmitted(false);
        setUnidadResponsableListado(false);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setUnidadResponsableDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteUnidadResponsableDialog(false);
    };

    const saveUnidadResponsable = async () => {
        setSubmitted(true);

        if (unidadResponsable.nombreUnidadResponsable.trim()) {
            let _unidades = [...unidadesResponsables];
            let _unidad = { ...unidadResponsable };

            if (unidadResponsable.idUnidadResponsable) {
                UnidadResponsableService.update(unidadResponsable.idUnidadResponsable, unidadResponsable);
                const index = findIndexById(unidadResponsable.idUnidadResponsable);
                _unidades[index] = _unidad;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Unidad actualizada',
                    life: 3000
                });
            } else {
                _unidad.idUnidadResponsable = await getIdUnidadResponsable(_unidad);
                _unidades.push(_unidad);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Unidad creada',
                    life: 3000
                });
            }

            setUnidadesResponsables(_unidades);
            setUnidadResponsableDialog(false);
            setUnidadResponsable(emptyUnidadResponsable);
        }
    };

    const getIdUnidadResponsable = async (unidad: UnidadResponsable) => {
        let id = 0;
        const nuevaUnidad = {
            nombreUnidadResponsable: unidad.nombreUnidadResponsable,
            jefeUnidad: unidad.jefeUnidad
        };
        await UnidadResponsableService.create(nuevaUnidad).then((response) => {
            id = response.data.idUnidadResponsable;
        }).catch((error) => {
            console.log(error);
        });
        return id;
    };

    const listarUsuarios = (unidad: UnidadResponsable) => {
        setUnidadResponsable(unidad);
        UnidadResponsableService.findUsuarioById(unidad.idUnidadResponsable).then((response) => {
            setListaUsuario(response.data.usuarios);
        }).catch((error) => {
            console.log(error);
        });
        setUnidadResponsableListado(true);
    }

    const editUnidadResponsable = (unidad: UnidadResponsable) => {
        setUnidadResponsable({ ...unidad });
        setUnidadResponsableDialog(true);
    };

    const confirmDeleteUnidadResponsable = (unidad: UnidadResponsable) => {
        setUnidadResponsable(unidad);
        setDeleteUnidadResponsableDialog(true);
    };

    const deleteUnidadResponsable = () => {
        const _unidades = unidadesResponsables.filter((val) => val.idUnidadResponsable !== unidadResponsable.idUnidadResponsable);
        UnidadResponsableService.delete(unidadResponsable.idUnidadResponsable);
        setUnidadesResponsables(_unidades);
        setDeleteUnidadResponsableDialog(false);
        setUnidadResponsable(emptyUnidadResponsable);
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Unidad eliminada', life: 3000 });
    };

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < unidadesResponsables.length; i++) {
            if (unidadesResponsables[i].idUnidadResponsable === id) {
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
        const _unidad = { ...unidadResponsable };
        switch (numCampo) {
            case 1:
                _unidad.nombreUnidadResponsable = val;
                break;
            case 2:
                _unidad.jefeUnidad = val;
                break;
        }

        setUnidadResponsable(_unidad);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nueva" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData: UnidadResponsable) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-prime" style={{ color: 'green' }} rounded outlined className='mr-2' onClick={() => listarUsuarios(rowData)} />
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUnidadResponsable(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUnidadResponsable(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestión de Unidad Responsable</h4>
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
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveUnidadResponsable} />
        </React.Fragment>
    );

    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteUnidadResponsable} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={unidadesResponsables} dataKey="idUnidadResponsable"
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    globalFilter={globalFilter} header={header}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} unidades"
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="idUnidadResponsable" header="ID" sortable style={{ minWidth: '5rem' }}></Column>
                    <Column field="nombreUnidadResponsable" header="Nombre Unidad" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="jefeUnidad" header="Jefe de Unidad" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={unidadResponsableDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Detalles de Unidad Responsable" modal className="p-fluid"
                footer={dialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="nombreUnidadResponsable" className="font-bold">Nombre Unidad</label>
                    <InputText id="nombreUnidadResponsable" value={unidadResponsable.nombreUnidadResponsable} onChange={(e) => onInputChange(e, 1)} required autoFocus
                        className={classNames({ 'p-invalid': submitted && !unidadResponsable.nombreUnidadResponsable })} />
                    {submitted && !unidadResponsable.nombreUnidadResponsable && <small className="p-error">El nombre es requerido</small>}
                </div>
                <div className="field">
                    <label htmlFor="jefeUnidad" className="font-bold">Jefe de Unidad</label>
                    <InputText id="jefeUnidad" value={unidadResponsable.jefeUnidad} onChange={(e) => onInputChange(e, 2)} required
                        className={classNames({ 'p-invalid': submitted && !unidadResponsable.jefeUnidad })} />
                    {submitted && !unidadResponsable.jefeUnidad && <small className="p-error">El jefe es requerido</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteUnidadResponsableDialog} style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar"
                modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {unidadResponsable && (
                        <span>
                            ¿Estas seguro de eliminar a <b>{unidadResponsable.nombreUnidadResponsable}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
            <Dialog visible={unidadResponsableListado} style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Usuario de unidad responsable" modal className="p-fluid"
                onHide={hideListadoDialog}>
                <div className="field">
                    <ul>{ListaUsuario.map(item => <li>{item.nombre}</li>)}</ul>
                </div>
            </Dialog>
        </div>
    );
}
