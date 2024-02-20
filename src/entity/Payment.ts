import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()   
    name: string

    @Column()
    description: string

    @Column()
    category: string

    @Column()
    value: number

    @Column()
    status: string


}