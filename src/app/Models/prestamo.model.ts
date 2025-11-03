import { Copy } from "./copy.model";

export interface Prestamo {
    user_id: number;
    copia: Copy;
    fecha_prestamo: Date;
    fecha_devolucion: Date;
}