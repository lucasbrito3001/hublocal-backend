import { Location } from "src/resources/locations/entities/location.entity";
import { User } from "src/resources/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    website: string

    @Column({ unique: true })
    cnpj: string

    @ManyToOne(() => User, user => user.companies)
    user: User

    @OneToMany(() => Location, location => location.company)
    locations: Location[]

    constructor(name?: string, website?: string, cnpj?: string) {
        this.name = name
        this.website = website
        this.cnpj = cnpj
    }
}