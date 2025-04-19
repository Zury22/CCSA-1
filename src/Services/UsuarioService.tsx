import axios from "axios";

const URL_BASE = "http://localhost:8080/usuario";

class UsuarioService{

    //metodo para obtener todos los ariculos
    findAll(){
        return axios.get(URL_BASE);
    }

    findById(idUsuario: number){
        return axios.get(URL_BASE + '/' + idUsuario)
    }


    //Metodo para crear una nueva mascota
    create(usuario: object){
        return axios.post(URL_BASE, usuario);
    }

    //Metodo para actualizar un alrticulo existente
    update(idUsuario: number, usuario: object){
        return axios.put(URL_BASE + '/'+idUsuario, usuario)
    }

    //metodo para eliminar un articulo
    delete(idUsuario: number){
        return axios.delete(URL_BASE + '/' + idUsuario)
    }
}
//se exporta la clase 
export default new UsuarioService();