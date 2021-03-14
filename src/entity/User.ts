import { Field, ObjectType } from "type-graphql";
import { Entity, Column, BaseEntity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm"; //comment this line for MongoDB
// import { ObjectIdColumn } from "typeorm"; //uncomment this line for MongoDB

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  constructor(email: string, password: string) {
    super();
    this.email = email;
    this.password = password;
    this.tokenVersion = 0;
  }

  @Field()
  // @ObjectIdColumn() //uncomment this line for MongoDB
  @PrimaryGeneratedColumn("uuid") //comment this line for MongoDB
  _id: string;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  /**
   * Increment this to invalidate tokens of the user
   */
  @Column("int", { default: 0 })
  tokenVersion: number;
}
