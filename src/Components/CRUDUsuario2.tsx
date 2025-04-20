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
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import UsuarioService from '../Services/UsuarioService';
import UnidadResponsableService from '../Services/UnidadResponsableService';

interface UnidadResponsable {
  idUnidadResponsable: number;
  jefeUnidad: string;
  numeroUnidadResponsable: number;
}

interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
  correo: string;
  contraseña: string;
  permisos: string;
  unidadResponsable: UnidadResponsable;
}

interface PermisoOption {
  nombre: string;
}

export default function CRUDUsuario() {
  const emptyUnidadResponsable: UnidadResponsable = {
    idUnidadResponsable: 0,
    jefeUnidad: '',
    numeroUnidadResponsable: 0,
  };

  const emptyUsuario: Usuario = {
    idUsuario: 0,
    nombreUsuario: '',
    correo: '',
    contraseña: '',
    permisos: '',
    unidadResponsable: emptyUnidadResponsable,
  };

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuario, setUsuario] = useState<Usuario>(emptyUsuario);
  const [usuarioDialog, setUsuarioDialog] = useState(false);
  const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [unidadesResponsables, setUnidadesResponsables] = useState<UnidadResponsable[]>([]);
  const [selectedUnidadResponsable, setSelectedUnidadResponsable] = useState<UnidadResponsable | null>(null);
  const [selectedPermiso, setSelectedPermiso] = useState<PermisoOption | null>(null);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Usuario>>(null);

  const permisos: PermisoOption[] = [
    { nombre: 'Administrador' },
    { nombre: 'Operador Avanzado' },
    { nombre: 'Operador Basico' },
    { nombre: 'Visualizador/Supervisor' },
  ];

  useEffect(() => {
    UnidadResponsableService.findAll().then((res) => setUnidadesResponsables(res.data));
    UsuarioService.findAll().then((res) => setUsuarios(res.data));
  }, []);

  const openNew = () => {
    setUsuario(emptyUsuario);
    setSelectedUnidadResponsable(null);
    setSelectedPermiso(null);
    setSubmitted(false);
    setUsuarioDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUsuarioDialog(false);
  };

  const hideDeleteUsuarioDialog = () => {
    setDeleteUsuarioDialog(false);
  };

  const saveUsuario = async () => {
    setSubmitted(true);
    if (usuario.nombreUsuario.trim()) {
      const _usuarios = [...usuarios];
      const _usuario = { ...usuario };

      if (usuario.idUsuario) {
        await UsuarioService.update(usuario.idUsuario, usuario);
        const index = _usuarios.findIndex(u => u.idUsuario === usuario.idUsuario);
        _usuarios[index] = _usuario;
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado', life: 3000 });
      } else {
        const response = await UsuarioService.create(usuario);
        _usuario.idUsuario = response.data.idUsuario;
        _usuarios.push(_usuario);
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado', life: 3000 });
      }

      setUsuarios(_usuarios);
      setUsuarioDialog(false);
      setUsuario(emptyUsuario);
    }
  };

  const editUsuario = (usuario: Usuario) => {
    setUsuario({ ...usuario });
    setSelectedUnidadResponsable(usuario.unidadResponsable);
    setSelectedPermiso({ nombre: usuario.permisos });
    setUsuarioDialog(true);
  };

  const confirmDeleteUsuario = (usuario: Usuario) => {
    setUsuario(usuario);
    setDeleteUsuarioDialog(true);
  };

  const deleteUsuario = async () => {
    await UsuarioService.delete(usuario.idUsuario);
    setUsuarios(usuarios.filter(val => val.idUsuario !== usuario.idUsuario));
    setDeleteUsuarioDialog(false);
    setUsuario(emptyUsuario);
    toast.current?.show({ severity: 'success', summary: 'Resultado', detail: 'Usuario eliminado', life: 3000 });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsuario({ ...usuario, nombreUsuario: val });
  };

  const onUnidadResponsableChange = (e: DropdownChangeEvent) => {
    const value = e.value as UnidadResponsable;
    setSelectedUnidadResponsable(value);
    setUsuario({ ...usuario, unidadResponsable: value });
  };

  const onPermisoChange = (e: DropdownChangeEvent) => {
    const value = e.value as PermisoOption;
    setSelectedPermiso(value);
    setUsuario({ ...usuario, permisos: value.nombre });
  };

  const leftToolbarTemplate = () => (
    <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
  );

  const rightToolbarTemplate = () => (
    <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={() => dt.current?.exportCSV()} />
  );

  const actionBodyTemplate = (rowData: Usuario) => (
    <>
      <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUsuario(rowData)} />
      <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUsuario(rowData)} />
    </>
  );

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Gestión de Usuario</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" placeholder="Buscar..." onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} />
      </IconField>
    </div>
  );

  const usuarioDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveUsuario} />
    </>
  );

  const deleteUsuarioDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUsuarioDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteUsuario} />
    </>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
        <DataTable ref={dt} value={usuarios} dataKey="idUsuario" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} globalFilter={globalFilter} header={header}>
          <Column field="idUsuario" header="ID Usuario" sortable style={{ minWidth: '8rem' }} />
          <Column field="nombreUsuario" header="Nombre Usuario" sortable style={{ minWidth: '12rem' }} />
          <Column field="permisos" header="Permisos" sortable style={{ minWidth: '12rem' }} />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
        </DataTable>
      </div>

      <Dialog visible={usuarioDialog} style={{ width: '32rem' }} header="Detalles del Usuario" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="nombreUsuario" className="font-bold">Nombre Usuario</label>
          <InputText id="nombreUsuario" value={usuario.nombreUsuario} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !usuario.nombreUsuario })} />
          {submitted && !usuario.nombreUsuario && <small className="p-error">El nombre del usuario es requerido</small>}
        </div>

        <div className="field">
          <label className="font-bold block mb-2">Unidad Responsable</label>
          <Dropdown value={selectedUnidadResponsable} onChange={onUnidadResponsableChange} options={unidadesResponsables} optionLabel="jefeUnidad" placeholder="Seleccione una unidad" className="w-full md:w-14rem" />
        </div>

        <div className="field">
          <label className="font-bold block mb-2">Permisos</label>
          <Dropdown value={selectedPermiso} onChange={onPermisoChange} options={permisos} optionLabel="nombre" placeholder="Seleccione un permiso" className="w-full md:w-14rem" />
        </div>
      </Dialog>

      <Dialog visible={deleteUsuarioDialog} style={{ width: '32rem' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {usuario && <span>¿Estás seguro de eliminar <b>{usuario.nombreUsuario}</b>?</span>}
        </div>
      </Dialog>
    </div>
  );
}
