import axios from "axios";
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
