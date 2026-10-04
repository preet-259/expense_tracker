import { Entity, Column,PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';

//Payment Methods
export enum PaymentMethod {
    CASH = 'Cash',
    CARD = 'Card',
    UPI = 'UPI',
    BANK_TRANSFER = 'Bank Transfer',
    OTHER = 'Other',
}

@Entity('expenses')
export class Expense {
    @PrimaryGeneratedColumn()
    id! : number;

    @Column()
    title! : string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column({ type: 'date' })
    expense_date!: string;

    @Column({ type: 'enum', enum: PaymentMethod })
    payment_method!: PaymentMethod;

    @Column({ nullable: true })
    notes!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Category, { onDelete: 'RESTRICT' }) 
    @JoinColumn({ name: 'category_id' })
    category!: Category;



}