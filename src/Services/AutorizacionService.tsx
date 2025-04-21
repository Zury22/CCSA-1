import axios from "axios";

const URL_BASE = "http://localhost:8080/autorizacion";

class AutorizacionService{

    //metodo para obtener todos los ariculos
    findAll(){
        return axios.get(URL_BASE);
    }

    findById(idAutorizacion: number){
        return axios.get(URL_BASE + '/' + idAutorizacion)
    }


    //Metodo para crear una nueva mascota
    create(autorizacion: object){
        return axios.post(URL_BASE, autorizacion);
    }

    //Metodo para actualizar un alrticulo existente
    update(idAutorizacion: number,  Autorizacion: object){
        return axios.put(URL_BASE + '/'+idAutorizacion, Autorizacion)
    }

    //metodo para eliminar un articulo
    delete(idAutorizacion: number){
        return axios.delete(URL_BASE + '/' + idAutorizacion)
    }
}
//se exporta la clase 
export default new AutorizacionService();