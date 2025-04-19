import axios from "axios";
<<<<<<< HEAD
const URL_BASE = "http://localhost:8080/unidadResponsable";
class UnidadResponsableService{

    findAll(){
        return axios.get(URL_BASE);
    }
    findUsuarioById(idUnidadResponsable: number){
        return axios.get(URL_BASE + '/' + idUnidadResponsable);
    }
    create(unidadResponsable: object){
        return axios.post(URL_BASE, unidadResponsable);
    }
    update(idUnidadResponsable: number, unidadResponsable: object){
        return axios.put(URL_BASE + '/'+idUnidadResponsable, unidadResponsable);
    }
    delete(idUnidadResponsable: number){
        return axios.delete(URL_BASE + '/' + idUnidadResponsable);
    }
}
export default new UnidadResponsableService();
=======

const URL_BASE = "http://localhost:8080/unidadResponsable";

class UnidadResponsableService{

    //metodo para obtener todos los ariculos
    findAll(){
        return axios.get(URL_BASE);
    }

    findUsuarioById(idUnidadResponsable: number){
        return axios.get(URL_BASE + '/' + idUnidadResponsable)
    }
    //Metodo para crear una nueva mascota
    create(unidadResponsable: object){
        return axios.post(URL_BASE, unidadResponsable);
    }

    //Metodo para actualizar un alrticulo existente
    update(idUnidadResponsable: number, unidadResponsable: object){
        return axios.put(URL_BASE + '/'+idUnidadResponsable, unidadResponsable)
    }

    //metodo para eliminar un articulo
    delete(idUnidadResponsable: number){
        return axios.delete(URL_BASE + '/' + idUnidadResponsable)
    }
}
//se exporta la clase 
export default new UnidadResponsableService();
>>>>>>> 4cda38e (1)
