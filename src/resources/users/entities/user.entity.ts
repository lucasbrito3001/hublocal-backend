import { Company } from "src/resources/companies/entities/company.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    passwordHash: string

    @OneToMany(type => Company, company => company.user)
    companies: Company[]
}