
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


interface Usuario {
  idUsuario: number;
  contraseña: string;
  correo: string;
  nombre: string;
}

interface Rol {
  idRol: number;
  nombreRol: string;
  permisos: string;
}

interface UnidadResponsable {
    idUnidadResponsable: number;
    jefeUnidad: string;
    nombreUnidadResponsable: string;
}

export default function CRUDUsuario() {
    const emptyUsuario: Usuario = {
        idUsuario: 0,
        contraseña: '',
        correo: '',
        nombre: ''
    };
//lista de roles
    const [listaRoles, setListaRoles] = useState<Rol[]>([]);
    const [listaUnidadResponsable, setListaUnidadResponsable] = useState<UnidadResponsable[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuario, setUsuario] = useState<Usuario>(emptyUsuario);
    const [usuarioDialog, setUsuarioDialog] = useState<boolean>(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState<boolean>(false);
//agregado para el listado de usuarios
    const [usuarioListado, setUsuarioListado] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Usuario[]>>(null);

    useEffect(() => {
        UsuarioService.findAll().then((response) => setUsuarios(response.data));
    }, []);

    const openNew = () => {
        setUsuario(emptyUsuario);
        setSubmitted(false);
        setUsuarioDialog(true);
    };
//ocultar listado de roles
    const hideListadoDialog = () => {
        setSubmitted(false);
        setUsuarioListado(false);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };


    const hideDeleteObjetoDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const saveUsuario = async() => {
        setSubmitted(true);
        if (usuario.nombre.trim()) {
            let _usuarios = [...usuarios];
            let _usuario = { ...usuario };

            if (usuario.idUsuario) {
                UsuarioService.update(usuario.idUsuario, usuario);
                const index = findIndexById(usuario.idUsuario);
                _usuarios[index] = _usuario;
                toast.current?.show({ 
                    severity: 'success', 
                    summary: 'Exito', 
                    detail: 'Usuario actualizado', 
                    life: 3000 });
            } else {
                _usuario.idUsuario = await getIdUsuario(_usuario);
                _usuarios.push(_usuario);
                toast.current?.show({ 
                    severity: 'success', 
                    summary: 'exito', 
                    detail: 'Usuario creado', 
                    life: 3000 });
            }

            setUsuarios(_usuarios);
            setUsuarioDialog(false);
            setUsuario(emptyUsuario);
        }
    };

    const getIdUsuario = async(usuario: Usuario) => {
        let idUsuario = 0;
        const newUsuario = {
            nombre: usuario.nombre,
            contraseña: usuario.contraseña,
            correo: usuario.correo,
           // idRol: usuario.idRol

        };
        await UsuarioService.create(newUsuario).then((response) => {
            idUsuario = response.data.idUsuario; 
        }).catch((error) => {
            console.log(error);
        });
        return idUsuario;   
    }; 
    
    //listar roles
    const listarRoles = (usuario: Usuario) => {
        setUsuario({...usuario});
        UsuarioService.findById(usuario.idUsuario).then((response) => {
            setListaRoles(response.data.roles); // Asignar la lista de roles al estado
        }).catch(error => {
            console.log(error);
        })
        setUsuarioListado(true);
    };

    const listarUnidadResponsable = (usuario: Usuario) => {
        setUsuario({...usuario});
        UsuarioService.findById(usuario.idUsuario).then((response) => {
            setListaUnidadResponsable(response.data.UnidadResponsable); // Asignar la lista de roles al estado
        }).catch(error => {
            console.log(error);
        })
        setUsuarioListado(true);
    };

    const editUsuario = (usuario: Usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
    };

    const confirmDeleteObjeto = (usuario: Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };
//rol
    const deleteUsuario = () => {
        const _usuarios = usuarios.filter((val) => val.idUsuario !== 
        usuario.idUsuario);
        UsuarioService.delete(usuario.idUsuario);
        setUsuarios(_usuarios);
        setDeleteUsuarioDialog(false);
        setUsuario(emptyUsuario);
        toast.current?.show({ severity: 'success', summary: 'Exito', 
            detail: 'Usuario eliminado', life: 3000 });
    };
    const findIndexById = (idUsuario: number) => {
        let index = -1;
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].idUsuario === idUsuario) {
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
        const _usuario = { ...usuario };
        switch (numCampo) {
            case 1:
                _usuario.nombre = val;
                break;
            case 2:
                _usuario.correo = val;
                break;
            case 3:
                _usuario.contraseña = val;
                break;
            default:
                break;
        }

        setUsuario(_usuario);
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
    const actionBodyTemplate = (rowData: Usuario) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-prime" style={{color: 'green'}}rounded outlined className='mr-2' onClick={()=> listarRoles(rowData)}/>
                <Button icon="pi pi-users" style={{color: 'blue'}} rounded outlined className='mr-2' onClick={()=> listarUnidadResponsable(rowData)}/>
                <Button icon="pi pi-pencil" rounded outlined className='mr-2' onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteObjeto(rowData)} />
            </React.Fragment>
        );
    };
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Gestion de usuarios</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                 <InputText type="search" placeholder="Search..." onInput={(e) => {const target = e.target as HTMLInputElement; setGlobalFilter(target.value);}}  />
            </IconField>
        </div>
    );
    const objetoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveUsuario} />
        </React.Fragment>
    );
    const deleteObjetoDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteObjetoDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteUsuario} />
        </React.Fragment>
    );
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={usuarios} dataKey="idUsuario"
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} usuarios" 
                    globalFilter={globalFilter} header={header}
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="idUsuario" header="ID" sortable style={{ minWidth: '5rem' }}></Column>
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="correo" header="Correo" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="contraseña" header="Contraseña" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={usuarioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Detalles del usuario" modal className="p-fluid" 
            footer={objetoDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="nombre" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="nombre" value={usuario.nombre} onChange={(e) => onInputChange(e, 1)} required autoFocus 
                    className={classNames({ 'p-invalid': submitted && !usuario.nombre })} />
                    {submitted && !usuario.nombre && <small className="p-error">El nombre es requerido</small>}
                </div>
                <div className="field">
                    <label htmlFor="correo" className="font-bold">
                        Correo
                    </label>
                    <InputText id="correo" value={usuario.correo} onChange={(e) => onInputChange(e, 2)} required autoFocus 
                    className={classNames({ 'p-invalid': submitted && !usuario.correo })} />
                    {submitted && !usuario.correo && <small className="p-error">El correo es requerido</small>}
                </div>
                <div className="field">
                    <label htmlFor="contraseña" className="font-bold">
                        Correo
                    </label>
                    <InputText id="contraseña" value={usuario.contraseña} onChange={(e) => onInputChange(e, 3)} required autoFocus 
                    className={classNames({ 'p-invalid': submitted && !usuario.contraseña })} />
                    {submitted && !usuario.contraseña && <small className="p-error">La contraseña es requerida</small>}
                </div>
            </Dialog>
            <Dialog visible={deleteUsuarioDialog} style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" 
            modal footer={deleteObjetoDialogFooter} onHide={hideDeleteObjetoDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {usuario && (
                        <span>
                            ¿Estas seguro de eliminar a <b>{usuario.nombre}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
            <Dialog visible={usuarioListado} style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Rol del usuario" modal className="p-fluid" 
            onHide={hideListadoDialog}>
                <div className="field">
                    <ul>{listaRoles.map(item => <li>{item.nombreRol}</li>)}</ul>
                </div>
            </Dialog>
            <Dialog visible={usuarioListado} style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Unidad responsable del usuario" modal className="p-fluid" 
            onHide={hideListadoDialog}>
                <div className="field">
                    <ul>{listaUnidadResponsable.map(item => <li>{item.nombreUnidadResponsable}</li>)}</ul>
                </div>
            </Dialog>
        </div>
    );
}