import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log('Inserted a User with id: ', this.id)
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed a User with id: ', this.id)
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated a User with id: ', this.id)
    }
}