import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from 'src/roles/enums/role.enum';

import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { saltOrRounds } from '../constants/hash';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const password = createUserDto.password;
    createUserDto.password = await bcrypt.hash(password, saltOrRounds);

    //make email insensitivecase
    createUserDto.email = createUserDto.email.toLowerCase();

    let createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(
    filter: any = {},
    projection: any = {},
    session: mongoose.ClientSession | null = null,
  ): Promise<User> {
    return await this.userModel.findOne(filter, projection).session(session);
  }

  async findOneEmail(
    email: string,
    projection: any = {},
    session: mongoose.ClientSession | null = null,
  ): Promise<User> {
    const user = await this.findOne({ email: email }, projection, session);
    return user;
  }

  async findOneId(
    id: Types.ObjectId,
    projection: any = {},
    session: mongoose.ClientSession | null = null,
  ): Promise<User> {
    return await this.findOne({ _id: id }, projection, session);
  }

  async getProfile(userId: Types.ObjectId) {
    // for trigger build as per tantawit's order
    const user = await this.findOneId(userId);
    return user;
  }

  async getDentist(): Promise<User[]> {
    return await this.userModel.find({ roles: Role.Dentist });
  }
}
