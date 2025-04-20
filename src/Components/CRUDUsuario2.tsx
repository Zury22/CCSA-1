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
import UsuarioService from '../Services/UsuarioService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import UnidadResponsableService from '../Services/UnidadResponsableService';

//interfaz para modelar a los clientes
interface UnidadResponsable {
    idUnidadResponsable: number;
    jefeUnidad: string;
    numeroUnidadResponsable: number;
  }
//Define la interfaz mascota con los campos necesarios para un registro
interface Usuario {
    idUsuario: number;
    contraseña: string;
    correo: string;
    nombre: string;
    //se incluye el campo usuario como un objeto
    unidadResponsable: UnidadResponsable;
  }

  interface Nombre{
    nombre: string;
  }
export default function CRUDUsuario2() {
    const emptyUnidadResponsable: UnidadResponsable = {
        idUnidadResponsable: 0,
        jefeUnidad: '',
        numeroUnidadResponsable: ''
    };
    const emptyUsuario: Usuario = { 
        idUsuario: 0,   
        nombre: '',
        correo: '',
        contraseña: '',
        //se inicializa el usuario
        unidadResponsable: emptyUnidadResponsable
    };
    //Variables de estado
    //adicionadas para incluor el listado de los usuarios
    const [unidadesResponsables, setUnidadesResponsables] = useState<Usuario[]>([]);
    const [usuarios, setUsuarios] = useState<Usuarios[]>([]);//lista de roles
    const [usuario, setUsuarios] = useState<Usuarios>(emptyRol);//rol seleccionado o en proceso de edicion 
    const [usuarioDialog, setUsuarioDialog] = useState<boolean>(false);//estado para mostrar el dialogo de edicion de rol
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState<boolean>(false);//estado para mostrar el dialogo de confirmacion de eliminacion de rol
    const [submitted, setSubmitted] = useState<boolean>(false);//estado para indicar si se ha enviado el formulario
    const [globalFilter, setGlobalFilter] = useState<string>('');//filtro global para la tabla
    const toast = useRef<Toast>(null);//referencia al componente Toast para mostrar mensajes de exito o error
    const dt = useRef<DataTable<Usuario[]>>(null);//referencia a la tabla de datos
    const nombres: Nombres[] = [
        {nombre: 'Administrador'}, 
        {nombre: 'Operador Avanzado'},
        {nombre: 'Operador Basico'},
        {nombre: 'Visualizador/supervisor'}
    ];
    const [selectedNombres, setSelectedNombres] = useState<Nombres | null>(null);//permisos seleccionados en el dialogo de edicion de rol
    const [selectedUnidadesResponsable, setSelectedUnidadesResponsable] = useState<Usuario| null>(null);//usuarios seleccionados en la tabla
    useEffect(() => {
        UnidadesResponsableService.findAll().then((responseUs) => setUnidadesResponsable(responseUs.data));
        UsuarioService.findAll().then((response) => setUsuario(response.data));//llama al servicio para obtener los roles y los usuarios
    }, [selectedUnidadesResponsable]);

    const openNew = () => {
        setUsuario(emptyRol);
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
            const _usuario = {...usuario};
            if (usuario.idUsuario) {
                UsuarioService.update(usuario.idUsuario, usuario);
                const index = findIndexById(usuario.idUsuario);
                _usuarios[index] = _usuario;
                toast.current?.show({ severity: 'success', 
                    summary: 'Exito', detail: 'Usuario actulizado', life: 3000 });
            } else {
                _usuario.idUsuario = await getIdUsuario(_usuario);
                _roles.push(_usuario);
                toast.current?.show({ severity: 'success', 
                    summary: 'Exito', detail: 'Usuario Creado', life: 3000 });
            }
            setUsuario(_usuario);
            setUsuarioDialog(false);
            setUsuario(emptyUsuario);
        }
    };

    const getIdUsuario = async (_usuario: Usuario) => {
        let idUsuario = 0;
        const newUsuario ={
            nombreUsuario: _usuario.nombreUsuario,
            nombre: _usuario.nombre,
            unidadResponsable: _usuario.unidadResponsable
        }
        await UsuarioService.create(newUsuario).then((response) => {
            idUsuario = response.data.idUsuario;
        }).catch((error) => {
            console.log(error);
        });
        return idUsuario;
    };

    const editUsuario = async (usuario: Usuario) => {
        setUsuario({...usuario});
        setSelectedNombre({"nombre": usuario.nombre});
        await UsuarioService.findUnidadesResponsableById(usuario.idUsuario).then((responseUs) => {
            setSelectedNombre(responseUs.data);
        });
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = () => {
        const _usuarios = usuarios.filter((val) => val.idUsuario !== rol.idUsuario);
        UsuarioService.delete(usuario.idUsuario);
        setUsuarios(_usuarios);
        setDeleteUsuarioDialog(false);
        setUsuario(emptyUsuario);
        toast.current?.show({ severity: 'success', summary: 'Resultado', 
            detail: 'Usuario eliminado', life: 3000 });
    };

    const findIndexById = (idUsuario: number) => {
        let index = -1;
        for (let i = 0; i < usuarios.length; i++) {
            if (Usuarios[i].idUsuario === idUsuario) {
                index = i;
                break;
            }
        }
        return index;
    };
    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = (e.target && e.target.value) || ''; 
        const _usuario = {...usuario};
        _usuario.nombreUsuario = val;
        setUsuario(_usuario);
    };

    const onUnidadResponsableChange = (e: DropdownChangeEvent) => {
        const _usuario = {...usuario};
        const xunidadesResponsable: UnidadesResponsable = e.target.value;
        setSelectedUnidadesResponsable(xunidadesResponsable);
        _Usuario.unidadesResponsable = xunidadesResponsable;
        setUsuario(_usuario);
    };

    const onPermisosChange = (e: DropdownChangeEvent) => {
        const _usuario = {...usuario};
        const xnombre: Nombre = e.target.value;
        setSelectedNombre(xnombre);
        _Usuario.permisos = xusuario.permiso;
        setUsuario(_usuario);
    };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData: Rol) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUsuario(rowData)} />
            </React.Fragment>
        );
    };
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestion de usuario</h4>
            <IconField iconPosition="left">{}
                <InputIcon className="pi pi-search" />{}
                {}
                 <InputText type="search" placeholder="Buscar..." onInput={(e) => {const target = e.target as HTMLInputElement; 
                    setGlobalFilter(target.value);}}  />
            </IconField>
        </div>
    );
    const usuarioDialogFooter = (
        <React.Fragment>
            {}
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />{}
            <Button label="Guardar" icon="pi pi-check" onClick={saveRol} />
        </React.Fragment>
    );
    const deleteRolDialogFooter = (
        <React.Fragment>
            {}
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUsuarioDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteUsuario} />
        </React.Fragment>
    );
    return (
        <div>{}
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={usuario} dataKey="idRol" 
                paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} roles" 
                globalFilter={globalFilter} header={header}
                >
                    <Column field="idUsuario" header="ID Usuario" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="nombreUsuario" header="Nombre Usuario" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="permisos" header="Permisos" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={usuarioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Detalles del usuario" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="Nombre Usuario" className="font-bold">
                        NombreUsuario
                    </label>
                    <InputText id="Nombre Usuario" value={usuario.nombreRol} onChange={(e) => onInputChange(e)} required autoFocus className={classNames({ 'p-invalid': 
                        submitted && !usuario.nombreUsuario })} />
                    {submitted && !usuario.nombreUsuario && <small className="p-error">El cargo del usuario es requerido</small>}
                </div>

                <div className="field">
                    <label className="font-bold block mb-2">UnidadesResponsable:{
                        selectedUnidadesResponsable?.nombre}</label>
                    <Dropdown value={selectedNombre} onChange={ 
                    onNombreChange} options={nombre} optionLabel="nombre" 
                        placeholder="Seleccione un nombre"  className="w-full md:w-14rem" />
                </div>

                <div className="field">
                    <label className="font-bold block mb-2">Nombre:</label>
                    <Dropdown value={selectedNombre} onChange={onNombreChange} 
                    options={Nombre} optionLabel="nombre" placeholder="Seleccione un nombre" className="w-full md:w-14rem" />
                </div>
            </Dialog>

            <Dialog visible={deleteUsuarioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {usuario && (
                        <span>
                            ¿Estas seguro de eliminar <b>{usuario.nombreUsuario}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
