import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "client" | "freelancer";
  image?: string | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "client" | "freelancer";
  public image?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("client", "freelancer"),
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

export default User;
