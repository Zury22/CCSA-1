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
import UnidadResponsableService from '../Services/UsuarioService';

//interfaz para modelar a los clientes
interface UnidadResponsable {
    idUnidadResponsable: number;
    jefeUnidad: string;
    numeroUnidadResponsable: number;
  }
//Define la interfaz mascota con los campos necesarios para un registro
  interface Rol {
    idRol: number;
    nombreRol: string;
    permisos: string;
    //se incluye el campo usuario como un objeto
    usuario: Usuario;
  }

  interface Permisos{
    permiso: string;
  }
export default function CRUDRol() {
    const emptyUsuario: Usuario = {
        idUsuario: 0,   
        nombre: '',
        correo: '',
        contraseña: ''
    };
    const emptyRol: Rol = { 
        idRol: 0,
        nombreRol: '',
        permisos: '',
        //se inicializa el usuario
        usuario: emptyUsuario
    };
    //Variables de estado
    //adicionadas para incluor el listado de los usuarios
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);//lista de roles
    const [rol, setRol] = useState<Rol>(emptyRol);//rol seleccionado o en proceso de edicion 
    const [rolDialog, setRolDialog] = useState<boolean>(false);//estado para mostrar el dialogo de edicion de rol
    const [deleteRolDialog, setDeleteRolDialog] = useState<boolean>(false);//estado para mostrar el dialogo de confirmacion de eliminacion de rol
    const [submitted, setSubmitted] = useState<boolean>(false);//estado para indicar si se ha enviado el formulario
    const [globalFilter, setGlobalFilter] = useState<string>('');//filtro global para la tabla
    const toast = useRef<Toast>(null);//referencia al componente Toast para mostrar mensajes de exito o error
    const dt = useRef<DataTable<Rol[]>>(null);//referencia a la tabla de datos
    const permisos: Permisos[] = [
        {permiso: 'Administrador'}, 
        {permiso: 'Operador Avanzado'},
        {permiso: 'Operador Basico'},
        {permiso: 'Visualizador/supervisor'}
    ];
    const [selectedPermisos, setSelectedPermisos] = useState<Permisos | null>(null);//permisos seleccionados en el dialogo de edicion de rol
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario| null>(null);//usuarios seleccionados en la tabla
    useEffect(() => {
        UsuarioService.findAll().then((responseUs) => setUsuarios(responseUs.data));
        RolService.findAll().then((response) => setRoles(response.data));//llama al servicio para obtener los roles y los usuarios
    }, [selectedUsuario]);

    const openNew = () => {
        setRol(emptyRol);
        setSubmitted(false);
        setRolDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRolDialog(false);
    };

    const hideDeleteRolDialog = () => {
        setDeleteRolDialog(false);
    };

    const saveRol = async () => {
        setSubmitted(true);
        if (rol.nombreRol.trim()) {
            const _roles = [...roles];
            const _rol = {...rol};
            if (rol.idRol) {
                RolService.update(rol.idRol, rol);
                const index = findIndexById(rol.idRol);
                _roles[index] = _rol;
                toast.current?.show({ severity: 'success', 
                    summary: 'Exito', detail: 'Rol actulizado', life: 3000 });
            } else {
                _rol.idRol = await getIdRol(_rol);
                _roles.push(_rol);
                toast.current?.show({ severity: 'success', 
                    summary: 'Exito', detail: 'Rol Creado', life: 3000 });
            }
            setRoles(_roles);
            setRolDialog(false);
            setRol(emptyRol);
        }
    };

    const getIdRol = async (_rol: Rol) => {
        let idRol = 0;
        const newRol ={
            nombreRol: _rol.nombreRol,
            permisos: _rol.permisos,
            usuario: _rol.usuario
        }
        await RolService.create(newRol).then((response) => {
            idRol = response.data.idRol;
        }).catch((error) => {
            console.log(error);
        });
        return idRol;
    };

    const editRol = async (rol: Rol) => {
        setRol({...rol});
        setSelectedPermisos({"permiso": rol.permisos});
        await RolService.findUsuarioById(rol.idRol).then((responseUs) => {
            setSelectedPermisos(responseUs.data);
        });
        setRolDialog(true);
    };

    const confirmDeleteRol = (rol: Rol) => {
        setRol(rol);
        setDeleteRolDialog(true);
    };

    const deleteRol = () => {
        const _roles = roles.filter((val) => val.idRol !== rol.idRol);
        RolService.delete(rol.idRol);
        setRoles(_roles);
        setDeleteRolDialog(false);
        setRol(emptyRol);
        toast.current?.show({ severity: 'success', summary: 'Resultado', 
            detail: 'Rol eliminado', life: 3000 });
    };

    const findIndexById = (idRol: number) => {
        let index = -1;
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].idRol === idRol) {
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
        const _rol = {...rol};
        _rol.nombreRol = val;
        setRol(_rol);
    };

    const onUsuarioChange = (e: DropdownChangeEvent) => {
        const _rol = {...rol};
        const xusuario: Usuario = e.target.value;
        setSelectedUsuario(xusuario);
        _rol.usuario = xusuario;
        setRol(_rol);
    };

    const onPermisosChange = (e: DropdownChangeEvent) => {
        const _rol = {...rol};
        const xpermisos: Permisos = e.target.value;
        setSelectedPermisos(xpermisos);
        _rol.permisos = xpermisos.permiso;
        setRol(_rol);
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
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editRol(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteRol(rowData)} />
            </React.Fragment>
        );
    };
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestion de roles</h4>
            <IconField iconPosition="left">{}
                <InputIcon className="pi pi-search" />{}
                {}
                 <InputText type="search" placeholder="Buscar..." onInput={(e) => {const target = e.target as HTMLInputElement; 
                    setGlobalFilter(target.value);}}  />
            </IconField>
        </div>
    );
    const rolDialogFooter = (
        <React.Fragment>
            {}
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />{}
            <Button label="Guardar" icon="pi pi-check" onClick={saveRol} />
        </React.Fragment>
    );
    const deleteRolDialogFooter = (
        <React.Fragment>
            {}
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRolDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteRol} />
        </React.Fragment>
    );
    return (
        <div>{}
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={roles} dataKey="idRol" 
                paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} roles" 
                globalFilter={globalFilter} header={header}
                >
                    <Column field="idRol" header="ID Rol" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="nombreRol" header="Nombre Rol" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="permisos" header="Permisos" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={rolDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Detalles del rol" modal className="p-fluid" footer={rolDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="Nombre Rol" className="font-bold">
                        NombreRol
                    </label>
                    <InputText id="Nombre Rol" value={rol.nombreRol} onChange={(e) => onInputChange(e)} required autoFocus className={classNames({ 'p-invalid': 
                        submitted && !rol.nombreRol })} />
                    {submitted && !rol.nombreRol && <small className="p-error">El cargo del rol es requerido</small>}
                </div>

                <div className="field">
                    <label className="font-bold block mb-2">Usuario:{
                        selectedUsuario?.nombre}</label>
                    <Dropdown value={selectedUsuario} onChange={
                        onUsuarioChange} options={usuarios} optionLabel="nombre"  
                        placeholder="Seleccione un usuario"  className="w-full md:w-14rem" />
                </div>

                <div className="field">
                    <label className="font-bold block mb-2">Permisos:</label>
                    <Dropdown value={selectedPermisos} onChange={onPermisosChange} 
                    options={permisos} optionLabel="permiso" placeholder="Seleccione un permiso" className="w-full md:w-14rem" />
                </div>
            </Dialog>

            <Dialog visible={deleteRolDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Confirmar" modal footer={deleteRolDialogFooter} onHide={hideDeleteRolDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {rol && (
                        <span>
                            ¿Estas seguro de eliminar <b>{rol.nombreRol}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
