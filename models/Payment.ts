import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/sequelize';

export interface PaymentAttributes {
  id: number;
  contractId: number;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'status' | 'stripePaymentIntentId' | 'stripeCustomerId' | 'createdAt' | 'updatedAt'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public contractId!: number;
  public amount!: number;
  public currency!: string;
  public status!: 'pending' | 'succeeded' | 'failed';
  public stripeSessionId!: string;
  public stripePaymentIntentId?: string;
  public stripeCustomerId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  contractId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'usd',
  },
  status: {
    type: DataTypes.ENUM('pending', 'succeeded', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  stripeSessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'Payments',
  modelName: 'Payment',
  timestamps: true,
});

export default Payment;
