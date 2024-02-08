import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Extract extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    date: Date

    @Column({type:'text'})
    category: string

    @Column({type:'varchar', length:100})
    title: string

    @Column('float')
    value: number

    @Column({type:'text'})
    proofTransaction: string

}