import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../lib/sequelize";

interface BidAttributes {
  id: number;
  projectId: number;
  userId: number;
  amount: number;
  deliveryTime: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

interface BidCreationAttributes extends Optional<BidAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Bid extends Model<BidAttributes, BidCreationAttributes> implements BidAttributes {
  public id!: number;
  public projectId!: number;
  public userId!: number;
  public amount!: number;
  public deliveryTime!: number;
  public message?: string;
  public status!: 'pending' | 'accepted' | 'rejected';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Bid.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deliveryTime: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "bids",
    modelName: "Bid",
  }
);

import User from './User';

Bid.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Bid;
