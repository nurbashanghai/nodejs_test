import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "./User";
import Post from "./Post";

@Entity({
    name: 'likes'
})
export default class Like {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @ManyToOne(type => User, User => User, {cascade: true, eager: true})
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column()
    target_id: number;

}
