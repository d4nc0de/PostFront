import { User } from "./user.model";

export interface comment{
    id: number,
    content: string;
    createdBy: User;
}