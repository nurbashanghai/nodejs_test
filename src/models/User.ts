import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {Exclude} from "class-transformer";

@Entity({
    name: 'users'
})
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'first_name'})
    firstName: string;

    @Column({name: 'last_name'})
    lastName: string;

    @Column({
        nullable: true
    })
    image: string;

    @Column({
        type: 'date',
        nullable: true,
        transformer: {
            from: value => {
                return value;
            },
            to: value => value
        }
    })
    birthdate: string;

    @Column({
        nullable: true
    })
    about: string;

    @Column()
    @Exclude()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        nullable: true
    })
    latitude: number;

    @Column({
        nullable: true
    })
    longitude: number;

}
