import {Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn} from "typeorm";
import User from "./User";

@Entity({
    name: 'posts'
})
export default class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(type => User, User => User, {cascade: true, eager: true})
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column()
    created_at: string

    @Column()
    updated_at: string

    likesCount: number;

}
