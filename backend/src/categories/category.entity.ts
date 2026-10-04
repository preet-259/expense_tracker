import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { User } from "../users/user.entity";


@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User | null;
}