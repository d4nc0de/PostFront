import { Copy } from "./copy.model";
import { User } from "./user.model";

export interface Prestamo {
    user: User;
    copia: Copy;
    fecha_prestamo: Date;
    fecha_devolucion: Date | null;
}