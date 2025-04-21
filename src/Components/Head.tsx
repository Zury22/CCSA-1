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
    ];    
    
    return (
        <div className="card menubar-fixed">
            <Menubar model={items} />
        </div>
    );
}