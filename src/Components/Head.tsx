import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

export default function Head() {
    const items: MenuItem[] = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            url: '/'
        },
        {
            label: 'Unidad Responsable',
            icon: 'pi pi-users',
            url: '/unidadResponsable',
        },
        {
            label: 'Usuario',
            icon: 'pi pi-user',
            url: '/usuario',
        },
        {
            label: 'Rol',
            icon: 'pi pi-id-card',
            url: '/rol',
        },
        {
            label: 'Autorizacion',
            icon: 'pi pi-check',
            url: '/autorizacion',
        },
        
    ];    
    
    return (
        <div className="card menubar-fixed">
            <Menubar model={items} />
        </div>
    );
}