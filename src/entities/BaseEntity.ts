import { CreateDateColumn, Entity, Timestamp, UpdateDateColumn } from "typeorm";

@Entity()
export class BaseEntity {

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

}