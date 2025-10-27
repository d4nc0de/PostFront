import { comment } from "./comments.model";
import { User } from "./user.model";

export interface post{
    id: number,
    title: string;
    description: string;
    category: string;
    CreatedBy: User;
    comments: comment[]; 
}