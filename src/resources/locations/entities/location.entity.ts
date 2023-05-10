import { Company } from "src/resources/companies/entities/company.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    zipCode: string

    @Column()
    street: string

    @Column()
    number: number

    @Column()
    district: string

    @Column()
    city: string

    @Column()
    state: string

    @ManyToOne(() => Company, company => company.locations)
    company: Company
}