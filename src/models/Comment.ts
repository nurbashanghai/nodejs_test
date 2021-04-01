import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import User from "./User";
import Post from "./Post";

@Entity({
    name: 'comments'
})
export default class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(type => User, User => User, {cascade: true, eager: true})
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(type => Post, Post => Post, {cascade: true, eager: true})
    @JoinColumn({name: 'post_id'})
    post: Post;

}
