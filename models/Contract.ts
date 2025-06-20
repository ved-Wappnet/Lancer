import { Model, DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';
import Bid from './Bid';
import User from './User';

class Contract extends Model {
  public id!: number;
  public bidId!: number;
  public clientId!: number;
  public freelancerId!: number;
  public terms!: string;
  public amount!: number;
  public status!: 'pending' | 'active' | 'completed' | 'cancelled' | 'payment_success';
  public paymentStatus!: 'pending' | 'on_hold' | 'completed';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Contract.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    bidId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: Bid, key: 'id' },
    },
    clientId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    freelancerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled', 'payment_success'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'on_hold', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'Contract',
    tableName: 'Contracts',
  }
);

Contract.belongsTo(Bid, { foreignKey: 'bidId', as: 'bid' });
Contract.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
Contract.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });

export default Contract;
