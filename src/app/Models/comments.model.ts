import { User } from "./user.model";

export interface comment{
    idp: number,
    id: number,
    content: string;
    createdBy: User;
    createdAt: Date;
    liked: boolean;
    authorizedDate: Date | null;
    authorizedBy: User | null;
}